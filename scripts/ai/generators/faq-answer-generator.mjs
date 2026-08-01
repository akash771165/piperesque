import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class FAQAnswerGenerator {

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

          "faq-answer",

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

    faq,

    promptName =

      "faq-answer"

  ) {

    const cacheKey =

      `faq-answer:${faq.id ?? faq.question}`;

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

          `FAQ answer cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          faq:

            JSON.stringify(

              faq,

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

    const answer =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      id:

        faq.id ??

        null,

      question:

        faq.question ??

        "",

      answer,

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

      `FAQ answer generated: ${faq.question}`

    );

    return result;

  }

  async generateMany(

    faqs = [],

    promptName =

      "faq-answer"

  ) {

    const results = [];

    for (

      const faq of faqs

    ) {

      results.push(

        await this.generate(

          faq,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    faq,

    promptName =

      "faq-answer"

  ) {

    const cacheKey =

      `faq-answer:${faq.id ?? faq.question}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      faq,

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

export async function generateFAQAnswer(

  faq,

  promptName = "faq-answer",

  options = {}

) {

  const generator =

    new FAQAnswerGenerator(

      options

    );

  return generator.generate(

    faq,

    promptName

  );

}

export default FAQAnswerGenerator;