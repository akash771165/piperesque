import fs from "node:fs";
import path from "node:path";

import { describe, expect, it } from "vitest";

import paths, {
  BLOGS_DIR,
  CONTENT_DIR,
  DATA_DIR,
  KEYWORDS_DIR,
  LOGS_DIR,
  PUBLIC_DIR,
  ROOT,
  SCRIPTS_DIR,
} from "../../../scripts/shared/paths.mjs";

describe("paths", () => {
  it("points ROOT at the project root", () => {
    expect(fs.existsSync(path.join(ROOT, "package.json"))).toBe(true);
    expect(path.isAbsolute(ROOT)).toBe(true);
  });

  it("derives content directories from ROOT", () => {
    expect(CONTENT_DIR).toBe(path.join(ROOT, "content"));
    expect(BLOGS_DIR).toBe(path.join(ROOT, "content", "blogs"));
  });

  it("derives data directories from ROOT", () => {
    expect(DATA_DIR).toBe(path.join(ROOT, "data"));
    expect(KEYWORDS_DIR).toBe(path.join(ROOT, "data", "keywords"));
  });

  it("derives the remaining top level directories", () => {
    expect(PUBLIC_DIR).toBe(path.join(ROOT, "public"));
    expect(LOGS_DIR).toBe(path.join(ROOT, "logs"));
    expect(SCRIPTS_DIR).toBe(path.join(ROOT, "scripts"));
  });

  it("exposes the same values on the default export", () => {
    expect(paths.ROOT).toBe(ROOT);
    expect(paths.BLOGS_DIR).toBe(BLOGS_DIR);
    expect(Object.values(paths).every((value) => path.isAbsolute(value))).toBe(true);
  });
});
