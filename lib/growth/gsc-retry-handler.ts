import { NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_GSC_SITE_URL,
  GoogleSearchConsoleService,
  readGscErrorReport,
  sanitizeErrorText,
  writeGscErrorReport,
  type FetchAndStoreResult,
  type GscErrorReportStore,
  type GscErrorReportTargetOptions,
} from "@/lib/services/gsc";
import { sanitizeClientErrorReport } from "@/lib/growth/system-health";

export interface GscRetryResponseBody {
  success: boolean;
  status: "LIVE" | "NOT_CONFIGURED" | "ERROR" | "RATE_LIMITED";
  configured: boolean;
  retriedAt: string;
  queriesFound: number;
  message: string;
  report: GscErrorReportStore | null;
}

export interface GscRetryHandlerDeps {
  createService?: () => Pick<
    GoogleSearchConsoleService,
    "isConfigured" | "fetchAndStoreTopLowCtrQueries"
  >;
  readErrorReport?: (
    options?: GscErrorReportTargetOptions
  ) => GscErrorReportStore | null;
  storePath?: string;
  errorReportPath?: string;
  allowedBaseDir?: string;
  now?: () => number;
  maxRetriesPerWindow?: number;
  windowMs?: number;
  rateLimitMap?: Map<string, number[]>;
}

const DEFAULT_WINDOW_MS = 60_000;
const DEFAULT_MAX_RETRIES_PER_WINDOW = 6;
const defaultRateLimitBuckets = new Map<string, number[]>();

const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, max-age=0",
};

function extractClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const first = forwarded.split(",")[0]?.trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;
  return "local";
}

function isCrossOriginRequest(req: NextRequest): boolean {
  const originHeader = req.headers.get("origin");
  if (!originHeader) return false;

  const expectedHost =
    req.headers.get("x-forwarded-host") || req.headers.get("host");
  if (!expectedHost) return false;

  try {
    const parsedOrigin = new URL(originHeader);
    return parsedOrigin.host.toLowerCase() !== expectedHost.trim().toLowerCase();
  } catch {
    return true;
  }
}

function checkRateLimit(params: {
  key: string;
  nowMs: number;
  windowMs: number;
  maxRequests: number;
  buckets: Map<string, number[]>;
}): { allowed: boolean; retryAfterSeconds: number } {
  const cutoff = params.nowMs - params.windowMs;
  const existing = (params.buckets.get(params.key) ?? []).filter(
    (ts) => ts > cutoff
  );

  if (existing.length >= params.maxRequests) {
    const oldest = existing[0] ?? params.nowMs;
    const retryAfterMs = Math.max(1000, oldest + params.windowMs - params.nowMs);
    params.buckets.set(params.key, existing);
    return {
      allowed: false,
      retryAfterSeconds: Math.ceil(retryAfterMs / 1000),
    };
  }

  existing.push(params.nowMs);
  params.buckets.set(params.key, existing);

  // Prevent unbounded memory growth across long-running processes
  if (params.buckets.size > 500) {
    for (const [bucketKey, timestamps] of params.buckets.entries()) {
      const fresh = timestamps.filter((ts) => ts > cutoff);
      if (fresh.length === 0) {
        params.buckets.delete(bucketKey);
      } else {
        params.buckets.set(bucketKey, fresh);
      }
    }
  }

  return { allowed: true, retryAfterSeconds: 0 };
}

export function resetGscRetryRateLimitStore(): void {
  defaultRateLimitBuckets.clear();
}

export async function handleGetGscHealth(
  deps: GscRetryHandlerDeps = {}
): Promise<NextResponse> {
  const createService =
    deps.createService ?? (() => new GoogleSearchConsoleService());
  const readReport = deps.readErrorReport ?? readGscErrorReport;

  let configured = Boolean(
    process.env.GSC_CLIENT_EMAIL && process.env.GSC_PRIVATE_KEY
  );
  let configError: string | undefined;
  try {
    const service = createService();
    configured = service.isConfigured();
  } catch (err) {
    configError =
      err instanceof Error
        ? sanitizeErrorText(err.message, 220)
        : "Invalid Google Search Console configuration.";
  }

  const report = sanitizeClientErrorReport(
    readReport({
      errorReportPath: deps.errorReportPath,
      allowedBaseDir: deps.allowedBaseDir,
    })
  );

  return NextResponse.json(
    {
      configured,
      ...(configError ? { configError } : {}),
      checkedAt: new Date((deps.now ?? Date.now)()).toISOString(),
      report,
    },
    { status: 200, headers: NO_STORE_HEADERS }
  );
}

export async function handlePostGscManualRetry(
  req: NextRequest,
  deps: GscRetryHandlerDeps = {}
): Promise<NextResponse> {
  if (isCrossOriginRequest(req)) {
    return NextResponse.json(
      {
        success: false,
        status: "ERROR",
        message: "Cross-origin retry requests are not permitted.",
      },
      { status: 403, headers: NO_STORE_HEADERS }
    );
  }

  const nowMs = (deps.now ?? Date.now)();
  const retriedAt = new Date(nowMs).toISOString();
  const readReport = deps.readErrorReport ?? readGscErrorReport;
  const createService =
    deps.createService ?? (() => new GoogleSearchConsoleService());

  const rateResult = checkRateLimit({
    key: extractClientIp(req),
    nowMs,
    windowMs: deps.windowMs ?? DEFAULT_WINDOW_MS,
    maxRequests: deps.maxRetriesPerWindow ?? DEFAULT_MAX_RETRIES_PER_WINDOW,
    buckets: deps.rateLimitMap ?? defaultRateLimitBuckets,
  });

  if (!rateResult.allowed) {
    let configured = Boolean(
      process.env.GSC_CLIENT_EMAIL && process.env.GSC_PRIVATE_KEY
    );
    try {
      configured = createService().isConfigured();
    } catch {
      // Fall back to env presence check when rate-limited
    }
    const currentReport = sanitizeClientErrorReport(
      readReport({
        errorReportPath: deps.errorReportPath,
        allowedBaseDir: deps.allowedBaseDir,
      })
    );
    const body: GscRetryResponseBody = {
      success: false,
      status: "RATE_LIMITED",
      configured,
      retriedAt,
      queriesFound: 0,
      message: `Too many manual retry attempts. Please wait ${rateResult.retryAfterSeconds}s before retrying again.`,
      report: currentReport,
    };
    return NextResponse.json(body, {
      status: 429,
      headers: {
        ...NO_STORE_HEADERS,
        "Retry-After": String(rateResult.retryAfterSeconds),
      },
    });
  }

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
        timestamp: retriedAt,
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
    const updatedReport = sanitizeClientErrorReport(
      readReport({
        errorReportPath: deps.errorReportPath,
        allowedBaseDir: deps.allowedBaseDir,
      })
    );
    const body: GscRetryResponseBody = {
      success: false,
      status: "ERROR",
      configured: Boolean(
        process.env.GSC_CLIENT_EMAIL && process.env.GSC_PRIVATE_KEY
      ),
      retriedAt,
      queriesFound: 0,
      message: safeError,
      report: updatedReport,
    };
    return NextResponse.json(body, { status: 200, headers: NO_STORE_HEADERS });
  }

  const configured = service.isConfigured();

  let fetchResult: FetchAndStoreResult;
  try {
    fetchResult = await service.fetchAndStoreTopLowCtrQueries({
      limit: 3,
      storePath: deps.storePath,
      errorReportPath: deps.errorReportPath,
      allowedBaseDir: deps.allowedBaseDir,
      writeErrorReport: true,
    });
  } catch (err) {
    const safeError =
      err instanceof Error
        ? sanitizeErrorText(err.message, 220)
        : "Unexpected error while retrying Google Search Console connection.";
    const updatedReport = sanitizeClientErrorReport(
      readReport({
        errorReportPath: deps.errorReportPath,
        allowedBaseDir: deps.allowedBaseDir,
      })
    );
    const body: GscRetryResponseBody = {
      success: false,
      status: "ERROR",
      configured,
      retriedAt,
      queriesFound: 0,
      message: safeError,
      report: updatedReport,
    };
    return NextResponse.json(body, { status: 200, headers: NO_STORE_HEADERS });
  }

  const updatedReport = sanitizeClientErrorReport(
    readReport({
      errorReportPath: deps.errorReportPath,
      allowedBaseDir: deps.allowedBaseDir,
    })
  );

  if (fetchResult.success) {
    const count = fetchResult.data.queries.length;
    const body: GscRetryResponseBody = {
      success: true,
      status: "LIVE",
      configured: true,
      retriedAt,
      queriesFound: count,
      message:
        count > 0
          ? `Connection verified — refreshed ${count} Search Console ${
              count === 1 ? "opportunity" : "opportunities"
            }.`
          : "Connection verified — Google Search Console API responded normally.",
      report: updatedReport,
    };
    return NextResponse.json(body, { status: 200, headers: NO_STORE_HEADERS });
  }

  if (fetchResult.status === "NOT_CONFIGURED") {
    const body: GscRetryResponseBody = {
      success: false,
      status: "NOT_CONFIGURED",
      configured: false,
      retriedAt,
      queriesFound: 0,
      message:
        "Google Search Console credentials (GSC_CLIENT_EMAIL and GSC_PRIVATE_KEY) are not configured on the server.",
      report: updatedReport,
    };
    return NextResponse.json(body, { status: 200, headers: NO_STORE_HEADERS });
  }

  const body: GscRetryResponseBody = {
    success: false,
    status: "ERROR",
    configured,
    retriedAt,
    queriesFound: 0,
    message: sanitizeErrorText(
      fetchResult.error ||
        "Google Search Console API retry failed. Error details were logged to content/growth/gsc-errors.json.",
      260
    ),
    report: updatedReport,
  };
  return NextResponse.json(body, { status: 200, headers: NO_STORE_HEADERS });
}
