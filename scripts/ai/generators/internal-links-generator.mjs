import logger from "../../shared/logger.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import CacheManager from "../utils/cache-manager.mjs";
import TokenCounter from "../utils/token-counter.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

export class InternalLinksGenerator {

  constructor(options = {}) {

    this.client =

      options.client ??

      getOpenAI();

    this.prompts =

      options.prompts ??

      new PromptLoader(options);

    this.cache =

      options.cache ??

      new CacheManager({

        namespace:

          "internal-links",

      });

    this.tokens =

      options.tokens ??

      new TokenCounter(options);

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

    page,

    sitemap,

    promptName =

      "internal-links"

  ) {

    const cacheKey =

      `links:${page.slug}`;

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

          `Internal links cache hit: ${page.slug}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          page:

            JSON.stringify(

              page,

              null,

              2

            ),

          sitemap:

            JSON.stringify(

              sitemap,

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

    const links =

      JSON.parse(

        response.output_text ??

        "[]"

      );

    const result = {

      slug:

        page.slug,

      title:

        page.title,

      links,

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

      `Internal links generated: ${page.slug}`

    );

    return result;

  }

  async generateMany(

    pages = [],

    sitemap,

    promptName =

      "internal-links"

  ) {

    const results = [];

    for (

      const page of pages

    ) {

      results.push(

        await this.generate(

          page,

          sitemap,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    page,

    sitemap,

    promptName =

      "internal-links"

  ) {

    const cacheKey =

      `links:${page.slug}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      page,

      sitemap,

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

export async function generateInternalLinks(

  page,

  sitemap,

  promptName = "internal-links",

  options = {}

) {

  const generator =

    new InternalLinksGenerator(

      options

    );

  return generator.generate(

    page,

    sitemap,

    promptName

  );

}

export default InternalLinksGenerator;