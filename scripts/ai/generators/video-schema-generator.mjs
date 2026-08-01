import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

import {
  validateSchema,
} from "../validators/schema-validator.mjs";

export class VideoSchemaGenerator {

  constructor(options = {}) {

    this.client =

      options.client ??

      getOpenAI();

    this.prompts =

      options.prompts ??

      new PromptLoader(options);

    this.tokens =

      options.tokens ??

      new TokenCounter(options);

    this.cache =

      options.cache ??

      new CacheManager({

        namespace:

          "video-schema",

      });

    this.options = {

      model:

        options.model ??

        AI_CONFIG.model,

      reasoning:

        options.reasoning ??

        AI_CONFIG.reasoning,

      temperature:

        options.temperature ??

        AI_CONFIG.temperature,

      maxOutputTokens:

        options.maxOutputTokens ??

        AI_CONFIG.maxOutputTokens,

      useCache:

        options.useCache ??

        true,

      validate:

        options.validate ??

        true,

      ...options,

    };

  }

  async generate(

    video,

    promptName =

      "video-schema"

  ) {

    const cacheKey =

      `video-schema:${video.slug ?? video.name}`;

    if (

      this.options.useCache

    ) {

      const cached =

        await this.cache.read(

          cacheKey

        );

      if (

        cached

      ) {

        logger.info(

          `Video schema cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          video:

            JSON.stringify(

              video,

              null,

              2

            ),

        }

      );

    const budget =

      this.tokens.budget(

        prompt,

        this.options.maxOutputTokens

      );

    logger.info(

      `Estimated input tokens: ${budget.inputTokens}`

    );

    const response =        await this.client.responses.create({

        model:

          this.options.model,

        reasoning: {

          effort:

            this.options.reasoning,

        },

        input:

          prompt,

        max_output_tokens:

          this.options.maxOutputTokens,

      });

    const schema =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    if (

      this.options.validate

    ) {

      const validation =

        validateSchema(

          schema

        );

      if (

        !validation.valid

      ) {

        throw new Error(

          validation.errors.join(

            "\n"

          )

        );

      }

    }

    const result = {

      slug:

        video.slug ??

        null,

      name:

        video.name ??

        "",

      schema,

      usage:

        response.usage ??

        {},

      model:

        this.options.model,

      generatedAt:

        new Date().toISOString(),

    };

    if (

      this.options.useCache

    ) {

      await this.cache.write(

        cacheKey,

        result

      );

    }

    logger.success(

      `Video schema generated: ${video.slug ?? video.name}`

    );

    return result;

  }

  async generateMany(

    videos = [],

    promptName =

      "video-schema"

  ) {

    const results = [];

    for (

      const video of videos

    ) {

      results.push(

        await this.generate(

          video,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    video,

    promptName =

      "video-schema"

  ) {

    const cacheKey =

      `video-schema:${video.slug ?? video.name}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      video,

      promptName

    );

  }

  estimateCost(prompt) {

    const budget =

      this.tokens.budget(

        prompt,

        this.options.maxOutputTokens

      );

    return this.tokens.estimateCost(

      budget.inputTokens,

      this.options.maxOutputTokens

    );

  }

  statistics() {

    return {

      model:

        this.options.model,

      reasoning:

        this.options.reasoning,

      temperature:

        this.options.temperature,

      maxOutputTokens:

        this.options.maxOutputTokens,

      cacheEnabled:

        this.options.useCache,

      validationEnabled:

        this.options.validate,

      generatedAt:

        new Date().toISOString(),

    };

  }

}

export async function generateVideoSchema(

  video,

  promptName = "video-schema",

  options = {}

) {

  const generator =

    new VideoSchemaGenerator(

      options

    );

  return generator.generate(

    video,

    promptName

  );

}

export default VideoSchemaGenerator;