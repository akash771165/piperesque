import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "node:fs";
import path from "node:path";
import os from "node:os";
import { RevenueTracker } from "../../../scripts/growth/revenue-tracker.mjs";

describe("RevenueTracker Real Business Rules & Zero-PII Integrity", () => {
  let tempStoreFile: string;

  beforeEach(() => {
    tempStoreFile = path.join(os.tmpdir(), `test-revenue-store-${Date.now()}-${Math.random().toString(36).slice(2)}.json`);
  });

  afterEach(() => {
    if (fs.existsSync(tempStoreFile)) {
      try {
        fs.unlinkSync(tempStoreFile);
      } catch {
        // Ignore cleanup error
      }
    }
  });

  it("initializes with zero verified revenue when no payments are verified", () => {
    const tracker = new RevenueTracker(tempStoreFile);
    const metrics = tracker.getMetrics();
    expect(metrics.verifiedRevenue).toBe("$0.00");
    expect(metrics.pendingRevenue).toBe("$0.00");
  });

  it("records genuine form submissions and differentiates qualified vs unqualified leads", () => {
    const tracker = new RevenueTracker(tempStoreFile);
    const initialSubmits = tracker.data.summary.totalFormSubmissions;
    const initialQualified = tracker.data.summary.totalQualifiedLeads;

    tracker.recordFormSubmission({
      leadReferenceId: "PR-77002-TEST1",
      serviceCategory: "sewer-line-repair",
      zipCode: "77002",
      isQualified: true
    });

    expect(tracker.data.summary.totalFormSubmissions).toBe(initialSubmits + 1);
    expect(tracker.data.summary.totalQualifiedLeads).toBe(initialQualified + 1);
  });

  it("records verified contractor settlement only upon confirmed payment verification", () => {
    const tracker = new RevenueTracker(tempStoreFile);
    tracker.recordVerifiedSettlement({
      leadReferenceId: "PR-77002-PAID1",
      contractorPayout: 50.00,
      providerId: "HOU-PLUMB-01",
      settlementDate: "2026-11-06"
    });

    expect(tracker.data.summary.totalVerifiedReferralRevenue).toBe("$50.00");
    expect(tracker.data.transactions.length).toBe(1);
    const tx = tracker.data.transactions[0];
    expect(tx.status).toBe("verified_paid");
    expect(tx).not.toHaveProperty("phone");
    expect(tx).not.toHaveProperty("customerName");
  });
});
