import { describe, expect, it } from "vitest";

import { slugify } from "../../../scripts/blog/slugify.mjs";

describe("slugify", () => {
  it("lowercases and hyphenates words", () => {
    expect(slugify("Emergency Plumber Houston")).toBe(
      "emergency-plumber-houston"
    );
  });

  it("trims surrounding whitespace", () => {
    expect(slugify("  Drain Cleaning  ")).toBe("drain-cleaning");
  });

  it("strips diacritics", () => {
    expect(slugify("Réparation Égout")).toBe("reparation-egout");
  });

  it("expands ampersands", () => {
    expect(slugify("Repair & Replace")).toBe("repair-and-replace");
  });

  it("removes punctuation", () => {
    expect(slugify("Water Heater Repair: Costs, Tips (2026)!")).toBe(
      "water-heater-repair-costs-tips-2026"
    );
  });

  it("collapses repeated separators", () => {
    expect(slugify("sewer   line --- repair")).toBe("sewer-line-repair");
  });

  it("removes leading and trailing hyphens", () => {
    expect(slugify("-Slab Leak-")).toBe("slab-leak");
  });

  it("keeps digits", () => {
    expect(slugify("24 Hour Plumber")).toBe("24-hour-plumber");
  });

  it("returns an empty string when nothing survives", () => {
    expect(slugify("!!!")).toBe("");
    expect(slugify("")).toBe("");
  });

  it("throws on non string input", () => {
    expect(() => slugify(undefined)).toThrow(TypeError);
    expect(() => slugify(42)).toThrow("slugify() expects a string.");
  });
});
