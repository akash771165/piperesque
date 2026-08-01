import "dotenv/config";

import logger from "../../shared/logger.mjs";
import config from "../../shared/config.mjs";

import {
  runAIWorkflow,
  runAIWorkflowBatch,
} from "../workflow/index.mjs";

function printBanner() {

  console.log("");

  console.log("===============================================");

  console.log("        PipeResque AI Automation Engine");

  console.log("===============================================");

  console.log(`Project : ${config.project.name}`);

  console.log(`Company : ${config.project.company}`);

  console.log(`Version : ${config.build.VERSION}`);

  console.log(`Engine  : ${config.build.ENGINE}`);

  console.log("");

}

function printHelp() {

  console.log("");

  console.log("Usage:");

  console.log("");

  console.log("Single Keyword:");

  console.log('npm run ai:workflow -- "Emergency Plumbing Houston"');

  console.log("");

  console.log("Multiple Keywords:");

  console.log('npm run ai:workflow -- "Emergency Plumbing Houston" "Drain Cleaning Houston" "Leak Detection Houston"');

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

async function runSingle(keyword) {

  logger.info(

    `Processing keyword: ${keyword}`

  );

  const result =

    await runAIWorkflow(

      keyword,

      {

        language: "en",

        country: "US",

        publish: true,

        deploy: false,

      }

    );

  logger.success(

    `Completed: ${keyword}`

  );

  return result;

}

async function runBatch(keywords) {

  logger.info(

    `Processing ${keywords.length} keywords`

  );

  const results =

    await runAIWorkflowBatch(

      keywords,

      {

        language: "en",

        country: "US",

        publish: true,

        deploy: false,

      }

    );

  logger.success(

    `Completed ${results.length} workflows`

  );

  return results;

}
async function main() {

  try {

    printBanner();

    validateEnvironment();

    const keywords =

      process.argv

        .slice(2)

        .map(

          keyword =>

            keyword.trim()

        )

        .filter(Boolean);

    if (

      keywords.length === 0

    ) {

      printHelp();

      process.exit(0);

    }

    const startedAt =
      Date.now();

    if (

      keywords.length === 1

    ) {

      await runSingle(

        keywords[0]

      );

    } else {

      await runBatch(

        keywords

      );

    }

    const finishedAt =
      Date.now();

    console.log("");

    console.log("===============================================");

    console.log("Workflow Finished Successfully");

    console.log(`Keywords : ${keywords.length}`);

    console.log(

      `Time     : ${(

        (finishedAt - startedAt) /

        1000

      ).toFixed(2)} sec`

    );

    console.log("===============================================");

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