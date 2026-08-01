import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class PressReleaseGenerator {

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

          "press-release",

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

    announcement,

    promptName =

      "press-release"

  ) {

    const cacheKey =

      `press-release:${announcement.id ?? announcement.title ?? announcement.company}`;

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

          `Press release cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          announcement:

            JSON.stringify(

              announcement,

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

    const release =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      id:

        announcement.id ??

        null,

      title:

        announcement.title ??

        "",

      company:

        announcement.company ??

        null,

      release,

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

      `Press release generated: ${announcement.title ?? announcement.company}`

    );

    return result;

  }

  async generateMany(

    announcements = [],

    promptName =

      "press-release"

  ) {

    const results = [];

    for (

      const announcement of announcements

    ) {

      results.push(

        await this.generate(

          announcement,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    announcement,

    promptName =

      "press-release"

  ) {

    const cacheKey =

      `press-release:${announcement.id ?? announcement.title ?? announcement.company}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      announcement,

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

export async function generatePressRelease(

  announcement,

  promptName = "press-release",

  options = {}

) {

  const generator =

    new PressReleaseGenerator(

      options

    );

  return generator.generate(

    announcement,

    promptName

  );

}

export default PressReleaseGenerator;