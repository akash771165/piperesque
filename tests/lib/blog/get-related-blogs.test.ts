import { beforeEach, describe, expect, it, vi } from "vitest";

import { getRelatedBlogs } from "@/lib/blog/get-related-blogs";
import type { BlogContent } from "@/types/blog";

const { getAllBlogData } = vi.hoisted(() => ({
  getAllBlogData: vi.fn(),
}));

vi.mock("@/lib/blog/get-all-blog-data", () => ({ getAllBlogData }));

function blog(overrides: Partial<BlogContent> & { slug: string }): BlogContent {
  return {
    title: `Blog ${overrides.slug}`,
    introduction: [],
    sections: [],
    faqs: [],
    callToAction: { title: "", description: "", button: "" },
    ...overrides,
  };
}

const current = blog({
  slug: "current",
  title: "Emergency Sewer Line Repair Houston",
  category: "Sewer",
  keywords: ["sewer repair", "houston"],
  locations: ["houston", "katy"],
  service: { name: "Sewer Line Repair" },
});

beforeEach(() => {
  getAllBlogData.mockReset();
});

describe("getRelatedBlogs", () => {
  it("excludes the current blog", async () => {
    getAllBlogData.mockReturnValue([current, blog({ slug: "other", category: "Sewer" })]);

    expect(getRelatedBlogs(current).map((link) => link.url)).toEqual([
      "/blog/other",
    ]);
  });

  it("drops blogs with no signal in common", () => {
    getAllBlogData.mockReturnValue([
      blog({ slug: "unrelated", title: "Cat", category: "Heating" }),
      blog({ slug: "same-category", category: "Sewer" }),
    ]);

    expect(getRelatedBlogs(current)).toEqual([
      { title: "Blog same-category", url: "/blog/same-category" },
    ]);
  });

  it("ranks by weighted score, highest first", () => {
    getAllBlogData.mockReturnValue([
      blog({ slug: "category-only", title: "Nothing", category: "Sewer" }),
      blog({
        slug: "service-match",
        title: "Nothing",
        service: { name: "Sewer Line Repair" },
      }),
      blog({ slug: "keyword-match", title: "Nothing", keywords: ["houston"] }),
    ]);

    expect(getRelatedBlogs(current).map((link) => link.url)).toEqual([
      "/blog/service-match",
      "/blog/category-only",
      "/blog/keyword-match",
    ]);
  });

  it("scores every matching keyword and location", () => {
    getAllBlogData.mockReturnValue([
      blog({
        slug: "two-keywords",
        title: "Nothing",
        keywords: ["sewer repair", "houston", "unused"],
      }),
      blog({
        slug: "one-location",
        title: "Nothing",
        locations: ["katy"],
      }),
    ]);

    expect(getRelatedBlogs(current).map((link) => link.url)).toEqual([
      "/blog/two-keywords",
      "/blog/one-location",
    ]);
  });

  it("scores title words longer than four characters", () => {
    getAllBlogData.mockReturnValue([
      blog({ slug: "title-words", title: "Sewer Repair In Houston Homes" }),
      blog({ slug: "short-words-only", title: "The Big Fix Job" }),
    ]);

    expect(getRelatedBlogs(current).map((link) => link.url)).toEqual([
      "/blog/title-words",
    ]);
  });

  it("honours the default limit of six", () => {
    getAllBlogData.mockReturnValue(
      Array.from({ length: 10 }, (_, index) =>
        blog({ slug: `match-${index}`, title: "Nothing", category: "Sewer" })
      )
    );

    expect(getRelatedBlogs(current)).toHaveLength(6);
  });

  it("honours a custom limit and custom weights", () => {
    getAllBlogData.mockReturnValue([
      blog({ slug: "category-only", title: "Nothing", category: "Sewer" }),
      blog({
        slug: "service-match",
        title: "Nothing",
        service: { name: "Sewer Line Repair" },
      }),
    ]);

    expect(
      getRelatedBlogs(current, {
        limit: 1,
        categoryWeight: 100,
      }).map((link) => link.url)
    ).toEqual(["/blog/category-only"]);
  });

  it("falls back to a generic link title", () => {
    getAllBlogData.mockReturnValue([
      blog({ slug: "untitled", title: undefined, category: "Sewer" }),
    ]);

    expect(getRelatedBlogs(current)).toEqual([
      { title: "Related Article", url: "/blog/untitled" },
    ]);
  });

  it("returns nothing when the current blog carries no metadata", () => {
    getAllBlogData.mockReturnValue([
      blog({ slug: "a", category: "Sewer", keywords: ["houston"] }),
    ]);

    expect(getRelatedBlogs(blog({ slug: "bare", title: undefined }))).toEqual([]);
  });

  it("returns nothing when there are no other blogs", () => {
    getAllBlogData.mockReturnValue([]);

    expect(getRelatedBlogs(current)).toEqual([]);
  });
});
