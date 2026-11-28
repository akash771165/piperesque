import {
  Activity,
  ArrowDown,
  ArrowUp,
  CalendarDays,
  Minus,
} from "lucide-react";
import {
  calculateGrowthVelocity,
  getGrowthVelocityTheme,
  type RevenueStoreVelocityInput,
} from "@/lib/growth/growth-velocity";

interface GrowthVelocityProps {
  revenueStore: RevenueStoreVelocityInput;
  layout?: "wide" | "split";
}

export function GrowthVelocity({
  revenueStore,
  layout = "wide",
}: GrowthVelocityProps) {
  const velocity = calculateGrowthVelocity(revenueStore);
  const theme = getGrowthVelocityTheme(velocity.trend);

  const ArrowIcon =
    velocity.trend === "up"
      ? ArrowUp
      : velocity.trend === "down"
        ? ArrowDown
        : Minus;

  const formattedDelta =
    velocity.delta > 0
      ? `+${velocity.delta}`
      : velocity.delta < 0
        ? `${velocity.delta}`
        : "0";

  const isSplit = layout === "split";

  return (
    <section
      aria-label="Growth Velocity"
      data-testid="growth-velocity-card"
      data-velocity-trend={velocity.trend}
      className={`h-full bg-slate-800/70 border rounded-xl p-5 sm:p-6 transition-colors flex flex-col justify-between ${theme.accentBorderClass}`}
    >
      <div
        className={
          isSplit
            ? "flex flex-col justify-between gap-4 h-full"
            : "flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5"
        }
      >
        {/* Top / Left: Title & Summary */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400 shrink-0" />
              Growth Velocity
            </h2>
            <span className="text-slate-500" aria-hidden="true">
              ·
            </span>
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide ${theme.valueTextClass}`}
            >
              <ArrowIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {velocity.statusLabel}
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Week-over-week qualified lead momentum from{" "}
            <code className="text-slate-300">revenue-store.json</code>.{" "}
            {velocity.summaryText}
          </p>
        </div>

        {isSplit ? (
          <>
            {/* Middle Focal Band: Week-over-Week Percentage Indicator */}
            <div className="flex items-center justify-between gap-4 border-y border-slate-700/70 py-6">
              <div>
                <div className="text-xs font-medium text-slate-400">
                  Week-over-Week Change
                </div>
                <div
                  className={`mt-1.5 flex items-center gap-2 text-4xl font-bold font-mono tabular-nums leading-none ${theme.valueTextClass}`}
                  data-testid="growth-velocity-percent"
                >
                  <ArrowIcon
                    className={`w-7 h-7 shrink-0 ${theme.iconClass}`}
                    aria-hidden="true"
                    data-testid="growth-velocity-arrow"
                    data-direction={velocity.trend}
                  />
                  <span>{velocity.formattedPercent}</span>
                </div>
              </div>
              <div className="pl-5 border-l border-slate-700/70 text-right font-mono tabular-nums">
                <div className="text-xs font-sans text-slate-400">
                  Net Delta
                </div>
                <div
                  className={`mt-1 text-xl font-bold ${theme.valueTextClass}`}
                >
                  {formattedDelta}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    leads
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Band: Weekly Comparison + Aligned Footer */}
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    This Week (7d)
                  </div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-white">
                    {velocity.currentWeekLeads}{" "}
                    <span className="text-xs font-normal text-slate-400">
                      {velocity.currentWeekLeads === 1 ? "lead" : "leads"}
                    </span>
                  </div>
                </div>

                <div className="border-l border-slate-700/70 pl-4 space-y-1">
                  <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    Prior Week (7d)
                  </div>
                  <div className="text-2xl font-bold font-mono tabular-nums text-slate-300">
                    {velocity.previousWeekLeads}{" "}
                    <span className="text-xs font-normal text-slate-400">
                      {velocity.previousWeekLeads === 1 ? "lead" : "leads"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2 text-xs text-slate-400 pt-1">
                <span>Rolling 7-day qualified lead comparison</span>
                <span className="font-mono tabular-nums">WoW</span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6 shrink-0">
            <div className="flex items-center justify-between gap-4 border-y border-slate-700/70 py-3.5">
              <div>
                <div className="text-[11px] font-medium text-slate-400">
                  Week-over-Week Change
                </div>
                <div
                  className={`mt-1 flex items-center gap-1.5 text-3xl font-bold font-mono tabular-nums leading-tight ${theme.valueTextClass}`}
                  data-testid="growth-velocity-percent"
                >
                  <ArrowIcon
                    className={`w-6 h-6 shrink-0 ${theme.iconClass}`}
                    aria-hidden="true"
                    data-testid="growth-velocity-arrow"
                    data-direction={velocity.trend}
                  />
                  <span>{velocity.formattedPercent}</span>
                </div>
              </div>
              <div className="pl-4 border-l border-slate-700/70 text-right font-mono tabular-nums">
                <div className="text-[11px] font-sans text-slate-400">
                  Net Delta
                </div>
                <div
                  className={`mt-0.5 text-base font-semibold ${theme.valueTextClass}`}
                >
                  {formattedDelta}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    leads
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  This Week (7d)
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-white">
                  {velocity.currentWeekLeads}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    {velocity.currentWeekLeads === 1 ? "lead" : "leads"}
                  </span>
                </div>
              </div>

              <div className="border-l border-slate-700/70 pl-4 space-y-1">
                <div className="text-[11px] font-medium text-slate-400 flex items-center gap-1.5">
                  <CalendarDays className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  Prior Week (7d)
                </div>
                <div className="text-xl font-bold font-mono tabular-nums text-slate-300">
                  {velocity.previousWeekLeads}{" "}
                  <span className="text-xs font-normal text-slate-400">
                    {velocity.previousWeekLeads === 1 ? "lead" : "leads"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
