import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class ContentBriefGenerator {

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

          "content-briefs",

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

    topic,

    promptName =

      "content-brief"

  ) {

    const cacheKey =

      `content-brief:${topic.id ?? topic.keyword ?? topic.title}`;

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

          `Content brief cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          topic:

            JSON.stringify(

              topic,

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

    const brief =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      keyword:

        topic.keyword ??

        null,

      title:

        topic.title ??

        "",

      brief,

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

      `Content brief generated: ${topic.keyword ?? topic.title}`

    );

    return result;

  }

  async generateMany(

    topics = [],

    promptName =

      "content-brief"

  ) {

    const results = [];

    for (

      const topic of topics

    ) {

      results.push(

        await this.generate(

          topic,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    topic,

    promptName =

      "content-brief"

  ) {

    const cacheKey =

      `content-brief:${topic.id ?? topic.keyword ?? topic.title}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      topic,

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

export async function generateContentBrief(

  topic,

  promptName = "content-brief",

  options = {}

) {

  const generator =

    new ContentBriefGenerator(

      options

    );

  return generator.generate(

    topic,

    promptName

  );

}

export default ContentBriefGenerator;