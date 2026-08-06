import { afterEach, describe, expect, it, vi } from "vitest";

import { createContentRoot, removeContentRoot } from "../../helpers/blog-fixtures";

vi.mock("@/lib/data/blog-content", () => ({
  blogContent: {
    "legacy-slab-leak-houston": {
      title: "Legacy Slab Leak Repair",
      introduction: ["Legacy intro"],
      sections: [],
      faqs: [],
      callToAction: { title: "Call", description: "Now", button: "Call" },
    },
  },
}));

const roots: string[] = [];

async function loadGetBlogData(blogs: Record<string, unknown> = {}) {
  const root = createContentRoot(blogs);

  roots.push(root);
  vi.spyOn(process, "cwd").mockReturnValue(root);
  vi.resetModules();

  return (await import("@/lib/blog/get-blog-data")).getBlogData;
}

afterEach(() => {
  vi.restoreAllMocks();
  roots.splice(0).forEach(removeContentRoot);
});

describe("getBlogData", () => {
  it("returns a legacy typescript blog when there is no json file", async () => {
    const getBlogData = await loadGetBlogData();

    expect(getBlogData("legacy-slab-leak-houston")?.title).toBe(
      "Legacy Slab Leak Repair"
    );
  });

  it("returns null for an unknown slug", async () => {
    const getBlogData = await loadGetBlogData();

    expect(getBlogData("nope")).toBeNull();
  });

  it("prefers the json cms blog over the legacy blog", async () => {
    const getBlogData = await loadGetBlogData({
      "legacy-slab-leak-houston": { title: "JSON Slab Leak Repair" },
    });

    expect(getBlogData("legacy-slab-leak-houston")?.title).toBe(
      "JSON Slab Leak Repair"
    );
  });

  it("applies defaults to a minimal json blog", async () => {
    const getBlogData = await loadGetBlogData({ minimal: {} });

    expect(getBlogData("minimal")).toMatchObject({
      title: "",
      description: "",
      author: "PipeResque",
      category: "Plumbing",
      image: "/images/blog/default.jpg",
      imageAlt: "PipeResque",
      publishedAt: "",
      updatedAt: "",
      readingTime: "5 min read",
      keywords: [],
      introduction: [],
      sections: [],
      faqs: [],
      seo: {},
      schema: {},
      callToAction: {
        title: "Need Emergency Plumbing Service?",
        description: "Contact a plumbing service provider today.",
        phone: "+1-877-364-0861",
      },
    });
  });

  it("maps legacy json field names onto the current shape", async () => {
    const getBlogData = await loadGetBlogData({
      "field-aliases": {
        title: "Hydro Jetting",
        service: "Drain Cleaning",
        createdAt: "2026-01-02",
        keyword: "hydro jetting houston",
        content: "Single blob of content.",
        faq: [{ question: "Cost?", answer: "Varies." }],
      },
    });

    expect(getBlogData("field-aliases")).toMatchObject({
      category: "Drain Cleaning",
      imageAlt: "Hydro Jetting",
      publishedAt: "2026-01-02",
      updatedAt: "2026-01-02",
      keywords: ["hydro jetting houston"],
      introduction: ["Single blob of content."],
      faqs: [{ question: "Cost?", answer: "Varies." }],
    });
  });

  it("keeps explicitly provided values", async () => {
    const getBlogData = await loadGetBlogData({
      complete: {
        title: "Sewer Repair",
        description: "How sewer repair works",
        author: { name: "Akash" },
        category: "Sewer",
        image: "/images/blog/sewer.jpg",
        imageAlt: "Sewer pipe",
        publishedAt: "2026-02-01",
        updatedAt: "2026-03-01",
        readingTime: "9 min read",
        keywords: ["sewer repair"],
        introduction: ["Intro"],
        sections: [{ title: "Section", content: ["Body"] }],
        faqs: [{ question: "Q", answer: "A" }],
        callToAction: { title: "CTA", description: "D", button: "B" },
        seo: { title: "SEO title" },
        schema: { type: "Article" },
      },
    });

    const blog = getBlogData("complete");

    expect(blog).toMatchObject({
      author: { name: "Akash" },
      category: "Sewer",
      imageAlt: "Sewer pipe",
      updatedAt: "2026-03-01",
      readingTime: "9 min read",
      seo: { title: "SEO title" },
      schema: { type: "Article" },
      callToAction: { title: "CTA", description: "D", button: "B" },
    });
    expect(blog?.sections).toHaveLength(1);
  });

  it("preserves unknown json fields", async () => {
    const getBlogData = await loadGetBlogData({
      extra: { title: "Extra", customField: "kept" },
    });

    expect(getBlogData("extra")).toMatchObject({ customField: "kept" });
  });
});
