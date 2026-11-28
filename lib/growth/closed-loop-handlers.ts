import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import {
  checkSlidingWindowRateLimit,
  extractClientIp,
  isCrossOriginRequest,
  verifySecretToken,
} from "@/lib/growth/route-security";
import {
  ensureClosedLoopDataStores,
  importRawGscJson,
  normalizePagePath,
  readClosedLoopRevenueStore,
  readGscPerformanceStore,
  readSeoOverridesStore,
  recordLeadSmartConversion,
  recordSiteIntent,
  runSiteAutoOptimizer,
  saveGscPerformanceMetrics,
  type GscPageMetric,
} from "@/lib/growth/closed-loop-store";
import { GoogleSearchConsoleService, sanitizeErrorText } from "@/lib/services/gsc";

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

const intentRateBuckets = new Map<string, number[]>();
const dashboardActionRateBuckets = new Map<string, number[]>();

export interface ClosedLoopHandlerOptions {
  rootDir?: string;
  env?: NodeJS.ProcessEnv;
  now?: () => number;
  rateLimitMap?: Map<string, number[]>;
  skipRevalidate?: boolean;
  createGscService?: () => Pick<
    GoogleSearchConsoleService,
    "isConfigured" | "fetchSearchAnalytics"
  >;
}

function safeRevalidate(paths: string[], skip?: boolean): void {
  if (skip) return;
  for (const p of paths) {
    try {
      revalidatePath(p);
    } catch {
      // Ignore outside Next.js request context (e.g., unit tests)
    }
  }
}

/**
 * Extracts Leads Smart conversion parameters from JSON body, form-urlencoded
 * body, or URL query parameters (supporting both GET postbacks and POST webhooks).
 */
async function parseLeadSmartPayload(
  req: NextRequest
): Promise<{ ok: true; data: Record<string, unknown> } | { ok: false; error: string }> {
  const params = req.nextUrl.searchParams;
  const fromQuery: Record<string, unknown> = {};
  for (const [key, value] of params.entries()) {
    if (key.toLowerCase() !== "token") {
      fromQuery[key] = value;
    }
  }

  if (req.method === "GET") {
    return { ok: true, data: fromQuery };
  }

  let rawText = "";
  try {
    rawText = await req.text();
  } catch {
    return { ok: true, data: fromQuery };
  }

  if (!rawText.trim()) {
    return { ok: true, data: fromQuery };
  }

  const contentType = (req.headers.get("content-type") ?? "").toLowerCase();
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const formParams = new URLSearchParams(rawText);
    const merged: Record<string, unknown> = { ...fromQuery };
    for (const [k, v] of formParams.entries()) {
      if (k.toLowerCase() !== "token") merged[k] = v;
    }
    return { ok: true, data: merged };
  }

  try {
    const parsed = JSON.parse(rawText);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return { ok: false, error: "Invalid JSON payload." };
    }
    return {
      ok: true,
      data: { ...fromQuery, ...(parsed as Record<string, unknown>) },
    };
  } catch {
    return { ok: false, error: "Invalid JSON payload." };
  }
}

/**
 * 1. Leads Smart Webhook (`GET` & `POST /api/webhooks/leadsmart?token=...`)
 * Protected by `LEADSMART_WEBHOOK_SECRET`.
 */
export async function handleLeadSmartWebhook(
  req: NextRequest,
  options: ClosedLoopHandlerOptions = {}
): Promise<NextResponse> {
  const auth = verifySecretToken(req, "LEADSMART_WEBHOOK_SECRET", {
    customHeader: "x-leadsmart-secret",
    env: options.env,
  });
  if (!auth.ok) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.status ?? 401, headers: NO_STORE_HEADERS }
    );
  }

  ensureClosedLoopDataStores(options.rootDir);

  const parsed = await parseLeadSmartPayload(req);
  if (!parsed.ok) {
    return NextResponse.json(
      { success: false, error: parsed.error },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const body = parsed.data;
  const rawTypeValue = body.type ?? body.lead_type ?? body.channel;
  const rawType =
    typeof rawTypeValue === "string" ? rawTypeValue.trim().toLowerCase() : "";
  if (rawType !== "call" && rawType !== "form") {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid conversion type. Expected 'call' or 'form'.",
      },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const rawPayout = body.payout ?? body.amount ?? body.price ?? body.revenue ?? 0;
  const payoutNum = Number(rawPayout);
  if (!Number.isFinite(payoutNum) || payoutNum < 0 || payoutNum > 100_000) {
    return NextResponse.json(
      {
        success: false,
        error: "Invalid payout amount. Must be a non-negative number.",
      },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const { store, entry } = recordLeadSmartConversion(
    {
      type: rawType,
      payout: payoutNum,
      status: typeof body.status === "string" ? body.status : "sold",
      city: typeof body.city === "string" ? body.city : "Houston",
      service:
        typeof body.service === "string" ? body.service : "Emergency Plumbing",
      page: typeof body.page === "string" ? body.page : undefined,
      source: "leadsmart_webhook",
    },
    options.rootDir
  );

  safeRevalidate(["/growth", "/"], options.skipRevalidate);

  return NextResponse.json(
    {
      success: true,
      method: req.method,
      entry,
      summary: {
        qualifiedLeads: store.qualifiedLeads,
        revenue: store.revenue,
        soldCalls: store.soldCalls,
        soldForms: store.soldForms,
      },
    },
    { status: 200, headers: NO_STORE_HEADERS }
  );
}

/**
 * 2. Site Call & Form Intent Tracker (`POST /api/track-intent`)
 * Logs zero-PII tel: click and quote form intents in `data/revenue-store.json`.
 */
export async function handleTrackIntent(
  req: NextRequest,
  options: ClosedLoopHandlerOptions = {}
): Promise<NextResponse> {
  if (isCrossOriginRequest(req)) {
    return NextResponse.json(
      { success: false, error: "Cross-origin intent tracking rejected." },
      { status: 403, headers: NO_STORE_HEADERS }
    );
  }

  const nowMs = (options.now ?? Date.now)();
  const rate = checkSlidingWindowRateLimit({
    key: extractClientIp(req),
    nowMs,
    windowMs: 60_000,
    maxRequests: 30,
    buckets: options.rateLimitMap ?? intentRateBuckets,
  });

  if (!rate.allowed) {
    return NextResponse.json(
      { success: false, error: "Rate limit exceeded for intent tracking." },
      {
        status: 429,
        headers: {
          ...NO_STORE_HEADERS,
          "Retry-After": String(rate.retryAfterSeconds),
        },
      }
    );
  }

  let body: Record<string, unknown>;
  try {
    body = (await req.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON payload." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const rawType = typeof body.type === "string" ? body.type.trim().toLowerCase() : "";
  if (rawType !== "call" && rawType !== "form") {
    return NextResponse.json(
      { success: false, error: "Expected type 'call' or 'form'." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  const { store, entry } = recordSiteIntent(
    {
      type: rawType,
      city: typeof body.city === "string" ? body.city : undefined,
      service: typeof body.service === "string" ? body.service : undefined,
      page: typeof body.page === "string" ? body.page : "/",
      event: typeof body.event === "string" ? body.event : undefined,
    },
    options.rootDir
  );

  return NextResponse.json(
    {
      success: true,
      entry,
      intents: {
        callIntents: store.callIntents,
        formIntents: store.formIntents,
      },
    },
    { status: 200, headers: NO_STORE_HEADERS }
  );
}

/**
 * 3. Google Search Console Sync (`POST /api/sync/gsc` & `GET /api/sync/gsc`)
 * Authenticated with `GSC_SYNC_SECRET`. Accepts pushed metrics OR pulls live
 * from GSC API when `GSC_CLIENT_EMAIL` & `GSC_PRIVATE_KEY` are configured.
 */
export async function handleGscSyncGet(
  req: NextRequest,
  options: ClosedLoopHandlerOptions = {}
): Promise<NextResponse> {
  const auth = verifySecretToken(req, "GSC_SYNC_SECRET", {
    customHeader: "x-gsc-sync-secret",
    env: options.env,
  });
  if (!auth.ok) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.status ?? 401, headers: NO_STORE_HEADERS }
    );
  }

  const store = readGscPerformanceStore(options.rootDir);
  return NextResponse.json(
    { success: true, data: store },
    { status: 200, headers: NO_STORE_HEADERS }
  );
}

export async function handleGscSyncPost(
  req: NextRequest,
  options: ClosedLoopHandlerOptions = {}
): Promise<NextResponse> {
  const auth = verifySecretToken(req, "GSC_SYNC_SECRET", {
    customHeader: "x-gsc-sync-secret",
    env: options.env,
  });
  if (!auth.ok) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.status ?? 401, headers: NO_STORE_HEADERS }
    );
  }

  let body: Record<string, unknown> = {};
  try {
    const rawText = await req.text();
    if (rawText.trim()) {
      body = JSON.parse(rawText) as Record<string, unknown>;
    }
  } catch {
    return NextResponse.json(
      { success: false, error: "Invalid JSON body." },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  }

  // Path A: Accept pushed GSC performance metrics (single record or `pages` / `rows` array)
  const incomingList = Array.isArray(body.pages)
    ? body.pages
    : Array.isArray(body.rows)
      ? body.rows
      : typeof body.page === "string"
        ? [body]
        : null;

  if (incomingList && incomingList.length > 0) {
    const normalizedItems = incomingList
      .filter((item): item is Record<string, unknown> => Boolean(item && typeof item === "object"))
      .map((item) => ({
        page: String(item.page ?? ""),
        topQuery:
          typeof item.topQuery === "string"
            ? item.topQuery
            : typeof item.query === "string"
              ? item.query
              : "",
        clicks: Number(item.clicks ?? 0),
        impressions: Number(item.impressions ?? 0),
        ctr: item.ctr !== undefined ? Number(item.ctr) : undefined,
        position: Number(item.position ?? 0),
      }));

    const store = saveGscPerformanceMetrics(
      normalizedItems,
      "post_sync",
      options.rootDir,
      { mergeWithExisting: body.replace !== true }
    );

    safeRevalidate(["/growth"], options.skipRevalidate);

    return NextResponse.json(
      {
        success: true,
        mode: "post_sync",
        syncedPages: store.pages.length,
        data: store,
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  }

  // Path B: Fetch directly from Google Search Console API if credentials are configured
  const env = options.env ?? process.env;
  const createService =
    options.createGscService ??
    (() =>
      new GoogleSearchConsoleService({
        clientEmail: env.GSC_CLIENT_EMAIL,
        privateKey: env.GSC_PRIVATE_KEY,
        siteUrl: env.GSC_SITE_URL,
      }));

  try {
    const service = createService();
    if (!service.isConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error:
            "No GSC metrics provided in request body and GSC_CLIENT_EMAIL / GSC_PRIVATE_KEY are not configured.",
        },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const analytics = await service.fetchSearchAnalytics({ rowLimit: 500 });
    const byPage = new Map<
      string,
      {
        page: string;
        topQuery: string;
        topQueryImpressions: number;
        clicks: number;
        impressions: number;
        weightedPos: number;
      }
    >();

    for (const row of analytics.rows) {
      const pagePath = normalizePagePath(row.page);
      if (!pagePath) continue;
      const existing = byPage.get(pagePath);
      if (!existing) {
        byPage.set(pagePath, {
          page: pagePath,
          topQuery: row.query,
          topQueryImpressions: row.impressions,
          clicks: row.clicks,
          impressions: row.impressions,
          weightedPos: row.position * Math.max(1, row.impressions),
        });
      } else {
        existing.clicks += row.clicks;
        existing.impressions += row.impressions;
        existing.weightedPos += row.position * Math.max(1, row.impressions);
        if (row.impressions > existing.topQueryImpressions && row.query) {
          existing.topQuery = row.query;
          existing.topQueryImpressions = row.impressions;
        }
      }
    }

    const metrics: GscPageMetric[] = Array.from(byPage.values()).map((entry) => ({
      page: entry.page,
      topQuery: entry.topQuery,
      clicks: entry.clicks,
      impressions: entry.impressions,
      ctr:
        entry.impressions > 0
          ? Number(((entry.clicks / entry.impressions) * 100).toFixed(2))
          : 0,
      position:
        entry.impressions > 0
          ? Number((entry.weightedPos / entry.impressions).toFixed(1))
          : 0,
    }));

    const store = saveGscPerformanceMetrics(
      metrics,
      "google_search_console_api",
      options.rootDir
    );

    safeRevalidate(["/growth"], options.skipRevalidate);

    return NextResponse.json(
      {
        success: true,
        mode: "google_search_console_api",
        syncedPages: store.pages.length,
        data: store,
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (err) {
    const safeMsg =
      err instanceof Error
        ? sanitizeErrorText(err.message, 220)
        : "Unable to fetch live Google Search Console metrics.";
    return NextResponse.json(
      { success: false, error: safeMsg },
      { status: 502, headers: NO_STORE_HEADERS }
    );
  }
}

/**
 * 4. Auto-Optimization Endpoint (`POST /api/optimize-site`)
 * Protected by secret token (`GSC_SYNC_SECRET` or `LEADSMART_WEBHOOK_SECRET`).
 */
export async function handleOptimizeSitePost(
  req: NextRequest,
  options: ClosedLoopHandlerOptions = {}
): Promise<NextResponse> {
  const auth = verifySecretToken(
    req,
    ["OPTIMIZE_SITE_SECRET", "GSC_SYNC_SECRET", "LEADSMART_WEBHOOK_SECRET"],
    {
      customHeader: "x-optimize-secret",
      env: options.env,
    }
  );
  if (!auth.ok) {
    return NextResponse.json(
      { success: false, error: auth.error },
      { status: auth.status ?? 401, headers: NO_STORE_HEADERS }
    );
  }

  const result = runSiteAutoOptimizer(options.rootDir);

  safeRevalidate(
    ["/", "/growth", ...result.optimizedPages.map((p) => p.page)],
    options.skipRevalidate
  );

  return NextResponse.json(
    {
      success: true,
      optimizedPageCount: result.optimizedPageCount,
      trendingHighlight: result.overrides.trendingHighlight,
      overrides: result.overrides,
    },
    { status: 200, headers: NO_STORE_HEADERS }
  );
}

const SIMULATION_SCENARIOS = [
  {
    type: "call" as const,
    payout: 65,
    city: "Katy",
    service: "Sewer Line Repair",
    page: "/services/sewer-line-repair",
  },
  {
    type: "form" as const,
    payout: 45,
    city: "Cypress",
    service: "Leak Detection",
    page: "/services/leak-detection",
  },
  {
    type: "call" as const,
    payout: 80,
    city: "Houston",
    service: "Emergency Plumbing",
    page: "/services/emergency-plumbing",
  },
  {
    type: "form" as const,
    payout: 55,
    city: "Sugar Land",
    service: "Water Heater Repair",
    page: "/services/water-heater-repair",
  },
];

/**
 * 5A. Dashboard Closed-Loop State Reader (`GET /api/growth/closed-loop`)
 * Auto-initializes missing `data/*.json` files and returns unified state
 * reliably in both AI Studio Preview iframes and production.
 */
export async function handleDashboardClosedLoopGet(
  _req: NextRequest,
  options: ClosedLoopHandlerOptions = {}
): Promise<NextResponse> {
  try {
    const { revenueStore, gscStore, overrides } = ensureClosedLoopDataStores(
      options.rootDir
    );
    return NextResponse.json(
      {
        success: true,
        revenueStore,
        gscStore,
        overrides,
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  } catch (err) {
    const safeMsg =
      err instanceof Error
        ? sanitizeErrorText(err.message, 220)
        : "Unable to load closed-loop dashboard stores.";
    return NextResponse.json(
      { success: false, error: safeMsg },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  }
}

/**
 * 5B. Dashboard Control Route (`POST /api/growth/closed-loop`)
 * Powers "Simulate Test Lead", "Run Auto-Optimizer Now", and "Import Real GSC JSON"
 * without failing inside iframe/AI Studio preview proxies, while external webhook
 * and sync routes remain protected by `LEADSMART_WEBHOOK_SECRET` & `GSC_SYNC_SECRET`.
 */
export async function handleDashboardClosedLoopAction(
  req: NextRequest,
  options: ClosedLoopHandlerOptions = {}
): Promise<NextResponse> {
  try {
    const nowMs = (options.now ?? Date.now)();
    const rate = checkSlidingWindowRateLimit({
      key: extractClientIp(req),
      nowMs,
      windowMs: 60_000,
      maxRequests: 30,
      buckets: options.rateLimitMap ?? dashboardActionRateBuckets,
    });

    if (!rate.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: `Too many dashboard actions. Wait ${rate.retryAfterSeconds}s and retry.`,
        },
        {
          status: 429,
          headers: {
            ...NO_STORE_HEADERS,
            "Retry-After": String(rate.retryAfterSeconds),
          },
        }
      );
    }

    // Ensure data/ directory and JSON stores exist with valid JSON before mutating
    ensureClosedLoopDataStores(options.rootDir);

    let body: Record<string, unknown>;
    try {
      const rawText = await req.text();
      body = rawText.trim()
        ? (JSON.parse(rawText) as Record<string, unknown>)
        : {};
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON payload." },
        { status: 400, headers: NO_STORE_HEADERS }
      );
    }

    const action = typeof body.action === "string" ? body.action.trim() : "";

    if (action === "simulate_lead") {
      const existing = readClosedLoopRevenueStore(options.rootDir);
      const scenario =
        SIMULATION_SCENARIOS[
          existing.qualifiedLeads % SIMULATION_SCENARIOS.length
        ];

      const preferredChannel =
        body.channel === "call" || body.channel === "form"
          ? body.channel
          : scenario.type;

      const { store, entry } = recordLeadSmartConversion(
        {
          type: preferredChannel,
          payout: scenario.payout,
          status: "sold",
          city: scenario.city,
          service: scenario.service,
          page: scenario.page,
          source: "dashboard_simulation",
          incrementIntent: true,
        },
        options.rootDir
      );

      const overrides = readSeoOverridesStore(options.rootDir);
      const gscStore = readGscPerformanceStore(options.rootDir);

      safeRevalidate(["/growth", "/"], options.skipRevalidate);

      return NextResponse.json(
        {
          success: true,
          action: "simulate_lead",
          message: `Simulated ${preferredChannel === "call" ? "Sold Call" : "Sold Form"} (+$${scenario.payout.toFixed(2)}) for ${scenario.service} in ${scenario.city}.`,
          entry,
          revenueStore: store,
          gscStore,
          overrides,
        },
        { status: 200, headers: NO_STORE_HEADERS }
      );
    }

    if (action === "run_optimizer") {
      const result = runSiteAutoOptimizer(options.rootDir);

      safeRevalidate(
        ["/", "/growth", ...result.optimizedPages.map((p) => p.page)],
        options.skipRevalidate
      );

      const highlightNote = result.overrides.trendingHighlight
        ? ` Homepage highlight set to "${result.overrides.trendingHighlight.badgeText}".`
        : "";

      return NextResponse.json(
        {
          success: true,
          action: "run_optimizer",
          message: `Auto-optimizer updated ${result.optimizedPageCount} low-CTR ${
            result.optimizedPageCount === 1 ? "page" : "pages"
          } in data/seo-overrides.json.${highlightNote}`,
          revenueStore: result.revenueStore,
          gscStore: result.gscStore,
          overrides: result.overrides,
        },
        { status: 200, headers: NO_STORE_HEADERS }
      );
    }

    if (action === "import_gsc") {
      let rawGscPayload: unknown = body.payload ?? body.data ?? body.rows ?? body.pages;
      if (typeof body.jsonText === "string") {
        if (body.jsonText.length > 500_000) {
          return NextResponse.json(
            {
              success: false,
              error: "Pasted GSC JSON exceeds the 500KB limit.",
            },
            { status: 400, headers: NO_STORE_HEADERS }
          );
        }
        try {
          rawGscPayload = JSON.parse(body.jsonText);
        } catch {
          return NextResponse.json(
            {
              success: false,
              error: "Invalid JSON syntax. Please paste valid Google Search Console JSON.",
            },
            { status: 400, headers: NO_STORE_HEADERS }
          );
        }
      }

      try {
        const imported = importRawGscJson(rawGscPayload, options.rootDir, {
          replace: body.replace === true,
        });
        const revenueStore = readClosedLoopRevenueStore(options.rootDir);
        const overrides = readSeoOverridesStore(options.rootDir);

        safeRevalidate(["/growth", "/"], options.skipRevalidate);

        return NextResponse.json(
          {
            success: true,
            action: "import_gsc",
            importedRowCount: imported.importedRowCount,
            opportunitiesUpdated: imported.opportunitiesUpdated,
            message: `Imported ${imported.importedRowCount} Search Console ${
              imported.importedRowCount === 1 ? "page" : "pages"
            } (${imported.store.totals.impressions.toLocaleString("en-US")} total impressions, ${imported.store.totals.avgCtr.toFixed(2)}% avg CTR) into data/gsc-store.json.${
              imported.opportunitiesUpdated
                ? " Top low-CTR opportunities refreshed."
                : ""
            }`,
            revenueStore,
            gscStore: imported.store,
            overrides,
          },
          { status: 200, headers: NO_STORE_HEADERS }
        );
      } catch (importErr) {
        const safeMsg =
          importErr instanceof Error
            ? sanitizeErrorText(importErr.message, 220)
            : "Could not parse GSC JSON rows.";
        return NextResponse.json(
          { success: false, error: safeMsg },
          { status: 400, headers: NO_STORE_HEADERS }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        error:
          "Unknown action. Expected 'simulate_lead', 'run_optimizer', or 'import_gsc'.",
      },
      { status: 400, headers: NO_STORE_HEADERS }
    );
  } catch (err) {
    const safeMsg =
      err instanceof Error
        ? sanitizeErrorText(err.message, 240)
        : "Unexpected server error processing closed-loop action.";
    return NextResponse.json(
      {
        success: false,
        error: safeMsg,
      },
      { status: 200, headers: NO_STORE_HEADERS }
    );
  }
}
