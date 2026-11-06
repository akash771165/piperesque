import { describe, it, expect } from "vitest";
import { ContentRegistry } from "../../../scripts/growth/content-registry.mjs";

describe("ContentRegistry & Duplicate Content Intelligence", () => {
  it("initializes and indexes existing website content", () => {
    const registry = new ContentRegistry();
    expect(registry.entries.length).toBeGreaterThan(0);
    expect(registry.slugIndex.size).toBeGreaterThan(0);
  });

  it("detects exact slug collision and rejects topic", () => {
    const registry = new ContentRegistry();
    const result = registry.checkTopicSimilarity({
      slug: "water-heater-expansion-tank-houston-tx",
      primaryKeyword: "water heater expansion tank Houston",
      title: "Water Heater Expansion Tank in Houston"
    });

    expect(result.isDuplicate).toBe(true);
    expect(result.action).toBe("REJECT");
    expect(result.similarityScore).toBe(1.0);
  });

  it("detects high lexical overlap and rejects near-duplicate topic", () => {
    const registry = new ContentRegistry();
    const result = registry.checkTopicSimilarity({
      slug: "expansion-tank-water-heater-houston",
      primaryKeyword: "water heater expansion tank symptoms houston tx",
      relatedKeywords: ["expansion tank repair Houston", "closed plumbing system PRV"] as string[],
      title: "Houston Water Heater Expansion Tank Symptoms & Repair"
    });

    // Should detect high similarity with water-heater-expansion-tank-houston-tx
    expect(result.isDuplicate).toBe(true);
    expect(result.similarityScore).toBeGreaterThanOrEqual(0.35);
  });

  it("permits genuinely distinct, novel Houston plumbing topics", () => {
    const registry = new ContentRegistry();
    const result = registry.checkTopicSimilarity({
      slug: "commercial-grease-trap-pumping-regulations-houston",
      primaryKeyword: "commercial grease trap pumping houston",
      relatedKeywords: ["city of houston fats oils grease permit", "interceptor cleaning"] as string[],
      title: "Commercial Grease Trap Pumping Regulations in Houston TX"
    });

    expect(result.isDuplicate).toBe(false);
    expect(result.action).toBe("PERMIT");
    expect(result.similarityScore).toBeLessThan(0.40);
  });
});
