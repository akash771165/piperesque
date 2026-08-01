import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class KeywordClusterGenerator {

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

          "keyword-clusters",

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

    keywords,

    promptName =

      "keyword-cluster"

  ) {

    const cacheKey =

      `keyword-cluster:${keywords.id ?? keywords.topic ?? "default"}`;

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

          `Keyword cluster cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          keywords:

            JSON.stringify(

              keywords,

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

    const clusters =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      topic:

        keywords.topic ??

        null,

      clusters,

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

      `Keyword clusters generated: ${keywords.topic ?? "default"}`

    );

    return result;

  }

  async generateMany(

    keywordSets = [],

    promptName =

      "keyword-cluster"

  ) {

    const results = [];

    for (

      const keywordSet of keywordSets

    ) {

      results.push(

        await this.generate(

          keywordSet,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    keywords,

    promptName =

      "keyword-cluster"

  ) {

    const cacheKey =

      `keyword-cluster:${keywords.id ?? keywords.topic ?? "default"}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      keywords,

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

export async function generateKeywordClusters(

  keywords,

  promptName = "keyword-cluster",

  options = {}

) {

  const generator =

    new KeywordClusterGenerator(

      options

    );

  return generator.generate(

    keywords,

    promptName

  );

}

export default KeywordClusterGenerator;