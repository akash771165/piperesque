import { afterEach, describe, expect, it, vi } from "vitest";

import { createBlogTemplate } from "../../../scripts/blog/template.mjs";

afterEach(() => {
  vi.useRealTimers();
});

describe("createBlogTemplate", () => {
  it("builds a draft blog from a keyword", () => {
    const template = createBlogTemplate({ keyword: "Drain Cleaning" });

    expect(template).toMatchObject({
      slug: "drain-cleaning-houston-tx",
      keyword: "Drain Cleaning",
      city: "Houston",
      service: "Plumbing",
      author: "PipeResque",
      published: false,
      headings: [],
      faq: [],
      content: "",
    });
  });

  it("normalizes known cities into slugs with the state suffix", () => {
    expect(createBlogTemplate({ keyword: "Leak Detection", city: "katy" }).slug).toBe(
      "leak-detection-katy-tx"
    );
    expect(
      createBlogTemplate({ keyword: "Leak Detection", city: "  Sugar Land " }).slug
    ).toBe("leak-detection-sugar-land-tx");
    expect(
      createBlogTemplate({ keyword: "Leak Detection", city: "Cypress" }).slug
    ).toBe("leak-detection-cypress-tx");
  });

  it("leaves unknown cities untouched", () => {
    expect(
      createBlogTemplate({ keyword: "Leak Detection", city: "Pearland" }).slug
    ).toBe("leak-detection-pearland");
  });

  it("keeps the raw city in the seo copy", () => {
    const template = createBlogTemplate({ keyword: "Leak Detection", city: "Katy" });

    expect(template.title).toContain("in Katy");
    expect(template.description).toContain("in Katy?");
  });

  it("accepts a custom service", () => {
    expect(
      createBlogTemplate({ keyword: "Hydro Jetting", service: "Drain Cleaning" })
        .service
    ).toBe("Drain Cleaning");
  });

  it("stamps matching iso timestamps", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-05T10:00:00.000Z"));

    const template = createBlogTemplate({ keyword: "Pipe Repair" });

    expect(template.createdAt).toBe("2026-05-05T10:00:00.000Z");
    expect(template.updatedAt).toBe(template.createdAt);
  });
});
