/**
 * Google Search Console Client & Real Performance Analyzer
 * 
 * Authenticates via Google Service Account (OAuth 2.0 JWT) with the scope:
 * https://www.googleapis.com/auth/webmasters.readonly
 * 
 * Strict Data Integrity Policy:
 * - When credentials are missing, status is strictly NOT_CONFIGURED with 0 rows.
 * - When API encounters an error, status is strictly ERROR with 0 rows.
 * - NEVER silently falls back to seeded or simulated rows.
 * - Respects the official 3-day Search Console telemetry lag.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GoogleAuthService } from "./google-auth.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../..");
const CACHE_DIR = path.join(ROOT, "content/growth/cache");

const GSC_SCOPE = "https://www.googleapis.com/auth/webmasters.readonly";

export class GSCClient {
  constructor(options = {}) {
    // Preserve trailing slash if present in property definition
    let site = options.siteUrl || process.env.GSC_SITE_URL || "https://www.piperesque.com/";
    if (!site.endsWith("/")) site += "/";
    this.siteUrl = site;

    this.auth = new GoogleAuthService({
      clientEmail: options.clientEmail || process.env.GSC_CLIENT_EMAIL,
      privateKey: options.privateKey || process.env.GSC_PRIVATE_KEY
    });

    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
  }

  isConfigured() {
    return this.auth.isConfigured();
  }

  /**
   * Fetches real performance data from Search Console API
   */
  async getPerformanceData({ startDate, endDate, dimensions = ["query", "page", "device"] } = {}) {
    // Calculate default date window with Search Console's 3-day lag
    const now = new Date();
    const defaultEnd = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];
    const defaultStart = new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString().split("T")[0];

    const queryStart = startDate || defaultStart;
    const queryEnd = endDate || defaultEnd;

    if (!this.isConfigured()) {
      return {
        status: "NOT_CONFIGURED",
        siteUrl: this.siteUrl,
        asOfDate: queryEnd,
        totalQueriesAnalyzed: 0,
        rows: [],
        message: "Google Search Console service account credentials are not configured. Live search telemetry is unavailable."
      };
    }

    const cacheKey = `gsc_${queryStart}_${queryEnd}_${dimensions.join("_")}.json`;
    const cacheFile = path.join(CACHE_DIR, cacheKey);

    // Return cached live response if under 6 hours old
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
      const liveData = await this._fetchFromLiveAPI({
        startDate: queryStart,
        endDate: queryEnd,
        dimensions
      });

      fs.writeFileSync(
        cacheFile,
        JSON.stringify({ timestamp: new Date().toISOString(), data: liveData }, null, 2),
        "utf-8"
      );

      return liveData;
    } catch (err) {
      console.error(`[GSC API] Live fetch error: ${err.message}`);
      return {
        status: "ERROR",
        siteUrl: this.siteUrl,
        asOfDate: queryEnd,
        totalQueriesAnalyzed: 0,
        rows: [],
        error: err.message,
        message: `Search Console API request failed: ${err.message}`
      };
    }
  }

  /**
   * Executes genuine authenticated Search Console API searchAnalytics.query call
   */
  async _fetchFromLiveAPI({ startDate, endDate, dimensions }) {
    const accessToken = await this.auth.getAccessToken(GSC_SCOPE);
    const endpoint = `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(this.siteUrl)}/searchAnalytics/query`;

    const requestBody = {
      startDate,
      endDate,
      dimensions,
      rowLimit: 500,
      startRow: 0
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
      throw new Error(`Google Search Console API error (HTTP ${response.status}): ${parsed.error?.message || parsed.error || errorText}`);
    }

    const json = await response.json();
    const rows = (json.rows || []).map(r => ({
      query: r.keys?.[0] || "",
      page: r.keys?.[1] || "",
      device: r.keys?.[2] || "UNSPECIFIED",
      clicks: r.clicks || 0,
      impressions: r.impressions || 0,
      ctr: r.ctr || 0,
      position: r.position || 0
    }));

    return {
      status: "LIVE",
      source: "google_search_console_api",
      siteUrl: this.siteUrl,
      startDate,
      endDate,
      asOfDate: endDate,
      totalQueriesAnalyzed: rows.length,
      rows
    };
  }

  /**
   * Analyzes real queries to detect striking distance and low-CTR opportunities
   */
  analyzeOpportunities(data) {
    const rows = data?.rows || [];

    if (data?.status !== "LIVE" || rows.length === 0) {
      return {
        status: data?.status || "UNAVAILABLE",
        asOfDate: data?.asOfDate || null,
        source: data?.source || "none",
        totalQueriesAnalyzed: 0,
        lowCtrOpportunities: [],
        strikingDistance: [],
        cannibalizationIssues: [],
        contentGaps: [],
        message: data?.message || "No live query telemetry available."
      };
    }

    // 1. High impressions with low CTR (< 2.0%)
    const lowCtrOpportunities = rows
      .filter(r => r.impressions >= 100 && r.ctr < 0.02)
      .sort((a, b) => b.impressions - a.impressions)
      .map(r => ({
        query: r.query,
        page: r.page,
        impressions: r.impressions,
        clicks: r.clicks,
        ctr: (r.ctr * 100).toFixed(2) + "%",
        position: r.position.toFixed(1),
        recommendation: "Improve title tag and meta description to boost click-through rate"
      }));

    // 2. Positions 5 to 30 (Striking Distance for page 1 / top-3)
    const strikingDistance = rows
      .filter(r => r.position >= 5.0 && r.position <= 30.0)
      .sort((a, b) => b.impressions - a.impressions)
      .map(r => ({
        query: r.query,
        page: r.page,
        position: r.position.toFixed(1),
        impressions: r.impressions,
        recommendation: "Strengthen on-page depth, add FAQ schema, and build contextual internal links"
      }));

    // 3. Keyword Cannibalization Detection (Multiple pages ranking for same query)
    const queryToPages = new Map();
    for (const r of rows) {
      if (!queryToPages.has(r.query)) queryToPages.set(r.query, []);
      queryToPages.get(r.query).push({ page: r.page, clicks: r.clicks, position: r.position });
    }
    const cannibalizationIssues = [];
    for (const [query, pages] of queryToPages.entries()) {
      if (pages.length > 1) {
        cannibalizationIssues.push({
          query,
          competingPages: pages.map(p => p.page),
          recommendation: "Differentiate target keywords or consolidate intent via canonical tags"
        });
      }
    }

    return {
      status: "LIVE",
      asOfDate: data.asOfDate,
      source: data.source,
      totalQueriesAnalyzed: rows.length,
      lowCtrOpportunities,
      strikingDistance,
      cannibalizationIssues,
      contentGaps: []
    };
  }

  /**
   * Diagnostic smoke-test for CLI validation
   */
  async smokeTest() {
    console.log(`[GSC Smoke Test] Testing connection to ${this.siteUrl}...`);
    if (!this.isConfigured()) {
      return { success: false, reason: "GSC_CLIENT_EMAIL or GSC_PRIVATE_KEY not provided." };
    }
    try {
      const data = await this.getPerformanceData();
      return { success: data.status === "LIVE", data };
    } catch (err) {
      return { success: false, error: err.message };
    }
  }
}
