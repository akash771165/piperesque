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

export class HowToSchemaGenerator {

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

          "howto-schema",

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

    howto,

    promptName =

      "howto-schema"

  ) {

    const cacheKey =

      `howto-schema:${howto.slug ?? howto.title}`;

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

          `HowTo schema cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          howto:

            JSON.stringify(

              howto,

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

        howto.slug ??

        null,

      title:

        howto.title ??

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

      `HowTo schema generated: ${howto.slug ?? howto.title}`

    );

    return result;

  }

  async generateMany(

    howtos = [],

    promptName =

      "howto-schema"

  ) {

    const results = [];

    for (

      const howto of howtos

    ) {

      results.push(

        await this.generate(

          howto,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    howto,

    promptName =

      "howto-schema"

  ) {

    const cacheKey =

      `howto-schema:${howto.slug ?? howto.title}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      howto,

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

export async function generateHowToSchema(

  howto,

  promptName = "howto-schema",

  options = {}

) {

  const generator =

    new HowToSchemaGenerator(

      options

    );

  return generator.generate(

    howto,

    promptName

  );

}

export default HowToSchemaGenerator;