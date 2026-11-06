/**
 * Free-First Gemini Client for Autonomous Growth Engine
 * 
 * Uses @google/genai SDK with the free-tier model: gemini-3.8-flash.
 * Features:
 * - Token budget awareness and daily rate limiting
 * - Exponential backoff and retry handling
 * - Fallback generator when API quota is exhausted or key is not provided
 */

import { GoogleGenAI } from "@google/genai";
import { GROWTH_CONFIG } from "./constants.mjs";

export class GeminiGrowthClient {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.modelName = GROWTH_CONFIG.GEMINI_MODEL;
    this.dailyTokenBudget = GROWTH_CONFIG.MAX_GEMINI_TOKENS_PER_DAY;
    this.tokensUsedToday = 0;

    if (this.apiKey) {
      this.ai = new GoogleGenAI({
        apiKey: this.apiKey,
        httpOptions: {
          headers: {
            "User-Agent": "aistudio-build"
          }
        }
      });
      this.isConfigured = true;
    } else {
      this.isConfigured = false;
    }
  }

  /**
   * Generates structured content via Gemini with rate limiting and exponential backoff
   */
  async generateText({ prompt, systemInstruction, maxTokens = 4000, temperature = undefined }) {
    if (!this.isConfigured) {
      console.log("[Gemini Growth] GEMINI_API_KEY not configured. Utilizing deterministic technical research engine.");
      return null;
    }

    if (this.tokensUsedToday >= this.dailyTokenBudget) {
      console.warn(`[Gemini Growth] Daily token budget reached (${this.tokensUsedToday}/${this.dailyTokenBudget}). Falling back to deterministic research.`);
      return null;
    }

    let attempt = 0;
    let delay = GROWTH_CONFIG.BACKOFF_INITIAL_DELAY_MS;

    while (attempt < GROWTH_CONFIG.MAX_RETRY_ATTEMPTS) {
      attempt++;
      try {
        const response = await this.ai.models.generateContent({
          model: this.modelName,
          contents: prompt,
          config: {
            systemInstruction: systemInstruction || "You are a senior technical plumbing researcher and SEO editor for PipeResque, a Houston Texas plumbing referral platform.",
            responseMimeType: "application/json"
          }
        });

        // Track rough token usage
        const text = response.text || "";
        const estimatedTokens = Math.ceil((prompt.length + text.length) / 4);
        this.tokensUsedToday += estimatedTokens;

        return text;
      } catch (err) {
        console.warn(`[Gemini Growth] API attempt ${attempt} failed: ${err.message}`);
        if (attempt >= GROWTH_CONFIG.MAX_RETRY_ATTEMPTS) {
          console.error("[Gemini Growth] All retry attempts exhausted. Falling back to local technical engine.");
          return null;
        }
        await new Promise(res => setTimeout(res, delay));
        delay *= 2;
      }
    }

    return null;
  }
}
