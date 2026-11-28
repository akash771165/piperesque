import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import {
  handlePostGscManualSync,
  resetGscSyncRateLimitStore,
  type GscManualSyncResponseBody,
} from "@/lib/growth/gsc-sync-handler";
import {
  DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH,
  type FetchAndStoreResult,
} from "@/lib/services/gsc";

function makeRequest(options?: {
  origin?: string;
  host?: string;
  ip?: string;
  body?: unknown;
}): NextRequest {
  const headers = new Headers();
  headers.set("host", options?.host ?? "127.0.0.1:3000");
  if (options?.origin) {
    headers.set("origin", options.origin);
  }
  if (options?.ip) {
    headers.set("x-forwarded-for", options.ip);
  }
  if (options?.body !== undefined) {
    headers.set("content-type", "application/json");
  }

  return new NextRequest("http://127.0.0.1:3000/api/growth/gsc-sync", {
    method: "POST",
    headers,
    body: options?.body !== undefined ? JSON.stringify(options.body) : undefined,
  });
}

describe("POST /api/growth/gsc-sync handler", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gsc-sync-test-"));
    resetGscSyncRateLimitStore();
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it("pulls fresh GSC opportunities and reports written store metadata on success", async () => {
    const storePath = path.join(tmpDir, "gsc-opportunities.json");
    const errorReportPath = path.join(tmpDir, "gsc-errors.json");

    const fetchMock = vi.fn(
      async (): Promise<FetchAndStoreResult> => ({
        success: true,
        status: "LIVE",
        storePath,
        written: true,
        data: {
          status: "LIVE",
          source: "google_search_console_api",
          siteUrl: "https://www.piperesque.com/",
          updatedAt: "2026-11-28T07:05:00.000Z",
          dateRange: { startDate: "2026-10-28", endDate: "2026-11-25" },
          asOfDate: "2026-11-25",
          totalQueriesAnalyzed: 42,
          topLimit: 3,
          criteria: {
            primaryMinImpressions: 100,
            primaryMaxCtr: 0.02,
            fallbackMinImpressions: 10,
            fallbackMaxCtr: 0.03,
          },
          queries: [
            {
              query: "emergency slab leak repair houston",
              pagePath: "/services/leak-detection",
              impressions: 1450,
              clicks: 16,
              ctr: 0.011,
              formattedCtr: "1.10%",
              position: 9.2,
              formattedPosition: "#9.2",
              rankingTier: "Page 1",
            },
          ],
          auditNotice: "Live GSC telemetry.",
        },
        errorReportPath,
        errorReportWritten: false,
      })
    );

    const res = await handlePostGscManualSync(
      makeRequest({ origin: "http://127.0.0.1:3000", body: { limit: 3 } }),
      {
        storePath,
        errorReportPath,
        allowedBaseDir: tmpDir,
        createService: () => ({
          isConfigured: () => true,
          fetchAndStoreTopLowCtrQueries: fetchMock,
        }),
      }
    );

    expect(res.status).toBe(200);
    expect(res.headers.get("cache-control")).toBe("no-store, max-age=0");
    const json = (await res.json()) as GscManualSyncResponseBody;
    expect(json.success).toBe(true);
    expect(json.status).toBe("LIVE");
    expect(json.written).toBe(true);
    expect(json.storeFile).toBe(DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH);
    expect(json.queriesFound).toBe(1);
    expect(json.totalQueriesAnalyzed).toBe(42);
    expect(json.asOfDate).toBe("2026-11-25");
    expect(fetchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 3,
        storePath,
        errorReportPath,
        allowedBaseDir: tmpDir,
        writeErrorReport: true,
      })
    );
  });

  it("clamps requested limit and ignores untrusted path properties in request body", async () => {
    const storePath = path.join(tmpDir, "gsc-opportunities.json");
    const fetchMock = vi.fn(
      async (): Promise<FetchAndStoreResult> => ({
        success: false,
        status: "NOT_CONFIGURED",
        storePath,
        written: false,
        data: {
          status: "NOT_CONFIGURED",
          source: "none",
          siteUrl: "https://www.piperesque.com/",
          updatedAt: null,
          dateRange: { startDate: null, endDate: null },
          asOfDate: null,
          totalQueriesAnalyzed: 0,
          topLimit: 10,
          criteria: {
            primaryMinImpressions: 100,
            primaryMaxCtr: 0.02,
            fallbackMinImpressions: 10,
            fallbackMaxCtr: 0.03,
          },
          queries: [],
          auditNotice: "Unconfigured.",
        },
        error: "Missing credentials",
      })
    );

    const res = await handlePostGscManualSync(
      makeRequest({
        body: { limit: 999, storePath: "../../etc/passwd" },
      }),
      {
        storePath,
        allowedBaseDir: tmpDir,
        createService: () => ({
          isConfigured: () => false,
          fetchAndStoreTopLowCtrQueries: fetchMock,
        }),
      }
    );

    expect(res.status).toBe(200);
    const json = (await res.json()) as GscManualSyncResponseBody;
    expect(json.status).toBe("NOT_CONFIGURED");
    expect(json.written).toBe(false);
    expect(fetchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        limit: 10,
        storePath,
      })
    );
  });

  it("blocks cross-origin POST requests with HTTP 403", async () => {
    const res = await handlePostGscManualSync(
      makeRequest({
        origin: "https://evil.example.com",
        host: "127.0.0.1:3000",
      })
    );
    expect(res.status).toBe(403);
    const json = (await res.json()) as GscManualSyncResponseBody;
    expect(json.success).toBe(false);
    expect(json.message).toContain("Cross-origin");
  });

  it("enforces sliding-window rate limiting with HTTP 429 and Retry-After", async () => {
    const rateLimitMap = new Map<string, number[]>();
    const createService = () => ({
      isConfigured: () => false,
      fetchAndStoreTopLowCtrQueries: async (): Promise<FetchAndStoreResult> => ({
        success: false,
        status: "NOT_CONFIGURED",
        storePath: path.join(tmpDir, "gsc-opportunities.json"),
        written: false,
        data: {
          status: "NOT_CONFIGURED",
          source: "none",
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
          auditNotice: "Unconfigured.",
        },
      }),
    });

    const first = await handlePostGscManualSync(
      makeRequest({ ip: "203.0.113.10" }),
      {
        maxSyncsPerWindow: 1,
        windowMs: 60_000,
        now: () => 1_700_000_000_000,
        rateLimitMap,
        createService,
      }
    );
    expect(first.status).toBe(200);

    const second = await handlePostGscManualSync(
      makeRequest({ ip: "203.0.113.10" }),
      {
        maxSyncsPerWindow: 1,
        windowMs: 60_000,
        now: () => 1_700_000_005_000,
        rateLimitMap,
        createService,
      }
    );
    expect(second.status).toBe(429);
    expect(second.headers.get("retry-after")).toBe("55");
    const json = (await second.json()) as GscManualSyncResponseBody;
    expect(json.status).toBe("RATE_LIMITED");
  });

  it("sanitizes secrets and writes an error report when GSC service configuration fails", async () => {
    const errorReportPath = path.join(tmpDir, "gsc-errors.json");
    const res = await handlePostGscManualSync(makeRequest(), {
      errorReportPath,
      allowedBaseDir: tmpDir,
      createService: () => {
        throw new Error(
          "Bad config Bearer ya29.secret_token_should_be_redacted"
        );
      },
    });

    expect(res.status).toBe(200);
    const json = (await res.json()) as GscManualSyncResponseBody;
    expect(json.success).toBe(false);
    expect(json.status).toBe("ERROR");
    expect(json.message).not.toContain("ya29.secret_token_should_be_redacted");
    expect(fs.existsSync(errorReportPath)).toBe(true);
  });
});
