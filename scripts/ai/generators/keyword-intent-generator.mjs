import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class KeywordIntentGenerator {

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

          "keyword-intent",

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

    keyword,

    promptName =

      "keyword-intent"

  ) {

    const cacheKey =

      `keyword-intent:${keyword.term ?? keyword.keyword}`;

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

          `Keyword intent cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          keyword:

            JSON.stringify(

              keyword,

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

    const intent =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      keyword:

        keyword.term ??

        keyword.keyword ??

        null,

      intent,

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

      `Keyword intent generated: ${keyword.term ?? keyword.keyword}`

    );

    return result;

  }

  async generateMany(

    keywords = [],

    promptName =

      "keyword-intent"

  ) {

    const results = [];

    for (

      const keyword of keywords

    ) {

      results.push(

        await this.generate(

          keyword,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    keyword,

    promptName =

      "keyword-intent"

  ) {

    const cacheKey =

      `keyword-intent:${keyword.term ?? keyword.keyword}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      keyword,

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

export async function generateKeywordIntent(

  keyword,

  promptName = "keyword-intent",

  options = {}

) {

  const generator =

    new KeywordIntentGenerator(

      options

    );

  return generator.generate(

    keyword,

    promptName

  );

}

export default KeywordIntentGenerator;