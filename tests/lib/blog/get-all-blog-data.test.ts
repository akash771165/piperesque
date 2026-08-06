import { afterEach, describe, expect, it, vi } from "vitest";

import { createContentRoot, removeContentRoot } from "../../helpers/blog-fixtures";

vi.mock("@/lib/data/blog-content", () => ({
  blogContent: {
    "legacy-blog": {
      title: "Legacy Blog",
      description: "Legacy description",
      publishedAt: "2026-01-01",
    },
    "legacy-incomplete": {
      title: "Legacy Without Description",
    },
  },
}));

const roots: string[] = [];

async function loadGetAllBlogData(
  blogs: Record<string, unknown> = {},
  options: { createDirectory?: boolean } = {}
) {
  const root = createContentRoot(blogs, options);

  roots.push(root);
  vi.spyOn(process, "cwd").mockReturnValue(root);
  vi.resetModules();

  return (await import("@/lib/blog/get-all-blog-data")).getAllBlogData;
}

afterEach(() => {
  vi.restoreAllMocks();
  roots.splice(0).forEach(removeContentRoot);
});

describe("getAllBlogData", () => {
  it("skips entries without a title or description", async () => {
    const getAllBlogData = await loadGetAllBlogData({
      "json-untitled": { description: "No title here" },
    });

    expect(getAllBlogData().map((blog) => blog.slug)).toEqual(["legacy-blog"]);
  });

  it("includes both legacy and json blogs", async () => {
    const getAllBlogData = await loadGetAllBlogData({
      "json-blog": {
        title: "Json Blog",
        description: "Json description",
        publishedAt: "2026-02-01",
      },
    });

    expect(getAllBlogData().map((blog) => blog.slug)).toEqual([
      "json-blog",
      "legacy-blog",
    ]);
  });

  it("sorts newest first", async () => {
    const getAllBlogData = await loadGetAllBlogData({
      older: {
        title: "Older",
        description: "Older description",
        publishedAt: "2025-06-01",
      },
      newer: {
        title: "Newer",
        description: "Newer description",
        publishedAt: "2026-06-01",
      },
    });

    expect(getAllBlogData().map((blog) => blog.slug)).toEqual([
      "newer",
      "legacy-blog",
      "older",
    ]);
  });

  it("projects json blogs onto card data with defaults", async () => {
    const getAllBlogData = await loadGetAllBlogData({
      "json-blog": {
        title: "Json Blog",
        description: "Json description",
      },
    });

    const card = getAllBlogData().find((blog) => blog.slug === "json-blog");

    expect(card).toEqual({
      slug: "json-blog",
      title: "Json Blog",
      description: "Json description",
      image: "/images/blog/default.jpg",
      imageAlt: "Json Blog",
      category: "Plumbing",
      publishedAt: "",
      readingTime: "5 min read",
      keywords: [],
    });
  });

  it("keeps json provided card fields", async () => {
    const getAllBlogData = await loadGetAllBlogData({
      "json-blog": {
        title: "Json Blog",
        description: "Json description",
        image: "/images/blog/custom.jpg",
        imageAlt: "Custom alt",
        category: "Sewer",
        publishedAt: "2026-04-04",
        readingTime: "11 min read",
        keywords: ["sewer", "houston"],
      },
    });

    expect(getAllBlogData()[0]).toEqual({
      slug: "json-blog",
      title: "Json Blog",
      description: "Json description",
      image: "/images/blog/custom.jpg",
      imageAlt: "Custom alt",
      category: "Sewer",
      publishedAt: "2026-04-04",
      readingTime: "11 min read",
      keywords: ["sewer", "houston"],
    });
  });

  it("deduplicates a slug present in both systems", async () => {
    const getAllBlogData = await loadGetAllBlogData({
      "legacy-blog": {
        title: "Json wins",
        description: "Json description",
      },
    });

    const blogs = getAllBlogData();

    expect(blogs).toHaveLength(1);
    expect(blogs[0].title).toBe("Json wins");
  });

  it("works without a content directory", async () => {
    const getAllBlogData = await loadGetAllBlogData({}, { createDirectory: false });

    expect(getAllBlogData().map((blog) => blog.slug)).toEqual(["legacy-blog"]);
  });
});
