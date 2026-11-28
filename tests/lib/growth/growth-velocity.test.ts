import { describe, expect, it } from "vitest";
import {
  calculateGrowthVelocity,
  extractWeeklyLeadCounts,
  getGrowthVelocityTheme,
} from "@/lib/growth/growth-velocity";

describe("growth velocity week-over-week calculation", () => {
  it("reports 0.0% flat baseline when both current and prior weeks have zero leads", () => {
    const result = calculateGrowthVelocity({
      summary: { totalQualifiedLeads: 0 },
      weeklyMetrics: {
        currentWeekQualifiedLeads: 0,
        previousWeekQualifiedLeads: 0,
      },
    });
    const theme = getGrowthVelocityTheme(result.trend);

    expect(result).toEqual({
      currentWeekLeads: 0,
      previousWeekLeads: 0,
      delta: 0,
      percentChange: 0,
      formattedPercent: "0.0%",
      trend: "flat",
      statusLabel: "Awaiting Baseline",
      summaryText:
        "No qualified leads recorded in the current or previous 7-day window yet.",
    });
    expect(theme.badgeClass).toContain("slate");
  });

  it("calculates positive week-over-week percentage growth with green styling", () => {
    const result = calculateGrowthVelocity({
      weeklyMetrics: {
        currentWeekQualifiedLeads: 15,
        previousWeekQualifiedLeads: 10,
      },
    });
    const theme = getGrowthVelocityTheme(result.trend);

    expect(result.delta).toBe(5);
    expect(result.percentChange).toBe(50);
    expect(result.formattedPercent).toBe("+50.0%");
    expect(result.trend).toBe("up");
    expect(result.statusLabel).toBe("Accelerating");
    expect(theme.valueTextClass).toContain("green");
    expect(theme.iconClass).toContain("green");
  });

  it("calculates negative week-over-week decline with red styling", () => {
    const result = calculateGrowthVelocity({
      weeklyMetrics: {
        currentWeekQualifiedLeads: 7,
        previousWeekQualifiedLeads: 10,
      },
    });
    const theme = getGrowthVelocityTheme(result.trend);

    expect(result.delta).toBe(-3);
    expect(result.percentChange).toBe(-30);
    expect(result.formattedPercent).toBe("-30.0%");
    expect(result.trend).toBe("down");
    expect(result.statusLabel).toBe("Slowing");
    expect(theme.valueTextClass).toContain("red");
    expect(theme.iconClass).toContain("red");
  });

  it("handles growth from a zero prior-week baseline without dividing by zero", () => {
    const result = calculateGrowthVelocity({
      weeklyMetrics: {
        currentWeekQualifiedLeads: 4,
        previousWeekQualifiedLeads: 0,
      },
    });

    expect(result.delta).toBe(4);
    expect(result.percentChange).toBe(100);
    expect(result.formattedPercent).toBe("+100.0%");
    expect(result.trend).toBe("up");
    expect(result.summaryText).toContain("zero prior-week baseline");
  });

  it("prioritizes chronological weeklySnapshots and falls back to summary.totalQualifiedLeads", () => {
    const fromSnapshots = extractWeeklyLeadCounts({
      weeklySnapshots: [
        { weekStart: "2026-11-16", qualifiedLeads: 12 },
        { weekStart: "2026-11-09", qualifiedLeads: 8 },
      ],
    });
    expect(fromSnapshots).toEqual({
      currentWeekLeads: 12,
      previousWeekLeads: 8,
    });

    const fromSummaryFallback = extractWeeklyLeadCounts({
      summary: { totalQualifiedLeads: 6 },
    });
    expect(fromSummaryFallback).toEqual({
      currentWeekLeads: 6,
      previousWeekLeads: 0,
    });
  });

  it("sanitizes negative or non-finite values safely", () => {
    const result = calculateGrowthVelocity({
      weeklyMetrics: {
        currentWeekQualifiedLeads: -3,
        previousWeekQualifiedLeads: Number.NaN,
      },
    });

    expect(result.currentWeekLeads).toBe(0);
    expect(result.previousWeekLeads).toBe(0);
    expect(result.formattedPercent).toBe("0.0%");
  });

  it("reflects direct summary.totalQualifiedLeads updates even when weeklyMetrics starts at zero", () => {
    const directIncrement = calculateGrowthVelocity({
      summary: { totalQualifiedLeads: 5 },
      weeklyMetrics: {
        currentWeekQualifiedLeads: 0,
        previousWeekQualifiedLeads: 0,
      },
    });
    expect(directIncrement.currentWeekLeads).toBe(5);
    expect(directIncrement.formattedPercent).toBe("+100.0%");
    expect(directIncrement.trend).toBe("up");

    const genuineZeroWeek = calculateGrowthVelocity({
      summary: { totalQualifiedLeads: 10 },
      weeklyMetrics: {
        currentWeekQualifiedLeads: 0,
        previousWeekQualifiedLeads: 10,
      },
    });
    expect(genuineZeroWeek.currentWeekLeads).toBe(0);
    expect(genuineZeroWeek.formattedPercent).toBe("-100.0%");
    expect(genuineZeroWeek.trend).toBe("down");
  });
});
