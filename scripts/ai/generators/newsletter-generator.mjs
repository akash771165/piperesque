import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class NewsletterGenerator {

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

          "newsletter",

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

    newsletter,

    promptName =

      "newsletter"

  ) {

    const cacheKey =

      `newsletter:${newsletter.id ?? newsletter.title ?? newsletter.audience}`;

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

          `Newsletter cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          newsletter:

            JSON.stringify(

              newsletter,

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

    const content =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      id:

        newsletter.id ??

        null,

      title:

        newsletter.title ??

        "",

      audience:

        newsletter.audience ??

        null,

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

      `Newsletter generated: ${newsletter.title ?? newsletter.audience}`

    );

    return result;

  }

  async generateMany(

    newsletters = [],

    promptName =

      "newsletter"

  ) {

    const results = [];

    for (

      const newsletter of newsletters

    ) {

      results.push(

        await this.generate(

          newsletter,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    newsletter,

    promptName =

      "newsletter"

  ) {

    const cacheKey =

      `newsletter:${newsletter.id ?? newsletter.title ?? newsletter.audience}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      newsletter,

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

export async function generateNewsletter(

  newsletter,

  promptName = "newsletter",

  options = {}

) {

  const generator =

    new NewsletterGenerator(

      options

    );

  return generator.generate(

    newsletter,

    promptName

  );

}

export default NewsletterGenerator;