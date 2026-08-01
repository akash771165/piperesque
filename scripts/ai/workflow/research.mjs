import logger from "../../shared/logger.mjs";
import config from "../../shared/config.mjs";

import {
  researchKeyword,
  researchKeywords,
} from "../research/keyword-research.mjs";

import {
  analyzeSERP,
} from "../research/serp-analysis.mjs";

import {
  analyzeCompetitor,
} from "../research/competitor-analysis.mjs";

export class ResearchWorkflow {

  constructor(options = {}) {

    this.options = {

      language:

        options.language ??

        "en",

      country:

        options.country ??

        "US",

      saveReports:

        options.saveReports ??

        true,

      verbose:

        options.verbose ??

        false,

      ...options,

    };

  }

  createContext(keyword) {

    return {

      keyword,

      startedAt:

        new Date().toISOString(),

      project:

        config.project.name,

      domain:

        config.project.domain,

      language:

        this.options.language,

      country:

        this.options.country,

    };

  }

  async runKeywordResearch(keyword) {

    logger.info(
      "Running Keyword Research..."
    );

    return researchKeyword(

      keyword,

      {

        language:
          this.options.language,

        country:
          this.options.country,

      }

    );

  }

  async runSERPResearch(keyword) {

    logger.info(
      "Running SERP Analysis..."
    );

    return analyzeSERP(

      keyword,

      {

        language:
          this.options.language,

        country:
          this.options.country,

      }

    );

  }

  async runCompetitorResearch(keyword) {

    logger.info(
      "Running Competitor Analysis..."
    );

    return analyzeCompetitor(

      keyword,

      {

        language:
          this.options.language,

        country:
          this.options.country,

      }

    );

  }

  mergeResearch(

    keywordReport,

    serpReport,

    competitorReport

  ) {

    return {

      keyword:

        keywordReport,

      serp:

        serpReport,

      competitors:

        competitorReport,

    };

  }

  validate(report) {

    if (!report) {

      throw new Error(
        "Research report missing."
      );

    }

    return true;

  }
    async run(keyword) {

    if (
      !keyword ||
      !keyword.trim()
    ) {

      throw new Error(
        "Keyword is required."
      );

    }

    const context =
      this.createContext(
        keyword
      );

    logger.info(
      `Research workflow started for: ${keyword}`
    );

    const [

      keywordReport,

      serpReport,

      competitorReport,

    ] = await Promise.all([

      this.runKeywordResearch(
        keyword
      ),

      this.runSERPResearch(
        keyword
      ),

      this.runCompetitorResearch(
        keyword
      ),

    ]);

    const report =
      this.mergeResearch(

        keywordReport,

        serpReport,

        competitorReport

      );

    this.validate(
      report
    );

    report.context =
      context;

    report.finishedAt =
      new Date().toISOString();

    logger.success(
      "Research workflow completed."
    );

    return report;

  }

  async runMany(
    keywords = []
  ) {

    if (
      !Array.isArray(
        keywords
      )
    ) {

      throw new Error(
        "Keywords must be an array."
      );

    }

    const reports = [];

    for (
      const keyword of keywords
    ) {

      try {

        const report =
          await this.run(
            keyword
          );

        reports.push(
          report
        );

      } catch (
        error
      ) {

        logger.error(
          error.message
        );

      }

    }

    return reports;

  }

  generateStatistics(
    reports = []
  ) {

    return {

      totalKeywords:
        reports.length,

      generatedAt:
        new Date().toISOString(),

      project:
        config.project.name,

      domain:
        config.project.domain,

    };

  }

  async exportReport(
    reports = []
  ) {

    const fs =
      await import(
        "node:fs/promises"
      );

    const path =
      await import(
        "node:path"
      );

    const outputDir =
      path.join(
        process.cwd(),
        "output"
      );

    await fs.mkdir(
      outputDir,
      {
        recursive: true,
      }
    );

    const finalReport = {

      statistics:
        this.generateStatistics(
          reports
        ),

      reports,

    };

    const filePath =
      path.join(
        outputDir,
        "research-workflow-report.json"
      );

    await fs.writeFile(

      filePath,

      JSON.stringify(
        finalReport,
        null,
        2
      ),

      "utf8"

    );

    logger.success(
      "Research workflow report exported."
    );

    return filePath;

  }

}

export async function runResearch(
  keyword,
  options = {}
) {

  const workflow =
    new ResearchWorkflow(
      options
    );

  return workflow.run(
    keyword
  );

}

export async function runResearchBatch(
  keywords = [],
  options = {}
) {

  const workflow =
    new ResearchWorkflow(
      options
    );

  const reports =
    await workflow.runMany(
      keywords
    );

  await workflow.exportReport(
    reports
  );

  return reports;

}

export default ResearchWorkflow;
