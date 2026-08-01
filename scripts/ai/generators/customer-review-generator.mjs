import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class CustomerReviewGenerator {

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

          "customer-review",

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

    business,

    promptName =

      "customer-review"

  ) {

    const cacheKey =

      `customer-review:${business.id ?? business.name ?? business.service}`;

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

          `Customer review cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          business:

            JSON.stringify(

              business,

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

    const reviews =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      id:

        business.id ??

        null,

      name:

        business.name ??

        "",

      service:

        business.service ??

        null,

      reviews,

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

      `Customer reviews generated: ${business.name ?? business.service}`

    );

    return result;

  }

  async generateMany(

    businesses = [],

    promptName =

      "customer-review"

  ) {

    const results = [];

    for (

      const business of businesses

    ) {

      results.push(

        await this.generate(

          business,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    business,

    promptName =

      "customer-review"

  ) {

    const cacheKey =

      `customer-review:${business.id ?? business.name ?? business.service}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      business,

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

export async function generateCustomerReviews(

  business,

  promptName = "customer-review",

  options = {}

) {

  const generator =

    new CustomerReviewGenerator(

      options

    );

  return generator.generate(

    business,

    promptName

  );

}

export default CustomerReviewGenerator;