import { afterEach, describe, expect, it, vi } from "vitest";

import { BUILD, PROJECT, SEO } from "../../../scripts/shared/constants.mjs";

const originalArgv = process.argv;

async function loadConfig(argv: string[], nodeEnv?: string) {
  vi.resetModules();
  process.argv = ["node", "script.mjs", ...argv];

  if (nodeEnv === undefined) {
    vi.stubEnv("NODE_ENV", undefined);
  } else {
    vi.stubEnv("NODE_ENV", nodeEnv);
  }

  return (await import("../../../scripts/shared/config.mjs")).default;
}

afterEach(() => {
  process.argv = originalArgv;
  vi.unstubAllEnvs();
});

describe("config", () => {
  it("embeds the shared constants", async () => {
    const config = await loadConfig([]);

    expect(config.project).toEqual(PROJECT);
    expect(config.seo).toEqual(SEO);
    expect(config.build).toEqual(BUILD);
  });

  it("reads flags off the command line", async () => {
    const config = await loadConfig(["--dry-run", "--verbose"]);

    expect(config.dryRun).toBe(true);
    expect(config.verbose).toBe(true);
  });

  it("defaults flags to false", async () => {
    const config = await loadConfig(["--other"]);

    expect(config.dryRun).toBe(false);
    expect(config.verbose).toBe(false);
  });

  it("reads the environment", async () => {
    expect((await loadConfig([], "production")).environment).toBe("production");
  });

  it("defaults the environment to development", async () => {
    expect((await loadConfig([])).environment).toBe("development");
  });

  it("stamps an iso timestamp", async () => {
    expect((await loadConfig([])).timestamp).toMatch(
      /^\d{4}-\d{2}-\d{2}T[\d:.]+Z$/
    );
  });
});
