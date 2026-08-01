import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

import {
  validateSEO,
} from "../validators/seo-validator.mjs";

export class SEOAuditGenerator {

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

          "seo-audit",

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

      validate:

        options.validate ??

        true,

      ...options,

    };

  }

  async generate(

    website,

    promptName =

      "seo-audit"

  ) {

    const cacheKey =

      `seo-audit:${website.url ?? website.domain}`;

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

          `SEO audit cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          website:

            JSON.stringify(

              website,

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

    const audit =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    if (

      this.options.validate

    ) {

      const validation =

        validateSEO(

          audit

        );

      if (

        !validation.valid

      ) {

        throw new Error(

          validation.errors.join(

            "\n"

          )

        );

      }

    }

    const result = {

      url:

        website.url ??

        null,

      domain:

        website.domain ??

        "",

      audit,

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

      `SEO audit generated: ${website.url ?? website.domain}`

    );

    return result;

  }

  async generateMany(

    websites = [],

    promptName =

      "seo-audit"

  ) {

    const results = [];

    for (

      const website of websites

    ) {

      results.push(

        await this.generate(

          website,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    website,

    promptName =

      "seo-audit"

  ) {

    const cacheKey =

      `seo-audit:${website.url ?? website.domain}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      website,

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

      validationEnabled:

        this.options.validate,

      generatedAt:

        new Date().toISOString(),

    };

  }

}

export async function generateSEOAudit(

  website,

  promptName = "seo-audit",

  options = {}

) {

  const generator =

    new SEOAuditGenerator(

      options

    );

  return generator.generate(

    website,

    promptName

  );

}

export default SEOAuditGenerator;