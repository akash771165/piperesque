import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  handleGetGscHealth,
  handlePostGscManualRetry,
} from "@/lib/growth/gsc-retry-handler";
import {
  evaluateGscSystemHealth,
  formatHealthTimestamp,
  sanitizeClientErrorReport,
} from "@/lib/growth/system-health";
import {
  GoogleSearchConsoleService,
  readGscErrorReport,
  type GscErrorReportStore,
} from "@/lib/services/gsc";

const { privateKey: TEST_RSA_PRIVATE_KEY } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
  publicKeyEncoding: { type: "spki", format: "pem" },
});

const tempDirs: string[] = [];

function createTempDir(): string {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), "gsc-retry-test-"));
  tempDirs.push(dir);
  return dir;
}

afterEach(() => {
  for (const dir of tempDirs.splice(0, tempDirs.length)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

describe("System Health evaluator", () => {
  it("reports interrupted warning state when gsc-errors.json has DEGRADED status", () => {
    const report: GscErrorReportStore = {
      status: "DEGRADED",
      siteUrl: "https://www.piperesque.com/",
      lastUpdatedAt: "2026-11-27T21:30:00.000Z",
      totalErrorsRecorded: 2,
      consecutiveFailures: 2,
      lastError: {
        timestamp: "2026-11-27T21:30:00.000Z",
        stage: "search_analytics_fetch",
        code: "GSC_HTTP_ERROR",
        message: "Google Search Console API request failed (HTTP 503).",
        httpStatus: 503,
        endpoint: "https://searchconsole.googleapis.com/webmasters/v3/sites/test",
        siteUrl: "https://www.piperesque.com/",
        providerError: "UNAVAILABLE",
        providerErrorDescription: "Backend temporarily unavailable",
        retryable: true,
      },
      errors: [],
      auditNotice: "Sanitized error report.",
    };

    const vm = evaluateGscSystemHealth(report, true);
    expect(vm.state).toBe("interrupted");
    expect(vm.hasInterruptions).toBe(true);
    expect(vm.isSevere).toBe(false);
    expect(vm.consecutiveFailures).toBe(2);
    expect(vm.lastErrorStageLabel).toBe("Search Analytics API");
    expect(vm.formattedLastErrorAt).toBe("2026-11-27 21:30 UTC");
    expect(vm.retryable).toBe(true);
  });

  it("flags severe interruption for non-retryable auth failures", () => {
    const report: GscErrorReportStore = {
      status: "DEGRADED",
      siteUrl: "https://www.piperesque.com/",
      lastUpdatedAt: "2026-11-27T21:35:00.000Z",
      totalErrorsRecorded: 1,
      consecutiveFailures: 1,
      lastError: {
        timestamp: "2026-11-27T21:35:00.000Z",
        stage: "oauth_token_exchange",
        code: "OAUTH_HTTP_ERROR",
        message: "Google OAuth token exchange failed (HTTP 400) (invalid_grant).",
        httpStatus: 400,
        endpoint: "https://oauth2.googleapis.com/token",
        siteUrl: "https://www.piperesque.com/",
        providerError: "invalid_grant",
        providerErrorDescription: "Invalid JWT Signature.",
        retryable: false,
      },
      errors: [],
      auditNotice: "Sanitized error report.",
    };

    const vm = evaluateGscSystemHealth(report, true);
    expect(vm.state).toBe("interrupted");
    expect(vm.isSevere).toBe(true);
    expect(vm.lastErrorStageLabel).toBe("OAuth Token Exchange");
  });

  it("reports healthy operational state when status is OK and zero active failures", () => {
    const report: GscErrorReportStore = {
      status: "OK",
      siteUrl: "https://www.piperesque.com/",
      lastUpdatedAt: "2026-11-27T21:40:00.000Z",
      totalErrorsRecorded: 3,
      consecutiveFailures: 0,
      lastError: null,
      errors: [],
      auditNotice: "Clean.",
    };

    const vm = evaluateGscSystemHealth(report, true);
    expect(vm.state).toBe("healthy");
    expect(vm.hasInterruptions).toBe(false);
    expect(vm.description).toContain("3 historical incidents resolved");
  });

  it("reports unconfigured state when credentials are absent and no active errors", () => {
    const vm = evaluateGscSystemHealth(null, false);
    expect(vm.state).toBe("unconfigured");
    expect(vm.hasInterruptions).toBe(false);
    expect(formatHealthTimestamp(null)).toBe("Never");
  });

  it("sanitizes any accidental sensitive strings in client reports", () => {
    const raw: GscErrorReportStore = {
      status: "DEGRADED",
      siteUrl: "https://www.piperesque.com/",
      lastUpdatedAt: "2026-11-27T21:40:00.000Z",
      totalErrorsRecorded: 1,
      consecutiveFailures: 1,
      lastError: {
        timestamp: "2026-11-27T21:40:00.000Z",
        stage: "oauth_token_exchange",
        code: "OAUTH_HTTP_ERROR",
        message: "Failed with Bearer ya29.secret_token_12345",
        httpStatus: 401,
        endpoint: "https://oauth2.googleapis.com/token",
        siteUrl: "https://www.piperesque.com/",
        providerError: "unauthorized",
        providerErrorDescription: "assertion=abc123secret",
        retryable: false,
      },
      errors: [],
      auditNotice: "Audit",
    };

    const sanitized = sanitizeClientErrorReport(raw);
    expect(sanitized?.lastError?.message).not.toContain("ya29.secret_token");
    expect(sanitized?.lastError?.providerErrorDescription).not.toContain(
      "abc123secret"
    );
  });
});

describe("GSC manual retry API handler", () => {
  it("records a DEGRADED error report on failed retry and recovers to OK on subsequent live retry", async () => {
    const tmpDir = createTempDir();
    const storePath = path.join(tmpDir, "gsc-opportunities.json");
    const errorReportPath = path.join(tmpDir, "gsc-errors.json");
    const rateLimitMap = new Map<string, number[]>();

    // 1. Failing retry (upstream 503)
    const failingFetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("oauth2.googleapis.com/token")) {
        return new Response(
          JSON.stringify({ access_token: "ya29.retry-test-token", expires_in: 3600 }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({
          error: {
            code: 503,
            status: "UNAVAILABLE",
            message: "Search Console backend temporarily unavailable",
          },
        }),
        { status: 503, headers: { "Content-Type": "application/json" } }
      );
    }) as unknown as typeof fetch;

    const req1 = new NextRequest("http://localhost:3000/api/growth/gsc-retry", {
      method: "POST",
      headers: {
        host: "localhost:3000",
        origin: "http://localhost:3000",
        "x-forwarded-for": "127.0.0.1",
      },
    });

    const failResponse = await handlePostGscManualRetry(req1, {
      createService: () =>
        new GoogleSearchConsoleService({
          clientEmail: "gsc-bot@example.iam.gserviceaccount.com",
          privateKey: TEST_RSA_PRIVATE_KEY,
          siteUrl: "https://www.piperesque.com/",
          fetchImpl: failingFetch,
          logger: { error: vi.fn(), warn: vi.fn() },
          errorReportPath,
          allowedBaseDir: tmpDir,
        }),
      storePath,
      errorReportPath,
      allowedBaseDir: tmpDir,
      rateLimitMap,
    });

    expect(failResponse.status).toBe(200);
    expect(failResponse.headers.get("cache-control")).toContain("no-store");
    const failJson = await failResponse.json();
    expect(failJson.success).toBe(false);
    expect(failJson.status).toBe("ERROR");
    expect(failJson.report?.status).toBe("DEGRADED");
    expect(failJson.report?.consecutiveFailures).toBe(1);
    expect(failJson.report?.lastError?.httpStatus).toBe(503);

    // Confirm persisted on disk
    const persistedAfterFail = readGscErrorReport({
      errorReportPath,
      allowedBaseDir: tmpDir,
    });
    expect(persistedAfterFail?.status).toBe("DEGRADED");

    // 2. Successful recovery retry
    const recoveringFetch = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("oauth2.googleapis.com/token")) {
        return new Response(
          JSON.stringify({ access_token: "ya29.retry-ok-token", expires_in: 3600 }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      return new Response(
        JSON.stringify({
          rows: [
            {
              keys: [
                "emergency plumber houston",
                "https://www.piperesque.com/services/emergency-plumbing",
              ],
              clicks: 5,
              impressions: 620,
              ctr: 5 / 620,
              position: 9.4,
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    }) as unknown as typeof fetch;

    const req2 = new NextRequest("http://localhost:3000/api/growth/gsc-retry", {
      method: "POST",
      headers: {
        host: "localhost:3000",
        origin: "http://localhost:3000",
        "x-forwarded-for": "127.0.0.1",
      },
    });

    const okResponse = await handlePostGscManualRetry(req2, {
      createService: () =>
        new GoogleSearchConsoleService({
          clientEmail: "gsc-bot@example.iam.gserviceaccount.com",
          privateKey: TEST_RSA_PRIVATE_KEY,
          siteUrl: "https://www.piperesque.com/",
          fetchImpl: recoveringFetch,
          logger: { error: vi.fn(), warn: vi.fn() },
          errorReportPath,
          allowedBaseDir: tmpDir,
        }),
      storePath,
      errorReportPath,
      allowedBaseDir: tmpDir,
      rateLimitMap,
    });

    expect(okResponse.status).toBe(200);
    const okJson = await okResponse.json();
    expect(okJson.success).toBe(true);
    expect(okJson.status).toBe("LIVE");
    expect(okJson.queriesFound).toBe(1);
    expect(okJson.report?.status).toBe("OK");
    expect(okJson.report?.consecutiveFailures).toBe(0);
    expect(okJson.report?.totalErrorsRecorded).toBe(1);
  });

  it("rejects cross-origin POST requests with HTTP 403", async () => {
    const req = new NextRequest("http://localhost:3000/api/growth/gsc-retry", {
      method: "POST",
      headers: {
        host: "localhost:3000",
        origin: "https://evil.example.com",
      },
    });

    const res = await handlePostGscManualRetry(req);
    expect(res.status).toBe(403);
  });

  it("enforces sliding-window rate limiting with HTTP 429 and Retry-After header", async () => {
    const tmpDir = createTempDir();
    const errorReportPath = path.join(tmpDir, "gsc-errors.json");
    const rateLimitMap = new Map<string, number[]>();
    const fixedNow = 1_764_300_000_000;

    const mockService = {
      isConfigured: () => false,
      fetchAndStoreTopLowCtrQueries: vi.fn(async () => ({
        success: false,
        status: "NOT_CONFIGURED" as const,
        storePath: path.join(tmpDir, "gsc-opportunities.json"),
        written: false,
        data: {
          status: "NOT_CONFIGURED" as const,
          source: "none" as const,
          siteUrl: "https://www.piperesque.com/",
          updatedAt: null,
          dateRange: { startDate: null, endDate: null },
          asOfDate: null,
          totalQueriesAnalyzed: 0,
          topLimit: 3,
          criteria: {
            primaryMinImpressions: 100,
            primaryMaxCtr: 0.02,
            fallbackMinImpressions: 10,
            fallbackMaxCtr: 0.03,
          },
          queries: [],
          auditNotice: "Not configured",
        },
      })),
    };

    for (let i = 0; i < 2; i++) {
      const req = new NextRequest("http://localhost:3000/api/growth/gsc-retry", {
        method: "POST",
        headers: { "x-forwarded-for": "10.0.0.5" },
      });
      const res = await handlePostGscManualRetry(req, {
        createService: () => mockService,
        errorReportPath,
        allowedBaseDir: tmpDir,
        now: () => fixedNow + i * 1000,
        maxRetriesPerWindow: 2,
        windowMs: 60_000,
        rateLimitMap,
      });
      expect(res.status).toBe(200);
    }

    const blockedReq = new NextRequest(
      "http://localhost:3000/api/growth/gsc-retry",
      {
        method: "POST",
        headers: { "x-forwarded-for": "10.0.0.5" },
      }
    );
    const blockedRes = await handlePostGscManualRetry(blockedReq, {
      createService: () => mockService,
      errorReportPath,
      allowedBaseDir: tmpDir,
      now: () => fixedNow + 2000,
      maxRetriesPerWindow: 2,
      windowMs: 60_000,
      rateLimitMap,
    });

    expect(blockedRes.status).toBe(429);
    expect(Number(blockedRes.headers.get("retry-after"))).toBeGreaterThan(0);
    const blockedJson = await blockedRes.json();
    expect(blockedJson.status).toBe("RATE_LIMITED");
  });

  it("returns sanitized persisted report on GET /api/growth/gsc-retry", async () => {
    const tmpDir = createTempDir();
    const errorReportPath = path.join(tmpDir, "gsc-errors.json");
    fs.writeFileSync(
      errorReportPath,
      JSON.stringify({
        status: "OK",
        siteUrl: "https://www.piperesque.com/",
        lastUpdatedAt: "2026-11-27T21:00:00.000Z",
        totalErrorsRecorded: 0,
        consecutiveFailures: 0,
        lastError: null,
        errors: [],
        auditNotice: "Healthy",
      }),
      "utf-8"
    );

    const res = await handleGetGscHealth({
      createService: () => ({
        isConfigured: () => true,
        fetchAndStoreTopLowCtrQueries: vi.fn(),
      }),
      errorReportPath,
      allowedBaseDir: tmpDir,
    });

    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toContain("no-store");
    const json = await res.json();
    expect(json.configured).toBe(true);
    expect(json.report?.status).toBe("OK");
  });

  it("catches invalid service configuration errors without HTTP 500 and logs them to gsc-errors.json", async () => {
    const tmpDir = createTempDir();
    const errorReportPath = path.join(tmpDir, "gsc-errors.json");
    const rateLimitMap = new Map<string, number[]>();

    const req = new NextRequest("http://localhost:3000/api/growth/gsc-retry", {
      method: "POST",
      headers: {
        host: "localhost:3000",
        origin: "http://localhost:3000",
        "x-forwarded-for": "127.0.0.1",
      },
    });

    const res = await handlePostGscManualRetry(req, {
      createService: () => {
        throw new Error("Invalid GSC_SITE_URL format. Must be a valid HTTPS URL.");
      },
      errorReportPath,
      allowedBaseDir: tmpDir,
      rateLimitMap,
    });

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.success).toBe(false);
    expect(json.status).toBe("ERROR");
    expect(json.message).toContain("Invalid GSC_SITE_URL format");
    expect(json.report?.status).toBe("DEGRADED");
    expect(json.report?.consecutiveFailures).toBe(1);
    expect(json.report?.lastError?.stage).toBe("configuration");
  });
});
