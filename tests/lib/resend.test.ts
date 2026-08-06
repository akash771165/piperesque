import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("resend", () => ({
  Resend: class {
    constructor(public apiKey: string) {}
  },
}));

async function loadResend(apiKey?: string) {
  vi.resetModules();
  vi.stubEnv("RESEND_API_KEY", apiKey);

  return import("@/lib/resend");
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("resend client", () => {
  it("is constructed with the api key from the environment", async () => {
    const { resend } = await loadResend("re_test_key");

    expect(resend).toMatchObject({ apiKey: "re_test_key" });
  });

  it("fails fast when the api key is missing", async () => {
    await expect(loadResend()).rejects.toThrow("RESEND_API_KEY is missing");
  });

  it("fails fast when the api key is empty", async () => {
    await expect(loadResend("")).rejects.toThrow("RESEND_API_KEY is missing");
  });
});
