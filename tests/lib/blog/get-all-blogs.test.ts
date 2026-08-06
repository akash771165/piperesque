import { afterEach, describe, expect, it, vi } from "vitest";

import { createContentRoot, removeContentRoot } from "../../helpers/blog-fixtures";

vi.mock("@/lib/data/blog-content", () => ({
  blogContent: {
    "legacy-one": { title: "Legacy One" },
    "legacy-two": { title: "Legacy Two" },
  },
}));

const roots: string[] = [];

async function loadGetAllBlogs(
  blogs: Record<string, unknown> = {},
  options: { createDirectory?: boolean } = {}
) {
  const root = createContentRoot(blogs, options);

  roots.push(root);
  vi.spyOn(process, "cwd").mockReturnValue(root);
  vi.resetModules();

  return (await import("@/lib/blog/get-all-blogs")).getAllBlogs;
}

afterEach(() => {
  vi.restoreAllMocks();
  roots.splice(0).forEach(removeContentRoot);
});

describe("getAllBlogs", () => {
  it("merges legacy slugs with json cms slugs", async () => {
    const getAllBlogs = await loadGetAllBlogs({
      "json-one": { title: "Json One" },
    });

    expect(getAllBlogs().sort()).toEqual([
      "json-one",
      "legacy-one",
      "legacy-two",
    ]);
  });

  it("deduplicates slugs present in both systems", async () => {
    const getAllBlogs = await loadGetAllBlogs({
      "legacy-one": { title: "Json override" },
    });

    const slugs = getAllBlogs();

    expect(slugs).toHaveLength(2);
    expect(slugs.filter((slug) => slug === "legacy-one")).toHaveLength(1);
  });

  it("lists legacy slugs first", async () => {
    const getAllBlogs = await loadGetAllBlogs({ "json-one": {} });

    expect(getAllBlogs()).toEqual(["legacy-one", "legacy-two", "json-one"]);
  });

  it("ignores non json files", async () => {
    const getAllBlogs = await loadGetAllBlogs({
      "json-one": {},
      "notes.txt": "ignored",
    });

    expect(getAllBlogs()).not.toContain("notes.txt");
    expect(getAllBlogs()).toContain("json-one");
  });

  it("falls back to legacy slugs when the content directory is missing", async () => {
    const getAllBlogs = await loadGetAllBlogs({}, { createDirectory: false });

    expect(getAllBlogs()).toEqual(["legacy-one", "legacy-two"]);
  });
});
