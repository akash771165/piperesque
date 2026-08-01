import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";

import TokenCounter from "../utils/token-counter.mjs";

import CacheManager from "../utils/cache-manager.mjs";

import {
  validateResponse,
} from "../validators/response-validator.mjs";

export class ContentGenerator {

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

          "content",

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

    research,

    promptName = "blog"

  ) {

    const keyword =

      research.keyword;

    const cacheKey =

      `content:${keyword}`;

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

          `Content cache hit: ${keyword}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          keyword,

          research:

            JSON.stringify(

              research,

              null,

              2

            ),

        }

      );

    const usage =

      this.tokens.budget(

        prompt,

        this.options.maxOutputTokens

      );

    logger.info(

      `Estimated input tokens: ${usage.inputTokens}`

    );

    const response =
      await this.client.responses.create({

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

    const content =

      response.output_text ??

      "";

    if (

      this.options.validate

    ) {

      const validation =

        validateResponse(

          content

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

      keyword,

      prompt,

      content,

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

      `Content generated: ${keyword}`

    );

    return result;

  }

  async generateMany(

    researches = [],

    promptName = "blog"

  ) {

    const results = [];

    for (

      const research of researches

    ) {

      results.push(

        await this.generate(

          research,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    research,

    promptName = "blog"

  ) {

    const cacheKey =

      `content:${research.keyword}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      research,

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

export async function generateContent(

  research,

  promptName = "blog",

  options = {}

) {

  const generator =

    new ContentGenerator(

      options

    );

  return generator.generate(

    research,

    promptName

  );

}

export default ContentGenerator;