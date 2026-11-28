"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  Clock,
  RefreshCw,
  X,
  XCircle,
} from "lucide-react";
import { formatHealthTimestamp } from "@/lib/growth/system-health";

interface GscManualSyncHeaderProps {
  children: ReactNode;
  scheduleLabel: string;
  asOfDate: string;
  lastSyncedAt?: string | null;
}

interface SyncApiPayload {
  success?: boolean;
  status?: "LIVE" | "NOT_CONFIGURED" | "ERROR" | "RATE_LIMITED";
  syncedAt?: string;
  storeFile?: string;
  written?: boolean;
  asOfDate?: string | null;
  queriesFound?: number;
  totalQueriesAnalyzed?: number;
  message?: string;
}

interface SyncFeedback {
  tone: "success" | "warning" | "error";
  message: string;
  storeFile: string;
  at: string;
}

export function GscManualSyncHeader({
  children,
  scheduleLabel,
  asOfDate,
  lastSyncedAt,
}: GscManualSyncHeaderProps) {
  const router = useRouter();
  const [isSyncing, setIsSyncing] = useState(false);
  const [feedback, setFeedback] = useState<SyncFeedback | null>(null);
  const [latestSyncedAt, setLatestSyncedAt] = useState<string | null>(
    lastSyncedAt ?? null
  );

  async function handleManualGscSync() {
    if (isSyncing) return;
    setIsSyncing(true);
    setFeedback(null);

    try {
      const response = await fetch("/api/growth/gsc-sync", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ limit: 3 }),
      });

      const payload = (await response.json()) as SyncApiPayload;
      const timestamp = formatHealthTimestamp(
        payload.syncedAt ?? new Date().toISOString()
      );
      const targetFile =
        payload.storeFile ?? "content/growth/gsc-opportunities.json";

      if (response.status === 429 || payload.status === "RATE_LIMITED") {
        setFeedback({
          tone: "warning",
          message:
            payload.message ||
            "Too many manual GSC sync attempts. Please wait a moment and try again.",
          storeFile: targetFile,
          at: timestamp,
        });
        return;
      }

      if (payload.success) {
        if (payload.syncedAt) {
          setLatestSyncedAt(payload.syncedAt);
        }
        setFeedback({
          tone: "success",
          message:
            payload.message ||
            `Pulled fresh Search Console opportunities into ${targetFile}.`,
          storeFile: targetFile,
          at: timestamp,
        });
        router.refresh();
        return;
      }

      setFeedback({
        tone: payload.status === "NOT_CONFIGURED" ? "warning" : "error",
        message:
          payload.message ||
          "Google Search Console sync failed. Check server credentials and try again.",
        storeFile: targetFile,
        at: timestamp,
      });
      router.refresh();
    } catch {
      setFeedback({
        tone: "error",
        message:
          "Unable to reach the GSC sync endpoint. Please verify the application server is running.",
        storeFile: "content/growth/gsc-opportunities.json",
        at: formatHealthTimestamp(new Date().toISOString()),
      });
    } finally {
      setIsSyncing(false);
    }
  }

  return (
    <div className="border-b border-slate-800 pb-6 space-y-4">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
        <div className="min-w-0">{children}</div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
              <Clock className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              <span>{scheduleLabel}</span>
            </span>
            <span className="text-slate-600" aria-hidden="true">
              ·
            </span>
            <span className="font-mono tabular-nums text-slate-300 whitespace-nowrap">
              As-Of: {asOfDate}
            </span>
            {latestSyncedAt && (
              <>
                <span className="text-slate-600" aria-hidden="true">
                  ·
                </span>
                <span className="font-mono tabular-nums text-slate-400 whitespace-nowrap">
                  Last GSC Sync: {formatHealthTimestamp(latestSyncedAt)}
                </span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleManualGscSync}
            disabled={isSyncing}
            aria-busy={isSyncing}
            data-testid="gsc-manual-sync-button"
            className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
          >
            <RefreshCw
              className={`w-3.5 h-3.5 shrink-0 ${
                isSyncing ? "animate-spin" : ""
              }`}
              aria-hidden="true"
            />
            <span>{isSyncing ? "Syncing GSC..." : "Sync GSC Now"}</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          role="status"
          aria-live="polite"
          data-testid="gsc-manual-sync-feedback"
          data-sync-tone={feedback.tone}
          className={`rounded-lg border px-4 py-3 flex items-start justify-between gap-3 text-xs ${
            feedback.tone === "success"
              ? "bg-emerald-950/35 border-emerald-500/40 text-emerald-200"
              : feedback.tone === "warning"
                ? "bg-amber-950/35 border-amber-500/40 text-amber-200"
                : "bg-rose-950/35 border-rose-500/40 text-rose-200"
          }`}
        >
          <div className="flex items-start gap-2.5 min-w-0">
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
            <div className="min-w-0 space-y-0.5">
              <p className="leading-relaxed">{feedback.message}</p>
              <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-slate-400 font-mono tabular-nums">
                <span>Target: {feedback.storeFile}</span>
                <span aria-hidden="true">·</span>
                <span>{feedback.at}</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setFeedback(null)}
            aria-label="Dismiss GSC sync status"
            className="p-1 rounded text-slate-400 hover:text-white transition-colors shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" aria-hidden="true" />
          </button>
        </div>
      )}
    </div>
  );
}
