import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import Script from "next/script";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";

import { getBlogData } from "@/lib/blog/get-blog-data";
import { getAllBlogs } from "@/lib/blog/get-all-blogs";


type Props = {
  params: Promise<{
    slug: string;
  }>;
};



// Old TS Blogs + New JSON CMS Blogs
export async function generateStaticParams() {

  const blogs = getAllBlogs();

  return blogs.map((slug) => ({
    slug,
  }));

}




export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {


  const { slug } = await params;


  const article = getBlogData(slug);



  if (!article) {

    return {
      title: "Article Not Found",
    };

  }



  return {

    title:
      article.seo?.title ??
      article.title ??
      "Pipe Rescue Blog",



    description:
      article.seo?.description ??
      article.description ??
      "",



    keywords:
      article.keywords,



    alternates: {

      canonical:
        `https://www.piperesque.com/blog/${slug}`,

    },



    openGraph: {

      title:
        article.title ??
        "Pipe Rescue Blog",


      description:
        article.description ??
        "",


      url:
        `https://www.piperesque.com/blog/${slug}`,


      type:
        "article",


      publishedTime:
        article.publishedAt,


      modifiedTime:
        article.updatedAt,


      images: [

        {

          url:
            article.image ??
            "/images/blog/default.jpg",


          width:
            1200,


          height:
            630,


          alt:
            article.imageAlt ??
            article.title ??
            "Pipe Rescue Blog",

        }

      ],

    },



    twitter: {

      card:
        "summary_large_image",


      title:
        article.title ??
        "Pipe Rescue Blog",


      description:
        article.description ??
        "",


      images: [

        article.image ??
        "/images/blog/default.jpg"

      ],

    },

  };

}






export default async function BlogArticle({
  params,
}: Props) {


  const { slug } = await params;



  const article = getBlogData(slug);



  if (!article) {

    notFound();

  }



  const relatedBlogs =
    article.relatedBlogs ?? [];



  const articleSchema = {

    "@context":
      "https://schema.org",


    "@type":
      article.schema?.type ?? "Article",


    headline:
      article.title,


    description:
      article.description,


    image: [

      `https://www.piperesque.com${
        article.image ??
        "/images/blog/default.jpg"
      }`

    ],


    datePublished:
      article.publishedAt,


    dateModified:
      article.updatedAt,


    author: {

      "@type":
        "Person",


      name:
        typeof article.author === "string"
          ? article.author
          : article.author?.name ?? "Pipe Rescue",

    },


    publisher: {

      "@type":
        "Organization",


      name:
        "Pipe Rescue",

    },


    mainEntityOfPage: {

      "@type":
        "WebPage",


      "@id":
        `https://www.piperesque.com/blog/${slug}`,

    },

  };



  const faqSchema = {

    "@context":
      "https://schema.org",


    "@type":
      "FAQPage",


    mainEntity:

      article.faqs.map((faq) => ({

        "@type":
          "Question",


        name:
          faq.question,


        acceptedAnswer: {

          "@type":
            "Answer",


          text:
            faq.answer,

        },

      })),

  };
    return (

<main className="overflow-x-hidden bg-white">


<Script
  id="article-schema"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(articleSchema),
  }}
/>


<Script
  id="faq-schema"
  type="application/ld+json"
  dangerouslySetInnerHTML={{
    __html: JSON.stringify(faqSchema),
  }}
/>



<Navbar />



{/* Hero Section */}

<section className="relative overflow-hidden py-24">


<Image
  src={
    article.image ??
    "/images/blog/default.jpg"
  }
  alt={
    article.imageAlt ??
    article.title ??
    "Pipe Rescue Blog"
  }
  fill
  priority
  className="object-cover"
/>


<div className="absolute inset-0 bg-slate-900/70" />


<div className="container-custom relative z-10">

<div className="max-w-4xl">


<span className="rounded-full bg-blue-600 px-5 py-2 text-sm font-bold text-white">

{article.category ?? "Plumbing"}

</span>



<h1 className="mt-8 text-5xl font-black leading-tight text-white lg:text-6xl">

{article.title}

</h1>



<div className="mt-8 flex flex-wrap gap-6 text-white/90">


<span>

{
typeof article.author === "string"
? article.author
: article.author?.name ?? "Pipe Rescue"
}

</span>


<span>
{article.publishedAt}
</span>


<span>
{article.readingTime}
</span>


</div>


</div>

</div>


</section>





{/* Content */}

<section className="py-20">


<div className="container-custom">


<div className="mx-auto max-w-4xl">



<p className="text-xl leading-9 text-slate-700">

{article.description}

</p>




{/* Table Of Contents */}

<nav className="mt-12 rounded-3xl border border-slate-200 bg-slate-50 p-8">


<h2 className="text-2xl font-black text-slate-900">

Table of Contents

</h2>



<ul className="mt-6 space-y-3">


{article.sections.map((section,index)=>(


<li key={index}>


<a

href={`#${section.id ?? `section-${index}`}`}

className="font-medium text-blue-700 hover:underline"

>


{section.title}


</a>


</li>


))}


</ul>


</nav>






{/* Introduction */}

<div className="mt-12">


{article.introduction.map((paragraph,index)=>(


<p

key={index}

className="mb-6 text-lg leading-8 text-slate-700"

>


{paragraph}


</p>


))}


</div>






{/* Sections */}

{article.sections.map((section,index)=>(


<section

key={index}

id={section.id ?? `section-${index}`}

className="mt-16 scroll-mt-32"

>



<h2 className="mb-6 text-3xl font-black text-slate-900">

{section.title}

</h2>



{section.subtitle && (

<p className="mb-5 text-xl font-semibold text-blue-700">

{section.subtitle}

</p>

)}



{section.content.map((text,i)=>(


<p

key={i}

className="mb-6 text-lg leading-8 text-slate-700"

>

{text}

</p>


))}





{section.bullets && (

<ul className="mb-8 list-disc space-y-3 pl-6 text-lg text-slate-700">


{section.bullets.map((item,i)=>(

<li key={i}>
{item}
</li>

))}


</ul>

)}





{section.numberedList && (

<ol className="mb-8 list-decimal space-y-3 pl-6 text-lg text-slate-700">


{section.numberedList.map((item,i)=>(

<li key={i}>
{item}
</li>

))}


</ol>

)}



</section>


))}
{/* CTA */}

<section className="mt-20 rounded-3xl bg-blue-600 p-10 text-white">


<h2 className="text-3xl font-black">

{article.callToAction.title}

</h2>



<p className="mt-4 text-lg leading-8">

{article.callToAction.description}

</p>



{article.callToAction.phone && (

<a

href={`tel:${article.callToAction.phone}`}

className="mt-8 inline-block rounded-full bg-white px-8 py-4 font-bold text-blue-700 transition hover:bg-slate-100"

>

📞 {article.callToAction.phone}

</a>

)}


</section>






{/* FAQ */}

<section className="mt-20">


<h2 className="mb-8 text-3xl font-black text-slate-900">

Frequently Asked Questions

</h2>



<div className="space-y-6">


{article.faqs.map((faq,index)=>(


<div

key={index}

className="rounded-2xl border border-slate-200 p-6"

>


<h3 className="text-xl font-bold text-slate-900">

{faq.question}

</h3>



<p className="mt-3 leading-8 text-slate-600">

{faq.answer}

</p>


</div>


))}


</div>


</section>



</div>

</div>

</section>






{/* Related Blogs */}

<section className="pb-24">


<div className="container-custom">


<div>


<p className="font-semibold uppercase tracking-wider text-blue-600">

Continue Reading

</p>



<h2 className="mt-2 text-4xl font-black text-slate-900">

Related Articles

</h2>



</div>





<div className="mt-12 grid gap-8 md:grid-cols-3">


{relatedBlogs.map((post,index)=>(


<Link

key={index}

href={post.url}

className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition hover:-translate-y-2"

>



<h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-700">

{post.title}

</h3>



<p className="mt-4 text-slate-600">

Read more plumbing guides and emergency service information.

</p>



<div className="mt-5 font-bold text-blue-700">

Read Article →

</div>



</Link>


))}



</div>


</div>


</section>






<CTA />



<Footer />



</main>

  );

}