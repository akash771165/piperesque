import { exec } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs/promises";
import path from "node:path";

import logger from "../../shared/logger.mjs";
import config from "../../shared/config.mjs";

import {
  formatError,
  wrapError,
} from "../../shared/errors.mjs";

const execute = promisify(exec);

export class DeployWorkflow {

  constructor(options = {}) {

    this.options = {

      projectRoot:

        options.projectRoot ??

        process.cwd(),

      buildCommand:

        options.buildCommand ??

        "npm run build",

      deployCommand:

        options.deployCommand ??

        "vercel --prod",

      installCommand:

        options.installCommand ??

        "npm install",

      gitStatusCommand:

        options.gitStatusCommand ??

        "git status --short",

      verifyBuild:

        options.verifyBuild ??

        true,

      verifyGit:

        options.verifyGit ??

        true,

      skipInstall:

        options.skipInstall ??

        false,

      skipDeploy:

        options.skipDeploy ??

        false,

      timeout:

        options.timeout ??

        1000 * 60 * 20,

      ...options,

    };

  }

  async command(command) {

    logger.info(
      command
    );

    let result;

    try {

      result =
        await execute(

          command,

          {

            cwd:

              this.options.projectRoot,

            timeout:

              this.options.timeout,

          }

        );

    } catch (error) {

      /*
        The command output holds the actual reason a build or a
        deployment failed, so it has to travel with the error.
      */

      throw wrapError(

        `Command failed: ${command}\n${error.stderr ?? ""}${error.stdout ?? ""}`,

        error

      );

    }

    return {

      stdout:

        result.stdout,

      stderr:

        result.stderr,

    };

  }

  async installDependencies() {

    if (

      this.options.skipInstall

    ) {

      return;

    }

    logger.info(
      "Installing dependencies..."
    );

    return this.command(

      this.options.installCommand

    );

  }

  async verifyRepository() {

    if (

      !this.options.verifyGit

    ) {

      return;

    }

    logger.info(
      "Checking Git repository..."
    );

    return this.command(

      this.options.gitStatusCommand

    );

  }

  async buildProject() {

    logger.info(
      "Building project..."
    );

    return this.command(

      this.options.buildCommand

    );

  }

  async verifyOutput() {

    if (

      !this.options.verifyBuild

    ) {

      return true;

    }

    const nextFolder =
      path.join(

        this.options.projectRoot,

        ".next"

      );

    try {

      await fs.access(
        nextFolder
      );

    } catch (error) {

      throw wrapError(

        `Build output missing: ${nextFolder}`,

        error

      );

    }

    logger.success(
      ".next build verified."
    );

    return true;

  }
    async deploy() {

    if (

      this.options.skipDeploy

    ) {

      logger.warning(
        "Deployment skipped."
      );

      return {

        deployed: false,

      };

    }

    logger.info(
      "Deploying project..."
    );

    return this.command(

      this.options.deployCommand

    );

  }

  async createReport(result) {

    const outputDirectory =
      path.join(
        this.options.projectRoot,
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

      deployment: {

        success:
          result.success,

        deployed:
          result.deployed,

        buildVerified:
          result.buildVerified,

      },

      timestamps: {

        startedAt:
          result.startedAt,

        finishedAt:
          result.finishedAt,

      },

      commands: {

        install:
          this.options.installCommand,

        build:
          this.options.buildCommand,

        deploy:
          this.options.deployCommand,

      },

      generatedAt:
        new Date().toISOString(),

    };

    const reportFile =
      path.join(
        outputDirectory,
        "deploy-report.json"
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
      "Deployment report created."
    );

    return reportFile;

  }

  async run() {

    const startedAt =
      new Date().toISOString();

    try {

      await this.installDependencies();

      await this.verifyRepository();

      await this.buildProject();

      await this.verifyOutput();

      await this.deploy();

      const finishedAt =
        new Date().toISOString();

      const result = {

        success: true,

        deployed:
          !this.options.skipDeploy,

        buildVerified:
          true,

        startedAt,

        finishedAt,

      };

      await this.createReport(
        result
      );

      logger.success(
        "Deployment workflow completed."
      );

      return result;

    } catch (error) {

      logger.error(
        `Deployment workflow failed: ${formatError(error)}`,
        error
      );

      throw error;

    }

  }
    async runBuildOnly() {

    logger.info(
      "Running build-only workflow..."
    );

    const startedAt =
      new Date().toISOString();

    await this.installDependencies();

    await this.buildProject();

    await this.verifyOutput();

    const finishedAt =
      new Date().toISOString();

    const result = {

      success: true,

      deployed: false,

      buildVerified: true,

      startedAt,

      finishedAt,

    };

    await this.createReport(
      result
    );

    logger.success(
      "Build-only workflow completed."
    );

    return result;

  }

  async runDeployOnly() {

    logger.info(
      "Running deploy-only workflow..."
    );

    const startedAt =
      new Date().toISOString();

    await this.verifyRepository();

    await this.deploy();

    const finishedAt =
      new Date().toISOString();

    const result = {

      success: true,

      deployed: true,

      buildVerified: false,

      startedAt,

      finishedAt,

    };

    await this.createReport(
      result
    );

    logger.success(
      "Deploy-only workflow completed."
    );

    return result;

  }

}

export async function deployProject(
  options = {}
) {

  const workflow =
    new DeployWorkflow(
      options
    );

  return workflow.run();

}

export async function buildProject(
  options = {}
) {

  const workflow =
    new DeployWorkflow(
      options
    );

  return workflow.runBuildOnly();

}

export async function deployOnly(
  options = {}
) {

  const workflow =
    new DeployWorkflow(
      options
    );

  return workflow.runDeployOnly();

}

export default DeployWorkflow;