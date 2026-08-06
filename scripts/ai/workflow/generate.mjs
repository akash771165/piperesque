import logger from "../../shared/logger.mjs";
import config from "../../shared/config.mjs";

import {
  describeFailures,
  runBatch,
  throwIfFailed,
} from "../../shared/batch.mjs";

import { runResearch } from "./research.mjs";

import { generateBlog } from "../generators/blog-generator.mjs";

export class ContentGenerationWorkflow {

  constructor(options = {}) {

    this.options = {

      language:

        options.language ??

        "en",

      country:

        options.country ??

        "US",

      tone:

        options.tone ??

        "professional",

      model:

        options.model ??

        "gpt-5.5",

      save:

        options.save ??

        true,

      overwrite:

        options.overwrite ??

        false,

      ...options,

    };

  }

  createContext(keyword) {

    return {

      keyword,

      project:

        config.project.name,

      company:

        config.project.company,

      domain:

        config.project.domain,

      language:

        this.options.language,

      country:

        this.options.country,

      model:

        this.options.model,

      startedAt:

        new Date().toISOString(),

    };

  }

  async collectResearch(keyword) {

    logger.info(

      "Collecting research..."

    );

    return runResearch(

      keyword,

      {

        language:

          this.options.language,

        country:

          this.options.country,

      }

    );

  }

  async createBlog(research) {

    logger.info(

      "Generating AI blog..."

    );

    return generateBlog(

      research,

      {

        tone:

          this.options.tone,

        save:

          this.options.save,

        overwrite:

          this.options.overwrite,

      }

    );

  }

  merge(context, research, blog) {

    return {

      context,

      research,

      blog,

      generatedAt:

        new Date().toISOString(),

    };

  }

  validate(result) {

    if (!result) {

      throw new Error(

        "Generation failed."

      );

    }

    if (!result.blog) {

      throw new Error(

        "Blog generation failed."

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

    logger.info(
      `Content generation started: ${keyword}`
    );

    const context =
      this.createContext(
        keyword
      );

    const research =
      await this.collectResearch(
        keyword
      );

    const blog =
      await this.createBlog(
        research
      );

    const result =
      this.merge(

        context,

        research,

        blog

      );

    this.validate(
      result
    );

    logger.success(
      "Content generation completed."
    );

    return result;

  }

  async runMany(
    keywords = []
  ) {

    return runBatch(

      keywords,

      keyword =>
        this.run(
          keyword
        ),

      {

        label:
          "Content generation",

        stopOnError:
          this.options.stopOnError,

      }

    );

  }

  buildStatistics(
    results = []
  ) {

    return {

      totalGenerated:

        results.length,

      generatedAt:

        new Date().toISOString(),

      project:

        config.project.name,

      domain:

        config.project.domain,

      company:

        config.project.company,

    };

  }

  async exportReport(
    results = [],
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

    const report = {

      statistics:

        this.buildStatistics(
          results
        ),

      results,

      failures:

        describeFailures(
          failures
        ),

    };

    const filePath =
      path.join(
        outputDir,
        "generation-report.json"
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
      "Generation report exported."
    );

    return filePath;

  }

}

export async function generateContent(
  keyword,
  options = {}
) {

  const workflow =
    new ContentGenerationWorkflow(
      options
    );

  return workflow.run(
    keyword
  );

}

export async function generateContents(
  keywords = [],
  options = {}
) {

  const workflow =
    new ContentGenerationWorkflow(
      options
    );

  const { results, failures } =
    await workflow.runMany(
      keywords
    );

  await workflow.exportReport(
    results,
    failures
  );

  throwIfFailed(
    failures,
    keywords.length,
    "Content generation"
  );

  return results;

}

export default ContentGenerationWorkflow;