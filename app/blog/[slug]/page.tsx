import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";

import {
  Calendar,
  Clock,
  ArrowLeft,
  Phone,
} from "lucide-react";

import Link from "next/link";

import { getBlogData } from "@/lib/blog/get-blog-data";
import { getAllBlogData } from "@/lib/blog/get-all-blog-data";
import { siteConfig } from "@/lib/config/site";

export async function generateStaticParams() {
  const blogs = getAllBlogData();

  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = getBlogData(slug);

  if (!blog) {
    return {
      title: "Blog | Piperesque",
      description: "Plumbing tips, guides, and information from Piperesque.",
    };
  }

  const title =
    blog.seo?.title ||
    blog.title ||
    "Plumbing Guide | Piperesque";

  const description =
    blog.seo?.description ||
    blog.description ||
    "Helpful plumbing information, emergency tips, and local plumbing guides.";

  const canonical =
    blog.seo?.canonical ||
    `${siteConfig.website}/blog/${blog.slug}`;

  return {
    title,
    description,
    keywords: blog.seo?.keywords || blog.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      ...(blog.image
        ? {
            images: [
              {
                url: blog.image,
                alt: blog.imageAlt || blog.title || "Piperesque Plumbing",
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(blog.image
        ? {
            images: [blog.image],
          }
        : {}),
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const blog = getBlogData(slug);

  if (!blog) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-slate-950 py-20 text-white">
        <div className="container-custom mx-auto max-w-5xl px-4">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-blue-300 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Blog
          </Link>

          <div className="mb-6">
            <span className="inline-flex rounded-full bg-blue-600 px-4 py-2 text-sm font-bold">
              {blog.category ?? "Plumbing"}
            </span>
          </div>

          <h1 className="max-w-4xl text-4xl font-black leading-tight md:text-5xl lg:text-6xl">
            {blog.title}
          </h1>

          {blog.description && (
            <p className="mt-6 max-w-3xl text-lg leading-8 text-blue-100 md:text-xl">
              {blog.description}
            </p>
          )}

          <div className="mt-8 flex flex-wrap items-center gap-6 text-sm text-slate-300">
            {blog.publishedAt && (
              <div className="flex items-center gap-2">
                <Calendar size={17} />
                {blog.publishedAt}
              </div>
            )}

            {blog.readingTime && (
              <div className="flex items-center gap-2">
                <Clock size={17} />
                {blog.readingTime}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article */}
      <article className="container-custom mx-auto max-w-4xl px-4 py-16">
        {/* Featured Image */}
        {blog.image && (
          <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-3xl">
            <Image
              src={blog.image}
              alt={
                blog.imageAlt ??
                blog.title ??
                "Piperesque Plumbing"
              }
              fill
              priority
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* Introduction */}
        {blog.introduction?.length > 0 && (
          <section className="mb-12">
            {blog.introduction.map((paragraph, index) => (
              <p
                key={index}
                className="mb-5 text-lg leading-9 text-slate-700"
              >
                {paragraph}
              </p>
            ))}
          </section>
        )}

        {/* Sections */}
        {blog.sections?.map((section, index) => (
          <section
            key={section.id ?? index}
            className="mb-12"
          >
            <h2 className="mb-5 text-3xl font-black text-slate-900">
              {section.title}
            </h2>

            {section.subtitle && (
              <p className="mb-5 text-lg font-semibold text-slate-600">
                {section.subtitle}
              </p>
            )}

            {section.content?.map((paragraph, paragraphIndex) => (
              <p
                key={paragraphIndex}
                className="mb-5 text-lg leading-9 text-slate-700"
              >
                {paragraph}
              </p>
            ))}

            {section.bullets &&
              section.bullets.length > 0 && (
                <ul className="mb-6 list-disc space-y-3 pl-6 text-lg leading-8 text-slate-700">
                  {section.bullets.map(
                    (bullet, bulletIndex) => (
                      <li key={bulletIndex}>{bullet}</li>
                    )
                  )}
                </ul>
              )}

            {section.numberedList &&
              section.numberedList.length > 0 && (
                <ol className="mb-6 list-decimal space-y-3 pl-6 text-lg leading-8 text-slate-700">
                  {section.numberedList.map(
                    (item, itemIndex) => (
                      <li key={itemIndex}>{item}</li>
                    )
                  )}
                </ol>
              )}

            {section.warning && (
              <div className="my-6 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-800">
                <strong>Warning:</strong>{" "}
                {section.warning}
              </div>
            )}

            {section.note && (
              <div className="my-6 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-blue-900">
                <strong>Note:</strong> {section.note}
              </div>
            )}

            {section.tips &&
              section.tips.length > 0 && (
                <div className="my-6 rounded-2xl bg-slate-50 p-6">
                  <h3 className="mb-4 text-xl font-bold text-slate-900">
                    Helpful Tips
                  </h3>

                  <ul className="list-disc space-y-2 pl-6 text-slate-700">
                    {section.tips.map(
                      (tip, tipIndex) => (
                        <li key={tipIndex}>{tip}</li>
                      )
                    )}
                  </ul>
                </div>
              )}
          </section>
        ))}

        {/* FAQs */}
        {blog.faqs && blog.faqs.length > 0 && (
          <section className="mb-12">
            <h2 className="mb-8 text-3xl font-black text-slate-900">
              Frequently Asked Questions
            </h2>

            <div className="space-y-5">
              {blog.faqs.map((faq, index) => (
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
        )}

        {/* CTA */}
        {blog.callToAction && (
          <section className="rounded-3xl bg-blue-600 p-8 text-white md:p-12">
            <h2 className="text-3xl font-black">
              {blog.callToAction.title}
            </h2>

            <p className="mt-4 text-lg leading-8 text-blue-100">
              {blog.callToAction.description}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              {blog.callToAction.phone && (
                <a
                  href={`tel:${blog.callToAction.phone}`}
                  className="inline-flex items-center gap-3 rounded-full bg-white px-7 py-4 font-bold text-blue-700 transition hover:bg-blue-50"
                >
                  <Phone size={18} />
                  {blog.callToAction.phone}
                </a>
              )}

              {blog.callToAction.url && (
                <Link
                  href={blog.callToAction.url}
                  className="inline-flex items-center rounded-full border border-white/30 px-7 py-4 font-bold text-white transition hover:bg-white/10"
                >
                  {blog.callToAction.button}
                </Link>
              )}
            </div>
          </section>
        )}
      </article>
    </main>
  );
}