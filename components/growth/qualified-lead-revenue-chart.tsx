"use client";

import { useState } from "react";
import {
  ArrowDownRight,
  ArrowUpRight,
  LineChart as LineChartIcon,
  Minus,
} from "lucide-react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  formatUsdCurrency,
  type DailyRevenueTrendPoint,
  type RevenueTrend30DaySummary,
} from "@/lib/growth/revenue-trend";

interface QualifiedLeadRevenueChartProps {
  trend: RevenueTrend30DaySummary;
}

type ChartSeriesMode = "daily" | "cumulative";

interface TooltipPayloadItem {
  payload?: DailyRevenueTrendPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function QualifiedRevenueTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="rounded-lg bg-slate-950/95 border border-slate-700 px-3 py-2.5 shadow-lg text-xs space-y-1.5">
      <div className="font-mono tabular-nums text-[11px] text-slate-400">
        {point.shortLabel} · {point.date}
      </div>
      <div className="flex items-center justify-between gap-5">
        <span className="text-slate-300">Daily Revenue</span>
        <span className="font-mono tabular-nums font-semibold text-emerald-400">
          {formatUsdCurrency(point.revenue)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-5">
        <span className="text-slate-400">30-Day Cumulative</span>
        <span className="font-mono tabular-nums font-medium text-slate-100">
          {formatUsdCurrency(point.cumulativeRevenue)}
        </span>
      </div>
      <div className="pt-1 border-t border-slate-800 text-[11px] font-mono tabular-nums text-slate-400">
        {point.settlementCount}{" "}
        {point.settlementCount === 1
          ? "verified settlement"
          : "verified settlements"}
      </div>
    </div>
  );
}

export function QualifiedLeadRevenueChart({
  trend,
}: QualifiedLeadRevenueChartProps) {
  const [seriesMode, setSeriesMode] = useState<ChartSeriesMode>("daily");

  const TrendIcon =
    trend.trendDirection === "up"
      ? ArrowUpRight
      : trend.trendDirection === "down"
        ? ArrowDownRight
        : Minus;

  const trendTextClass =
    trend.trendDirection === "up"
      ? "text-emerald-400"
      : trend.trendDirection === "down"
        ? "text-rose-400"
        : "text-slate-300";

  const activeDataKey =
    seriesMode === "cumulative" ? "cumulativeRevenue" : "revenue";

  const dayCount = Math.max(1, trend.points.length);
  const avgDailyRevenue = Number((trend.total30DayRevenue / dayCount).toFixed(2));

  const maxDataValue =
    seriesMode === "cumulative"
      ? trend.total30DayRevenue
      : trend.peakDayRevenue;
  const yDomainMax = maxDataValue > 0 ? Math.ceil(maxDataValue * 1.2) : 100;

  return (
    <section
      aria-label="30-Day Qualified Lead Revenue"
      data-testid="qualified-lead-revenue-chart-card"
      data-series-mode={seriesMode}
      className="h-full bg-slate-800/70 border border-slate-700/80 rounded-xl p-5 sm:p-6 flex flex-col justify-between gap-4"
    >
      {/* Header Row + Interactive Series Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="min-w-0 space-y-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <LineChartIcon
              className="w-5 h-5 text-emerald-400 shrink-0"
              aria-hidden="true"
            />
            <h2 className="text-base font-semibold text-white">
              Qualified Lead Revenue (30 Days)
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-slate-400 font-mono tabular-nums">
            <span>Source: revenue-store.json</span>
            <span className="text-slate-600" aria-hidden="true">
              ·
            </span>
            <span>{trend.dateRangeLabel}</span>
            <span className="text-slate-600" aria-hidden="true">
              ·
            </span>
            <span>
              {trend.totalSettlements}{" "}
              {trend.totalSettlements === 1 ? "settlement" : "settlements"}
            </span>
          </div>
        </div>

        {/* Interactive Segmented Control (Daily vs Cumulative) */}
        <div
          role="group"
          aria-label="Revenue chart series view"
          className="inline-flex items-center gap-1 p-1 rounded-lg bg-slate-900/80 border border-slate-700/80 shrink-0 self-start"
        >
          <button
            type="button"
            onClick={() => setSeriesMode("daily")}
            aria-pressed={seriesMode === "daily"}
            data-testid="revenue-series-daily"
            className={`min-h-[36px] px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer ${
              seriesMode === "daily"
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Daily
          </button>
          <button
            type="button"
            onClick={() => setSeriesMode("cumulative")}
            aria-pressed={seriesMode === "cumulative"}
            data-testid="revenue-series-cumulative"
            className={`min-h-[36px] px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap shrink-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 cursor-pointer ${
              seriesMode === "cumulative"
                ? "bg-slate-700 text-white"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Cumulative
          </button>
        </div>
      </div>

      {/* Inline Metric Summary Row (hairline dividers, no nested cards) */}
      <div className="grid grid-cols-3 gap-4 border-y border-slate-700/70 py-3">
        <div>
          <div className="text-[11px] font-medium text-slate-400">
            30-Day Total
          </div>
          <div
            className="mt-0.5 text-lg font-bold font-mono tabular-nums text-emerald-400"
            data-testid="revenue-30d-total"
          >
            {trend.formattedTotal30DayRevenue}
          </div>
        </div>

        <div className="border-l border-slate-700/70 pl-4">
          <div className="text-[11px] font-medium text-slate-400">
            Peak Day
          </div>
          <div className="mt-0.5 text-lg font-bold font-mono tabular-nums text-white">
            {trend.formattedPeakDayRevenue}
            {trend.peakDayLabel && (
              <span className="ml-1.5 text-xs font-normal text-slate-400">
                ({trend.peakDayLabel})
              </span>
            )}
          </div>
        </div>

        <div className="border-l border-slate-700/70 pl-4">
          <div className="text-[11px] font-medium text-slate-400">
            15-Day Trend
          </div>
          <div
            className={`mt-0.5 flex items-center gap-1 text-lg font-bold font-mono tabular-nums ${trendTextClass}`}
            data-testid="revenue-15d-trend"
          >
            <TrendIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
            <span>{trend.formattedRoiTrend}</span>
          </div>
        </div>
      </div>

      {/* Recharts 30-Day Line Chart Viewport */}
      <div
        className="h-[208px] w-full"
        role="img"
        aria-label={`Line chart showing ${
          seriesMode === "cumulative" ? "cumulative" : "daily"
        } qualified lead revenue over the last 30 days (${trend.dateRangeLabel}), totaling ${trend.formattedTotal30DayRevenue}`}
      >
        <ResponsiveContainer
          width="100%"
          height={208}
          minWidth={0}
          initialDimension={{ width: 640, height: 208 }}
        >
          <LineChart
            data={trend.points}
            margin={{ top: 12, right: 16, left: -6, bottom: 6 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              strokeOpacity={0.5}
              vertical={false}
            />
            <XAxis
              dataKey="shortLabel"
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              interval={4}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              domain={[0, yDomainMax]}
              padding={{ top: 6, bottom: 4 }}
              tickFormatter={(value: number) => `$${value}`}
              width={50}
            />
            <Tooltip
              content={<QualifiedRevenueTooltip />}
              cursor={{ stroke: "#64748b", strokeDasharray: "3 3" }}
            />
            {seriesMode === "daily" &&
              trend.hasRevenueData &&
              avgDailyRevenue > 0 && (
                <ReferenceLine
                  y={avgDailyRevenue}
                  stroke="#64748b"
                  strokeDasharray="4 4"
                  label={{
                    value: `Avg ${formatUsdCurrency(avgDailyRevenue)}`,
                    position: "insideTopRight",
                    fill: "#94a3b8",
                    fontSize: 10,
                  }}
                />
              )}
            <Line
              type="monotone"
              dataKey={activeDataKey}
              name={
                seriesMode === "cumulative"
                  ? "30-Day Cumulative Revenue"
                  : "Daily Qualified Lead Revenue"
              }
              stroke="#34d399"
              strokeWidth={2.5}
              dot={
                trend.hasRevenueData
                  ? { r: 2.5, fill: "#34d399", strokeWidth: 0 }
                  : false
              }
              activeDot={{
                r: 4.5,
                fill: "#34d399",
                stroke: "#0f172a",
                strokeWidth: 2,
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Footer Note */}
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span>
          {trend.hasRevenueData
            ? `${trend.activeDays} active settlement ${
                trend.activeDays === 1 ? "day" : "days"
              } · Avg ${formatUsdCurrency(avgDailyRevenue)}/day over 30d`
            : "0 verified settlements recorded in revenue-store.json over the last 30 days."}
        </span>
        <span className="font-mono tabular-nums text-slate-400">
          {seriesMode === "cumulative" ? "Running 30d total" : "Daily totals"}
        </span>
      </div>
    </section>
  );
}
