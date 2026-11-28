export const DEFAULT_DAILY_LEAD_TARGET = 5;

export type DailyLeadGoalStatus = "on_target" | "approaching" | "below_target";

export interface DailyLeadGoalEvaluation {
  qualifiedLeads: number;
  dailyTarget: number;
  progressPercent: number;
  remaining: number;
  isBelowTarget: boolean;
  status: DailyLeadGoalStatus;
  statusLabel: string;
  helperText: string;
}

export interface DailyLeadGoalTheme {
  containerClass: string;
  badgeClass: string;
  barFillClass: string;
  trackClass: string;
  valueTextClass: string;
  iconClass: string;
  dotClass: string;
}

const WIDTH_CLASS_BY_STEP: Record<number, string> = {
  0: "w-0",
  5: "w-[5%]",
  10: "w-[10%]",
  15: "w-[15%]",
  20: "w-[20%]",
  25: "w-[25%]",
  30: "w-[30%]",
  35: "w-[35%]",
  40: "w-[40%]",
  45: "w-[45%]",
  50: "w-[50%]",
  55: "w-[55%]",
  60: "w-[60%]",
  65: "w-[65%]",
  70: "w-[70%]",
  75: "w-[75%]",
  80: "w-[80%]",
  85: "w-[85%]",
  90: "w-[90%]",
  95: "w-[95%]",
  100: "w-full",
};

/**
 * Resolves the daily qualified lead target from store data, environment config, or default.
 */
export function resolveDailyLeadTarget(
  storeTarget?: unknown,
  envTarget?: string | undefined
): number {
  const fromStore = typeof storeTarget === "number" ? storeTarget : Number(storeTarget);
  if (Number.isFinite(fromStore) && fromStore >= 1) {
    return Math.floor(fromStore);
  }

  const fromEnv = envTarget ? Number(envTarget) : NaN;
  if (Number.isFinite(fromEnv) && fromEnv >= 1) {
    return Math.floor(fromEnv);
  }

  return DEFAULT_DAILY_LEAD_TARGET;
}

/**
 * Evaluates current qualified leads against the daily lead goal.
 */
export function evaluateDailyLeadGoal(
  rawQualifiedLeads: number,
  rawDailyTarget: number = DEFAULT_DAILY_LEAD_TARGET
): DailyLeadGoalEvaluation {
  const qualifiedLeads =
    Number.isFinite(rawQualifiedLeads) && rawQualifiedLeads > 0
      ? Math.floor(rawQualifiedLeads)
      : 0;

  const dailyTarget =
    Number.isFinite(rawDailyTarget) && rawDailyTarget >= 1
      ? Math.floor(rawDailyTarget)
      : DEFAULT_DAILY_LEAD_TARGET;

  const rawPercent = (qualifiedLeads / dailyTarget) * 100;
  const progressPercent = Math.min(100, Math.max(0, Math.round(rawPercent)));
  const remaining = Math.max(0, dailyTarget - qualifiedLeads);
  const isBelowTarget = qualifiedLeads < dailyTarget;

  let status: DailyLeadGoalStatus;
  let statusLabel: string;
  let helperText: string;

  if (!isBelowTarget) {
    status = "on_target";
    statusLabel = "Goal Met";
    helperText =
      qualifiedLeads > dailyTarget
        ? `Exceeded daily target by ${qualifiedLeads - dailyTarget} qualified ${qualifiedLeads - dailyTarget === 1 ? "lead" : "leads"}.`
        : "Daily qualified lead target achieved.";
  } else if (progressPercent >= 50) {
    status = "approaching";
    statusLabel = "Below Target";
    helperText = `${remaining} more qualified ${remaining === 1 ? "lead" : "leads"} needed to reach the daily goal.`;
  } else {
    status = "below_target";
    statusLabel = "Below Daily Target";
    helperText = `${remaining} more qualified ${remaining === 1 ? "lead" : "leads"} needed to reach the daily goal.`;
  }

  return {
    qualifiedLeads,
    dailyTarget,
    progressPercent,
    remaining,
    isBelowTarget,
    status,
    statusLabel,
    helperText,
  };
}

/**
 * Maps a 0–100 percentage to a static Tailwind width utility class (in 5% increments).
 */
export function getProgressWidthClass(progressPercent: number): string {
  const clamped = Math.min(100, Math.max(0, Number.isFinite(progressPercent) ? progressPercent : 0));
  if (clamped === 0) return WIDTH_CLASS_BY_STEP[0];
  if (clamped >= 100) return WIDTH_CLASS_BY_STEP[100];
  const roundedStep = Math.max(5, Math.min(95, Math.round(clamped / 5) * 5));
  return WIDTH_CLASS_BY_STEP[roundedStep] ?? "w-0";
}

/**
 * Returns Tailwind visual status tokens reflecting whether daily lead volume is on or below target.
 */
export function getDailyLeadGoalTheme(status: DailyLeadGoalStatus): DailyLeadGoalTheme {
  switch (status) {
    case "on_target":
      return {
        containerClass: "bg-emerald-950/30 border-emerald-500/35",
        badgeClass: "bg-emerald-500/15 text-emerald-300 border-emerald-500/35",
        barFillClass: "bg-emerald-400",
        trackClass: "bg-slate-900 border border-emerald-500/20",
        valueTextClass: "text-emerald-400",
        iconClass: "text-emerald-400",
        dotClass: "bg-emerald-400",
      };
    case "approaching":
      return {
        containerClass: "bg-amber-950/30 border-amber-500/35",
        badgeClass: "bg-amber-500/15 text-amber-300 border-amber-500/35",
        barFillClass: "bg-amber-400",
        trackClass: "bg-slate-900 border border-amber-500/25",
        valueTextClass: "text-amber-400",
        iconClass: "text-amber-400",
        dotClass: "bg-amber-400",
      };
    case "below_target":
    default:
      return {
        containerClass: "bg-rose-950/35 border-rose-500/40",
        badgeClass: "bg-rose-500/15 text-rose-300 border-rose-500/40",
        barFillClass: "bg-rose-500",
        trackClass: "bg-slate-900 border border-rose-500/30",
        valueTextClass: "text-rose-400",
        iconClass: "text-rose-400",
        dotClass: "bg-rose-500",
      };
  }
}
