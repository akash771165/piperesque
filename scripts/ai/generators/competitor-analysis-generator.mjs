import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class CompetitorAnalysisGenerator {

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

          "competitor-analysis",

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

    competitor,

    promptName =

      "competitor-analysis"

  ) {

    const cacheKey =

      `competitor-analysis:${competitor.url ?? competitor.domain}`;

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

          `Competitor analysis cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          competitor:

            JSON.stringify(

              competitor,

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

      url:

        competitor.url ??

        null,

      domain:

        competitor.domain ??

        "",

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

      `Competitor analysis generated: ${competitor.url ?? competitor.domain}`

    );

    return result;

  }

  async generateMany(

    competitors = [],

    promptName =

      "competitor-analysis"

  ) {

    const results = [];

    for (

      const competitor of competitors

    ) {

      results.push(

        await this.generate(

          competitor,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    competitor,

    promptName =

      "competitor-analysis"

  ) {

    const cacheKey =

      `competitor-analysis:${competitor.url ?? competitor.domain}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      competitor,

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

export async function generateCompetitorAnalysis(

  competitor,

  promptName = "competitor-analysis",

  options = {}

) {

  const generator =

    new CompetitorAnalysisGenerator(

      options

    );

  return generator.generate(

    competitor,

    promptName

  );

}

export default CompetitorAnalysisGenerator;