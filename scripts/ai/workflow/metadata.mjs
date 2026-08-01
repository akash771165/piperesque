import logger from "../../shared/logger.mjs";
import config from "../../shared/config.mjs";

export class MetadataWorkflow {

  constructor(options = {}) {

    this.options = {

      siteName:

        options.siteName ??

        config.project.company,

      siteUrl:

        options.siteUrl ??

        config.project.domain,

      locale:

        options.locale ??

        "en_US",

      language:

        options.language ??

        "en",

      twitterSite:

        options.twitterSite ??

        "@PipeResque",

      twitterCreator:

        options.twitterCreator ??

        "@PipeResque",

      defaultImage:

        options.defaultImage ??

`${config.project.domain}/images/og-image.jpg`,

      robots:

        options.robots ??

        "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1",

      ...options,

    };

  }

  normalize(text = "") {

    return text

      .replace(/\s+/g, " ")

      .trim();

  }

  canonicalUrl(blog) {

    return `${this.options.siteUrl}/blog/${blog.slug}`;

  }

  openGraph(blog) {

    return {

      title:
        blog.title,

      description:
        blog.description,

      url:
        this.canonicalUrl(blog),

      siteName:
        this.options.siteName,

      locale:
        this.options.locale,

      type:
        "article",

      images: [

        {

          url:

            blog.image ??

            this.options.defaultImage,

          width: 1200,

          height: 630,

          alt:

            blog.imageAlt ??

            blog.title,

        },

      ],

    };

  }

  twitter(blog) {

    return {

      card:
        "summary_large_image",

      title:
        blog.title,

      description:
        blog.description,

      creator:
        this.options.twitterCreator,

      site:
        this.options.twitterSite,

      images: [

        blog.image ??

        this.options.defaultImage,

      ],

    };

  }

  alternates(blog) {

    return {

      canonical:

        this.canonicalUrl(blog),

      languages: {

        "en-US":

          this.canonicalUrl(blog),

      },

    };

  }

  robots() {

    return {

      index: true,

      follow: true,

      googleBot: {

        index: true,

        follow: true,

        maxSnippet: -1,

        maxImagePreview: "large",

        maxVideoPreview: -1,

      },

    };

  }

  keywords(blog) {

    const keywords = new Set();

    if (blog.keyword)
      keywords.add(blog.keyword);

    if (
      Array.isArray(
        blog.keywords
      )
    ) {

      for (const keyword of blog.keywords) {

        keywords.add(keyword);

      }

    }

    if (blog.city) {

      keywords.add(blog.city);

    }

    if (blog.service) {

      keywords.add(blog.service);

    }

    return [...keywords];

  }

  author(blog) {

    return {

      name:

        blog.author ??

        this.options.siteName,

    };

  }
    buildMetadata(blog) {

    return {

      title:
        blog.title,

      description:
        blog.description,

      applicationName:
        this.options.siteName,

      metadataBase:
        new URL(
          this.options.siteUrl
        ),

      alternates:
        this.alternates(blog),

      robots:
        this.robots(),

      authors: [

        this.author(blog),

      ],

      keywords:
        this.keywords(blog),

      openGraph:
        this.openGraph(blog),

      twitter:
        this.twitter(blog),

      category:
        blog.service ??
        "Plumbing",

      creator:
        this.options.siteName,

      publisher:
        this.options.siteName,

      generator:
        "PipeResque AI Engine",

      referrer:
        "origin-when-cross-origin",

      formatDetection: {

        email: false,

        address: false,

        telephone: false,

      },

    };

  }

  validate(metadata) {

    if (!metadata) {

      throw new Error(
        "Metadata object is required."
      );

    }

    if (!metadata.title) {

      throw new Error(
        "Metadata title missing."
      );

    }

    if (!metadata.description) {

      throw new Error(
        "Metadata description missing."
      );

    }

    return true;

  }

  optimize(metadata) {

    return JSON.parse(

      JSON.stringify(
        metadata
      )

    );

  }

  summary(metadata) {

    return {

      title:
        metadata.title,

      descriptionLength:
        metadata.description.length,

      keywords:

        metadata.keywords.length,

      openGraph:
        true,

      twitter:
        true,

      canonical:

        metadata.alternates.canonical,

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
      "Metadata generation started..."
    );

    const metadata =
      this.buildMetadata(
        blog
      );

    this.validate(
      metadata
    );

    const optimized =
      this.optimize(
        metadata
      );

    const result = {

      blog,

      metadata:
        optimized,

      summary:
        this.summary(
          optimized
        ),

      generatedAt:
        new Date().toISOString(),

    };

    logger.success(
      "Metadata generation completed."
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

      metadata:
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
        "metadata-report.json"
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
      "Metadata report exported."
    );

    return filePath;

  }

}

export async function generateMetadata(
  blog,
  options = {}
) {

  const workflow =
    new MetadataWorkflow(
      options
    );

  return workflow.run(
    blog
  );

}

export async function generateMetadataBatch(
  blogs = [],
  options = {}
) {

  const workflow =
    new MetadataWorkflow(
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

export default MetadataWorkflow;