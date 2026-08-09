import fs from 'node:fs/promises';
import path from 'node:path';
import { generateBlog } from '../generators/blog-generator.mjs';

const jobs = [
  { title: 'Emergency Plumber Houston', keyword: 'emergency plumber houston' },
  { title: 'Drain Cleaning Houston', keyword: 'drain cleaning houston' },
  { title: 'Water Heater Repair Houston', keyword: 'water heater repair houston' }
];

const outputDir = path.join(process.cwd(), 'content', 'blog');
await fs.mkdir(outputDir, { recursive: true });

for (const job of jobs) {
  console.log(`Generating: ${job.keyword}`);

  const blog = await generateBlog(job);

  const filePath = path.join(outputDir, `${blog.slug}.md`);
  await fs.writeFile(filePath, blog.content, 'utf8');

  console.log(`Saved: ${filePath}`);
}

console.log('Daily SEO generation completed.');
