import fs from "fs";
import path from "path";
import { BlogContent } from "@/types/blog";
import { isValidSlug } from "@/lib/blog/slug";


export function getBlog(slug: string): BlogContent | null {

  if (!isValidSlug(slug)) {
    return null;
  }

  const filePath = path.join(
    process.cwd(),
    "content",
    "blogs",
    `${slug}.json`
  );


  if (!fs.existsSync(filePath)) {
    return null;
  }


  const file = fs.readFileSync(
    filePath,
    "utf-8"
  );


  return JSON.parse(file);

}