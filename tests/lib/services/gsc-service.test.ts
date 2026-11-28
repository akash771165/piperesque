import crypto from "node:crypto";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  GSC_READONLY_SCOPE,
  GoogleSearchConsoleService,
  fetchAndStoreTopLowCtrQueries,
  loadGscCredentialsFromEnv,
  normalizePrivateKey,
  resolveSafeStorePath,
  validateSiteUrl,
  type GscTopQueriesStore,
} from "@/lib/services/gsc-service";

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

    const safePath = resolveSafeStorePath("gsc-top-queries.json", tmpDir);
    expect(safePath).toBe(path.join(tmpDir, "gsc-top-queries.json"));

    expect(() =>
      resolveSafeStorePath("../escaped.json", tmpDir)
    ).toThrow(/escapes allowed directory/i);
    expect(() =>
      resolveSafeStorePath("gsc-top-queries.txt", tmpDir)
    ).toThrow(/\.json/i);
  });

  it("creates a verifiable RS256 JWT assertion and caches the OAuth access token", async () => {
    const { publicKey, privateKey } = createTestRsaKeyPair();
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
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
      storePath: "gsc-top-queries.json",
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
    const existingStorePath = path.join(tmpDir, "gsc-top-queries.json");
    const sentinel = { status: "LIVE", queries: [{ query: "preserved" }] };
    fs.writeFileSync(existingStorePath, JSON.stringify(sentinel), "utf-8");

    const origEmail = process.env.GSC_CLIENT_EMAIL;
    const origKey = process.env.GSC_PRIVATE_KEY;
    delete process.env.GSC_CLIENT_EMAIL;
    delete process.env.GSC_PRIVATE_KEY;

    try {
      const result = await fetchAndStoreTopLowCtrQueries({
        storePath: "gsc-top-queries.json",
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

  it("returns ERROR cleanly when Google Search Console API fails without writing fabricated rows", async () => {
    const { privateKey } = createTestRsaKeyPair();
    const fetchMock = vi.fn<typeof fetch>().mockResolvedValue(
      new Response(JSON.stringify({ error: "invalid_grant" }), { status: 403 })
    );

    const result = await fetchAndStoreTopLowCtrQueries({
      storePath: "gsc-top-queries.json",
      allowedBaseDir: tmpDir,
      serviceOptions: {
        clientEmail: "growth@example.iam.gserviceaccount.com",
        privateKey,
        fetchImpl: fetchMock,
      },
    });

    expect(result.success).toBe(false);
    expect(result.status).toBe("ERROR");
    expect(result.written).toBe(false);
    expect(result.error).toContain("HTTP 403");
    expect(fs.existsSync(path.join(tmpDir, "gsc-top-queries.json"))).toBe(false);
  });
});
