import fs from "node:fs";
import path from "node:path";
import {
  DEFAULT_GSC_SITE_URL,
  DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH,
  GoogleSearchConsoleService,
  classifyRankingTier,
  extractPagePath,
  selectTopHighImpressionLowCtrQueries,
  type GscTopQueriesStore,
  type LowCtrQueryOpportunity,
  type RawGscQueryRow,
} from "@/lib/services/gsc-service";

export {
  classifyRankingTier,
  extractPagePath,
  selectTopHighImpressionLowCtrQueries,
  type LowCtrQueryOpportunity,
  type RawGscQueryRow,
};

export interface GscOpportunitiesSummaryResult {
  status: "LIVE" | "CACHED_STORE" | "NOT_CONFIGURED" | "ERROR";
  sourceLabel: string;
  storeFile: string;
  asOfDate: string | null;
  totalQueriesAnalyzed: number;
  queries: LowCtrQueryOpportunity[];
  message?: string;
}

interface StoredGscPayload {
  asOfDate: string | null;
  rows: RawGscQueryRow[];
  storeFile: string;
  isLiveCache: boolean;
}

/**
 * Reads the dedicated top-queries JSON store (`content/growth/gsc-top-queries.json`)
 * if it contains freshly stored live queries.
 */
function readTopQueriesStore(
  rootDir: string,
  limit: number
): GscOpportunitiesSummaryResult | null {
  const storePath = path.resolve(
    rootDir,
    DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH
  );
  if (!fs.existsSync(storePath)) return null;

  try {
    const parsed = JSON.parse(
      fs.readFileSync(storePath, "utf-8")
    ) as Partial<GscTopQueriesStore>;

    if (
      parsed.status === "LIVE" &&
      Array.isArray(parsed.queries) &&
      parsed.queries.length > 0
    ) {
      return {
        status: "LIVE",
        sourceLabel: "GSC API Store",
        storeFile: DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH,
        asOfDate: parsed.asOfDate ?? null,
        totalQueriesAnalyzed:
          typeof parsed.totalQueriesAnalyzed === "number"
            ? parsed.totalQueriesAnalyzed
            : parsed.queries.length,
        queries: parsed.queries.slice(0, limit),
      };
    }
  } catch {
    // Ignore invalid JSON and fall through to other stores
  }

  return null;
}

/**
 * Reads persisted Search Console query rows from the local growth data stores.
 */
export function readGscRowsFromDataStores(
  rootDir: string = process.cwd()
): StoredGscPayload | null {
  const cacheDir = path.resolve(rootDir, "content/growth/cache");
  if (fs.existsSync(cacheDir)) {
    const cacheFiles = fs
      .readdirSync(cacheDir)
      .filter((f) => f.startsWith("gsc_") && f.endsWith(".json"))
      .sort()
      .reverse();

    // 1. Prefer any cached live GSC API snapshot first
    for (const fileName of cacheFiles) {
      try {
        const parsed = JSON.parse(
          fs.readFileSync(path.join(cacheDir, fileName), "utf-8")
        ) as {
          data?: {
            status?: string;
            source?: string;
            asOfDate?: string;
            rows?: RawGscQueryRow[];
          };
        };
        if (
          parsed.data?.status === "LIVE" &&
          Array.isArray(parsed.data.rows) &&
          parsed.data.rows.length > 0
        ) {
          return {
            asOfDate: parsed.data.asOfDate ?? null,
            rows: parsed.data.rows,
            storeFile: `content/growth/cache/${fileName}`,
            isLiveCache: true,
          };
        }
      } catch {
        // Skip unreadable cache file
      }
    }

    // 2. Fall back to persisted GSC query cache store (e.g., gsc_latest_latest_query_page.json)
    for (const fileName of cacheFiles) {
      try {
        const parsed = JSON.parse(
          fs.readFileSync(path.join(cacheDir, fileName), "utf-8")
        ) as {
          data?: {
            asOfDate?: string;
            rows?: RawGscQueryRow[];
          };
        };
        if (Array.isArray(parsed.data?.rows) && parsed.data.rows.length > 0) {
          return {
            asOfDate: parsed.data.asOfDate ?? null,
            rows: parsed.data.rows,
            storeFile: `content/growth/cache/${fileName}`,
            isLiveCache: false,
          };
        }
      } catch {
        // Skip unreadable cache file
      }
    }
  }

  // 3. Check performance-store.json for stored GSC snapshot rows
  const perfStorePath = path.resolve(
    rootDir,
    "content/growth/performance-store.json"
  );
  if (fs.existsSync(perfStorePath)) {
    try {
      const perf = JSON.parse(fs.readFileSync(perfStorePath, "utf-8")) as {
        lastCycleAt?: string | null;
        gscRows?: RawGscQueryRow[];
        dailySnapshots?: Array<{ date?: string; gscRows?: RawGscQueryRow[] }>;
      };
      if (Array.isArray(perf.gscRows) && perf.gscRows.length > 0) {
        return {
          asOfDate: perf.lastCycleAt ? perf.lastCycleAt.split("T")[0] : null,
          rows: perf.gscRows,
          storeFile: "content/growth/performance-store.json",
          isLiveCache: false,
        };
      }
      const latestWithRows = [...(perf.dailySnapshots ?? [])]
        .reverse()
        .find((s) => Array.isArray(s.gscRows) && s.gscRows.length > 0);
      if (latestWithRows?.gscRows) {
        return {
          asOfDate: latestWithRows.date ?? null,
          rows: latestWithRows.gscRows,
          storeFile: "content/growth/performance-store.json",
          isLiveCache: false,
        };
      }
    } catch {
      // Ignore parse errors
    }
  }

  return null;
}

/**
 * Loads the top N high-impression / low-CTR queries using GoogleSearchConsoleService
 * (caching results in content/growth/gsc-top-queries.json) when configured and
 * falling back transparently to persisted data stores in content/growth/.
 */
export async function loadTopLowCtrQueries(
  limit = 3,
  options?: { rootDir?: string; skipLiveApi?: boolean }
): Promise<GscOpportunitiesSummaryResult> {
  const rootDir = options?.rootDir ?? process.cwd();
  const growthDir = path.resolve(rootDir, "content/growth");
  const topStorePath = path.resolve(
    rootDir,
    DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH
  );
  const clientEmail = process.env.GSC_CLIENT_EMAIL;
  const privateKey = process.env.GSC_PRIVATE_KEY;
  const siteUrl = process.env.GSC_SITE_URL || DEFAULT_GSC_SITE_URL;

  // Reuse freshly written gsc-top-queries.json if under 6 hours old
  if (fs.existsSync(topStorePath)) {
    try {
      const cached = JSON.parse(
        fs.readFileSync(topStorePath, "utf-8")
      ) as Partial<GscTopQueriesStore>;
      const ageHours = cached.updatedAt
        ? (Date.now() - new Date(cached.updatedAt).getTime()) / (1000 * 60 * 60)
        : Infinity;
      if (
        ageHours < 6 &&
        cached.status === "LIVE" &&
        Array.isArray(cached.queries) &&
        cached.queries.length > 0
      ) {
        return {
          status: "LIVE",
          sourceLabel: "GSC API (Live)",
          storeFile: DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH,
          asOfDate: cached.asOfDate ?? null,
          totalQueriesAnalyzed:
            cached.totalQueriesAnalyzed ?? cached.queries.length,
          queries: cached.queries.slice(0, limit),
        };
      }
    } catch {
      // Proceed to refresh or fallback stores
    }
  }

  let liveApiError: string | undefined;

  if (!options?.skipLiveApi && clientEmail && privateKey) {
    try {
      const gscService = new GoogleSearchConsoleService({
        clientEmail,
        privateKey,
        siteUrl,
      });
      const result = await gscService.fetchAndStoreTopLowCtrQueries({
        limit,
        storePath: topStorePath,
        allowedBaseDir: growthDir,
      });

      if (result.success && result.data.queries.length > 0) {
        return {
          status: "LIVE",
          sourceLabel: "GSC API (Live)",
          storeFile: DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH,
          asOfDate: result.data.asOfDate,
          totalQueriesAnalyzed: result.data.totalQueriesAnalyzed,
          queries: result.data.queries,
        };
      }

      if (!result.success && result.error) {
        liveApiError = result.error;
      }
    } catch (err) {
      liveApiError =
        err instanceof Error ? err.message : "Live GSC fetch failed";
    }
  }

  // Fallback 1: previously stored live top queries in gsc-top-queries.json
  const storedTop = readTopQueriesStore(rootDir, limit);
  if (storedTop) {
    return {
      ...storedTop,
      message: liveApiError
        ? "Showing stored Search Console data while live API refresh is unavailable."
        : undefined,
    };
  }

  // Fallback 2: persisted GSC cache or performance store rows
  const stored = readGscRowsFromDataStores(rootDir);
  if (stored && stored.rows.length > 0) {
    return {
      status: stored.isLiveCache ? "LIVE" : "CACHED_STORE",
      sourceLabel: stored.isLiveCache ? "GSC API Cache" : "Growth Data Store",
      storeFile: stored.storeFile,
      asOfDate: stored.asOfDate,
      totalQueriesAnalyzed: stored.rows.length,
      queries: selectTopHighImpressionLowCtrQueries(stored.rows, limit),
      message: liveApiError
        ? "Showing stored Search Console data while live API refresh is unavailable."
        : undefined,
    };
  }

  return {
    status: clientEmail && privateKey ? "ERROR" : "NOT_CONFIGURED",
    sourceLabel: clientEmail && privateKey ? "GSC API Error" : "Not Configured",
    storeFile: DEFAULT_TOP_QUERIES_STORE_RELATIVE_PATH,
    asOfDate: null,
    totalQueriesAnalyzed: 0,
    queries: [],
    message:
      liveApiError ||
      "No Search Console query data found in live API or content/growth data stores.",
  };
}
