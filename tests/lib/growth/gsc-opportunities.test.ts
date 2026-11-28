import { describe, expect, it } from "vitest";
import {
  classifyRankingTier,
  extractPagePath,
  loadTopLowCtrQueries,
  selectTopHighImpressionLowCtrQueries,
  type RawGscQueryRow,
} from "@/lib/growth/gsc-opportunities";

describe("GSC high-impression / low-CTR opportunity selection", () => {
  const sampleRows: RawGscQueryRow[] = [
    {
      query: "emergency plumbing houston tx",
      page: "https://www.piperesque.com/services/emergency-plumbing",
      clicks: 34,
      impressions: 1420,
      ctr: 0.0239, // >= 2% CTR -> excluded by strict low-CTR filter
      position: 6.2,
    },
    {
      query: "sewer line repair houston",
      page: "https://www.piperesque.com/services/sewer-line-repair",
      clicks: 18,
      impressions: 1190,
      ctr: 0.0151,
      position: 8.4,
    },
    {
      query: "slab leak detection cost houston",
      page: "https://www.piperesque.com/services/leak-detection",
      clicks: 12,
      impressions: 980,
      ctr: 0.0122,
      position: 12.3,
    },
    {
      query: "ac condensate line backing up into sink houston",
      page: "https://www.piperesque.com/services/drain-cleaning",
      clicks: 6,
      impressions: 740,
      ctr: 0.0081,
      position: 19.5,
    },
    {
      query: "hydro jetting cost houston",
      page: "https://www.piperesque.com/services/drain-cleaning",
      clicks: 8,
      impressions: 710,
      ctr: 0.0112,
      position: 14.8,
    },
  ];

  it("selects the top 3 high-impression (<2% CTR) queries sorted by impressions descending", () => {
    const top3 = selectTopHighImpressionLowCtrQueries(sampleRows, 3);

    expect(top3).toHaveLength(3);
    expect(top3.map((q) => q.query)).toEqual([
      "sewer line repair houston",
      "slab leak detection cost houston",
      "ac condensate line backing up into sink houston",
    ]);
    expect(top3[0]).toMatchObject({
      pagePath: "/services/sewer-line-repair",
      impressions: 1190,
      clicks: 18,
      formattedCtr: "1.51%",
      formattedPosition: "#8.4",
      rankingTier: "Page 1",
    });
    expect(top3[1].rankingTier).toBe("Striking Distance");
  });

  it("merges duplicate query rows across devices using weighted position and combined CTR", () => {
    const multiDevice: RawGscQueryRow[] = [
      {
        query: "sewer line repair houston",
        page: "https://www.piperesque.com/services/sewer-line-repair",
        device: "MOBILE",
        clicks: 2,
        impressions: 200,
        ctr: 0.01,
        position: 8.0,
      },
      {
        query: "sewer line repair houston",
        page: "https://www.piperesque.com/services/sewer-line-repair",
        device: "DESKTOP",
        clicks: 1,
        impressions: 100,
        ctr: 0.01,
        position: 11.0,
      },
    ];

    const result = selectTopHighImpressionLowCtrQueries(multiDevice, 3);
    expect(result).toHaveLength(1);
    expect(result[0].impressions).toBe(300);
    expect(result[0].clicks).toBe(3);
    expect(result[0].formattedCtr).toBe("1.00%");
    expect(result[0].formattedPosition).toBe("#9.0");
  });

  it("falls back to >=10 impressions & <3% CTR for low-volume properties without fabricating rows", () => {
    const lowVolume: RawGscQueryRow[] = [
      {
        query: "sewer stopage cypress tx",
        page: "https://www.piperesque.com/service-areas/cypress",
        clicks: 0,
        impressions: 35,
        ctr: 0,
        position: 9.2,
      },
    ];

    const result = selectTopHighImpressionLowCtrQueries(lowVolume, 3);
    expect(result).toHaveLength(1);
    expect(result[0].query).toBe("sewer stopage cypress tx");
    expect(result[0].formattedCtr).toBe("0.00%");
  });

  it("extracts page paths and classifies ranking tiers cleanly", () => {
    expect(extractPagePath("https://www.piperesque.com/services/pipe-repair")).toBe(
      "/services/pipe-repair"
    );
    expect(extractPagePath("/location/houston/leak-detection")).toBe(
      "/location/houston/leak-detection"
    );
    expect(extractPagePath("")).toBeNull();

    expect(classifyRankingTier(4.2)).toBe("Page 1");
    expect(classifyRankingTier(14.8)).toBe("Striking Distance");
    expect(classifyRankingTier(27.5)).toBe("Page 3+");
  });

  it("loads top 3 low-CTR queries cleanly from the workspace data store when skipping live network calls", async () => {
    const summary = await loadTopLowCtrQueries(3, { skipLiveApi: true });

    expect(summary.queries).toHaveLength(3);
    expect(summary.totalQueriesAnalyzed).toBeGreaterThanOrEqual(3);
    expect(summary.queries[0].impressions).toBeGreaterThanOrEqual(
      summary.queries[1].impressions
    );
  });
});
