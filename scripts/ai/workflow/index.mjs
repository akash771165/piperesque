import logger from "../../shared/logger.mjs";
import config from "../../shared/config.mjs";

import {
  runResearch,
} from "./research.mjs";

import {
  generateContent,
} from "./generate.mjs";

import {
  optimizeSEO,
} from "./seo.mjs";

import {
  generateSchema,
} from "./schema.mjs";

import {
  generateMetadata,
} from "./metadata.mjs";

import {
  generateLinks,
} from "./links.mjs";

import {
  checkQuality,
} from "./quality.mjs";

import {
  publishBlog,
} from "./publish.mjs";

import {
  deployProject,
} from "./deploy.mjs";

export class AIWorkflow {

  constructor(options = {}) {

    this.options = {

      language:

        options.language ??

        "en",

      country:

        options.country ??

        "US",

      publish:

        options.publish ??

        true,

      deploy:

        options.deploy ??

        true,

      saveIntermediate:

        options.saveIntermediate ??

        false,

      stopOnError:

        options.stopOnError ??

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

      version:

        config.build.VERSION,

      engine:

        config.build.ENGINE,

      startedAt:

        new Date().toISOString(),

    };

  }

  async research(keyword) {

    logger.info(
      "STEP 1/8 : Research"
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

  async generate(research) {

    logger.info(
      "STEP 2/8 : Content Generation"
    );

    return generateContent(

      research.keyword.keyword,

      this.options

    );

  }

  async seo(blog) {

    logger.info(
      "STEP 3/8 : SEO Optimization"
    );

    return optimizeSEO(

      blog,

      this.options

    );

  }

  async schema(blog) {

    logger.info(
      "STEP 4/8 : Schema Generation"
    );

    return generateSchema(

      blog,

      this.options

    );

  }

  async metadata(blog) {

    logger.info(
      "STEP 5/8 : Metadata Generation"
    );

    return generateMetadata(

      blog,

      this.options

    );

  }

  async links(blog) {

    logger.info(
      "STEP 6/8 : Internal Linking"
    );

    return generateLinks(

      blog,

      this.options

    );

  }

  async quality(blog) {

    logger.info(
      "STEP 7/8 : Quality Check"
    );

    return checkQuality(

      blog,

      this.options

    );

  }

  async publish(blog) {

    if (
      !this.options.publish
    ) {

      return null;

    }

    logger.info(
      "STEP 8/8 : Publish"
    );

    return publishBlog(

      blog,

      this.options

    );

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
      `AI Workflow Started: ${keyword}`
    );

    const research =
      await this.research(
        keyword
      );

    const generated =
      await this.generate(
        research
      );

    const seo =
      await this.seo(
        generated.blog
      );

    const schema =
      await this.schema(
        seo
      );

    const metadata =
      await this.metadata(
        seo
      );

    const links =
      await this.links(
        seo
      );

    const quality =
      await this.quality(
        seo
      );

    let publish = null;

    if (
      this.options.publish
    ) {

      publish =
        await this.publish(
          seo
        );

    }

    let deployment = null;

    if (
      this.options.deploy
    ) {

      deployment =
        await deployProject(
          this.options
        );

    }

    logger.success(
      "AI Workflow Completed."
    );

    return {

      context,

      research,

      generated,

      seo,

      schema,

      metadata,

      links,

      quality,

      publish,

      deployment,

      completedAt:
        new Date().toISOString(),

    };

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

    const results = [];

    for (
      const keyword of keywords
    ) {

      try {

        const result =
          await this.run(
            keyword
          );

        results.push(
          result
        );

      } catch (
        error
      ) {

        logger.error(
          error.message
        );

        if (
          this.options.stopOnError
        ) {

          throw error;

        }

      }

    }

    return results;

  }

  summary(results = []) {

    return {

      project:
        config.project.name,

      company:
        config.project.company,

      totalKeywords:
        results.length,

      successful:

        results.filter(

          item => item

        ).length,

      generatedAt:
        new Date().toISOString(),

    };

  }
    async exportReport(
    results = []
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
        config.project,

      generatedAt:
        new Date().toISOString(),

      statistics:
        this.summary(
          results
        ),

      results,

    };

    const reportFile =
      path.join(
        outputDirectory,
        "ai-workflow-report.json"
      );

    await fs.writeFile(

      reportFile,

      JSON.stringify(
        report,
        null,
        2
      ),

      "utf8"

    );

    logger.success(
      "AI workflow report exported."
    );

    return reportFile;

  }

}

export async function runAIWorkflow(
  keyword,
  options = {}
) {

  const workflow =
    new AIWorkflow(
      options
    );

  return workflow.run(
    keyword
  );

}

export async function runAIWorkflowBatch(
  keywords = [],
  options = {}
) {

  const workflow =
    new AIWorkflow(
      options
    );

    const results =
      await workflow.runMany(
        keywords
      );

    await workflow.exportReport(
      results
    );

    return results;

}

export default AIWorkflow;