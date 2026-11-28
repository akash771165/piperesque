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
  "content/growth/gsc-opportunities.json";
export const DEFAULT_GSC_ERRORS_STORE_RELATIVE_PATH =
  "content/growth/gsc-errors.json";
export const MAX_STORED_GSC_ERRORS = 50;

export type GscErrorStage =
  | "configuration"
  | "jwt_signing"
  | "oauth_token_exchange"
  | "search_analytics_fetch"
  | "store_persistence";

export type GscErrorCode =
  | "MISSING_CREDENTIALS"
  | "JWT_SIGN_FAILED"
  | "OAUTH_HTTP_ERROR"
  | "OAUTH_NETWORK_ERROR"
  | "OAUTH_TIMEOUT"
  | "OAUTH_INVALID_RESPONSE"
  | "GSC_HTTP_ERROR"
  | "GSC_NETWORK_ERROR"
  | "GSC_TIMEOUT"
  | "GSC_INVALID_RESPONSE"
  | "STORE_WRITE_ERROR"
  | "UNKNOWN_ERROR";

export interface GscErrorContext {
  startDate?: string;
  endDate?: string;
  country?: string;
  rowLimit?: number;
}

export interface GscErrorEntry {
  timestamp: string;
  stage: GscErrorStage;
  code: GscErrorCode;
  message: string;
  httpStatus: number | null;
  endpoint: string;
  siteUrl: string;
  providerError: string | null;
  providerErrorDescription: string | null;
  retryable: boolean;
  context?: GscErrorContext;
}

export interface GscErrorReportStore {
  status: "OK" | "DEGRADED";
  siteUrl: string;
  lastUpdatedAt: string | null;
  totalErrorsRecorded: number;
  consecutiveFailures: number;
  lastError: GscErrorEntry | null;
  errors: GscErrorEntry[];
  auditNotice: string;
}

export interface GscLogger {
  error: (message: string, meta?: Record<string, unknown>) => void;
  warn?: (message: string, meta?: Record<string, unknown>) => void;
}

export interface GscErrorReportTargetOptions {
  errorReportPath?: string;
  allowedBaseDir?: string;
  writeErrorReport?: boolean;
}

export class GscServiceError extends Error {
  public readonly stage: GscErrorStage;
  public readonly code: GscErrorCode;
  public readonly httpStatus: number | null;
  public readonly endpoint: string;
  public readonly providerError: string | null;
  public readonly providerErrorDescription: string | null;
  public readonly retryable: boolean;
  public reported: boolean;
  public errorReportPath?: string;
  public errorReportWritten: boolean;

  constructor(params: {
    message: string;
    stage: GscErrorStage;
    code: GscErrorCode;
    httpStatus?: number | null;
    endpoint: string;
    providerError?: string | null;
    providerErrorDescription?: string | null;
    retryable?: boolean;
    reported?: boolean;
    errorReportPath?: string;
    errorReportWritten?: boolean;
  }) {
    super(params.message);
    this.name = "GscServiceError";
    this.stage = params.stage;
    this.code = params.code;
    this.httpStatus = params.httpStatus ?? null;
    this.endpoint = params.endpoint;
    this.providerError = params.providerError ?? null;
    this.providerErrorDescription = params.providerErrorDescription ?? null;
    this.retryable = params.retryable ?? false;
    this.reported = params.reported ?? false;
    this.errorReportPath = params.errorReportPath;
    this.errorReportWritten = params.errorReportWritten ?? false;
  }
}

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
  logger?: GscLogger;
  errorReportPath?: string;
  allowedBaseDir?: string;
  writeErrorReport?: boolean;
}

export interface FetchAnalyticsOptions extends GscErrorReportTargetOptions {
  startDate?: string;
  endDate?: string;
  country?: string;
  rowLimit?: number;
}

export interface FetchAndStoreOptions extends FetchAnalyticsOptions {
  limit?: number;
  storePath?: string;
  serviceOptions?: GscServiceOptions;
}

export interface FetchAndStoreResult {
  success: boolean;
  status: "LIVE" | "NOT_CONFIGURED" | "ERROR";
  storePath: string;
  written: boolean;
  data: GscTopQueriesStore;
  error?: string;
  errorReportPath?: string;
  errorReportWritten?: boolean;
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
 * Accepts verified `https://` URL-prefix properties (with or without trailing
 * slash, optional surrounding quotes, or bare hostnames) and `sc-domain:` properties.
 */
export function validateSiteUrl(rawSiteUrl: string): string {
  let cleaned = rawSiteUrl.replace(/[\r\n\t]+/g, "").trim();
  while (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    cleaned = cleaned.slice(1, -1).trim();
  }

  if (!cleaned) {
    throw new Error("GSC site URL cannot be empty.");
  }

  if (cleaned.startsWith("sc-domain:")) {
    let domain = cleaned.slice("sc-domain:".length).trim();
    domain = domain.replace(/^https?:\/\//i, "").replace(/\/+$/, "");
    if (!/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(domain)) {
      throw new Error("Invalid sc-domain Search Console property.");
    }
    return `sc-domain:${domain}`;
  }

  // Support bare domain values like `www.piperesque.com` or `www.piperesque.com/`
  if (!cleaned.includes("://") && !cleaned.includes(":")) {
    const bareHost = cleaned.split("/")[0]?.trim() ?? "";
    if (/^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(bareHost)) {
      cleaned = `https://${cleaned}`;
    }
  }

  let parsed: URL;
  try {
    parsed = new URL(cleaned);
  } catch {
    throw new Error("Invalid GSC_SITE_URL format. Must be a valid HTTPS URL.");
  }

  if (parsed.protocol !== "https:") {
    throw new Error("GSC_SITE_URL must use the https: protocol.");
  }

  if (!parsed.hostname || !parsed.hostname.includes(".")) {
    throw new Error("Invalid GSC_SITE_URL format. Must be a valid HTTPS URL.");
  }

  // Collapse redundant trailing slashes and ensure a clean single trailing slash
  const normalizedPathname = parsed.pathname.replace(/\/+$/, "") || "";
  const normalized = `${parsed.origin}${normalizedPathname}/`;
  return normalized;
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

  const strippedSiteUrl = (env.GSC_SITE_URL ?? "")
    .replace(/[\r\n\t]+/g, "")
    .trim()
    .replace(/^["']+|["']+$/g, "")
    .trim();
  const rawSiteUrl = strippedSiteUrl || DEFAULT_GSC_SITE_URL;
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
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.${Math.random()
    .toString(36)
    .slice(2, 8)}.tmp`;
  fs.writeFileSync(tmpPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  fs.renameSync(tmpPath, filePath);
}

/**
 * Strips sensitive credential patterns (PEM private keys, Bearer tokens, OAuth
 * access tokens, JWTs, and form assertion parameters), normalizes whitespace,
 * and caps length so logs and persisted error reports never leak secrets.
 */
export function sanitizeErrorText(
  rawText: string,
  maxLength = 320
): string {
  if (!rawText || typeof rawText !== "string") return "";

  const scrubbed = rawText
    .replace(
      /-----BEGIN [A-Z0-9 ]*PRIVATE KEY-----[\s\S]*?-----END [A-Z0-9 ]*PRIVATE KEY-----/gi,
      "[REDACTED_PRIVATE_KEY]"
    )
    .replace(/Bearer\s+[A-Za-z0-9._~+/=-]+/gi, "Bearer [REDACTED]")
    .replace(/\bya29\.[A-Za-z0-9._-]+\b/g, "[REDACTED_TOKEN]")
    .replace(
      /\beyJ[A-Za-z0-9_-]{8,}\.eyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g,
      "[REDACTED_JWT]"
    )
    .replace(/(assertion|private_key|access_token)=[^&\s]+/gi, "$1=[REDACTED]")
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();

  if (scrubbed.length <= maxLength) {
    return scrubbed;
  }
  return `${scrubbed.slice(0, Math.max(0, maxLength - 3))}...`;
}

function isRetryableHttpStatus(status: number): boolean {
  return status === 408 || status === 429 || (status >= 500 && status <= 599);
}

function isTimeoutError(err: unknown): boolean {
  if (!(err instanceof Error)) return false;
  const name = err.name.toLowerCase();
  const msg = err.message.toLowerCase();
  return (
    name === "timeouterror" ||
    name === "aborterror" ||
    msg.includes("timed out") ||
    msg.includes("timeout") ||
    msg.includes("aborted")
  );
}

async function extractUpstreamErrorDetails(response: Response): Promise<{
  providerError: string | null;
  providerErrorDescription: string | null;
}> {
  try {
    const rawBody = await response.text();
    if (!rawBody) {
      return { providerError: null, providerErrorDescription: null };
    }

    const boundedBody = rawBody.slice(0, 4096);
    try {
      const parsed = JSON.parse(boundedBody) as {
        error?:
          | string
          | {
              code?: number;
              message?: string;
              status?: string;
            };
        error_description?: string;
      };

      // Google OAuth 2.0 format: { error: "invalid_grant", error_description: "..." }
      if (typeof parsed.error === "string") {
        return {
          providerError: sanitizeErrorText(parsed.error, 120) || null,
          providerErrorDescription:
            typeof parsed.error_description === "string"
              ? sanitizeErrorText(parsed.error_description, 260) || null
              : null,
        };
      }

      // Google Search Console REST format: { error: { code, message, status } }
      if (parsed.error && typeof parsed.error === "object") {
        const providerError =
          typeof parsed.error.status === "string"
            ? sanitizeErrorText(parsed.error.status, 120)
            : typeof parsed.error.code === "number"
              ? `HTTP_${parsed.error.code}`
              : null;
        const providerErrorDescription =
          typeof parsed.error.message === "string"
            ? sanitizeErrorText(parsed.error.message, 260)
            : null;
        return {
          providerError: providerError || null,
          providerErrorDescription: providerErrorDescription || null,
        };
      }
    } catch {
      // Non-JSON response body (e.g., upstream 502 HTML gateway page)
      return {
        providerError: null,
        providerErrorDescription: sanitizeErrorText(boundedBody, 200) || null,
      };
    }
  } catch {
    // Ignore body read failures on errored responses
  }

  return { providerError: null, providerErrorDescription: null };
}

function createEmptyErrorReport(siteUrl: string): GscErrorReportStore {
  return {
    status: "OK",
    siteUrl,
    lastUpdatedAt: null,
    totalErrorsRecorded: 0,
    consecutiveFailures: 0,
    lastError: null,
    errors: [],
    auditNotice:
      "Tracks sanitized Google Search Console authentication and API request failures for operational visibility. Never stores private keys or access tokens.",
  };
}

function resolveErrorReportPath(
  options?: GscErrorReportTargetOptions
): string {
  const allowedBaseDir = options?.allowedBaseDir
    ? path.resolve(options.allowedBaseDir)
    : path.resolve(process.cwd(), "content/growth");
  const target =
    options?.errorReportPath ?? path.join(allowedBaseDir, "gsc-errors.json");
  return resolveSafeStorePath(target, allowedBaseDir);
}

/**
 * Reads the persisted GSC error report JSON file (`content/growth/gsc-errors.json` by default).
 * Returns null if the file does not exist or cannot be parsed.
 */
export function readGscErrorReport(
  options?: GscErrorReportTargetOptions
): GscErrorReportStore | null {
  try {
    const resolvedPath = resolveErrorReportPath(options);
    if (!fs.existsSync(resolvedPath)) {
      return null;
    }
    const parsed = JSON.parse(
      fs.readFileSync(resolvedPath, "utf-8")
    ) as Partial<GscErrorReportStore>;
    if (!parsed || typeof parsed !== "object") {
      return null;
    }
    return {
      status: parsed.status === "DEGRADED" ? "DEGRADED" : "OK",
      siteUrl:
        typeof parsed.siteUrl === "string"
          ? parsed.siteUrl
          : DEFAULT_GSC_SITE_URL,
      lastUpdatedAt:
        typeof parsed.lastUpdatedAt === "string" ? parsed.lastUpdatedAt : null,
      totalErrorsRecorded: Math.max(
        0,
        Math.round(toSafeNumber(parsed.totalErrorsRecorded))
      ),
      consecutiveFailures: Math.max(
        0,
        Math.round(toSafeNumber(parsed.consecutiveFailures))
      ),
      lastError: parsed.lastError ?? null,
      errors: Array.isArray(parsed.errors) ? parsed.errors : [],
      auditNotice:
        typeof parsed.auditNotice === "string"
          ? parsed.auditNotice
          : createEmptyErrorReport(DEFAULT_GSC_SITE_URL).auditNotice,
    };
  } catch {
    return null;
  }
}

/**
 * Fallback mechanism that atomically writes a sanitized error report entry to
 * `content/growth/gsc-errors.json` (strictly confined inside `allowedBaseDir`).
 */
export function writeGscErrorReport(
  entry: GscErrorEntry,
  options?: GscErrorReportTargetOptions
): {
  written: boolean;
  errorReportPath: string;
  report: GscErrorReportStore;
} {
  const resolvedPath = resolveErrorReportPath(options);
  const existing =
    readGscErrorReport({
      errorReportPath: resolvedPath,
      allowedBaseDir: options?.allowedBaseDir ?? path.dirname(resolvedPath),
    }) ?? createEmptyErrorReport(entry.siteUrl);

  const sanitizedEntry: GscErrorEntry = {
    ...entry,
    message: sanitizeErrorText(entry.message, 320),
    providerError: entry.providerError
      ? sanitizeErrorText(entry.providerError, 120)
      : null,
    providerErrorDescription: entry.providerErrorDescription
      ? sanitizeErrorText(entry.providerErrorDescription, 260)
      : null,
  };

  const nextErrors = [sanitizedEntry, ...existing.errors].slice(
    0,
    MAX_STORED_GSC_ERRORS
  );

  const report: GscErrorReportStore = {
    status: "DEGRADED",
    siteUrl: sanitizedEntry.siteUrl,
    lastUpdatedAt: sanitizedEntry.timestamp,
    totalErrorsRecorded: existing.totalErrorsRecorded + 1,
    consecutiveFailures: existing.consecutiveFailures + 1,
    lastError: sanitizedEntry,
    errors: nextErrors,
    auditNotice:
      "Fallback error report generated by GoogleSearchConsoleService after an API or authentication failure. Sensitive credentials are redacted.",
  };

  try {
    writeJsonAtomically(resolvedPath, report);
    return {
      written: true,
      errorReportPath: resolvedPath,
      report,
    };
  } catch {
    return {
      written: false,
      errorReportPath: resolvedPath,
      report,
    };
  }
}

function markGscErrorReportRecovered(
  siteUrl: string,
  options?: GscErrorReportTargetOptions
): void {
  try {
    const resolvedPath = resolveErrorReportPath(options);
    if (!fs.existsSync(resolvedPath)) {
      return;
    }
    const existing = readGscErrorReport({
      errorReportPath: resolvedPath,
      allowedBaseDir: options?.allowedBaseDir ?? path.dirname(resolvedPath),
    });
    if (!existing || existing.status !== "DEGRADED") {
      return;
    }

    const recovered: GscErrorReportStore = {
      ...existing,
      status: "OK",
      siteUrl,
      lastUpdatedAt: new Date().toISOString(),
      consecutiveFailures: 0,
    };
    writeJsonAtomically(resolvedPath, recovered);
  } catch {
    // Recovery update is best-effort and must never fail a successful fetch
  }
}

const defaultGscLogger: GscLogger = {
  error(message: string, meta?: Record<string, unknown>) {
    if (meta) {
      console.error(message, JSON.stringify(meta));
    } else {
      console.error(message);
    }
  },
  warn(message: string, meta?: Record<string, unknown>) {
    if (meta) {
      console.warn(message, JSON.stringify(meta));
    } else {
      console.warn(message);
    }
  },
};

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
  private readonly logger: GscLogger;
  private readonly defaultErrorReportPath?: string;
  private readonly defaultAllowedBaseDir?: string;
  private readonly writeErrorReportByDefault: boolean;
  private tokenCache: { token: string; expiresAtMs: number } | null = null;

  constructor(options: GscServiceOptions = {}) {
    const envCreds = loadGscCredentialsFromEnv();

    this.clientEmail =
      options.clientEmail?.trim() || envCreds?.clientEmail || undefined;
    const rawKey = options.privateKey?.trim() || envCreds?.privateKey;
    this.privateKey = rawKey ? normalizePrivateKey(rawKey) : undefined;

    const strippedEnvSiteUrl = (process.env.GSC_SITE_URL ?? "")
      .replace(/[\r\n\t]+/g, "")
      .trim()
      .replace(/^["']+|["']+$/g, "")
      .trim();
    const rawSiteUrl =
      options.siteUrl?.trim() ||
      envCreds?.siteUrl ||
      strippedEnvSiteUrl ||
      DEFAULT_GSC_SITE_URL;
    this.siteUrl = validateSiteUrl(rawSiteUrl);

    this.timeoutMs = options.timeoutMs ?? 5000;
    this.fetchImpl = options.fetchImpl ?? fetch;
    this.logger = options.logger ?? defaultGscLogger;
    this.defaultErrorReportPath = options.errorReportPath;
    this.defaultAllowedBaseDir = options.allowedBaseDir;
    this.writeErrorReportByDefault = options.writeErrorReport ?? true;
  }

  public isConfigured(): boolean {
    return Boolean(this.clientEmail && this.privateKey);
  }

  private getEffectiveErrorTarget(
    override?: GscErrorReportTargetOptions
  ): {
    writeErrorReport: boolean;
    errorReportPath?: string;
    allowedBaseDir?: string;
  } {
    return {
      writeErrorReport:
        override?.writeErrorReport ?? this.writeErrorReportByDefault,
      errorReportPath: override?.errorReportPath ?? this.defaultErrorReportPath,
      allowedBaseDir: override?.allowedBaseDir ?? this.defaultAllowedBaseDir,
    };
  }

  /**
   * Logs a structured, credential-safe error and writes a fallback error report
   * to `content/growth/gsc-errors.json` (or configured confined path).
   */
  private logAndReportError(params: {
    stage: GscErrorStage;
    code: GscErrorCode;
    message: string;
    endpoint: string;
    httpStatus?: number | null;
    providerError?: string | null;
    providerErrorDescription?: string | null;
    retryable?: boolean;
    context?: GscErrorContext;
    errorTarget?: GscErrorReportTargetOptions;
  }): GscServiceError {
    const sanitizedMessage = sanitizeErrorText(params.message, 320);
    const providerError = params.providerError
      ? sanitizeErrorText(params.providerError, 120)
      : null;
    const providerErrorDescription = params.providerErrorDescription
      ? sanitizeErrorText(params.providerErrorDescription, 260)
      : null;
    const timestamp = new Date().toISOString();

    const entry: GscErrorEntry = {
      timestamp,
      stage: params.stage,
      code: params.code,
      message: sanitizedMessage,
      httpStatus: params.httpStatus ?? null,
      endpoint: params.endpoint,
      siteUrl: this.siteUrl,
      providerError,
      providerErrorDescription,
      retryable: params.retryable ?? false,
      ...(params.context ? { context: params.context } : {}),
    };

    const target = this.getEffectiveErrorTarget(params.errorTarget);
    let errorReportPath: string | undefined;
    let errorReportWritten = false;

    if (target.writeErrorReport) {
      try {
        const persisted = writeGscErrorReport(entry, {
          errorReportPath: target.errorReportPath,
          allowedBaseDir: target.allowedBaseDir,
        });
        errorReportPath = persisted.errorReportPath;
        errorReportWritten = persisted.written;
        if (!persisted.written) {
          this.logger.warn?.(
            `[GSC Service] Unable to persist fallback error report to ${persisted.errorReportPath}`,
            {
              stage: entry.stage,
              code: entry.code,
            }
          );
        }
      } catch (reportErr) {
        const reportErrMsg =
          reportErr instanceof Error
            ? sanitizeErrorText(reportErr.message, 200)
            : "Failed to resolve error report path";
        this.logger.warn?.(
          `[GSC Service] Fallback error report skipped: ${reportErrMsg}`,
          {
            stage: entry.stage,
            code: entry.code,
          }
        );
      }
    }

    this.logger.error(`[GSC Service] ${entry.stage} failed (${entry.code}): ${entry.message}`, {
      timestamp: entry.timestamp,
      stage: entry.stage,
      code: entry.code,
      httpStatus: entry.httpStatus,
      endpoint: entry.endpoint,
      siteUrl: entry.siteUrl,
      providerError: entry.providerError,
      providerErrorDescription: entry.providerErrorDescription,
      retryable: entry.retryable,
      ...(entry.context ? { context: entry.context } : {}),
      errorReportWritten,
    });

    return new GscServiceError({
      message: sanitizedMessage,
      stage: entry.stage,
      code: entry.code,
      httpStatus: entry.httpStatus,
      endpoint: entry.endpoint,
      providerError: entry.providerError,
      providerErrorDescription: entry.providerErrorDescription,
      retryable: entry.retryable,
      reported: true,
      errorReportPath,
      errorReportWritten,
    });
  }

  /**
   * Builds a signed RFC 7523 RS256 JWT assertion for Google OAuth 2.0.
   */
  public createSignedJwtAssertion(nowSeconds = Math.floor(Date.now() / 1000)): string {
    if (!this.clientEmail || !this.privateKey) {
      throw new GscServiceError({
        message:
          "Google Search Console credentials are not configured (missing GSC_CLIENT_EMAIL or GSC_PRIVATE_KEY).",
        stage: "configuration",
        code: "MISSING_CREDENTIALS",
        endpoint: GOOGLE_OAUTH_TOKEN_URL,
        retryable: false,
      });
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
      throw new GscServiceError({
        message:
          "Failed to sign Google Service Account JWT assertion. Verify GSC_PRIVATE_KEY is a valid PEM RSA private key.",
        stage: "jwt_signing",
        code: "JWT_SIGN_FAILED",
        endpoint: GOOGLE_OAUTH_TOKEN_URL,
        retryable: false,
      });
    }
  }

  /**
   * Authenticates with Google OAuth 2.0 and returns a scoped Bearer access token.
   * Reuses an in-memory cached token until 2 minutes before expiry.
   * Logs sanitized failure metadata and writes a fallback error report on failure.
   */
  public async authenticate(
    errorTarget?: GscErrorReportTargetOptions
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw this.logAndReportError({
        stage: "configuration",
        code: "MISSING_CREDENTIALS",
        message:
          "Google Search Console credentials are not configured (missing GSC_CLIENT_EMAIL or GSC_PRIVATE_KEY).",
        endpoint: GOOGLE_OAUTH_TOKEN_URL,
        retryable: false,
        errorTarget,
      });
    }

    const safetyWindowMs = 2 * 60 * 1000;
    if (
      this.tokenCache &&
      this.tokenCache.expiresAtMs > Date.now() + safetyWindowMs
    ) {
      return this.tokenCache.token;
    }

    let assertion: string;
    try {
      assertion = this.createSignedJwtAssertion();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to sign Google Service Account JWT assertion.";
      throw this.logAndReportError({
        stage: "jwt_signing",
        code: "JWT_SIGN_FAILED",
        message,
        endpoint: GOOGLE_OAUTH_TOKEN_URL,
        retryable: false,
        errorTarget,
      });
    }

    let response: Response;
    try {
      response = await this.fetchImpl(GOOGLE_OAUTH_TOKEN_URL, {
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
    } catch (err) {
      const timedOut = isTimeoutError(err);
      const rawReason =
        err instanceof Error ? err.message : "Network request failed";
      throw this.logAndReportError({
        stage: "oauth_token_exchange",
        code: timedOut ? "OAUTH_TIMEOUT" : "OAUTH_NETWORK_ERROR",
        message: timedOut
          ? `Google OAuth token exchange timed out after ${this.timeoutMs}ms.`
          : `Google OAuth token exchange network error: ${sanitizeErrorText(rawReason, 180)}`,
        endpoint: GOOGLE_OAUTH_TOKEN_URL,
        retryable: true,
        errorTarget,
      });
    }

    if (!response.ok) {
      const details = await extractUpstreamErrorDetails(response);
      const detailSuffix = details.providerError
        ? ` (${details.providerError}${
            details.providerErrorDescription
              ? `: ${details.providerErrorDescription}`
              : ""
          })`
        : "";
      throw this.logAndReportError({
        stage: "oauth_token_exchange",
        code: "OAUTH_HTTP_ERROR",
        message: `Google OAuth token exchange failed (HTTP ${response.status})${detailSuffix}.`,
        httpStatus: response.status,
        endpoint: GOOGLE_OAUTH_TOKEN_URL,
        providerError: details.providerError,
        providerErrorDescription: details.providerErrorDescription,
        retryable: isRetryableHttpStatus(response.status),
        errorTarget,
      });
    }

    let payload: { access_token?: string; expires_in?: number };
    try {
      payload = (await response.json()) as {
        access_token?: string;
        expires_in?: number;
      };
    } catch {
      throw this.logAndReportError({
        stage: "oauth_token_exchange",
        code: "OAUTH_INVALID_RESPONSE",
        message: "Google OAuth token endpoint returned malformed JSON.",
        httpStatus: response.status,
        endpoint: GOOGLE_OAUTH_TOKEN_URL,
        retryable: false,
        errorTarget,
      });
    }

    if (!payload.access_token || typeof payload.access_token !== "string") {
      throw this.logAndReportError({
        stage: "oauth_token_exchange",
        code: "OAUTH_INVALID_RESPONSE",
        message: "Google OAuth response did not contain an access token.",
        httpStatus: response.status,
        endpoint: GOOGLE_OAUTH_TOKEN_URL,
        retryable: false,
        errorTarget,
      });
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
   * Logs sanitized failure metadata and writes a fallback error report on failure.
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

    const errorTarget: GscErrorReportTargetOptions = {
      errorReportPath: options.errorReportPath,
      allowedBaseDir: options.allowedBaseDir,
      writeErrorReport: options.writeErrorReport,
    };

    const requestContext: GscErrorContext = {
      startDate,
      endDate,
      country,
      rowLimit,
    };

    const accessToken = await this.authenticate(errorTarget);
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

    let response: Response;
    try {
      response = await this.fetchImpl(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
        signal: AbortSignal.timeout(this.timeoutMs),
      });
    } catch (err) {
      const timedOut = isTimeoutError(err);
      const rawReason =
        err instanceof Error ? err.message : "Network request failed";
      throw this.logAndReportError({
        stage: "search_analytics_fetch",
        code: timedOut ? "GSC_TIMEOUT" : "GSC_NETWORK_ERROR",
        message: timedOut
          ? `Google Search Console API request timed out after ${this.timeoutMs}ms.`
          : `Google Search Console API network error: ${sanitizeErrorText(rawReason, 180)}`,
        endpoint,
        retryable: true,
        context: requestContext,
        errorTarget,
      });
    }

    if (!response.ok) {
      // Clear cached token on 401 so subsequent calls re-authenticate cleanly
      if (response.status === 401) {
        this.tokenCache = null;
      }

      const details = await extractUpstreamErrorDetails(response);
      const detailSuffix = details.providerError
        ? ` (${details.providerError}${
            details.providerErrorDescription
              ? `: ${details.providerErrorDescription}`
              : ""
          })`
        : "";

      throw this.logAndReportError({
        stage: "search_analytics_fetch",
        code: "GSC_HTTP_ERROR",
        message: `Google Search Console API request failed (HTTP ${response.status})${detailSuffix}.`,
        httpStatus: response.status,
        endpoint,
        providerError: details.providerError,
        providerErrorDescription: details.providerErrorDescription,
        retryable: isRetryableHttpStatus(response.status),
        context: requestContext,
        errorTarget,
      });
    }

    let json: {
      rows?: Array<{
        keys?: string[];
        clicks?: number;
        impressions?: number;
        ctr?: number;
        position?: number;
      }>;
    };

    try {
      json = (await response.json()) as {
        rows?: Array<{
          keys?: string[];
          clicks?: number;
          impressions?: number;
          ctr?: number;
          position?: number;
        }>;
      };
    } catch {
      throw this.logAndReportError({
        stage: "search_analytics_fetch",
        code: "GSC_INVALID_RESPONSE",
        message: "Google Search Console API returned malformed JSON.",
        httpStatus: response.status,
        endpoint,
        retryable: false,
        context: requestContext,
        errorTarget,
      });
    }

    const rows: RawGscQueryRow[] = (json.rows ?? []).map((row) => ({
      query: typeof row.keys?.[0] === "string" ? row.keys[0] : "",
      page: typeof row.keys?.[1] === "string" ? row.keys[1] : "",
      clicks: Math.max(0, Math.round(toSafeNumber(row.clicks))),
      impressions: Math.max(0, Math.round(toSafeNumber(row.impressions))),
      ctr: Math.max(0, toSafeNumber(row.ctr)),
      position: Math.max(0, toSafeNumber(row.position)),
    }));

    const effectiveTarget = this.getEffectiveErrorTarget(errorTarget);
    if (effectiveTarget.writeErrorReport) {
      markGscErrorReportRecovered(this.siteUrl, {
        errorReportPath: effectiveTarget.errorReportPath,
        allowedBaseDir: effectiveTarget.allowedBaseDir,
      });
    }

    return { startDate, endDate, rows };
  }

  /**
   * Authenticates with Google Search Console, fetches search analytics data,
   * selects the top N (default 3) high-impression / low-CTR queries, and
   * atomically stores them in a JSON store on disk.
   * On API failure, preserves any existing opportunities store and writes a
   * sanitized error report to `content/growth/gsc-errors.json`.
   */
  public async fetchAndStoreTopLowCtrQueries(
    options: Omit<FetchAndStoreOptions, "serviceOptions"> = {}
  ): Promise<FetchAndStoreResult> {
    const limit = Math.min(Math.max(1, Math.floor(options.limit ?? 3)), 50);
    const allowedBaseDir = options.allowedBaseDir
      ? path.resolve(options.allowedBaseDir)
      : this.defaultAllowedBaseDir
        ? path.resolve(this.defaultAllowedBaseDir)
        : path.resolve(process.cwd(), "content/growth");
    const targetRelativeOrAbs =
      options.storePath ?? path.join(allowedBaseDir, "gsc-opportunities.json");
    const resolvedStorePath = resolveSafeStorePath(
      targetRelativeOrAbs,
      allowedBaseDir
    );
    const resolvedErrorReportPath = resolveSafeStorePath(
      options.errorReportPath ??
        this.defaultErrorReportPath ??
        path.join(allowedBaseDir, "gsc-errors.json"),
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
        errorReportPath: resolvedErrorReportPath,
        errorReportWritten: false,
      };
    }

    try {
      const analytics = await this.fetchSearchAnalytics({
        startDate: options.startDate,
        endDate: options.endDate,
        country: options.country,
        rowLimit: options.rowLimit,
        errorReportPath: resolvedErrorReportPath,
        allowedBaseDir,
        writeErrorReport: options.writeErrorReport,
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
        errorReportPath: resolvedErrorReportPath,
        errorReportWritten: false,
      };
    } catch (err) {
      let reportedError: GscServiceError;
      if (err instanceof GscServiceError && err.reported) {
        reportedError = err;
      } else {
        const message =
          err instanceof Error
            ? err.message
            : "Unknown Search Console API error";
        reportedError = this.logAndReportError({
          stage: "store_persistence",
          code: "STORE_WRITE_ERROR",
          message,
          endpoint: `${GSC_API_BASE_URL}/${encodeURIComponent(
            this.siteUrl
          )}/searchAnalytics/query`,
          retryable: false,
          errorTarget: {
            errorReportPath: resolvedErrorReportPath,
            allowedBaseDir,
            writeErrorReport: options.writeErrorReport,
          },
        });
      }

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
          "Search Console API fetch failed. Existing store was preserved without overwriting with fabricated data, and error details were written to content/growth/gsc-errors.json.",
      };
      return {
        success: false,
        status: "ERROR",
        storePath: resolvedStorePath,
        written: false,
        data: errorStore,
        error: reportedError.message,
        errorReportPath:
          reportedError.errorReportPath ?? resolvedErrorReportPath,
        errorReportWritten: reportedError.errorReportWritten,
      };
    }
  }
}

/**
 * Authenticates with the Google Search Console API using GSC_CLIENT_EMAIL
 * and GSC_PRIVATE_KEY from environment variables and returns a Bearer token.
 */
export async function authenticateGsc(
  options: GscServiceOptions = {}
): Promise<string> {
  const service = new GoogleSearchConsoleService(options);
  return service.authenticate();
}

/**
 * Convenience function that authenticates with the Google Search Console API
 * using environment variables and fetches + stores the top 3 high-impression /
 * low-CTR queries in `content/growth/gsc-opportunities.json` (or a custom confined path).
 */
export async function fetchAndStoreTopLowCtrQueries(
  options: FetchAndStoreOptions = {}
): Promise<FetchAndStoreResult> {
  const service = new GoogleSearchConsoleService(options.serviceOptions);
  return service.fetchAndStoreTopLowCtrQueries(options);
}
