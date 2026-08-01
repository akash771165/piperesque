import logger from "../../shared/logger.mjs";
import config from "../../shared/config.mjs";

export class QualityWorkflow {

  constructor(options = {}) {

    this.options = {

      minWords:

        options.minWords ??

        1200,

      maxWords:

        options.maxWords ??

        3500,

      minParagraphs:

        options.minParagraphs ??

        12,

      minHeadings:

        options.minHeadings ??

        8,

      minFaqs:

        options.minFaqs ??

        5,

      keywordDensityMin:

        options.keywordDensityMin ??

        0.8,

      keywordDensityMax:

        options.keywordDensityMax ??

        2.0,

      readabilityTarget:

        options.readabilityTarget ??

        70,

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

  paragraphCount(content = "") {

    return content

      .split(/\n\s*\n/g)

      .filter(

        paragraph =>

          paragraph.trim()

      )

      .length;

  }

  headingCount(blog) {

    return Array.isArray(

      blog.headings

    )

      ? blog.headings.length

      : 0;

  }

  faqCount(blog) {

    return Array.isArray(

      blog.faq

    )

      ? blog.faq.length

      : 0;

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

    if (

      words === 0

    ) {

      return 0;

    }

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

  estimateReadability(content = "") {

    const words =

      this.wordCount(

        content

      );

    const paragraphs =

      this.paragraphCount(

        content

      );

    let score = 100;

    if (

      words >

      this.options.maxWords

    ) {

      score -= 10;

    }

    if (

      paragraphs <

      this.options.minParagraphs

    ) {

      score -= 15;

    }

    return Math.max(

      score,

      0

    );

  }

  analyze(blog) {

    const words =

      this.wordCount(

        blog.content ?? ""

      );

    const paragraphs =

      this.paragraphCount(

        blog.content ?? ""

      );

    const headings =

      this.headingCount(

        blog

      );

    const faqs =

      this.faqCount(

        blog

      );

    const density =

      this.keywordDensity(

        blog.content ?? "",

        blog.keyword ?? ""

      );

    return {

      words,

      paragraphs,

      headings,

      faqs,

      keywordDensity:

        density,

      readability:

        this.estimateReadability(

          blog.content ?? ""

        ),

    };

  }
    validate(analysis) {

    const issues = [];

    if (

      analysis.words <

      this.options.minWords

    ) {

      issues.push(

        "Content word count is too low."

      );

    }

    if (

      analysis.words >

      this.options.maxWords

    ) {

      issues.push(

        "Content word count exceeds limit."

      );

    }

    if (

      analysis.paragraphs <

      this.options.minParagraphs

    ) {

      issues.push(

        "Not enough paragraphs."

      );

    }

    if (

      analysis.headings <

      this.options.minHeadings

    ) {

      issues.push(

        "Not enough headings."

      );

    }

    if (

      analysis.faqs <

      this.options.minFaqs

    ) {

      issues.push(

        "Not enough FAQs."

      );

    }

    if (

      analysis.keywordDensity <

      this.options.keywordDensityMin

    ) {

      issues.push(

        "Keyword density is too low."

      );

    }

    if (

      analysis.keywordDensity >

      this.options.keywordDensityMax

    ) {

      issues.push(

        "Keyword density is too high."

      );

    }

    if (

      analysis.readability <

      this.options.readabilityTarget

    ) {

      issues.push(

        "Readability score is low."

      );

    }

    return issues;

  }

  calculateScore(

    analysis,

    issues

  ) {

    let score = 100;

    score -=

      issues.length * 8;

    if (

      analysis.readability >

      90

    ) {

      score += 2;

    }

    return Math.max(

      Math.min(

        score,

        100

      ),

      0

    );

  }

  summary(

    analysis,

    issues,

    score

  ) {

    return {

      project:

        config.project.name,

      score,

      passed:

        issues.length === 0,

      issues:

        issues.length,

      readability:

        analysis.readability,

      words:

        analysis.words,

      paragraphs:

        analysis.paragraphs,

      headings:

        analysis.headings,

      faqs:

        analysis.faqs,

      keywordDensity:

        analysis.keywordDensity,

      generatedAt:

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
      "Quality check started..."
    );

    const analysis =
      this.analyze(
        blog
      );

    const issues =
      this.validate(
        analysis
      );

    const score =
      this.calculateScore(

        analysis,

        issues

      );

    const result = {

      blog,

      analysis,

      issues,

      score,

      summary:

        this.summary(

          analysis,

          issues,

          score

        ),

      checkedAt:

        new Date().toISOString(),

    };

    logger.success(
      "Quality check completed."
    );

    return result;

  }

  async runMany(
    blogs = []
  ) {

    if (
      !Array.isArray(
        blogs
      )
    ) {

      throw new Error(
        "Blogs must be an array."
      );

    }

    const results = [];

    for (
      const blog of blogs
    ) {

      try {

        const result =
          await this.run(
            blog
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

      }

    }

    return results;

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

      generatedAt:
        new Date().toISOString(),

      totalBlogs:
        results.length,

      reports:
        results.map(
          item => ({
            slug:
              item.blog.slug,
            score:
              item.score,
            summary:
              item.summary,
          })
        ),

    };

    const filePath =
      path.join(
        outputDir,
        "quality-report.json"
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
      "Quality report exported."
    );

    return filePath;

  }

}

export async function checkQuality(
  blog,
  options = {}
) {

  const workflow =
    new QualityWorkflow(
      options
    );

  return workflow.run(
    blog
  );

}

export async function checkQualityBatch(
  blogs = [],
  options = {}
) {

  const workflow =
    new QualityWorkflow(
      options
    );

  const results =
    await workflow.runMany(
      blogs
    );

  await workflow.exportReport(
    results
  );

  return results;

}

export default QualityWorkflow;