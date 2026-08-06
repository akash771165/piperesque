import path from "node:path";

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { fsMock } = vi.hoisted(() => ({
  fsMock: {
    existsSync: vi.fn(() => true),
    mkdirSync: vi.fn(),
    appendFileSync: vi.fn(),
  },
}));

vi.mock("node:fs", () => ({ default: fsMock, ...fsMock }));

async function loadLogger({ logsDirectoryExists = true } = {}) {
  vi.resetModules();
  fsMock.existsSync.mockReturnValue(logsDirectoryExists);

  return import("../../../scripts/shared/logger.mjs");
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.spyOn(console, "log").mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("logger", () => {
  it("creates the logs directory when missing", async () => {
    await loadLogger({ logsDirectoryExists: false });

    expect(fsMock.mkdirSync).toHaveBeenCalledWith(
      expect.stringContaining(`${path.sep}logs`),
      { recursive: true }
    );
  });

  it("leaves an existing logs directory alone", async () => {
    await loadLogger();

    expect(fsMock.mkdirSync).not.toHaveBeenCalled();
  });

  it.each([
    ["info", "INFO"],
    ["success", "SUCCESS"],
    ["warning", "WARNING"],
    ["error", "ERROR"],
  ])("writes %s messages at the %s level", async (method, level) => {
    const logger = await loadLogger();

    logger[method as "info"]("Generated blog");

    const line = `[${level}] Generated blog`;

    expect(console.log).toHaveBeenCalledWith(expect.stringContaining(line));
    expect(fsMock.appendFileSync).toHaveBeenCalledWith(
      expect.stringContaining(path.join("logs", "automation.log")),
      expect.stringContaining(`${line}\n`),
      "utf8"
    );
  });

  it("prefixes every line with an iso timestamp", async () => {
    const logger = await loadLogger();

    logger.info("Generated blog");

    expect(console.log).toHaveBeenCalledWith(
      expect.stringMatching(/^\[\d{4}-\d{2}-\d{2}T[\d:.]+Z\] \[INFO\] /)
    );
  });

  it("exposes the same functions on the default export", async () => {
    const logger = await loadLogger();

    expect(logger.default.info).toBe(logger.info);
    expect(Object.keys(logger.default).sort()).toEqual([
      "error",
      "info",
      "success",
      "warning",
    ]);
  });
});
