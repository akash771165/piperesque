"use client";

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

interface RevenueTrendChartProps {
  trend: RevenueTrend30DaySummary;
}

interface TooltipPayloadItem {
  payload?: DailyRevenueTrendPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function RevenueTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  return (
    <div className="rounded-lg bg-slate-950/95 border border-slate-700 px-3 py-2 shadow-lg text-xs space-y-1">
      <div className="font-mono text-[10px] text-slate-400">
        {point.shortLabel} ({point.date})
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-slate-300">Daily Revenue</span>
        <span className="font-mono font-bold text-emerald-400">
          {formatUsdCurrency(point.revenue)}
        </span>
      </div>
      <div className="flex items-center justify-between gap-4">
        <span className="text-slate-400">30d Cumulative</span>
        <span className="font-mono text-slate-200">
          {formatUsdCurrency(point.cumulativeRevenue)}
        </span>
      </div>
      <div className="text-[10px] text-slate-500">
        {point.settlementCount}{" "}
        {point.settlementCount === 1 ? "settlement" : "settlements"}
      </div>
    </div>
  );
}

export function RevenueTrendChart({ trend }: RevenueTrendChartProps) {
  const trendBadgeClass =
    trend.trendDirection === "up"
      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
      : trend.trendDirection === "down"
        ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
        : "bg-slate-800 text-slate-400 border-slate-700";

  const TrendIcon =
    trend.trendDirection === "up"
      ? ArrowUpRight
      : trend.trendDirection === "down"
        ? ArrowDownRight
        : Minus;

  const yDomainMax =
    trend.peakDayRevenue > 0 ? Math.ceil(trend.peakDayRevenue * 1.2) : 100;

  return (
    <div
      className="rounded-lg bg-slate-900/60 border border-slate-700/80 p-3.5 space-y-2.5"
      data-testid="revenue-roi-trend-chart"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 min-w-0">
          <LineChartIcon
            className="w-3.5 h-3.5 text-emerald-400 shrink-0"
            aria-hidden="true"
          />
          <h3 className="text-xs font-semibold text-slate-200 truncate">
            30-Day Qualified Lead Revenue
          </h3>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <span className="font-mono text-xs font-bold text-emerald-400">
            {trend.formattedTotal30DayRevenue}
          </span>
          <span
            className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold border ${trendBadgeClass}`}
            title="Last 15 days vs. prior 15 days ROI trend"
          >
            <TrendIcon className="w-3 h-3 shrink-0" aria-hidden="true" />
            {trend.formattedRoiTrend}
          </span>
        </div>
      </div>

      <div
        className="h-[150px] w-full"
        role="img"
        aria-label={`Line chart of qualified lead revenue over the last 30 days (${trend.dateRangeLabel}), totaling ${trend.formattedTotal30DayRevenue}`}
      >
        <ResponsiveContainer
          width="100%"
          height={150}
          minWidth={0}
          initialDimension={{ width: 320, height: 150 }}
        >
          <LineChart
            data={trend.points}
            margin={{ top: 8, right: 10, left: -12, bottom: 2 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1e293b"
              vertical={false}
            />
            <XAxis
              dataKey="shortLabel"
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "#334155" }}
              interval={6}
            />
            <YAxis
              stroke="#64748b"
              tick={{ fill: "#94a3b8", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              domain={[0, yDomainMax]}
              tickFormatter={(value: number) => `$${value}`}
              width={44}
            />
            <Tooltip
              content={<RevenueTooltip />}
              cursor={{ stroke: "#475569", strokeDasharray: "3 3" }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Qualified Lead Revenue"
              stroke="#34d399"
              strokeWidth={2.5}
              dot={
                trend.hasRevenueData
                  ? { r: 2.5, fill: "#34d399", strokeWidth: 0 }
                  : false
              }
              activeDot={{
                r: 4,
                fill: "#34d399",
                stroke: "#0f172a",
                strokeWidth: 2,
              }}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-between gap-2 text-[10px] text-slate-400 font-mono">
        <span>{trend.dateRangeLabel}</span>
        <span>
          {trend.hasRevenueData
            ? `Peak: ${trend.formattedPeakDayRevenue} (${trend.peakDayLabel})`
            : "0 verified settlements (30d)"}
        </span>
      </div>
    </div>
  );
}
