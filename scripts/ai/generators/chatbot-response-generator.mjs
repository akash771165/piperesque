import logger from "../../shared/logger.mjs";

import getOpenAI, {
  AI_CONFIG,
} from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

export class ChatbotResponseGenerator {

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

          "chatbot-response",

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

    conversation,

    promptName =

      "chatbot-response"

  ) {

    const cacheKey =

      `chatbot-response:${conversation.id ?? conversation.sessionId ?? conversation.message}`;

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

          `Chatbot response cache hit: ${cacheKey}`

        );

        return cached;

      }

    }

    const prompt =

      await this.prompts.render(

        promptName,

        {

          conversation:

            JSON.stringify(

              conversation,

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

    const chatbotResponse =

      JSON.parse(

        response.output_text ??

        "{}"

      );

    const result = {

      id:

        conversation.id ??

        null,

      sessionId:

        conversation.sessionId ??

        null,

      message:

        conversation.message ??

        "",

      response:

        chatbotResponse,

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

      `Chatbot response generated: ${conversation.sessionId ?? conversation.id}`

    );

    return result;

  }

  async generateMany(

    conversations = [],

    promptName =

      "chatbot-response"

  ) {

    const results = [];

    for (

      const conversation of conversations

    ) {

      results.push(

        await this.generate(

          conversation,

          promptName

        )

      );

    }

    return results;

  }
    async regenerate(

    conversation,

    promptName =

      "chatbot-response"

  ) {

    const cacheKey =

      `chatbot-response:${conversation.id ?? conversation.sessionId ?? conversation.message}`;

    await this.cache.delete(

      cacheKey

    );

    return this.generate(

      conversation,

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

export async function generateChatbotResponse(

  conversation,

  promptName = "chatbot-response",

  options = {}

) {

  const generator =

    new ChatbotResponseGenerator(

      options

    );

  return generator.generate(

    conversation,

    promptName

  );

}

export default ChatbotResponseGenerator;