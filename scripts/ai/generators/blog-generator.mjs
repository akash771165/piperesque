import { spawnSync } from 'node:child_process';

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

export async function generateBlog({ title, keyword, city = 'Houston' }) {
  const prompt = `
Write a production-ready local SEO blog post for PipeResque, a plumbing company serving ${city}, Texas.

Title: ${title}
Primary keyword: ${keyword}

Requirements:
- 1200-1800 words
- Mention ${city}, Texas naturally
- Use H2 and H3 headings
- Include emergency plumbing advice
- Include local homeowner intent
- Include a FAQ section with 4 questions
- Include a strong PipeResque call to action
- Return ONLY Markdown.
`;

  const result = spawnSync(
    'ollama',
    ['run', 'llama3.1:8b', prompt],
    {
      encoding: 'utf8',
      maxBuffer: 20 * 1024 * 1024,
    }
  );

  if (result.error) {
    throw result.error;
  }

  const content = (result.stdout || '').trim();

  if (!content) {
    throw new Error('Ollama returned empty content');
  }

  return {
    title,
    slug: slugify(keyword),
    content,
  };
}

export default generateBlog;
