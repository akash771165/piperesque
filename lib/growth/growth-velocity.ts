export type GrowthVelocityTrend = "up" | "down" | "flat";

export interface WeeklyLeadSnapshot {
  weekStart?: string;
  qualifiedLeads: number;
}

export interface RevenueStoreVelocityInput {
  summary?: {
    totalQualifiedLeads?: number;
  };
  weeklyMetrics?: {
    currentWeekQualifiedLeads?: number;
    previousWeekQualifiedLeads?: number;
  };
  weeklySnapshots?: WeeklyLeadSnapshot[];
}

export interface GrowthVelocityResult {
  currentWeekLeads: number;
  previousWeekLeads: number;
  delta: number;
  percentChange: number;
  formattedPercent: string;
  trend: GrowthVelocityTrend;
  statusLabel: string;
  summaryText: string;
}

export interface GrowthVelocityTheme {
  accentBorderClass: string;
  badgeClass: string;
  valueTextClass: string;
  iconClass: string;
}

function sanitizeCount(value: unknown): number {
  const num = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(num) || num <= 0) return 0;
  return Math.floor(num);
}

/**
 * Extracts current-week and previous-week qualified lead counts from revenue-store.json data.
 */
export function extractWeeklyLeadCounts(store: RevenueStoreVelocityInput): {
  currentWeekLeads: number;
  previousWeekLeads: number;
} {
  if (Array.isArray(store.weeklySnapshots) && store.weeklySnapshots.length > 0) {
    const ordered = [...store.weeklySnapshots].sort((a, b) =>
      String(a.weekStart ?? "").localeCompare(String(b.weekStart ?? ""))
    );
    const latest = ordered[ordered.length - 1];
    const prior = ordered.length >= 2 ? ordered[ordered.length - 2] : undefined;
    return {
      currentWeekLeads: sanitizeCount(latest?.qualifiedLeads),
      previousWeekLeads: sanitizeCount(prior?.qualifiedLeads),
    };
  }

  if (store.weeklyMetrics) {
    const totalQualified = sanitizeCount(store.summary?.totalQualifiedLeads);
    const previousWeekLeads = sanitizeCount(
      store.weeklyMetrics.previousWeekQualifiedLeads
    );
    const explicitCurrent =
      store.weeklyMetrics.currentWeekQualifiedLeads !== undefined
        ? sanitizeCount(store.weeklyMetrics.currentWeekQualifiedLeads)
        : undefined;

    let currentWeekLeads: number;
    if (explicitCurrent !== undefined && explicitCurrent > 0) {
      currentWeekLeads = explicitCurrent;
    } else if (previousWeekLeads === 0 && totalQualified > 0) {
      currentWeekLeads = totalQualified;
    } else if (previousWeekLeads > 0 && totalQualified > previousWeekLeads) {
      currentWeekLeads = totalQualified - previousWeekLeads;
    } else {
      currentWeekLeads = explicitCurrent ?? totalQualified;
    }

    return { currentWeekLeads, previousWeekLeads };
  }

  return {
    currentWeekLeads: sanitizeCount(store.summary?.totalQualifiedLeads),
    previousWeekLeads: 0,
  };
}

/**
 * Calculates week-over-week qualified lead velocity and percentage growth indicator.
 */
export function calculateGrowthVelocity(
  store: RevenueStoreVelocityInput
): GrowthVelocityResult {
  const { currentWeekLeads, previousWeekLeads } = extractWeeklyLeadCounts(store);
  const delta = currentWeekLeads - previousWeekLeads;

  let percentChange = 0;
  if (previousWeekLeads === 0) {
    percentChange = currentWeekLeads > 0 ? 100 : 0;
  } else {
    percentChange = Number(((delta / previousWeekLeads) * 100).toFixed(1));
  }

  const trend: GrowthVelocityTrend =
    delta > 0 ? "up" : delta < 0 ? "down" : "flat";

  const sign = percentChange > 0 ? "+" : "";
  const formattedPercent = `${sign}${percentChange.toFixed(1)}%`;

  let statusLabel: string;
  let summaryText: string;

  if (currentWeekLeads === 0 && previousWeekLeads === 0) {
    statusLabel = "Awaiting Baseline";
    summaryText =
      "No qualified leads recorded in the current or previous 7-day window yet.";
  } else if (trend === "up") {
    statusLabel = "Accelerating";
    summaryText =
      previousWeekLeads === 0
        ? `Up ${delta} qualified ${delta === 1 ? "lead" : "leads"} from a zero prior-week baseline.`
        : `Up ${delta} qualified ${delta === 1 ? "lead" : "leads"} compared to last week.`;
  } else if (trend === "down") {
    const drop = Math.abs(delta);
    statusLabel = "Slowing";
    summaryText = `Down ${drop} qualified ${drop === 1 ? "lead" : "leads"} compared to last week.`;
  } else {
    statusLabel = "Steady";
    summaryText = `Holding steady at ${currentWeekLeads} qualified ${currentWeekLeads === 1 ? "lead" : "leads"} week over week.`;
  }

  return {
    currentWeekLeads,
    previousWeekLeads,
    delta,
    percentChange,
    formattedPercent,
    trend,
    statusLabel,
    summaryText,
  };
}

/**
 * Returns Tailwind visual tokens for the Growth Velocity indicator based on trend direction.
 */
export function getGrowthVelocityTheme(
  trend: GrowthVelocityTrend
): GrowthVelocityTheme {
  switch (trend) {
    case "up":
      return {
        accentBorderClass: "border-green-500/35",
        badgeClass: "bg-green-500/15 text-green-300 border-green-500/35",
        valueTextClass: "text-green-400",
        iconClass: "text-green-400",
      };
    case "down":
      return {
        accentBorderClass: "border-red-500/35",
        badgeClass: "bg-red-500/15 text-red-300 border-red-500/35",
        valueTextClass: "text-red-400",
        iconClass: "text-red-400",
      };
    case "flat":
    default:
      return {
        accentBorderClass: "border-slate-700",
        badgeClass: "bg-slate-700/60 text-slate-300 border-slate-600",
        valueTextClass: "text-slate-200",
        iconClass: "text-slate-400",
      };
  }
}
