import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class AdCopyGenerator {

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

          "ad-copy",

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

    campaign,

    promptName =

      "ad-copy"

  ) {

    const cacheKey =

      `ad-copy:${campaign.id ?? campaign.name ?? campaign.product}`;

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

          `Ad copy cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          campaign:

            JSON.stringify(

              campaign,

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

    const adCopy =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      id:

        campaign.id ??

        null,

      name:

        campaign.name ??

        "",

      product:

        campaign.product ??

        null,

      adCopy,

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

      `Ad copy generated: ${campaign.name ?? campaign.product}`

    );

    return result;

  }

  async generateMany(

    campaigns = [],

    promptName =

      "ad-copy"

  ) {

    const results = [];

    for (

      const campaign of campaigns

    ) {

      results.push(

        await this.generate(

          campaign,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    campaign,

    promptName =

      "ad-copy"

  ) {

    const cacheKey =

      `ad-copy:${campaign.id ?? campaign.name ?? campaign.product}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      campaign,

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

export async function generateAdCopy(

  campaign,

  promptName = "ad-copy",

  options = {}

) {

  const generator =

    new AdCopyGenerator(

      options

    );

  return generator.generate(

    campaign,

    promptName

  );

}

export default AdCopyGenerator;