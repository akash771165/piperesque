import fs from "node:fs";
import os from "node:os";
import path from "node:path";

/**
 * Creates a throwaway project root containing content/blogs so that modules
 * resolving their directories from process.cwd() can be exercised.
 */
export function createContentRoot(
  blogs: Record<string, unknown> = {},
  options: { createDirectory?: boolean } = {}
): string {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "piperesque-test-"));

  if (options.createDirectory === false) return root;

  const blogsDirectory = path.join(root, "content", "blogs");

  fs.mkdirSync(blogsDirectory, { recursive: true });

  for (const [slug, blog] of Object.entries(blogs)) {
    const fileName = path.extname(slug) ? slug : `${slug}.json`;

    fs.writeFileSync(
      path.join(blogsDirectory, fileName),
      typeof blog === "string" ? blog : JSON.stringify(blog),
      "utf-8"
    );
  }

  return root;
}

export function removeContentRoot(root: string): void {
  fs.rmSync(root, { recursive: true, force: true });
}
