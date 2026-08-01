import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class SocialCalendarGenerator {

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

          "social-calendar",

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

      ...options,

    };

  }

  async generate(

    brand,

    promptName =

      "social-calendar"

  ) {

    const cacheKey =

      `social-calendar:${brand.id ?? brand.name ?? brand.topic}`;

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

          `Social calendar cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          brand:

            JSON.stringify(

              brand,

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

    const calendar =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      id:

        brand.id ??

        null,

      name:

        brand.name ??

        "",

      topic:

        brand.topic ??

        null,

      calendar,

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

      `Social calendar generated: ${brand.name ?? brand.topic}`

    );

    return result;

  }

  async generateMany(

    brands = [],

    promptName =

      "social-calendar"

  ) {

    const results = [];

    for (

      const brand of brands

    ) {

      results.push(

        await this.generate(

          brand,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    brand,

    promptName =

      "social-calendar"

  ) {

    const cacheKey =

      `social-calendar:${brand.id ?? brand.name ?? brand.topic}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      brand,

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

      generatedAt:

        new Date().toISOString(),

    };

  }

}

export async function generateSocialCalendar(

  brand,

  promptName = "social-calendar",

  options = {}

) {

  const generator =

    new SocialCalendarGenerator(

      options

    );

  return generator.generate(

    brand,

    promptName

  );

}

export default SocialCalendarGenerator;