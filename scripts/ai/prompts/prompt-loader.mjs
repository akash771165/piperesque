import fs from "node:fs/promises";

import path from "node:path";

import logger from "../../shared/logger.mjs";

import { isMissingFileError } from "../../shared/errors.mjs";

export class PromptLoader {

  constructor(options = {}) {

    this.basePath =

      options.basePath ??

      path.resolve(

        process.cwd(),

        "scripts/ai/prompts"

      );

    this.cache =

      new Map();

    this.options = {

      useCache:

        options.useCache ??

        true,

      encoding:

        options.encoding ??

        "utf-8",

      ...options,

    };

  }


  async load(

    promptName

  ) {

    if (

      this.options.useCache &&

      this.cache.has(

        promptName

      )

    ) {

      logger.info(

        `Prompt cache hit: ${promptName}`

      );

      return this.cache.get(

        promptName

      );

    }


    const promptPath =

      path.join(

        this.basePath,

        `${promptName}.prompt`

      );


    try {

      const content =

        await fs.readFile(

          promptPath,

          this.options.encoding

        );


      const prompt = {

        name:

          promptName,

        content:

          content.toString(),

        path:

          promptPath,

        loadedAt:

          new Date().toISOString(),

      };


      if (

        this.options.useCache

      ) {

        this.cache.set(

          promptName,

          prompt

        );

      }


      logger.success(

        `Prompt loaded: ${promptName}`

      );


      return prompt;


    } catch (error) {

      logger.error(

        `Prompt loading failed: ${promptName}`,

        error

      );

      throw error;

    }

  }


  async render(

    promptName,

    variables = {}

  ) {

    const prompt =

      await this.load(

        promptName

      );


    let content =

      prompt.content;


    for (

      const [

        key,

        value

      ] of Object.entries(

        variables

      )) {

        const placeholder =

          new RegExp(

            `{{\\s*${key}\\s*}}`,

            "g"

          );


        content =

          content.replace(

            placeholder,

            typeof value === "string"

              ? value

              : JSON.stringify(

                  value,

                  null,

                  2

                )

          );

    }


    const renderedPrompt = {

      name:

        prompt.name,

      content,

      variables,

      generatedAt:

        new Date().toISOString(),

    };


    logger.info(

      `Prompt rendered: ${promptName}`

    );


    return content;

  }


  async exists(

    promptName

  ) {

    const promptPath =

      path.join(

        this.basePath,

        `${promptName}.prompt`

      );


    try {

      await fs.access(

        promptPath

      );

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


  clearCache(

    promptName = null

  ) {

    if (

      promptName

    ) {

      this.cache.delete(

        promptName

      );

      return;

    }


    this.cache.clear();

  }


  statistics() {

    return {

      basePath:

        this.basePath,

      cachedPrompts:

        this.cache.size,

      cacheEnabled:

        this.options.useCache,

      generatedAt:

        new Date().toISOString(),

    };

  }

}

export default PromptLoader;