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

export class LocationGenerator {

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

          "locations",

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

    location,

    research,

    promptName = "location"

  ) {

    const cacheKey =

      `location:${location.slug}`;

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

          `Location cache hit: ${location.slug}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          location:

            JSON.stringify(

              location,

              null,

              2

            ),

          research:

            JSON.stringify(

              research,

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

    const response =       await this.client.responses.create({

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

      location,

      research,

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

      `Location generated: ${location.slug}`

    );

    return result;

  }

  async generateMany(

    locations = [],

    research,

    promptName = "location"

  ) {

    const results = [];

    for (

      const location of locations

    ) {

      results.push(

        await this.generate(

          location,

          research,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    location,

    research,

    promptName = "location"

  ) {

    const cacheKey =

      `location:${location.slug}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      location,

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

export async function generateLocation(

  location,

  research,

  promptName = "location",

  options = {}

) {

  const generator =

    new LocationGenerator(

      options

    );

  return generator.generate(

    location,

    research,

    promptName

  );

}

export default LocationGenerator;