import fs from "node:fs";
import path from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { createContentRoot, removeContentRoot } from "../../helpers/blog-fixtures";

const roots: string[] = [];

async function loadGetBlog(root: string) {
  roots.push(root);
  vi.spyOn(process, "cwd").mockReturnValue(root);
  vi.resetModules();

  return (await import("@/lib/blog/get-blog")).getBlog;
}

afterEach(() => {
  vi.restoreAllMocks();
  roots.splice(0).forEach(removeContentRoot);
});

describe("getBlog", () => {
  it("reads and parses a blog json file", async () => {
    const getBlog = await loadGetBlog(
      createContentRoot({
        "drain-cleaning-houston": { title: "Drain Cleaning", sections: [] },
      })
    );

    expect(getBlog("drain-cleaning-houston")).toEqual({
      title: "Drain Cleaning",
      sections: [],
    });
  });

  it("returns null for an unknown slug", async () => {
    const getBlog = await loadGetBlog(createContentRoot());

    expect(getBlog("does-not-exist")).toBeNull();
  });

  it("returns null when the content directory is missing", async () => {
    const getBlog = await loadGetBlog(
      createContentRoot({}, { createDirectory: false })
    );

    expect(getBlog("drain-cleaning-houston")).toBeNull();
  });

  it("resolves the slug relative to the working directory", async () => {
    const root = createContentRoot({ "toilet-repair-houston": { title: "T" } });
    const getBlog = await loadGetBlog(root);

    expect(
      fs.existsSync(path.join(root, "content", "blogs", "toilet-repair-houston.json"))
    ).toBe(true);
    expect(getBlog("toilet-repair-houston")).toEqual({ title: "T" });
  });

  it("throws on malformed json", async () => {
    const getBlog = await loadGetBlog(
      createContentRoot({ broken: "{ not json" })
    );

    expect(() => getBlog("broken")).toThrow();
  });
});
