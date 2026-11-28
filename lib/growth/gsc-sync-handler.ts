import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_GSC_SITE_URL,
  DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH,
  GoogleSearchConsoleService,
  sanitizeErrorText,
  writeGscErrorReport,
  type FetchAndStoreResult,
} from "@/lib/services/gsc";
import {
  checkSlidingWindowRateLimit,
  extractClientIp,
  isCrossOriginRequest,
} from "@/lib/growth/route-security";

export interface GscManualSyncResponseBody {
  success: boolean;
  status: "LIVE" | "NOT_CONFIGURED" | "ERROR" | "RATE_LIMITED";
  configured: boolean;
  syncedAt: string;
  storeFile: string;
  written: boolean;
  asOfDate: string | null;
  queriesFound: number;
  totalQueriesAnalyzed: number;
  message: string;
}

export interface GscManualSyncHandlerDeps {
  createService?: () => Pick<
    GoogleSearchConsoleService,
    "isConfigured" | "fetchAndStoreTopLowCtrQueries"
  >;
  storePath?: string;
  errorReportPath?: string;
  allowedBaseDir?: string;
  now?: () => number;
  maxSyncsPerWindow?: number;
  windowMs?: number;
  rateLimitMap?: Map<string, number[]>;
}

const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX_SYNCS_PER_WINDOW = 6;
const defaultSyncRateLimitBuckets = new Map<string, number[]>();

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

export function resetGscSyncRateLimitStore(): void {
  defaultSyncRateLimitBuckets.clear();
}

async function parseSyncLimit(req: NextRequest): Promise<number> {
  try {
    const contentType = req.headers.get("content-type") ?? "";
    if (!contentType.toLowerCase().includes("application/json")) {
      return 3;
    }
    const rawText = await req.text();
    if (!rawText.trim()) {
      return 3;
    }
    const parsed = JSON.parse(rawText) as { limit?: unknown };
    if (typeof parsed?.limit === "number" && Number.isFinite(parsed.limit)) {
      return Math.min(Math.max(1, Math.floor(parsed.limit)), 10);
    }
  } catch {
    // Gracefully fall back to the default top-3 opportunity limit on malformed/empty JSON
  }
  return 3;
}

export async function handlePostGscManualSync(
  req: NextRequest,
  deps: GscManualSyncHandlerDeps = {}
): Promise<NextResponse> {
  if (isCrossOriginRequest(req)) {
    return NextResponse.json(
      {
        success: false,
        status: "ERROR",
        configured: false,
        syncedAt: new Date((deps.now ?? Date.now)()).toISOString(),
        storeFile: DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH,
        written: false,
        asOfDate: null,
        queriesFound: 0,
        totalQueriesAnalyzed: 0,
        message: "Cross-origin GSC sync requests are not permitted.",
      } satisfies GscManualSyncResponseBody,
      { status: 403, headers: NO_STORE_HEADERS }
    );
  }

  const nowMs = (deps.now ?? Date.now)();
  const syncedAt = new Date(nowMs).toISOString();
  const createService =
    deps.createService ?? (() => new GoogleSearchConsoleService());

  const rateResult = checkSlidingWindowRateLimit({
    key: extractClientIp(req),
    nowMs,
    windowMs: deps.windowMs ?? DEFAULT_WINDOW_MS,
    maxRequests: deps.maxSyncsPerWindow ?? DEFAULT_MAX_SYNCS_PER_WINDOW,
    buckets: deps.rateLimitMap ?? defaultSyncRateLimitBuckets,
  });

  if (!rateResult.allowed) {
    let configured = Boolean(
      process.env.GSC_CLIENT_EMAIL && process.env.GSC_PRIVATE_KEY
    );
    try {
      configured = createService().isConfigured();
    } catch {
      // Fall back to environment check if service validation throws while rate-limited
    }

    const body: GscManualSyncResponseBody = {
      success: false,
      status: "RATE_LIMITED",
      configured,
      syncedAt,
      storeFile: DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH,
      written: false,
      asOfDate: null,
      queriesFound: 0,
      totalQueriesAnalyzed: 0,
      message: `Too many manual GSC sync attempts. Please wait ${rateResult.retryAfterSeconds}s before syncing again.`,
    };
    return NextResponse.json(body, {
      status: 429,
      headers: {
        ...NO_STORE_HEADERS,
        "Retry-After": String(rateResult.retryAfterSeconds),
      },
    });
  }

  const limit = await parseSyncLimit(req);

  let service: Pick<
    GoogleSearchConsoleService,
    "isConfigured" | "fetchAndStoreTopLowCtrQueries"
  >;
  try {
    service = createService();
  } catch (err) {
    const safeError =
      err instanceof Error
        ? sanitizeErrorText(err.message, 220)
        : "Google Search Console service configuration error.";

    writeGscErrorReport(
      {
        timestamp: syncedAt,
        stage: "configuration",
        code: "UNKNOWN_ERROR",
        message: safeError,
        httpStatus: null,
        endpoint: "https://searchconsole.googleapis.com/webmasters/v3/sites",
        siteUrl: DEFAULT_GSC_SITE_URL,
        providerError: "INVALID_CONFIGURATION",
        providerErrorDescription: safeError,
        retryable: false,
      },
      {
        errorReportPath: deps.errorReportPath,
        allowedBaseDir: deps.allowedBaseDir,
      }
    );

    const body: GscManualSyncResponseBody = {
      success: false,
      status: "ERROR",
      configured: Boolean(
        process.env.GSC_CLIENT_EMAIL && process.env.GSC_PRIVATE_KEY
      ),
      syncedAt,
      storeFile: DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH,
      written: false,
      asOfDate: null,
      queriesFound: 0,
      totalQueriesAnalyzed: 0,
      message: safeError,
    };
    return NextResponse.json(body, { status: 200, headers: NO_STORE_HEADERS });
  }

  const configured = service.isConfigured();

  let fetchResult: FetchAndStoreResult;
  try {
    fetchResult = await service.fetchAndStoreTopLowCtrQueries({
      limit,
      storePath: deps.storePath,
      errorReportPath: deps.errorReportPath,
      allowedBaseDir: deps.allowedBaseDir,
      writeErrorReport: true,
    });
  } catch (err) {
    const safeError =
      err instanceof Error
        ? sanitizeErrorText(err.message, 220)
        : "Unexpected error while syncing Google Search Console opportunities.";
    const body: GscManualSyncResponseBody = {
      success: false,
      status: "ERROR",
      configured,
      syncedAt,
      storeFile: DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH,
      written: false,
      asOfDate: null,
      queriesFound: 0,
      totalQueriesAnalyzed: 0,
      message: safeError,
    };
    return NextResponse.json(body, { status: 200, headers: NO_STORE_HEADERS });
  }

  if (fetchResult.success) {
    const count = fetchResult.data.queries.length;
    const totalAnalyzed = fetchResult.data.totalQueriesAnalyzed;
    const body: GscManualSyncResponseBody = {
      success: true,
      status: "LIVE",
      configured: true,
      syncedAt: fetchResult.data.updatedAt ?? syncedAt,
      storeFile: DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH,
      written: fetchResult.written,
      asOfDate: fetchResult.data.asOfDate,
      queriesFound: count,
      totalQueriesAnalyzed: totalAnalyzed,
      message:
        count > 0
          ? `Synced ${count} high-impression / low-CTR ${
              count === 1 ? "query" : "queries"
            } (${totalAnalyzed} analyzed) into ${DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH}.`
          : `Search Console sync succeeded (${totalAnalyzed} queries analyzed); updated ${DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH}.`,
    };
    return NextResponse.json(body, { status: 200, headers: NO_STORE_HEADERS });
  }

  if (fetchResult.status === "NOT_CONFIGURED") {
    const body: GscManualSyncResponseBody = {
      success: false,
      status: "NOT_CONFIGURED",
      configured: false,
      syncedAt,
      storeFile: DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH,
      written: false,
      asOfDate: null,
      queriesFound: 0,
      totalQueriesAnalyzed: 0,
      message:
        "Google Search Console credentials (GSC_CLIENT_EMAIL and GSC_PRIVATE_KEY) are not configured on the server.",
    };
    return NextResponse.json(body, { status: 200, headers: NO_STORE_HEADERS });
  }

  const body: GscManualSyncResponseBody = {
    success: false,
    status: "ERROR",
    configured,
    syncedAt,
    storeFile: DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH,
    written: false,
    asOfDate: null,
    queriesFound: 0,
    totalQueriesAnalyzed: 0,
    message: sanitizeErrorText(
      fetchResult.error ||
        "Google Search Console API sync failed. Existing opportunities store was preserved and error details were written to content/growth/gsc-errors.json.",
      260
    ),
  };
  return NextResponse.json(body, { status: 200, headers: NO_STORE_HEADERS });
}
