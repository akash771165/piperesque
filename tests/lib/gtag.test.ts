import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

type Gtag = ReturnType<typeof vi.fn>;

async function loadGtag(measurementId?: string) {
  vi.resetModules();

  if (measurementId === undefined) {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "");
  } else {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", measurementId);
  }

  return import("@/lib/gtag");
}

function stubWindow(gtag?: Gtag) {
  vi.stubGlobal("window", gtag ? { gtag } : {});
}

describe("gtag", () => {
  let gtag: Gtag;

  beforeEach(() => {
    gtag = vi.fn();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("reads the measurement id from the environment", async () => {
    const mod = await loadGtag("G-TEST123");

    expect(mod.GA_MEASUREMENT_ID).toBe("G-TEST123");
  });

  it("falls back to an empty measurement id", async () => {
    const mod = await loadGtag();

    expect(mod.GA_MEASUREMENT_ID).toBe("");
  });

  it("sends a config call on pageview", async () => {
    const mod = await loadGtag("G-TEST123");
    stubWindow(gtag);

    mod.pageview("/blog/drain-cleaning-houston");

    expect(gtag).toHaveBeenCalledWith("config", "G-TEST123", {
      page_path: "/blog/drain-cleaning-houston",
    });
  });

  it("does nothing on the server", async () => {
    const mod = await loadGtag("G-TEST123");

    expect(() => mod.pageview("/")).not.toThrow();
    expect(() => mod.trackCTA("hero")).not.toThrow();
    expect(gtag).not.toHaveBeenCalled();
  });

  it("does nothing when gtag has not loaded yet", async () => {
    const mod = await loadGtag("G-TEST123");
    stubWindow();

    expect(() => mod.trackContactForm()).not.toThrow();
    expect(gtag).not.toHaveBeenCalled();
  });

  it("forwards extra params on a generic event", async () => {
    const mod = await loadGtag("G-TEST123");
    stubWindow(gtag);

    mod.event({
      action: "signup",
      category: "lead",
      label: "footer",
      value: 3,
      plan: "pro",
    });

    expect(gtag).toHaveBeenCalledWith("event", "signup", {
      event_category: "lead",
      event_label: "footer",
      value: 3,
      plan: "pro",
    });
  });

  it("omits optional fields when not provided", async () => {
    const mod = await loadGtag("G-TEST123");
    stubWindow(gtag);

    mod.event({ action: "scroll", category: "engagement" });

    expect(gtag).toHaveBeenCalledWith("event", "scroll", {
      event_category: "engagement",
      event_label: undefined,
      value: undefined,
    });
  });

  it("tracks phone calls with the business number", async () => {
    const mod = await loadGtag("G-TEST123");
    stubWindow(gtag);

    mod.trackPhoneCall("header");

    expect(gtag).toHaveBeenCalledWith("event", "phone_click", {
      event_category: "lead",
      event_label: "header",
      value: 1,
      phone_number: "+18773640861",
    });
  });

  it("tracks contact form submissions", async () => {
    const mod = await loadGtag("G-TEST123");
    stubWindow(gtag);

    mod.trackContactForm();

    expect(gtag).toHaveBeenCalledWith("event", "contact_form_submit", {
      event_category: "lead",
      event_label: "contact_form",
      value: 1,
    });
  });

  it("tracks cta clicks with their location", async () => {
    const mod = await loadGtag("G-TEST123");
    stubWindow(gtag);

    mod.trackCTA("pricing_section");

    expect(gtag).toHaveBeenCalledWith("event", "cta_click", {
      event_category: "engagement",
      event_label: "pricing_section",
      value: 1,
    });
  });
});
