import { generateBlog } from './scripts/ai/generators/blog-generator.mjs';

const result = await generateBlog({
  title: 'Emergency Plumber Houston',
  keyword: 'emergency plumber houston'
});

console.log(result);
