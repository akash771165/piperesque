import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();

const APP = path.join(ROOT, "app");
const CONTENT = path.join(ROOT, "content");
const LIB = path.join(ROOT, "lib");
const SCRIPTS = path.join(ROOT, "scripts");

function exists(file) {
  return fs.existsSync(file);
}

function read(file) {
  try {
    return fs.readFileSync(file, "utf8");
  } catch {
    return "";
  }
}

function walk(dir) {
  if (!exists(dir)) return [];

  const results = [];

  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      results.push(...walk(full));
    } else {
      results.push(full);
    }
  }

  return results;
}

function relative(file) {
  return path.relative(ROOT, file).replaceAll("\\", "/");
}

function routeFromFile(file) {
  const rel = relative(file).replaceAll("\\", "/");

  if (!rel.startsWith("app/")) return null;

  let route = rel
    .replace(/^app\//, "")
    .replace(/\/page\.(tsx|ts|jsx|js)$/, "")
    .replace(/\.(tsx|ts|jsx|js)$/, "");

  if (!route) return "/";

  return "/" + route;
}

function isPageFile(file) {
  return /[\\/]+page\.(tsx|ts|jsx|js)$/.test(file);
}

function section(title) {
  console.log(`\n${"=".repeat(60)}`);
  console.log(title);
  console.log("=".repeat(60));
}

function extractStrings(text, regex) {
  const matches = [];
  let match;

  while ((match = regex.exec(text))) {
    matches.push(match[1]);
  }

  return matches;
}

/* --------------------------------------------------------- */
/* FILE INVENTORY                                             */
/* --------------------------------------------------------- */

const appFiles = walk(APP);
const appPageFiles = appFiles.filter(isPageFile);

const scriptsFiles = walk(SCRIPTS);
const contentFiles = walk(CONTENT);

/* --------------------------------------------------------- */
/* ROUTES                                                     */
/* --------------------------------------------------------- */

const routeRecords = appPageFiles
  .map((file) => ({
    file,
    route: routeFromFile(file),
    source: read(file),
  }))
  .filter((item) => item.route);

const staticRoutes = routeRecords.filter(
  (item) =>
    !item.route.includes("[") &&
    !item.route.includes("...")
);

const dynamicRoutes = routeRecords.filter(
  (item) =>
    item.route.includes("[") ||
    item.route.includes("...")
);

const generateStaticParamsFiles = routeRecords.filter((item) =>
  /\bgenerateStaticParams\s*\(/.test(item.source)
);

/* --------------------------------------------------------- */
/* BLOG INVENTORY                                             */
/* --------------------------------------------------------- */

const markdownBlogs = contentFiles.filter(
  (file) =>
    file.includes(`${path.sep}blog${path.sep}`) &&
    file.endsWith(".md")
);

const jsonBlogs = contentFiles.filter(
  (file) =>
    file.includes(`${path.sep}blogs${path.sep}`) &&
    file.endsWith(".json")
);

const blogDynamicPage = path.join(
  APP,
  "blog",
  "[slug]",
  "page.tsx"
);

const blogDynamicSource = read(blogDynamicPage);

const blogStaticParamsDetected =
  /\bgenerateStaticParams\s*\(/.test(blogDynamicSource);

const markdownSlugs = markdownBlogs.map((file) =>
  path.basename(file, ".md")
);

const jsonSlugs = [];

for (const file of jsonBlogs) {
  try {
    const data = JSON.parse(read(file));

    if (typeof data.slug === "string" && data.slug.trim()) {
      jsonSlugs.push(data.slug.trim());
    } else {
      jsonSlugs.push(path.basename(file, ".json"));
    }
  } catch {
    jsonSlugs.push(path.basename(file, ".json"));
  }
}

const allBlogSlugs = [...markdownSlugs, ...jsonSlugs];

const duplicateBlogSlugs = [
  ...new Set(
    allBlogSlugs.filter(
      (slug, index) => allBlogSlugs.indexOf(slug) !== index
    )
  ),
];

/* --------------------------------------------------------- */
/* LOCATION / SERVICE SOURCE DETECTION                        */
/* --------------------------------------------------------- */

const locationRoute = routeRecords.find(
  (item) => item.route === "/location/[location]"
);

const locationServiceRoute = routeRecords.find(
  (item) => item.route === "/location/[location]/[service]"
);

const serviceRoute = routeRecords.find(
  (item) => item.route === "/services/[slug]"
);

const serviceAreaRoute = routeRecords.find(
  (item) => item.route === "/service-areas/[city]"
);

const locationSource = locationRoute?.source ?? "";
const locationServiceSource = locationServiceRoute?.source ?? "";
const serviceSource = serviceRoute?.source ?? "";
const serviceAreaSource = serviceAreaRoute?.source ?? "";

function detectArrayLike(source, names) {
  for (const name of names) {
    const regex = new RegExp(
      `(?:const|let|var)\\s+${name}\\s*=\\s*\\[([\\s\\S]*?)\\]`,
      "m"
    );

    const match = source.match(regex);

    if (match) {
      return [...match[1].matchAll(/["'`]([^"'`]+)["'`]/g)].map(
        (m) => m[1]
      );
    }
  }

  return [];
}

const detectedLocations = [
  ...new Set([
    ...detectArrayLike(locationRoute?.source ?? "", [
      "locations",
      "cities",
      "locationSlugs",
    ]),
    ...detectArrayLike(locationServiceRoute?.source ?? "", [
      "locations",
      "cities",
      "locationSlugs",
    ]),
  ]),
];

const detectedServices = [
  ...new Set([
    ...detectArrayLike(serviceRoute?.source ?? "", [
      "services",
      "serviceSlugs",
    ]),
    ...detectArrayLike(locationServiceRoute?.source ?? "", [
      "services",
      "serviceSlugs",
    ]),
  ]),
];

/* --------------------------------------------------------- */
/* METADATA                                                   */
/* --------------------------------------------------------- */

const metadata = routeRecords.map((item) => {
  const source = item.source;

  return {
    route: item.route,
    file: relative(item.file),
    title:
      /\btitle\s*[:=]/.test(source) ||
      /\btitle\s*\(/.test(source) ||
      /\btitleTemplate\b/.test(source),
    description:
      /\bdescription\s*[:=]/.test(source),
    canonical:
      /canonical/i.test(source),
    robots:
      /\brobots\s*[:=]/i.test(source) ||
      /noindex/i.test(source),
    openGraph:
      /\bopenGraph\b/i.test(source),
  };
});

/* --------------------------------------------------------- */
/* SCHEMA                                                     */
/* --------------------------------------------------------- */

const schemaTypes = {
  Organization: false,
  LocalBusiness: false,
  Service: false,
  Article: false,
  Breadcrumb: false,
  FAQ: false,
  WebPage: false,
};

for (const file of appPageFiles) {
  const source = read(file);

  for (const type of Object.keys(schemaTypes)) {
    if (
      source.includes(`"@type": "${type}"`) ||
      source.includes(`'@type': '${type}'`) ||
      source.includes(`@type: "${type}"`) ||
      source.includes(`@type: '${type}'`) ||
      source.includes(type)
    ) {
      schemaTypes[type] = true;
    }
  }
}

/* --------------------------------------------------------- */
/* SITEMAP                                                    */
/* --------------------------------------------------------- */

const sitemapFile = path.join(APP, "sitemap.ts");
const sitemapSource = read(sitemapFile);

const sitemap = {
  exists: exists(sitemapFile),
  blogs:
    /blog/i.test(sitemapSource) &&
    /slug/i.test(sitemapSource),
  locations: /location/i.test(sitemapSource),
  locationServices:
    /location/i.test(sitemapSource) &&
    /service/i.test(sitemapSource),
  serviceAreas: /service-areas/i.test(sitemapSource),
};

/* --------------------------------------------------------- */
/* ROBOTS                                                     */
/* --------------------------------------------------------- */

const robotsFile = path.join(APP, "robots.ts");
const robotsSource = read(robotsFile);

const robots = {
  exists: exists(robotsFile),
  allow: /allow/i.test(robotsSource),
  disallow: /disallow/i.test(robotsSource),
  sitemap: /sitemap/i.test(robotsSource),
};

/* --------------------------------------------------------- */
/* INTERNAL LINK SYSTEM                                       */
/* --------------------------------------------------------- */

const internalLinksScript = path.join(
  SCRIPTS,
  "internal-links",
  "update-links.mjs"
);

const internalLinksSource = read(internalLinksScript);

const internalLinks = {
  exists: exists(internalLinksScript),
  generatesLinks:
    /writeFile|appendFile|replace|link/i.test(internalLinksSource),
};

/* --------------------------------------------------------- */
/* PAGE CATEGORY                                             */
/* --------------------------------------------------------- */

const categoryCounts = {
  core: 0,
  services: 0,
  locations: 0,
  "location-services": 0,
  "service-areas": 0,
  blogs: 0,
  other: 0,
};

for (const item of staticRoutes) {
  const route = item.route;

  if (
    route === "/" ||
    ["/about", "/contact", "/privacy-policy", "/terms"].includes(route)
  ) {
    categoryCounts.core++;
  } else if (route === "/services" || route.startsWith("/services/")) {
    categoryCounts.services++;
  } else if (
    route.startsWith("/location/") &&
    route.split("/").length === 3
  ) {
    categoryCounts.locations++;
  } else if (
    route.startsWith("/location/") &&
    route.split("/").length === 4
  ) {
    categoryCounts["location-services"]++;
  } else if (
    route === "/service-areas" ||
    route.startsWith("/service-areas/")
  ) {
    categoryCounts["service-areas"]++;
  } else if (route === "/blog" || route.startsWith("/blog/")) {
    categoryCounts.blogs++;
  } else {
    categoryCounts.other++;
  }
}

/* --------------------------------------------------------- */
/* RISK ANALYSIS                                              */
/* --------------------------------------------------------- */

const risks = [];

if (duplicateBlogSlugs.length) {
  risks.push({
    level: "HIGH",
    message: `Duplicate blog slugs detected: ${duplicateBlogSlugs.join(", ")}`,
  });
}

if (jsonBlogs.length + markdownBlogs.length > 0 && !blogStaticParamsDetected) {
  risks.push({
    level: "HIGH",
    message:
      "Blog content exists but generateStaticParams() was not detected in app/blog/[slug]/page.tsx.",
  });
}

if (!sitemap.exists) {
  risks.push({
    level: "HIGH",
    message: "app/sitemap.ts does not exist.",
  });
} else {
  if (!sitemap.blogs) {
    risks.push({
      level: "HIGH",
      message: "Sitemap does not provide clear evidence of blog URL generation.",
    });
  }

  if (!sitemap.locations) {
    risks.push({
      level: "HIGH",
      message: "Sitemap does not provide clear evidence of location URL generation.",
    });
  }
}

if (!robots.exists) {
  risks.push({
    level: "HIGH",
    message: "app/robots.ts does not exist.",
  });
} else if (!robots.sitemap) {
  risks.push({
    level: "MEDIUM",
    message:
      "robots.ts does not provide clear evidence of a sitemap declaration.",
  });
}

const weakMetadataRoutes = metadata.filter(
  (item) => !item.title || !item.description
);

if (weakMetadataRoutes.length) {
  risks.push({
    level: "MEDIUM",
    message: `${weakMetadataRoutes.length} route source files do not provide clear static evidence of both title and description metadata.`,
  });
}

if (!internalLinks.exists) {
  risks.push({
    level: "MEDIUM",
    message: "Internal-link update system was not found.",
  });
}

if (dynamicRoutes.length > 0) {
  risks.push({
    level: "LOW",
    message: `${dynamicRoutes.length} dynamic route patterns require runtime/static-params verification.`,
  });
}

/* --------------------------------------------------------- */
/* REPORT                                                     */
/* --------------------------------------------------------- */

section("PIPERESQUE SEO REALITY AUDIT");

section("1. ROUTE INVENTORY");

console.log(`Static route source files: ${staticRoutes.length}`);
console.log(`Dynamic route source files: ${dynamicRoutes.length}`);
console.log(
  `generateStaticParams() detected: ${generateStaticParamsFiles.length}`
);

console.log("\nStatic routes:");
for (const item of staticRoutes) {
  console.log(`  ${item.route}`);
}

console.log("\nDynamic routes:");
for (const item of dynamicRoutes) {
  console.log(`  ${item.route}`);
}

section("2. BLOG COVERAGE");

console.log(`Markdown blogs: ${markdownBlogs.length}`);
console.log(`JSON blogs: ${jsonBlogs.length}`);
console.log(`Total blog source records: ${allBlogSlugs.length}`);
console.log(`Unique blog slugs: ${new Set(allBlogSlugs).size}`);
console.log(
  `generateStaticParams() detected: ${blogStaticParamsDetected ? "YES" : "NO"}`
);

console.log("\nBlog slugs:");
for (const slug of [...new Set(allBlogSlugs)].sort()) {
  console.log(`  /blog/${slug}`);
}

if (duplicateBlogSlugs.length) {
  console.log("\nDuplicate slugs:");
  for (const slug of duplicateBlogSlugs) {
    console.log(`  ${slug}`);
  }
}

section("3. LOCATION / SERVICE INVENTORY");

console.log(
  `Detected locations from route source: ${
    detectedLocations.length || "UNKNOWN"
  }`
);

if (detectedLocations.length) {
  console.log(`Locations: ${detectedLocations.join(", ")}`);
}

console.log(
  `Detected services from route source: ${
    detectedServices.length || "UNKNOWN"
  }`
);

if (detectedServices.length) {
  console.log(`Services: ${detectedServices.join(", ")}`);
}

if (detectedLocations.length && detectedServices.length) {
  console.log(
    `Potential location × service combinations: ${
      detectedLocations.length * detectedServices.length
    }`
  );
} else {
  console.log(
    "Location × service combinations: UNKNOWN — INSUFFICIENT STATIC EVIDENCE"
  );
}

section("4. PAGE INVENTORY");

for (const [category, count] of Object.entries(categoryCounts)) {
  console.log(`${category.padEnd(22)} ${count}`);
}

section("5. METADATA");

const metadataSummary = {
  title: metadata.filter((x) => x.title).length,
  description: metadata.filter((x) => x.description).length,
  canonical: metadata.filter((x) => x.canonical).length,
  robots: metadata.filter((x) => x.robots).length,
  openGraph: metadata.filter((x) => x.openGraph).length,
};

console.log(`Route files analysed: ${metadata.length}`);
console.log(`Title evidence: ${metadataSummary.title}`);
console.log(`Description evidence: ${metadataSummary.description}`);
console.log(`Canonical evidence: ${metadataSummary.canonical}`);
console.log(`Robots evidence: ${metadataSummary.robots}`);
console.log(`OpenGraph evidence: ${metadataSummary.openGraph}`);

section("6. SCHEMA");

for (const [type, detected] of Object.entries(schemaTypes)) {
  console.log(`${type.padEnd(18)} ${detected ? "DETECTED" : "NOT DETECTED"}`);
}

section("7. INTERNAL LINKS");

console.log(`Script exists: ${internalLinks.exists ? "YES" : "NO"}`);
console.log(
  `Link-generation evidence: ${
    internalLinks.generatesLinks ? "DETECTED" : "NOT DETECTED"
  }`
);

section("8. SITEMAP");

console.log(`app/sitemap.ts: ${sitemap.exists ? "EXISTS" : "MISSING"}`);
console.log(`Blogs: ${sitemap.blogs ? "DETECTED" : "NOT DETECTED"}`);
console.log(`Locations: ${sitemap.locations ? "DETECTED" : "NOT DETECTED"}`);
console.log(
  `Location × service: ${
    sitemap.locationServices ? "DETECTED" : "NOT DETECTED"
  }`
);
console.log(
  `Service areas: ${sitemap.serviceAreas ? "DETECTED" : "NOT DETECTED"}`
);

section("9. ROBOTS");

console.log(`app/robots.ts: ${robots.exists ? "EXISTS" : "MISSING"}`);
console.log(`Allow evidence: ${robots.allow ? "YES" : "NO"}`);
console.log(`Disallow evidence: ${robots.disallow ? "YES" : "NO"}`);
console.log(`Sitemap evidence: ${robots.sitemap ? "YES" : "NO"}`);

section("10. QUALITY RISKS");

if (!risks.length) {
  console.log("No deterministic risks detected by this static audit.");
} else {
  for (const level of ["HIGH", "MEDIUM", "LOW"]) {
    const levelRisks = risks.filter((risk) => risk.level === level);

    if (!levelRisks.length) continue;

    console.log(`\n${level}:`);

    for (const risk of levelRisks) {
      console.log(`  - ${risk.message}`);
    }
  }
}

section("11. 50-PAGE STRATEGY");

console.log(
  "This audit does NOT claim that 50 pages will rank #1."
);

console.log(
  "Existing URLs that can be evaluated for a 50-page portfolio:"
);

const candidateRoutes = staticRoutes
  .map((item) => item.route)
  .filter(
    (route) =>
      route !== "/privacy-policy" &&
      route !== "/terms" &&
      route !== "/_not-found"
  )
  .slice(0, 50);

for (const route of candidateRoutes) {
  console.log(`  REVIEW: ${route}`);
}

console.log(
  "\nClassification requires search-volume, SERP, backlink, and performance data; this repository-only audit will not invent those metrics."
);

section("12. FINAL SUMMARY");

console.log(`Total detected content files: ${contentFiles.length}`);
console.log(`Total detected route source files: ${routeRecords.length}`);
console.log(
  `Total detected static route source files: ${staticRoutes.length}`
);
console.log(
  `Total detected dynamic route source files: ${dynamicRoutes.length}`
);
console.log(`Total blog source records: ${allBlogSlugs.length}`);

console.log(
  `Blog route generation evidence: ${
    blogStaticParamsDetected ? "DETECTED" : "NOT DETECTED"
  }`
);

console.log(
  `Sitemap evidence: ${sitemap.exists ? "DETECTED" : "MISSING"}`
);

console.log(
  `Metadata evidence: ${metadataSummary.title}/${metadata.length} title, ${metadataSummary.description}/${metadata.length} description`
);

console.log(
  `Schema types detected: ${
    Object.values(schemaTypes).filter(Boolean).length
  }/${Object.keys(schemaTypes).length}`
);

console.log(`Critical issues: ${risks.filter((r) => r.level === "HIGH").length}`);
console.log(
  `High issues: ${risks.filter((r) => r.level === "HIGH").length}`
);
console.log(
  `Medium issues: ${risks.filter((r) => r.level === "MEDIUM").length}`
);

console.log("\nAudit completed.");