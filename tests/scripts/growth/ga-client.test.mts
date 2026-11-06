import { describe, it, expect } from "vitest";
import { GA4Client } from "../../../scripts/growth/ga-client.mjs";

describe("GA4Client Real Telemetry & Zero Seeded Fallback Integrity", () => {
  it("strictly returns NOT_CONFIGURED with zero sessions when credentials are missing", async () => {
    const client = new GA4Client({ clientEmail: "", privateKey: "", propertyId: "" });
    expect(client.isConfigured()).toBe(false);

    const report = await client.getTrafficAndConversions();
    expect(report.status).toBe("NOT_CONFIGURED");
    expect(report.metrics.uniqueSessions).toBe(0);
    expect(report.metrics.totalVisitors).toBe(0);
    expect(report.eventSummary.click_to_call).toBe(0);
    expect(report.eventSummary.contact_form_submit).toBe(0);
    expect(report.message).toContain("not configured");
  });

  it("fails smoke test gracefully when unconfigured without throwing unhandled exceptions", async () => {
    const client = new GA4Client({ clientEmail: "", privateKey: "", propertyId: "" });
    const smoke = await client.smokeTest();
    expect(smoke.success).toBe(false);
    expect(smoke.reason).toContain("missing");
  });
});
