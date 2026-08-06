import fs from "node:fs/promises";
import path from "node:path";

import logger from "../../shared/logger.mjs";
import config from "../../shared/config.mjs";

import {
  describeFailures,
  runBatch,
  throwIfFailed,
} from "../../shared/batch.mjs";

import { isMissingFileError } from "../../shared/errors.mjs";

export class PublishWorkflow {

  constructor(options = {}) {

    this.options = {

      outputDirectory:

        options.outputDirectory ??

        path.join(
          process.cwd(),
          "content",
          "blogs"
        ),

      reportDirectory:

        options.reportDirectory ??

        path.join(
          process.cwd(),
          "output"
        ),

      overwrite:

        options.overwrite ??

        false,

      createBackup:

        options.createBackup ??

        true,

      publishDrafts:

        options.publishDrafts ??

        true,

      prettyJson:

        options.prettyJson ??

        true,

      ...options,

    };

  }

  async ensureDirectory(directory) {

    await fs.mkdir(
      directory,
      {
        recursive: true,
      }
    );

  }

  fileName(blog) {

    return `${blog.slug}.json`;

  }

  filePath(blog) {

    return path.join(

      this.options.outputDirectory,

      this.fileName(blog)

    );

  }

  backupPath(blog) {

    return path.join(

      this.options.reportDirectory,

      "backup",

      this.fileName(blog)

    );

  }

  async exists(file) {

    try {

      await fs.access(file);

      return true;

    } catch (error) {

      if (
        !isMissingFileError(error)
      ) {

        throw error;

      }

      return false;

    }

  }

  async createBackup(blog) {

    if (

      !this.options.createBackup

    ) {

      return null;

    }

    const source =

      this.filePath(blog);

    if (

      !(await this.exists(source))

    ) {

      return null;

    }

    const backup =

      this.backupPath(blog);

    await this.ensureDirectory(

      path.dirname(
        backup
      )

    );

    await fs.copyFile(

      source,

      backup

    );

    logger.info(
      `Backup created: ${blog.slug}`
    );

    return backup;

  }

  prepare(blog) {

    const copy =

      JSON.parse(

        JSON.stringify(blog)

      );

    if (

      this.options.publishDrafts

    ) {

      copy.published = true;

    }

    copy.updatedAt =
      new Date().toISOString();

    return copy;

  }

  serialize(blog) {

    return JSON.stringify(

      blog,

      null,

      this.options.prettyJson

        ? 2

        : 0

    );

  }
    async publish(blog) {

    if (!blog) {

      throw new Error(
        "Blog is required."
      );

    }

    logger.info(
      `Publishing: ${blog.slug}`
    );

    await this.ensureDirectory(
      this.options.outputDirectory
    );

    await this.ensureDirectory(
      this.options.reportDirectory
    );

    const file =
      this.filePath(
        blog
      );

    if (
      await this.exists(file)
    ) {

      if (
        !this.options.overwrite
      ) {

          throw new Error(
            `Blog already exists: ${blog.slug}`
          );

      }

      await this.createBackup(
        blog
      );

    }

    const prepared =
      this.prepare(
        blog
      );

    await fs.writeFile(

      file,

      this.serialize(
        prepared
      ),

      "utf8"

    );

    logger.success(
      `Published: ${prepared.slug}`
    );

    return {

      slug:
        prepared.slug,

      file,

      published:
        true,

      updatedAt:
        prepared.updatedAt,

    };

  }

  async publishMany(
    blogs = []
  ) {

    return runBatch(

      blogs,

      blog =>
        this.publish(
          blog
        ),

      {

        label:
          "Publish",

        stopOnError:
          this.options.stopOnError,

      }

    );

  }

  statistics(
    results = [],
    failures = []
  ) {

    return {

      project:
        config.project.name,

      domain:
        config.project.domain,

      totalPublished:
        results.length,

      totalFailed:
        failures.length,

      generatedAt:
        new Date().toISOString(),

    };

  }

  async exportReport(
    results = [],
    failures = []
  ) {

    const report = {

      statistics:
        this.statistics(
          results,
          failures
        ),

      published:
        results,

      failures:
        describeFailures(
          failures
        ),

    };

    const reportFile =
      path.join(

        this.options.reportDirectory,

        "publish-report.json"

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
      "Publish report exported."
    );

    return reportFile;

  }
    async run(blog) {

    const result =
      await this.publish(
        blog
      );

    await this.exportReport([
      result
    ]);

    return result;

  }

  async runMany(
    blogs = []
  ) {

    const { results, failures } =
      await this.publishMany(
        blogs
      );

    await this.exportReport(
      results,
      failures
    );

    throwIfFailed(
      failures,
      blogs.length,
      "Publish"
    );

    return results;

  }

}

export async function publishBlog(
  blog,
  options = {}
) {

  const workflow =
    new PublishWorkflow(
      options
    );

  return workflow.run(
    blog
  );

}

export async function publishBlogs(
  blogs = [],
  options = {}
) {

  const workflow =
    new PublishWorkflow(
      options
    );

  return workflow.runMany(
    blogs
  );

}

export default PublishWorkflow;