import Link from "next/link";
import { AlertCircle, ArrowUpRight, Search, TrendingUp } from "lucide-react";
import type { GscOpportunitiesSummaryResult } from "@/lib/growth/gsc-opportunities";

interface GscOpportunitySummaryProps {
  summary: GscOpportunitiesSummaryResult;
}

export function GscOpportunitySummary({ summary }: GscOpportunitySummaryProps) {
  const statusBadgeClass =
    summary.status === "LIVE"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      : summary.status === "CACHED_STORE"
        ? "bg-blue-500/10 text-blue-300 border-blue-500/30"
        : "bg-slate-700/60 text-slate-300 border-slate-600";

  return (
    <section
      aria-label="Top High-Impression Low-CTR Queries"
      data-testid="gsc-opportunity-summary"
      className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-700 pb-3">
        <div>
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <Search className="w-5 h-5 text-blue-400 shrink-0" />
            Top 3 High-Impression / Low-CTR Queries
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Highest-impression Search Console queries under 2.0% CTR and their current average rankings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <span
            className={`px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide border ${statusBadgeClass}`}
          >
            {summary.sourceLabel}
          </span>
          {summary.asOfDate && (
            <span className="px-2.5 py-0.5 rounded bg-slate-900/70 border border-slate-700 text-[11px] font-mono text-slate-300">
              As-Of: {summary.asOfDate}
            </span>
          )}
        </div>
      </div>

      {summary.queries.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-700/80 text-[11px] uppercase tracking-wider text-slate-400">
                <th scope="col" className="text-left font-medium py-2.5 pr-3 w-12">
                  #
                </th>
                <th scope="col" className="text-left font-medium py-2.5 pr-4">
                  Search Query &amp; Landing Page
                </th>
                <th scope="col" className="text-right font-medium py-2.5 px-3">
                  Impressions
                </th>
                <th scope="col" className="text-right font-medium py-2.5 px-3">
                  Clicks
                </th>
                <th scope="col" className="text-right font-medium py-2.5 px-3">
                  CTR
                </th>
                <th scope="col" className="text-right font-medium py-2.5 pl-3">
                  Current Ranking
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/60">
              {summary.queries.map((item, idx) => {
                const tierClass =
                  item.rankingTier === "Page 1"
                    ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    : item.rankingTier === "Striking Distance"
                      ? "bg-amber-500/10 text-amber-300 border-amber-500/30"
                      : "bg-slate-700/60 text-slate-300 border-slate-600";

                return (
                  <tr
                    key={`${item.query}-${idx}`}
                    className="hover:bg-slate-800/80 transition-colors"
                  >
                    <td className="py-3 pr-3 font-mono font-bold text-slate-400 align-top">
                      {idx + 1}
                    </td>
                    <td className="py-3 pr-4 align-top">
                      <div className="font-semibold text-white text-sm leading-snug">
                        {item.query}
                      </div>
                      {item.pagePath && (
                        <Link
                          href={item.pagePath}
                          className="mt-1 inline-flex items-center gap-1 font-mono text-[11px] text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          <span>{item.pagePath}</span>
                          <ArrowUpRight className="w-3 h-3 shrink-0" aria-hidden="true" />
                        </Link>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-semibold text-slate-100 align-top">
                      {item.impressions.toLocaleString("en-US")}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-300 align-top">
                      {item.clicks.toLocaleString("en-US")}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-amber-400 align-top">
                      {item.formattedCtr}
                    </td>
                    <td className="py-3 pl-3 text-right align-top">
                      <div className="inline-flex flex-col items-end gap-1">
                        <span className="font-mono font-bold text-white">
                          {item.formattedPosition}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${tierClass}`}
                        >
                          {item.rankingTier}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-4 rounded-lg bg-slate-900/60 border border-slate-800 flex items-start gap-2.5 text-xs text-slate-300">
          <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-semibold text-slate-200">
              No High-Impression / Low-CTR Queries Available
            </div>
            <p className="text-slate-400 mt-1">
              {summary.message ||
                "Once Search Console telemetry is synced, the top 3 CTR optimization opportunities will appear here automatically."}
            </p>
          </div>
        </div>
      )}

      <div className="pt-1 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-[11px] text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <TrendingUp className="w-3.5 h-3.5 text-blue-400 shrink-0" />
          Evaluated {summary.totalQueriesAnalyzed} Search Console{" "}
          {summary.totalQueriesAnalyzed === 1 ? "query" : "queries"} from{" "}
          <code className="text-slate-300">{summary.storeFile}</code>
        </span>
        {summary.message && summary.queries.length > 0 && (
          <span className="text-slate-400">{summary.message}</span>
        )}
      </div>
    </section>
  );
}
