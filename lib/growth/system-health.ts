import type {
  GscErrorEntry,
  GscErrorReportStore,
  GscErrorStage,
} from "@/lib/services/gsc";

function scrubSensitiveText(rawText: string, maxLength = 320): string {
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

export type GscHealthState = "interrupted" | "healthy" | "unconfigured";

export interface GscHealthViewModel {
  state: GscHealthState;
  hasInterruptions: boolean;
  isSevere: boolean;
  statusLabel: string;
  headline: string;
  description: string;
  siteUrl: string;
  consecutiveFailures: number;
  totalErrorsRecorded: number;
  lastUpdatedAt: string | null;
  formattedLastUpdatedAt: string;
  lastError: GscErrorEntry | null;
  lastErrorStageLabel: string | null;
  formattedLastErrorAt: string | null;
  recentErrors: GscErrorEntry[];
  retryable: boolean | null;
}

const STAGE_LABELS: Record<GscErrorStage, string> = {
  configuration: "Configuration",
  jwt_signing: "JWT Signing",
  oauth_token_exchange: "OAuth Token Exchange",
  search_analytics_fetch: "Search Analytics API",
  store_persistence: "Store Persistence",
};

export function formatGscStageLabel(stage: GscErrorStage): string {
  return STAGE_LABELS[stage] ?? stage;
}

/**
 * Formats an ISO-8601 timestamp into a deterministic UTC display string
 * (e.g., "2026-11-27 22:00 UTC") so server and client renders always match.
 */
export function formatHealthTimestamp(isoString: string | null): string {
  if (!isoString) return "Never";
  const parsed = new Date(isoString);
  if (Number.isNaN(parsed.getTime())) return "Unknown";

  const year = parsed.getUTCFullYear();
  const month = String(parsed.getUTCMonth() + 1).padStart(2, "0");
  const day = String(parsed.getUTCDate()).padStart(2, "0");
  const hours = String(parsed.getUTCHours()).padStart(2, "0");
  const minutes = String(parsed.getUTCMinutes()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes} UTC`;
}

/**
 * Returns a client-safe copy of the persisted GSC error report with bounded
 * history and sanitized text fields.
 */
export function sanitizeClientErrorReport(
  report: GscErrorReportStore | null,
  maxRecentErrors = 10
): GscErrorReportStore | null {
  if (!report) return null;

  const sanitizeEntry = (entry: GscErrorEntry): GscErrorEntry => ({
    timestamp: entry.timestamp,
    stage: entry.stage,
    code: entry.code,
    message: scrubSensitiveText(entry.message, 320),
    httpStatus: entry.httpStatus ?? null,
    endpoint: scrubSensitiveText(entry.endpoint, 240),
    siteUrl: scrubSensitiveText(entry.siteUrl, 160),
    providerError: entry.providerError
      ? scrubSensitiveText(entry.providerError, 120)
      : null,
    providerErrorDescription: entry.providerErrorDescription
      ? scrubSensitiveText(entry.providerErrorDescription, 260)
      : null,
    retryable: Boolean(entry.retryable),
    ...(entry.context ? { context: entry.context } : {}),
  });

  const cappedErrors = Array.isArray(report.errors)
    ? report.errors.slice(0, Math.max(1, maxRecentErrors)).map(sanitizeEntry)
    : [];

  return {
    status: report.status === "DEGRADED" ? "DEGRADED" : "OK",
    siteUrl: scrubSensitiveText(report.siteUrl, 160),
    lastUpdatedAt: report.lastUpdatedAt ?? null,
    totalErrorsRecorded: Math.max(0, Math.round(report.totalErrorsRecorded || 0)),
    consecutiveFailures: Math.max(0, Math.round(report.consecutiveFailures || 0)),
    lastError: report.lastError ? sanitizeEntry(report.lastError) : null,
    errors: cappedErrors,
    auditNotice: scrubSensitiveText(report.auditNotice, 320),
  };
}

/**
 * Evaluates the persisted GSC error report alongside server configuration state
 * to drive the System Health alert UI without guessing or fabricating incidents.
 */
export function evaluateGscSystemHealth(
  report: GscErrorReportStore | null,
  gscConfigured: boolean
): GscHealthViewModel {
  const consecutiveFailures = report?.consecutiveFailures ?? 0;
  const totalErrorsRecorded = report?.totalErrorsRecorded ?? 0;
  const lastError = report?.lastError ?? report?.errors?.[0] ?? null;
  const recentErrors = Array.isArray(report?.errors)
    ? report.errors.slice(0, 5)
    : [];
  const siteUrl = report?.siteUrl ?? "https://www.piperesque.com/";
  const lastUpdatedAt = report?.lastUpdatedAt ?? null;

  const hasInterruptions = Boolean(
    report && (report.status === "DEGRADED" || consecutiveFailures > 0)
  );

  if (hasInterruptions) {
    const failureCount = Math.max(1, consecutiveFailures);
    const isSevere =
      failureCount >= 3 ||
      (lastError !== null && lastError.retryable === false);

    const description =
      lastError?.message ||
      "The Google Search Console API connection encountered an interruption during its latest sync attempt.";

    return {
      state: "interrupted",
      hasInterruptions: true,
      isSevere,
      statusLabel: "Connection Interrupted",
      headline: "Google Search Console API Interruption Detected",
      description,
      siteUrl,
      consecutiveFailures: failureCount,
      totalErrorsRecorded: Math.max(failureCount, totalErrorsRecorded),
      lastUpdatedAt,
      formattedLastUpdatedAt: formatHealthTimestamp(lastUpdatedAt),
      lastError,
      lastErrorStageLabel: lastError
        ? formatGscStageLabel(lastError.stage)
        : null,
      formattedLastErrorAt: lastError
        ? formatHealthTimestamp(lastError.timestamp)
        : null,
      recentErrors,
      retryable: lastError ? lastError.retryable : null,
    };
  }

  if (!gscConfigured) {
    return {
      state: "unconfigured",
      hasInterruptions: false,
      isSevere: false,
      statusLabel: "Credentials Pending",
      headline: "Search Console Monitoring Standby",
      description:
        "Configure GSC_CLIENT_EMAIL and GSC_PRIVATE_KEY on the server to enable live Search Console syncing and automated interruption detection.",
      siteUrl,
      consecutiveFailures: 0,
      totalErrorsRecorded,
      lastUpdatedAt,
      formattedLastUpdatedAt: formatHealthTimestamp(lastUpdatedAt),
      lastError,
      lastErrorStageLabel: lastError
        ? formatGscStageLabel(lastError.stage)
        : null,
      formattedLastErrorAt: lastError
        ? formatHealthTimestamp(lastError.timestamp)
        : null,
      recentErrors,
      retryable: null,
    };
  }

  const resolvedNote =
    totalErrorsRecorded > 0
      ? `No active interruptions (${totalErrorsRecorded} historical ${
          totalErrorsRecorded === 1 ? "incident" : "incidents"
        } resolved).`
      : "No Search Console API interruptions recorded in content/growth/gsc-errors.json.";

  return {
    state: "healthy",
    hasInterruptions: false,
    isSevere: false,
    statusLabel: "Operational",
    headline: "Google Search Console Connection Healthy",
    description: resolvedNote,
    siteUrl,
    consecutiveFailures: 0,
    totalErrorsRecorded,
    lastUpdatedAt,
    formattedLastUpdatedAt: formatHealthTimestamp(lastUpdatedAt),
    lastError,
    lastErrorStageLabel: lastError ? formatGscStageLabel(lastError.stage) : null,
    formattedLastErrorAt: lastError
      ? formatHealthTimestamp(lastError.timestamp)
      : null,
    recentErrors,
    retryable: null,
  };
}
