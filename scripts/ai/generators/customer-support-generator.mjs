import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class CustomerSupportGenerator {

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

          "customer-support",

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

    ticket,

    promptName =

      "customer-support"

  ) {

    const cacheKey =

      `customer-support:${ticket.id ?? ticket.subject ?? ticket.customer}`;

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

          `Customer support cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          ticket:

            JSON.stringify(

              ticket,

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

    const responseData =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      id:

        ticket.id ??

        null,

      customer:

        ticket.customer ??

        null,

      subject:

        ticket.subject ??

        "",

      response:

        responseData,

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

      `Customer support response generated: ${ticket.subject ?? ticket.customer}`

    );

    return result;

  }

  async generateMany(

    tickets = [],

    promptName =

      "customer-support"

  ) {

    const results = [];

    for (

      const ticket of tickets

    ) {

      results.push(

        await this.generate(

          ticket,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    ticket,

    promptName =

      "customer-support"

  ) {

    const cacheKey =

      `customer-support:${ticket.id ?? ticket.subject ?? ticket.customer}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      ticket,

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

export async function generateCustomerSupport(

  ticket,

  promptName = "customer-support",

  options = {}

) {

  const generator =

    new CustomerSupportGenerator(

      options

    );

  return generator.generate(

    ticket,

    promptName

  );

}

export default CustomerSupportGenerator;