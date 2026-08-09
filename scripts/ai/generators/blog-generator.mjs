import { spawnSync } from 'node:child_process';

// =====================================================
// CONFIG
// =====================================================

const SITE_URL = 'https://piperesque.com';
const COMPANY_NAME = 'Pipe Rescue';
const PHONE = '(877) 364-0861';
const DEFAULT_CITY = 'Houston';

// =====================================================
// TEXT HELPERS
// =====================================================

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

// =====================================================
// SLUG
// =====================================================

function slugify(text = '') {
  return text
    .toLowerCase()
    .trim()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

// =====================================================
// SEO HELPERS
// =====================================================

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

// =====================================================
// CONTENT QUALITY
// =====================================================

function estimateReadingTime(text = '') {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
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

// =====================================================
// FRONTMATTER
// =====================================================

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

// =====================================================
// PROFESSIONAL BLOG LAYOUT
// =====================================================

function buildBlogWrapper({ title, city, readingTime }) {
  return `
<div class="mx-auto max-w-4xl px-4 py-10">

<div class="mb-8 rounded-3xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white p-8 shadow-sm">
  <p class="mb-2 text-sm font-semibold uppercase tracking-wide text-blue-700">Houston Plumbing Guide</p>
  <h1 class="text-4xl font-bold leading-tight text-gray-900 md:text-5xl">${title}</h1>
  <div class="mt-4 flex flex-wrap items-center gap-3 text-sm text-gray-600">
    <span>📍 ${city}, Texas</span>
    <span>•</span>
    <span>⏱️ ${readingTime} min read</span>
    <span>•</span>
    <span>✍️ ${COMPANY_NAME}</span>
  </div>
</div>

<div class="mb-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
  <h2 class="mb-3 text-lg font-semibold text-gray-900">Quick Navigation</h2>
  <div class="text-sm text-gray-700">
    The sections below will be generated automatically by the AI article.
  </div>
</div>

<article class="prose prose-lg max-w-none prose-headings:scroll-mt-24 prose-headings:text-gray-900 prose-p:text-gray-700 prose-li:text-gray-700 prose-a:text-blue-700 hover:prose-a:text-blue-800 prose-strong:text-gray-900">
`;
}

function buildBlogFooter(city) {
  return `
</article>

<div class="mt-12 rounded-3xl bg-blue-700 p-8 text-white shadow-lg">
  <h2 class="mb-3 text-2xl font-bold">Need a Plumber in ${city} Right Now?</h2>
  <p class="mb-6 text-blue-100">
    ${COMPANY_NAME} provides 24/7 emergency plumbing services across ${city}, Texas.
    Fast response, transparent pricing, and experienced local plumbers.
  </p>
  <div class="flex flex-wrap gap-3">
    <a href="tel:${PHONE.replace(/[^0-9]/g, '')}"
       class="inline-flex items-center justify-center rounded-xl bg-white px-5 py-3 text-sm font-semibold text-blue-700 shadow hover:bg-blue-50">
      📞 Call ${PHONE}
    </a>
    <a href="/contact"
       class="inline-flex items-center justify-center rounded-xl border border-white/30 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10">
      Request Service
    </a>
  </div>
</div>

<div class="mt-10 rounded-2xl border border-gray-200 bg-white p-6">
  <h3 class="mb-4 text-xl font-semibold text-gray-900">Related Plumbing Services</h3>
  <div class="grid gap-3 sm:grid-cols-2">
    <a class="rounded-xl border border-gray-200 p-4 transition hover:border-blue-300 hover:bg-blue-50" href="/services/emergency-plumbing">Emergency Plumbing</a>
    <a class="rounded-xl border border-gray-200 p-4 transition hover:border-blue-300 hover:bg-blue-50" href="/services/drain-cleaning">Drain Cleaning</a>
    <a class="rounded-xl border border-gray-200 p-4 transition hover:border-blue-300 hover:bg-blue-50" href="/services/water-heater-repair">Water Heater Repair</a>
    <a class="rounded-xl border border-gray-200 p-4 transition hover:border-blue-300 hover:bg-blue-50" href="/services/leak-detection">Leak Detection</a>
  </div>
</div>

</div>
`;
}

// =====================================================
// PROMPT BUILDER
// =====================================================

function buildPrompt({ title, keyword, city }) {
  return `You are an expert local SEO copywriter for a plumbing company.

Write a premium long-form blog post for homeowners in ${city}, Texas.

Article requirements:
- Title: ${title}
- Primary keyword: ${keyword}
- Minimum 1800 words
- Mention ${city} naturally throughout the article
- Start with a compelling introduction
- Use clear H2 and H3 headings
- Include practical homeowner advice
- Include emergency plumbing guidance
- Include water damage prevention tips
- Include a maintenance checklist
- Include cost factors where relevant
- Include a 4-question FAQ section
- End with a strong local call-to-action
- Use professional American English
- Avoid filler and AI-related language
- Return only clean Markdown content

Formatting requirements:
- Use ## for major sections
- Use ### for subsections
- Use bullet lists where appropriate
- Use short paragraphs for readability`;
}
// =====================================================
// ARTICLE SCHEMA
// =====================================================

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

// =====================================================
// OLLAMA EXECUTION
// =====================================================

function runOllama(prompt, model = 'llama3.1:8b') {
  const result = spawnSync(
    'ollama',
    ['run', model, prompt],
    {
      encoding: 'utf8',
      maxBuffer: 30 * 1024 * 1024,
      windowsHide: true,
      timeout: 1000 * 60 * 10, // 10 minutes
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

// =====================================================
// RETRY WRAPPER
// =====================================================

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

// =====================================================
// MAIN GENERATOR
// =====================================================

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

  const wrapperStart = buildBlogWrapper({
    title,
    city,
    readingTime,
  });

  const wrapperEnd = buildBlogFooter(city);

  const finalContent =
    frontmatter +
    wrapperStart +
    '\n\n' +
    content +
    '\n\n' +
    wrapperEnd;

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
    schema: articleSchema,
    content: finalContent,
  };
}

// =====================================================
// DEFAULT EXPORT
// =====================================================

export default generateBlog;

// =====================================================
// CLI SUPPORT
// Usage:
// node blog-generator.mjs "Title" "Keyword" "City"
// =====================================================

if (process.argv[1] && process.argv[1].endsWith('blog-generator.mjs')) {
  const [, , titleArg, keywordArg, cityArg] = process.argv;

  if (!titleArg || !keywordArg) {
    console.error(
      'Usage: node blog-generator.mjs "Title" "Keyword" "City"'
    );
    process.exit(1);
  }

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
// =====================================================
// TABLE OF CONTENTS GENERATOR
// =====================================================

function slugifyHeading(text = '') {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function buildTableOfContents(markdown = '') {
  const headingRegex = /^##\s+(.+)$/gm;
  const items = [];
  let match;

  while ((match = headingRegex.exec(markdown)) !== null) {
    const heading = match[1].trim();
    items.push({
      title: heading,
      id: slugifyHeading(heading),
    });
  }

  if (!items.length) return '';

  return `
<div class="mb-10 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
  <h2 class="mb-4 text-xl font-semibold text-gray-900">Table of Contents</h2>
  <ul class="space-y-2 text-sm text-gray-700">
    ${items
      .map(
        (item) =>
          `<li><a class="hover:text-blue-700 hover:underline" href="#${item.id}">${item.title}</a></li>`
      )
      .join('')}
  </ul>
</div>
`;
}

// =====================================================
// ADD IDS TO H2 HEADINGS
// =====================================================

function addHeadingIds(markdown = '') {
  return markdown.replace(/^##\s+(.+)$/gm, (_, heading) => {
    const id = slugifyHeading(heading);
    return `<h2 id="${id}">${heading}</h2>`;
  });
}

// =====================================================
// EXTRACT FAQS FOR SCHEMA
// =====================================================

function extractFaqs(markdown = '') {
  const faqs = [];
  const regex = /^###\s+(.+?)\n+([\s\S]*?)(?=\n###\s+|\n##\s+|$)/gm;

  let match;

  while ((match = regex.exec(markdown)) !== null) {
    const question = match[1].trim();
    const answer = match[2].replace(/\n+/g, ' ').trim();

    if (question.endsWith('?') && answer.length > 20) {
      faqs.push({ question, answer });
    }
  }

  return faqs.slice(0, 8);
}

// =====================================================
// FAQ SCHEMA
// =====================================================

function buildFaqSchema(faqs = []) {
  if (!faqs.length) return null;

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

// =====================================================
// LOCAL BUSINESS SCHEMA
// =====================================================

function buildLocalBusinessSchema(city) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Plumber',
    name: COMPANY_NAME,
    url: SITE_URL,
    telephone: PHONE,
    areaServed: {
      '@type': 'City',
      name: city,
    },
    address: {
      '@type': 'PostalAddress',
      addressLocality: city,
      addressRegion: 'TX',
      addressCountry: 'US',
    },
    openingHours: 'Mo-Su 00:00-23:59',
    priceRange: '$$',
  };
}

// =====================================================
// FEATURED IMAGE URL
// =====================================================

function buildFeaturedImage(slug) {
  return `${SITE_URL}/images/blog/${slug}.jpg`;
}

// =====================================================
// SOCIAL SHARE SECTION
// =====================================================

function buildShareSection({ title, canonicalUrl }) {
  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(canonicalUrl);

  return `
<div class="mt-10 rounded-2xl border border-gray-200 bg-white p-6">
  <h3 class="mb-4 text-lg font-semibold text-gray-900">Share this article</h3>
  <div class="flex flex-wrap gap-3">
    <a class="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50" target="_blank" rel="noreferrer" href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}">Facebook</a>
    <a class="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50" target="_blank" rel="noreferrer" href="https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}">X / Twitter</a>
    <a class="rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50" target="_blank" rel="noreferrer" href="https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}">LinkedIn</a>
  </div>
</div>
`;
}

// =====================================================
// ENHANCED CONTENT PROCESSOR
// =====================================================

function enhanceContent(content, { title, canonicalUrl }) {
  let enhanced = addHeadingIds(content);

  const toc = buildTableOfContents(content);
  const share = buildShareSection({ title, canonicalUrl });

  enhanced = toc + '\n\n' + enhanced + '\n\n' + share;

  return enhanced;
}

// =====================================================
// FINAL ASSEMBLER (USE THIS INSIDE generateBlog)
// =====================================================
//
// Replace these lines inside generateBlog:
//
// const finalContent =
//   frontmatter +
//   wrapperStart +
//   '\n\n' +
//   content +
//   '\n\n' +
//   wrapperEnd;
//
// With:
//
// const enhancedContent = enhanceContent(content, {
//   title,
//   canonicalUrl,
// });
//
// const finalContent =
//   frontmatter +
//   wrapperStart +
//   '\n\n' +
//   enhancedContent +
//   '\n\n' +
//   wrapperEnd;
//
// Also add before return:
//
// const faqs = extractFaqs(content);
//
// const faqSchema = buildFaqSchema(faqs);
//
// const localBusinessSchema = buildLocalBusinessSchema(city);
//
// const featuredImage = buildFeaturedImage(slug);
//
// Then update return object:
//
// return {
//   title,
//   slug,
//   metaTitle,
//   metaDescription,
//   canonicalUrl,
//   featuredImage,
//   readingTime,
//   schema: {
//     article: articleSchema,
//     faq: faqSchema,
//     localBusiness: localBusinessSchema,
//   },
//   content: finalContent,
// };
import fs from 'node:fs';
import path from 'node:path';

// =====================================================
// OUTPUT CONFIG
// =====================================================

const BLOG_OUTPUT_DIR = path.join(process.cwd(), 'content', 'blog');
const SITEMAP_FILE = path.join(process.cwd(), 'public', 'sitemap-blog.xml');
const RSS_FILE = path.join(process.cwd(), 'public', 'rss-blog.xml');

// =====================================================
// FILE HELPERS
// =====================================================

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function fileExists(filePath) {
  return fs.existsSync(filePath);
}

function getUniqueFilePath(basePath) {
  if (!fileExists(basePath)) return basePath;

  const ext = path.extname(basePath);
  const name = path.basename(basePath, ext);
  const dir = path.dirname(basePath);

  let counter = 2;
  let candidate = path.join(dir, `${name}-${counter}${ext}`);

  while (fileExists(candidate)) {
    counter += 1;
    candidate = path.join(dir, `${name}-${counter}${ext}`);
  }

  return candidate;
}

// =====================================================
// SAVE BLOG TO DISK
// =====================================================

function saveBlogToFile({ slug, content }) {
  ensureDir(BLOG_OUTPUT_DIR);

  const filePath = getUniqueFilePath(
    path.join(BLOG_OUTPUT_DIR, `${slug}.mdx`)
  );

  fs.writeFileSync(filePath, content, 'utf8');

  return filePath;
}

// =====================================================
// SITEMAP UPDATE
// =====================================================

function appendToSitemap(slug) {
  ensureDir(path.dirname(SITEMAP_FILE));

  const url = `${SITE_URL}/blog/${slug}`;
  const date = new Date().toISOString().split('T')[0];

  const entry = `
  <url>
    <loc>${url}</loc>
    <lastmod>${date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;

  if (!fileExists(SITEMAP_FILE)) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entry}
</urlset>`;

    fs.writeFileSync(SITEMAP_FILE, xml, 'utf8');
    return;
  }

  let xml = fs.readFileSync(SITEMAP_FILE, 'utf8');

  if (xml.includes(url)) return;

  xml = xml.replace('</urlset>', `${entry}
</urlset>`);

  fs.writeFileSync(SITEMAP_FILE, xml, 'utf8');
}

// =====================================================
// RSS UPDATE
// =====================================================

function appendToRss({ title, slug, metaDescription }) {
  ensureDir(path.dirname(RSS_FILE));

  const url = `${SITE_URL}/blog/${slug}`;
  const pubDate = new Date().toUTCString();

  const item = `
  <item>
    <title>${title}</title>
    <link>${url}</link>
    <guid>${url}</guid>
    <description>${metaDescription}</description>
    <pubDate>${pubDate}</pubDate>
  </item>`;

  if (!fileExists(RSS_FILE)) {
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>${COMPANY_NAME} Blog</title>
  <link>${SITE_URL}/blog</link>
  <description>Houston plumbing tips, maintenance guides, and emergency plumbing advice.</description>${item}
</channel>
</rss>`;

    fs.writeFileSync(RSS_FILE, xml, 'utf8');
    return;
  }

  let xml = fs.readFileSync(RSS_FILE, 'utf8');

  if (xml.includes(url)) return;

  xml = xml.replace('</channel>', `${item}
</channel>`);

  fs.writeFileSync(RSS_FILE, xml, 'utf8');
}

// =====================================================
// SEO QUALITY SCORE
// =====================================================

function calculateSeoScore({ content, keyword, metaTitle, metaDescription }) {
  let score = 0;

  if (metaTitle.length >= 30 && metaTitle.length <= 60) score += 20;
  if (
    metaDescription.length >= 120 &&
    metaDescription.length <= 160
  ) score += 20;

  const keywordCount =
    (content.match(new RegExp(keyword, 'gi')) || []).length;

  if (keywordCount >= 3) score += 20;

  const wordCount = content.split(/\s+/).filter(Boolean).length;
  if (wordCount >= 1500) score += 20;

  const headingCount = (content.match(/<h2 id=/g) || []).length;
  if (headingCount >= 5) score += 20;

  return Math.min(score, 100);
}

// =====================================================
// READABILITY SCORE (SIMPLE)
// =====================================================

function calculateReadability(text = '') {
  const sentences = Math.max(
    1,
    text.split(/[.!?]+/).filter(Boolean).length
  );

  const words = Math.max(
    1,
    text.split(/\s+/).filter(Boolean).length
  );

  const avgWordsPerSentence = words / sentences;

  if (avgWordsPerSentence <= 14) return 'Easy';
  if (avgWordsPerSentence <= 20) return 'Medium';
  return 'Hard';
}

// =====================================================
// IMAGE PLACEHOLDERS
// =====================================================

function buildImagePlaceholders(slug) {
  return {
    hero: `/images/blog/${slug}-hero.jpg`,
    section1: `/images/blog/${slug}-1.jpg`,
    section2: `/images/blog/${slug}-2.jpg`,
    section3: `/images/blog/${slug}-3.jpg`,
  };
}

// =====================================================
// BATCH GENERATION
// =====================================================

export async function generateBlogBatch(items = []) {
  const results = [];

  for (const item of items) {
    try {
      const blog = await generateBlog(item);
      results.push({
        success: true,
        slug: blog.slug,
        title: blog.title,
      });
    } catch (error) {
      results.push({
        success: false,
        title: item.title,
        error: error.message,
      });
    }
  }

  return results;
}

// =====================================================
// PRODUCTION WRAPPER
// =====================================================
//
// Inside generateBlog(), before return, add:
//
// const filePath = saveBlogToFile({
//   slug,
//   content: finalContent,
// });
//
// appendToSitemap(slug);
//
// appendToRss({
//   title,
//   slug,
//   metaDescription,
// });
//
// const seoScore = calculateSeoScore({
//   content: finalContent,
//   keyword,
//   metaTitle,
//   metaDescription,
// });
//
// const readability = calculateReadability(finalContent);
//
// const images = buildImagePlaceholders(slug);
//
// Then update return object:
//
// return {
//   title,
//   slug,
//   metaTitle,
//   metaDescription,
//   canonicalUrl,
//   featuredImage,
//   images,
//   readingTime,
//   seoScore,
//   readability,
//   filePath,
//   schema: {
//     article: articleSchema,
//     faq: faqSchema,
//     localBusiness: localBusinessSchema,
//   },
//   content: finalContent,
// };
// =====================================================
// HALLUCINATION / LOW QUALITY GUARD
// =====================================================

const BANNED_PHRASES = [
  'as an ai',
  'i am an ai',
  'language model',
  'chatgpt',
  'artificial intelligence',
  'lorem ipsum',
];

function qualityGuard(content = '') {
  const lower = content.toLowerCase();

  for (const phrase of BANNED_PHRASES) {
    if (lower.includes(phrase)) {
      throw new Error(`Low-quality AI phrase detected: ${phrase}`);
    }
  }

  return content;
}

// =====================================================
// LOCAL SEO OPTIMIZER
// =====================================================

function ensureCityMentions(content, city, minimum = 6) {
  const regex = new RegExp(city, 'gi');
  const count = (content.match(regex) || []).length;

  if (count >= minimum) return content;

  const extra = `

**Local Tip:** Homeowners in ${city}, Texas should schedule preventive plumbing maintenance at least once a year to reduce the risk of drain backups and emergency repairs.
`;

  return content + extra;
}

// =====================================================
// FEATURED IMAGE BLOCK
// =====================================================

function buildHeroImageBlock({ title, slug }) {
  return `
<figure class="mb-8 overflow-hidden rounded-2xl border border-gray-200">
  <img
    src="/images/blog/${slug}-hero.jpg"
    alt="${title}"
    class="h-auto w-full object-cover"
    loading="eager"
  />
  <figcaption class="bg-gray-50 px-4 py-3 text-sm text-gray-600">
    Professional plumbing service in Houston, Texas.
  </figcaption>
</figure>
`;
}

// =====================================================
// E-E-A-T AUTHOR BOX
// =====================================================

function buildAuthorBox() {
  return `
<div class="mt-12 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
  <div class="flex items-start gap-4">
    <div class="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-lg font-bold text-blue-700">
      PR
    </div>
    <div>
      <h3 class="text-lg font-semibold text-gray-900">Reviewed by Pipe Rescue Plumbing Team</h3>
      <p class="mt-2 text-sm text-gray-700">
        This article was reviewed by experienced residential plumbing professionals serving Houston and surrounding areas.
        Our team focuses on drain cleaning, leak detection, water heater repair, and emergency plumbing service.
      </p>
    </div>
  </div>
</div>
`;
}

// =====================================================
// RELATED POST ENGINE
// =====================================================

const RELATED_POSTS = [
  {
    title: 'Emergency Plumbing Houston',
    url: '/blog/emergency-plumber-houston',
  },
  {
    title: 'Water Heater Repair Houston',
    url: '/blog/water-heater-repair-houston',
  },
  {
    title: 'Sewer Line Repair Houston',
    url: '/blog/sewer-line-repair-houston',
  },
  {
    title: 'Leak Detection Houston',
    url: '/blog/leak-detection-houston',
  },
  {
    title: 'Drain Cleaning Houston',
    url: '/blog/drain-cleaning-houston',
  },
];

function buildRelatedPosts(currentSlug) {
  const posts = RELATED_POSTS.filter(
    (post) => !post.url.endsWith(currentSlug)
  ).slice(0, 3);

  return `
<div class="mt-12 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
  <h3 class="mb-4 text-xl font-semibold text-gray-900">Recommended Reading</h3>
  <div class="space-y-3">
    ${posts
      .map(
        (post) =>
          `<a href="${post.url}" class="block rounded-xl border border-gray-200 p-4 transition hover:border-blue-300 hover:bg-blue-50">${post.title}</a>`
      )
      .join('')}
  </div>
</div>
`;
}

// =====================================================
// INTERNAL LINK OPTIMIZER
// =====================================================

const INTERNAL_LINK_RULES = [
  {
    keyword: /emergency plumber/gi,
    url: '/services/emergency-plumbing',
  },
  {
    keyword: /drain cleaning/gi,
    url: '/services/drain-cleaning',
  },
  {
    keyword: /water heater repair/gi,
    url: '/services/water-heater-repair',
  },
  {
    keyword: /leak detection/gi,
    url: '/services/leak-detection',
  },
];

function optimizeInternalLinks(content = '') {
  let updated = content;

  for (const rule of INTERNAL_LINK_RULES) {
    updated = updated.replace(rule.keyword, (match) => {
      if (updated.includes(`href="${rule.url}"`)) return match;
      return `<a href="${rule.url}" class="text-blue-700 hover:underline">${match}</a>`;
    });
  }

  return updated;
}

// =====================================================
// SOCIAL METADATA
// =====================================================

function buildSocialMeta({
  title,
  metaDescription,
  canonicalUrl,
  featuredImage,
}) {
  return {
    openGraph: {
      title,
      description: metaDescription,
      url: canonicalUrl,
      type: 'article',
      images: [featuredImage],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: metaDescription,
      images: [featuredImage],
    },
  };
}

// =====================================================
// GOOGLE INDEXING API PAYLOAD
// =====================================================

function buildIndexingPayload(canonicalUrl) {
  return {
    url: canonicalUrl,
    type: 'URL_UPDATED',
  };
}

// =====================================================
// JSON EXPORT
// =====================================================

const EXPORT_DIR = path.join(process.cwd(), 'exports');

function exportJson(data, slug) {
  ensureDir(EXPORT_DIR);

  const filePath = path.join(EXPORT_DIR, `${slug}.json`);

  fs.writeFileSync(
    filePath,
    JSON.stringify(data, null, 2),
    'utf8'
  );

  return filePath;
}

// =====================================================
// PUBLISH MANIFEST
// =====================================================

const MANIFEST_FILE = path.join(process.cwd(), 'exports', 'publish-manifest.json');

function updateManifest(entry) {
  ensureDir(path.dirname(MANIFEST_FILE));

  let manifest = [];

  if (fileExists(MANIFEST_FILE)) {
    manifest = JSON.parse(fs.readFileSync(MANIFEST_FILE, 'utf8'));
  }

  manifest.push(entry);

  fs.writeFileSync(
    MANIFEST_FILE,
    JSON.stringify(manifest, null, 2),
    'utf8'
  );
}

// =====================================================
// FINAL ENHANCER
// =====================================================

function finalizeBlogContent({
  content,
  title,
  slug,
  city,
  canonicalUrl,
}) {
  let updated = content;

  updated = qualityGuard(updated);
  updated = ensureCityMentions(updated, city);
  updated = optimizeInternalLinks(updated);

  const hero = buildHeroImageBlock({ title, slug });
  const author = buildAuthorBox();
  const related = buildRelatedPosts(slug);

  return hero + '\n\n' + updated + '\n\n' + author + '\n\n' + related;
}

// =====================================================
// INTEGRATION NOTES
// =====================================================
//
// Inside generateBlog(), after enhanceContent(...):
//
// const enhancedContent = enhanceContent(content, {
//   title,
//   canonicalUrl,
// });
//
// const finalizedContent = finalizeBlogContent({
//   content: enhancedContent,
//   title,
//   slug,
//   city,
//   canonicalUrl,
// });
//
// Replace finalContent assignment with finalizedContent.
//
// const finalContent =
//   frontmatter +
//   wrapperStart +
//   '\n\n' +
//   finalizedContent +
//   '\n\n' +
//   wrapperEnd;
//
// Also add:
//
// const social = buildSocialMeta({
//   title,
//   metaDescription,
//   canonicalUrl,
//   featuredImage,
// });
//
// const indexingPayload = buildIndexingPayload(canonicalUrl);
//
// const exportPath = exportJson(
//   {
//     title,
//     slug,
//     metaTitle,
//     metaDescription,
//     canonicalUrl,
//     featuredImage,
//     readingTime,
//     seoScore,
//     readability,
//   },
//   slug
// );
//
// updateManifest({
//   slug,
//   title,
//   canonicalUrl,
//   generatedAt: new Date().toISOString(),
// });
//
// Finally extend return:
//
// return {
//   title,
//   slug,
//   metaTitle,
//   metaDescription,
//   canonicalUrl,
//   featuredImage,
//   images,
//   readingTime,
//   seoScore,
//   readability,
//   filePath,
//   exportPath,
//   social,
//   indexingPayload,
//   schema: {
//     article: articleSchema,
//     faq: faqSchema,
//     localBusiness: localBusinessSchema,
//   },
//   content: finalContent,
// };
