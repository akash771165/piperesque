import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { FileManager } from "../../../../scripts/ai/utils/file-manager.mjs";

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

let root: string;
let manager: FileManager;

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "piperesque-fm-"));
  manager = new FileManager({ root });
  vi.clearAllMocks();
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

describe("resolve", () => {
  it("resolves relative segments against the root", () => {
    expect(manager.resolve("content", "blogs")).toBe(
      path.join(root, "content", "blogs")
    );
  });

  it("defaults the root to the working directory", () => {
    expect(new FileManager().resolve("a")).toBe(path.resolve(process.cwd(), "a"));
  });
});

describe("exists", () => {
  it("reports whether a path is reachable", async () => {
    await expect(manager.exists(root)).resolves.toBe(true);
    await expect(manager.exists(manager.resolve("missing.json"))).resolves.toBe(
      false
    );
  });
});

describe("directories", () => {
  it("creates nested directories", async () => {
    const directory = manager.resolve("a/b/c");

    await expect(manager.ensureDirectory(directory)).resolves.toBe(directory);
    expect(fs.existsSync(directory)).toBe(true);
  });

  it("creates the parent directory of a file", async () => {
    const file = manager.resolve("a/b/blog.json");

    await manager.ensureParent(file);

    expect(fs.existsSync(path.dirname(file))).toBe(true);
  });
});

describe("text io", () => {
  it("writes, reads and appends text creating parents on the way", async () => {
    const file = manager.resolve("nested/note.txt");

    await expect(manager.writeText(file, "hello")).resolves.toBe(file);
    await manager.appendText(file, " world");

    await expect(manager.readText(file)).resolves.toBe("hello world");
    expect(logger.success).toHaveBeenCalledWith("Saved: note.txt");
  });

  it("appends to a file that does not exist yet", async () => {
    const file = manager.resolve("fresh/note.txt");

    await manager.appendText(file, "first");

    await expect(manager.readText(file)).resolves.toBe("first");
  });

  it("rejects when reading a missing file", async () => {
    await expect(manager.readText(manager.resolve("missing.txt"))).rejects.toThrow();
  });
});

describe("json io", () => {
  it("round trips pretty printed json", async () => {
    const file = manager.resolve("blog.json");

    await manager.writeJSON(file, { slug: "drain-cleaning" });

    await expect(manager.readText(file)).resolves.toBe(
      '{\n  "slug": "drain-cleaning"\n}'
    );
    await expect(manager.readJSON(file)).resolves.toEqual({
      slug: "drain-cleaning",
    });
  });

  it("writes compact json when pretty printing is off", async () => {
    const compact = new FileManager({ root, prettyJson: false });
    const file = compact.resolve("blog.json");

    await compact.writeJSON(file, { slug: "drain-cleaning" });

    await expect(compact.readText(file)).resolves.toBe('{"slug":"drain-cleaning"}');
  });
});

describe("copy, move and remove", () => {
  it("copies a file into a new directory", async () => {
    const source = manager.resolve("a.txt");
    const destination = manager.resolve("backup/a.txt");

    await manager.writeText(source, "body");

    await expect(manager.copy(source, destination)).resolves.toBe(destination);
    await expect(manager.readText(destination)).resolves.toBe("body");
    expect(fs.existsSync(source)).toBe(true);
  });

  it("moves a file", async () => {
    const source = manager.resolve("a.txt");
    const destination = manager.resolve("moved/a.txt");

    await manager.writeText(source, "body");
    await manager.move(source, destination);

    expect(fs.existsSync(source)).toBe(false);
    await expect(manager.readText(destination)).resolves.toBe("body");
  });

  it("removes files and reports whether anything was removed", async () => {
    const file = manager.resolve("a.txt");

    await manager.writeText(file, "body");

    await expect(manager.remove(file)).resolves.toBe(true);
    await expect(manager.remove(file)).resolves.toBe(false);
  });

  it("removes directories recursively", async () => {
    const directory = manager.resolve("tree");

    await manager.writeText(path.join(directory, "deep", "a.txt"), "body");

    await expect(manager.remove(directory)).resolves.toBe(true);
    expect(fs.existsSync(directory)).toBe(false);
  });
});

describe("list", () => {
  beforeEach(async () => {
    await manager.writeText(manager.resolve("a.txt"), "a");
    await manager.writeText(manager.resolve("nested/b.txt"), "b");
  });

  it("lists only top level files by default", async () => {
    await expect(manager.list(root)).resolves.toEqual([
      manager.resolve("a.txt"),
    ]);
  });

  it("walks nested directories when recursive", async () => {
    const files = await manager.list(root, true);

    expect(files.sort()).toEqual([
      manager.resolve("a.txt"),
      manager.resolve("nested/b.txt"),
    ]);
  });
});

describe("checksums", () => {
  it("hashes content and files identically", async () => {
    const file = manager.resolve("a.txt");

    await manager.writeText(file, "body");

    await expect(manager.checksumFile(file)).resolves.toBe(
      manager.checksum("body")
    );
  });
});

describe("stats", () => {
  it("describes a file", async () => {
    const file = manager.resolve("blog.json");

    await manager.writeJSON(file, { a: 1 });

    await expect(manager.stats(file)).resolves.toMatchObject({
      path: file,
      name: "blog.json",
      extension: ".json",
      isDirectory: false,
      isFile: true,
    });
  });

  it("describes a directory", async () => {
    await expect(manager.stats(root)).resolves.toMatchObject({
      isDirectory: true,
      isFile: false,
    });
  });
});
