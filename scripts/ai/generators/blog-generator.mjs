import { spawnSync } from 'node:child_process';

// ======================================================
// CONFIG
// ======================================================

const SITE_URL = 'https://piperesque.com';
const COMPANY_NAME = 'Pipe Rescue';
const PHONE = '(713) 555-0148';
const DEFAULT_CITY = 'Houston';

// ======================================================
// TEXT HELPERS
// ======================================================

function cleanAnsi(text = '') {
  return text.replace(
    // eslint-disable-next-line no-control-regex
    /[\u001B\u009B][[\]()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-ORZcf-nqry=><]/g,
    ''
  );
}

function removeRepeatedLines(text = '') {
  const seen = new Set();

  return text
    .split('\n')
    .filter((line) => {
      const key = line.trim();
      if (!key) return true;

      if (seen.has(key)) return false;

      seen.add(key);
      return true;
    })
    .join('\n');
}

function normalizeWhitespace(text = '') {
  return text
    .replace(/\r\n/g, '\n')
    .replace(/\t/g, ' ')
    .replace(/[ ]{2,}/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

function sanitizeMarkdown(text = '') {
  return text
    .replace(/\*\*\s+\*\*/g, '')
    .replace(/\n-{3,}\n/g, '\n---\n')
    .trim();
}

// ======================================================
// SLUG
// ======================================================

function slugify(text = '') {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

// ======================================================
// SEO HELPERS
// ======================================================

function trimToWordBoundary(text, maxLength) {
  if (text.length <= maxLength) return text;

  const trimmed = text.slice(0, maxLength);
  const lastSpace = trimmed.lastIndexOf(' ');

  return `${trimmed.slice(0, lastSpace > 0 ? lastSpace : maxLength).trim()}...`;
}

function buildSeoMeta({ title, keyword, city }) {
  let metaTitle = `${title} | 24/7 Plumbing Help in ${city}, TX`;

  if (metaTitle.length > 60) {
    metaTitle = trimToWordBoundary(`${title} | ${city} Plumber`, 60);
  }

  const metaDescription = trimToWordBoundary(
    `${keyword} in ${city}, Texas. Fast 24/7 plumbing help from ${COMPANY_NAME}. Emergency service, drain backups, burst pipes, leaks, and water heater repairs. Call ${PHONE}.`,
    155
  );

  return { metaTitle, metaDescription };
}

function buildCanonicalUrl(slug) {
  return `${SITE_URL}/blog/${slug}`;
}

// ======================================================
// CONTENT QUALITY
// ======================================================

function estimateReadingTime(text = '') {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

function countKeywordOccurrences(text = '', keyword = '') {
  if (!keyword) return 0;

  const regex = new RegExp(
    keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    'gi'
  );

  return (text.match(regex) || []).length;
}

function validateContent(text) {
  if (!text || text.length < 1200) {
    throw new Error('Generated article is too short');
  }

  const headings = text.match(/^##\s+/gm) || [];

  if (headings.length < 5) {
    throw new Error('Generated article has insufficient structure');
  }
}

// ======================================================
// FRONTMATTER
// ======================================================

function buildFrontmatter({
  title,
  slug,
  metaTitle,
  metaDescription,
  city,
  readingTime,
  canonicalUrl,
}) {
  const date = new Date().toISOString().split('T')[0];

  return `---
title: "${title.replace(/"/g, '\\"')}"
slug: "${slug}"
description: "${metaDescription.replace(/"/g, '\\"')}"
metaTitle: "${metaTitle.replace(/"/g, '\\"')}"
metaDescription: "${metaDescription.replace(/"/g, '\\"')}"
canonical: "${canonicalUrl}"
city: "${city}"
author: "${COMPANY_NAME}"
date: "${date}"
readingTime: ${readingTime}
published: true
---\n\n`;
}

// ======================================================
// INTERNAL LINKS
// ======================================================

function buildInternalLinks(city) {
  return `

---

## Related Plumbing Services

- [Emergency Plumbing](/services/emergency-plumbing)
- [Drain Cleaning](/services/drain-cleaning)
- [Water Heater Repair](/services/water-heater-repair)
- [Leak Detection](/services/leak-detection)
- [Houston Service Area](/service-areas/houston)

Need help now? Call **${PHONE}** for 24/7 emergency plumbing assistance in **${city}, Texas**.
`;
}

// ======================================================
// PROMPT BUILDER
// ======================================================

function buildPrompt({ title, keyword, city }) {
  return `You are an expert local SEO copywriter for a plumbing company.

Write a detailed blog post for homeowners in ${city}, Texas.

Requirements:
- Title: ${title}
- Primary keyword: ${keyword}
- Mention ${city} naturally throughout the article.
- Minimum 1500 words.
- Use clear H2 and H3 headings.
- Include practical homeowner advice.
- Include emergency plumbing guidance.
- Include water damage prevention tips.
- Include a short FAQ section with 4 questions.
- Include a conclusion with a call to action.
- Do not use generic filler text.
- Do not mention AI.
- Write in professional American English.
- Return only valid Markdown content.`;
}
// ======================================================
// SCHEMA GENERATION
// ======================================================

function buildArticleSchema({
  title,
  slug,
  metaDescription,
  date,
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: metaDescription,
    datePublished: date,
    dateModified: date,
    author: {
      '@type': 'Organization',
      name: COMPANY_NAME,
    },
    publisher: {
      '@type': 'Organization',
      name: COMPANY_NAME,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${SITE_URL}/blog/${slug}`,
    },
  };
}

// ======================================================
// OLLAMA RUNNER
// ======================================================

function runOllama(prompt, model = 'llama3.1:8b') {
  const result = spawnSync(
    'ollama',
    ['run', model, prompt],
    {
      encoding: 'utf8',
      maxBuffer: 30 * 1024 * 1024,
      windowsHide: true,
      timeout: 1000 * 60 * 8, // 8 minutes
    }
  );

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(result.stderr || 'Ollama generation failed');
  }

  return result.stdout || '';
}

// ======================================================
// RETRY WRAPPER
// ======================================================

function generateWithRetry(prompt, retries = 2) {
  let lastError;

  for (let attempt = 1; attempt <= retries + 1; attempt += 1) {
    try {
      return runOllama(prompt);
    } catch (error) {
      lastError = error;
      console.warn(`Generation attempt ${attempt} failed: ${error.message}`);
    }
  }

  throw lastError;
}

// ======================================================
// MAIN GENERATOR
// ======================================================

export async function generateBlog({
  title,
  keyword,
  city = DEFAULT_CITY,
}) {
  if (!title) {
    throw new Error('Title is required');
  }

  if (!keyword) {
    throw new Error('Keyword is required');
  }

  const prompt = buildPrompt({ title, keyword, city });

  let content = generateWithRetry(prompt);

  content = cleanAnsi(content);
  content = removeRepeatedLines(content);
  content = normalizeWhitespace(content);
  content = sanitizeMarkdown(content);

  validateContent(content);

  const slug = slugify(keyword);

  const { metaTitle, metaDescription } = buildSeoMeta({
    title,
    keyword,
    city,
  });

  const canonicalUrl = buildCanonicalUrl(slug);

  const readingTime = estimateReadingTime(content);

  const frontmatter = buildFrontmatter({
    title,
    slug,
    metaTitle,
    metaDescription,
    city,
    readingTime,
    canonicalUrl,
  });

  const internalLinks = buildInternalLinks(city);

  const finalContent = frontmatter + content + internalLinks;

  const keywordCount = countKeywordOccurrences(finalContent, keyword);

  const date = new Date().toISOString().split('T')[0];

  const articleSchema = buildArticleSchema({
    title,
    slug,
    metaDescription,
    date,
  });

  return {
    title,
    slug,
    metaTitle,
    metaDescription,
    canonicalUrl,
    readingTime,
    keywordCount,
    schema: articleSchema,
    content: finalContent,
  };
}

// ======================================================
// DEFAULT EXPORT
// ======================================================

export default generateBlog;

// ======================================================
// CLI SUPPORT
// Usage:
// node blog-generator.mjs "Title" "Keyword" "City"
// ======================================================

if (process.argv[1] && process.argv[1].endsWith('blog-generator.mjs')) {
  const [, , titleArg, keywordArg, cityArg] = process.argv;

  if (titleArg && keywordArg) {
    generateBlog({
      title: titleArg,
      keyword: keywordArg,
      city: cityArg || DEFAULT_CITY,
    })
      .then((result) => {
        console.log(result.content);
      })
      .catch((error) => {
        console.error(error);
        process.exit(1);
      });
  }
}