import fs from "node:fs/promises";
import path from "node:path";
import { notFound } from "next/navigation";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const BLOG_DIRS = [
  path.join(process.cwd(), "content", "blog"),
  path.join(process.cwd(), "content", "blogs"),
];

async function getBlogFiles() {
  const allFiles: string[] = [];

  for (const dir of BLOG_DIRS) {
    try {
      const files = await fs.readdir(dir);

      allFiles.push(
        ...files.filter(
          (file) => file.endsWith(".md") || file.endsWith(".mdx")
        )
      );
    } catch {
      // Ignore missing directory
    }
  }

  return [...new Set(allFiles)];
}

export async function generateStaticParams() {
  const files = await getBlogFiles();

  return files.map((file) => ({
    slug: file.replace(/\.(md|mdx)$/, ""),
  }));
}

async function getPost(slug: string) {
  for (const dir of BLOG_DIRS) {
    for (const extension of [".md", ".mdx"]) {
      try {
        const filePath = path.join(dir, `${slug}${extension}`);

        const file = await fs.readFile(filePath, "utf8");

        const { content } = matter(file);

        const processed = await remark()
          .use(html)
          .process(content);

        return processed.toString();
      } catch {
        // Try next location/extension
      }
    }
  }

  return null;
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const contentHtml = await getPost(slug);

  if (!contentHtml) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-10 prose prose-lg">
      <article dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </main>
  );
}