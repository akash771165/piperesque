import { describe, it, expect } from "vitest";
import { GSCClient } from "../../../scripts/growth/gsc-client.mjs";

describe("GSCClient Real Telemetry & Zero Seeded Fallback Integrity", () => {
  it("strictly returns NOT_CONFIGURED when credentials are missing", async () => {
    // Instantiate with empty credentials
    const client = new GSCClient({ clientEmail: "", privateKey: "" });
    expect(client.isConfigured()).toBe(false);

    const data = await client.getPerformanceData();
    expect(data.status).toBe("NOT_CONFIGURED");
    expect(data.rows.length).toBe(0);
    expect(data.totalQueriesAnalyzed).toBe(0);
    expect(data.message).toContain("not configured");
  });

  it("never invents or substitutes fake rows when unconfigured", () => {
    const client = new GSCClient({ clientEmail: "", privateKey: "" });
    const analysis = client.analyzeOpportunities({ status: "NOT_CONFIGURED", rows: [] });
    
    expect(analysis.status).toBe("NOT_CONFIGURED");
    expect(analysis.totalQueriesAnalyzed).toBe(0);
    expect(analysis.lowCtrOpportunities.length).toBe(0);
    expect(analysis.strikingDistance.length).toBe(0);
  });

  it("analyzes genuine query distributions correctly", () => {
    const client = new GSCClient({ clientEmail: "", privateKey: "" });
    const mockLiveData = {
      status: "LIVE",
      source: "google_search_console_api",
      asOfDate: "2026-11-03",
      rows: [
        { query: "emergency plumber houston", page: "https://www.piperesque.com/services/emergency-plumbing", clicks: 5, impressions: 500, ctr: 0.01, position: 6.2 },
        { query: "sewer line repair houston", page: "https://www.piperesque.com/services/sewer-line-repair", clicks: 12, impressions: 600, ctr: 0.02, position: 8.4 },
        { query: "slab leak detection houston", page: "https://www.piperesque.com/services/leak-detection", clicks: 2, impressions: 300, ctr: 0.006, position: 14.5 }
      ]
    };

    const analysis = client.analyzeOpportunities(mockLiveData);
    expect(analysis.status).toBe("LIVE");
    expect(analysis.totalQueriesAnalyzed).toBe(3);
    // emergency plumber (1%) and slab leak (0.6%) have ctr < 0.02
    expect(analysis.lowCtrOpportunities.length).toBe(2);
    // all 3 are in positions 5 to 30
    expect(analysis.strikingDistance.length).toBe(3);
  });

  it("preserves trailing slash on GSC site property", () => {
    const client = new GSCClient({ siteUrl: "https://www.piperesque.com" });
    expect(client.siteUrl).toBe("https://www.piperesque.com/");
  });
});
