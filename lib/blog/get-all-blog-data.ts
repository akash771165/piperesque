import fs from "fs";
import path from "path";

import { blogContent } from "@/lib/data/blog-content";
import { getBlogData } from "@/lib/blog/get-blog-data";


const blogsDirectory =
  path.join(process.cwd(), "content/blogs");



export interface BlogCardData {

  slug: string;

  title: string;

  description: string;

  image: string;

  imageAlt: string;

  category: string;

  publishedAt: string;

  readingTime: string;

}



export function getAllBlogData(): BlogCardData[] {


  const slugs = new Set<string>();


  /*
    Existing TypeScript Blogs
  */

  Object.keys(blogContent).forEach((slug)=>{

    slugs.add(slug);

  });



  /*
    New JSON CMS Blogs
  */

  if(fs.existsSync(blogsDirectory)){


    fs.readdirSync(blogsDirectory)

      .filter(
        (file)=>file.endsWith(".json")
      )

      .forEach((file)=>{

        slugs.add(
          file.replace(".json","")
        );

      });

  }




  const blogs: BlogCardData[] = [];



  for(const slug of slugs){


    const blog = getBlogData(slug);



    if(!blog){

      continue;

    }



    blogs.push({

      slug,


      title:
        blog.title ??
        "Pipe Rescue Plumbing Guide",



      description:
        blog.description ??
        "",



      image:
        blog.image ??
        "/images/blog/default.jpg",



      imageAlt:
        blog.imageAlt ??
        blog.title ??
        "Pipe Rescue Blog",



      category:
        blog.category ??
        "Plumbing",



      publishedAt:
        blog.publishedAt ??
        "",



      readingTime:
        blog.readingTime ??
        "5 min read",


    });


  }



  return blogs;


}