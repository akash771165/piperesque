import logger from "../../shared/logger.mjs";
import config from "../../shared/config.mjs";

import {
  describeFailures,
  runBatch,
  throwIfFailed,
} from "../../shared/batch.mjs";

export class SchemaWorkflow {

  constructor(options = {}) {

    this.options = {

      organization:

        options.organization ??

        config.project.company,

      website:

        options.website ??

        config.project.domain,

      logo:

        options.logo ??

`${config.project.domain}/logo.png`,

      country:

        options.country ??

        "US",

      currency:

        options.currency ??

        "USD",

      telephone:

        options.telephone ??

        "+1-000-000-0000",

      ...options,

    };

  }

  baseContext() {

    return {

      "@context":
        "https://schema.org",

    };

  }

  organizationSchema() {

    return {

      ...this.baseContext(),

      "@type":
        "Organization",

      "@id":
`${this.options.website}#organization`,

      name:
        this.options.organization,

      url:
        this.options.website,

      logo:
        this.options.logo,

      telephone:
        this.options.telephone,

      areaServed:
        this.options.country,

    };

  }

  websiteSchema() {

    return {

      ...this.baseContext(),

      "@type":
        "WebSite",

      "@id":
`${this.options.website}#website`,

      url:
        this.options.website,

      name:
        this.options.organization,

      publisher: {

        "@id":
`${this.options.website}#organization`,

      },

      inLanguage:
        "en",

    };

  }

  webpageSchema(blog) {

    return {

      ...this.baseContext(),

      "@type":
        "WebPage",

      "@id":
`${this.options.website}/blog/${blog.slug}`,

      url:
`${this.options.website}/blog/${blog.slug}`,

      name:
        blog.title,

      description:
        blog.description,

      isPartOf: {

        "@id":
`${this.options.website}#website`,

      },

      about:
        blog.keyword,

    };

  }

  breadcrumbSchema(blog) {

    return {

      ...this.baseContext(),

      "@type":
        "BreadcrumbList",

      itemListElement: [

        {

          "@type":
            "ListItem",

          position: 1,

          name:
            "Home",

          item:
            this.options.website,

        },

        {

          "@type":
            "ListItem",

          position: 2,

          name:
            "Blog",

          item:
`${this.options.website}/blog`,

        },

        {

          "@type":
            "ListItem",

          position: 3,

          name:
            blog.title,

          item:
`${this.options.website}/blog/${blog.slug}`,

        },

      ],

    };

  }

  articleSchema(blog) {

    return {

      ...this.baseContext(),

      "@type":
        "Article",

      headline:
        blog.title,

      description:
        blog.description,

      author: {

        "@type":
          "Organization",

        name:
          this.options.organization,

      },

      publisher: {

        "@id":
`${this.options.website}#organization`,

      },

      datePublished:
        blog.createdAt,

      dateModified:
        blog.updatedAt,

      keywords:
        blog.keyword,

      mainEntityOfPage:
`${this.options.website}/blog/${blog.slug}`,

    };

  }
    faqSchema(blog) {

    return {

      ...this.baseContext(),

      "@type":
        "FAQPage",

      mainEntity:

        (blog.faq ?? []).map(

          item => ({

            "@type":
              "Question",

            name:
              item.question,

            acceptedAnswer: {

              "@type":
                "Answer",

              text:
                item.answer,

            },

          })

        ),

    };

  }

  localBusinessSchema(blog) {

    return {

      ...this.baseContext(),

      "@type":
        "LocalBusiness",

      "@id":
`${this.options.website}#local-business`,

      name:
        this.options.organization,

      url:
        this.options.website,

      telephone:
        this.options.telephone,

      image:
        this.options.logo,

      priceRange:
        "$$",

      areaServed:
        blog.city,

      address: {

        "@type":
          "PostalAddress",

        addressLocality:
          blog.city,

        addressCountry:
          this.options.country,

      },

    };

  }

  serviceSchema(blog) {

    return {

      ...this.baseContext(),

      "@type":
        "Service",

      name:
        blog.service,

      description:
        blog.description,

      provider: {

        "@id":
`${this.options.website}#organization`,

      },

      areaServed:
        blog.city,

      serviceType:
        blog.service,

    };

  }

  buildSchema(blog) {

    return [

      this.organizationSchema(),

      this.websiteSchema(),

      this.webpageSchema(blog),

      this.breadcrumbSchema(blog),

      this.articleSchema(blog),

      this.localBusinessSchema(blog),

      this.serviceSchema(blog),

      ...(blog.faq?.length
        ? [this.faqSchema(blog)]
        : []),

    ];

  }

  validate(schema) {

    if (

      !Array.isArray(
        schema
      )

    ) {

      throw new Error(
        "Schema must be an array."
      );

    }

    return true;

  }

  optimize(schema) {

    return JSON.parse(

      JSON.stringify(
        schema
      )

    );

  }

  buildSummary(schema) {

    return {

      project:
        config.project.name,

      totalSchemas:
        schema.length,

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
      "Schema generation started..."
    );

    const schema =
      this.buildSchema(
        blog
      );

    this.validate(
      schema
    );

    const optimized =
      this.optimize(
        schema
      );

    const result = {

      blog,

      schema:
        optimized,

      summary:
        this.buildSummary(
          optimized
        ),

      generatedAt:
        new Date().toISOString(),

    };

    logger.success(
      "Schema generation completed."
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
          "Schema generation",

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

      schemas:
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
        "schema-report.json"
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
      "Schema report exported."
    );

    return filePath;

  }

}

export async function generateSchema(
  blog,
  options = {}
) {

  const workflow =
    new SchemaWorkflow(
      options
    );

  return workflow.run(
    blog
  );

}

export async function generateSchemaBatch(
  blogs = [],
  options = {}
) {

  const workflow =
    new SchemaWorkflow(
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
    "Schema generation"
  );

  return results;

}

export default SchemaWorkflow;