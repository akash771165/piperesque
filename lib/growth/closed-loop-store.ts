import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { readGscRowsFromDataStores } from "@/lib/growth/gsc-opportunities";

export const MAX_REVENUE_LOGS = 250;
export const MAX_GSC_PAGES = 500;

export interface RevenueLogEntry {
  id: string;
  timestamp: string;
  eventType: "conversion" | "intent";
  channel: "call" | "form";
  payout: number;
  status: string;
  city: string;
  service: string;
  page?: string;
  source: "leadsmart_webhook" | "site_intent" | "dashboard_simulation";
}

export interface ClosedLoopRevenueStore {
  lastUpdated: string | null;
  qualifiedLeads: number;
  revenue: number;
  soldCalls: number;
  soldForms: number;
  callIntents: number;
  formIntents: number;
  dailyQualifiedLeads: Record<string, number>;
  dailyRevenue: Record<string, number>;
  logs: RevenueLogEntry[];
}

export interface GscPageMetric {
  page: string;
  topQuery: string;
  clicks: number;
  impressions: number;
  ctr: number; // stored as percentage 0..100 (e.g. 1.51 means 1.51%)
  position: number;
}

export interface GscPerformanceStore {
  lastSyncedAt: string | null;
  source: "post_sync" | "google_search_console_api" | "local_cache" | "none";
  totals: {
    clicks: number;
    impressions: number;
    avgCtr: number; // percentage 0..100
  };
  pages: GscPageMetric[];
}

export interface PageSeoOverride {
  page: string;
  title: string;
  description: string;
  topQuery: string;
  previousCtr: number;
  impressions: number;
  position: number;
  optimizedAt: string;
}

export interface TrendingServiceHighlight {
  service: string;
  serviceSlug: string;
  city: string;
  citySlug: string;
  conversions: number;
  revenue: number;
  badgeText: string;
  updatedAt: string;
}

export interface SeoOverridesStore {
  lastOptimizedAt: string | null;
  pages: Record<string, PageSeoOverride>;
  topServices: Array<{ service: string; conversions: number; revenue: number }>;
  topCities: Array<{ city: string; conversions: number; revenue: number }>;
  trendingHighlight: TrendingServiceHighlight | null;
}

const KNOWN_SERVICE_SLUGS: Record<string, { label: string; slug: string }> = {
  "emergency plumbing": {
    label: "Emergency Plumbing",
    slug: "emergency-plumbing",
  },
  "sewer line repair": {
    label: "Sewer Line Repair",
    slug: "sewer-line-repair",
  },
  "water heater repair": {
    label: "Water Heater Repair",
    slug: "water-heater-repair",
  },
  "drain cleaning": {
    label: "Drain Cleaning",
    slug: "drain-cleaning",
  },
  "leak detection": {
    label: "Leak Detection",
    slug: "leak-detection",
  },
  "pipe repair": {
    label: "Pipe Repair",
    slug: "pipe-repair",
  },
  "toilet repair": {
    label: "Toilet Repair",
    slug: "toilet-repair",
  },
  "faucet repair": {
    label: "Faucet Repair",
    slug: "faucet-repair",
  },
  "residential plumbing": {
    label: "Residential Plumbing",
    slug: "residential-plumbing",
  },
  "commercial plumbing": {
    label: "Commercial Plumbing",
    slug: "commercial-plumbing",
  },
};

const KNOWN_CITY_SLUGS: Record<string, { label: string; slug: string }> = {
  houston: { label: "Houston", slug: "houston" },
  katy: { label: "Katy", slug: "katy" },
  "sugar land": { label: "Sugar Land", slug: "sugar-land" },
  cypress: { label: "Cypress", slug: "cypress" },
  spring: { label: "Spring", slug: "spring" },
  pearland: { label: "Pearland", slug: "pearland" },
  pasadena: { label: "Pasadena", slug: "pasadena" },
  richmond: { label: "Richmond", slug: "richmond" },
  "missouri city": { label: "Missouri City", slug: "missouri-city" },
  "the woodlands": { label: "The Woodlands", slug: "the-woodlands" },
  humble: { label: "Humble", slug: "humble" },
  league: { label: "League City", slug: "league-city" },
  "league city": { label: "League City", slug: "league-city" },
  baytown: { label: "Baytown", slug: "baytown" },
};

function sanitizeText(raw: unknown, maxLen = 160, fallback = ""): string {
  if (typeof raw !== "string") return fallback;
  const cleaned = raw
    .replace(/[\r\n\t]+/g, " ")
    .replace(/[\u0000-\u001F\u007F]/g, "")
    .replace(/[<>]/g, "")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (!cleaned) return fallback;
  return cleaned.length <= maxLen ? cleaned : cleaned.slice(0, maxLen).trim();
}

function toFiniteNonNegative(value: unknown, fallback = 0): number {
  const n = typeof value === "number" ? value : Number(value);
  if (!Number.isFinite(n) || n < 0) return fallback;
  return n;
}

export function normalizePagePath(rawPage: unknown): string | null {
  if (typeof rawPage !== "string") return null;
  const trimmed = rawPage.trim();
  if (!trimmed) return null;

  let pathname: string;
  if (trimmed.startsWith("/")) {
    pathname = trimmed.split("?")[0].split("#")[0];
  } else {
    try {
      const parsed = new URL(trimmed);
      if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
        return null;
      }
      pathname = parsed.pathname || "/";
    } catch {
      return null;
    }
  }

  // Collapse multiple slashes and remove trailing slash except root "/"
  pathname = pathname.replace(/\/{2,}/g, "/");
  if (pathname.length > 1 && pathname.endsWith("/")) {
    pathname = pathname.slice(0, -1);
  }
  if (!pathname.startsWith("/") || pathname.includes("..")) {
    return null;
  }
  return pathname.slice(0, 200);
}

/**
 * Strictly confines JSON store paths inside `<rootDir>/data/`.
 */
export function resolveDataStorePath(
  fileName: "revenue-store.json" | "gsc-store.json" | "seo-overrides.json",
  rootDir: string = process.cwd()
): string {
  const baseDir = path.resolve(rootDir, "data");
  const resolved = path.resolve(baseDir, fileName);
  if (!resolved.startsWith(`${baseDir}${path.sep}`)) {
    throw new Error(`Invalid data store path: ${fileName}`);
  }
  return resolved;
}

function writeJsonAtomically(filePath: string, payload: unknown): void {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  const tmpPath = `${filePath}.${process.pid}.${Date.now()}.${crypto
    .randomBytes(4)
    .toString("hex")}.tmp`;
  fs.writeFileSync(tmpPath, `${JSON.stringify(payload, null, 2)}\n`, "utf-8");
  fs.renameSync(tmpPath, filePath);
}

export function createDefaultRevenueStore(): ClosedLoopRevenueStore {
  return {
    lastUpdated: null,
    qualifiedLeads: 0,
    revenue: 0,
    soldCalls: 0,
    soldForms: 0,
    callIntents: 0,
    formIntents: 0,
    dailyQualifiedLeads: {},
    dailyRevenue: {},
    logs: [],
  };
}

export function createDefaultGscStore(): GscPerformanceStore {
  return {
    lastSyncedAt: null,
    source: "none",
    totals: {
      clicks: 0,
      impressions: 0,
      avgCtr: 0,
    },
    pages: [],
  };
}

export function createDefaultSeoOverridesStore(): SeoOverridesStore {
  return {
    lastOptimizedAt: null,
    pages: {},
    topServices: [],
    topCities: [],
    trendingHighlight: null,
  };
}

export function readClosedLoopRevenueStore(
  rootDir: string = process.cwd()
): ClosedLoopRevenueStore {
  try {
    const filePath = resolveDataStorePath("revenue-store.json", rootDir);
    if (!fs.existsSync(filePath)) {
      return createDefaultRevenueStore();
    }
    const parsed = JSON.parse(
      fs.readFileSync(filePath, "utf-8")
    ) as Partial<ClosedLoopRevenueStore>;
    if (!parsed || typeof parsed !== "object") {
      return createDefaultRevenueStore();
    }
    return {
      lastUpdated:
        typeof parsed.lastUpdated === "string" ? parsed.lastUpdated : null,
      qualifiedLeads: Math.round(toFiniteNonNegative(parsed.qualifiedLeads)),
      revenue: Number(toFiniteNonNegative(parsed.revenue).toFixed(2)),
      soldCalls: Math.round(toFiniteNonNegative(parsed.soldCalls)),
      soldForms: Math.round(toFiniteNonNegative(parsed.soldForms)),
      callIntents: Math.round(toFiniteNonNegative(parsed.callIntents)),
      formIntents: Math.round(toFiniteNonNegative(parsed.formIntents)),
      dailyQualifiedLeads:
        parsed.dailyQualifiedLeads &&
        typeof parsed.dailyQualifiedLeads === "object"
          ? parsed.dailyQualifiedLeads
          : {},
      dailyRevenue:
        parsed.dailyRevenue && typeof parsed.dailyRevenue === "object"
          ? parsed.dailyRevenue
          : {},
      logs: Array.isArray(parsed.logs)
        ? parsed.logs.slice(0, MAX_REVENUE_LOGS)
        : [],
    };
  } catch {
    return createDefaultRevenueStore();
  }
}

export function recordLeadSmartConversion(
  input: {
    type: "call" | "form";
    payout: number;
    status?: string;
    city?: string;
    service?: string;
    page?: string;
    source?: "leadsmart_webhook" | "dashboard_simulation";
    timestamp?: string;
  },
  rootDir: string = process.cwd()
): { store: ClosedLoopRevenueStore; entry: RevenueLogEntry } {
  const store = readClosedLoopRevenueStore(rootDir);
  const timestamp = input.timestamp || new Date().toISOString();
  const dateKey = timestamp.slice(0, 10);

  const channel: "call" | "form" = input.type === "form" ? "form" : "call";
  const payout = Number(toFiniteNonNegative(input.payout).toFixed(2));
  const status = sanitizeText(input.status, 40, "sold").toLowerCase();
  const city = resolveCanonicalCity(input.city).label;
  const service = resolveCanonicalService(input.service).label;
  const page = normalizePagePath(input.page) ?? undefined;

  const isQualifiedSale =
    status !== "rejected" &&
    status !== "duplicate" &&
    status !== "unqualified" &&
    status !== "spam";

  const entry: RevenueLogEntry = {
    id: `ls-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`,
    timestamp,
    eventType: "conversion",
    channel,
    payout: isQualifiedSale ? payout : 0,
    status,
    city,
    service,
    ...(page ? { page } : {}),
    source: input.source ?? "leadsmart_webhook",
  };

  if (isQualifiedSale) {
    store.qualifiedLeads += 1;
    store.revenue = Number((store.revenue + payout).toFixed(2));
    if (channel === "call") {
      store.soldCalls += 1;
    } else {
      store.soldForms += 1;
    }
    store.dailyQualifiedLeads[dateKey] =
      (store.dailyQualifiedLeads[dateKey] ?? 0) + 1;
    store.dailyRevenue[dateKey] = Number(
      ((store.dailyRevenue[dateKey] ?? 0) + payout).toFixed(2)
    );
  }

  store.lastUpdated = timestamp;
  store.logs = [entry, ...store.logs].slice(0, MAX_REVENUE_LOGS);

  const filePath = resolveDataStorePath("revenue-store.json", rootDir);
  writeJsonAtomically(filePath, store);

  return { store, entry };
}

export function recordSiteIntent(
  input: {
    type: "call" | "form";
    city?: string;
    service?: string;
    page?: string;
    event?: string;
    timestamp?: string;
  },
  rootDir: string = process.cwd()
): { store: ClosedLoopRevenueStore; entry: RevenueLogEntry } {
  const store = readClosedLoopRevenueStore(rootDir);
  const timestamp = input.timestamp || new Date().toISOString();
  const channel: "call" | "form" = input.type === "form" ? "form" : "call";
  const page = normalizePagePath(input.page) ?? "/";

  const inferredService = input.service
    ? resolveCanonicalService(input.service).label
    : inferServiceFromPage(page);
  const inferredCity = input.city
    ? resolveCanonicalCity(input.city).label
    : inferCityFromPage(page);

  const entry: RevenueLogEntry = {
    id: `int-${Date.now().toString(36)}-${crypto.randomBytes(3).toString("hex")}`,
    timestamp,
    eventType: "intent",
    channel,
    payout: 0,
    status: sanitizeText(input.event, 48, `${channel}_intent`),
    city: inferredCity,
    service: inferredService,
    page,
    source: "site_intent",
  };

  if (channel === "call") {
    store.callIntents += 1;
  } else {
    store.formIntents += 1;
  }
  store.lastUpdated = timestamp;
  store.logs = [entry, ...store.logs].slice(0, MAX_REVENUE_LOGS);

  const filePath = resolveDataStorePath("revenue-store.json", rootDir);
  writeJsonAtomically(filePath, store);

  return { store, entry };
}

export function readGscPerformanceStore(
  rootDir: string = process.cwd()
): GscPerformanceStore {
  try {
    const filePath = resolveDataStorePath("gsc-store.json", rootDir);
    if (!fs.existsSync(filePath)) {
      return createDefaultGscStore();
    }
    const parsed = JSON.parse(
      fs.readFileSync(filePath, "utf-8")
    ) as Partial<GscPerformanceStore>;
    if (!parsed || typeof parsed !== "object") {
      return createDefaultGscStore();
    }
    const pages = Array.isArray(parsed.pages) ? parsed.pages : [];
    const totals = computeGscTotals(pages);
    return {
      lastSyncedAt:
        typeof parsed.lastSyncedAt === "string" ? parsed.lastSyncedAt : null,
      source: parsed.source ?? "none",
      totals,
      pages,
    };
  } catch {
    return createDefaultGscStore();
  }
}

export function normalizeCtrPercent(
  rawCtr: unknown,
  clicks: number,
  impressions: number
): number {
  const num = typeof rawCtr === "number" ? rawCtr : Number(rawCtr);
  if (Number.isFinite(num) && num >= 0) {
    // Handle Google Search Console API fractional CTR (0..1) vs percentage (0..100)
    if (num > 0 && num <= 1) {
      if (impressions > 0) {
        const computedPct = (clicks / impressions) * 100;
        // If fractional value * 100 is closer to computedPct than raw num, convert to %
        if (Math.abs(num * 100 - computedPct) <= Math.abs(num - computedPct)) {
          return Number((num * 100).toFixed(2));
        }
      } else {
        return Number((num * 100).toFixed(2));
      }
    }
    return Number(Math.min(100, num).toFixed(2));
  }
  if (impressions > 0) {
    return Number(((clicks / impressions) * 100).toFixed(2));
  }
  return 0;
}

export function computeGscTotals(pages: GscPageMetric[]): {
  clicks: number;
  impressions: number;
  avgCtr: number;
} {
  let clicks = 0;
  let impressions = 0;
  for (const page of pages) {
    clicks += Math.round(toFiniteNonNegative(page.clicks));
    impressions += Math.round(toFiniteNonNegative(page.impressions));
  }
  const avgCtr =
    impressions > 0 ? Number(((clicks / impressions) * 100).toFixed(2)) : 0;
  return { clicks, impressions, avgCtr };
}

export function saveGscPerformanceMetrics(
  rawPages: Array<{
    page: string;
    topQuery?: string;
    clicks?: number;
    impressions?: number;
    ctr?: number;
    position?: number;
  }>,
  source: GscPerformanceStore["source"] = "post_sync",
  rootDir: string = process.cwd(),
  options?: { mergeWithExisting?: boolean }
): GscPerformanceStore {
  const existing = options?.mergeWithExisting
    ? readGscPerformanceStore(rootDir)
    : createDefaultGscStore();

  const byPage = new Map<string, GscPageMetric>();
  for (const item of existing.pages) {
    byPage.set(item.page, item);
  }

  for (const raw of rawPages.slice(0, MAX_GSC_PAGES)) {
    const normalizedPath = normalizePagePath(raw.page);
    if (!normalizedPath) continue;

    const clicks = Math.round(toFiniteNonNegative(raw.clicks));
    const impressions = Math.round(toFiniteNonNegative(raw.impressions));
    const ctr = normalizeCtrPercent(raw.ctr, clicks, impressions);
    const position = Number(toFiniteNonNegative(raw.position).toFixed(1));
    const topQuery = sanitizeText(raw.topQuery, 140, "");

    byPage.set(normalizedPath, {
      page: normalizedPath,
      topQuery,
      clicks,
      impressions,
      ctr,
      position,
    });
  }

  const pages = Array.from(byPage.values())
    .sort((a, b) => b.impressions - a.impressions)
    .slice(0, MAX_GSC_PAGES);

  const store: GscPerformanceStore = {
    lastSyncedAt: new Date().toISOString(),
    source,
    totals: computeGscTotals(pages),
    pages,
  };

  const filePath = resolveDataStorePath("gsc-store.json", rootDir);
  writeJsonAtomically(filePath, store);
  return store;
}

export function readSeoOverridesStore(
  rootDir: string = process.cwd()
): SeoOverridesStore {
  try {
    const filePath = resolveDataStorePath("seo-overrides.json", rootDir);
    if (!fs.existsSync(filePath)) {
      return createDefaultSeoOverridesStore();
    }
    const parsed = JSON.parse(
      fs.readFileSync(filePath, "utf-8")
    ) as Partial<SeoOverridesStore>;
    if (!parsed || typeof parsed !== "object") {
      return createDefaultSeoOverridesStore();
    }
    return {
      lastOptimizedAt:
        typeof parsed.lastOptimizedAt === "string"
          ? parsed.lastOptimizedAt
          : null,
      pages:
        parsed.pages && typeof parsed.pages === "object" ? parsed.pages : {},
      topServices: Array.isArray(parsed.topServices) ? parsed.topServices : [],
      topCities: Array.isArray(parsed.topCities) ? parsed.topCities : [],
      trendingHighlight: parsed.trendingHighlight ?? null,
    };
  } catch {
    return createDefaultSeoOverridesStore();
  }
}

/**
 * Safely reads an auto-optimized page title/description override from
 * `data/seo-overrides.json`, returning null if none exists so `generateMetadata`
 * falls back cleanly to default page metadata.
 */
export function getPageSeoOverride(
  pagePath: string,
  rootDir: string = process.cwd()
): PageSeoOverride | null {
  const normalized = normalizePagePath(pagePath);
  if (!normalized) return null;
  const store = readSeoOverridesStore(rootDir);
  return store.pages[normalized] ?? null;
}

export function getTrendingServiceHighlight(
  rootDir: string = process.cwd()
): TrendingServiceHighlight | null {
  const store = readSeoOverridesStore(rootDir);
  return store.trendingHighlight;
}

function titleCase(input: string): string {
  return input
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      if (word.toUpperCase() === "TX" || word.toUpperCase() === "AC") {
        return word.toUpperCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(" ");
}

export function resolveCanonicalService(raw?: string): {
  label: string;
  slug: string;
} {
  const cleaned = sanitizeText(raw, 80, "Emergency Plumbing").toLowerCase();
  for (const [key, value] of Object.entries(KNOWN_SERVICE_SLUGS)) {
    if (cleaned.includes(key) || cleaned.includes(value.slug)) {
      return value;
    }
  }
  if (cleaned.includes("sewer")) return KNOWN_SERVICE_SLUGS["sewer line repair"];
  if (cleaned.includes("water heater") || cleaned.includes("hot water")) {
    return KNOWN_SERVICE_SLUGS["water heater repair"];
  }
  if (cleaned.includes("drain") || cleaned.includes("clog")) {
    return KNOWN_SERVICE_SLUGS["drain cleaning"];
  }
  if (cleaned.includes("leak") || cleaned.includes("slab")) {
    return KNOWN_SERVICE_SLUGS["leak detection"];
  }
  if (cleaned.includes("pipe") || cleaned.includes("burst")) {
    return KNOWN_SERVICE_SLUGS["pipe repair"];
  }
  return KNOWN_SERVICE_SLUGS["emergency plumbing"];
}

export function resolveCanonicalCity(raw?: string): {
  label: string;
  slug: string;
} {
  const cleaned = sanitizeText(raw, 60, "Houston").toLowerCase();
  for (const [key, value] of Object.entries(KNOWN_CITY_SLUGS)) {
    if (cleaned.includes(key) || cleaned.includes(value.slug)) {
      return value;
    }
  }
  return KNOWN_CITY_SLUGS.houston;
}

function inferServiceFromPage(pagePath: string): string {
  const lower = pagePath.toLowerCase();
  for (const value of Object.values(KNOWN_SERVICE_SLUGS)) {
    if (lower.includes(value.slug)) {
      return value.label;
    }
  }
  return "Emergency Plumbing";
}

function inferCityFromPage(pagePath: string): string {
  const lower = pagePath.toLowerCase();
  for (const value of Object.values(KNOWN_CITY_SLUGS)) {
    if (value.slug !== "houston" && lower.includes(value.slug)) {
      return value.label;
    }
  }
  return "Houston";
}

/**
 * Generates an upgraded, high-CTR emergency Houston plumbing Meta Title &
 * Meta Description template for pages with impressions > 100 and CTR < 2.5%.
 */
export function buildHighCtrPlumbingMetadata(metric: GscPageMetric): {
  title: string;
  description: string;
} {
  const serviceLabel = inferServiceFromPage(metric.page);
  const cityLabel = inferCityFromPage(metric.page);
  const cleanQuery = sanitizeText(metric.topQuery, 70, "");

  const cityPattern = new RegExp(
    `\\b(${cityLabel.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}|houston|tx|texas|near me|cost)\\b`,
    "gi"
  );
  const strippedQuery = cleanQuery
    .replace(cityPattern, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  const queryTitle = strippedQuery ? titleCase(strippedQuery) : serviceLabel;

  const focusTopic =
    queryTitle && queryTitle.length >= 6 && queryTitle.length <= 26
      ? queryTitle
      : serviceLabel;

  let title = `Urgent ${focusTopic} in ${cityLabel}, TX | Fast Help`;
  if (title.length > 68) {
    title = `Urgent ${serviceLabel} in ${cityLabel}, TX | Fast Help`;
  }
  if (title.length > 68) {
    title = `${serviceLabel} in ${cityLabel}, TX | PipeResque`;
  }

  const description = `Need fast ${focusTopic.toLowerCase()} in ${cityLabel}, TX? Call (877) 587-3986 now to connect with independent local Houston-area plumbers for urgent repairs & free estimates.`;

  return {
    title: sanitizeText(title, 68, `Emergency ${serviceLabel} in ${cityLabel}, TX`),
    description: sanitizeText(
      description,
      165,
      `Need ${serviceLabel.toLowerCase()} in ${cityLabel}, TX? Call (877) 587-3986 to connect with independent local plumbing professionals.`
    ),
  };
}

/**
 * Loads effective GSC page metrics: prefers `data/gsc-store.json`, and if empty
 * seeds from persisted local Search Console query cache (`content/growth/cache/`)
 * without fabricating any rows.
 */
export function loadEffectiveGscPages(
  rootDir: string = process.cwd()
): { store: GscPerformanceStore; seededFromCache: boolean } {
  const current = readGscPerformanceStore(rootDir);
  if (current.pages.length > 0) {
    return { store: current, seededFromCache: false };
  }

  const cached = readGscRowsFromDataStores(rootDir);
  if (!cached || cached.rows.length === 0) {
    return { store: current, seededFromCache: false };
  }

  const byPage = new Map<
    string,
    {
      page: string;
      topQuery: string;
      topQueryImpressions: number;
      clicks: number;
      impressions: number;
      weightedPos: number;
    }
  >();

  for (const row of cached.rows) {
    const pagePath = normalizePagePath(row.page);
    if (!pagePath) continue;
    const impressions = Math.round(toFiniteNonNegative(row.impressions));
    const clicks = Math.round(toFiniteNonNegative(row.clicks));
    const position = toFiniteNonNegative(row.position);
    const existing = byPage.get(pagePath);

    if (!existing) {
      byPage.set(pagePath, {
        page: pagePath,
        topQuery: sanitizeText(row.query, 140, ""),
        topQueryImpressions: impressions,
        clicks,
        impressions,
        weightedPos: position * Math.max(1, impressions),
      });
    } else {
      existing.clicks += clicks;
      existing.impressions += impressions;
      existing.weightedPos += position * Math.max(1, impressions);
      if (impressions > existing.topQueryImpressions && row.query) {
        existing.topQuery = sanitizeText(row.query, 140, existing.topQuery);
        existing.topQueryImpressions = impressions;
      }
    }
  }

  const aggregated: GscPageMetric[] = Array.from(byPage.values()).map((entry) => ({
    page: entry.page,
    topQuery: entry.topQuery,
    clicks: entry.clicks,
    impressions: entry.impressions,
    ctr:
      entry.impressions > 0
        ? Number(((entry.clicks / entry.impressions) * 100).toFixed(2))
        : 0,
    position:
      entry.impressions > 0
        ? Number((entry.weightedPos / entry.impressions).toFixed(1))
        : 0,
  }));

  if (aggregated.length === 0) {
    return { store: current, seededFromCache: false };
  }

  const saved = saveGscPerformanceMetrics(aggregated, "local_cache", rootDir);
  return { store: saved, seededFromCache: true };
}

/**
 * Closed-loop auto-optimizer:
 * 1. Analyzes `data/gsc-store.json` (seeding from persisted local GSC cache if empty).
 *    Any page with `impressions > 100` and `ctr < 2.5%` receives an upgraded
 *    high-CTR emergency Houston plumbing Meta Title & Description in `data/seo-overrides.json`.
 * 2. Analyzes `data/revenue-store.json` to identify the top-converting plumbing
 *    service & Houston area and updates `trendingHighlight` for the homepage hero
 *    and sticky call bar.
 */
export function runSiteAutoOptimizer(
  rootDir: string = process.cwd()
): {
  overrides: SeoOverridesStore;
  gscStore: GscPerformanceStore;
  revenueStore: ClosedLoopRevenueStore;
  optimizedPageCount: number;
  optimizedPages: PageSeoOverride[];
} {
  const { store: gscStore } = loadEffectiveGscPages(rootDir);
  const revenueStore = readClosedLoopRevenueStore(rootDir);
  const existingOverrides = readSeoOverridesStore(rootDir);
  const nowIso = new Date().toISOString();

  const updatedPages: Record<string, PageSeoOverride> = {
    ...existingOverrides.pages,
  };
  const newlyOptimized: PageSeoOverride[] = [];

  for (const metric of gscStore.pages) {
    if (metric.impressions > 100 && metric.ctr < 2.5) {
      const upgraded = buildHighCtrPlumbingMetadata(metric);
      const override: PageSeoOverride = {
        page: metric.page,
        title: upgraded.title,
        description: upgraded.description,
        topQuery: metric.topQuery,
        previousCtr: metric.ctr,
        impressions: metric.impressions,
        position: metric.position,
        optimizedAt: nowIso,
      };
      updatedPages[metric.page] = override;
      newlyOptimized.push(override);
    }
  }

  // Analyze revenue-store.json conversions first, falling back to intent logs
  const conversionLogs = revenueStore.logs.filter(
    (entry) => entry.eventType === "conversion" && entry.status !== "rejected"
  );
  const analysisPool =
    conversionLogs.length > 0 ? conversionLogs : revenueStore.logs;

  const serviceStats = new Map<
    string,
    { service: string; conversions: number; revenue: number }
  >();
  const cityStats = new Map<
    string,
    { city: string; conversions: number; revenue: number }
  >();

  for (const log of analysisPool) {
    const canonicalService = resolveCanonicalService(log.service).label;
    const canonicalCity = resolveCanonicalCity(log.city).label;
    const weight = log.eventType === "conversion" ? 1 : 1;

    const svc = serviceStats.get(canonicalService) ?? {
      service: canonicalService,
      conversions: 0,
      revenue: 0,
    };
    svc.conversions += weight;
    svc.revenue = Number((svc.revenue + (log.payout || 0)).toFixed(2));
    serviceStats.set(canonicalService, svc);

    const city = cityStats.get(canonicalCity) ?? {
      city: canonicalCity,
      conversions: 0,
      revenue: 0,
    };
    city.conversions += weight;
    city.revenue = Number((city.revenue + (log.payout || 0)).toFixed(2));
    cityStats.set(canonicalCity, city);
  }

  const topServices = Array.from(serviceStats.values())
    .sort((a, b) => b.revenue - a.revenue || b.conversions - a.conversions)
    .slice(0, 5);

  const topCities = Array.from(cityStats.values())
    .sort((a, b) => b.revenue - a.revenue || b.conversions - a.conversions)
    .slice(0, 5);

  let trendingHighlight: TrendingServiceHighlight | null =
    existingOverrides.trendingHighlight;

  if (topServices.length > 0) {
    const winningService = resolveCanonicalService(topServices[0].service);
    const winningCity = resolveCanonicalCity(topCities[0]?.city ?? "Houston");
    trendingHighlight = {
      service: winningService.label,
      serviceSlug: winningService.slug,
      city: winningCity.label,
      citySlug: winningCity.slug,
      conversions: topServices[0].conversions,
      revenue: topServices[0].revenue,
      badgeText: `Trending in ${winningCity.label}: ${winningService.label}`,
      updatedAt: nowIso,
    };
  }

  const nextOverrides: SeoOverridesStore = {
    lastOptimizedAt: nowIso,
    pages: updatedPages,
    topServices,
    topCities,
    trendingHighlight,
  };

  const filePath = resolveDataStorePath("seo-overrides.json", rootDir);
  writeJsonAtomically(filePath, nextOverrides);

  return {
    overrides: nextOverrides,
    gscStore,
    revenueStore,
    optimizedPageCount: newlyOptimized.length,
    optimizedPages: newlyOptimized,
  };
}
