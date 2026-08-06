import fs from "node:fs/promises";
import path from "node:path";

import config from "../../shared/config.mjs";
import {
  KEYWORDS_DIR,
  OUTPUT_DIR,
} from "../../shared/paths.mjs";

import {
  ensureDirectory,
  readJson,
  writeJson,
  exists,
} from "../../shared/file-system.mjs";

import logger from "../../shared/logger.mjs";

import {
  describeFailures,
  runBatch,
  throwIfFailed,
} from "../../shared/batch.mjs";

import { formatError } from "../../shared/errors.mjs";

const DEFAULT_INTENT = "informational";

const DEFAULT_LANGUAGE = "en";

const DEFAULT_COUNTRY = "US";

const DEFAULT_SEARCH_VOLUME = 0;

const DEFAULT_DIFFICULTY = 0;

const DEFAULT_CPC = 0;

export class KeywordResearchEngine {
  constructor(options = {}) {
    this.options = {
      language: options.language ?? DEFAULT_LANGUAGE,
      country: options.country ?? DEFAULT_COUNTRY,
      cache: options.cache ?? true,
      saveOutput: options.saveOutput ?? true,
      ...options,
    };

    ensureDirectory(KEYWORDS_DIR);
    ensureDirectory(OUTPUT_DIR);
  }

  normalizeKeyword(keyword) {
    return keyword
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");
  }

  slug(keyword) {
    return this.normalizeKeyword(keyword)
      .replace(/[^a-z0-9 ]/g, "")
      .replace(/\s+/g, "-");
  }

  cacheFile(keyword) {
    return path.join(
      KEYWORDS_DIR,
      `${this.slug(keyword)}.json`
    );
  }

  outputFile(keyword) {
    return path.join(
      OUTPUT_DIR,
      `${this.slug(keyword)}-research.json`
    );
  }

  loadCache(keyword) {
    const file = this.cacheFile(keyword);

    if (!exists(file)) {
      return null;
    }

    try {
      return readJson(file);
    } catch (error) {
      logger.warning(
        `Ignoring unreadable keyword cache: ${file} (${formatError(error)})`
      );

      return null;
    }
  }

  saveCache(keyword, data) {
    writeJson(this.cacheFile(keyword), data);
  }

  async saveOutput(keyword, data) {
    await fs.writeFile(
      this.outputFile(keyword),
      JSON.stringify(data, null, 2),
      "utf8"
    );
  }

  createKeywordRecord(keyword) {
    return {
      keyword,

      slug: this.slug(keyword),

      intent: DEFAULT_INTENT,

      language: this.options.language,

      country: this.options.country,

      searchVolume: DEFAULT_SEARCH_VOLUME,

      keywordDifficulty: DEFAULT_DIFFICULTY,

      cpc: DEFAULT_CPC,

      competition: "unknown",

      relatedKeywords: [],

      questions: [],

      entities: [],

      topics: [],

      generatedAt: new Date().toISOString(),
    };
  }

  detectIntent(keyword) {
    const value = keyword.toLowerCase();

    const rules = [
      {
        intent: "transactional",
        keywords: [
          "buy",
          "price",
          "cost",
          "repair",
          "service",
          "company",
          "near me",
          "emergency",
          "24/7",
          "same day",
          "quote",
          "estimate",
        ],
      },
      {
        intent: "commercial",
        keywords: [
          "best",
          "top",
          "vs",
          "comparison",
          "reviews",
          "rating",
        ],
      },
      {
        intent: "navigational",
        keywords: [
          "website",
          "phone",
          "address",
          "location",
          "hours",
        ],
      },
    ];

    for (const rule of rules) {
      if (rule.keywords.some((word) => value.includes(word))) {
        return rule.intent;
      }
    }

    return DEFAULT_INTENT;
  }

  generateRelatedKeywords(keyword) {
    const suffixes = [
      "near me",
      "cost",
      "price",
      "company",
      "services",
      "repair",
      "replacement",
      "installation",
      "emergency",
      "24 hour",
      "same day",
      "licensed",
      "commercial",
      "residential",
      "maintenance",
    ];

    return [...new Set(
      suffixes.map((suffix) => `${keyword} ${suffix}`)
    )];
  }

  generateQuestions(keyword) {
    return [
      `What is ${keyword}?`,
      `How much does ${keyword} cost?`,
      `How long does ${keyword} take?`,
      `Who offers ${keyword}?`,
      `Is ${keyword} worth it?`,
      `Can I schedule ${keyword} today?`,
      `When should I get ${keyword}?`,
      `Why is ${keyword} important?`,
    ];
  }

  extractEntities(keyword) {
    const entities = [];

    const words = keyword
      .split(/\s+/)
      .filter(Boolean);

    for (const word of words) {
      if (word.length >= 3) {
        entities.push(word);
      }
    }

    return [...new Set(entities)];
  }

  buildTopicalMap(keyword) {
    return {
      primary: keyword,
      secondary: this.generateRelatedKeywords(keyword),
      entities: this.extractEntities(keyword),
      faq: this.generateQuestions(keyword),
    };
  }

  enrichKeyword(record) {
    record.intent = this.detectIntent(record.keyword);

    record.relatedKeywords =
      this.generateRelatedKeywords(record.keyword);

    record.questions =
      this.generateQuestions(record.keyword);

    record.entities =
      this.extractEntities(record.keyword);

    record.topics =
      this.buildTopicalMap(record.keyword);

    return record;
  }
    estimateSearchVolume(keyword) {
    const words = keyword.trim().split(/\s+/).length;

    let score = 250;

    if (keyword.includes("near me")) score += 1200;
    if (keyword.includes("emergency")) score += 1800;
    if (keyword.includes("repair")) score += 900;
    if (keyword.includes("service")) score += 700;
    if (keyword.includes("replacement")) score += 500;
    if (keyword.includes("installation")) score += 450;
    if (keyword.includes("cost")) score += 400;
    if (keyword.includes("price")) score += 350;
    if (keyword.includes("houston")) score += 650;

    score -= words * 60;

    return Math.max(50, score);
  }

  estimateDifficulty(keyword) {
    let difficulty = 15;

    if (keyword.includes("plumber")) difficulty += 20;
    if (keyword.includes("repair")) difficulty += 12;
    if (keyword.includes("service")) difficulty += 10;
    if (keyword.includes("company")) difficulty += 8;
    if (keyword.includes("emergency")) difficulty += 8;
    if (keyword.includes("near me")) difficulty += 6;

    difficulty += Math.min(
      keyword.split(/\s+/).length * 2,
      12
    );

    return Math.min(difficulty, 100);
  }

  estimateCompetition(keyword) {
    const kd = this.estimateDifficulty(keyword);

    if (kd >= 70) return "high";
    if (kd >= 40) return "medium";

    return "low";
  }

  estimateCPC(keyword) {
    let cpc = 1.2;

    if (keyword.includes("repair")) cpc += 5.4;
    if (keyword.includes("emergency")) cpc += 8.2;
    if (keyword.includes("service")) cpc += 4.1;
    if (keyword.includes("installation")) cpc += 3.8;
    if (keyword.includes("replacement")) cpc += 4.4;
    if (keyword.includes("houston")) cpc += 2.6;

    return Number(cpc.toFixed(2));
  }

  calculateOpportunity(record) {
    const volumeWeight = record.searchVolume / 100;

    const difficultyPenalty =
      record.keywordDifficulty * 1.5;

    const commercialBonus =
      record.intent === "transactional"
        ? 30
        : record.intent === "commercial"
        ? 20
        : 10;

    const score =
      volumeWeight +
      commercialBonus -
      difficultyPenalty;

    return Math.max(
      0,
      Math.round(score)
    );
  }

  classifyKeyword(record) {
    if (record.intent === "transactional") {
      return "money";
    }

    if (record.intent === "commercial") {
      return "buyer-guide";
    }

    if (record.intent === "navigational") {
      return "brand";
    }

    return "informational";
  }

  buildResearchSummary(record) {
    return {
      keyword: record.keyword,
      slug: record.slug,
      intent: record.intent,
      category: this.classifyKeyword(record),
      opportunity: record.opportunityScore,
      competition: record.competition,
      searchVolume: record.searchVolume,
      keywordDifficulty: record.keywordDifficulty,
      cpc: record.cpc,
      generatedAt: record.generatedAt,
    };
  }

  score(record) {
    record.searchVolume =
      this.estimateSearchVolume(record.keyword);

    record.keywordDifficulty =
      this.estimateDifficulty(record.keyword);

    record.cpc =
      this.estimateCPC(record.keyword);

    record.competition =
      this.estimateCompetition(record.keyword);

    record.opportunityScore =
      this.calculateOpportunity(record);

    record.summary =
      this.buildResearchSummary(record);

    return record;
  }
    async research(keyword) {
    if (!keyword || !keyword.trim()) {
      throw new Error("Keyword is required.");
    }

    const normalized = this.normalizeKeyword(keyword);

    logger.info(`Starting keyword research: ${normalized}`);

    if (this.options.cache) {
      const cache = this.loadCache(normalized);

      if (cache) {
        logger.success(`Cache hit: ${normalized}`);
        return cache;
      }
    }

    let record = this.createKeywordRecord(normalized);

    record = this.enrichKeyword(record);

    record = this.score(record);

    if (this.options.cache) {
      this.saveCache(normalized, record);
    }

    if (this.options.saveOutput) {
      await this.saveOutput(normalized, record);
    }

    logger.success(`Research completed: ${normalized}`);

    return record;
  }

  async researchMany(keywords = []) {
    return runBatch(
      keywords,
      keyword => this.research(keyword),
      {
        label: "Keyword research",
        stopOnError: this.options.stopOnError,
      }
    );
  }

  sortByOpportunity(results = []) {
    return [...results].sort(
      (a, b) => b.opportunityScore - a.opportunityScore
    );
  }

  generateStatistics(results = []) {
    if (!results.length) {
      return {
        totalKeywords: 0,
        averageDifficulty: 0,
        averageSearchVolume: 0,
        averageOpportunity: 0,
      };
    }

    const totalKeywords = results.length;

    const averageDifficulty =
      results.reduce(
        (sum, item) => sum + item.keywordDifficulty,
        0
      ) / totalKeywords;

    const averageSearchVolume =
      results.reduce(
        (sum, item) => sum + item.searchVolume,
        0
      ) / totalKeywords;

    const averageOpportunity =
      results.reduce(
        (sum, item) => sum + item.opportunityScore,
        0
      ) / totalKeywords;

    return {
      totalKeywords,
      averageDifficulty: Number(
        averageDifficulty.toFixed(2)
      ),
      averageSearchVolume: Number(
        averageSearchVolume.toFixed(2)
      ),
      averageOpportunity: Number(
        averageOpportunity.toFixed(2)
      ),
    };
  }

  async exportReport(results = [], failures = []) {
    const report = {
      project: config.project.name,
      domain: config.project.domain,
      generatedAt: new Date().toISOString(),
      statistics: this.generateStatistics(results),
      keywords: this.sortByOpportunity(results),
      failures: describeFailures(failures),
    };

    const file = path.join(
      OUTPUT_DIR,
      "keyword-research-report.json"
    );

    await fs.writeFile(
      file,
      JSON.stringify(report, null, 2),
      "utf8"
    );

    logger.success("Keyword research report exported.");

    return report;
  }
}

export async function researchKeyword(keyword, options = {}) {
  const engine = new KeywordResearchEngine(options);

  return engine.research(keyword);
}

export async function researchKeywords(
  keywords,
  options = {}
) {
  const engine = new KeywordResearchEngine(options);

  const { results, failures } = await engine.researchMany(keywords);

  await engine.exportReport(results, failures);

  throwIfFailed(
    failures,
    keywords.length,
    "Keyword research"
  );

  return results;
}

export default KeywordResearchEngine;