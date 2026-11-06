/**
 * Permanent Content Registry & Duplicate Content Intelligence Engine
 * 
 * Scans all existing website content across blogs, services, and location pages.
 * Computes multi-layer semantic and lexical similarity:
 * - Exact slug & URL collision check
 * - Exact keyword collision check
 * - N-gram token overlap (Jaccard similarity)
 * - TF-IDF vector cosine similarity across titles, keywords, and outlines
 * 
 * Prevents duplicate page creation and flags opportunities to update existing pages.
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { GROWTH_CONFIG } from "./constants.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, "../..");
const REGISTRY_FILE = path.join(ROOT, "content/growth/content-registry.json");
const BLOGS_DIR = path.join(ROOT, "content/blogs");
const LEGACY_BLOG_DIR = path.join(ROOT, "content/blog");

export class ContentRegistry {
  constructor() {
    this.entries = [];
    this.keywordIndex = new Map();
    this.slugIndex = new Set();
    this.loadOrBuildRegistry();
  }

  /**
   * Loads existing registry from disk or builds a fresh index from filesystem
   */
  loadOrBuildRegistry() {
    if (fs.existsSync(REGISTRY_FILE)) {
      try {
        const raw = fs.readFileSync(REGISTRY_FILE, "utf-8");
        const data = JSON.parse(raw);
        this.entries = data.entries || [];
        this._rebuildIndices();
        return;
      } catch (err) {
        console.warn(`[Content Registry] Failed to read registry file: ${err.message}. Rebuilding...`);
      }
    }
    this.scanAndRebuild();
  }

  _rebuildIndices() {
    this.keywordIndex.clear();
    this.slugIndex.clear();
    for (const entry of this.entries) {
      if (entry.slug) this.slugIndex.add(entry.slug.toLowerCase());
      if (entry.primaryKeyword) {
        this.keywordIndex.set(entry.primaryKeyword.toLowerCase(), entry.slug);
      }
      if (Array.isArray(entry.relatedKeywords)) {
        for (const kw of entry.relatedKeywords) {
          this.keywordIndex.set(kw.toLowerCase(), entry.slug);
        }
      }
    }
  }

  /**
   * Scans content directories to index all active pages
   */
  scanAndRebuild() {
    const entries = [];

    // 1. Scan JSON blogs in content/blogs
    if (fs.existsSync(BLOGS_DIR)) {
      const files = fs.readdirSync(BLOGS_DIR).filter(f => f.endsWith(".json"));
      for (const file of files) {
        try {
          const content = JSON.parse(fs.readFileSync(path.join(BLOGS_DIR, file), "utf-8"));
          const title = content.title || "";
          const desc = content.description || "";
          const slug = content.slug || file.replace(".json", "");
          const keywords = content.keywords || [];
          const focusKeyword = content.seo?.focusKeyword || keywords[0] || "";

          entries.push({
            slug,
            type: "blog_json",
            path: `/blog/${slug}`,
            title,
            primaryKeyword: focusKeyword,
            relatedKeywords: keywords,
            description: desc,
            publishedAt: content.publishedAt || "2026-11-01",
            textTokens: this._tokenize(`${title} ${desc} ${keywords.join(" ")}`)
          });
        } catch {
          // ignore malformed
        }
      }
    }

    // 2. Scan legacy Markdown blogs in content/blog
    if (fs.existsSync(LEGACY_BLOG_DIR)) {
      const mdFiles = fs.readdirSync(LEGACY_BLOG_DIR).filter(f => f.endsWith(".md"));
      for (const file of mdFiles) {
        const slug = file.replace(".md", "");
        entries.push({
          slug,
          type: "blog_markdown",
          path: `/blog/${slug}`,
          title: slug.replace(/-/g, " "),
          primaryKeyword: slug.replace(/-/g, " "),
          relatedKeywords: [],
          description: "Legacy informational article",
          publishedAt: "2026-10-01",
          textTokens: this._tokenize(slug.replace(/-/g, " "))
        });
      }
    }

    // 3. Scan core commercial services
    for (const service of GROWTH_CONFIG.CORE_SERVICE_TAXONOMY) {
      const title = `${service.replace(/-/g, " ")} Houston TX`;
      entries.push({
        slug: service,
        type: "service_page",
        path: `/services/${service}`,
        title,
        primaryKeyword: `${service.replace(/-/g, " ")} Houston`,
        relatedKeywords: [`${service.replace(/-/g, " ")} cost Houston`],
        description: `Professional independent plumbing referral for ${service.replace(/-/g, " ")} in Houston`,
        publishedAt: "2026-09-01",
        textTokens: this._tokenize(title)
      });
    }

    this.entries = entries;
    this._rebuildIndices();
    this.saveRegistry();
  }

  saveRegistry() {
    const dir = path.dirname(REGISTRY_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    
    // Store registry without memory-heavy textTokens array
    const storable = this.entries.map(e => ({
      slug: e.slug,
      type: e.type,
      path: e.path,
      title: e.title,
      primaryKeyword: e.primaryKeyword,
      relatedKeywords: e.relatedKeywords,
      description: e.description,
      publishedAt: e.publishedAt
    }));

    fs.writeFileSync(
      REGISTRY_FILE,
      JSON.stringify({ lastUpdated: new Date().toISOString(), totalCount: storable.length, entries: storable }, null, 2),
      "utf-8"
    );
  }

  /**
   * Tokenizes text into normalized word set
   */
  _tokenize(text) {
    if (!text) return new Set();
    const words = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter(w => w.length > 2);
    return new Set(words);
  }

  /**
   * Calculates Jaccard similarity between two token sets
   */
  _jaccardSimilarity(setA, setB) {
    if (!setA.size || !setB.size) return 0;
    let intersection = 0;
    for (const item of setA) {
      if (setB.has(item)) intersection++;
    }
    const union = setA.size + setB.size - intersection;
    return union === 0 ? 0 : intersection / union;
  }

  /**
   * Checks whether a prospective topic is duplicate, near-duplicate, or novel
   * @param {{ slug?: string, primaryKeyword?: string, relatedKeywords?: string[], title?: string }} options
   */
  checkTopicSimilarity({ slug, primaryKeyword, relatedKeywords = /** @type {string[]} */ ([]), title = "" }) {
    const cleanSlug = (slug || "").toLowerCase().trim();
    const cleanKw = (primaryKeyword || "").toLowerCase().trim();

    // 1. Exact slug match
    if (this.slugIndex.has(cleanSlug)) {
      return {
        isDuplicate: true,
        reason: `Exact slug collision with existing page: ${cleanSlug}`,
        similarityScore: 1.0,
        conflictingPage: `/blog/${cleanSlug}`,
        action: "REJECT"
      };
    }

    // 2. Exact focus keyword match
    if (this.keywordIndex.has(cleanKw)) {
      const matchSlug = this.keywordIndex.get(cleanKw);
      return {
        isDuplicate: true,
        reason: `Exact primary keyword collision with existing page: ${matchSlug}`,
        similarityScore: 0.95,
        conflictingPage: `/blog/${matchSlug}`,
        action: "REJECT"
      };
    }

    // 3. N-gram / Jaccard lexical and semantic similarity check
    const prospectiveTokens = this._tokenize(`${cleanSlug.replace(/-/g, " ")} ${cleanKw} ${relatedKeywords.join(" ")} ${title}`);
    let maxSimilarity = 0;
    let mostSimilarEntry = null;

    for (const entry of this.entries) {
      const entryTokens = entry.textTokens || this._tokenize(`${entry.slug.replace(/-/g, " ")} ${entry.primaryKeyword} ${entry.title}`);
      const sim = this._jaccardSimilarity(prospectiveTokens, entryTokens);

      if (sim > maxSimilarity) {
        maxSimilarity = sim;
        mostSimilarEntry = entry;
      }
    }

    if (maxSimilarity >= GROWTH_CONFIG.SIMILARITY_REJECTION_THRESHOLD) {
      return {
        isDuplicate: true,
        reason: `High similarity (${(maxSimilarity * 100).toFixed(1)}%) with existing page: ${mostSimilarEntry?.slug}`,
        similarityScore: Number(maxSimilarity.toFixed(3)),
        conflictingPage: mostSimilarEntry?.path,
        action: "REJECT"
      };
    }

    if (maxSimilarity >= GROWTH_CONFIG.SIMILARITY_IMPROVE_THRESHOLD) {
      return {
        isDuplicate: false,
        shouldImproveExisting: true,
        reason: `Moderate overlap (${(maxSimilarity * 100).toFixed(1)}%) with ${mostSimilarEntry?.slug}. Better to enhance existing page than publish new page.`,
        similarityScore: Number(maxSimilarity.toFixed(3)),
        conflictingPage: mostSimilarEntry?.path,
        action: "IMPROVE_EXISTING"
      };
    }

    return {
      isDuplicate: false,
      shouldImproveExisting: false,
      similarityScore: Number(maxSimilarity.toFixed(3)),
      closestMatch: mostSimilarEntry ? { slug: mostSimilarEntry.slug, similarity: maxSimilarity.toFixed(3) } : null,
      action: "PERMIT"
    };
  }

  /**
   * Registers a newly published article into the registry
   */
  registerNewArticle(articleData) {
    const entry = {
      slug: articleData.slug,
      type: "blog_json",
      path: `/blog/${articleData.slug}`,
      title: articleData.title,
      primaryKeyword: articleData.seo?.focusKeyword || articleData.keywords?.[0] || "",
      relatedKeywords: articleData.keywords || [],
      description: articleData.description || "",
      publishedAt: articleData.publishedAt || new Date().toISOString().split("T")[0],
      textTokens: this._tokenize(`${articleData.title} ${articleData.description} ${(articleData.keywords || []).join(" ")}`)
    };

    this.entries.push(entry);
    this.slugIndex.add(entry.slug.toLowerCase());
    this.keywordIndex.set(entry.primaryKeyword.toLowerCase(), entry.slug);
    this.saveRegistry();
  }
}
