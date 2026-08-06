import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  SEOValidator,
  assertValidSEO,
  validateSEO,
} from "../../../../scripts/ai/validators/seo-validator.mjs";

const { logger } = vi.hoisted(() => ({
  logger: {
    info: vi.fn(),
    success: vi.fn(),
    warning: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("../../../../scripts/shared/logger.mjs", () => ({
  default: logger,
  ...logger,
}));

function validSeo(overrides: Record<string, unknown> = {}) {
  return {
    title: "Emergency Plumber Houston: 24/7 Response",
    description:
      "Need an emergency plumber in Houston? PipeResque dispatches licensed plumbers around the clock for leaks, clogs and bursts.",
    canonical: "https://www.piperesque.com/blog/emergency-plumber-houston",
    keywords: ["emergency plumber", "houston plumber", "24/7 plumber"],
    openGraph: {
      title: "Emergency Plumber Houston",
      description: "24/7 licensed plumbers in Houston.",
      images: ["https://www.piperesque.com/og.jpg"],
    },
    twitter: {
      card: "summary_large_image",
      title: "Emergency Plumber Houston",
      description: "24/7 licensed plumbers in Houston.",
    },
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("validate", () => {
  it("passes complete seo metadata", () => {
    expect(validateSEO(validSeo())).toEqual({
      valid: true,
      errors: [],
      warnings: [],
      score: 100,
    });
  });

  it("reports everything missing on an empty object", () => {
    const result = validateSEO({});

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([
      "SEO title missing.",
      "Meta description missing.",
      "Canonical URL missing.",
      "Keywords must be an array.",
      "Open Graph data missing.",
      "Twitter Card missing.",
    ]);
    expect(result.score).toBe(10);
  });

  it("validates the title length", () => {
    expect(validateSEO(validSeo({ title: "a".repeat(61) })).errors).toContain(
      "Title exceeds 60 characters."
    );
    expect(validateSEO(validSeo({ title: "Short title" })).warnings).toContain(
      "SEO title is short."
    );
  });

  it("validates the description length", () => {
    expect(
      validateSEO(validSeo({ description: "a".repeat(161) })).errors
    ).toContain("Description exceeds 160 characters.");
    expect(
      validateSEO(validSeo({ description: "Too short." })).warnings
    ).toContain("Meta description is short.");
  });

  it("rejects a malformed canonical url", () => {
    expect(validateSEO(validSeo({ canonical: "not a url" })).errors).toContain(
      "Canonical URL is invalid."
    );
  });

  it("skips optional checks when not required", () => {
    const result = validateSEO(
      {
        title: validSeo().title,
        description: validSeo().description,
        keywords: validSeo().keywords,
      },
      {
        requireCanonical: false,
        requireOpenGraph: false,
        requireTwitter: false,
      }
    );

    expect(result.valid).toBe(true);
  });

  it("warns about too few and too many keywords", () => {
    expect(validateSEO(validSeo({ keywords: ["one"] })).warnings).toContain(
      "Too few keywords."
    );
    expect(
      validateSEO(validSeo({ keywords: new Array(20).fill("keyword") })).warnings
    ).toContain("Too many keywords.");
  });

  it("honours custom keyword thresholds", () => {
    expect(
      validateSEO(validSeo({ keywords: ["one"] }), { minKeywords: 1 }).warnings
    ).toEqual([]);
  });

  it("reports each missing open graph field", () => {
    expect(validateSEO(validSeo({ openGraph: {} })).errors).toEqual([
      "Open Graph title missing.",
      "Open Graph description missing.",
      "Open Graph image missing.",
    ]);
    expect(
      validateSEO(validSeo({ openGraph: { ...validSeo().openGraph, images: [] } }))
        .errors
    ).toEqual(["Open Graph image missing."]);
  });

  it("reports each missing twitter field", () => {
    expect(validateSEO(validSeo({ twitter: {} })).errors).toEqual([
      "Twitter card type missing.",
      "Twitter title missing.",
      "Twitter description missing.",
    ]);
  });
});

describe("calculateScore", () => {
  it("deducts 15 per error and 3 per warning, floored at zero", () => {
    const validator = new SEOValidator();

    expect(validator.calculateScore([], [])).toBe(100);
    expect(validator.calculateScore(["e"], ["w"])).toBe(82);
    expect(validator.calculateScore(new Array(7).fill("e"), [])).toBe(0);
  });
});

describe("log", () => {
  it("logs success and warnings", () => {
    new SEOValidator().log({ valid: true, errors: [], warnings: ["w"], score: 97 });

    expect(logger.success).toHaveBeenCalledWith("SEO validation passed (Score: 97)");
    expect(logger.warning).toHaveBeenCalledWith("1 warning(s) detected.");
  });

  it("logs failures", () => {
    new SEOValidator().log({ valid: false, errors: ["a"], warnings: [], score: 85 });

    expect(logger.error).toHaveBeenCalledWith("SEO validation failed (1 errors)");
  });
});

describe("assertValidSEO", () => {
  it("returns the result for valid metadata", () => {
    expect(assertValidSEO(validSeo()).valid).toBe(true);
  });

  it("throws when metadata is invalid", () => {
    expect(() => assertValidSEO({})).toThrow("SEO title missing.");
  });
});
