import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  DEFAULT_GSC_ERRORS_STORE_RELATIVE_PATH,
  DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH,
  GSC_READONLY_SCOPE,
  GscServiceError,
  GoogleSearchConsoleService,
  MAX_STORED_GSC_ERRORS,
  authenticateGsc,
  fetchAndStoreTopLowCtrQueries,
  loadGscCredentialsFromEnv,
  normalizePrivateKey,
  readGscErrorReport,
  resolveSafeStorePath,
  sanitizeErrorText,
  validateSiteUrl,
  writeGscErrorReport,
  type GscErrorReportStore,
  type GscTopQueriesStore,
} from "@/lib/services/gsc";

function createTestRsaKeyPair() {
  return crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
}

describe("GoogleSearchConsoleService", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gsc-service-test-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    vi.restoreAllMocks();
  });

  it("loads credentials from environment variables and normalizes escaped newlines", () => {
    const { privateKey } = createTestRsaKeyPair();
    const escapedKey = `"${privateKey.replace(/\n/g, "\\n")}"`;

    expect(normalizePrivateKey(escapedKey)).toBe(privateKey.trim());

    const creds = loadGscCredentialsFromEnv({
      GSC_CLIENT_EMAIL: "growth@example.iam.gserviceaccount.com",
      GSC_PRIVATE_KEY: escapedKey,
      GSC_SITE_URL: "https://www.piperesque.com",
    } as NodeJS.ProcessEnv);

    expect(creds).toEqual({
      clientEmail: "growth@example.iam.gserviceaccount.com",
      privateKey: privateKey.trim(),
      siteUrl: "https://www.piperesque.com/",
    });

    expect(loadGscCredentialsFromEnv({} as NodeJS.ProcessEnv)).toBeNull();
  });

  it("validates site URLs and enforces strict path confinement for the JSON store", () => {
    expect(validateSiteUrl("https://www.piperesque.com")).toBe(
      "https://www.piperesque.com/"
    );
    expect(validateSiteUrl("sc-domain:piperesque.com")).toBe(
      "sc-domain:piperesque.com"
    );
    expect(() => validateSiteUrl("http://insecure.example.com")).toThrow();
    expect(() => validateSiteUrl("javascript:alert(1)")).toThrow();

    expect(DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH).toBe(
      "content/growth/gsc-opportunities.json"
    );

    const safePath = resolveSafeStorePath("gsc-opportunities.json", tmpDir);
    expect(safePath).toBe(path.join(tmpDir, "gsc-opportunities.json"));

    expect(() =>
      resolveSafeStorePath("../escaped.json", tmpDir)
    ).toThrow(/escapes allowed directory/i);
    expect(() =>
      resolveSafeStorePath("gsc-opportunities.txt", tmpDir)
    ).toThrow(/\.json/i);
  });

  it("creates a verifiable RS256 JWT assertion and caches the OAuth access token", async () => {
    const { publicKey, privateKey } = createTestRsaKeyPair();
    const fetchMock = vi.fn<typeof fetch>().mockImplementation(async () =>
      new Response(
        JSON.stringify({ access_token: "ya29.test-token", expires_in: 3600 }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      )
    );

    const service = new GoogleSearchConsoleService({
      clientEmail: "growth@example.iam.gserviceaccount.com",
      privateKey,
      siteUrl: "https://www.piperesque.com/",
      fetchImpl: fetchMock,
    });

    const jwt = service.createSignedJwtAssertion(1700000000);
    const [encodedHeader, encodedClaims, encodedSignature] = jwt.split(".");
    const header = JSON.parse(
      Buffer.from(encodedHeader, "base64url").toString("utf-8")
    );
    const claims = JSON.parse(
      Buffer.from(encodedClaims, "base64url").toString("utf-8")
    );

    expect(header).toEqual({ alg: "RS256", typ: "JWT" });
    expect(claims).toMatchObject({
      iss: "growth@example.iam.gserviceaccount.com",
      scope: GSC_READONLY_SCOPE,
      aud: "https://oauth2.googleapis.com/token",
      iat: 1700000000,
      exp: 1700003600,
    });

    const verifier = crypto.createVerify("RSA-SHA256");
    verifier.update(`${encodedHeader}.${encodedClaims}`);
    verifier.end();
    expect(verifier.verify(publicKey, encodedSignature, "base64url")).toBe(
      true
    );

    const token1 = await service.authenticate();
    const token2 = await service.authenticate();

    expect(token1).toBe("ya29.test-token");
    expect(token2).toBe("ya29.test-token");
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const standaloneToken = await authenticateGsc({
      clientEmail: "growth@example.iam.gserviceaccount.com",
      privateKey,
      siteUrl: "https://www.piperesque.com/",
      fetchImpl: fetchMock,
    });
    expect(standaloneToken).toBe("ya29.test-token");
  });

  it("fetches top 3 high-impression/low-CTR queries and stores them atomically in a JSON store", async () => {
    const { privateKey } = createTestRsaKeyPair();

    const fetchMock = vi.fn<typeof fetch>().mockImplementation(async (input) => {
      const url = String(input);
      if (url === "https://oauth2.googleapis.com/token") {
        return new Response(
          JSON.stringify({ access_token: "ya29.live-token", expires_in: 3600 }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      if (url.includes("searchconsole.googleapis.com")) {
        return new Response(
          JSON.stringify({
            rows: [
              {
                keys: [
                  "sewer line repair houston",
                  "https://www.piperesque.com/services/sewer-line-repair",
                ],
                clicks: 18,
                impressions: 1200,
                ctr: 0.015,
                position: 8.4,
              },
              {
                keys: [
                  "high ctr plumbing query",
                  "https://www.piperesque.com/services/emergency-plumbing",
                ],
                clicks: 90,
                impressions: 1500,
                ctr: 0.06,
                position: 2.1,
              },
              {
                keys: [
                  "slab leak detection cost houston",
                  "https://www.piperesque.com/services/leak-detection",
                ],
                clicks: 12,
                impressions: 980,
                ctr: 0.0122,
                position: 12.3,
              },
              {
                keys: [
                  "ac condensate line backing up houston",
                  "https://www.piperesque.com/services/drain-cleaning",
                ],
                clicks: 6,
                impressions: 740,
                ctr: 0.0081,
                position: 19.5,
              },
              {
                keys: [
                  "fourth lower impression low ctr",
                  "https://www.piperesque.com/services/water-heater-repair",
                ],
                clicks: 3,
                impressions: 350,
                ctr: 0.0086,
                position: 14.2,
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      throw new Error(`Unexpected fetch URL: ${url}`);
    });

    const result = await fetchAndStoreTopLowCtrQueries({
      limit: 3,
      startDate: "2026-10-25",
      endDate: "2026-11-22",
      allowedBaseDir: tmpDir,
      serviceOptions: {
        clientEmail: "growth@example.iam.gserviceaccount.com",
        privateKey,
        siteUrl: "https://www.piperesque.com/",
        fetchImpl: fetchMock,
      },
    });

    expect(result.success).toBe(true);
    expect(result.status).toBe("LIVE");
    expect(result.written).toBe(true);
    expect(result.data.queries).toHaveLength(3);
    expect(result.data.queries.map((q) => q.query)).toEqual([
      "sewer line repair houston",
      "slab leak detection cost houston",
      "ac condensate line backing up houston",
    ]);
    expect(result.data.queries[0].pagePath).toBe("/services/sewer-line-repair");
    expect(result.data.queries[0].rankingTier).toBe("Page 1");
    expect(result.data.queries[1].rankingTier).toBe("Striking Distance");

    expect(path.basename(result.storePath)).toBe("gsc-opportunities.json");

    // Verify JSON store persisted cleanly on disk
    const persisted = JSON.parse(
      fs.readFileSync(result.storePath, "utf-8")
    ) as GscTopQueriesStore;
    expect(persisted.status).toBe("LIVE");
    expect(persisted.source).toBe("google_search_console_api");
    expect(persisted.totalQueriesAnalyzed).toBe(5);
    expect(persisted.dateRange).toEqual({
      startDate: "2026-10-25",
      endDate: "2026-11-22",
    });
    expect(persisted.queries).toHaveLength(3);
  });

  it("returns NOT_CONFIGURED without overwriting existing JSON store when credentials are missing", async () => {
    const existingStorePath = path.join(tmpDir, "gsc-opportunities.json");
    const sentinel = { status: "LIVE", queries: [{ query: "preserved" }] };
    fs.writeFileSync(existingStorePath, JSON.stringify(sentinel), "utf-8");

    const origEmail = process.env.GSC_CLIENT_EMAIL;
    const origKey = process.env.GSC_PRIVATE_KEY;
    delete process.env.GSC_CLIENT_EMAIL;
    delete process.env.GSC_PRIVATE_KEY;

    try {
      const result = await fetchAndStoreTopLowCtrQueries({
        storePath: "gsc-opportunities.json",
        allowedBaseDir: tmpDir,
      });

      expect(result.success).toBe(false);
      expect(result.status).toBe("NOT_CONFIGURED");
      expect(result.written).toBe(false);
      expect(result.data.queries).toEqual([]);

      // Existing file must remain untouched
      expect(JSON.parse(fs.readFileSync(existingStorePath, "utf-8"))).toEqual(
        sentinel
      );
    } finally {
      if (origEmail !== undefined) process.env.GSC_CLIENT_EMAIL = origEmail;
      if (origKey !== undefined) process.env.GSC_PRIVATE_KEY = origKey;
    }
  });

  it("logs sanitized errors and writes fallback gsc-errors.json on OAuth failure without writing fabricated opportunities", async () => {
    const { privateKey } = createTestRsaKeyPair();
    const logger = {
      error: vi.fn(),
      warn: vi.fn(),
    };
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(
        JSON.stringify({
          error: "invalid_grant",
          error_description: "Invalid JWT Signature.",
        }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      )
    );

    expect(DEFAULT_GSC_ERRORS_STORE_RELATIVE_PATH).toBe(
      "content/growth/gsc-errors.json"
    );

    const result = await fetchAndStoreTopLowCtrQueries({
      storePath: "gsc-opportunities.json",
      allowedBaseDir: tmpDir,
      serviceOptions: {
        clientEmail: "growth@example.iam.gserviceaccount.com",
        privateKey,
        fetchImpl: fetchMock,
        logger,
      },
    });

    expect(result.success).toBe(false);
    expect(result.status).toBe("ERROR");
    expect(result.written).toBe(false);
    expect(result.error).toContain("HTTP 403");
    expect(result.error).toContain("invalid_grant");
    expect(result.errorReportWritten).toBe(true);
    expect(result.errorReportPath).toBe(path.join(tmpDir, "gsc-errors.json"));

    // Opportunities store must NOT be fabricated on error
    expect(fs.existsSync(path.join(tmpDir, "gsc-opportunities.json"))).toBe(
      false
    );

    // Structured error logged once (no duplicate logging across call stack)
    expect(logger.error).toHaveBeenCalledTimes(1);
    expect(logger.error.mock.calls[0][1]).toMatchObject({
      stage: "oauth_token_exchange",
      code: "OAUTH_HTTP_ERROR",
      httpStatus: 403,
      providerError: "invalid_grant",
      retryable: false,
      errorReportWritten: true,
    });

    // Fallback gsc-errors.json persisted cleanly
    const report = readGscErrorReport({
      allowedBaseDir: tmpDir,
    }) as GscErrorReportStore;
    expect(report).not.toBeNull();
    expect(report.status).toBe("DEGRADED");
    expect(report.totalErrorsRecorded).toBe(1);
    expect(report.consecutiveFailures).toBe(1);
    expect(report.lastError).toMatchObject({
      stage: "oauth_token_exchange",
      code: "OAUTH_HTTP_ERROR",
      httpStatus: 403,
      providerError: "invalid_grant",
      providerErrorDescription: "Invalid JWT Signature.",
      retryable: false,
    });
    expect(report.errors).toHaveLength(1);
  });

  it("records retryable Search Analytics HTTP 503 and timeout failures with request context and resets status upon recovery", async () => {
    const { privateKey } = createTestRsaKeyPair();
    const logger = {
      error: vi.fn(),
      warn: vi.fn(),
    };

    let gscAttempt = 0;
    const fetchMock = vi.fn<typeof fetch>().mockImplementation(async (input) => {
      const url = String(input);
      if (url === "https://oauth2.googleapis.com/token") {
        return new Response(
          JSON.stringify({ access_token: "ya29.valid-token", expires_in: 3600 }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      }
      gscAttempt += 1;
      if (gscAttempt === 1) {
        return new Response(
          JSON.stringify({
            error: {
              code: 503,
              status: "UNAVAILABLE",
              message: "Backend service temporarily unavailable",
            },
          }),
          { status: 503, headers: { "Content-Type": "application/json" } }
        );
      }
      if (gscAttempt === 2) {
        const timeoutErr = new Error("The operation timed out.");
        timeoutErr.name = "TimeoutError";
        throw timeoutErr;
      }
      return new Response(
        JSON.stringify({
          rows: [
            {
              keys: [
                "sewer line repair houston",
                "https://www.piperesque.com/services/sewer-line-repair",
              ],
              clicks: 12,
              impressions: 950,
              ctr: 0.0126,
              position: 9.2,
            },
          ],
        }),
        { status: 200, headers: { "Content-Type": "application/json" } }
      );
    });

    const service = new GoogleSearchConsoleService({
      clientEmail: "growth@example.iam.gserviceaccount.com",
      privateKey,
      siteUrl: "https://www.piperesque.com/",
      fetchImpl: fetchMock,
      logger,
      allowedBaseDir: tmpDir,
    });

    // Failure 1: HTTP 503
    const res1 = await service.fetchAndStoreTopLowCtrQueries({
      startDate: "2026-10-25",
      endDate: "2026-11-22",
      country: "usa",
      rowLimit: 100,
      allowedBaseDir: tmpDir,
    });
    expect(res1.success).toBe(false);
    expect(res1.errorReportWritten).toBe(true);

    // Failure 2: Timeout
    await expect(
      service.fetchSearchAnalytics({
        startDate: "2026-10-25",
        endDate: "2026-11-22",
        allowedBaseDir: tmpDir,
      })
    ).rejects.toThrow(GscServiceError);

    const degradedReport = readGscErrorReport({
      allowedBaseDir: tmpDir,
    }) as GscErrorReportStore;
    expect(degradedReport.status).toBe("DEGRADED");
    expect(degradedReport.totalErrorsRecorded).toBe(2);
    expect(degradedReport.consecutiveFailures).toBe(2);
    expect(degradedReport.errors).toHaveLength(2);
    // Newest-first ordering
    expect(degradedReport.errors[0]).toMatchObject({
      stage: "search_analytics_fetch",
      code: "GSC_TIMEOUT",
      retryable: true,
    });
    expect(degradedReport.errors[1]).toMatchObject({
      stage: "search_analytics_fetch",
      code: "GSC_HTTP_ERROR",
      httpStatus: 503,
      providerError: "UNAVAILABLE",
      retryable: true,
      context: {
        startDate: "2026-10-25",
        endDate: "2026-11-22",
        country: "usa",
        rowLimit: 100,
      },
    });

    // Attempt 3: Service recovers -> consecutiveFailures resets to 0 & status returns to OK while keeping history
    const recovered = await service.fetchAndStoreTopLowCtrQueries({
      startDate: "2026-10-25",
      endDate: "2026-11-22",
      allowedBaseDir: tmpDir,
    });
    expect(recovered.success).toBe(true);

    const recoveredReport = readGscErrorReport({
      allowedBaseDir: tmpDir,
    }) as GscErrorReportStore;
    expect(recoveredReport.status).toBe("OK");
    expect(recoveredReport.consecutiveFailures).toBe(0);
    expect(recoveredReport.totalErrorsRecorded).toBe(2);
    expect(recoveredReport.errors).toHaveLength(2);
  });

  it("redacts sensitive credentials from error logs and persisted gsc-errors.json reports and bounds stored history", async () => {
    const sampleSecretText =
      "Auth failed for Bearer ya29.super-secret-token with assertion=eyJhbGciOiJSUzI1NiJ9.eyJpc3MiOiJ0ZXN0In0.c2lnbmF0dXJlMTIz and -----BEGIN PRIVATE KEY-----\nMIIEvQIBADAN\n-----END PRIVATE KEY-----";
    const cleaned = sanitizeErrorText(sampleSecretText);
    expect(cleaned).not.toContain("ya29.super-secret-token");
    expect(cleaned).not.toContain("MIIEvQIBADAN");
    expect(cleaned).not.toContain("eyJhbGciOiJSUzI1NiJ9");
    expect(cleaned).toContain("[REDACTED");

    // Verify bounded history cap
    for (let i = 0; i < MAX_STORED_GSC_ERRORS + 5; i++) {
      writeGscErrorReport(
        {
          timestamp: new Date(1700000000000 + i * 1000).toISOString(),
          stage: "search_analytics_fetch",
          code: "GSC_HTTP_ERROR",
          message: `Failure #${i} with Bearer ya29.secret-${i}`,
          httpStatus: 500,
          endpoint: "https://searchconsole.googleapis.com/test",
          siteUrl: "https://www.piperesque.com/",
          providerError: null,
          providerErrorDescription: null,
          retryable: true,
        },
        { allowedBaseDir: tmpDir }
      );
    }

    const persistedRaw = fs.readFileSync(
      path.join(tmpDir, "gsc-errors.json"),
      "utf-8"
    );
    expect(persistedRaw).not.toContain("ya29.secret-");

    const parsed = JSON.parse(persistedRaw) as GscErrorReportStore;
    expect(parsed.totalErrorsRecorded).toBe(MAX_STORED_GSC_ERRORS + 5);
    expect(parsed.errors).toHaveLength(MAX_STORED_GSC_ERRORS);
  });

  it("rejects path traversal on errorReportPath outside allowedBaseDir", () => {
    expect(() =>
      writeGscErrorReport(
        {
          timestamp: new Date().toISOString(),
          stage: "oauth_token_exchange",
          code: "OAUTH_HTTP_ERROR",
          message: "Unauthorized",
          httpStatus: 401,
          endpoint: "https://oauth2.googleapis.com/token",
          siteUrl: "https://www.piperesque.com/",
          providerError: "unauthorized_client",
          providerErrorDescription: null,
          retryable: false,
        },
        {
          errorReportPath: "../outside-errors.json",
          allowedBaseDir: tmpDir,
        }
      )
    ).toThrow(/escapes allowed directory/i);
  });
});
