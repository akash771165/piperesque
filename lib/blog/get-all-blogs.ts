import { blogContent } from "@/lib/data/blog-content";

import fs from "fs";
import path from "path";


const blogsDirectory =
  path.join(process.cwd(), "content/blogs");



export function getAllBlogs(): string[] {


  let jsonBlogs:string[] = [];



  if (fs.existsSync(blogsDirectory)) {


    jsonBlogs = fs
      .readdirSync(blogsDirectory)
      .filter((file)=>file.endsWith(".json"))
      .map((file)=>file.replace(".json",""));


  }



  const oldBlogs =
    Object.keys(blogContent);



  return [
    ...new Set([
      ...oldBlogs,
      ...jsonBlogs,
    ]),
  ];

}