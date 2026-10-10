const BASE_URL = (process.env.SITE_URL || "https://www.piperesque.com").replace(/\/$/, "");
const WEBHOOK_URL = process.env.N8N_ALERT_WEBHOOK_URL;

const paths = [
  "/",
  "/services",
  "/services/emergency-plumbing",
  "/location/houston/sewer-line-repair",
  "/contact",
  "/sitemap.xml",
  "/robots.txt",
];

async function checkPath(path) {
  const url = `${BASE_URL}${path}`;
  const started = Date.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: AbortSignal.timeout(15000),
      headers: { "user-agent": "PipeRescueHealthMonitor/1.0" },
    });

    return {
      url,
      status: response.status,
      ok: response.ok,
      finalUrl: response.url,
      durationMs: Date.now() - started,
      contentType: response.headers.get("content-type") || "",
    };
  } catch (error) {
    return {
      url,
      status: 0,
      ok: false,
      durationMs: Date.now() - started,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}

const results = await Promise.all(paths.map(checkPath));
const failures = results.filter((result) => !result.ok);
const report = {
  site: BASE_URL,
  checkedAt: new Date().toISOString(),
  healthy: failures.length === 0,
  checkedCount: results.length,
  failureCount: failures.length,
  results,
};

console.log(JSON.stringify(report, null, 2));

if (failures.length > 0 && WEBHOOK_URL) {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        event: "piperesque_site_health_failure",
        ...report,
        failures,
      }),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.error(`n8n alert webhook returned HTTP ${response.status}`);
    }
  } catch (error) {
    console.error(
      "Could not send n8n alert:",
      error instanceof Error ? error.message : String(error),
    );
  }
}

if (failures.length > 0) {
  console.error(`PipeRescue health check failed: ${failures.length} of ${results.length} checks failed.`);
  process.exitCode = 1;
} else {
  console.log(`PipeRescue health check passed: all ${results.length} URLs responded successfully.`);
}
