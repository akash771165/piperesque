import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class TagGenerator {

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

          "tags",

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

    content,

    promptName =

      "tags"

  ) {

    const cacheKey =

      `tags:${content.slug ?? content.title}`;

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

          `Tags cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          content:

            JSON.stringify(

              content,

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

    const tags =

      JSON.parse(

        response.output_text ??

        "[]"

      );

    const result = {

      slug:

        content.slug ??

        null,

      title:

        content.title ??

        "",

      tags,

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

      `Tags generated: ${content.slug ?? content.title}`

    );

    return result;

  }

  async generateMany(

    contents = [],

    promptName =

      "tags"

  ) {

    const results = [];

    for (

      const content of contents

    ) {

      results.push(

        await this.generate(

          content,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    content,

    promptName =

      "tags"

  ) {

    const cacheKey =

      `tags:${content.slug ?? content.title}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      content,

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

export async function generateTags(

  content,

  promptName = "tags",

  options = {}

) {

  const generator =

    new TagGenerator(

      options

    );

  return generator.generate(

    content,

    promptName

  );

}

export default TagGenerator;