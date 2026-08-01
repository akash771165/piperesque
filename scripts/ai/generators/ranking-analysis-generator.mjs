import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class RankingAnalysisGenerator {

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

          "ranking-analysis",

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

    rankingData,

    promptName =

      "ranking-analysis"

  ) {

    const cacheKey =

      `ranking-analysis:${rankingData.keyword ?? rankingData.url}`;

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

          `Ranking analysis cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          ranking:

            JSON.stringify(

              rankingData,

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

        rankingData.keyword ??

        null,

      url:

        rankingData.url ??

        null,

      currentPosition:

        rankingData.position ??

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

      `Ranking analysis generated: ${rankingData.keyword ?? rankingData.url}`

    );

    return result;

  }

  async generateMany(

    rankingSets = [],

    promptName =

      "ranking-analysis"

  ) {

    const results = [];

    for (

      const rankingData of rankingSets

    ) {

      results.push(

        await this.generate(

          rankingData,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    rankingData,

    promptName =

      "ranking-analysis"

  ) {

    const cacheKey =

      `ranking-analysis:${rankingData.keyword ?? rankingData.url}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      rankingData,

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

export async function generateRankingAnalysis(

  rankingData,

  promptName = "ranking-analysis",

  options = {}

) {

  const generator =

    new RankingAnalysisGenerator(

      options

    );

  return generator.generate(

    rankingData,

    promptName

  );

}

export default RankingAnalysisGenerator;