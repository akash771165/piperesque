import logger from "../../shared/logger.mjs";
import config from "../../shared/config.mjs";

import {
  describeFailures,
  runBatch,
  throwIfFailed,
} from "../../shared/batch.mjs";

import {
  validateTitle,
  validateDescription,
} from "../../shared/validator.mjs";

export class SEOWorkflow {

  constructor(options = {}) {

    this.options = {

      language:
        options.language ??
        "en",

      country:
        options.country ??
        "US",

      titleLimit:
        options.titleLimit ??
        60,

      descriptionLimit:
        options.descriptionLimit ??
        160,

      minWords:
        options.minWords ??
        1200,

      maxWords:
        options.maxWords ??
        3500,

      keywordDensityMin:
        options.keywordDensityMin ??
        0.8,

      keywordDensityMax:
        options.keywordDensityMax ??
        2.0,

      ...options,

    };

  }

  normalize(text = "") {

    return text

      .replace(/\s+/g, " ")

      .trim();

  }

  wordCount(content = "") {

    return this

      .normalize(content)

      .split(" ")

      .filter(Boolean)

      .length;

  }

  keywordCount(content, keyword) {

    if (
      !content ||
      !keyword
    ) {

      return 0;

    }

    const matches =

      content

        .toLowerCase()

        .match(

          new RegExp(

            keyword.toLowerCase(),

            "gi"

          )

        );

    return matches
      ? matches.length
      : 0;

  }

  keywordDensity(content, keyword) {

    const words =
      this.wordCount(
        content
      );

    if (words === 0)
      return 0;

    const count =
      this.keywordCount(
        content,
        keyword
      );

    return Number(

      (
        count /
        words *
        100

      ).toFixed(2)

    );

  }

  optimizeTitle(title, keyword) {

    let value =
      this.normalize(
        title
      );

    if (

      !value
      .toLowerCase()
      .includes(

        keyword
        .toLowerCase()

      )

    ) {

      value =
`${keyword} | ${value}`;

    }

    if (

      value.length >

      this.options.titleLimit

    ) {

      value =
        value.slice(

          0,

          this.options.titleLimit

        );

    }

    return value;

  }

  optimizeDescription(
    description,
    keyword
  ) {

    let value =
      this.normalize(
        description
      );

    if (

      !value
      .toLowerCase()
      .includes(

        keyword
        .toLowerCase()

      )

    ) {

      value =
`${keyword}. ${value}`;

    }

    if (

      value.length >

      this.options.descriptionLimit

    ) {

      value =
        value.slice(

          0,

          this.options.descriptionLimit

        );

    }

    return value;

  }

  validateSEO(blog) {

    const issues = [];

    if (

      !validateTitle(
        blog.title
      )

    ) {

      issues.push(
        "Invalid SEO title."
      );

    }

    if (

      !validateDescription(
        blog.description
      )

    ) {

      issues.push(
        "Invalid meta description."
      );

    }

    return issues;

  }
    optimizeHeadings(headings = [], keyword = "") {

    if (!Array.isArray(headings)) {
      return [];
    }

    return headings.map((heading, index) => {

      let value = this.normalize(heading);

      if (
        index === 0 &&
        keyword &&
        !value.toLowerCase().includes(keyword.toLowerCase())
      ) {
        value = `${keyword} - ${value}`;
      }

      return value;

    });

  }

  analyzeContent(blog) {

    const totalWords =
      this.wordCount(
        blog.content ?? ""
      );

    const density =
      this.keywordDensity(
        blog.content ?? "",
        blog.keyword ?? ""
      );

    return {

      totalWords,

      keywordDensity: density,

      wordCountStatus:

        totalWords >= this.options.minWords &&
        totalWords <= this.options.maxWords,

      keywordDensityStatus:

        density >= this.options.keywordDensityMin &&
        density <= this.options.keywordDensityMax,

    };

  }

  optimizeBlog(blog) {

    const optimized = {

      ...blog,

    };

    optimized.title =
      this.optimizeTitle(

        optimized.title,

        optimized.keyword

      );

    optimized.description =
      this.optimizeDescription(

        optimized.description,

        optimized.keyword

      );

    optimized.headings =
      this.optimizeHeadings(

        optimized.headings,

        optimized.keyword

      );

    optimized.seoAnalysis =
      this.analyzeContent(
        optimized
      );

    optimized.seoIssues =
      this.validateSEO(
        optimized
      );

    optimized.lastSEOUpdate =
      new Date().toISOString();

    return optimized;

  }

  buildSEOScore(blog) {

    let score = 100;

    const analysis =
      blog.seoAnalysis;

    if (
      !analysis.wordCountStatus
    ) {

      score -= 20;

    }

    if (
      !analysis.keywordDensityStatus
    ) {

      score -= 15;

    }

    score -=
      blog.seoIssues.length * 10;

    return Math.max(
      score,
      0
    );

  }

  buildSummary(blog) {

    return {

      project:
        config.project.name,

      keyword:
        blog.keyword,

      seoScore:
        this.buildSEOScore(blog),

      totalWords:
        blog.seoAnalysis.totalWords,

      keywordDensity:
        blog.seoAnalysis.keywordDensity,

      issues:
        blog.seoIssues.length,

      optimizedAt:
        new Date().toISOString(),

    };

  }
    async run(blog) {

    if (!blog) {

      throw new Error(
        "Blog data is required."
      );

    }

    logger.info(
      "SEO optimization started..."
    );

    const optimized =
      this.optimizeBlog(
        blog
      );

    optimized.seoSummary =
      this.buildSummary(
        optimized
      );

    logger.success(
      "SEO optimization completed."
    );

    return optimized;

  }

  async runMany(
    blogs = []
  ) {

    return runBatch(

      blogs,

      blog =>
        this.run(
          blog
        ),

      {

        label:
          "SEO optimization",

        stopOnError:
          this.options.stopOnError,

      }

    );

  }

  async exportReport(
    blogs = [],
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

      project:
        config.project,

      failures:
        describeFailures(
          failures
        ),

      generatedAt:
        new Date().toISOString(),

      totalBlogs:
        blogs.length,

      reports:
        blogs.map(

          blog =>

            blog.seoSummary

        ),

    };

    const filePath =
      path.join(
        outputDir,
        "seo-report.json"
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
      "SEO report exported."
    );

    return filePath;

  }

}

export async function optimizeSEO(
  blog,
  options = {}
) {

  const workflow =
    new SEOWorkflow(
      options
    );

  return workflow.run(
    blog
  );

}

export async function optimizeSEOBatch(
  blogs = [],
  options = {}
) {

  const workflow =
    new SEOWorkflow(
      options
    );

  const { results, failures } =
    await workflow.runMany(
      blogs
    );

  await workflow.exportReport(
    results,
    failures
  );

  throwIfFailed(
    failures,
    blogs.length,
    "SEO optimization"
  );

  return results;

}

export default SEOWorkflow;