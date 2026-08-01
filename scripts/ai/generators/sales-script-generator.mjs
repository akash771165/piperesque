import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class SalesScriptGenerator {

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

          "sales-script",

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

    salesData,

    promptName =

      "sales-script"

  ) {

    const cacheKey =

      `sales-script:${salesData.id ?? salesData.product ?? salesData.service}`;

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

          `Sales script cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          sales:

            JSON.stringify(

              salesData,

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

    const script =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      id:

        salesData.id ??

        null,

      product:

        salesData.product ??

        null,

      service:

        salesData.service ??

        null,

      script,

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

      `Sales script generated: ${salesData.product ?? salesData.service}`

    );

    return result;

  }

  async generateMany(

    salesSets = [],

    promptName =

      "sales-script"

  ) {

    const results = [];

    for (

      const salesData of salesSets

    ) {

      results.push(

        await this.generate(

          salesData,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    salesData,

    promptName =

      "sales-script"

  ) {

    const cacheKey =

      `sales-script:${salesData.id ?? salesData.product ?? salesData.service}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      salesData,

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

export async function generateSalesScript(

  salesData,

  promptName = "sales-script",

  options = {}

) {

  const generator =

    new SalesScriptGenerator(

      options

    );

  return generator.generate(

    salesData,

    promptName

  );

}

export default SalesScriptGenerator;