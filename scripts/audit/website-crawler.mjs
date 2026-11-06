/**
 * PipeResque Comprehensive Master Website Crawler & QA Auditor
 * 
 * Tests every sitemap URL, internal link, redirect, asset, metadata,
 * phone link, intentional 404, and API endpoint against the running application.
 * 
 * Run via: node scripts/audit/website-crawler.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../..");
const BASE_URL = process.env.AUDIT_BASE_URL || "http://localhost:3000";
const REPORT_DIR = path.join(ROOT, "reports/audit");

if (!fs.existsSync(REPORT_DIR)) {
  fs.mkdirSync(REPORT_DIR, { recursive: true });
}

// Helper for parsing tags
function extractMatches(html, regex) {
  const matches = [];
  let match;
  while ((match = regex.exec(html)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

async function fetchWithRedirects(url, maxRedirects = 5) {
  let currentUrl = url;
  let redirects = [];

  for (let i = 0; i < maxRedirects; i++) {
    const res = await fetch(currentUrl, {
      method: "GET",
      redirect: "manual",
      headers: { "User-Agent": "PipeResque-QA-Audit-Crawler/1.0" }
    });

    if ([301, 302, 307, 308].includes(res.status)) {
      const location = res.headers.get("location");
      if (!location) break;
      const nextUrl = location.startsWith("http") ? location : new URL(location, currentUrl).toString();
      redirects.push({ from: currentUrl, to: nextUrl, status: res.status });
      currentUrl = nextUrl;
      continue;
    }

    const text = await res.text();
    return {
      finalUrl: currentUrl,
      status: res.status,
      redirects,
      headers: Object.fromEntries(res.headers.entries()),
      body: text
    };
  }

  return {
    finalUrl: currentUrl,
    status: 508, // Loop
    redirects,
    headers: {},
    body: "Redirect loop detected"
  };
}

async function runAudit() {
  console.log("================================================================================");
  console.log("          PIPERESQUE MASTER WEBSITE CRAWLER & ROUTE QA AUDIT                    ");
  console.log(` Target Server : ${BASE_URL}`);
  console.log(` Executed At   : ${new Date().toISOString()}`);
  console.log("================================================================================\n");

  const results = {
    testedUrls: new Map(),
    sitemapUrls: [],
    redirectsChecked: [],
    brokenInternalLinks: [],
    missingAssets: [],
    seoAnomalies: [],
    phoneLinkIssues: [],
    intentional404s: [],
    apiTests: [],
    summary: {}
  };

  // 1. Fetch live Sitemap
  console.log("[Phase 1] Fetching live sitemap from /sitemap.xml...");
  try {
    const sitemapRes = await fetch(`${BASE_URL}/sitemap.xml`);
    if (!sitemapRes.ok) {
      throw new Error(`Sitemap responded with HTTP ${sitemapRes.status}`);
    }
    const xml = await sitemapRes.text();
    const locMatches = extractMatches(xml, /<loc>(.*?)<\/loc>/g);
    results.sitemapUrls = locMatches.map(loc => {
      try {
        const u = new URL(loc);
        return u.pathname;
      } catch {
        return loc;
      }
    });
    console.log(`  ✓ Discovered ${results.sitemapUrls.length} live canonical URLs in sitemap.xml\n`);
  } catch (err) {
    console.error(`  ✗ Failed to fetch sitemap: ${err.message}`);
    process.exit(1);
  }

  // 2. Queue of URLs to crawl
  const queue = new Set([
    "/",
    "/about",
    "/contact",
    "/services",
    "/service-areas",
    "/blog",
    "/privacy-policy",
    "/terms",
    "/growth",
    "/robots.txt",
    "/manifest.webmanifest",
    ...results.sitemapUrls
  ]);

  const internalLinksDiscovered = new Set();
  const assetsDiscovered = new Set();

  console.log("[Phase 2] Crawling and verifying all unique routes...");
  let crawledCount = 0;

  for (const pathname of queue) {
    if (results.testedUrls.has(pathname)) continue;
    crawledCount++;

    const fullUrl = `${BASE_URL}${pathname}`;
    try {
      const response = await fetchWithRedirects(fullUrl);
      const isRedirect = response.redirects.length > 0;
      const status = response.status;
      const body = response.body;

      const pageAudit = {
        url: pathname,
        status,
        redirectChain: response.redirects,
        title: null,
        description: null,
        canonical: null,
        hasH1: false,
        hasDisclaimer: false,
        linksCount: 0,
        imagesCount: 0,
        issues: []
      };

      if (status === 200 && response.headers["content-type"]?.includes("text/html")) {
        // Parse metadata
        const titleMatch = body.match(/<title[^>]*>(.*?)<\/title>/i);
        pageAudit.title = titleMatch ? titleMatch[1].trim() : null;
        if (!pageAudit.title) pageAudit.issues.push("Missing <title> tag");

        const descMatch = body.match(/<meta[^>]*name=["']description["'][^>]*content=["'](.*?)["']/i);
        pageAudit.description = descMatch ? descMatch[1].trim() : null;
        if (!pageAudit.description) pageAudit.issues.push("Missing meta description");

        const canonMatch = body.match(/<link[^>]*rel=["']canonical["'][^>]*href=["'](.*?)["']/i);
        pageAudit.canonical = canonMatch ? canonMatch[1].trim() : null;
        if (!pageAudit.canonical && pathname !== "/growth") {
          pageAudit.issues.push("Missing canonical link tag");
        }

        const h1Match = body.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
        pageAudit.hasH1 = Boolean(h1Match);
        if (!pageAudit.hasH1) pageAudit.issues.push("Missing <h1> heading");

        // Referral platform disclaimer check
        const hasReferralNotice = body.includes("independent") || body.includes("referral") || body.includes("PipeResque connects");
        pageAudit.hasDisclaimer = hasReferralNotice;
        if (!hasReferralNotice && !["/robots.txt", "/manifest.webmanifest", "/growth"].includes(pathname)) {
          pageAudit.issues.push("Missing referral model notice");
        }

        // Extract internal links
        const hrefMatches = extractMatches(body, /href=["']([^"'#\s]+)["']/gi);
        for (const href of hrefMatches) {
          if (href.startsWith("tel:")) {
            if (href !== "tel:+18773640861") {
              results.phoneLinkIssues.push({ page: pathname, invalidHref: href });
            }
            continue;
          }

          if (href.startsWith("/") && !href.startsWith("//") && !href.startsWith("/_next")) {
            internalLinksDiscovered.add(href);
            // If it's a page link (not an asset), add to crawl queue
            if (!href.match(/\.(png|jpg|jpeg|webp|svg|ico|css|js|woff2|xml|txt)$/i)) {
              if (!results.testedUrls.has(href)) {
                queue.add(href);
              }
            } else {
              assetsDiscovered.add(href);
            }
          } else if (href.startsWith("https://www.piperesque.com")) {
            try {
              const u = new URL(href);
              if (!results.testedUrls.has(u.pathname)) {
                queue.add(u.pathname);
              }
            } catch {
              // ignore
            }
          }
        }
        pageAudit.linksCount = hrefMatches.length;

        // Extract image src
        const imgMatches = extractMatches(body, /src=["']([^"'\s]+)["']/gi);
        for (const src of imgMatches) {
          if (src.startsWith("/") && !src.startsWith("//") && !src.startsWith("/_next")) {
            assetsDiscovered.add(src);
          }
        }
        pageAudit.imagesCount = imgMatches.length;
      } else if (status === 404) {
        pageAudit.issues.push("Page returned HTTP 404 Not Found");
      } else if (status >= 500) {
        pageAudit.issues.push(`Server Error HTTP ${status}`);
      }

      results.testedUrls.set(pathname, pageAudit);

      if (pageAudit.issues.length > 0) {
        results.seoAnomalies.push({ pathname, issues: pageAudit.issues });
      }

      if (crawledCount % 25 === 0 || crawledCount === queue.size) {
        console.log(`  Processed ${crawledCount} / ${queue.size} routes...`);
      }
    } catch (err) {
      results.testedUrls.set(pathname, { url: pathname, status: 0, error: err.message, issues: [err.message] });
      results.seoAnomalies.push({ pathname, issues: [`Crawl network error: ${err.message}`] });
    }
  }

  console.log(`  ✓ Completed full crawl of ${results.testedUrls.size} discovered routes.\n`);

  // 3. Verify Configured Redirects from next.config.ts
  console.log("[Phase 3] Auditing configured permanent redirects...");
  const redirectTargets = [
    { source: "/location/houston", expectedTarget: "/location/houston/emergency-plumbing" },
    { source: "/location/katy", expectedTarget: "/location/katy/emergency-plumbing" },
    { source: "/location/sugar-land", expectedTarget: "/location/sugar-land/emergency-plumbing" },
    { source: "/location/cypress", expectedTarget: "/location/cypress/emergency-plumbing" },
    { source: "/location/spring", expectedTarget: "/location/spring/emergency-plumbing" },
    { source: "/location/pearland", expectedTarget: "/location/pearland/emergency-plumbing" },
    { source: "/location/pasadena", expectedTarget: "/location/pasadena/emergency-plumbing" },
    { source: "/location/the-woodlands", expectedTarget: "/location/the-woodlands/emergency-plumbing" },
    { source: "/location/tomball", expectedTarget: "/services/emergency-plumbing" },
    { source: "/location/conroe", expectedTarget: "/services/emergency-plumbing" },
    { source: "/location/league-city", expectedTarget: "/services/emergency-plumbing" },
    { source: "/blog/faucet-repair-houston-tx", expectedTarget: "/services/emergency-plumbing" },
    { source: "/blog/toilet-repair-houston-tx", expectedTarget: "/services/emergency-plumbing" },
    { source: "/blog/emergency-drain-cleaning-houston-tx", expectedTarget: "/blog/emergency-drain-cleaning-houston" },
    { source: "/service-areas/tomball", expectedTarget: "/service-areas" }
  ];

  for (const redir of redirectTargets) {
    const res = await fetchWithRedirects(`${BASE_URL}${redir.source}`, 2);
    const passed = res.redirects.length > 0 && res.finalUrl.endsWith(redir.expectedTarget);
    results.redirectsChecked.push({
      source: redir.source,
      expected: redir.expectedTarget,
      actual: res.finalUrl,
      redirects: res.redirects,
      passed
    });
    console.log(`  ${passed ? "✓" : "✗"} Redirect ${redir.source} -> ${res.finalUrl} (${passed ? "PASS" : "FAIL"})`);
  }
  console.log("");

  // 4. Verify Static Assets in public/
  console.log("[Phase 4] Verifying referenced static assets...");
  for (const assetPath of assetsDiscovered) {
    const cleanPath = assetPath.split("?")[0];
    const fullLocalPath = path.join(ROOT, "public", cleanPath);
    if (!fs.existsSync(fullLocalPath)) {
      results.missingAssets.push({ assetPath, localPath: fullLocalPath });
      console.log(`  ✗ Missing Asset File: ${assetPath}`);
    }
  }
  if (results.missingAssets.length === 0) {
    console.log(`  ✓ All ${assetsDiscovered.size} discovered static assets physically exist in public/`);
  }
  console.log("");

  // 5. Test Intentional 404 Behaviour
  console.log("[Phase 5] Verifying intentional 404 error handling...");
  const intentional404Urls = [
    "/random-non-existent-page-xyz",
    "/blog/non-existent-slug-xyz",
    "/services/fake-plumbing-service-xyz",
    "/location/fake-city/fake-service",
    "/service-areas/invalid-city-name-xyz"
  ];

  for (const testPath of intentional404Urls) {
    const res = await fetch(`${BASE_URL}${testPath}`);
    const passed = res.status === 404;
    results.intentional404s.push({ path: testPath, status: res.status, passed });
    console.log(`  ${passed ? "✓" : "✗"} Request ${testPath} returned HTTP ${res.status} (${passed ? "CORRECT 404" : "FAILED"})`);
  }
  console.log("");

  // 6. Test Referral Lead Intake API
  console.log("[Phase 6] Testing Lead Intake API /api/referral-lead...");
  
  // Test 6a: Valid Lead
  try {
    const validRes = await fetch(`${BASE_URL}/api/referral-lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "10.0.1.1" },
      body: JSON.stringify({
        fullName: "QA Integration Test",
        phone: "(713) 555-0199",
        zipCode: "77002",
        serviceRequested: "emergency-plumbing",
        details: "Automated QA route and lead verification test run.",
        consentAccepted: true,
        honeypot: ""
      })
    });
    const validJson = await validRes.json();
    const passed = validRes.status === 200 && validJson.success === true && Boolean(validJson.leadId);
    results.apiTests.push({ test: "Valid Houston Lead", status: validRes.status, passed, response: validJson });
    console.log(`  ${passed ? "✓" : "✗"} Valid Submission: HTTP ${validRes.status} (Lead ID: ${validJson.leadId})`);
  } catch (err) {
    results.apiTests.push({ test: "Valid Houston Lead", status: 500, passed: false, error: err.message });
  }

  // Test 6b: Out of Area ZIP
  try {
    const ooaRes = await fetch(`${BASE_URL}/api/referral-lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "10.0.1.2" },
      body: JSON.stringify({
        fullName: "Out of Area Customer",
        phone: "(512) 555-0199",
        zipCode: "78701", // Austin TX
        serviceRequested: "drain-cleaning",
        consentAccepted: true
      })
    });
    const ooaJson = await ooaRes.json();
    const passed = ooaRes.status === 200 && ooaJson.qualificationStatus === "OUT_OF_SERVICE_AREA";
    results.apiTests.push({ test: "Out-of-Area Geographic Qualification", status: ooaRes.status, passed, response: ooaJson });
    console.log(`  ${passed ? "✓" : "✗"} Out-of-Area Qualification: HTTP ${ooaRes.status} (Status: ${ooaJson.qualificationStatus})`);
  } catch (err) {
    results.apiTests.push({ test: "Out-of-Area ZIP Rejection", status: 500, passed: false, error: err.message });
  }

  // Test 6c: Anti-spam Honeypot Rejection
  try {
    const spamRes = await fetch(`${BASE_URL}/api/referral-lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "10.0.1.3" },
      body: JSON.stringify({
        fullName: "Spam Bot",
        phone: "(800) 555-0199",
        zipCode: "77002",
        honeypot: "spam_bot_trap",
        serviceRequested: "emergency-plumbing",
        consentAccepted: true
      })
    });
    const spamJson = await spamRes.json();
    const passed = spamRes.status === 200 && spamJson.leadId === "PR-SPAM-IGN";
    results.apiTests.push({ test: "Honeypot Anti-Spam Trap", status: spamRes.status, passed, response: spamJson });
    console.log(`  ${passed ? "✓" : "✗"} Anti-Spam Trap: HTTP ${spamRes.status} (Discarded: ${spamJson.leadId})`);
  } catch (err) {
    results.apiTests.push({ test: "Honeypot Anti-Spam Trap", status: 500, passed: false, error: err.message });
  }

  // Test 6d: Malformed / Empty Payload
  try {
    const emptyRes = await fetch(`${BASE_URL}/api/referral-lead`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-forwarded-for": "10.0.1.4" },
      body: JSON.stringify({})
    });
    const emptyJson = await emptyRes.json();
    const passed = emptyRes.status === 400;
    results.apiTests.push({ test: "Empty Payload Validation", status: emptyRes.status, passed, response: emptyJson });
    console.log(`  ${passed ? "✓" : "✗"} Empty Payload Validation: HTTP ${emptyRes.status} (${emptyJson.error})`);
  } catch (err) {
    results.apiTests.push({ test: "Empty Payload Validation", status: 500, passed: false, error: err.message });
  }

  console.log("");

  // Summary Metrics
  const valid200Count = Array.from(results.testedUrls.values()).filter(p => p.status === 200).length;
  const error404Count = Array.from(results.testedUrls.values()).filter(p => p.status === 404).length;
  const error500Count = Array.from(results.testedUrls.values()).filter(p => p.status >= 500).length;

  results.summary = {
    totalUrlsDiscovered: queue.size,
    totalRoutesCrawled: results.testedUrls.size,
    valid200Routes: valid200Count,
    error404Routes: error404Count,
    error500Routes: error500Count,
    totalSitemapUrls: results.sitemapUrls.length,
    redirectsVerified: results.redirectsChecked.filter(r => r.passed).length,
    redirectsFailed: results.redirectsChecked.filter(r => !r.passed).length,
    missingAssetsCount: results.missingAssets.length,
    phoneIssuesCount: results.phoneLinkIssues.length,
    intentional404sVerified: results.intentional404s.filter(r => r.passed).length,
    apiTestsPassed: results.apiTests.filter(t => t.passed).length,
    totalApiTests: results.apiTests.length
  };

  // Write full JSON report with serializable Map
  const serializableResults = {
    ...results,
    testedUrls: Object.fromEntries(results.testedUrls)
  };

  fs.writeFileSync(
    path.join(REPORT_DIR, "crawler-report.json"),
    JSON.stringify(serializableResults, null, 2),
    "utf-8"
  );

  console.log("================================================================================");
  console.log("                        CRAWLER AUDIT SUMMARY METRICS                           ");
  console.log("================================================================================");
  console.log(`  • Total Routes Discovered & Tested : ${results.summary.totalRoutesCrawled}`);
  console.log(`  • HTTP 200 Success Routes          : ${results.summary.valid200Routes}`);
  console.log(`  • Unexpected HTTP 404 Errors       : ${results.summary.error404Routes}`);
  console.log(`  • Unexpected HTTP 500 Errors       : ${results.summary.error500Routes}`);
  console.log(`  • Redirects Verified               : ${results.summary.redirectsVerified} / ${results.redirectsChecked.length}`);
  console.log(`  • Missing Static Assets            : ${results.summary.missingAssetsCount}`);
  console.log(`  • Non-Canonical Phone Links        : ${results.summary.phoneIssuesCount}`);
  console.log(`  • Intentional 404 Handling         : ${results.summary.intentional404sVerified} / ${results.intentional404s.length} verified`);
  console.log(`  • Lead API Security & Validation   : ${results.summary.apiTestsPassed} / ${results.summary.totalApiTests} passed`);
  console.log("--------------------------------------------------------------------------------");
  console.log(`  Detailed audit log written to: reports/audit/crawler-report.json`);
  console.log("================================================================================\n");

  if (error404Count > 0 || error500Count > 0 || results.summary.missingAssetsCount > 0) {
    console.error("AUDIT FAILED: Discovered broken routes or missing assets that require remediation.");
    process.exit(1);
  }

  process.exit(0);
}

runAudit().catch(err => {
  console.error("Fatal crawler crash:", err);
  process.exit(1);
});
