import crypto from "node:crypto";

import logger from "../../shared/logger.mjs";

import {
  describeFailures,
  runBatch,
  throwIfFailed,
} from "../../shared/batch.mjs";

const DEFAULT_COUNTRY = "US";
const DEFAULT_LANGUAGE = "en";

export class SERPAnalysisEngine {

  constructor(options = {}) {

    this.options = {

      country:
        options.country ??
        DEFAULT_COUNTRY,

      language:
        options.language ??
        DEFAULT_LANGUAGE,

      maxResults:
        options.maxResults ?? 10,

      cache:
        options.cache ?? true,

      ...options,

    };

  }

  normalize(keyword) {

    return keyword
      .trim()
      .toLowerCase()
      .replace(/\s+/g, " ");

  }

  createId(keyword) {

    return crypto
      .createHash("sha256")
      .update(keyword)
      .digest("hex");

  }

  estimateIntent(keyword) {

    const value =
      keyword.toLowerCase();

    if (
      value.includes("buy") ||
      value.includes("repair") ||
      value.includes("service") ||
      value.includes("company") ||
      value.includes("near me") ||
      value.includes("emergency")
    ) {

      return "transactional";

    }

    if (

      value.includes("best") ||

      value.includes("top") ||

      value.includes("review") ||

      value.includes("vs")

    ) {

      return "commercial";

    }

    return "informational";

  }

  estimateDifficulty(keyword) {

    let score = 20;

    if (
      keyword.includes("plumber")
    ) score += 15;

    if (
      keyword.includes("repair")
    ) score += 12;

    if (
      keyword.includes("houston")
    ) score += 10;

    if (
      keyword.includes("emergency")
    ) score += 8;

    score +=
      keyword.split(" ").length;

    return Math.min(
      score,
      100
    );

  }

  estimateCompetition(keyword) {

    const kd =
      this.estimateDifficulty(
        keyword
      );

    if (kd >= 70)
      return "high";

    if (kd >= 40)
      return "medium";

    return "low";

  }

  generateFakeSERP(keyword) {

    const slug =
      keyword
      .replace(/\s+/g, "-");

    const domains = [

      "angi.com",

      "homeadvisor.com",

      "thumbtack.com",

      "forbes.com",

      "bobvila.com",

      "thisoldhouse.com",

      "reddit.com",

      "youtube.com",

      "facebook.com",

      "yelp.com",

    ];

    return domains
      .slice(
        0,
        this.options.maxResults
      )
      .map(
        (
          domain,
          index
        ) => ({

          position:
            index + 1,

          domain,

          url:
`https://${domain}/${slug}`,

          title:
`${keyword} | ${domain}`,

          authority:
            100 -
            index * 5,

        })
      );

  }
  analyzeContentGap(results = []) {

    const gaps = [];

    for (const item of results) {

      if (
        item.authority >= 90
      ) {

        gaps.push(
          "High authority competitors dominate this keyword."
        );

      }

      if (
        item.domain.includes("reddit")
      ) {

        gaps.push(
          "Community discussions rank well."
        );

      }

      if (
        item.domain.includes("youtube")
      ) {

        gaps.push(
          "Video content appears on page one."
        );

      }

      if (
        item.domain.includes("yelp")
      ) {

        gaps.push(
          "Local citations are important."
        );

      }

    }

    return [...new Set(gaps)];

  }

  detectFeaturedSnippet(keyword) {

    return {

      available: true,

      type: "paragraph",

      estimatedWords: 45,

      triggerKeyword: keyword,

    };

  }

  generatePeopleAlsoAsk(keyword) {

    return [

      `What is ${keyword}?`,

      `How much does ${keyword} cost?`,

      `Who provides ${keyword}?`,

      `How long does ${keyword} take?`,

      `Is ${keyword} available today?`,

      `Do I need a licensed plumber for ${keyword}?`,

      `Can ${keyword} be done same day?`,

      `What causes the need for ${keyword}?`

    ];

  }

  generateRelatedSearches(keyword) {

    return [

      `${keyword} near me`,

      `${keyword} cost`,

      `${keyword} company`,

      `${keyword} services`,

      `${keyword} reviews`,

      `${keyword} emergency`,

      `${keyword} same day`,

      `${keyword} 24 hour`,

      `${keyword} licensed`,

      `${keyword} houston`

    ];

  }

  extractEntities(keyword) {

    return keyword

      .split(/\s+/)

      .filter(

        word =>

          word.length > 2

      )

      .map(

        word =>

          word.toLowerCase()

      );

  }

  buildCompetitorMetrics(results) {

    return {

      totalCompetitors:

        results.length,

      averageAuthority:

        Math.round(

          results.reduce(

            (sum, item) =>

              sum +

              item.authority,

            0

          ) /

          results.length

        ),

      strongestCompetitor:

        results[0]?.domain ??

        null,

      weakestCompetitor:

        results.at(-1)?.domain ??

        null,

    };

  }

  buildSummary(data) {

    return {

      keyword:
        data.keyword,

      intent:
        data.intent,

      competition:
        data.competition,

      difficulty:
        data.difficulty,

      featuredSnippet:
        data.featuredSnippet.available,

      peopleAlsoAsk:
        data.peopleAlsoAsk.length,

      relatedSearches:
        data.relatedSearches.length,

      competitors:
        data.serp.length,

      analyzedAt:
        new Date().toISOString(),

    };

  }
    async analyze(keyword) {

    if (
      !keyword ||
      !keyword.trim()
    ) {

      throw new Error(
        "Keyword is required."
      );

    }

    const normalized =
      this.normalize(keyword);

    logger.info(
      `Analyzing SERP: ${normalized}`
    );

    const serp =
      this.generateFakeSERP(
        normalized
      );

    const report = {

      id:
        this.createId(
          normalized
        ),

      keyword:
        normalized,

      language:
        this.options.language,

      country:
        this.options.country,

      intent:
        this.estimateIntent(
          normalized
        ),

      difficulty:
        this.estimateDifficulty(
          normalized
        ),

      competition:
        this.estimateCompetition(
          normalized
        ),

      serp,

      featuredSnippet:
        this.detectFeaturedSnippet(
          normalized
        ),

      peopleAlsoAsk:
        this.generatePeopleAlsoAsk(
          normalized
        ),

      relatedSearches:
        this.generateRelatedSearches(
          normalized
        ),

      entities:
        this.extractEntities(
          normalized
        ),

      competitorMetrics:
        this.buildCompetitorMetrics(
          serp
        ),

      contentGap:
        this.analyzeContentGap(
          serp
        ),

      createdAt:
        new Date().toISOString(),

    };

    report.summary =
      this.buildSummary(
        report
      );

    logger.success(
      `SERP analysis completed: ${normalized}`
    );

    return report;

  }

  async analyzeMany(
    keywords = []
  ) {

    return runBatch(

      keywords,

      keyword =>
        this.analyze(
          keyword
        ),

      {

        label:
          "SERP analysis",

        stopOnError:
          this.options.stopOnError,

      }

    );

  }

  rankReports(
    reports = []
  ) {

    return [...reports].sort(

      (
        a,
        b
      ) =>

        a.difficulty -
        b.difficulty

    );

  }

  generateStatistics(
    reports = []
  ) {

    if (
      reports.length === 0
    ) {

      return {

        keywords: 0,

        averageDifficulty: 0,

        averageCompetition: "low",

      };

    }

    const avgDifficulty =

      reports.reduce(

        (
          total,
          report
        ) =>

          total +
          report.difficulty,

        0

      ) /

      reports.length;

    return {

      keywords:
        reports.length,

      averageDifficulty:
        Number(
          avgDifficulty.toFixed(
            2
          )
        ),

      averageCompetition:

        avgDifficulty >= 70

          ? "high"

          : avgDifficulty >= 40

          ? "medium"

          : "low",

    };

  }

  buildFinalReport(
    reports = []
  ) {

    return {

      project:
        config.project,

      generatedAt:
        new Date().toISOString(),

      statistics:
        this.generateStatistics(
          reports
        ),

      reports:
        this.rankReports(
          reports
        ),

    };

  }
    async exportReport(reports = [], failures = []) {

    const fs = await import("node:fs/promises");
    const path = await import("node:path");

    const report = {

      ...this.buildFinalReport(
        reports
      ),

      failures:
        describeFailures(
          failures
        ),

    };

    const outputDirectory =
      path.join(
        process.cwd(),
        "output"
      );

    await fs.mkdir(
      outputDirectory,
      {
        recursive: true,
      }
    );

    const filePath =
      path.join(
        outputDirectory,
        "serp-analysis-report.json"
      );

    await fs.writeFile(

      filePath,

      JSON.stringify(
        report,
        null,
        2
      ),

      "utf8"

    );

    logger.success(
      "SERP report exported."
    );

    return filePath;

  }

}

export async function analyzeSERP(
  keyword,
  options = {}
) {

  const engine =
    new SERPAnalysisEngine(
      options
    );

  return engine.analyze(
    keyword
  );

}

export async function analyzeSERPs(
  keywords = [],
  options = {}
) {

  const engine =
    new SERPAnalysisEngine(
      options
    );

  const { results, failures } =
    await engine.analyzeMany(
      keywords
    );

  await engine.exportReport(
    results,
    failures
  );

  throwIfFailed(
    failures,
    keywords.length,
    "SERP analysis"
  );

  return results;

}

export default SERPAnalysisEngine;