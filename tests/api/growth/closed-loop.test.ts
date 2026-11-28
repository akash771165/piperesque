import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { NextRequest } from "next/server";
import {
  handleDashboardClosedLoopAction,
  handleGscSyncGet,
  handleGscSyncPost,
  handleLeadSmartWebhook,
  handleOptimizeSitePost,
  handleTrackIntent,
} from "@/lib/growth/closed-loop-handlers";
import {
  getPageSeoOverride,
  getTrendingServiceHighlight,
  readClosedLoopRevenueStore,
  readGscPerformanceStore,
  readSeoOverridesStore,
} from "@/lib/growth/closed-loop-store";

function makeRequest(
  url: string,
  options: {
    method?: string;
    body?: unknown;
    headers?: Record<string, string>;
  } = {}
): NextRequest {
  const { method = "POST", body, headers = {} } = options;
  const parsedUrl = new URL(url);
  return new NextRequest(url, {
    method,
    headers: {
      host: parsedUrl.host,
      "content-type": "application/json",
      ...headers,
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });
}

describe("Closed-Loop Lead Generation & Self-Optimizing SEO System", () => {
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "piperesque-closed-loop-"));
  });

  afterEach(() => {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  });

  describe("Graceful missing-file fallbacks", () => {
    it("returns clean default stores when data/*.json files do not exist", () => {
      const revenue = readClosedLoopRevenueStore(tmpDir);
      const gsc = readGscPerformanceStore(tmpDir);
      const overrides = readSeoOverridesStore(tmpDir);

      expect(revenue.qualifiedLeads).toBe(0);
      expect(revenue.revenue).toBe(0);
      expect(revenue.logs).toEqual([]);
      expect(gsc.pages).toEqual([]);
      expect(gsc.totals.impressions).toBe(0);
      expect(overrides.pages).toEqual({});
      expect(getPageSeoOverride("/services/emergency-plumbing", tmpDir)).toBeNull();
      expect(getTrendingServiceHighlight(tmpDir)).toBeNull();
    });
  });

  describe("POST /api/webhooks/leadsmart", () => {
    it("fails closed with 503 when LEADSMART_WEBHOOK_SECRET is not set", async () => {
      const req = makeRequest(
        "http://127.0.0.1:3000/api/webhooks/leadsmart?token=abc",
        {
          body: { type: "call", payout: 75, status: "sold", city: "Katy", service: "Sewer Line Repair" },
        }
      );

      const res = await handleLeadSmartWebhook(req, {
        rootDir: tmpDir,
        env: {},
        skipRevalidate: true,
      });

      expect(res.status).toBe(503);
    });

    it("rejects invalid webhook token with 401", async () => {
      const req = makeRequest(
        "http://127.0.0.1:3000/api/webhooks/leadsmart?token=wrong-secret",
        {
          body: { type: "call", payout: 75, status: "sold", city: "Katy", service: "Sewer Line Repair" },
        }
      );

      const res = await handleLeadSmartWebhook(req, {
        rootDir: tmpDir,
        env: { LEADSMART_WEBHOOK_SECRET: "super-secret-123" },
        skipRevalidate: true,
      });

      expect(res.status).toBe(401);
    });

    it("records call and form conversions in data/revenue-store.json when authenticated", async () => {
      const env = { LEADSMART_WEBHOOK_SECRET: "super-secret-123" };

      const callRes = await handleLeadSmartWebhook(
        makeRequest(
          "http://127.0.0.1:3000/api/webhooks/leadsmart?token=super-secret-123",
          {
            body: {
              type: "call",
              payout: 85.5,
              status: "sold",
              city: "Katy",
              service: "Sewer Line Repair",
            },
          }
        ),
        { rootDir: tmpDir, env, skipRevalidate: true }
      );
      expect(callRes.status).toBe(200);

      const formRes = await handleLeadSmartWebhook(
        makeRequest(
          "http://127.0.0.1:3000/api/webhooks/leadsmart?token=super-secret-123",
          {
            body: {
              type: "form",
              payout: 45,
              status: "sold",
              city: "Houston",
              service: "Water Heater Repair",
            },
          }
        ),
        { rootDir: tmpDir, env, skipRevalidate: true }
      );
      expect(formRes.status).toBe(200);

      const store = readClosedLoopRevenueStore(tmpDir);
      expect(store.qualifiedLeads).toBe(2);
      expect(store.revenue).toBe(130.5);
      expect(store.soldCalls).toBe(1);
      expect(store.soldForms).toBe(1);
      expect(store.logs).toHaveLength(2);
      expect(store.logs[0].channel).toBe("form");
      expect(store.logs[1].channel).toBe("call");
    });
  });

  describe("POST /api/track-intent", () => {
    it("logs call and form intents and blocks cross-origin requests", async () => {
      const buckets = new Map<string, number[]>();

      const crossOrigin = await handleTrackIntent(
        makeRequest("http://127.0.0.1:3000/api/track-intent", {
          headers: { origin: "https://evil.example" },
          body: { type: "call", page: "/services/emergency-plumbing" },
        }),
        { rootDir: tmpDir, rateLimitMap: buckets }
      );
      expect(crossOrigin.status).toBe(403);

      const callIntent = await handleTrackIntent(
        makeRequest("http://127.0.0.1:3000/api/track-intent", {
          headers: { origin: "http://127.0.0.1:3000" },
          body: { type: "call", page: "/services/emergency-plumbing", event: "phone_click_hero" },
        }),
        { rootDir: tmpDir, rateLimitMap: buckets }
      );
      expect(callIntent.status).toBe(200);

      const formIntent = await handleTrackIntent(
        makeRequest("http://127.0.0.1:3000/api/track-intent", {
          headers: { origin: "http://127.0.0.1:3000" },
          body: { type: "form", service: "Leak Detection", page: "/contact" },
        }),
        { rootDir: tmpDir, rateLimitMap: buckets }
      );
      expect(formIntent.status).toBe(200);

      const store = readClosedLoopRevenueStore(tmpDir);
      expect(store.callIntents).toBe(1);
      expect(store.formIntents).toBe(1);
      expect(store.logs).toHaveLength(2);
    });
  });

  describe("GSC Sync (/api/sync/gsc) & Auto-Optimizer (/api/optimize-site)", () => {
    it("syncs pushed GSC metrics and upgrades only pages with impressions > 100 and CTR < 2.5%", async () => {
      const env = {
        GSC_SYNC_SECRET: "gsc-token-999",
        LEADSMART_WEBHOOK_SECRET: "leadsmart-token-999",
      };

      const syncRes = await handleGscSyncPost(
        makeRequest("http://127.0.0.1:3000/api/sync/gsc?token=gsc-token-999", {
          body: {
            pages: [
              {
                page: "https://www.piperesque.com/services/emergency-plumbing",
                topQuery: "emergency plumber houston",
                clicks: 4,
                impressions: 320,
                ctr: 0.0125, // decimal CTR -> normalized to 1.25%
                position: 8.4,
              },
              {
                page: "/services/drain-cleaning",
                topQuery: "drain cleaning houston",
                clicks: 25,
                impressions: 400,
                ctr: 6.25, // healthy CTR -> must NOT be overridden
                position: 4.1,
              },
              {
                page: "/service-areas/katy",
                topQuery: "katy plumber",
                clicks: 0,
                impressions: 50, // <= 100 impressions -> must NOT be overridden
                ctr: 0,
                position: 14.2,
              },
            ],
          },
        }),
        { rootDir: tmpDir, env, skipRevalidate: true }
      );
      expect(syncRes.status).toBe(200);

      const getRes = await handleGscSyncGet(
        makeRequest("http://127.0.0.1:3000/api/sync/gsc?token=gsc-token-999", {
          method: "GET",
        }),
        { rootDir: tmpDir, env }
      );
      expect(getRes.status).toBe(200);

      // Seed a sold conversion so auto-optimizer computes Trending Highlight
      await handleLeadSmartWebhook(
        makeRequest(
          "http://127.0.0.1:3000/api/webhooks/leadsmart?token=leadsmart-token-999",
          {
            body: {
              type: "call",
              payout: 95,
              status: "sold",
              city: "Cypress",
              service: "Sewer Line Repair",
            },
          }
        ),
        { rootDir: tmpDir, env, skipRevalidate: true }
      );

      // Run auto-optimizer
      const optRes = await handleOptimizeSitePost(
        makeRequest("http://127.0.0.1:3000/api/optimize-site?token=gsc-token-999"),
        { rootDir: tmpDir, env, skipRevalidate: true }
      );
      expect(optRes.status).toBe(200);
      const optJson = await optRes.json();
      expect(optJson.optimizedPageCount).toBe(1);

      const emergencyOverride = getPageSeoOverride(
        "/services/emergency-plumbing",
        tmpDir
      );
      expect(emergencyOverride).not.toBeNull();
      expect(emergencyOverride?.previousCtr).toBe(1.25);
      expect(emergencyOverride?.title).toContain("Houston, TX");

      // High-CTR and low-impression pages remain untouched
      expect(getPageSeoOverride("/services/drain-cleaning", tmpDir)).toBeNull();
      expect(getPageSeoOverride("/service-areas/katy", tmpDir)).toBeNull();

      // Trending service highlight reflects top converting service & city
      const highlight = getTrendingServiceHighlight(tmpDir);
      expect(highlight?.service).toBe("Sewer Line Repair");
      expect(highlight?.city).toBe("Cypress");
      expect(highlight?.serviceSlug).toBe("sewer-line-repair");
    });
  });

  describe("POST /api/growth/closed-loop dashboard actions", () => {
    it("supports simulate_lead and run_optimizer end-to-end", async () => {
      const buckets = new Map<string, number[]>();

      const simRes = await handleDashboardClosedLoopAction(
        makeRequest("http://127.0.0.1:3000/api/growth/closed-loop", {
          headers: { origin: "http://127.0.0.1:3000" },
          body: { action: "simulate_lead" },
        }),
        { rootDir: tmpDir, rateLimitMap: buckets, skipRevalidate: true }
      );
      expect(simRes.status).toBe(200);
      const simJson = await simRes.json();
      expect(simJson.revenueStore.qualifiedLeads).toBe(1);
      expect(simJson.revenueStore.revenue).toBeGreaterThan(0);

      const optRes = await handleDashboardClosedLoopAction(
        makeRequest("http://127.0.0.1:3000/api/growth/closed-loop", {
          headers: { origin: "http://127.0.0.1:3000" },
          body: { action: "run_optimizer" },
        }),
        { rootDir: tmpDir, rateLimitMap: buckets, skipRevalidate: true }
      );
      expect(optRes.status).toBe(200);
      const optJson = await optRes.json();
      expect(optJson.overrides.trendingHighlight).not.toBeNull();
      expect(optJson.overrides.trendingHighlight.service).toBe("Sewer Line Repair");
      expect(optJson.overrides.trendingHighlight.city).toBe("Katy");
    });
  });
});
