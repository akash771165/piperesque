import { getAllBlogData } from "@/lib/blog/get-all-blog-data";

import type {
  BlogContent,
  BlogLink,
} from "@/types/blog";



interface RelatedBlogOptions {

  limit?: number;

  categoryWeight?: number;

  keywordWeight?: number;

  serviceWeight?: number;

  locationWeight?: number;

  titleWeight?: number;

}



interface BlogMatchData {

  blog: BlogContent;

  score: number;

}




/**
 * Advanced Related Blog Engine
 *
 * Ranking System:
 *
 * Category Match
 * Keyword Match
 * Service Match
 * Location Match
 * Title Similarity
 *
 */



export function getRelatedBlogs(

  currentBlog: BlogContent,

  options: RelatedBlogOptions = {}

): BlogLink[] {



  const {

    limit = 6,

    categoryWeight = 3,

    keywordWeight = 2,

    serviceWeight = 4,

    locationWeight = 2,

    titleWeight = 1,


  } = options;





  const allBlogs =
    getAllBlogData() as BlogContent[];





  const currentSlug =
    currentBlog.slug;





  const currentKeywords =
    currentBlog.keywords ?? [];





  const currentLocations =
    currentBlog.locations ?? [];





  const scoredBlogs: BlogMatchData[] =


    allBlogs

      .filter(
        (blog) =>
          blog.slug !== currentSlug
      )



      .map((blog)=>{


        let score = 0;





        /*
        Category Matching
        */


        if(

          currentBlog.category &&

          blog.category &&

          currentBlog.category ===
          blog.category

        ){

          score += categoryWeight;

        }





        /*
        Keyword Matching
        */


        const blogKeywords =
          blog.keywords ?? [];




        const keywordMatches =

          currentKeywords.filter(

            (keyword)=>

              blogKeywords.includes(keyword)

          ).length;




        score +=

          keywordMatches *
          keywordWeight;






        /*
        Service Matching
        */


        if(

          currentBlog.service?.name &&

          blog.service?.name &&

          currentBlog.service.name ===
          blog.service.name

        ){

          score += serviceWeight;

        }






        /*
        Location Matching
        */


        const blogLocations =
          blog.locations ?? [];



        const locationMatches =

          currentLocations.filter(

            (location)=>

              blogLocations.includes(location)

          ).length;




        score +=

          locationMatches *
          locationWeight;







        /*
        Title Similarity
        */


        if(

          currentBlog.title &&

          blog.title

        ){

          const words =

            currentBlog.title

              .toLowerCase()

              .split(" ")

              .filter(
                word =>
                word.length > 4
              );




          const matches =

            words.filter(

              word =>

              blog.title!

                .toLowerCase()

                .includes(word)

            ).length;



          score +=

            matches *
            titleWeight;

        }
        /*
        Remove Zero Score Blogs
        */


        return {

          blog,

          score,

        };


      })



      .filter(

        (item)=>

          item.score > 0

      )



      /*
      Highest Relevant First
      */


      .sort(

        (a,b)=>

          b.score - a.score

      )



      /*
      Limit Results
      */


      .slice(

        0,

        limit

      );






  /*
  Convert To Internal Links
  */


  return scoredBlogs.map(

    ({blog})=>({


      title:

        blog.title ??

        "Related Article",




      url:

        `/blog/${blog.slug}`,



    })

  );


}