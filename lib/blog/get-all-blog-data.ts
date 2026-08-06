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

  keywords?: string[];

}




export function getAllBlogData(): BlogCardData[] {


  const slugs = new Set<string>();



  /*
    Legacy TypeScript Blog System
    Keep compatibility
  */

  Object.keys(blogContent).forEach((slug)=>{

    slugs.add(slug);

  });




  /*
    New JSON CMS Blog System
    Future scalable architecture
  */

  if(fs.existsSync(blogsDirectory)){


    fs
    .readdirSync(blogsDirectory)

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



    /*
      Skip invalid / empty CMS entries, but make them visible so a
      broken entry does not disappear from the site unnoticed.
    */

    if(
      !blog ||
      !blog.title ||
      !blog.description
    ){

      console.warn(
        `Skipping blog "${slug}": missing title or description.`
      );

      continue;

    }






    blogs.push({



      slug,



      title:
        blog.title,



      description:
        blog.description,



      image:
        blog.image ??
        "/images/blog/default.jpg",



      imageAlt:
        blog.imageAlt ??
        blog.title,



      category:
        blog.category ??
        "Plumbing",



      publishedAt:
        blog.publishedAt ??
        "",



      readingTime:
        blog.readingTime ??
        "",



      keywords:
        blog.keywords ?? [],



    });



  }





  return blogs.sort(

    (a,b)=>

      new Date(b.publishedAt).getTime() -

      new Date(a.publishedAt).getTime()

  );


}