import { describe, expect, it } from "vitest";

import {
  BUILD,
  PATHS,
  PROJECT,
  SEO,
  SUPPORTED_LOCATIONS,
  SUPPORTED_SERVICES,
} from "../../../scripts/shared/constants.mjs";

describe("constants", () => {
  it("describes the project", () => {
    expect(PROJECT).toMatchObject({
      name: "piperesque",
      domain: "https://www.piperesque.com",
    });
    expect(() => new URL(PROJECT.domain)).not.toThrow();
  });

  it("uses relative content paths", () => {
    expect(Object.values(PATHS).every((value) => !value.startsWith("/"))).toBe(true);
    expect(PATHS.BLOG_CONTENT).toBe("content/blogs");
  });

  it("keeps supported services and locations as unique slugs", () => {
    for (const list of [SUPPORTED_SERVICES, SUPPORTED_LOCATIONS]) {
      expect(new Set(list).size).toBe(list.length);
      expect(list.every((slug) => /^[a-z0-9-]+$/.test(slug))).toBe(true);
    }
  });

  it("keeps seo limits ordered and within search engine limits", () => {
    expect(SEO.TITLE_MAX).toBeLessThan(SEO.DESCRIPTION_MAX);
    expect(SEO.MIN_WORDS).toBeLessThan(SEO.MAX_WORDS);
  });

  it("exposes build metadata", () => {
    expect(BUILD.VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
