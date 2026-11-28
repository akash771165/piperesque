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
}

export function GrowthVelocity({ revenueStore }: GrowthVelocityProps) {
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

  return (
    <section
      aria-label="Growth Velocity"
      data-testid="growth-velocity-card"
      data-velocity-trend={velocity.trend}
      className={`bg-slate-800/70 border rounded-xl p-5 sm:p-6 transition-colors ${theme.accentBorderClass}`}
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        {/* Left: Title & Summary */}
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2.5">
            <h2 className="text-base font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-400 shrink-0" />
              Growth Velocity
            </h2>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-[11px] font-bold uppercase tracking-wide border ${theme.badgeClass}`}
            >
              <ArrowIcon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
              {velocity.statusLabel}
            </span>
          </div>
          <p className="text-xs text-slate-400">
            Week-over-week qualified lead momentum from{" "}
            <code className="text-slate-300">revenue-store.json</code>.{" "}
            {velocity.summaryText}
          </p>
        </div>

        {/* Center + Right: Percentage Indicator & Weekly Comparison */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 lg:gap-6 shrink-0">
          <div className="flex items-center gap-3 bg-slate-900/70 border border-slate-700/80 rounded-lg px-4 py-3">
            <div>
              <div className="text-[10px] font-medium uppercase tracking-wider text-slate-400">
                WoW Change
              </div>
              <div
                className={`mt-0.5 flex items-center gap-1.5 text-2xl font-bold font-mono leading-tight ${theme.valueTextClass}`}
                data-testid="growth-velocity-percent"
              >
                <ArrowIcon
                  className={`w-5 h-5 shrink-0 ${theme.iconClass}`}
                  aria-hidden="true"
                  data-testid="growth-velocity-arrow"
                  data-direction={velocity.trend}
                />
                <span>{velocity.formattedPercent}</span>
              </div>
            </div>
            <div className="pl-3 border-l border-slate-700 text-xs font-mono text-slate-400">
              <span className={`font-semibold ${theme.valueTextClass}`}>
                {formattedDelta}
              </span>{" "}
              leads
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-900/60 border border-slate-700/70 rounded-lg px-3.5 py-2.5">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <CalendarDays className="w-3 h-3 text-blue-400 shrink-0" />
                This Week
              </div>
              <div className="mt-1 text-base font-bold font-mono text-white">
                {velocity.currentWeekLeads}{" "}
                <span className="text-[11px] font-normal text-slate-400">
                  {velocity.currentWeekLeads === 1 ? "lead" : "leads"}
                </span>
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-700/70 rounded-lg px-3.5 py-2.5">
              <div className="text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <CalendarDays className="w-3 h-3 text-slate-400 shrink-0" />
                Prior Week
              </div>
              <div className="mt-1 text-base font-bold font-mono text-slate-300">
                {velocity.previousWeekLeads}{" "}
                <span className="text-[11px] font-normal text-slate-400">
                  {velocity.previousWeekLeads === 1 ? "lead" : "leads"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
