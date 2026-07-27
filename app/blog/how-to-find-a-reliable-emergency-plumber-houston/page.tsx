"use client";

import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";

import { blogs } from "@/lib/data/blogs";

import {
  Calendar,
  ArrowRight,
  Clock3,
} from "lucide-react";

export default function BlogPage() {
  return (
    <main className="overflow-x-hidden bg-white">

      <Navbar />

      {/* Hero */}

      <section className="relative overflow-hidden py-28">

        <Image
          src="/images/blog.png"
          alt="Piperesque Plumbing Blog"
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-blue-950/85 to-blue-700/80" />

        <div className="container-custom relative z-10 text-center">

          <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-bold text-white">
            PLUMBING BLOG
          </span>

          <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-black leading-tight text-white lg:text-7xl">
            Plumbing Tips,
            Maintenance Guides
            & Emergency Advice
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">
            Expert articles covering emergency plumbing, drain cleaning,
            leak detection, water heaters, sewer repair and homeowner
            maintenance tips throughout Houston.
          </p>

        </div>

      </section>

      {/* Blog Grid */}

      <section className="py-24">

        <div className="container-custom">

          <div className="mb-16 text-center">

            <h2 className="text-5xl font-black text-slate-900">
              Latest Articles
            </h2>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
              Helpful plumbing resources written to help homeowners
              understand common plumbing problems and when to call
              a licensed plumbing professional.
            </p>

          </div>

          <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-3">

            {blogs.map((post) => (

              <article
                key={post.slug}
                className="group overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl transition duration-300 hover:-translate-y-2 hover:border-blue-600 hover:shadow-2xl"
              >

                <Link href={`/blog/${post.slug}`}>

                  <div className="relative h-64 overflow-hidden">

                    <Image
                      src={post.image}
                      alt={post.title}
                      fill
                      quality={75}
                      sizes="(max-width:768px)100vw,(max-width:1200px)50vw,33vw"
                      className="object-cover transition duration-500 group-hover:scale-110"
                    />

                  </div>

                </Link>

                <div className="p-8">

                  <span className="rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-700">
                    {post.category}
                  </span>

                  <div className="mt-6 flex flex-wrap items-center gap-5 text-sm text-slate-500">

                    <div className="flex items-center gap-2">

                      <Calendar size={16} />

                      {post.publishedAt}

                    </div>

                    <div className="flex items-center gap-2">

                      <Clock3 size={16} />

                      {post.readingTime}

                    </div>

                  </div>

                  <Link href={`/blog/${post.slug}`}>

                    <h2 className="mt-6 text-3xl font-black leading-tight transition group-hover:text-blue-700">

                      {post.title}

                    </h2>

                  </Link>

                  <p className="mt-6 leading-8 text-slate-600">

                    {post.description}

                  </p>

                  <Link
                    href={`/blog/${post.slug}`}
                    className="mt-8 inline-flex items-center gap-3 rounded-full bg-blue-600 px-7 py-4 font-bold text-white transition hover:bg-blue-700"
                  >

                    Read Article

                    <ArrowRight size={18} />

                  </Link>

                </div>

              </article>

            ))}

                   </div>

        </div>

      </section>

      {/* Featured Topics */}

      <section className="bg-slate-50 py-24">
  <div className="container-custom">

    <div className="text-center">

      <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-bold text-blue-700">
        EXPLORE TOPICS
      </span>

      <h2 className="mt-6 text-5xl font-black text-slate-900">
        Plumbing Resources
      </h2>

      <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-600">
        Browse articles covering the most common plumbing services and
        homeowner maintenance topics.
      </p>

    </div>

    <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

      {[
        "Emergency Plumbing",
        "Drain Cleaning",
        "Leak Detection",
        "Water Heater Repair",
        "Pipe Repair",
        "Toilet Repair",
        "Commercial Plumbing",
        "Residential Plumbing",
      ].map((topic) => (

        <div
          key={topic}
          className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-lg transition duration-300 hover:-translate-y-2 hover:border-blue-600 hover:shadow-xl"
        >

          <h3 className="text-xl font-black text-slate-900">
            {topic}
          </h3>

        </div>

      ))}

    </div>

  </div>

</section>

{/* Why Read Our Blog */}

<section className="py-24">

  <div className="container-custom">

    <div className="mx-auto max-w-5xl rounded-[36px] bg-blue-600 p-12 text-center text-white">

      <h2 className="text-5xl font-black">
        Why Homeowners Trust Our Plumbing Advice
      </h2>

      <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">
        Every article is written to help homeowners understand plumbing
        problems, avoid unnecessary repairs and know when to contact a
        licensed plumbing professional.
      </p>

      <div className="mt-12 grid gap-8 md:grid-cols-3">

        <div>

          <h3 className="text-2xl font-black">
            Practical Tips
          </h3>

          <p className="mt-4 text-blue-100">
            Easy-to-follow advice for common plumbing issues.
          </p>

        </div>

        <div>

          <h3 className="text-2xl font-black">
            Expert Guidance
          </h3>

          <p className="mt-4 text-blue-100">
            Information based on professional plumbing practices.
          </p>

        </div>

        <div>

          <h3 className="text-2xl font-black">
            Emergency Help
          </h3>

          <p className="mt-4 text-blue-100">
            Learn what to do before professional help arrives.
          </p>

        </div>

      </div>

    </div>

  </div>

</section>

<CTA />

<Footer />

</main>
);
}