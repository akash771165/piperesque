import { describe, expect, it } from "vitest";
import {
  DEFAULT_DAILY_LEAD_TARGET,
  evaluateDailyLeadGoal,
  getDailyLeadGoalTheme,
  getProgressWidthClass,
  resolveDailyLeadTarget,
} from "@/lib/growth/daily-lead-goal";

describe("daily lead goal evaluation", () => {
  it("flags zero qualified leads as below daily target with rose status styling", () => {
    const result = evaluateDailyLeadGoal(0, 5);
    const theme = getDailyLeadGoalTheme(result.status);

    expect(result).toEqual({
      qualifiedLeads: 0,
      dailyTarget: 5,
      progressPercent: 0,
      remaining: 5,
      isBelowTarget: true,
      status: "below_target",
      statusLabel: "Below Daily Target",
      helperText: "5 more qualified leads needed to reach the daily goal.",
    });
    expect(theme.barFillClass).toContain("rose");
    expect(theme.badgeClass).toContain("rose");
    expect(getProgressWidthClass(result.progressPercent)).toBe("w-0");
  });

  it("shows approaching status with amber styling when at least 50% of daily goal but still below target", () => {
    const result = evaluateDailyLeadGoal(3, 5);
    const theme = getDailyLeadGoalTheme(result.status);

    expect(result.isBelowTarget).toBe(true);
    expect(result.status).toBe("approaching");
    expect(result.progressPercent).toBe(60);
    expect(result.remaining).toBe(2);
    expect(theme.barFillClass).toContain("amber");
    expect(theme.badgeClass).toContain("amber");
    expect(getProgressWidthClass(result.progressPercent)).toBe("w-[60%]");
  });

  it("uses singular grammar when exactly 1 lead remains", () => {
    const result = evaluateDailyLeadGoal(4, 5);

    expect(result.remaining).toBe(1);
    expect(result.helperText).toBe("1 more qualified lead needed to reach the daily goal.");
  });

  it("marks goal met with emerald styling once qualified leads reach or exceed daily target", () => {
    const exact = evaluateDailyLeadGoal(5, 5);
    const exceeded = evaluateDailyLeadGoal(8, 5);
    const theme = getDailyLeadGoalTheme(exact.status);

    expect(exact.isBelowTarget).toBe(false);
    expect(exact.status).toBe("on_target");
    expect(exact.progressPercent).toBe(100);
    expect(exact.remaining).toBe(0);
    expect(theme.barFillClass).toContain("emerald");
    expect(getProgressWidthClass(exact.progressPercent)).toBe("w-full");

    expect(exceeded.isBelowTarget).toBe(false);
    expect(exceeded.progressPercent).toBe(100);
    expect(exceeded.helperText).toContain("Exceeded daily target by 3 qualified leads.");
  });

  it("sanitizes invalid inputs and resolves targets from store, env, or default", () => {
    const sanitized = evaluateDailyLeadGoal(-4, 0);
    expect(sanitized.qualifiedLeads).toBe(0);
    expect(sanitized.dailyTarget).toBe(DEFAULT_DAILY_LEAD_TARGET);

    expect(resolveDailyLeadTarget(10, "7")).toBe(10);
    expect(resolveDailyLeadTarget(undefined, "8")).toBe(8);
    expect(resolveDailyLeadTarget(0, "invalid")).toBe(DEFAULT_DAILY_LEAD_TARGET);
  });
});
