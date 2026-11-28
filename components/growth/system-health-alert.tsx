"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  KeyRound,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";
import type { GscErrorReportStore } from "@/lib/services/gsc";
import {
  evaluateGscSystemHealth,
  formatGscStageLabel,
  formatHealthTimestamp,
} from "@/lib/growth/system-health";

interface SystemHealthAlertProps {
  initialReport: GscErrorReportStore | null;
  gscConfigured: boolean;
}

interface RetryFeedback {
  tone: "success" | "warning" | "error";
  message: string;
  at: string;
}

interface RetryApiPayload {
  success?: boolean;
  status?: "LIVE" | "NOT_CONFIGURED" | "ERROR" | "RATE_LIMITED";
  configured?: boolean;
  retriedAt?: string;
  message?: string;
  report?: GscErrorReportStore | null;
}

export function SystemHealthAlert({
  initialReport,
  gscConfigured,
}: SystemHealthAlertProps) {
  const router = useRouter();
  const [report, setReport] = useState<GscErrorReportStore | null>(
    initialReport
  );
  const [configured, setConfigured] = useState<boolean>(gscConfigured);
  const [isRetrying, setIsRetrying] = useState<boolean>(false);
  const [showHistory, setShowHistory] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<RetryFeedback | null>(null);

  const health = evaluateGscSystemHealth(report, configured);

  async function handleManualRetry() {
    if (isRetrying) return;
    setIsRetrying(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/growth/gsc-retry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const payload = (await response.json()) as RetryApiPayload;

      if (typeof payload.configured === "boolean") {
        setConfigured(payload.configured);
      }
      if (payload.report !== undefined) {
        setReport(payload.report);
      }

      const timestamp = formatHealthTimestamp(
        payload.retriedAt ?? new Date().toISOString()
      );

      if (response.status === 429 || payload.status === "RATE_LIMITED") {
        setFeedback({
          tone: "warning",
          message:
            payload.message ||
            "Too many manual retry attempts. Please wait a moment and try again.",
          at: timestamp,
        });
        return;
      }

      if (payload.success) {
        setFeedback({
          tone: "success",
          message:
            payload.message ||
            "Google Search Console connection verified and refreshed.",
          at: timestamp,
        });
        router.refresh();
        return;
      }

      setFeedback({
        tone: payload.status === "NOT_CONFIGURED" ? "warning" : "error",
        message:
          payload.message ||
          "Manual retry failed. Check server credentials or upstream Search Console availability.",
        at: timestamp,
      });
    } catch {
      setFeedback({
        tone: "error",
        message:
          "Unable to reach the server retry endpoint. Please verify the application server is running.",
        at: formatHealthTimestamp(new Date().toISOString()),
      });
    } finally {
      setIsRetrying(false);
    }
  }

  const isInterrupted = health.state === "interrupted";
  const isUnconfigured = health.state === "unconfigured";

  const containerClass = isInterrupted
    ? health.isSevere
      ? "bg-rose-950/35 border border-rose-500/45 rounded-xl p-5 sm:p-6"
      : "bg-amber-950/30 border border-amber-500/45 rounded-xl p-5 sm:p-6"
    : "bg-slate-800/70 border border-slate-700/80 rounded-xl px-5 py-4 sm:px-6";

  const statusTextClass = isInterrupted
    ? health.isSevere
      ? "text-rose-300"
      : "text-amber-300"
    : isUnconfigured
      ? "text-slate-300"
      : "text-emerald-400";

  const retryButtonClass = isInterrupted
    ? health.isSevere
      ? "bg-rose-500 hover:bg-rose-400 text-slate-950 focus-visible:ring-rose-300"
      : "bg-amber-400 hover:bg-amber-300 text-slate-950 focus-visible:ring-amber-200"
    : "bg-slate-700 hover:bg-slate-600 text-slate-100 border border-slate-600 focus-visible:ring-blue-400";

  return (
    <section
      aria-label="System Health"
      data-testid="system-health-alert"
      data-health-state={health.state}
      role={isInterrupted ? "alert" : "region"}
      className={containerClass}
    >
      <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
        {/* Left: Status Icon, Heading, Diagnostic Summary */}
        <div className="min-w-0 flex-1 space-y-2">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            {isInterrupted ? (
              <AlertTriangle
                className={`w-5 h-5 shrink-0 ${
                  health.isSevere ? "text-rose-400" : "text-amber-400"
                }`}
                aria-hidden="true"
              />
            ) : isUnconfigured ? (
              <KeyRound
                className="w-5 h-5 shrink-0 text-slate-400"
                aria-hidden="true"
              />
            ) : (
              <ShieldCheck
                className="w-5 h-5 shrink-0 text-emerald-400"
                aria-hidden="true"
              />
            )}

            <h2 className="text-base font-semibold text-white">
              System Health
            </h2>

            <span className="text-slate-500" aria-hidden="true">
              ·
            </span>

            <span
              className={`text-xs font-semibold uppercase tracking-wide ${statusTextClass}`}
              data-testid="system-health-status"
            >
              {health.statusLabel}
            </span>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed">
            {isInterrupted ? (
              <>
                <span className="font-semibold text-white">
                  {health.headline}:
                </span>{" "}
                {health.description}
              </>
            ) : (
              health.description
            )}
          </p>

          {/* Compact unboxed diagnostic metadata row */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-slate-300 font-mono tabular-nums">
            <span>Source: content/growth/gsc-errors.json</span>

            {isInterrupted && (
              <>
                <span className="text-slate-500" aria-hidden="true">
                  ·
                </span>
                <span className={statusTextClass}>
                  {health.consecutiveFailures} consecutive{" "}
                  {health.consecutiveFailures === 1 ? "failure" : "failures"}
                </span>

                {health.lastErrorStageLabel && (
                  <>
                    <span className="text-slate-500" aria-hidden="true">
                      ·
                    </span>
                    <span>Stage: {health.lastErrorStageLabel}</span>
                  </>
                )}

                {health.lastError?.httpStatus !== null &&
                  health.lastError?.httpStatus !== undefined && (
                    <>
                      <span className="text-slate-500" aria-hidden="true">
                        ·
                      </span>
                      <span>HTTP {health.lastError.httpStatus}</span>
                    </>
                  )}

                {health.formattedLastErrorAt && (
                  <>
                    <span className="text-slate-500" aria-hidden="true">
                      ·
                    </span>
                    <span>Last failure: {health.formattedLastErrorAt}</span>
                  </>
                )}

                {health.retryable !== null && (
                  <>
                    <span className="text-slate-500" aria-hidden="true">
                      ·
                    </span>
                    <span>
                      {health.retryable
                        ? "Transient (Retryable)"
                        : "Check Credentials / Permissions"}
                    </span>
                  </>
                )}
              </>
            )}

            {!isInterrupted && health.lastUpdatedAt && (
              <>
                <span className="text-slate-500" aria-hidden="true">
                  ·
                </span>
                <span>Last updated: {health.formattedLastUpdatedAt}</span>
              </>
            )}
          </div>

          {/* Provider detail line if distinct from headline error message */}
          {isInterrupted &&
            health.lastError?.providerErrorDescription &&
            !health.description.includes(
              health.lastError.providerErrorDescription
            ) && (
              <p className="text-xs text-slate-300 font-mono">
                Provider detail: {health.lastError.providerErrorDescription}
              </p>
            )}
        </div>

        {/* Right: Manual Retry Control & Optional History Toggle */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
          {health.recentErrors.length > 0 && (
            <button
              type="button"
              onClick={() => setShowHistory((prev) => !prev)}
              aria-expanded={showHistory}
              data-testid="system-health-history-toggle"
              className="inline-flex items-center gap-1.5 min-h-[40px] px-3 py-2 rounded-lg text-xs font-medium text-slate-200 hover:text-white bg-slate-900/70 hover:bg-slate-900 border border-slate-700 transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer"
            >
              <span>
                {showHistory ? "Hide Log" : "Incident Log"} (
                {health.recentErrors.length})
              </span>
              {showHistory ? (
                <ChevronUp className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              ) : (
                <ChevronDown
                  className="w-3.5 h-3.5 shrink-0"
                  aria-hidden="true"
                />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={handleManualRetry}
            disabled={isRetrying}
            aria-busy={isRetrying}
            data-testid="gsc-manual-retry-button"
            className={`inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer ${retryButtonClass}`}
          >
            <RefreshCw
              className={`w-3.5 h-3.5 shrink-0 ${
                isRetrying ? "animate-spin" : ""
              }`}
              aria-hidden="true"
            />
            <span>{isRetrying ? "Retrying GSC..." : "Retry Connection"}</span>
          </button>
        </div>
      </div>

      {/* Live Retry Outcome Feedback */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          data-testid="gsc-retry-feedback"
          className={`mt-4 pt-3 border-t flex items-start gap-2 text-xs ${
            feedback.tone === "success"
              ? "border-emerald-500/30 text-emerald-300"
              : feedback.tone === "warning"
                ? "border-amber-500/30 text-amber-200"
                : "border-rose-500/30 text-rose-200"
          }`}
        >
          {feedback.tone === "success" ? (
            <CheckCircle2
              className="w-4 h-4 shrink-0 mt-0.5 text-emerald-400"
              aria-hidden="true"
            />
          ) : feedback.tone === "warning" ? (
            <AlertTriangle
              className="w-4 h-4 shrink-0 mt-0.5 text-amber-400"
              aria-hidden="true"
            />
          ) : (
            <XCircle
              className="w-4 h-4 shrink-0 mt-0.5 text-rose-400"
              aria-hidden="true"
            />
          )}
          <div className="min-w-0 flex-1">
            <span>{feedback.message}</span>
            <span className="ml-2 text-slate-400 font-mono tabular-nums">
              ({feedback.at})
            </span>
          </div>
        </div>
      )}

      {/* Expandable Recent Interruption Log */}
      {showHistory && health.recentErrors.length > 0 && (
        <div
          data-testid="system-health-incident-log"
          className="mt-4 pt-4 border-t border-slate-700/70 overflow-x-auto"
        >
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-700/70">
                <th className="py-2 pr-4 font-medium whitespace-nowrap">
                  Timestamp (UTC)
                </th>
                <th className="py-2 pr-4 font-medium whitespace-nowrap">
                  Stage
                </th>
                <th className="py-2 pr-4 font-medium whitespace-nowrap">
                  Code / HTTP
                </th>
                <th className="py-2 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 text-slate-200">
              {health.recentErrors.map((entry, index) => (
                <tr
                  key={`${entry.timestamp}-${entry.code}-${index}`}
                  className="hover:bg-slate-900/40"
                >
                  <td className="py-2.5 pr-4 font-mono tabular-nums text-slate-300 whitespace-nowrap">
                    {formatHealthTimestamp(entry.timestamp)}
                  </td>
                  <td className="py-2.5 pr-4 whitespace-nowrap text-slate-200">
                    {formatGscStageLabel(entry.stage)}
                  </td>
                  <td className="py-2.5 pr-4 font-mono tabular-nums whitespace-nowrap text-amber-300">
                    {entry.code}
                    {entry.httpStatus !== null ? ` (${entry.httpStatus})` : ""}
                  </td>
                  <td className="py-2.5 text-slate-300">{entry.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
