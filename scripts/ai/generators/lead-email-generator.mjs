import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class LeadEmailGenerator {

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

          "lead-email",

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

    lead,

    promptName =

      "lead-email"

  ) {

    const cacheKey =

      `lead-email:${lead.id ?? lead.email ?? lead.name}`;

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

          `Lead email cache hit: ${cacheKey}`

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

              lead,

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

    const email =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      id:

        lead.id ??

        null,

      name:

        lead.name ??

        "",

      email:

        lead.email ??

        null,

      emailContent:

        email,

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

      `Lead email generated: ${lead.email ?? lead.name}`

    );

    return result;

  }

  async generateMany(

    leads = [],

    promptName =

      "lead-email"

  ) {

    const results = [];

    for (

      const lead of leads

    ) {

      results.push(

        await this.generate(

          lead,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    lead,

    promptName =

      "lead-email"

  ) {

    const cacheKey =

      `lead-email:${lead.id ?? lead.email ?? lead.name}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      lead,

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

export async function generateLeadEmail(

  lead,

  promptName = "lead-email",

  options = {}

) {

  const generator =

    new LeadEmailGenerator(

      options

    );

  return generator.generate(

    lead,

    promptName

  );

}

export default LeadEmailGenerator;