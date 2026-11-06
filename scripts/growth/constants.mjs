/**
 * PipeResque Autonomous Growth Engine - Constants & Configuration
 * 
 * Enforces strict safety limits, file allowlists, scoring thresholds,
 * Houston plumbing topic taxonomies, and zero-PII policies.
 */

export const GROWTH_CONFIG = {
  VERSION: "1.0.0",
  ENGINE_NAME: "PipeResque Autonomous Growth Engine",
  DEFAULT_TIMEZONE: "America/Chicago",
  DEFAULT_LOCALE: "en-US",

  // Quality & Safety Thresholds
  MIN_QUALITY_SCORE: 85, // Minimum score out of 100 required to publish
  MAX_DAILY_PUBLISH_COUNT: 1, // Strict maximum of 1 article per daily cycle
  SIMILARITY_REJECTION_THRESHOLD: 0.40, // Topics with > 40% similarity are rejected as duplicate
  SIMILARITY_IMPROVE_THRESHOLD: 0.28, // Topics between 28% and 40% suggest improving existing page

  // SEO & Editorial Limits
  TITLE_MIN_LENGTH: 25,
  TITLE_MAX_LENGTH: 60,
  DESCRIPTION_MIN_LENGTH: 120,
  DESCRIPTION_MAX_LENGTH: 160,
  CONTENT_MIN_WORDS: 1200,
  CONTENT_MAX_WORDS: 3500,

  // Free-First Rate Limits & Quotas
  GEMINI_MODEL: "gemini-3.8-flash",
  MAX_GEMINI_TOKENS_PER_DAY: 150000,
  API_REQUEST_TIMEOUT_MS: 30000,
  MAX_RETRY_ATTEMPTS: 3,
  BACKOFF_INITIAL_DELAY_MS: 1500,

  // Official Houston Entities & Regulatory Anchors
  REGULATORY_BODIES: [
    {
      name: "Texas State Board of Plumbing Examiners (TSBPE)",
      code: "Texas Occupations Code Chapter 1301",
      url: "https://tsbpe.texas.gov"
    },
    {
      name: "City of Houston Building Code Enforcement (Plumbing Inspections)",
      code: "Houston Amendments to 2021 Uniform Plumbing Code (UPC)",
      url: "https://www.houstonpermittingcenter.org"
    },
    {
      name: "Harris County Public Infrastructure Department",
      code: "Harris County Plumbing Regulations",
      url: "https://hcpid.net"
    }
  ],

  // Priority Greater Houston Municipalities & Sub-markets
  PRIMARY_SERVICE_AREAS: [
    "Houston",
    "Katy",
    "Sugar Land",
    "The Woodlands",
    "Pearland",
    "Spring",
    "Cypress",
    "Pasadena",
    "Missouri City",
    "Tomball",
    "Friendswood",
    "League City",
    "Humble",
    "Bellaire",
    "Kingwood",
    "Richmond",
    "Rosenberg",
    "Stafford",
    "Fulshear",
    "Jersey Village"
  ],

  // Core Service Taxonomy
  CORE_SERVICE_TAXONOMY: [
    "emergency-plumbing",
    "drain-cleaning",
    "water-heater-repair",
    "tankless-water-heater-repair",
    "leak-detection",
    "pipe-repair",
    "sewer-line-repair",
    "toilet-repair",
    "garbage-disposal-repair",
    "gas-line-repair",
    "hydro-jetting",
    "slab-leak-repair",
    "water-softener-installation",
    "backflow-testing"
  ]
};

// Strict File Allowlist - Autonomous engine can ONLY write to these paths
export const PERMITTED_FILE_PATTERNS = [
  /^content\/blogs\/[a-z0-9-]+\.json$/,
  /^content\/growth\/[a-z0-9_-]+\.json$/,
  /^content\/growth\/backups\/.*$/,
  /^content\/seo\/page-opportunity-manifest\.json$/,
  /^reports\/daily\/[0-9]{4}-[0-9]{2}-[0-9]{2}\.md$/,
  /^reports\/daily\/latest\.json$/,
  /^public\/sitemap\.xml$/
];

// Explicitly Forbidden File Patterns - Immediate abort if touched
export const PROHIBITED_FILE_PATTERNS = [
  /^\.env/,
  /^\.github\/workflows/,
  /^package(-lock)?\.json$/,
  /^tsconfig\.json$/,
  /^next\.config/,
  /^app\/terms/,
  /^app\/privacy-policy/,
  /^lib\/analytics\/track\.ts$/,
  /\.(pem|key|crt)$/
];

// Verified Contact Points (Canonical)
export const CANONICAL_CONTACT = {
  PHONE: "(877) 364-0861",
  PHONE_URL: "tel:+18773640861",
  EMAIL: "resquepipe@gmail.com",
  EMAIL_URL: "mailto:resquepipe@gmail.com",
  BRAND: "PipeResque",
  DOMAIN: "https://www.piperesque.com",
  ROLE: "Plumbing Referral and Informational Platform"
};
