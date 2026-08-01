import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class TestimonialGenerator {

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

          "testimonial",

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

    customer,

    promptName =

      "testimonial"

  ) {

    const cacheKey =

      `testimonial:${customer.id ?? customer.name ?? customer.service}`;

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

          `Testimonial cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          customer:

            JSON.stringify(

              customer,

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

    const testimonial =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      id:

        customer.id ??

        null,

      name:

        customer.name ??

        "",

      service:

        customer.service ??

        null,

      testimonial,

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

      `Testimonial generated: ${customer.name ?? customer.service}`

    );

    return result;

  }

  async generateMany(

    customers = [],

    promptName =

      "testimonial"

  ) {

    const results = [];

    for (

      const customer of customers

    ) {

      results.push(

        await this.generate(

          customer,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    customer,

    promptName =

      "testimonial"

  ) {

    const cacheKey =

      `testimonial:${customer.id ?? customer.name ?? customer.service}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      customer,

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

export async function generateTestimonial(

  customer,

  promptName = "testimonial",

  options = {}

) {

  const generator =

    new TestimonialGenerator(

      options

    );

  return generator.generate(

    customer,

    promptName

  );

}

export default TestimonialGenerator;