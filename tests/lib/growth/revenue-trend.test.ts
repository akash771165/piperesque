import { describe, expect, it } from "vitest";
import {
  buildLast30DaysRevenueTrend,
  formatShortDateLabel,
  formatUsdCurrency,
} from "@/lib/growth/revenue-trend";

describe("buildLast30DaysRevenueTrend", () => {
  it("returns 30 zero-baseline daily points when no transactions exist", () => {
    const trend = buildLast30DaysRevenueTrend({
      transactions: [],
      referenceDate: "2026-11-27",
    });

    expect(trend.points).toHaveLength(30);
    expect(trend.startDate).toBe("2026-10-29");
    expect(trend.endDate).toBe("2026-11-27");
    expect(trend.total30DayRevenue).toBe(0);
    expect(trend.formattedTotal30DayRevenue).toBe("$0.00");
    expect(trend.activeDays).toBe(0);
    expect(trend.hasRevenueData).toBe(false);
    expect(trend.trendDirection).toBe("flat");
    expect(trend.points.every((p) => p.revenue === 0 && p.cumulativeRevenue === 0)).toBe(true);
  });

  it("aggregates verified_paid transactions within the 30-day window and excludes pending or stale entries", () => {
    const trend = buildLast30DaysRevenueTrend({
      referenceDate: "2026-11-27",
      transactions: [
        // Prior 15-day half (Oct 29 - Nov 12): $200 total
        {
          leadReferenceId: "PR-1",
          amount: 125,
          settlementDate: "2026-11-02",
          status: "verified_paid",
        },
        {
          leadReferenceId: "PR-2",
          amount: 75,
          settlementDate: "2026-11-02",
          status: "verified_paid",
        },
        // Recent 15-day half (Nov 13 - Nov 27): $300 total
        {
          leadReferenceId: "PR-3",
          amount: 300,
          settlementDate: "2026-11-20",
          status: "verified_paid",
        },
        // Should be ignored: pending status
        {
          leadReferenceId: "PR-4",
          amount: 500,
          settlementDate: "2026-11-21",
          status: "pending",
        },
        // Should be ignored: outside 30-day window
        {
          leadReferenceId: "PR-5",
          amount: 900,
          settlementDate: "2026-10-15",
          status: "verified_paid",
        },
      ],
    });

    expect(trend.total30DayRevenue).toBe(500);
    expect(trend.formattedTotal30DayRevenue).toBe("$500.00");
    expect(trend.activeDays).toBe(2);
    expect(trend.totalSettlements).toBe(3);
    expect(trend.peakDayRevenue).toBe(300);
    expect(trend.peakDayLabel).toBe("Nov 20");
    expect(trend.hasRevenueData).toBe(true);
    expect(trend.roiTrendPercent).toBe(50);
    expect(trend.formattedRoiTrend).toBe("+50.0%");
    expect(trend.trendDirection).toBe("up");

    const nov2 = trend.points.find((p) => p.date === "2026-11-02");
    expect(nov2?.revenue).toBe(200);
    expect(nov2?.settlementCount).toBe(2);
    expect(nov2?.cumulativeRevenue).toBe(200);

    const nov20 = trend.points.find((p) => p.date === "2026-11-20");
    expect(nov20?.revenue).toBe(300);
    expect(nov20?.cumulativeRevenue).toBe(500);
  });

  it("computes negative ROI trend when recent 15 days trail the prior 15 days", () => {
    const trend = buildLast30DaysRevenueTrend({
      referenceDate: "2026-11-27",
      transactions: [
        { amount: 400, settlementDate: "2026-11-05", status: "verified_paid" },
        { amount: 200, settlementDate: "2026-11-24", status: "verified_paid" },
      ],
    });

    expect(trend.roiTrendPercent).toBe(-50);
    expect(trend.formattedRoiTrend).toBe("-50.0%");
    expect(trend.trendDirection).toBe("down");
  });

  it("formats short dates and USD currency cleanly", () => {
    expect(formatShortDateLabel("2026-11-06")).toBe("Nov 6");
    expect(formatUsdCurrency(1250.5)).toBe("$1,250.50");
    expect(formatUsdCurrency(0)).toBe("$0.00");
  });
});
