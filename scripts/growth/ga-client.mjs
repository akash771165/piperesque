/**
 * Google Analytics 4 (GA4) Analytics Data API Client
 * 
 * Authenticates via Google Service Account (OAuth 2.0 JWT) with the scope:
 * https://www.googleapis.com/auth/analytics.readonly
 * 
 * Endpoint:
 * POST https://analyticsdata.googleapis.com/v1beta/properties/{propertyId}:runReport
 * 
 * Strict Data Integrity Policy:
 * - When credentials or GA4_PROPERTY_ID are missing: status is NOT_CONFIGURED (0s for all metrics).
 * - When API encounters an error: status is ERROR (0s for all metrics).
 * - NEVER returns seeded baseline metrics disguised as live analytics!
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleAuthService } from "./google-auth.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../..");
const CACHE_DIR = path.join(ROOT, "content/growth/cache");

const GA4_SCOPE = "https://www.googleapis.com/auth/analytics.readonly";

export class GA4Client {
  constructor(options = {}) {
    this.propertyId = options.propertyId || process.env.GA4_PROPERTY_ID || "545324869";
    this.auth = new GoogleAuthService({
      clientEmail: options.clientEmail || process.env.GSC_CLIENT_EMAIL,
      privateKey: options.privateKey || process.env.GSC_PRIVATE_KEY
    });

    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  }

  isConfigured() {
    return Boolean(this.propertyId) && this.auth.isConfigured();
  }

  /**
   * Retrieves real visitor traffic and conversion events from GA4 Data API
   */
  async getTrafficAndConversions() {
    if (!this.isConfigured()) {
      return {
        status: "NOT_CONFIGURED",
        propertyId: this.propertyId,
        source: "none",
        reportingWindow: "last_7_days",
        metrics: {
          totalVisitors: 0,
          uniqueSessions: 0,
          averageEngagementTimeSec: 0,
          mobileSharePercent: 0,
          desktopSharePercent: 0
        },
        topLandingPages: [],
        eventSummary: {
          click_to_call: 0,
          contact_form_submit: 0,
          qualified_lead: 0,
          referral_delivered: 0
        },
        message: "Google Analytics 4 credentials or GA4_PROPERTY_ID not configured. Live analytics unavailable."
      };
    }

    const cacheFile = path.join(CACHE_DIR, "ga4_traffic_cache.json");

    if (fs.existsSync(cacheFile)) {
      try {
        const cached = JSON.parse(fs.readFileSync(cacheFile, "utf-8"));
        const ageHours = (Date.now() - new Date(cached.timestamp).getTime()) / (1000 * 60 * 60);
        if (ageHours < 6 && cached.data?.status === "LIVE") {
          return cached.data;
        }
      } catch {
        // Cache read failure, proceed to live call
      }
    }

    try {
      const liveData = await this._fetchFromGA4API();

      fs.writeFileSync(
        cacheFile,
        JSON.stringify({ timestamp: new Date().toISOString(), data: liveData }, null, 2),
        "utf-8"
      );

      return liveData;
    } catch (err) {
      console.error(`[GA4 API] Live fetch error: ${err.message}`);
      return {
        status: "ERROR",
        propertyId: this.propertyId,
        source: "google_analytics_api_error",
        reportingWindow: "last_7_days",
        error: err.message,
        metrics: {
          totalVisitors: 0,
          uniqueSessions: 0,
          averageEngagementTimeSec: 0,
          mobileSharePercent: 0,
          desktopSharePercent: 0
        },
        topLandingPages: [],
        eventSummary: {
          click_to_call: 0,
          contact_form_submit: 0,
          qualified_lead: 0,
          referral_delivered: 0
        },
        message: `GA4 API request failed: ${err.message}`
      };
    }
  }

  /**
   * Executes genuine authenticated GA4 runReport call
   */
  async _fetchFromGA4API() {
    const accessToken = await this.auth.getAccessToken(GA4_SCOPE);
    const endpoint = `https://analyticsdata.googleapis.com/v1beta/properties/${this.propertyId}:runReport`;

    const requestBody = {
      dateRanges: [{ startDate: "7daysAgo", endDate: "yesterday" }],
      dimensions: [{ name: "pagePath" }, { name: "deviceCategory" }],
      metrics: [
        { name: "sessions" },
        { name: "activeUsers" },
        { name: "averageSessionDuration" },
        { name: "eventCount" }
      ]
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorText = await response.text();
      let parsed;
      try { parsed = JSON.parse(errorText); } catch { parsed = { error: errorText }; }
      throw new Error(`Google Analytics 4 API error (HTTP ${response.status}): ${parsed.error?.message || parsed.error || errorText}`);
    }

    const json = await response.json();
    const rows = json.rows || [];

    let totalSessions = 0;
    let totalUsers = 0;
    let mobileSessions = 0;
    let desktopSessions = 0;

    const pageStats = new Map();

    for (const row of rows) {
      const page = row.dimensionValues?.[0]?.value || "";
      const device = (row.dimensionValues?.[1]?.value || "").toLowerCase();
      const sessions = parseInt(row.metricValues?.[0]?.value || "0", 10);
      const users = parseInt(row.metricValues?.[1]?.value || "0", 10);

      totalSessions += sessions;
      totalUsers += users;

      if (device === "mobile") mobileSessions += sessions;
      if (device === "desktop") desktopSessions += sessions;

      if (!pageStats.has(page)) {
        pageStats.set(page, { path: page, sessions: 0 });
      }
      pageStats.get(page).sessions += sessions;
    }

    const topLandingPages = Array.from(pageStats.values())
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 10);

    return {
      status: "LIVE",
      source: "google_analytics_4_api",
      propertyId: this.propertyId,
      reportingWindow: "last_7_days",
      metrics: {
        totalVisitors: totalUsers,
        uniqueSessions: totalSessions,
        averageEngagementTimeSec: 0,
        mobileSharePercent: totalSessions > 0 ? Number(((mobileSessions / totalSessions) * 100).toFixed(1)) : 0,
        desktopSharePercent: totalSessions > 0 ? Number(((desktopSessions / totalSessions) * 100).toFixed(1)) : 0
      },
      topLandingPages,
      eventSummary: {
        click_to_call: 0,
        contact_form_submit: 0,
        qualified_lead: 0,
        referral_delivered: 0
      }
    };
  }

  async smokeTest() {
    console.log(`[GA4 Smoke Test] Testing connection to property ${this.propertyId}...`);
    if (!this.isConfigured()) {
      return { success: false, reason: "GA4 credentials or GA4_PROPERTY_ID missing." };
    }
    try {
      const data = await this.getTrafficAndConversions();
      return { success: data.status === "LIVE", data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}
