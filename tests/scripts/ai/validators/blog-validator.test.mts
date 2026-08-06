import { beforeEach, describe, expect, it, vi } from "vitest";

import {
  BlogValidator,
  assertValidBlog,
  validateBlog,
} from "../../../../scripts/ai/validators/blog-validator.mjs";

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

function words(count: number) {
  return Array.from({ length: count }, (_, index) => `word${index}`).join(" ");
}

function validBlog(overrides: Record<string, unknown> = {}) {
  return {
    slug: "emergency-plumber-houston",
    title: "Emergency Plumber Houston: 24/7 Response",
    description:
      "Need an emergency plumber in Houston? PipeResque dispatches licensed plumbers around the clock for leaks and clogs.",
    keyword: "emergency plumber houston",
    content: words(1500),
    headings: ["H1", "H2", "H3", "H4", "H5"],
    faq: [
      { question: "Q1", answer: "A1" },
      { question: "Q2", answer: "A2" },
      { question: "Q3", answer: "A3" },
    ],
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("validate", () => {
  it("passes a complete blog with a perfect score", () => {
    expect(validateBlog(validBlog())).toEqual({
      valid: true,
      errors: [],
      warnings: [],
      score: 100,
    });
  });

  it("reports each missing required field", () => {
    const result = validateBlog({});

    expect(result.valid).toBe(false);
    expect(result.errors).toEqual([
      "Missing field: slug",
      "Missing field: title",
      "Missing field: description",
      "Missing field: keyword",
      "Missing field: content",
      "Missing field: headings",
      "Missing field: faq",
      "Headings must be an array.",
      "FAQ must be an array.",
    ]);
  });

  it("honours custom required fields", () => {
    const result = validateBlog(validBlog(), { requiredFields: ["author"] });

    expect(result.errors).toEqual(["Missing field: author"]);
  });

  it("rejects an invalid slug", () => {
    expect(validateBlog(validBlog({ slug: "Bad Slug" })).errors).toContain(
      "Slug contains invalid characters."
    );
  });

  it("rejects an overlong title and warns on a short one", () => {
    expect(validateBlog(validBlog({ title: "a".repeat(61) })).errors).toContain(
      "Title exceeds 60 characters."
    );
    expect(validateBlog(validBlog({ title: "Short title" })).warnings).toContain(
      "Title is too short."
    );
  });

  it("rejects an overlong description and warns on a short one", () => {
    expect(
      validateBlog(validBlog({ description: "a".repeat(161) })).errors
    ).toContain("Description exceeds 160 characters.");
    expect(
      validateBlog(validBlog({ description: "Too short to rank well." })).warnings
    ).toContain("Meta description is short.");
  });

  it("enforces the word count range", () => {
    expect(validateBlog(validBlog({ content: words(100) })).errors).toContain(
      "Content must contain at least 1200 words."
    );
    expect(validateBlog(validBlog({ content: words(4000) })).warnings).toContain(
      "Content exceeds 3500 words."
    );
  });

  it("honours custom word count thresholds", () => {
    expect(
      validateBlog(validBlog({ content: words(100) }), { minWords: 50 }).errors
    ).toEqual([]);
  });

  it("validates the headings array", () => {
    expect(validateBlog(validBlog({ headings: "nope" })).errors).toContain(
      "Headings must be an array."
    );
    expect(validateBlog(validBlog({ headings: ["one"] })).warnings).toContain(
      "Too few headings."
    );
    expect(
      validateBlog(validBlog({ headings: ["a", "b", "c", "d", 5] })).errors
    ).toContain("Invalid heading.");
  });

  it("validates the faq array", () => {
    expect(validateBlog(validBlog({ faq: "nope" })).errors).toContain(
      "FAQ must be an array."
    );
    expect(
      validateBlog(validBlog({ faq: [{ question: "Q", answer: "A" }] })).warnings
    ).toContain("Too few FAQs.");
    expect(
      validateBlog(
        validBlog({
          faq: [
            { question: "Q", answer: "A" },
            { question: "Q" },
            { answer: "A" },
          ],
        })
      ).errors
    ).toContain("Invalid FAQ item.");
  });
});

describe("score", () => {
  it("deducts 15 per error and 3 per warning, floored at zero", () => {
    const validator = new BlogValidator();

    expect(validator.score([], [])).toBe(100);
    expect(validator.score(["e"], ["w", "w"])).toBe(79);
    expect(validator.score(new Array(10).fill("e"), [])).toBe(0);
  });
});

describe("log", () => {
  it("logs success and warnings", () => {
    new BlogValidator().log({ valid: true, errors: [], warnings: ["w"], score: 97 });

    expect(logger.success).toHaveBeenCalledWith("Validation passed (Score: 97)");
    expect(logger.warning).toHaveBeenCalledWith("1 warning(s) found.");
  });

  it("logs failures", () => {
    new BlogValidator().log({ valid: false, errors: ["a", "b"], warnings: [], score: 70 });

    expect(logger.error).toHaveBeenCalledWith("Validation failed (2 errors)");
    expect(logger.warning).not.toHaveBeenCalled();
  });
});

describe("assertValidBlog", () => {
  it("returns the result for a valid blog", () => {
    expect(assertValidBlog(validBlog()).valid).toBe(true);
  });

  it("throws with every error message", () => {
    expect(() => assertValidBlog({ ...validBlog(), slug: "Bad Slug" })).toThrow(
      "Slug contains invalid characters."
    );
  });
});
