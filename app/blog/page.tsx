import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";

import { getAllBlogData } from "@/lib/blog/get-all-blog-data";

import {
  Calendar,
  ArrowRight,
  FileText,
} from "lucide-react";



export default function BlogPage() {


  const blogs = getAllBlogData().sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() -
      new Date(a.publishedAt).getTime()
  );


  return (

    <main className="overflow-x-hidden bg-white">


      <Navbar />


      {/* Hero */}

      <section className="relative overflow-hidden py-28 lg:py-36">


        <Image
          src="/images/blog.png"
          alt="Piperesque Plumbing Blog"
          fill
          priority
          className="object-cover"
        />


        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-blue-900/80 to-slate-900/80" />


        <div className="container-custom relative z-10">


          <div className="mx-auto max-w-4xl text-center">


            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-5 py-2 text-sm font-bold uppercase tracking-wider text-white backdrop-blur-md">


              <FileText size={16} />


              Piperesque


            </div>



            <h1 className="mt-8 text-5xl font-black leading-tight text-white md:text-6xl lg:text-7xl">

              Houston Plumbing Tips,
              <br />
              Guides & Expert Advice

            </h1>



            <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">

              Explore expert plumbing guides, emergency repair advice,
              drain cleaning tips, leak detection insights, water heater
              maintenance, and practical homeowner resources from the
              Piperesque editorial team.

            </p>


            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">


              <div className="rounded-full bg-white/10 px-5 py-3 text-white backdrop-blur">

                {blogs.length} Expert Articles

              </div>


              <div className="rounded-full bg-white/10 px-5 py-3 text-white backdrop-blur">

                Houston Plumbing Guides

              </div>


              <div className="rounded-full bg-white/10 px-5 py-3 text-white backdrop-blur">

                Houston Plumbing Experts

              </div>


            </div>


          </div>


        </div>


      </section>
            {/* Blog Listing */}


      <section className="py-24">


        <div className="container-custom">


          <div className="mb-12 text-center">


            <h2 className="text-4xl font-black text-slate-900">

              Latest Plumbing Articles

            </h2>



            <p className="mx-auto mt-4 max-w-3xl text-lg leading-8 text-slate-600">

              Browse our latest plumbing guides, maintenance tips,
              emergency repair advice, and expert resources for
              homeowners and businesses in Houston.

            </p>


          </div>





          {
            blogs.length === 0 && (

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-10 text-center">


                <h3 className="text-2xl font-black text-slate-900">

                  No Articles Available

                </h3>



                <p className="mt-3 text-slate-600">

                  New plumbing guides will be published soon.

                </p>


              </div>

            )
          }





          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">



            {blogs.map((post) => (


              <article

                key={post.slug}

                className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl transition-all duration-300 hover:-translate-y-2 hover:border-blue-200 hover:shadow-2xl"

              >



                <div className="relative h-64 overflow-hidden">


                  <Image

                    src={post.image}

                    alt={post.imageAlt}

                    fill

                    className="object-cover transition duration-500 group-hover:scale-110"

                  />


                </div>





                <div className="p-8">



                  <span className="inline-flex rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">


                    {post.category}


                  </span>





                  <div className="mt-5 flex items-center gap-2 text-sm text-slate-500">


                    <Calendar size={16} />


                    <span>

                      {post.publishedAt}

                    </span>



                    <span>

                      •

                    </span>



                    <span>

                      {post.readingTime}

                    </span>


                  </div>





                  <h2 className="mt-5 text-2xl font-black leading-tight text-slate-900 transition group-hover:text-blue-700">


                    {post.title}


                  </h2>





                  <p className="mt-5 leading-8 text-slate-600">


                    {post.description}


                  </p>





                  <Link

                    href={`/blog/${post.slug}`}

                    className="mt-8 inline-flex items-center gap-3 rounded-full bg-blue-600 px-7 py-4 font-bold text-white transition hover:bg-blue-700"

                  >


                    Read More


                    <ArrowRight size={18} />


                  </Link>




                </div>



              </article>



            ))}



          </div>



        </div>



      </section>
            <CTA />


      <Footer />


    </main>

  );

}