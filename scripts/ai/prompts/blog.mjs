// ============================================================================
// PipeResque AI Prompt Engine
// File: scripts/ai/prompts/blog.mjs
// Part 1 / 3
// Version: 1.0.0
// ============================================================================

/*
|--------------------------------------------------------------------------
| PURPOSE
|--------------------------------------------------------------------------
|
| This module is the central prompt engine for all AI generated blogs.
|
| Every future blog, city page, service page, FAQ page and comparison page
| should reuse this file.
|
| NEVER hardcode prompts inside generators.
|
| Only generators call functions from here.
|
*/

/* --------------------------------------------------------------------------
 * AI OUTPUT CONTRACT
 * -------------------------------------------------------------------------- */

export const OUTPUT_VERSION = "1.0.0";

export const OUTPUT_FORMAT = "json";

/* --------------------------------------------------------------------------
 * CONTENT QUALITY
 * -------------------------------------------------------------------------- */

export const CONTENT_RULES = Object.freeze({

  language: "English",

  audience: "Homeowners",

  readingLevel: "Grade 7",

  tone: "Professional, Friendly, Helpful",

  grammar: "US English",

  originality: true,

  humanLike: true,

  aiDisclosure: false,

  markdown: false,

  html: false

});

/* --------------------------------------------------------------------------
 * GOOGLE HELPFUL CONTENT
 * -------------------------------------------------------------------------- */

export const GOOGLE_RULES = Object.freeze({

  helpfulContent: true,

  peopleFirst: true,

  eeat: true,

  avoidKeywordStuffing: true,

  avoidClickbait: true,

  avoidFiller: true,

  avoidFluff: true,

  avoidFakeStatistics: true,

  avoidHallucinations: true,

  avoidDuplicateContent: true,

  uniqueExamples: true,

  practicalAdvice: true

});

/* --------------------------------------------------------------------------
 * LOCAL SEO
 * -------------------------------------------------------------------------- */

export const LOCAL_SEO = Object.freeze({

  business: "PipeResque",

  country: "United States",

  state: "Texas",

  primaryLocation: "Houston",

  serviceRadius: 50,

  mentionNearbyAreas: true,

  geoNatural: true,

  localIntent: true,

  mapFriendly: true

});

/* --------------------------------------------------------------------------
 * SEO REQUIREMENTS
 * -------------------------------------------------------------------------- */

export const SEO_RULES = Object.freeze({

  keywordDensityMax: 1.5,

  titleMaxLength: 60,

  descriptionMaxLength: 155,

  paragraphWords: 90,

  headingDepth: 3,

  useSemanticKeywords: true,

  useEntities: true,

  useLSI: true,

  useQuestions: true,

  optimizeFeaturedSnippet: true,

  optimizeVoiceSearch: true

});

/* --------------------------------------------------------------------------
 * INTERNAL LINKING
 * -------------------------------------------------------------------------- */

export const INTERNAL_LINK_RULES = Object.freeze({

  minimumLinks: 4,

  maximumLinks: 8,

  naturalAnchors: true,

  avoidExactMatchSpam: true,

  prioritizeServicePages: true,

  prioritizeCityPages: true,

  prioritizeEmergencyPages: true

});

/* --------------------------------------------------------------------------
 * FAQ RULES
 * -------------------------------------------------------------------------- */

export const FAQ_RULES = Object.freeze({

  minimum: 6,

  maximum: 8,

  conversational: true,

  uniqueAnswers: true,

  localQuestions: true,

  schemaReady: true

});

/* --------------------------------------------------------------------------
 * IMAGE RULES
 * -------------------------------------------------------------------------- */

export const IMAGE_RULES = Object.freeze({

  generatePrompt: true,

  heroImage: true,

  altText: true,

  descriptive: true,

  locationAware: true

});

/* --------------------------------------------------------------------------
 * OUTPUT JSON SCHEMA
 * -------------------------------------------------------------------------- */

export const BLOG_SCHEMA = Object.freeze({

  slug: "string",

  title: "string",

  description: "string",

  keyword: "string",

  city: "string",

  service: "string",

  author: "string",

  readingTime: "number",

  content: "string",

  headings: "array",

  faq: "array",

  internalLinks: "array",

  externalReferences: "array",

  imagePrompt: "string",

  imageAlt: "string",

  seoScore: "number",

  published: "boolean",

  createdAt: "string",

  updatedAt: "string"

});

/* --------------------------------------------------------------------------
 * PROMPT LIMITS
 * -------------------------------------------------------------------------- */

export const LIMITS = Object.freeze({

  minimumWords: 1800,

  idealWords: 2500,

  maximumWords: 3200,

  maximumParagraphs: 40,

  maximumHeadings: 20,

  maximumFAQ: 8

});

/* --------------------------------------------------------------------------
 * SHARED HELPERS
 * -------------------------------------------------------------------------- */

export function safe(value, fallback = "") {

  if (value === undefined) return fallback;

  if (value === null) return fallback;

  return String(value).trim();

}

export function normalizeCity(city) {

  return safe(city);

}

export function normalizeKeyword(keyword) {

  return safe(keyword);

}

export function normalizeService(service) {

  return safe(service);

}

export function createPromptContext({

  keyword,

  city,

  service

}) {

  return {

    keyword: normalizeKeyword(keyword),

    city: normalizeCity(city),

    service: normalizeService(service)

  };

}
/* ============================================================================
 * Prompt Configuration Layer
 * Part 2A-1
 * ========================================================================== */

export const PROMPT_METADATA = Object.freeze({
  version: OUTPUT_VERSION,
  provider: "OpenAI",
  application: "PipeResque",
  locale: "en-US",
  industry: "Residential Plumbing",
  contentType: "Blog"
});

export const STYLE_GUIDE = Object.freeze({
  tone: "Professional",
  voice: "Helpful",
  perspective: "Second person",
  language: "English (US)",
  contractions: true,
  avoidPassiveVoice: true,
  avoidRepetition: true,
  shortParagraphs: true,
  practicalExamples: true
});

export const QUALITY_GUARDS = Object.freeze({
  factualOnly: true,
  avoidInventedStatistics: true,
  avoidMedicalAdvice: true,
  avoidLegalAdvice: true,
  avoidGuarantees: true,
  noFakeReviews: true,
  noFakeTestimonials: true,
  noCompetitorDefamation: true
});

export const SEO_CHECKLIST = Object.freeze({
  includePrimaryKeyword: true,
  includeLocation: true,
  semanticCoverage: true,
  readableHeadings: true,
  conciseMetaDescription: true,
  descriptiveTitle: true
});

export function buildGenerationContext({
  keyword,
  city,
  service
}) {
  return {
    metadata: PROMPT_METADATA,
    style: STYLE_GUIDE,
    quality: QUALITY_GUARDS,
    seo: SEO_CHECKLIST,
    context: createPromptContext({
      keyword,
      city,
      service
    })
  };
}
/* ============================================================================
 * Reusable Instruction Templates
 * Part 2A-2
 * ========================================================================== */

export const INSTRUCTION_LIBRARY = Object.freeze({

  audience:
`Write for homeowners who may have little plumbing knowledge.
Explain technical concepts in plain English.
Prioritize practical guidance over jargon.`,

  structure:
`Organize the article with a clear introduction, descriptive headings,
logical progression, and a concise conclusion.`,

  readability:
`Keep sentences concise.
Prefer active voice.
Avoid unnecessary repetition.
Use short paragraphs whenever possible.`,

  localContext:
`Naturally reference the target city and surrounding service area where relevant.
Do not overuse location names.`,

  factuality:
`Do not invent statistics, certifications, customer reviews, awards,
or pricing information.
If information is uncertain, describe it generally rather than guessing.`,

  helpfulness:
`Answer likely homeowner questions.
Explain why the issue happens,
how it can be recognized,
and when professional assistance is appropriate.`,

  safety:
`Avoid instructions that could create significant risk or property damage.
Recommend professional assistance when specialized tools or expertise are required.`

});

/* -------------------------------------------------------------------------- */
/* Prompt Fragments */
/* -------------------------------------------------------------------------- */

export function buildAudienceInstruction() {
  return INSTRUCTION_LIBRARY.audience;
}

export function buildStructureInstruction() {
  return INSTRUCTION_LIBRARY.structure;
}

export function buildReadabilityInstruction() {
  return INSTRUCTION_LIBRARY.readability;
}

export function buildLocalInstruction() {
  return INSTRUCTION_LIBRARY.localContext;
}

export function buildFactualInstruction() {
  return INSTRUCTION_LIBRARY.factuality;
}

export function buildHelpfulnessInstruction() {
  return INSTRUCTION_LIBRARY.helpfulness;
}

export function buildSafetyInstruction() {
  return INSTRUCTION_LIBRARY.safety;
}

/* -------------------------------------------------------------------------- */
/* Base Prompt Assembly */
/* -------------------------------------------------------------------------- */

export function buildBaseInstructionSet() {

  return [

    buildAudienceInstruction(),

    buildStructureInstruction(),

    buildReadabilityInstruction(),

    buildLocalInstruction(),

    buildFactualInstruction(),

    buildHelpfulnessInstruction(),

    buildSafetyInstruction()

  ].join("\n\n");

}
