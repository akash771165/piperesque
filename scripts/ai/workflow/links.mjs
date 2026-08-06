import logger from "../../shared/logger.mjs";
import config from "../../shared/config.mjs";

import {
  describeFailures,
  runBatch,
  throwIfFailed,
} from "../../shared/batch.mjs";

export class InternalLinksWorkflow {

  constructor(options = {}) {

    this.options = {

      domain:

        options.domain ??

        config.project.domain,

      maxInternalLinks:

        options.maxInternalLinks ??

        15,

      maxExternalLinks:

        options.maxExternalLinks ??

        5,

      blogPrefix:

        options.blogPrefix ??

        "/blog",

      servicePrefix:

        options.servicePrefix ??

        "/services",

      locationPrefix:

        options.locationPrefix ??

        "/service-areas",

      ...options,

    };

  }

  normalize(text = "") {

    return text

      .replace(/\s+/g, " ")

      .trim();

  }

  slug(text = "") {

    return this

      .normalize(text)

      .toLowerCase()

      .replace(/[^a-z0-9 ]/g, "")

      .replace(/\s+/g, "-");

  }

  serviceLink(service) {

    return {

      title:

        service,

      href:

`${this.options.domain}${this.options.servicePrefix}/${this.slug(service)}`,

      type:

        "service",

    };

  }

  cityLink(city) {

    return {

      title:

        city,

      href:

`${this.options.domain}${this.options.locationPrefix}/${this.slug(city)}`,

      type:

        "location",

    };

  }

  keywordLink(keyword) {

    return {

      title:

        keyword,

      href:

`${this.options.domain}${this.options.blogPrefix}/${this.slug(keyword)}`,

      type:

        "blog",

    };

  }

  buildServiceLinks(blog) {

    if (!blog.service) {

      return [];

    }

    return [

      this.serviceLink(

        blog.service

      ),

    ];

  }

  buildLocationLinks(blog) {

    if (!blog.city) {

      return [];

    }

    return [

      this.cityLink(

        blog.city

      ),

    ];

  }

  buildKeywordLinks(blog) {

    if (

      !Array.isArray(

        blog.keywords

      )

    ) {

      return [];

    }

    return blog.keywords

      .slice(

        0,

        this.options.maxInternalLinks

      )

      .map(

        keyword =>

          this.keywordLink(

            keyword

          )

      );

  }

  removeDuplicates(links = []) {

    return [

      ...new Map(

        links.map(

          link => [

            link.href,

            link,

          ]

        )

      ).values(),

    ];

  }
    scoreLinks(links = []) {

    return links.map(

      (link, index) => ({

        ...link,

        score:

          Math.max(

            100 - index * 5,

            50

          ),

        priority:

          index + 1,

      })

    );

  }

  validateLinks(links = []) {

    const issues = [];

    for (const link of links) {

      if (!link.href) {

        issues.push(

          `Missing href: ${link.title}`

        );

      }

      if (!link.title) {

        issues.push(

          "Missing link title."

        );

      }

    }

    return issues;

  }

  optimizeLinks(links = []) {

    return this

      .scoreLinks(

        this.removeDuplicates(

          links

        )

      )

      .slice(

        0,

        this.options.maxInternalLinks

      );

  }

  buildExternalLinks(blog) {

    const links = [];

    links.push({

      title:

        "Google Maps",

      href:

`https://www.google.com/search?q=${encodeURIComponent(

        `${blog.service} ${blog.city}`

      )}`,

      type:

        "external",

    });

    links.push({

      title:

        "Wikipedia",

      href:

`https://en.wikipedia.org/wiki/${encodeURIComponent(

        blog.city

      )}`,

      type:

        "external",

    });

    return links.slice(

      0,

      this.options.maxExternalLinks

    );

  }

  buildLinkMap(blog) {

    const internal =

      this.optimizeLinks([

        ...this.buildServiceLinks(blog),

        ...this.buildLocationLinks(blog),

        ...this.buildKeywordLinks(blog),

      ]);

    const external =

      this.buildExternalLinks(

        blog

      );

    return {

      internal,

      external,

      issues:

        this.validateLinks(

          internal

        ),

    };

  }

  summary(linkMap) {

    return {

      internalLinks:

        linkMap.internal.length,

      externalLinks:

        linkMap.external.length,

      issues:

        linkMap.issues.length,

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
      "Internal link generation started..."
    );

    const linkMap =
      this.buildLinkMap(
        blog
      );

    const result = {

      blog,

      links:
        linkMap,

      summary:
        this.summary(
          linkMap
        ),

      generatedAt:
        new Date().toISOString(),

    };

    logger.success(
      "Internal link generation completed."
    );

    return result;

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
          "Internal linking",

        stopOnError:
          this.options.stopOnError,

      }

    );

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

      project:
        config.project,

      failures:
        describeFailures(
          failures
        ),

      generatedAt:
        new Date().toISOString(),

      totalBlogs:
        results.length,

      links:
        results.map(
          item => ({
            slug:
              item.blog.slug,
            summary:
              item.summary,
          })
        ),

    };

    const filePath =
      path.join(
        outputDir,
        "internal-links-report.json"
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
      "Internal links report exported."
    );

    return filePath;

  }

}

export async function generateLinks(
  blog,
  options = {}
) {

  const workflow =
    new InternalLinksWorkflow(
      options
    );

  return workflow.run(
    blog
  );

}

export async function generateLinksBatch(
  blogs = [],
  options = {}
) {

  const workflow =
    new InternalLinksWorkflow(
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
    "Internal linking"
  );

  return results;

}

export default InternalLinksWorkflow;