import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  GSC_READONLY_SCOPE,
  GscServiceError,
  GoogleSearchConsoleService,
  authenticateGsc,
  fetchAndStoreTopLowCtrQueries,
  readGscErrorReport,
  type GscErrorReportStore,
  type GscTopQueriesStore,
} from "./gsc";

function generateTestKeyPair() {
  return crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
  });
}

describe("lib/services/gsc — Authentication & Data Fetching", () => {
  let tmpDir: string;
  let originalEnv: {
    GSC_CLIENT_EMAIL?: string;
    GSC_PRIVATE_KEY?: string;
    GSC_SITE_URL?: string;
  };

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "gsc-unit-test-"));
    originalEnv = {
      GSC_CLIENT_EMAIL: process.env.GSC_CLIENT_EMAIL,
      GSC_PRIVATE_KEY: process.env.GSC_PRIVATE_KEY,
      GSC_SITE_URL: process.env.GSC_SITE_URL,
    };
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
    if (originalEnv.GSC_CLIENT_EMAIL === undefined) {
      delete process.env.GSC_CLIENT_EMAIL;
    } else {
      process.env.GSC_CLIENT_EMAIL = originalEnv.GSC_CLIENT_EMAIL;
    }
    if (originalEnv.GSC_PRIVATE_KEY === undefined) {
      delete process.env.GSC_PRIVATE_KEY;
    } else {
      process.env.GSC_PRIVATE_KEY = originalEnv.GSC_PRIVATE_KEY;
    }
    if (originalEnv.GSC_SITE_URL === undefined) {
      delete process.env.GSC_SITE_URL;
    } else {
      process.env.GSC_SITE_URL = originalEnv.GSC_SITE_URL;
    }
    vi.restoreAllMocks();
  });

  describe("Authentication", () => {
    it("authenticates using env credentials, verifies RS256 JWT assertion, and caches the Bearer token", async () => {
      const { publicKey, privateKey } = generateTestKeyPair();
      process.env.GSC_CLIENT_EMAIL = "seo-bot@example.iam.gserviceaccount.com";
      process.env.GSC_PRIVATE_KEY = privateKey.replace(/\n/g, "\\n");
      process.env.GSC_SITE_URL = "https://www.piperesque.com";

      const fetchMock = vi.fn<typeof fetch>().mockImplementation(async (input, init) => {
        expect(String(input)).toBe("https://oauth2.googleapis.com/token");
        expect(init?.method).toBe("POST");

        const bodyParams = new URLSearchParams(String(init?.body ?? ""));
        expect(bodyParams.get("grant_type")).toBe(
          "urn:ietf:params:oauth:grant-type:jwt-bearer"
        );

        const assertion = bodyParams.get("assertion") ?? "";
        const [encodedHeader, encodedClaims, encodedSig] = assertion.split(".");
        expect(encodedHeader).toBeTruthy();
        expect(encodedClaims).toBeTruthy();
        expect(encodedSig).toBeTruthy();

        const header = JSON.parse(
          Buffer.from(encodedHeader, "base64url").toString("utf-8")
        );
        const claims = JSON.parse(
          Buffer.from(encodedClaims, "base64url").toString("utf-8")
        );

        expect(header).toEqual({ alg: "RS256", typ: "JWT" });
        expect(claims).toMatchObject({
          iss: "seo-bot@example.iam.gserviceaccount.com",
          scope: GSC_READONLY_SCOPE,
          aud: "https://oauth2.googleapis.com/token",
        });
        expect(claims.exp - claims.iat).toBe(3600);

        const verifier = crypto.createVerify("RSA-SHA256");
        verifier.update(`${encodedHeader}.${encodedClaims}`);
        verifier.end();
        expect(verifier.verify(publicKey, encodedSig, "base64url")).toBe(true);

        return new Response(
          JSON.stringify({
            access_token: "ya29.mock-access-token",
            expires_in: 3600,
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      });

      const service = new GoogleSearchConsoleService({
        fetchImpl: fetchMock,
        allowedBaseDir: tmpDir,
      });

      expect(service.isConfigured()).toBe(true);
      expect(service.siteUrl).toBe("https://www.piperesque.com/");

      const firstToken = await service.authenticate();
      const cachedToken = await service.authenticate();

      expect(firstToken).toBe("ya29.mock-access-token");
      expect(cachedToken).toBe("ya29.mock-access-token");
      expect(fetchMock).toHaveBeenCalledTimes(1);

      const helperToken = await authenticateGsc({
        fetchImpl: fetchMock,
        allowedBaseDir: tmpDir,
      });
      expect(helperToken).toBe("ya29.mock-access-token");
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });

    it("throws GscServiceError and writes fallback error report on invalid private key or OAuth failure", async () => {
      const logger = { error: vi.fn(), warn: vi.fn() };
      const invalidKeyService = new GoogleSearchConsoleService({
        clientEmail: "seo-bot@example.iam.gserviceaccount.com",
        privateKey: "not-a-valid-pem-key",
        logger,
        allowedBaseDir: tmpDir,
      });

      await expect(invalidKeyService.authenticate()).rejects.toMatchObject({
        name: "GscServiceError",
        stage: "jwt_signing",
        code: "JWT_SIGN_FAILED",
        retryable: false,
      });

      const { privateKey } = generateTestKeyPair();
      const oauthErrorFetch = vi.fn<typeof fetch>().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: "unauthorized_client",
            error_description: "Client is unauthorized to retrieve access tokens.",
          }),
          { status: 401, headers: { "Content-Type": "application/json" } }
        )
      );

      const oauthFailService = new GoogleSearchConsoleService({
        clientEmail: "seo-bot@example.iam.gserviceaccount.com",
        privateKey,
        fetchImpl: oauthErrorFetch,
        logger,
        allowedBaseDir: tmpDir,
      });

      await expect(oauthFailService.authenticate()).rejects.toMatchObject({
        name: "GscServiceError",
        stage: "oauth_token_exchange",
        code: "OAUTH_HTTP_ERROR",
        httpStatus: 401,
        providerError: "unauthorized_client",
        retryable: false,
      });

      const report = readGscErrorReport({
        allowedBaseDir: tmpDir,
      }) as GscErrorReportStore;
      expect(report.status).toBe("DEGRADED");
      expect(report.totalErrorsRecorded).toBe(2);
      expect(report.lastError?.code).toBe("OAUTH_HTTP_ERROR");
      expect(logger.error).toHaveBeenCalledTimes(2);
    });
  });

  describe("Data Fetching", () => {
    it("queries Search Analytics with Bearer auth and request filters, then maps rows cleanly", async () => {
      const { privateKey } = generateTestKeyPair();
      const capturedAnalyticsRequests: Array<{
        url: string;
        authHeader: string | null;
        body: Record<string, unknown>;
      }> = [];

      const fetchMock = vi.fn<typeof fetch>().mockImplementation(async (input, init) => {
        const url = String(input);
        if (url === "https://oauth2.googleapis.com/token") {
          return new Response(
            JSON.stringify({
              access_token: "ya29.analytics-token",
              expires_in: 3600,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }

        const headers = new Headers(init?.headers);
        capturedAnalyticsRequests.push({
          url,
          authHeader: headers.get("Authorization"),
          body: JSON.parse(String(init?.body ?? "{}")),
        });

        return new Response(
          JSON.stringify({
            rows: [
              {
                keys: [
                  "emergency plumber houston",
                  "https://www.piperesque.com/services/emergency-plumbing",
                ],
                clicks: 24,
                impressions: 1800,
                ctr: 0.0133,
                position: 7.4,
              },
              {
                keys: [
                  "water heater repair katy",
                  "https://www.piperesque.com/location/katy/water-heater-repair",
                ],
                clicks: 9,
                impressions: 620,
                ctr: 0.0145,
                position: 11.8,
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      });

      const service = new GoogleSearchConsoleService({
        clientEmail: "seo-bot@example.iam.gserviceaccount.com",
        privateKey,
        siteUrl: "https://www.piperesque.com/",
        fetchImpl: fetchMock,
        allowedBaseDir: tmpDir,
      });

      const result = await service.fetchSearchAnalytics({
        startDate: "2026-10-01",
        endDate: "2026-10-28",
        country: "USA",
        rowLimit: 50,
      });

      expect(capturedAnalyticsRequests).toHaveLength(1);
      expect(capturedAnalyticsRequests[0].url).toBe(
        `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(
          "https://www.piperesque.com/"
        )}/searchAnalytics/query`
      );
      expect(capturedAnalyticsRequests[0].authHeader).toBe(
        "Bearer ya29.analytics-token"
      );
      expect(capturedAnalyticsRequests[0].body).toMatchObject({
        startDate: "2026-10-01",
        endDate: "2026-10-28",
        dimensions: ["query", "page"],
        type: "web",
        rowLimit: 50,
        startRow: 0,
        dimensionFilterGroups: [
          {
            filters: [
              {
                dimension: "country",
                operator: "equals",
                expression: "usa",
              },
            ],
          },
        ],
      });

      expect(result).toEqual({
        startDate: "2026-10-01",
        endDate: "2026-10-28",
        rows: [
          {
            query: "emergency plumber houston",
            page: "https://www.piperesque.com/services/emergency-plumbing",
            clicks: 24,
            impressions: 1800,
            ctr: 0.0133,
            position: 7.4,
          },
          {
            query: "water heater repair katy",
            page: "https://www.piperesque.com/location/katy/water-heater-repair",
            clicks: 9,
            impressions: 620,
            ctr: 0.0145,
            position: 11.8,
          },
        ],
      });
    });

    it("clears the cached token on HTTP 401 from Search Console and re-authenticates on the next request", async () => {
      const { privateKey } = generateTestKeyPair();
      const logger = { error: vi.fn(), warn: vi.fn() };
      let tokenCount = 0;
      let gscCalls = 0;

      const fetchMock = vi.fn<typeof fetch>().mockImplementation(async (input) => {
        const url = String(input);
        if (url === "https://oauth2.googleapis.com/token") {
          tokenCount += 1;
          return new Response(
            JSON.stringify({
              access_token: `ya29.token-${tokenCount}`,
              expires_in: 3600,
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }

        gscCalls += 1;
        if (gscCalls === 1) {
          return new Response(
            JSON.stringify({
              error: {
                code: 401,
                status: "UNAUTHENTICATED",
                message: "Invalid Credentials",
              },
            }),
            { status: 401, headers: { "Content-Type": "application/json" } }
          );
        }

        return new Response(JSON.stringify({ rows: [] }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      });

      const service = new GoogleSearchConsoleService({
        clientEmail: "seo-bot@example.iam.gserviceaccount.com",
        privateKey,
        fetchImpl: fetchMock,
        logger,
        allowedBaseDir: tmpDir,
      });

      await expect(service.fetchSearchAnalytics()).rejects.toThrow(
        GscServiceError
      );
      expect(tokenCount).toBe(1);

      // Next request must fetch a fresh OAuth token because 401 invalidated the cache
      const retryResult = await service.fetchSearchAnalytics();
      expect(tokenCount).toBe(2);
      expect(retryResult.rows).toEqual([]);
    });

    it("fetches and stores top 3 high-impression/low-CTR queries and preserves store on subsequent API failures", async () => {
      const { privateKey } = generateTestKeyPair();
      const logger = { error: vi.fn(), warn: vi.fn() };
      let shouldFail = false;

      const fetchMock = vi.fn<typeof fetch>().mockImplementation(async (input) => {
        const url = String(input);
        if (url === "https://oauth2.googleapis.com/token") {
          return new Response(
            JSON.stringify({ access_token: "ya29.store-token", expires_in: 3600 }),
            { status: 200, headers: { "Content-Type": "application/json" } }
          );
        }

        if (shouldFail) {
          return new Response(
            JSON.stringify({
              error: {
                code: 500,
                status: "INTERNAL",
                message: "Upstream Search Console outage",
              },
            }),
            { status: 500, headers: { "Content-Type": "application/json" } }
          );
        }

        return new Response(
          JSON.stringify({
            rows: [
              {
                keys: ["slab leak repair houston", "https://www.piperesque.com/services/leak-detection"],
                clicks: 11,
                impressions: 1100,
                ctr: 0.01,
                position: 9.4,
              },
              {
                keys: ["brand high ctr query", "https://www.piperesque.com/"],
                clicks: 120,
                impressions: 1000,
                ctr: 0.12,
                position: 1.2,
              },
              {
                keys: ["hydro jetting houston cost", "https://www.piperesque.com/services/drain-cleaning"],
                clicks: 8,
                impressions: 890,
                ctr: 0.009,
                position: 13.1,
              },
              {
                keys: ["sewer camera inspection houston", "https://www.piperesque.com/services/sewer-line-repair"],
                clicks: 5,
                impressions: 640,
                ctr: 0.0078,
                position: 16.5,
              },
              {
                keys: ["lower volume opportunity", "https://www.piperesque.com/services/pipe-repair"],
                clicks: 2,
                impressions: 240,
                ctr: 0.0083,
                position: 18.0,
              },
            ],
          }),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      });

      const okResult = await fetchAndStoreTopLowCtrQueries({
        limit: 3,
        startDate: "2026-10-01",
        endDate: "2026-10-28",
        allowedBaseDir: tmpDir,
        serviceOptions: {
          clientEmail: "seo-bot@example.iam.gserviceaccount.com",
          privateKey,
          fetchImpl: fetchMock,
          logger,
        },
      });

      expect(okResult.success).toBe(true);
      expect(okResult.written).toBe(true);
      expect(okResult.data.queries.map((q) => q.query)).toEqual([
        "slab leak repair houston",
        "hydro jetting houston cost",
        "sewer camera inspection houston",
      ]);

      // Trigger a simulated outage and verify gsc-opportunities.json is preserved while gsc-errors.json records the outage
      shouldFail = true;
      const failResult = await fetchAndStoreTopLowCtrQueries({
        limit: 3,
        startDate: "2026-10-01",
        endDate: "2026-10-28",
        allowedBaseDir: tmpDir,
        serviceOptions: {
          clientEmail: "seo-bot@example.iam.gserviceaccount.com",
          privateKey,
          fetchImpl: fetchMock,
          logger,
        },
      });

      expect(failResult.success).toBe(false);
      expect(failResult.status).toBe("ERROR");
      expect(failResult.written).toBe(false);
      expect(failResult.errorReportWritten).toBe(true);

      const preservedStore = JSON.parse(
        fs.readFileSync(path.join(tmpDir, "gsc-opportunities.json"), "utf-8")
      ) as GscTopQueriesStore;
      expect(preservedStore.status).toBe("LIVE");
      expect(preservedStore.queries).toHaveLength(3);

      const errorReport = readGscErrorReport({
        allowedBaseDir: tmpDir,
      }) as GscErrorReportStore;
      expect(errorReport.status).toBe("DEGRADED");
      expect(errorReport.lastError).toMatchObject({
        stage: "search_analytics_fetch",
        code: "GSC_HTTP_ERROR",
        httpStatus: 500,
        providerError: "INTERNAL",
        retryable: true,
      });
    });
  });
});
