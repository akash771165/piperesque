import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class SERPAnalysisGenerator {

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

          "serp-analysis",

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

    serpData,

    promptName =

      "serp-analysis"

  ) {

    const cacheKey =

      `serp-analysis:${serpData.keyword ?? serpData.query}`;

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

          `SERP analysis cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          serp:

            JSON.stringify(

              serpData,

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

    const analysis =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      keyword:

        serpData.keyword ??

        null,

      query:

        serpData.query ??

        null,

      analysis,

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

      `SERP analysis generated: ${serpData.keyword ?? serpData.query}`

    );

    return result;

  }

  async generateMany(

    serpResults = [],

    promptName =

      "serp-analysis"

  ) {

    const results = [];

    for (

      const serpData of serpResults

    ) {

      results.push(

        await this.generate(

          serpData,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    serpData,

    promptName =

      "serp-analysis"

  ) {

    const cacheKey =

      `serp-analysis:${serpData.keyword ?? serpData.query}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      serpData,

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

export async function generateSERPAnalysis(

  serpData,

  promptName = "serp-analysis",

  options = {}

) {

  const generator =

    new SERPAnalysisGenerator(

      options

    );

  return generator.generate(

    serpData,

    promptName

  );

}

export default SERPAnalysisGenerator;