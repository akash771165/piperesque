import "dotenv/config";

import fs from "node:fs/promises";
import path from "node:path";

import logger from "../../shared/logger.mjs";
import config from "../../shared/config.mjs";

import {
  publishBlog,
  publishBlogs,
} from "../workflow/publish.mjs";

function banner() {

  console.log("");

  console.log("==============================================");

  console.log("        PipeResque AI Publisher");

  console.log("==============================================");

  console.log(`Project : ${config.project.name}`);

  console.log(`Company : ${config.project.company}`);

  console.log(`Version : ${config.build.VERSION}`);

  console.log("");

}

function help() {

  console.log("");

  console.log("Usage:");

  console.log("");

  console.log("Publish one blog:");

  console.log("");

  console.log('npm run ai:publish -- emergency-plumber-near-me-houston');

  console.log("");

  console.log("Publish multiple blogs:");

  console.log("");

  console.log('npm run ai:publish -- slug1 slug2 slug3');

  console.log("");

}

function validateEnvironment() {

  const required = [

    "OPENAI_API_KEY",

  ];

  const missing = [];

  for (const variable of required) {

    if (!process.env[variable]) {

      missing.push(variable);

    }

  }

  if (missing.length > 0) {

    throw new Error(

      `Missing environment variables: ${missing.join(", ")}`

    );

  }

}

function blogDirectory() {

  return path.join(

    process.cwd(),

    "content",

    "blogs"

  );

}

async function loadBlog(slug) {

  const file = path.join(

    blogDirectory(),

    `${slug}.json`

  );

  const json =

    await fs.readFile(

      file,

      "utf8"

    );

  return JSON.parse(json);

}

async function loadBlogs(slugs) {

  const blogs = [];

  for (const slug of slugs) {

    blogs.push(

      await loadBlog(

        slug

      )

    );

  }

  return blogs;

}

async function publishSingle(slug) {

  logger.info(

    `Loading ${slug}`

  );

  const blog =

    await loadBlog(

      slug

    );

  const result =

    await publishBlog(

      blog,

      {

        overwrite: true,

        publishDrafts: true,

      }

    );

  logger.success(

    `${slug} published successfully.`

  );

  return result;

}

async function publishBatch(slugs) {

  logger.info(

    `Publishing ${slugs.length} blogs...`

  );

  const blogs =

    await loadBlogs(

      slugs

    );

  const results =

    await publishBlogs(

      blogs,

      {

        overwrite: true,

        publishDrafts: true,

      }

    );

  logger.success(

    `${results.length} blogs published.`

  );

  return results;

}
async function main() {

  try {

    banner();

    validateEnvironment();

    const slugs =

      process.argv

        .slice(2)

        .map(

          slug =>

            slug.trim()

        )

        .filter(Boolean);

    if (

      slugs.length === 0

    ) {

      help();

      process.exit(0);

    }

    const startedAt =
      Date.now();

    if (

      slugs.length === 1

    ) {

      await publishSingle(

        slugs[0]

      );

    } else {

      await publishBatch(

        slugs

      );

    }

    const finishedAt =
      Date.now();

    console.log("");

    console.log("==============================================");

    console.log("Publishing Completed Successfully");

    console.log("==============================================");

    console.log(

      `Published : ${slugs.length}`

    );

    console.log(

      `Time      : ${(

        (finishedAt - startedAt) /

        1000

      ).toFixed(2)} sec`

    );

    console.log("");

    process.exit(0);

  } catch (error) {

    logger.error(

      error.message

    );

    console.error("");

    console.error(error);

    console.error("");

    process.exit(1);

  }

}

main();