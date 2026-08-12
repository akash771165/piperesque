import "dotenv/config";

import logger from "../../shared/logger.mjs";
import config from "../../shared/config.mjs";

import {
  deployProject,
  buildProject,
  deployOnly,
} from "../workflow/deploy.mjs";

function banner() {

  console.log("");

  console.log("==================================================");

  console.log("        PipeResque AI Deployment CLI");

  console.log("==================================================");

  console.log(`Project : ${config.project.name}`);

  console.log(`Company : ${config.project.company}`);

  console.log(`Version : ${config.build.VERSION}`);

  console.log(`Engine  : ${config.build.ENGINE}`);

  console.log("");

}

function help() {

  console.log("");

  console.log("Usage:");

  console.log("");

  console.log("Build + Deploy");

  console.log("");

  console.log("npm run ai:deploy");

  console.log("");

  console.log("Build Only");

  console.log("");

  console.log("npm run ai:deploy -- --build-only");

  console.log("");

  console.log("Deploy Only");

  console.log("");

  console.log("npm run ai:deploy -- --deploy-only");

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

function parseArguments() {

  return {

    buildOnly:

      process.argv.includes(

        "--build-only"

      ),

    deployOnly:

      process.argv.includes(

        "--deploy-only"

      ),

    skipInstall:

      process.argv.includes(

        "--skip-install"

      ),

    skipDeploy:

      process.argv.includes(

        "--skip-deploy"

      ),

    verbose:

      process.argv.includes(

        "--verbose"

      ),

  };

}

async function runDeployment(flags) {

  if (

    flags.buildOnly

  ) {

    logger.info(

      "Running Build Only..."

    );

    return buildProject({

      skipInstall:

        flags.skipInstall,

      verbose:

        flags.verbose,

    });

  }

  if (

    flags.deployOnly

  ) {

    logger.info(

      "Running Deploy Only..."

    );

    return deployOnly({

      verbose:

        flags.verbose,

    });

  }

  logger.info(

    "Running Full Deployment..."

  );

  return deployProject({

    skipInstall:

      flags.skipInstall,

    skipDeploy:

      flags.skipDeploy,

    verbose:

      flags.verbose,

  });

}
async function main() {

  try {

    banner();

    validateEnvironment();

    const flags =

      parseArguments();

    const startedAt =
      Date.now();

    const result =
      await runDeployment(
        flags
      );

    const finishedAt =
      Date.now();

    console.log("");

    console.log("==================================================");

    console.log("Deployment Completed Successfully");

    console.log("==================================================");

    console.log(

      `Success        : ${result.success}`

    );

    console.log(

      `Build Verified : ${result.buildVerified}`

    );

    console.log(

      `Deployed       : ${result.deployed}`

    );

    console.log(

      `Time           : ${(

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