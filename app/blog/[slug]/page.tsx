import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Calendar,
  Clock,
  ArrowLeft,
  Phone,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Info,
} from "lucide-react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import BreadcrumbSchema from "@/components/seo/breadcrumb-schema";
import FAQSchema from "@/components/seo/faq-schema";
import JsonLd from "@/components/seo/json-ld";
import RelatedServices from "@/components/blog/related-services";

import { getBlogData } from "@/lib/blog/get-blog-data";
import { getAllBlogData } from "@/lib/blog/get-all-blog-data";
import { siteConfig } from "@/lib/config/site";

export const dynamicParams = false;

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
    notFound();
  }

  const title =
    blog.seo?.title ||
    blog.title ||
    "Plumbing Guide | PipeResque";

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

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: blog.title,
    description: blog.description,
    image: blog.image ? [`${siteConfig.website}${blog.image}`] : undefined,
    datePublished: blog.publishedAt || "2026-01-01",
    dateModified: blog.updatedAt || blog.publishedAt || "2026-01-01",
    author: {
      "@type": "Organization",
      name: typeof blog.author === "string" ? blog.author : blog.author?.name || siteConfig.company,
      url: siteConfig.website,
    },
    publisher: {
      "@type": "Organization",
      name: siteConfig.company,
      url: siteConfig.website,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${siteConfig.website}/blog/${blog.slug}`,
    },
  };

  return (
    <main className="min-h-screen bg-white">
      <BreadcrumbSchema
        items={[
          {
            name: "Home",
            url: siteConfig.website,
          },
          {
            name: "Plumbing Guide",
            url: `${siteConfig.website}/blog`,
          },
          {
            name: blog.title || "Plumbing Guide",
            url: `${siteConfig.website}/blog/${blog.slug}`,
          },
        ]}
      />

      <JsonLd schema={articleSchema} />

      {blog.faqs && blog.faqs.length > 0 && <FAQSchema faqs={blog.faqs} />}

      <Navbar />

      {/* Hero */}
      <section className="bg-slate-950 py-16 md:py-24 text-white">
        <div className="container-custom mx-auto max-w-5xl px-4">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-blue-300 transition hover:text-white"
          >
            <ArrowLeft size={18} />
            Back to Plumbing Guides
          </Link>

          <div className="mb-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex rounded-full bg-blue-600 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
              {blog.category ?? "Plumbing Guide"}
            </span>
            <span className="inline-flex rounded-full bg-white/10 px-3.5 py-1.5 text-xs font-medium text-slate-300">
              Greater Houston, TX
            </span>
          </div>

          <h1 className="max-w-4xl text-3xl font-black leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
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
                <Calendar size={17} className="text-amber-400" />
                <span>Updated: {blog.publishedAt}</span>
              </div>
            )}

            {blog.readingTime && (
              <div className="flex items-center gap-2">
                <Clock size={17} className="text-amber-400" />
                <span>{blog.readingTime}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-slate-400">
              <span>By {typeof blog.author === "string" ? blog.author : blog.author?.name || "Piperesque"}</span>
            </div>
          </div>

          {/* Quick Problem Callout Banner in Hero */}
          <div className="mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 p-4 md:p-5">
            <div>
              <p className="text-sm font-bold text-white">
                Facing an urgent plumbing or water heater problem right now?
              </p>
              <p className="text-xs text-slate-300">
                Connect with an independent local plumbing service provider in Houston.
              </p>
            </div>
            <a
              href={`tel:${siteConfig.phone}`}
              data-event="phone_click_header"
              aria-label={`Call PipeResque Referral Hotline at ${siteConfig.phoneDisplay}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-amber-400 shadow active:scale-95"
            >
              <Phone size={16} className="fill-slate-950" />
              Call {siteConfig.phoneDisplay}
            </a>
          </div>
        </div>
      </section>

      {/* Article Body */}
      <article className="container-custom mx-auto max-w-4xl px-4 py-16">
        {/* Featured Image */}
        {blog.image && (
          <div className="relative mb-12 aspect-[16/9] overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
            <Image
              src={blog.image}
              alt={blog.imageAlt ?? blog.title ?? "Piperesque Plumbing Guide"}
              fill
              priority
              sizes="(max-width: 768px) 100vw, 896px"
              className="object-cover"
            />
          </div>
        )}

        {/* Introduction */}
        {blog.introduction?.length > 0 && (
          <section className="mb-12 border-b border-slate-200 pb-10">
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
            className="mb-14"
          >
            <h2 className="mb-4 text-2xl font-black text-slate-900 md:text-3xl">
              {section.title}
            </h2>

            {section.subtitle && (
              <p className="mb-5 text-base font-semibold text-blue-700 md:text-lg">
                {section.subtitle}
              </p>
            )}

            {section.content?.map((paragraph, paragraphIndex) => (
              <p
                key={paragraphIndex}
                className="mb-5 text-lg leading-8 text-slate-700"
              >
                {paragraph}
              </p>
            ))}

            {section.bullets && section.bullets.length > 0 && (
              <ul className="my-6 space-y-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-slate-700">
                {section.bullets.map((bullet, bulletIndex) => (
                  <li key={bulletIndex} className="flex items-start gap-3 text-base leading-7">
                    <ShieldCheck size={18} className="mt-1 shrink-0 text-blue-600" aria-hidden="true" />
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            )}

            {section.numberedList && section.numberedList.length > 0 && (
              <ol className="my-6 space-y-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-slate-700">
                {section.numberedList.map((item, itemIndex) => (
                  <li key={itemIndex} className="flex items-start gap-3 text-base leading-7">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                      {itemIndex + 1}
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ol>
            )}

            {section.warning && (
              <div className="my-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
                <AlertTriangle size={22} className="mt-0.5 shrink-0 text-red-600" aria-hidden="true" />
                <div className="text-sm leading-6">
                  <strong className="block font-bold uppercase tracking-wider text-red-800 mb-1">Safety Warning</strong>
                  {section.warning}
                </div>
              </div>
            )}

            {section.note && (
              <div className="my-6 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-blue-950">
                <Info size={22} className="mt-0.5 shrink-0 text-blue-700" aria-hidden="true" />
                <div className="text-sm leading-6">
                  <strong className="block font-bold uppercase tracking-wider text-blue-900 mb-1">Important Note</strong>
                  {section.note}
                </div>
              </div>
            )}

            {section.tips && section.tips.length > 0 && (
              <div className="my-6 rounded-2xl bg-slate-50 p-6 border border-slate-200">
                <h3 className="mb-4 text-lg font-bold text-slate-900">
                  Helpful Advice
                </h3>
                <ul className="list-disc space-y-2 pl-6 text-slate-700">
                  {section.tips.map((tip, tipIndex) => (
                    <li key={tipIndex} className="text-base leading-7">{tip}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Mid-Article Call CTA inserted after Section 2 */}
            {index === 1 && (
              <div className="my-10 rounded-2xl border border-amber-200 bg-amber-50/50 p-6 md:p-8 text-center sm:text-left sm:flex sm:items-center sm:justify-between sm:gap-6 shadow-sm">
                <div className="max-w-xl">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Houston Plumbing Assistance
                  </span>
                  <h3 className="mt-1 text-xl font-black text-slate-900">
                    Need Help Diagnosing This Plumbing Problem?
                  </h3>
                  <p className="mt-2 text-sm text-slate-600 leading-6">
                    Connect with an independent local plumbing service provider in Greater Houston through the PipeResque referral line.
                  </p>
                </div>
                <div className="mt-5 sm:mt-0 shrink-0">
                  <a
                    href={`tel:${siteConfig.phone}`}
                    data-event="phone_click_content"
                    aria-label={`Call PipeResque Referral Hotline at ${siteConfig.phoneDisplay}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-sm font-black text-slate-950 shadow transition hover:bg-amber-400 active:scale-95"
                  >
                    <Phone size={17} className="fill-slate-950" />
                    Call {siteConfig.phoneDisplay}
                  </a>
                </div>
              </div>
            )}
          </section>
        ))}

        {/* FAQs */}
        {blog.faqs && blog.faqs.length > 0 && (
          <section className="mb-14 border-t border-slate-200 pt-12">
            <h2 className="mb-8 text-3xl font-black text-slate-900">
              Frequently Asked Questions
            </h2>

            <div className="space-y-4">
              {blog.faqs.map((faq, index) => (
                <div
                  key={index}
                  className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-bold text-slate-900">
                    {faq.question}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-slate-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Primary Call to Action Card with Transparent Referral Disclosure */}
        <section className="my-14 rounded-3xl bg-slate-950 p-8 text-white md:p-12 shadow-2xl border border-slate-800">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full bg-amber-500/20 px-3.5 py-1 text-xs font-bold uppercase tracking-wider text-amber-400">
              Telephone Referral Line
            </span>

            <h2 className="mt-4 text-2xl font-black sm:text-3xl md:text-4xl">
              {blog.callToAction?.title || "Need Plumbing Assistance in Houston?"}
            </h2>

            <p className="mt-4 text-base leading-7 text-slate-300 md:text-lg">
              {blog.callToAction?.description ||
                "Speak with an independent plumbing service provider serving Greater Houston. Call our referral line to discuss your plumbing issue."}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={`tel:${siteConfig.phone}`}
                data-event="phone_click_content"
                aria-label={`Call PipeResque at ${siteConfig.phoneDisplay}`}
                className="inline-flex items-center gap-2.5 rounded-xl bg-amber-500 px-8 py-4 text-base font-black text-slate-950 transition hover:bg-amber-400 active:scale-95 shadow-lg"
              >
                <Phone size={19} className="fill-slate-950" />
                Call {siteConfig.phoneDisplay}
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-4 text-base font-semibold text-white transition hover:bg-white hover:text-slate-950"
              >
                Contact Options
                <ArrowRight size={18} />
              </Link>
            </div>

            {/* Required Transparent Referral Disclosure */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <p className="text-xs leading-6 text-slate-400">
                <strong className="text-slate-300">Referral Notice:</strong>{" "}
                PipeResque is a plumbing referral platform that connects visitors with independent plumbing service providers. Services are performed by independent providers, not PipeResque. Availability, scheduling, diagnostic fees, warranties, and workmanship are determined directly by the servicing contractor.
              </p>
            </div>
          </div>
        </section>

        {/* Related Services Links */}
        <RelatedServices currentSlug={blog.slug} />
      </article>

      <Footer />
    </main>
  );
}