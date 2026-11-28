export interface RevenueTransactionRecord {
  leadReferenceId?: string;
  providerId?: string;
  amount: number;
  settlementDate?: string;
  verifiedAt?: string;
  status?: string;
}

export interface DailyRevenueSnapshot {
  date: string;
  revenue: number;
  settlementCount?: number;
}

export interface DailyRevenueTrendPoint {
  date: string;
  shortLabel: string;
  revenue: number;
  cumulativeRevenue: number;
  settlementCount: number;
}

export interface RevenueTrend30DaySummary {
  points: DailyRevenueTrendPoint[];
  total30DayRevenue: number;
  formattedTotal30DayRevenue: string;
  peakDayRevenue: number;
  formattedPeakDayRevenue: string;
  peakDayLabel: string | null;
  activeDays: number;
  totalSettlements: number;
  roiTrendPercent: number | null;
  formattedRoiTrend: string;
  trendDirection: "up" | "down" | "flat";
  hasRevenueData: boolean;
  startDate: string;
  endDate: string;
  dateRangeLabel: string;
}

const MONTH_SHORT_NAMES = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

function toIsoDateString(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function parseIsoDate(value?: string | null): string | null {
  if (!value || typeof value !== "string") return null;
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{4}-\d{2}-\d{2})/);
  if (!match) return null;
  const parsed = new Date(`${match[1]}T00:00:00.000Z`);
  if (Number.isNaN(parsed.getTime())) return null;
  return match[1];
}

export function formatShortDateLabel(isoDate: string): string {
  const parts = isoDate.split("-");
  if (parts.length !== 3) return isoDate;
  const monthIdx = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  const monthName = MONTH_SHORT_NAMES[monthIdx];
  if (!monthName || !Number.isFinite(day)) return isoDate;
  return `${monthName} ${day}`;
}

export function formatUsdCurrency(amount: number): string {
  const safe = Number.isFinite(amount) ? Math.max(0, amount) : 0;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(safe);
}

/**
 * Builds a continuous 30-day qualified lead revenue time series from real
 * `revenue-store.json` transactions (and optional daily snapshots).
 * Never fabricates demo revenue: days without verified settlements remain $0.00.
 */
export function buildLast30DaysRevenueTrend(options: {
  transactions?: RevenueTransactionRecord[];
  dailyRevenueHistory?: DailyRevenueSnapshot[];
  referenceDate?: string | Date;
  days?: number;
} = {}): RevenueTrend30DaySummary {
  const dayCount = Math.min(Math.max(1, Math.floor(options.days ?? 30)), 90);

  let endDateUtc: Date;
  if (options.referenceDate instanceof Date) {
    endDateUtc = new Date(
      `${toIsoDateString(options.referenceDate)}T00:00:00.000Z`
    );
  } else if (typeof options.referenceDate === "string") {
    const iso = parseIsoDate(options.referenceDate);
    endDateUtc = iso
      ? new Date(`${iso}T00:00:00.000Z`)
      : new Date(`${toIsoDateString(new Date())}T00:00:00.000Z`);
  } else {
    endDateUtc = new Date(`${toIsoDateString(new Date())}T00:00:00.000Z`);
  }

  const dayMs = 24 * 60 * 60 * 1000;
  const buckets = new Map<string, { revenue: number; settlementCount: number }>();
  const orderedDates: string[] = [];

  for (let offset = dayCount - 1; offset >= 0; offset -= 1) {
    const iso = toIsoDateString(new Date(endDateUtc.getTime() - offset * dayMs));
    orderedDates.push(iso);
    buckets.set(iso, { revenue: 0, settlementCount: 0 });
  }

  // 1. Ingest optional pre-aggregated daily history if present
  if (Array.isArray(options.dailyRevenueHistory)) {
    for (const snap of options.dailyRevenueHistory) {
      const iso = parseIsoDate(snap?.date);
      if (!iso || !buckets.has(iso)) continue;
      const rev =
        typeof snap.revenue === "number" &&
        Number.isFinite(snap.revenue) &&
        snap.revenue > 0
          ? snap.revenue
          : 0;
      if (rev <= 0) continue;
      const bucket = buckets.get(iso)!;
      bucket.revenue += rev;
      bucket.settlementCount +=
        typeof snap.settlementCount === "number" && snap.settlementCount > 0
          ? Math.round(snap.settlementCount)
          : 1;
    }
  }

  // 2. Ingest verified paid transactions from revenue-store.json
  if (Array.isArray(options.transactions)) {
    for (const tx of options.transactions) {
      if (!tx || typeof tx !== "object") continue;
      if (tx.status && tx.status !== "verified_paid") continue;
      const amount =
        typeof tx.amount === "number" &&
        Number.isFinite(tx.amount) &&
        tx.amount > 0
          ? tx.amount
          : 0;
      if (amount <= 0) continue;

      const iso = parseIsoDate(tx.settlementDate) ?? parseIsoDate(tx.verifiedAt);
      if (!iso || !buckets.has(iso)) continue;

      const bucket = buckets.get(iso)!;
      bucket.revenue += amount;
      bucket.settlementCount += 1;
    }
  }

  let runningTotal = 0;
  let peakDayRevenue = 0;
  let peakDayLabel: string | null = null;
  let activeDays = 0;
  let totalSettlements = 0;

  const points: DailyRevenueTrendPoint[] = orderedDates.map((iso) => {
    const bucket = buckets.get(iso)!;
    const roundedRevenue = Number(bucket.revenue.toFixed(2));
    runningTotal = Number((runningTotal + roundedRevenue).toFixed(2));
    const shortLabel = formatShortDateLabel(iso);

    if (roundedRevenue > 0) {
      activeDays += 1;
      totalSettlements += bucket.settlementCount;
      if (roundedRevenue > peakDayRevenue) {
        peakDayRevenue = roundedRevenue;
        peakDayLabel = shortLabel;
      }
    }

    return {
      date: iso,
      shortLabel,
      revenue: roundedRevenue,
      cumulativeRevenue: runningTotal,
      settlementCount: bucket.settlementCount,
    };
  });

  // Compare recent half (last 15 days) vs prior half (first 15 days) for ROI trend indicator
  const midpoint = Math.floor(points.length / 2);
  const priorHalfRevenue = points
    .slice(0, midpoint)
    .reduce((sum, p) => sum + p.revenue, 0);
  const recentHalfRevenue = points
    .slice(midpoint)
    .reduce((sum, p) => sum + p.revenue, 0);

  let roiTrendPercent: number | null = null;
  let trendDirection: "up" | "down" | "flat" = "flat";
  let formattedRoiTrend = "0.0%";

  if (priorHalfRevenue > 0) {
    const pct = ((recentHalfRevenue - priorHalfRevenue) / priorHalfRevenue) * 100;
    roiTrendPercent = Number(pct.toFixed(1));
    if (roiTrendPercent > 0) {
      trendDirection = "up";
      formattedRoiTrend = `+${roiTrendPercent.toFixed(1)}%`;
    } else if (roiTrendPercent < 0) {
      trendDirection = "down";
      formattedRoiTrend = `${roiTrendPercent.toFixed(1)}%`;
    } else {
      trendDirection = "flat";
      formattedRoiTrend = "0.0%";
    }
  } else if (recentHalfRevenue > 0) {
    roiTrendPercent = 100;
    trendDirection = "up";
    formattedRoiTrend = "+100.0%";
  }

  const startDate = orderedDates[0];
  const endDate = orderedDates[orderedDates.length - 1];

  return {
    points,
    total30DayRevenue: runningTotal,
    formattedTotal30DayRevenue: formatUsdCurrency(runningTotal),
    peakDayRevenue,
    formattedPeakDayRevenue: formatUsdCurrency(peakDayRevenue),
    peakDayLabel,
    activeDays,
    totalSettlements,
    roiTrendPercent,
    formattedRoiTrend,
    trendDirection,
    hasRevenueData: runningTotal > 0,
    startDate,
    endDate,
    dateRangeLabel: `${formatShortDateLabel(startDate)} – ${formatShortDateLabel(endDate)}`,
  };
}
