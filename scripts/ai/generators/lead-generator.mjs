import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class LeadGenerator {

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

          "lead-generator",

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

    leadData,

    promptName =

      "lead-generator"

  ) {

    const cacheKey =

      `lead-generator:${leadData.id ?? leadData.name ?? leadData.company}`;

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

          `Lead generator cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          lead:

            JSON.stringify(

              leadData,

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

    const leads =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      id:

        leadData.id ??

        null,

      name:

        leadData.name ??

        "",

      company:

        leadData.company ??

        null,

      leads,

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

      `Lead generated: ${leadData.name ?? leadData.company}`

    );

    return result;

  }

  async generateMany(

    leadSets = [],

    promptName =

      "lead-generator"

  ) {

    const results = [];

    for (

      const leadData of leadSets

    ) {

      results.push(

        await this.generate(

          leadData,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    leadData,

    promptName =

      "lead-generator"

  ) {

    const cacheKey =

      `lead-generator:${leadData.id ?? leadData.name ?? leadData.company}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      leadData,

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

export async function generateLead(

  leadData,

  promptName = "lead-generator",

  options = {}

) {

  const generator =

    new LeadGenerator(

      options

    );

  return generator.generate(

    leadData,

    promptName

  );

}

export default LeadGenerator;