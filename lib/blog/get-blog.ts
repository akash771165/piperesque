import fs from "fs";
import path from "path";
import { BlogContent } from "@/types/blog";


export function getBlog(slug: string): BlogContent | null {

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