import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class LandingPageGenerator {

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

          "landing-page",

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

    page,

    promptName =

      "landing-page"

  ) {

    const cacheKey =

      `landing-page:${page.id ?? page.slug ?? page.title}`;

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

          `Landing page cache hit: ${cacheKey}`

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

    const landingPage =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      id:

        page.id ??

        null,

      slug:

        page.slug ??

        null,

      title:

        page.title ??

        "",

      landingPage,

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

      `Landing page generated: ${page.slug ?? page.title}`

    );

    return result;

  }

  async generateMany(

    pages = [],

    promptName =

      "landing-page"

  ) {

    const results = [];

    for (

      const page of pages

    ) {

      results.push(

        await this.generate(

          page,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    page,

    promptName =

      "landing-page"

  ) {

    const cacheKey =

      `landing-page:${page.id ?? page.slug ?? page.title}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      page,

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

export async function generateLandingPage(

  page,

  promptName = "landing-page",

  options = {}

) {

  const generator =

    new LandingPageGenerator(

      options

    );

  return generator.generate(

    page,

    promptName

  );

}

export default LandingPageGenerator;