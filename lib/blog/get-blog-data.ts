import fs from "fs";
import path from "path";

import { BlogContent } from "@/types/blog";
import { blogContent } from "@/lib/data/blog-content";


const blogsDirectory =
  path.join(process.cwd(), "content/blogs");



export function getBlogData(
  slug: string
): BlogContent | null {



  const jsonPath =
    path.join(
      blogsDirectory,
      `${slug}.json`
    );



  // New JSON CMS Blogs

  if (fs.existsSync(jsonPath)) {


    const file =
      fs.readFileSync(
        jsonPath,
        "utf-8"
      );


    return JSON.parse(file) as BlogContent;

  }



  // Old TypeScript Blogs

  return (
    blogContent[
      slug as keyof typeof blogContent
    ] as BlogContent | undefined
  ) ?? null;


}