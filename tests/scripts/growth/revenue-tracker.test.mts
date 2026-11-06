import { describe, it, expect } from "vitest";
import { RevenueTracker } from "../../../scripts/growth/revenue-tracker.mjs";

describe("RevenueTracker Zero-PII & Business Rules", () => {
  const tracker = new RevenueTracker();

  it("loads revenue metrics cleanly", () => {
    const metrics = tracker.getMetrics();
    expect(metrics.phoneClicks).toBeGreaterThan(0);
    expect(metrics.formSubmits).toBeGreaterThan(0);
    expect(metrics.verifiedRevenue).toBeDefined();
    expect(typeof metrics.verifiedRevenue).toBe("string");
  });

  it("ensures stored transactions contain zero PII", () => {
    const transactions = tracker.data.recentTransactions || [];
    expect(transactions.length).toBeGreaterThan(0);

    for (const tx of transactions) {
      // Must have leadReferenceId starting with PR-
      expect(tx.leadReferenceId).toMatch(/^PR-[0-9]{5}-[A-Z0-9]+$/);
      // Must NOT contain personal identity fields
      expect(tx).not.toHaveProperty("phoneNumber");
      expect(tx).not.toHaveProperty("phone");
      expect(tx).not.toHaveProperty("email");
      expect(tx).not.toHaveProperty("customerName");
      expect(tx).not.toHaveProperty("streetAddress");
    }
  });

  it("differentiates raw clicks from qualified leads and verified revenue", () => {
    const metrics = tracker.getMetrics();
    // Phone clicks (intent signal) must not be counted 1:1 as qualified leads or revenue
    expect(metrics.phoneClicks).toBeGreaterThan(metrics.qualifiedLeads);
    expect(metrics.qualifiedLeads).toBeGreaterThanOrEqual(metrics.referralsDispatched);
  });
});
