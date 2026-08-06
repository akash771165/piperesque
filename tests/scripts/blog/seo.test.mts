import { describe, expect, it } from "vitest";

import { generateDescription, generateTitle } from "../../../scripts/blog/seo.mjs";
import { SEO } from "../../../scripts/shared/constants.mjs";

describe("generateTitle", () => {
  it("appends the service suffix", () => {
    expect(generateTitle("Drain Cleaning", "Katy")).toBe(
      "Drain Cleaning | 24/7 Plumbing Services in Katy"
    );
  });

  it("defaults the city to Houston", () => {
    expect(generateTitle("Leak Detection")).toContain("in Houston");
  });

  it("truncates to the seo title limit", () => {
    const title = generateTitle("Emergency Trenchless Sewer Line Replacement");

    expect(title.length).toBeLessThanOrEqual(SEO.TITLE_MAX);
    expect(title.endsWith("...")).toBe(true);
  });

  it("does not truncate a short title", () => {
    expect(generateTitle("Toilet Repair").endsWith("...")).toBe(false);
  });
});

describe("generateDescription", () => {
  it("lowercases the keyword inside the sentence", () => {
    expect(generateDescription("Drain Cleaning", "Katy")).toContain(
      "Need drain cleaning in Katy?"
    );
  });

  it("defaults the city to Houston", () => {
    expect(generateDescription("Leak Detection")).toContain("in Houston?");
  });

  it("does not truncate a short description", () => {
    expect(generateDescription("Leak Detection").endsWith("...")).toBe(false);
  });

  it("truncates to the seo description limit", () => {
    const description = generateDescription(
      "Emergency Trenchless Sewer Line Replacement And Inspection"
    );

    expect(description.length).toBeLessThanOrEqual(SEO.DESCRIPTION_MAX);
    expect(description.endsWith("...")).toBe(true);
  });
});
