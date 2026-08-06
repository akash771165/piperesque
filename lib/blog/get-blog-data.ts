import fs from "fs";
import path from "path";

import { BlogContent } from "@/types/blog";
import { blogContent } from "@/lib/data/blog-content";
import { isValidSlug } from "@/lib/blog/slug";

const blogsDirectory = path.join(process.cwd(), "content/blogs");

export function getBlogData(
  slug: string
): BlogContent | null {

  if (!isValidSlug(slug)) {
    return null;
  }

  const jsonPath = path.join(
    blogsDirectory,
    `${slug}.json`
  );

  // New JSON CMS Blogs
  if (fs.existsSync(jsonPath)) {

    const file = fs.readFileSync(
      jsonPath,
      "utf-8"
    );

    const json = JSON.parse(file);

    const article: BlogContent = {
      ...json,

      title: json.title ?? "",

      description: json.description ?? "",

      author: json.author ?? "PipeResque",

      category:
        json.category ??
        json.service ??
        "Plumbing",

      image:
        json.image ??
        "/images/blog/default.jpg",

      imageAlt:
        json.imageAlt ??
        json.title ??
        "PipeResque",

      publishedAt:
        json.publishedAt ??
        json.createdAt ??
        "",

      updatedAt:
        json.updatedAt ??
        json.createdAt ??
        "",

      readingTime:
        json.readingTime ??
        "5 min read",

      keywords:
        json.keywords ??
        (json.keyword
          ? [json.keyword]
          : []),

      introduction:
        json.introduction ??
        (json.content
          ? [json.content]
          : []),

      sections:
        json.sections ??
        [],

      faqs:
        json.faqs ??
        json.faq ??
        [],

      callToAction:
        json.callToAction ?? {
          title: "Need Emergency Plumbing Service?",
          description:
            "Contact a plumbing service provider today.",
          phone: "+1-877-364-0861",
        },

      seo:
        json.seo ?? {},

      schema:
        json.schema ?? {},
    };

    return article;
  }

  // Old TypeScript Blogs
  return (
    blogContent[
      slug as keyof typeof blogContent
    ] as BlogContent | undefined
  ) ?? null;
}