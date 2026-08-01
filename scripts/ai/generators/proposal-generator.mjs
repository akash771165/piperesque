import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class ProposalGenerator {

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

          "proposal-generator",

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

    proposalData,

    promptName =

      "proposal-generator"

  ) {

    const cacheKey =

      `proposal-generator:${proposalData.id ?? proposalData.client ?? proposalData.title}`;

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

          `Proposal cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          proposal:

            JSON.stringify(

              proposalData,

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

    const proposal =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      id:

        proposalData.id ??

        null,

      client:

        proposalData.client ??

        "",

      title:

        proposalData.title ??

        "",

      proposal,

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

      `Proposal generated: ${proposalData.client ?? proposalData.title}`

    );

    return result;

  }

  async generateMany(

    proposals = [],

    promptName =

      "proposal-generator"

  ) {

    const results = [];

    for (

      const proposalData of proposals

    ) {

      results.push(

        await this.generate(

          proposalData,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    proposalData,

    promptName =

      "proposal-generator"

  ) {

    const cacheKey =

      `proposal-generator:${proposalData.id ?? proposalData.client ?? proposalData.title}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      proposalData,

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

export async function generateProposal(

  proposalData,

  promptName = "proposal-generator",

  options = {}

) {

  const generator =

    new ProposalGenerator(

      options

    );

  return generator.generate(

    proposalData,

    promptName

  );

}

export default ProposalGenerator;