import crypto from "node:crypto";

import logger from "../../shared/logger.mjs";

import {
  describeFailures,
  runBatch,
  throwIfFailed,
} from "../../shared/batch.mjs";

const DEFAULT_COUNTRY = "US";
const DEFAULT_LANGUAGE = "en";

export class CompetitorAnalysisEngine {

  constructor(options = {}) {

    this.options = {

      country:
        options.country ??
        DEFAULT_COUNTRY,

      language:
        options.language ??
        DEFAULT_LANGUAGE,

      maxCompetitors:
        options.maxCompetitors ?? 10,

      includeWeaknesses:
        options.includeWeaknesses ?? true,

      includeStrengths:
        options.includeStrengths ?? true,

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

  buildCompetitorDomains() {

    return [

      "angi.com",

      "homeadvisor.com",

      "thumbtack.com",

      "thisoldhouse.com",

      "bobvila.com",

      "reddit.com",

      "youtube.com",

      "forbes.com",

      "yelp.com",

      "facebook.com",

    ];

  }

  estimateAuthority(position) {

    return Math.max(

      100 - position * 5,

      30

    );

  }

  estimateContentLength(position) {

    return 1200 +

      position * 250;

  }

  estimateBacklinks(position) {

    return 450 -

      position * 30;

  }

  estimatePageSpeed(position) {

    return Math.max(

      100 - position * 2,

      70

    );

  }

  estimateSEOScore(position) {

    return Math.max(

      95 - position * 2,

      65

    );

  }

  createCompetitor(keyword, domain, position) {

    return {

      id:

        crypto.randomUUID(),

      keyword,

      position,

      domain,

      url:

`https://${domain}/${keyword.replace(/\s+/g,"-")}`,

      authority:

        this.estimateAuthority(position),

      backlinks:

        this.estimateBacklinks(position),

      pageSpeed:

        this.estimatePageSpeed(position),

      seoScore:

        this.estimateSEOScore(position),

      contentLength:

        this.estimateContentLength(position),

      title:

`${keyword} | ${domain}`,

    };

  }

  buildCompetitors(keyword) {

    return this

      .buildCompetitorDomains()

      .slice(

        0,

        this.options.maxCompetitors

      )

      .map(

        (

          domain,

          index

        ) =>

          this.createCompetitor(

            keyword,

            domain,

            index + 1

          )

      );

  }
    analyzeStrengths(competitors = []) {

    const strengths = [];

    for (const competitor of competitors) {

      if (competitor.authority >= 85) {

        strengths.push({
          domain: competitor.domain,
          type: "High Domain Authority",
          score: competitor.authority,
        });

      }

      if (competitor.pageSpeed >= 90) {

        strengths.push({
          domain: competitor.domain,
          type: "Excellent Page Speed",
          score: competitor.pageSpeed,
        });

      }

      if (competitor.contentLength >= 2500) {

        strengths.push({
          domain: competitor.domain,
          type: "Long Form Content",
          score: competitor.contentLength,
        });

      }

      if (competitor.backlinks >= 300) {

        strengths.push({
          domain: competitor.domain,
          type: "Strong Backlink Profile",
          score: competitor.backlinks,
        });

      }

    }

    return strengths;

  }

  analyzeWeaknesses(competitors = []) {

    const weaknesses = [];

    for (const competitor of competitors) {

      if (competitor.pageSpeed < 85) {

        weaknesses.push({
          domain: competitor.domain,
          issue: "Slow Page Speed",
        });

      }

      if (competitor.contentLength < 1800) {

        weaknesses.push({
          domain: competitor.domain,
          issue: "Thin Content",
        });

      }

      if (competitor.seoScore < 80) {

        weaknesses.push({
          domain: competitor.domain,
          issue: "SEO Optimization Needed",
        });

      }

    }

    return weaknesses;

  }

  analyzeContentGap(competitors = []) {

    return {

      recommendedWordCount:

        Math.max(

          ...competitors.map(

            item =>

              item.contentLength

          )

        ) + 500,

      recommendedImages: 8,

      recommendedFAQs: 10,

      recommendedHeadings: 15,

      recommendedInternalLinks: 12,

      recommendedExternalLinks: 5,

    };

  }

  calculateTrustScore(competitor) {

    const score =

      competitor.authority * 0.40 +

      competitor.pageSpeed * 0.20 +

      competitor.seoScore * 0.20 +

      Math.min(

        competitor.backlinks / 5,

        100

      ) * 0.20;

    return Number(

      score.toFixed(2)

    );

  }

  enrichCompetitors(competitors = []) {

    return competitors.map(

      competitor => ({

        ...competitor,

        trustScore:

          this.calculateTrustScore(

            competitor

          ),

      })

    );

  }

  rankCompetitors(competitors = []) {

    return [...competitors].sort(

      (

        a,

        b

      ) =>

        b.trustScore -

        a.trustScore

    );

  }

  buildSummary(competitors = []) {

    const ranked =

      this.rankCompetitors(

        competitors

      );

    return {

      totalCompetitors:

        ranked.length,

      strongestCompetitor:

        ranked[0]?.domain ??

        null,

      weakestCompetitor:

        ranked.at(-1)?.domain ??

        null,

      averageAuthority:

        Math.round(

          ranked.reduce(

            (

              total,

              item

            ) =>

              total +

              item.authority,

            0

          ) /

          ranked.length

        ),

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
      this.normalize(
        keyword
      );

    logger.info(
      `Competitor analysis started: ${normalized}`
    );

    let competitors =
      this.buildCompetitors(
        normalized
      );

    competitors =
      this.enrichCompetitors(
        competitors
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

      competitors,

      strengths:
        this.analyzeStrengths(
          competitors
        ),

      weaknesses:
        this.analyzeWeaknesses(
          competitors
        ),

      contentGap:
        this.analyzeContentGap(
          competitors
        ),

      summary:
        this.buildSummary(
          competitors
        ),

      generatedAt:
        new Date().toISOString(),

    };

    logger.success(
      `Competitor analysis completed: ${normalized}`
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
          "Competitor analysis",

        stopOnError:
          this.options.stopOnError,

      }

    );

  }

  async exportReport(
    reports = [],
    failures = []
  ) {

    const fs =
      await import(
        "node:fs/promises"
      );

    const path =
      await import(
        "node:path"
      );

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

    const report = {

      project:
        "PipeResque",

      generatedAt:
        new Date().toISOString(),

      totalKeywords:
        reports.length,

      reports,

      failures:
        describeFailures(
          failures
        ),

    };

    const filePath =
      path.join(
        outputDirectory,
        "competitor-analysis-report.json"
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
      "Competitor report exported."
    );

    return filePath;

  }

}

export async function analyzeCompetitor(
  keyword,
  options = {}
) {

  const engine =
    new CompetitorAnalysisEngine(
      options
    );

  return engine.analyze(
    keyword
  );

}

export async function analyzeCompetitors(
  keywords = [],
  options = {}
) {

  const engine =
    new CompetitorAnalysisEngine(
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
    "Competitor analysis"
  );

  return results;

}

export default CompetitorAnalysisEngine;