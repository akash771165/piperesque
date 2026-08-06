// ============================================================================
// PipeResque AI Base Generator
// File: scripts/ai/core/base-generator.mjs
// Version: 1.0.0
//
// Shared implementation behind every generator in scripts/ai/generators.
// A generator only declares *what* it produces (prompt, cache key, payload,
// result shape); caching, token budgeting, the OpenAI call, validation and
// batch/regenerate helpers all live here.
// ============================================================================

import logger from "../../shared/logger.mjs";

import getOpenAI, { AI_CONFIG } from "../providers/openai.mjs";

import PromptLoader from "../utils/prompt-loader.mjs";
import TokenCounter from "../utils/token-counter.mjs";
import CacheManager from "../utils/cache-manager.mjs";

/**
 * @typedef {Object} GeneratorConfig
 * @property {string}   namespace     Cache namespace.
 * @property {string}   label         Human readable name used in logs.
 * @property {string}   defaultPrompt Prompt template name.
 * @property {number}   [arity]       Number of input arguments (default 1).
 * @property {string}   outputKey     Key the model output is stored under.
 * @property {"json"|"text"} [format] Response parsing mode (default "json").
 * @property {string}   [emptyOutput] Fallback body when the model returns
 *                                    nothing, for json generators.
 * @property {Function} cacheKey      (...inputs) => string
 * @property {Function} promptVars    (...inputs) => Record<string, string>
 * @property {Function} [result]      (...inputs) => Record<string, unknown>
 * @property {Function} [validator]   (output) => { valid, errors }
 * @property {Function} [transform]   (output) => stored value
 */

export class BaseGenerator {
  /** @type {GeneratorConfig} */
  static config = {};

  constructor(options = {}) {
    /** @type {GeneratorConfig} */
    this.config = new.target.config;

    this.client = options.client ?? getOpenAI();
    this.prompts = options.prompts ?? new PromptLoader(options);
    this.tokens = options.tokens ?? new TokenCounter(options);

    this.cache =
      options.cache ??
      new CacheManager({ namespace: this.config.namespace });

    this.options = {
      model: options.model ?? AI_CONFIG.model,
      reasoning: options.reasoning ?? AI_CONFIG.reasoning,
      temperature: options.temperature ?? AI_CONFIG.temperature,
      maxOutputTokens: options.maxOutputTokens ?? AI_CONFIG.maxOutputTokens,
      useCache: options.useCache ?? true,
      ...(this.config.validator
        ? { validate: options.validate ?? true }
        : {}),
      ...options,
    };
  }

  /**
   * Splits `generate`-style arguments into inputs and the prompt name.
   */
  #split(args) {
    const arity = this.config.arity ?? 1;

    return {
      inputs: args.slice(0, arity),
      promptName: args[arity] ?? this.config.defaultPrompt,
    };
  }

  async generate(...args) {
    const { inputs, promptName } = this.#split(args);
    const config = this.config;

    const cacheKey = config.cacheKey(...inputs);

    if (this.options.useCache) {
      const cached = await this.cache.read(cacheKey);

      if (cached) {
        logger.info(`${config.label} cache hit: ${cacheKey}`);
        return cached;
      }
    }

    const prompt = await this.prompts.render(
      promptName,
      config.promptVars(...inputs)
    );

    const budget = this.tokens.budget(prompt, this.options.maxOutputTokens);

    logger.info(`Estimated input tokens: ${budget.inputTokens}`);

    const response = await this.client.responses.create({
      model: this.options.model,
      reasoning: { effort: this.options.reasoning },
      input: prompt,
      max_output_tokens: this.options.maxOutputTokens,
    });

    const output =
      config.format === "text"
        ? response.output_text ?? ""
        : JSON.parse(response.output_text ?? config.emptyOutput ?? "{}");

    if (config.validator && this.options.validate) {
      const validation = config.validator(output);

      if (!validation.valid) {
        throw new Error(validation.errors.join("\n"));
      }
    }

    const result = {
      ...(config.result
        ? config.result(...inputs, { prompt, promptName, cacheKey })
        : {}),
      [config.outputKey]: config.transform ? config.transform(output) : output,
      usage: response.usage ?? {},
      model: this.options.model,
      generatedAt: new Date().toISOString(),
    };

    if (this.options.useCache) {
      await this.cache.write(cacheKey, result);
    }

    logger.success(`${config.label} generated: ${cacheKey}`);

    return result;
  }

  /**
   * Generates for every item in `items`; any trailing arguments (extra
   * inputs, prompt name) are forwarded to `generate` unchanged.
   */
  async generateMany(items = [], ...rest) {
    const results = [];

    for (const item of items) {
      results.push(await this.generate(item, ...rest));
    }

    return results;
  }

  async regenerate(...args) {
    const { inputs } = this.#split(args);

    await this.cache.delete(this.config.cacheKey(...inputs));

    return this.generate(...args);
  }

  estimateCost(prompt) {
    const budget = this.tokens.budget(prompt, this.options.maxOutputTokens);

    return this.tokens.estimateCost(
      budget.inputTokens,
      this.options.maxOutputTokens
    );
  }

  statistics() {
    return {
      model: this.options.model,
      reasoning: this.options.reasoning,
      temperature: this.options.temperature,
      maxOutputTokens: this.options.maxOutputTokens,
      cacheEnabled: this.options.useCache,
      ...(this.config.validator
        ? { validationEnabled: this.options.validate }
        : {}),
      generatedAt: new Date().toISOString(),
    };
  }
}

/**
 * Builds the `generateX(input, ..., promptName, options)` convenience wrapper
 * every generator module exports alongside its class.
 */
export function createGenerateFunction(Generator) {
  const arity = Generator.config.arity ?? 1;

  return async function generate(...args) {
    const inputs = args.slice(0, arity);
    const promptName = args[arity] ?? Generator.config.defaultPrompt;
    const options = args[arity + 1] ?? {};

    return new Generator(options).generate(...inputs, promptName);
  };
}

export default BaseGenerator;
