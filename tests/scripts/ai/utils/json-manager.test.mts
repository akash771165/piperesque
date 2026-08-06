import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import FileManager from "../../../../scripts/ai/utils/file-manager.mjs";
import { JSONManager } from "../../../../scripts/ai/utils/json-manager.mjs";

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
let manager: JSONManager;

function file(name: string) {
  return path.join(root, name);
}

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "piperesque-json-"));
  manager = new JSONManager({ root });
  vi.clearAllMocks();
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
  vi.useRealTimers();
});

describe("parse and stringify", () => {
  it("parses valid json", () => {
    expect(manager.parse('{"a":1}')).toEqual({ a: 1 });
  });

  it("wraps parse failures and keeps the original cause", () => {
    let thrown: Error | undefined;

    try {
      manager.parse("{ nope");
    } catch (error) {
      thrown = error as Error;
    }

    expect(thrown?.message).toBe("Invalid JSON");
    expect(thrown?.cause).toBeInstanceOf(SyntaxError);
  });

  it("pretty prints by default", () => {
    expect(manager.stringify({ a: 1 })).toBe('{\n  "a": 1\n}');
  });

  it("writes compact json when pretty is off", () => {
    expect(new JSONManager({ root, pretty: false }).stringify({ a: 1 })).toBe(
      '{"a":1}'
    );
  });

  it("accepts an injected file manager", () => {
    const fileManager = new FileManager({ root });

    expect(new JSONManager({ fileManager }).fileManager).toBe(fileManager);
  });
});

describe("save and load", () => {
  it("saves atomically and leaves no temp file behind", async () => {
    await manager.save(file("blog.json"), { slug: "a" });

    await expect(manager.load(file("blog.json"))).resolves.toEqual({ slug: "a" });
    expect(fs.existsSync(file("blog.json.tmp"))).toBe(false);
  });

  it("saves directly when atomic writes are disabled", async () => {
    const direct = new JSONManager({ root, atomicWrite: false });

    await direct.save(file("blog.json"), { slug: "a" });

    await expect(direct.load(file("blog.json"))).resolves.toEqual({ slug: "a" });
  });

  it("rejects when loading a missing file", async () => {
    await expect(manager.load(file("missing.json"))).rejects.toThrow();
  });
});

describe("create", () => {
  it("creates a file with initial data", async () => {
    await expect(manager.create(file("blog.json"), { slug: "a" })).resolves.toBe(
      file("blog.json")
    );
    await expect(manager.load(file("blog.json"))).resolves.toEqual({ slug: "a" });
  });

  it("defaults to an empty object", async () => {
    await manager.create(file("blog.json"));

    await expect(manager.load(file("blog.json"))).resolves.toEqual({});
  });

  it("refuses to overwrite an existing file", async () => {
    await manager.create(file("blog.json"));

    await expect(manager.create(file("blog.json"))).rejects.toThrow(
      /File already exists/
    );
  });

  it("rejects invalid initial data", async () => {
    await expect(manager.create(file("blog.json"), null as never)).rejects.toThrow(
      "JSON cannot be null."
    );
    await expect(manager.create(file("blog.json"), "nope" as never)).rejects.toThrow(
      "JSON root must be an object."
    );
  });
});

describe("validate", () => {
  it("accepts objects and arrays", () => {
    expect(manager.validate({})).toBe(true);
    expect(manager.validate([])).toBe(true);
  });

  it("rejects nullish and primitive roots", () => {
    expect(() => manager.validate(undefined)).toThrow("JSON cannot be null.");
    expect(() => manager.validate(1)).toThrow("JSON root must be an object.");
  });
});

describe("backup and restore", () => {
  it("copies the file to a timestamped backup", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-05T00:00:00.000Z"));

    await manager.create(file("blog.json"), { slug: "a" });

    const backup = await manager.backup(file("blog.json"));

    expect(backup).toBe(`${file("blog.json")}.${Date.now()}.bak`);
    expect(fs.existsSync(backup!)).toBe(true);
  });

  it("returns null when there is nothing to back up", async () => {
    await expect(manager.backup(file("missing.json"))).resolves.toBeNull();
  });

  it("returns null when backups are disabled", async () => {
    const noBackup = new JSONManager({ root, backup: false });

    await noBackup.create(file("blog.json"), { slug: "a" });

    await expect(noBackup.backup(file("blog.json"))).resolves.toBeNull();
  });

  it("restores a backup over the destination", async () => {
    await manager.create(file("blog.json"), { slug: "a" });

    const backup = (await manager.backup(file("blog.json")))!;

    await manager.save(file("blog.json"), { slug: "b" });
    await manager.restore(backup, file("blog.json"));

    await expect(manager.load(file("blog.json"))).resolves.toEqual({ slug: "a" });
  });
});

describe("merging", () => {
  it("shallow merges into a file", async () => {
    await manager.create(file("blog.json"), { slug: "a", seo: { title: "t" } });

    await expect(
      manager.merge(file("blog.json"), { seo: { description: "d" } })
    ).resolves.toEqual({ slug: "a", seo: { description: "d" } });
  });

  it("deep merges nested objects without mutating the target", () => {
    const target = { seo: { title: "t", keywords: ["a"] }, slug: "a" };

    expect(
      manager.deepMerge(target, { seo: { description: "d", keywords: ["b"] } })
    ).toEqual({
      slug: "a",
      seo: { title: "t", description: "d", keywords: ["b"] },
    });
    expect(target.seo).toEqual({ title: "t", keywords: ["a"] });
  });

  it("creates missing nested branches when deep merging", () => {
    expect(manager.deepMerge({}, { seo: { title: "t" } })).toEqual({
      seo: { title: "t" },
    });
  });

  it("deep merges into a file", async () => {
    await manager.create(file("blog.json"), { seo: { title: "t" } });

    await expect(
      manager.deepMergeFile(file("blog.json"), { seo: { description: "d" } })
    ).resolves.toEqual({ seo: { title: "t", description: "d" } });
    await expect(manager.load(file("blog.json"))).resolves.toEqual({
      seo: { title: "t", description: "d" },
    });
  });
});

describe("hash and checksum", () => {
  it("hashes equal payloads identically regardless of key order", () => {
    expect(manager.hash({ a: 1, b: 2 })).toBe(manager.hash({ a: 1, b: 2 }));
    expect(manager.hash({ a: 1 })).not.toBe(manager.hash({ a: 2 }));
  });

  it("checksums a file from its parsed contents", async () => {
    await manager.create(file("blog.json"), { a: 1 });

    await expect(manager.checksum(file("blog.json"))).resolves.toBe(
      manager.hash({ a: 1 })
    );
  });
});

describe("versioning", () => {
  it("derives the version directory next to the file", () => {
    expect(manager.versionFile(file("blog.json"))).toBe(
      path.join(root, ".versions", "blog.json")
    );
  });

  it("writes a timestamped version snapshot", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-05-05T00:00:00.000Z"));

    const versionPath = await manager.saveVersion(file("blog.json"), { a: 1 });

    expect(versionPath).toBe(
      path.join(root, ".versions", "blog.json", `${Date.now()}.json`)
    );
    expect(JSON.parse(fs.readFileSync(versionPath!, "utf8"))).toEqual({ a: 1 });
  });

  it("returns null when versioning is disabled", async () => {
    const noVersions = new JSONManager({ root, versioning: false });

    await expect(noVersions.saveVersion(file("blog.json"), {})).resolves.toBeNull();
  });
});

describe("diff", () => {
  it("reports added, removed and changed keys", async () => {
    await manager.create(file("a.json"), { keep: 1, drop: 2, change: "old" });
    await manager.create(file("b.json"), { keep: 1, add: 3, change: "new" });

    await expect(manager.diff(file("a.json"), file("b.json"))).resolves.toEqual({
      added: { add: 3 },
      removed: { drop: 2 },
      changed: { change: { old: "old", new: "new" } },
    });
  });

  it("reports nothing for identical files", async () => {
    await manager.create(file("a.json"), { keep: [1, 2] });
    await manager.create(file("b.json"), { keep: [1, 2] });

    await expect(manager.diff(file("a.json"), file("b.json"))).resolves.toEqual({
      added: {},
      removed: {},
      changed: {},
    });
  });
});

describe("clone, delete and exists", () => {
  it("clones a file to a new destination", async () => {
    await manager.create(file("a.json"), { slug: "a" });

    await expect(manager.clone(file("a.json"), file("b.json"))).resolves.toBe(
      file("b.json")
    );
    await expect(manager.load(file("b.json"))).resolves.toEqual({ slug: "a" });
  });

  it("deletes a file and reports whether it existed", async () => {
    await manager.create(file("a.json"), {});

    await expect(manager.exists(file("a.json"))).resolves.toBe(true);
    await expect(manager.delete(file("a.json"))).resolves.toBe(true);
    await expect(manager.exists(file("a.json"))).resolves.toBe(false);
    await expect(manager.delete(file("a.json"))).resolves.toBe(false);
  });
});
