import { describe, expect, it } from "vitest";

import {
  isArray,
  isNonEmptyString,
  isObject,
  isString,
  validateBlog,
  validateDescription,
  validateSlug,
  validateTitle,
} from "../../../scripts/shared/validator.mjs";

describe("type guards", () => {
  it("detects strings", () => {
    expect(isString("a")).toBe(true);
    expect(isString("")).toBe(true);
    expect(isString(1)).toBe(false);
  });

  it("detects non empty strings", () => {
    expect(isNonEmptyString("a")).toBe(true);
    expect(isNonEmptyString("   ")).toBe(false);
    expect(isNonEmptyString(null)).toBe(false);
  });

  it("detects arrays", () => {
    expect(isArray([])).toBe(true);
    expect(isArray({})).toBe(false);
  });

  it("detects plain objects only", () => {
    expect(isObject({})).toBe(true);
    expect(isObject([])).toBe(false);
    expect(isObject(null)).toBe(false);
  });
});

describe("validateSlug", () => {
  it("accepts lowercase kebab slugs", () => {
    expect(validateSlug("drain-cleaning-houston-2026")).toBe(true);
  });

  it("rejects uppercase, spaces, underscores and empty slugs", () => {
    expect(validateSlug("Drain-Cleaning")).toBe(false);
    expect(validateSlug("drain cleaning")).toBe(false);
    expect(validateSlug("drain_cleaning")).toBe(false);
    expect(validateSlug("")).toBe(false);
  });
});

describe("validateTitle", () => {
  it("accepts a title within the limit", () => {
    expect(validateTitle("Drain Cleaning Houston")).toBe(true);
  });

  it("rejects an empty or overlong title", () => {
    expect(validateTitle("   ")).toBe(false);
    expect(validateTitle("a".repeat(61))).toBe(false);
    expect(validateTitle("a".repeat(60))).toBe(true);
  });
});

describe("validateDescription", () => {
  it("accepts a description within the limit", () => {
    expect(validateDescription("a".repeat(160))).toBe(true);
  });

  it("rejects an empty or overlong description", () => {
    expect(validateDescription("")).toBe(false);
    expect(validateDescription("a".repeat(161))).toBe(false);
  });
});

const draft = {
  slug: "drain-cleaning-houston",
  title: "Drain Cleaning Houston",
  description: "Fast drain cleaning across Houston, available 24/7.",
  content: "",
  headings: [],
  faq: [],
};

describe("validateBlog", () => {
  it("returns no errors for a valid draft", () => {
    expect(validateBlog(draft)).toEqual([]);
  });

  it("rejects non object input immediately", () => {
    expect(validateBlog("nope")).toEqual(["Blog must be an object."]);
    expect(validateBlog(null)).toEqual(["Blog must be an object."]);
  });

  it("collects every field error", () => {
    expect(
      validateBlog({
        slug: "Bad Slug",
        title: "",
        description: "",
        content: 42,
        headings: "not-an-array",
        faq: "not-an-array",
      })
    ).toEqual([
      "Invalid slug.",
      "Invalid SEO title.",
      "Invalid meta description.",
      "Content must be a string.",
      "Headings must be an array.",
      "FAQ must be an array.",
    ]);
  });

  it("allows drafts with empty content", () => {
    expect(validateBlog({ ...draft, published: false })).toEqual([]);
  });

  it("requires content once published", () => {
    expect(validateBlog({ ...draft, published: true })).toEqual([
      "Published blog must contain content.",
    ]);
    expect(validateBlog({ ...draft, published: true, content: "Body" })).toEqual(
      []
    );
  });

  it("treats missing headings and faq as valid", () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { headings, faq, ...withoutOptional } = draft;

    expect(validateBlog(withoutOptional)).toEqual([]);
  });
});
