import fs from 'node:fs/promises';
import path from 'node:path';
import { notFound } from 'next/navigation';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

export async function generateStaticParams() {
  const files = await fs.readdir(BLOG_DIR);
  return files
    .filter((f) => f.endsWith('.md'))
    .map((f) => ({ slug: f.replace(/\.md$/, '') }));
}

async function getPost(slug: string) {
  try {
    const filePath = path.join(BLOG_DIR, `${slug}.md`);
    const file = await fs.readFile(filePath, 'utf8');

    const { content } = matter(file);
    const processed = await remark().use(html).process(content);

    return processed.toString();
  } catch {
    return null;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const contentHtml = await getPost(slug);

  if (!contentHtml) notFound();

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 prose prose-lg">
      <article dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  );
}