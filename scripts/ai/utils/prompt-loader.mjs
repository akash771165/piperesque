import fs from "node:fs/promises";
import path from "node:path";

import logger from "../../shared/logger.mjs";
import CacheManager from "./cache-manager.mjs";

import {
  runBatch,
  throwIfFailed,
} from "../../shared/batch.mjs";

import { isMissingFileError } from "../../shared/errors.mjs";

export class PromptLoader {

  constructor(options = {}) {

    this.options = {

      promptDirectory:

        options.promptDirectory ??

        path.join(
          process.cwd(),
          "scripts",
          "ai",
          "prompts"
        ),

      extension:

        options.extension ??

        ".mjs",

      cache:

        options.cache ??

        true,

      strict:

        options.strict ??

        true,

      ...options,

    };

    this.cache =

      new CacheManager({

        namespace:

          "prompts",

      });

  }

  normalize(name) {

    return name

      .trim()

      .toLowerCase();

  }

  file(name) {

    return path.join(

      this.options.promptDirectory,

      `${this.normalize(name)}${this.options.extension}`

    );

  }

  async exists(name) {

    try {

      await fs.access(

        this.file(name)

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

  async load(name) {

    if (

      this.options.cache

    ) {

      const cached =

        await this.cache.read(name);

      if (

        cached

      ) {

        return cached;

      }

    }

    const file =

      this.file(name);

    if (

      !(await this.exists(name))

    ) {

      throw new Error(

        `Prompt not found: ${name}`

      );

    }

    const loaded =

      await import(file);

    const prompt =

      loaded.default ??

      loaded.prompt ??

      loaded;

    this.validate(

      prompt,

      name

    );

    if (

      this.options.cache

    ) {

      await this.cache.write(

        name,

        prompt

      );

    }

    logger.success(

      `Prompt Loaded: ${name}`

    );

    return prompt;

  }

  async render(

    name,

    variables = {}

  ) {

    const prompt =

      await this.load(

        name

      );

    if (

      typeof prompt ===

      "function"

    ) {

      return prompt(

        variables

      );

    }

    let rendered =

      String(prompt);

    for (

      const [

        key,

        value

      ] of Object.entries(

        variables

      )

    ) {

      rendered =

        rendered.replaceAll(

          `{{${key}}}`,

          String(value)

        );

    }

    return rendered;

  }

  validate(

    prompt,

    name = "unknown"

  ) {

    if (

      prompt ===

      undefined ||

      prompt ===

      null

    ) {

      throw new Error(

        `Prompt "${name}" is empty.`

      );

    }

    if (

      typeof prompt !==

        "string" &&

      typeof prompt !==

        "function"

    ) {

      throw new Error(

        `Prompt "${name}" must export a string or function.`

      );

    }

    return true;

  }

  async list() {

    const files =

      await fs.readdir(

        this.options.promptDirectory

      );

    return files

      .filter(

        file =>

          file.endsWith(

            this.options.extension

          )

      )

      .map(

        file =>

          path.basename(

            file,

            this.options.extension

          )

      );

  }

  async preload() {

    const prompts =

      await this.list();

    const { results, failures } =

      await runBatch(

        prompts,

        async prompt => {

          await this.load(

            prompt

          );

          return prompt;

        },

        {

          label: "Prompt preload",

        }

      );

    throwIfFailed(

      failures,

      prompts.length,

      "Prompt preload"

    );

    return results;

  }
    async clearCache() {

    await this.cache.clearNamespace();

    logger.success(
      "Prompt cache cleared."
    );

    return true;

  }

  async reload(name) {

    if (
      this.options.cache
    ) {

      await this.cache.delete(
        name
      );

    }

    return this.load(
      name
    );

  }

  async metadata(name) {

    const file =
      this.file(name);

    const stats =
      await fs.stat(file);

    return {

      name,

      file,

      extension:
        this.options.extension,

      size:
        stats.size,

      createdAt:
        stats.birthtime,

      updatedAt:
        stats.mtime,

      cached:
        this.options.cache,

    };

  }

  async search(keyword = "") {

    const prompts =
      await this.list();

    const value =
      keyword
        .trim()
        .toLowerCase();

    return prompts.filter(

      prompt =>

        prompt
          .toLowerCase()
          .includes(value)

    );

  }

  async exportManifest() {

    const prompts =
      await this.list();

    return {

      generatedAt:
        new Date().toISOString(),

      total:
        prompts.length,

      prompts,

    };

  }

}

export default PromptLoader;