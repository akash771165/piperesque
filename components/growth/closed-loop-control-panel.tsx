"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  AlertTriangle,
  PhoneCall,
  FileText,
  Sparkles,
  Play,
  Target,
  TrendingUp,
  Search,
  Loader2,
  ArrowUpRight,
  MousePointerClick,
} from "lucide-react";
import { ConnectionSetupPanel } from "@/components/growth/connection-setup-panel";
import type {
  ClosedLoopRevenueStore,
  GscPerformanceStore,
  SeoOverridesStore,
} from "@/lib/growth/closed-loop-store";

interface ClosedLoopControlPanelProps {
  initialRevenue: ClosedLoopRevenueStore;
  initialGsc: GscPerformanceStore;
  initialOverrides: SeoOverridesStore;
  dailyLeadTarget: number;
}

interface ActionResponse {
  success: boolean;
  action?: "simulate_lead" | "run_optimizer";
  message?: string;
  error?: string;
  revenueStore?: ClosedLoopRevenueStore;
  gscStore?: GscPerformanceStore;
  overrides?: SeoOverridesStore;
}

function formatUsd(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat("en-US").format(Math.round(value));
}

function formatShortTime(iso: string | null): string {
  if (!iso) return "Not run yet";
  const parsed = new Date(iso);
  if (Number.isNaN(parsed.getTime())) return iso;
  return parsed.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function ClosedLoopControlPanel({
  initialRevenue,
  initialGsc,
  initialOverrides,
  dailyLeadTarget,
}: ClosedLoopControlPanelProps) {
  const router = useRouter();
  const [isRefreshing, startTransition] = useTransition();

  // Stamp-keyed optimistic state: immediately displays API mutations, then seamlessly adopts fresh server props on router.refresh()
  const revStamp = `${initialRevenue.lastUpdated ?? ""}:${initialRevenue.qualifiedLeads}:${initialRevenue.revenue}:${initialRevenue.callIntents}:${initialRevenue.formIntents}`;
  const gscStamp = `${initialGsc.lastSyncedAt ?? ""}:${initialGsc.pages.length}:${initialGsc.totals.impressions}`;
  const ovStamp = `${initialOverrides.lastOptimizedAt ?? ""}:${Object.keys(initialOverrides.pages).length}`;

  const [optimisticRev, setOptimisticRev] = useState<{
    stamp: string;
    data: ClosedLoopRevenueStore;
  } | null>(null);
  const [optimisticGsc, setOptimisticGsc] = useState<{
    stamp: string;
    data: GscPerformanceStore;
  } | null>(null);
  const [optimisticOv, setOptimisticOv] = useState<{
    stamp: string;
    data: SeoOverridesStore;
  } | null>(null);

  const revenueStore =
    optimisticRev && optimisticRev.stamp === revStamp
      ? optimisticRev.data
      : initialRevenue;
  const gscStore =
    optimisticGsc && optimisticGsc.stamp === gscStamp
      ? optimisticGsc.data
      : initialGsc;
  const overrides =
    optimisticOv && optimisticOv.stamp === ovStamp
      ? optimisticOv.data
      : initialOverrides;

  const [pendingAction, setPendingAction] = useState<
    "simulate_lead" | "run_optimizer" | null
  >(null);
  const [feedback, setFeedback] = useState<{
    tone: "success" | "error";
    text: string;
  } | null>(null);

  const todayKey = new Date().toISOString().slice(0, 10);
  const todayQualifiedLeads = revenueStore.dailyQualifiedLeads[todayKey] ?? 0;
  const safeTarget = Math.max(1, dailyLeadTarget);
  const goalPct = Math.min(
    100,
    Math.round((todayQualifiedLeads / safeTarget) * 100)
  );
  const goalMet = todayQualifiedLeads >= safeTarget;

  const effectiveCallIntents = Math.max(
    revenueStore.callIntents,
    revenueStore.soldCalls
  );
  const effectiveFormIntents = Math.max(
    revenueStore.formIntents,
    revenueStore.soldForms
  );
  const totalIntents = effectiveCallIntents + effectiveFormIntents;
  const optimizedPages = Object.values(overrides.pages).sort(
    (a, b) => b.impressions - a.impressions
  );
  const lowCtrCandidatesCount = gscStore.pages.filter(
    (p) => p.impressions > 100 && p.ctr < 2.5
  ).length;

  async function runDashboardAction(action: "simulate_lead" | "run_optimizer") {
    if (pendingAction) return;
    setPendingAction(action);
    setFeedback(null);

    try {
      const response = await fetch("/api/growth/closed-loop", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        cache: "no-store",
        body: JSON.stringify({ action }),
      });

      const rawText = await response.text();
      let payload: ActionResponse;
      try {
        payload = JSON.parse(rawText) as ActionResponse;
      } catch {
        setFeedback({
          tone: "error",
          text: `Unexpected server response (HTTP ${response.status}) from /api/growth/closed-loop. Please retry.`,
        });
        return;
      }

      if (!response.ok || !payload.success) {
        setFeedback({
          tone: "error",
          text:
            payload.error ||
            `Action failed (HTTP ${response.status}). Check server logs and try again.`,
        });
        return;
      }

      if (payload.revenueStore) {
        setOptimisticRev({ stamp: revStamp, data: payload.revenueStore });
      }
      if (payload.gscStore) {
        setOptimisticGsc({ stamp: gscStamp, data: payload.gscStore });
      }
      if (payload.overrides) {
        setOptimisticOv({ stamp: ovStamp, data: payload.overrides });
      }

      setFeedback({
        tone: "success",
        text:
          payload.message ||
          (action === "simulate_lead"
            ? "Test lead recorded in data/revenue-store.json."
            : "Auto-optimizer finished updating data/seo-overrides.json."),
      });

      startTransition(() => {
        router.refresh();
      });
    } catch (err) {
      const detail = err instanceof Error ? ` (${err.message})` : "";
      setFeedback({
        tone: "error",
        text: `Unable to reach /api/growth/closed-loop${detail}. Please retry.`,
      });
    } finally {
      setPendingAction(null);
    }
  }

  return (
    <section
      aria-label="Closed-Loop Lead Generation and SEO Control Panel"
      className="bg-slate-800/70 border border-slate-700/80 rounded-xl p-6 space-y-6"
    >
      {/* Top Header & Direct Control Actions */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-slate-700/80 pb-5">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400 shrink-0" aria-hidden="true" />
            Closed-Loop Lead &amp; SEO Automation Engine
          </h2>
          <p className="text-xs text-slate-400">
            Live sync from <code className="text-slate-300">data/revenue-store.json</code>,{" "}
            <code className="text-slate-300">data/gsc-store.json</code>, and{" "}
            <code className="text-slate-300">data/seo-overrides.json</code>
            <span className="mx-2 text-slate-600">·</span>
            Last optimized: {formatShortTime(overrides.lastOptimizedAt)}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            type="button"
            data-testid="simulate-test-lead-button"
            disabled={pendingAction !== null}
            onClick={() => runDashboardAction("simulate_lead")}
            className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 bg-emerald-600 text-white hover:bg-emerald-500 transition disabled:opacity-60 cursor-pointer"
          >
            {pendingAction === "simulate_lead" ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Play className="w-4 h-4" aria-hidden="true" />
            )}
            <span>Simulate Test Lead</span>
          </button>

          <button
            type="button"
            data-testid="run-auto-optimizer-button"
            disabled={pendingAction !== null}
            onClick={() => runDashboardAction("run_optimizer")}
            className="inline-flex items-center justify-center gap-2 min-h-[40px] px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap shrink-0 bg-blue-600 text-white hover:bg-blue-500 transition disabled:opacity-60 cursor-pointer"
          >
            {pendingAction === "run_optimizer" ? (
              <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles className="w-4 h-4" aria-hidden="true" />
            )}
            <span>Run Auto-Optimizer Now</span>
          </button>
        </div>
      </div>

      {/* Live Action Status Feedback */}
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          data-testid="closed-loop-feedback"
          className={`flex items-start gap-2.5 rounded-lg border px-4 py-3 text-xs ${
            feedback.tone === "success"
              ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-200"
              : "bg-rose-950/60 border-rose-500/40 text-rose-200"
          }`}
        >
          {feedback.tone === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" aria-hidden="true" />
          )}
          <span className="leading-relaxed">
            {feedback.text}
            {isRefreshing ? " Syncing dashboard views…" : ""}
          </span>
        </div>
      )}

      {/* Main 2-Column Operational Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left Column: Live Leads Smart Breakdown */}
        <div className="lg:col-span-5 bg-slate-900/70 border border-slate-700/70 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
                Live Leads Smart Breakdown
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                /api/webhooks/leadsmart
              </span>
            </div>

            {/* Primary Revenue & Qualified Leads Row */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                  Total Revenue
                </div>
                <div
                  data-testid="closed-loop-total-revenue"
                  className="mt-1 text-2xl font-bold font-mono tabular-nums text-emerald-400"
                >
                  {formatUsd(revenueStore.revenue)}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 font-mono tabular-nums">
                  {revenueStore.qualifiedLeads} qualified leads
                </div>
              </div>

              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                  Click &amp; Form Intent
                </div>
                <div
                  data-testid="closed-loop-total-intents"
                  className="mt-1 text-2xl font-bold font-mono tabular-nums text-white"
                >
                  {formatNumber(totalIntents)}
                </div>
                <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-2 font-mono tabular-nums">
                  <span className="inline-flex items-center gap-1">
                    <PhoneCall className="w-3 h-3 text-blue-400" aria-hidden="true" />
                    {effectiveCallIntents} calls
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="inline-flex items-center gap-1">
                    <FileText className="w-3 h-3 text-emerald-400" aria-hidden="true" />
                    {effectiveFormIntents} forms
                  </span>
                </div>
              </div>
            </div>

            {/* Sold Calls vs Sold Forms Split */}
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="rounded-lg bg-slate-800/70 border border-slate-700/70 px-3.5 py-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Sold Calls</span>
                  <PhoneCall className="w-3.5 h-3.5 text-blue-400" aria-hidden="true" />
                </div>
                <div
                  data-testid="closed-loop-sold-calls"
                  className="mt-1 text-lg font-bold font-mono tabular-nums text-white"
                >
                  {revenueStore.soldCalls}
                </div>
              </div>

              <div className="rounded-lg bg-slate-800/70 border border-slate-700/70 px-3.5 py-2.5">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Sold Forms</span>
                  <FileText className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                </div>
                <div
                  data-testid="closed-loop-sold-forms"
                  className="mt-1 text-lg font-bold font-mono tabular-nums text-white"
                >
                  {revenueStore.soldForms}
                </div>
              </div>
            </div>

            {/* Daily Lead Goal Progress */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-slate-200 flex items-center gap-1.5">
                  <MousePointerClick className="w-3.5 h-3.5 text-amber-400" aria-hidden="true" />
                  Daily Lead Goal ({todayKey})
                </span>
                <span
                  data-testid="closed-loop-daily-goal"
                  className="font-mono tabular-nums font-semibold text-slate-200"
                >
                  {todayQualifiedLeads} / {safeTarget} ({goalPct}%)
                </span>
              </div>
              <div
                role="progressbar"
                aria-valuenow={todayQualifiedLeads}
                aria-valuemin={0}
                aria-valuemax={safeTarget}
                aria-label="Daily Lead Goal Progress"
                className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden border border-slate-700/80"
              >
                <div
                  className={`h-full transition-all duration-300 ${
                    goalMet ? "bg-emerald-500" : "bg-blue-500"
                  }`}
                  style={{ width: `${goalPct}%` }}
                />
              </div>
              <div className="text-[11px] text-slate-400 flex items-center justify-between">
                <span>
                  {goalMet
                    ? "Daily target reached via verified Leads Smart sales."
                    : `${safeTarget - todayQualifiedLeads} more qualified ${
                        safeTarget - todayQualifiedLeads === 1 ? "lead" : "leads"
                      } to hit DAILY_LEAD_TARGET (${safeTarget}).`}
                </span>
              </div>
            </div>
          </div>

          {/* Recent Closed-Loop Activity Log */}
          <div className="border-t border-slate-800 pt-4 space-y-2">
            <div className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">
              Latest Activity ({revenueStore.logs.length} stored)
            </div>
            {revenueStore.logs.length === 0 ? (
              <p className="text-xs text-slate-400">
                No Leads Smart conversions or site intents recorded yet. Click{" "}
                <strong className="text-slate-200">Simulate Test Lead</strong> to verify the closed loop.
              </p>
            ) : (
              <ul className="divide-y divide-slate-800/90 text-xs">
                {revenueStore.logs.slice(0, 4).map((log) => (
                  <li
                    key={log.id}
                    className="py-2 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <div className="font-medium text-slate-200 truncate">
                        {log.service} · {log.city}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {log.eventType === "conversion"
                          ? log.channel === "call"
                            ? "Sold Call"
                            : "Sold Form"
                          : log.channel === "call"
                            ? "Call Click Intent"
                            : "Form Submit Intent"}
                        <span className="mx-1.5 text-slate-600">·</span>
                        {log.status}
                      </div>
                    </div>
                    <span
                      className={`font-mono tabular-nums font-semibold shrink-0 ${
                        log.payout > 0 ? "text-emerald-400" : "text-slate-400"
                      }`}
                    >
                      {log.payout > 0 ? `+${formatUsd(log.payout)}` : "Intent"}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Right Column: Live GSC Overview & Auto-Optimized Low-CTR Pages */}
        <div className="lg:col-span-7 bg-slate-900/70 border border-slate-700/70 rounded-xl p-5 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Search className="w-4 h-4 text-blue-400 shrink-0" aria-hidden="true" />
                Live GSC Overview &amp; Auto-Optimized Low-CTR Pages
              </h3>
              <span className="text-[11px] font-mono text-slate-400">
                /api/sync/gsc · /api/optimize-site
              </span>
            </div>

            {/* 3-Metric Hairline Strip: Total Clicks | Total Impressions | Average CTR */}
            <div className="grid grid-cols-3 divide-x divide-slate-800 rounded-lg bg-slate-800/50 border border-slate-700/70 py-3">
              <div className="px-4">
                <div className="text-[11px] uppercase tracking-wider text-slate-400">
                  Total Clicks
                </div>
                <div
                  data-testid="gsc-overview-clicks"
                  className="mt-1 text-xl font-bold font-mono tabular-nums text-white"
                >
                  {formatNumber(gscStore.totals.clicks)}
                </div>
              </div>
              <div className="px-4">
                <div className="text-[11px] uppercase tracking-wider text-slate-400">
                  Impressions
                </div>
                <div
                  data-testid="gsc-overview-impressions"
                  className="mt-1 text-xl font-bold font-mono tabular-nums text-white"
                >
                  {formatNumber(gscStore.totals.impressions)}
                </div>
              </div>
              <div className="px-4">
                <div className="text-[11px] uppercase tracking-wider text-slate-400">
                  Average CTR
                </div>
                <div
                  data-testid="gsc-overview-ctr"
                  className="mt-1 text-xl font-bold font-mono tabular-nums text-blue-300"
                >
                  {gscStore.totals.avgCtr.toFixed(2)}%
                </div>
              </div>
            </div>

            {/* Active Homepage Trending Highlight Status */}
            <div className="rounded-lg bg-slate-800/60 border border-slate-700/70 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs">
              <div className="flex items-start gap-2 min-w-0">
                <TrendingUp
                  className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5"
                  aria-hidden="true"
                />
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">
                    Homepage Hero &amp; Sticky Call Bar Highlight
                  </div>
                  {overrides.trendingHighlight ? (
                    <div
                      data-testid="dashboard-trending-highlight"
                      className="text-slate-100 font-semibold mt-0.5 truncate"
                    >
                      {overrides.trendingHighlight.badgeText}{" "}
                      <span className="text-emerald-400 font-mono tabular-nums">
                        ({overrides.trendingHighlight.conversions} leads ·{" "}
                        {formatUsd(overrides.trendingHighlight.revenue)})
                      </span>
                    </div>
                  ) : (
                    <div className="text-slate-400 mt-0.5">
                      Not assigned yet. Record a lead and click{" "}
                      <strong className="text-slate-200">Run Auto-Optimizer Now</strong> to promote the top Houston service.
                    </div>
                  )}
                </div>
              </div>

              <Link
                href="/"
                className="inline-flex items-center gap-1 text-xs font-semibold text-blue-400 hover:text-blue-300 whitespace-nowrap shrink-0"
              >
                <span>View Homepage</span>
                <ArrowUpRight className="w-3.5 h-3.5" aria-hidden="true" />
              </Link>
            </div>

            {/* Auto-Optimized Low-CTR Pages Table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-200">
                  Auto-Optimized Low-CTR Pages ({optimizedPages.length})
                </span>
                <span className="text-[11px] text-slate-400">
                  Rule: Impressions &gt; 100 &amp; CTR &lt; 2.5% ({lowCtrCandidatesCount} eligible)
                </span>
              </div>

              {optimizedPages.length === 0 ? (
                <div
                  data-testid="optimized-pages-empty"
                  className="rounded-lg border border-dashed border-slate-700 bg-slate-950/40 px-4 py-6 text-center text-xs text-slate-400"
                >
                  No SEO metadata overrides generated yet. Click{" "}
                  <strong className="text-slate-200">Run Auto-Optimizer Now</strong>{" "}
                  to analyze <code className="text-slate-300">data/gsc-store.json</code> and upgrade low-CTR Houston plumbing titles automatically.
                </div>
              ) : (
                <div className="overflow-x-auto rounded-lg border border-slate-700/80">
                  <table
                    data-testid="optimized-pages-table"
                    className="w-full text-left border-collapse text-xs"
                  >
                    <thead>
                      <tr className="bg-slate-800/90 text-slate-300 border-b border-slate-700">
                        <th className="py-2.5 px-3 font-semibold">Page &amp; Query</th>
                        <th className="py-2.5 px-3 font-semibold text-right whitespace-nowrap">
                          Impr.
                        </th>
                        <th className="py-2.5 px-3 font-semibold text-right whitespace-nowrap">
                          CTR
                        </th>
                        <th className="py-2.5 px-3 font-semibold">
                          Upgraded High-CTR Meta Title
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800">
                      {optimizedPages.slice(0, 6).map((item) => (
                        <tr
                          key={item.page}
                          className="hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-2.5 px-3 align-top">
                            <Link
                              href={item.page}
                              className="font-mono text-blue-300 hover:text-blue-200 block truncate max-w-[210px]"
                              title={item.page}
                            >
                              {item.page}
                            </Link>
                            {item.topQuery && (
                              <span className="text-[11px] text-slate-400 block truncate max-w-[210px]">
                                &ldquo;{item.topQuery}&rdquo;
                              </span>
                            )}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-slate-200 align-top">
                            {formatNumber(item.impressions)}
                          </td>
                          <td className="py-2.5 px-3 text-right font-mono tabular-nums text-amber-300 align-top">
                            {item.previousCtr.toFixed(2)}%
                          </td>
                          <td className="py-2.5 px-3 text-slate-200 align-top">
                            <div className="font-medium leading-snug">
                              {item.title}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
            <span>
              GSC Source:{" "}
              <code className="text-slate-300">{gscStore.source}</code>
              {gscStore.lastSyncedAt
                ? ` · Synced ${formatShortTime(gscStore.lastSyncedAt)}`
                : ""}
            </span>
            <span>
              Tracked pages: <strong className="text-slate-200 font-mono tabular-nums">{gscStore.pages.length}</strong>
            </span>
          </div>
        </div>
      </div>

      {/* Collapsible Connection & Webhook Setup + Sync Real GSC JSON Importer */}
      <ConnectionSetupPanel
        onGscImported={(payload) => {
          if (payload.revenueStore) {
            setOptimisticRev({ stamp: revStamp, data: payload.revenueStore });
          }
          if (payload.gscStore) {
            setOptimisticGsc({ stamp: gscStamp, data: payload.gscStore });
          }
          if (payload.overrides) {
            setOptimisticOv({ stamp: ovStamp, data: payload.overrides });
          }
          setFeedback({
            tone: "success",
            text:
              payload.message ||
              "Imported fresh Google Search Console data into data/gsc-store.json.",
          });
          startTransition(() => {
            router.refresh();
          });
        }}
      />
    </section>
  );
}
