import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";

export const GSC_READONLY_SCOPE =
  "https://www.googleapis.com/auth/webmasters.readonly";
const GOOGLE_OAUTH_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GSC_API_BASE_URL =
  "https://searchconsole.googleapis.com/webmasters/v3/sites";

export const DEFAULT_GSC_SITE_URL = "https://www.piperesque.com/";
export const DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH =
  "content/growth/gsc-top-queries.json";

export interface GscCredentials {
  clientEmail: string;
  privateKey: string;
  siteUrl: string;
}

export interface RawGscQueryRow {
  query: string;
  page?: string;
  device?: string;
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
}

export interface LowCtrQueryOpportunity {
  query: string;
  pagePath: string | null;
  impressions: number;
  clicks: number;
  ctr: number;
  formattedCtr: string;
  position: number;
  formattedPosition: string;
  rankingTier: "Page 1" | "Striking Distance" | "Page 3+";
}

export interface GscTopQueriesStore {
  status: "LIVE" | "NOT_CONFIGURED" | "ERROR";
  source: "google_search_console_api" | "none";
  siteUrl: string;
  updatedAt: string | null;
  dateRange: {
    startDate: string | null;
    endDate: string | null;
  };
  asOfDate: string | null;
  totalQueriesAnalyzed: number;
  topLimit: number;
  criteria: {
    primaryMinImpressions: number;
    primaryMaxCtr: number;
    fallbackMinImpressions: number;
    fallbackMaxCtr: number;
  };
  queries: LowCtrQueryOpportunity[];
  auditNotice: string;
}

export interface GscServiceOptions {
  clientEmail?: string;
  privateKey?: string;
  siteUrl?: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export interface FetchAnalyticsOptions {
  startDate?: string;
  endDate?: string;
  country?: string;
  rowLimit?: number;
}

export interface FetchAndStoreOptions extends FetchAnalyticsOptions {
  limit?: number;
  storePath?: string;
  allowedBaseDir?: string;
  serviceOptions?: GscServiceOptions;
}

export interface FetchAndStoreResult {
  success: boolean;
  status: "LIVE" | "NOT_CONFIGURED" | "ERROR";
  storePath: string;
  written: boolean;
  data: GscTopQueriesStore;
  error?: string;
}

function toSafeNumber(value: unknown): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Normalizes a PEM private key loaded from environment variables by removing
 * accidental surrounding quotes and converting literal `\n` escapes to newlines.
 */
export function normalizePrivateKey(rawPrivateKey: string): string {
  let key = rawPrivateKey.trim();
  if (
    (key.startsWith('"') && key.endsWith('"')) ||
    (key.startsWith("'") && key.endsWith("'"))
  ) {
    key = key.slice(1, -1).trim();
  }
  if (key.includes("\\n")) {
    key = key.replace(/\\n/g, "\n");
  }
  return key.trim();
}

/**
 * Validates and normalizes a Google Search Console property identifier.
 * Accepts verified `https://` URL-prefix properties or `sc-domain:` properties.
 */
export function validateSiteUrl(rawSiteUrl: string): string {
  const trimmed = rawSiteUrl.trim();
  if (!trimmed) {
    throw new Error("GSC site URL cannot be empty.");
  }

  if (trimmed.startsWith("sc-domain:")) {
    const domain = trimmed.slice("sc-domain:".length).trim();
    if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
      throw new Error("Invalid sc-domain Search Console property.");
    }
    return `sc-domain:${domain}`;
  }

  let parsed: URL;
  try {
    parsed = new URL(trimmed);
  } catch {
    throw new Error("Invalid GSC_SITE_URL format. Must be a valid HTTPS URL.");
  }

  if (parsed.protocol !== "https:") {
    throw new Error("GSC_SITE_URL must use the https: protocol.");
  }

  const normalized = parsed.toString();
  return normalized.endsWith("/") ? normalized : `${normalized}/`;
}

/**
 * Resolves a target JSON store path and enforces strict confinement inside `allowedBaseDir`.
 */
export function resolveSafeStorePath(
  storePath: string,
  allowedBaseDir: string
): string {
  if (!storePath || typeof storePath !== "string") {
    throw new Error("Store path must be a non-empty string.");
  }
  if (!storePath.endsWith(".json")) {
    throw new Error("Store path must target a .json file.");
  }

  const normalizedBase = path.resolve(allowedBaseDir);
  const resolved = path.isAbsolute(storePath)
    ? path.resolve(storePath)
    : path.resolve(normalizedBase, storePath);

  if (!resolved.startsWith(`${normalizedBase}${path.sep}`)) {
    throw new Error(
      `Store path escapes allowed directory (${normalizedBase}).`
    );
  }

  return resolved;
}

/**
 * Reads Google Search Console credentials from server-side environment variables.
 * Returns null if GSC_CLIENT_EMAIL or GSC_PRIVATE_KEY is missing.
 */
export function loadGscCredentialsFromEnv(
  env: NodeJS.ProcessEnv = process.env
): GscCredentials | null {
  const clientEmail = env.GSC_CLIENT_EMAIL?.trim();
  const privateKey = env.GSC_PRIVATE_KEY?.trim();

  if (!clientEmail || !privateKey) {
    return null;
  }

  const rawSiteUrl = env.GSC_SITE_URL?.trim() || DEFAULT_GSC_SITE_URL;
  return {
    clientEmail,
    privateKey: normalizePrivateKey(privateKey),
    siteUrl: validateSiteUrl(rawSiteUrl),
  };
}

/**
 * Extracts a clean relative path from a full URL or relative page string.
 */
export function extractPagePath(page?: string): string | null {
  if (!page || typeof page !== "string") return null;
  const trimmed = page.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("/")) return trimmed;
  try {
    const parsed = new URL(trimmed);
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return null;
    }
    return parsed.pathname || "/";
  } catch {
    return null;
  }
}

/**
 * Classifies a Search Console average ranking position into an SEO ranking tier.
 */
export function classifyRankingTier(
  position: number
): "Page 1" | "Striking Distance" | "Page 3+" {
  if (position > 0 && position <= 10) return "Page 1";
  if (position > 10 && position <= 20) return "Striking Distance";
  return "Page 3+";
}

/**
 * Selects the top N high-impression, low-CTR queries from GSC telemetry rows.
 * Primary threshold: impressions >= 100 and CTR < 2.0%.
 * Graceful fallback for smaller live properties: impressions >= 10 and CTR < 3.0%.
 * Never fabricates rows.
 */
export function selectTopHighImpressionLowCtrQueries(
  rows: RawGscQueryRow[],
  limit = 3
): LowCtrQueryOpportunity[] {
  if (!Array.isArray(rows) || rows.length === 0 || limit <= 0) {
    return [];
  }

  const clampedLimit = Math.min(Math.max(1, Math.floor(limit)), 100);

  const byQuery = new Map<
    string,
    {
      query: string;
      page?: string;
      topPageImpressions: number;
      clicks: number;
      impressions: number;
      weightedPositionSum: number;
    }
  >();

  for (const row of rows) {
    const query = typeof row?.query === "string" ? row.query.trim() : "";
    if (!query) continue;

    const impressions = Math.max(0, Math.round(toSafeNumber(row.impressions)));
    const clicks = Math.max(0, Math.round(toSafeNumber(row.clicks)));
    const position = Math.max(0, toSafeNumber(row.position));

    const existing = byQuery.get(query);
    if (!existing) {
      byQuery.set(query, {
        query,
        page: row.page,
        topPageImpressions: impressions,
        clicks,
        impressions,
        weightedPositionSum: position * Math.max(1, impressions),
      });
    } else {
      existing.clicks += clicks;
      existing.impressions += impressions;
      existing.weightedPositionSum += position * Math.max(1, impressions);
      if (impressions > existing.topPageImpressions && row.page) {
        existing.page = row.page;
        existing.topPageImpressions = impressions;
      }
    }
  }

  const normalized = Array.from(byQuery.values()).map((entry) => {
    const ctr = entry.impressions > 0 ? entry.clicks / entry.impressions : 0;
    const avgPosition =
      entry.impressions > 0
        ? entry.weightedPositionSum / entry.impressions
        : entry.weightedPositionSum;
    return {
      query: entry.query,
      page: entry.page,
      clicks: entry.clicks,
      impressions: entry.impressions,
      ctr,
      position: Number(avgPosition.toFixed(1)),
    };
  });

  const sortByOpportunity = (
    a: (typeof normalized)[number],
    b: (typeof normalized)[number]
  ) => {
    if (b.impressions !== a.impressions) return b.impressions - a.impressions;
    if (a.ctr !== b.ctr) return a.ctr - b.ctr;
    return a.position - b.position;
  };

  const candidates = normalized
    .filter((r) => r.impressions >= 100 && r.ctr < 0.02)
    .sort(sortByOpportunity);

  if (candidates.length < clampedLimit) {
    const relaxed = normalized
      .filter((r) => r.impressions >= 10 && r.ctr < 0.03)
      .sort(sortByOpportunity);
    const seen = new Set(candidates.map((c) => c.query));
    for (const item of relaxed) {
      if (!seen.has(item.query)) {
        candidates.push(item);
        seen.add(item.query);
      }
    }
  }

  return candidates.slice(0, clampedLimit).map((r) => ({
    query: r.query,
    pagePath: extractPagePath(r.page),
    impressions: r.impressions,
    clicks: r.clicks,
    ctr: Number(r.ctr.toFixed(4)),
    formattedCtr: `${(r.ctr * 100).toFixed(2)}%`,
    position: r.position,
    formattedPosition: `#${r.position.toFixed(1)}`,
    rankingTier: classifyRankingTier(r.position),
  }));
}

function validateIsoDate(dateValue: string, fieldName: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
    throw new Error(`${fieldName} must be formatted as YYYY-MM-DD.`);
  }
  return dateValue;
}

function getDefaultDateWindow(): { startDate: string; endDate: string } {
  const now = Date.now();
  const dayMs = 24 * 60 * 60 * 1000;
  // Respect Search Console's official 3-day telemetry lag over a 28-day window
  const endDate = new Date(now - 3 * dayMs).toISOString().split("T")[0];
  const startDate = new Date(now - 31 * dayMs).toISOString().split("T")[0];
  return { startDate, endDate };
}

function writeJsonAtomically(filePath: string, payload: unknown): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tmpPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  fs.renameSync(tmpPath, filePath);
}

/**
 * Server-side Google Search Console API service.
 * Authenticates with Google OAuth 2.0 via RFC 7523 Service Account JWT (RS256)
 * using credentials defined in environment variables (`GSC_CLIENT_EMAIL`,
 * `GSC_PRIVATE_KEY`, and `GSC_SITE_URL`).
 */
export class GoogleSearchConsoleService {
  private readonly clientEmail?: string;
  private readonly privateKey?: string;
  public readonly siteUrl: string;
  private readonly timeoutMs: number;
  private readonly fetchImpl: typeof fetch;
  private tokenCache: { token: string; expiresAtMs: number } | null = null;

  constructor(options: GscServiceOptions = {}) {
    const envCreds = loadGscCredentialsFromEnv();

    this.clientEmail =
      options.clientEmail?.trim() || envCreds?.clientEmail || undefined;
    const rawKey = options.privateKey?.trim() || envCreds?.privateKey;
    this.privateKey = rawKey ? normalizePrivateKey(rawKey) : undefined;

    const rawSiteUrl =
      options.siteUrl?.trim() ||
      envCreds?.siteUrl ||
      process.env.GSC_SITE_URL?.trim() ||
      DEFAULT_GSC_SITE_URL;
    this.siteUrl = validateSiteUrl(rawSiteUrl);

    this.timeoutMs = options.timeoutMs ?? 5000;
    this.fetchImpl = options.fetchImpl ?? fetch;
  }

  public isConfigured(): boolean {
    return Boolean(this.clientEmail && this.privateKey);
  }

  /**
   * Builds a signed RFC 7523 RS256 JWT assertion for Google OAuth 2.0.
   */
  public createSignedJwtAssertion(nowSeconds = Math.floor(Date.now() / 1000)): string {
    if (!this.clientEmail || !this.privateKey) {
      throw new Error(
        "Google Search Console credentials are not configured (missing GSC_CLIENT_EMAIL or GSC_PRIVATE_KEY)."
      );
    }

    const encodedHeader = Buffer.from(
      JSON.stringify({ alg: "RS256", typ: "JWT" })
    ).toString("base64url");

    const encodedClaims = Buffer.from(
      JSON.stringify({
        iss: this.clientEmail,
        scope: GSC_READONLY_SCOPE,
        aud: GOOGLE_OAUTH_TOKEN_URL,
        exp: nowSeconds + 3600,
        iat: nowSeconds,
      })
    ).toString("base64url");

    const signingInput = `${encodedHeader}.${encodedClaims}`;

    try {
      const signer = crypto.createSign("RSA-SHA256");
      signer.update(signingInput);
      signer.end();
      const signature = signer.sign(this.privateKey, "base64url");
      return `${signingInput}.${signature}`;
    } catch {
      throw new Error(
        "Failed to sign Google Service Account JWT assertion. Verify GSC_PRIVATE_KEY is a valid PEM RSA private key."
      );
    }
  }

  /**
   * Authenticates with Google OAuth 2.0 and returns a scoped Bearer access token.
   * Reuses an in-memory cached token until 2 minutes before expiry.
   */
  public async authenticate(): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error(
        "Google Search Console credentials are not configured (missing GSC_CLIENT_EMAIL or GSC_PRIVATE_KEY)."
      );
    }

    const safetyWindowMs = 2 * 60 * 1000;
    if (
      this.tokenCache &&
      this.tokenCache.expiresAtMs > Date.now() + safetyWindowMs
    ) {
      return this.tokenCache.token;
    }

    const assertion = this.createSignedJwtAssertion();

    const response = await this.fetchImpl(GOOGLE_OAUTH_TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion,
      }).toString(),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!response.ok) {
      throw new Error(
        `Google OAuth token exchange failed (HTTP ${response.status}).`
      );
    }

    const payload = (await response.json()) as {
      access_token?: string;
      expires_in?: number;
    };

    if (!payload.access_token || typeof payload.access_token !== "string") {
      throw new Error("Google OAuth response did not contain an access token.");
    }

    const expiresInSeconds =
      typeof payload.expires_in === "number" && payload.expires_in > 0
        ? payload.expires_in
        : 3600;

    this.tokenCache = {
      token: payload.access_token,
      expiresAtMs: Date.now() + expiresInSeconds * 1000,
    };

    return payload.access_token;
  }

  /**
   * Fetches Search Console query & page performance rows from the live API.
   */
  public async fetchSearchAnalytics(
    options: FetchAnalyticsOptions = {}
  ): Promise<{
    startDate: string;
    endDate: string;
    rows: RawGscQueryRow[];
  }> {
    const defaults = getDefaultDateWindow();
    const startDate = options.startDate
      ? validateIsoDate(options.startDate, "startDate")
      : defaults.startDate;
    const endDate = options.endDate
      ? validateIsoDate(options.endDate, "endDate")
      : defaults.endDate;
    const country = options.country ? options.country.trim().toLowerCase() : "usa";
    const rowLimit = Math.min(Math.max(1, options.rowLimit ?? 250), 25000);

    const accessToken = await this.authenticate();
    const endpoint = `${GSC_API_BASE_URL}/${encodeURIComponent(
      this.siteUrl
    )}/searchAnalytics/query`;

    const requestBody: Record<string, unknown> = {
      startDate,
      endDate,
      dimensions: ["query", "page"],
      type: "web",
      rowLimit,
      startRow: 0,
    };

    if (country) {
      requestBody.dimensionFilterGroups = [
        {
          filters: [
            {
              dimension: "country",
              operator: "equals",
              expression: country,
            },
          ],
        },
      ];
    }

    const response = await this.fetchImpl(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(this.timeoutMs),
    });

    if (!response.ok) {
      throw new Error(
        `Google Search Console API request failed (HTTP ${response.status}).`
      );
    }

    const json = (await response.json()) as {
      rows?: Array<{
        keys?: string[];
        clicks?: number;
        impressions?: number;
        ctr?: number;
        position?: number;
      }>;
    };

    const rows: RawGscQueryRow[] = (json.rows ?? []).map((row) => ({
      query: typeof row.keys?.[0] === "string" ? row.keys[0] : "",
      page: typeof row.keys?.[1] === "string" ? row.keys[1] : "",
      clicks: Math.max(0, Math.round(toSafeNumber(row.clicks))),
      impressions: Math.max(0, Math.round(toSafeNumber(row.impressions))),
      ctr: Math.max(0, toSafeNumber(row.ctr)),
      position: Math.max(0, toSafeNumber(row.position)),
    }));

    return { startDate, endDate, rows };
  }

  /**
   * Authenticates with Google Search Console, fetches search analytics data,
   * selects the top N (default 3) high-impression / low-CTR queries, and
   * atomically stores them in a JSON store on disk.
   */
  public async fetchAndStoreTopLowCtrQueries(
    options: Omit<FetchAndStoreOptions, "serviceOptions"> = {}
  ): Promise<FetchAndStoreResult> {
    const limit = Math.min(Math.max(1, Math.floor(options.limit ?? 3)), 50);
    const allowedBaseDir = options.allowedBaseDir
      ? path.resolve(options.allowedBaseDir)
      : path.resolve(process.cwd(), "content/growth");
    const targetRelativeOrAbs =
      options.storePath ?? path.join(allowedBaseDir, "gsc-top-queries.json");
    const resolvedStorePath = resolveSafeStorePath(
      targetRelativeOrAbs,
      allowedBaseDir
    );

    const criteria = {
      primaryMinImpressions: 100,
      primaryMaxCtr: 0.02,
      fallbackMinImpressions: 10,
      fallbackMaxCtr: 0.03,
    };

    if (!this.isConfigured()) {
      const emptyStore: GscTopQueriesStore = {
        status: "NOT_CONFIGURED",
        source: "none",
        siteUrl: this.siteUrl,
        updatedAt: null,
        dateRange: { startDate: null, endDate: null },
        asOfDate: null,
        totalQueriesAnalyzed: 0,
        topLimit: limit,
        criteria,
        queries: [],
        auditNotice:
          "Google Search Console credentials (GSC_CLIENT_EMAIL and GSC_PRIVATE_KEY) are not configured. Zero fabricated queries stored.",
      };
      return {
        success: false,
        status: "NOT_CONFIGURED",
        storePath: resolvedStorePath,
        written: false,
        data: emptyStore,
        error:
          "Missing GSC_CLIENT_EMAIL or GSC_PRIVATE_KEY environment variables.",
      };
    }

    try {
      const analytics = await this.fetchSearchAnalytics({
        startDate: options.startDate,
        endDate: options.endDate,
        country: options.country,
        rowLimit: options.rowLimit,
      });

      const topQueries = selectTopHighImpressionLowCtrQueries(
        analytics.rows,
        limit
      );

      const storePayload: GscTopQueriesStore = {
        status: "LIVE",
        source: "google_search_console_api",
        siteUrl: this.siteUrl,
        updatedAt: new Date().toISOString(),
        dateRange: {
          startDate: analytics.startDate,
          endDate: analytics.endDate,
        },
        asOfDate: analytics.endDate,
        totalQueriesAnalyzed: analytics.rows.length,
        topLimit: limit,
        criteria,
        queries: topQueries,
        auditNotice:
          "Populated exclusively from authenticated Google Search Console API telemetry. Zero fabricated queries.",
      };

      writeJsonAtomically(resolvedStorePath, storePayload);

      return {
        success: true,
        status: "LIVE",
        storePath: resolvedStorePath,
        written: true,
        data: storePayload,
      };
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unknown Search Console API error";
      const errorStore: GscTopQueriesStore = {
        status: "ERROR",
        source: "none",
        siteUrl: this.siteUrl,
        updatedAt: null,
        dateRange: { startDate: null, endDate: null },
        asOfDate: null,
        totalQueriesAnalyzed: 0,
        topLimit: limit,
        criteria,
        queries: [],
        auditNotice:
          "Search Console API fetch failed. Existing store was preserved without overwriting with fabricated data.",
      };
      return {
        success: false,
        status: "ERROR",
        storePath: resolvedStorePath,
        written: false,
        data: errorStore,
        error: message,
      };
    }
  }
}

/**
 * Convenience function that authenticates with the Google Search Console API
 * using environment variables and fetches + stores the top 3 high-impression /
 * low-CTR queries in `content/growth/gsc-top-queries.json` (or a custom confined path).
 */
export async function fetchAndStoreTopLowCtrQueries(
  options: FetchAndStoreOptions = {}
): Promise<FetchAndStoreResult> {
  const service = new GoogleSearchConsoleService(options.serviceOptions);
  return service.fetchAndStoreTopLowCtrQueries(options);
}
