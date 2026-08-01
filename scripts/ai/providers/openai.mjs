// ============================================================================
// PipeResque AI Provider
// File: scripts/ai/providers/openai.mjs
// Version: 1.0.0
// ============================================================================

import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

// ----------------------------------------------------------------------------
// Environment Validation
// ----------------------------------------------------------------------------

const REQUIRED_ENV = [
  "OPENAI_API_KEY"
];

for (const key of REQUIRED_ENV) {
  if (!process.env[key]) {
    throw new Error(
      `[AI Provider] Missing environment variable: ${key}`
    );
  }
}

// ----------------------------------------------------------------------------
// AI Configuration
// ----------------------------------------------------------------------------

export const AI_CONFIG = Object.freeze({

  provider: "openai",

  model: "gpt-5.5",

  reasoning: "medium",

  temperature: 0.7,

  maxOutputTokens: 12000,

  timeout: 120000,

  retries: 3,

  stream: false,

  json: true

});

// ----------------------------------------------------------------------------
// Singleton Client
// ----------------------------------------------------------------------------

let client = null;

export function getOpenAI() {

  if (client) return client;

  client = new OpenAI({

    apiKey: process.env.OPENAI_API_KEY,

    timeout: AI_CONFIG.timeout,

    maxRetries: AI_CONFIG.retries

  });

  return client;

}

// ----------------------------------------------------------------------------
// Helpers
// ----------------------------------------------------------------------------

export function getModel() {
  return AI_CONFIG.model;
}

export function getReasoningEffort() {
  return AI_CONFIG.reasoning;
}

export function getTemperature() {
  return AI_CONFIG.temperature;
}

export function getMaxOutputTokens() {
  return AI_CONFIG.maxOutputTokens;
}

export default getOpenAI;