import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class TopicGenerator {

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

          "topic-generator",

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

    input,

    promptName =

      "topic-generator"

  ) {

    const cacheKey =

      `topic:${input.keyword ?? input.topic ?? "default"}`;

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

          `Topic generator cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          input:

            JSON.stringify(

              input,

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

    const topics =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      keyword:

        input.keyword ??

        null,

      topic:

        input.topic ??

        null,

      topics,

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

      `Topics generated: ${input.keyword ?? input.topic ?? "default"}`

    );

    return result;

  }

  async generateMany(

    inputs = [],

    promptName =

      "topic-generator"

  ) {

    const results = [];

    for (

      const input of inputs

    ) {

      results.push(

        await this.generate(

          input,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    input,

    promptName =

      "topic-generator"

  ) {

    const cacheKey =

      `topic:${input.keyword ?? input.topic ?? "default"}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      input,

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

export async function generateTopics(

  input,

  promptName = "topic-generator",

  options = {}

) {

  const generator =

    new TopicGenerator(

      options

    );

  return generator.generate(

    input,

    promptName

  );

}

export default TopicGenerator;