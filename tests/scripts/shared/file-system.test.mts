import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, beforeEach, describe, expect, it } from "vitest";

import {
  ensureDirectory,
  exists,
  fileExists,
  listFiles,
  readJson,
  readText,
  writeJson,
  writeJsonSafe,
  writeText,
} from "../../../scripts/shared/file-system.mjs";

let root: string;

beforeEach(() => {
  root = fs.mkdtempSync(path.join(os.tmpdir(), "piperesque-fs-"));
});

afterEach(() => {
  fs.rmSync(root, { recursive: true, force: true });
});

describe("ensureDirectory", () => {
  it("creates nested directories", () => {
    const dir = path.join(root, "a", "b", "c");

    ensureDirectory(dir);

    expect(fs.existsSync(dir)).toBe(true);
  });

  it("is a no-op when the directory already exists", () => {
    ensureDirectory(root);

    expect(() => ensureDirectory(root)).not.toThrow();
  });
});

describe("exists", () => {
  it("reports presence of files and directories", () => {
    expect(exists(root)).toBe(true);
    expect(exists(path.join(root, "missing.json"))).toBe(false);
    expect(fileExists(root)).toBe(true);
  });
});

describe("json helpers", () => {
  it("round trips json and creates parent directories", () => {
    const file = path.join(root, "nested", "blog.json");

    writeJson(file, { slug: "drain-cleaning" });

    expect(readJson(file)).toEqual({ slug: "drain-cleaning" });
    expect(readText(file)).toBe('{\n  "slug": "drain-cleaning"\n}');
  });

  it("overwrites with writeJson", () => {
    const file = path.join(root, "blog.json");

    writeJson(file, { version: 1 });
    writeJson(file, { version: 2 });

    expect(readJson(file)).toEqual({ version: 2 });
  });

  it("refuses to overwrite with writeJsonSafe", () => {
    const file = path.join(root, "blog.json");

    writeJsonSafe(file, { version: 1 });

    expect(() => writeJsonSafe(file, { version: 2 })).toThrow(
      /File already exists/
    );
    expect(readJson(file)).toEqual({ version: 1 });
  });

  it("throws when reading a missing file", () => {
    expect(() => readJson(path.join(root, "missing.json"))).toThrow();
  });
});

describe("text helpers", () => {
  it("round trips text and creates parent directories", () => {
    const file = path.join(root, "logs", "note.txt");

    writeText(file, "hello");

    expect(readText(file)).toBe("hello");
  });
});

describe("listFiles", () => {
  it("returns an empty array for a missing directory", () => {
    expect(listFiles(path.join(root, "missing"))).toEqual([]);
  });

  it("lists all files by default", () => {
    writeText(path.join(root, "a.json"), "{}");
    writeText(path.join(root, "b.md"), "#");

    expect(listFiles(root).sort()).toEqual(["a.json", "b.md"]);
  });

  it("filters by extension", () => {
    writeText(path.join(root, "a.json"), "{}");
    writeText(path.join(root, "b.md"), "#");

    expect(listFiles(root, ".json" as never)).toEqual(["a.json"]);
  });
});
