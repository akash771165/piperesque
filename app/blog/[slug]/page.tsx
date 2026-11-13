import React from "react";
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
  CheckCircle2,
  MapPin,
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
import type { BlogCardEntry, BlogLink, BlogSection } from "@/types/blog";

export const dynamicParams = false;

export async function generateStaticParams() {
  const blogs = getAllBlogData();

  return blogs.map((blog) => ({
    slug: blog.slug,
  }));
}

function normalizeSeoTitle(rawTitle: string): string {
  return rawTitle
    .replace(/\s*\|\s*Pipe[rR]esque\s*$/i, "")
    .replace(/\bHouston\s+Houston\b/gi, "Houston")
    .replace(/\bTX\s+Houston\b/gi, "Houston, TX")
    .trim();
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

  const cleanTitle = normalizeSeoTitle(
    blog.seo?.title || blog.title || "Houston Plumbing Guide"
  );

  const description =
    blog.seo?.description ||
    blog.description ||
    "Helpful plumbing information, emergency shutoff checklists, and Houston plumbing referral resources.";

  const canonical =
    blog.seo?.canonical ||
    `${siteConfig.website}/blog/${blog.slug}`;

  return {
    title: cleanTitle,
    description,
    keywords: blog.seo?.keywords || blog.keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${cleanTitle} | PipeResque`,
      description,
      url: canonical,
      type: "article",
      ...(blog.image
        ? {
            images: [
              {
                url: blog.image,
                alt: blog.imageAlt || blog.title || "PipeResque Plumbing Guide",
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${cleanTitle} | PipeResque`,
      description,
      ...(blog.image
        ? {
            images: [blog.image],
          }
        : {}),
    },
  };
}

/**
 * Parses inline markdown links `[label](href)` cleanly into Next.js <Link> or safe <a> tags
 * so raw markdown syntax never renders in production UI.
 */
function renderRichText(text: unknown): React.ReactNode {
  if (typeof text !== "string") {
    return text == null ? null : String(text);
  }
  if (!text || !text.includes("[")) return text;

  const linkRegex = /\[([^\]]+)\]\(([^)\s]+)\)/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }

    const label = match[1];
    const href = match[2];

    if (href.startsWith("/")) {
      parts.push(
        <Link
          key={`${match.index}-${href}`}
          href={href}
          className="font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-900"
        >
          {label}
        </Link>
      );
    } else if (href.startsWith("tel:") || href.startsWith("mailto:")) {
      parts.push(
        <a
          key={`${match.index}-${href}`}
          href={href}
          className="font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-900"
        >
          {label}
        </a>
      );
    } else if (href.startsWith("https://") || href.startsWith("http://")) {
      parts.push(
        <a
          key={`${match.index}-${href}`}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-blue-700 underline underline-offset-4 hover:text-blue-900"
        >
          {label}
        </a>
      );
    } else {
      parts.push(match[0]);
    }

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return parts.length > 0 ? parts : text;
}

function getSectionCardItems(
  section: BlogSection
): Array<{ heading: string; body: string; details?: string[] }> {
  const groups: Array<Array<string | BlogCardEntry> | undefined> = [
    section.problems,
    section.costFactors,
    section.methods,
    section.services,
    section.advantages,
    section.solutions,
    section.causes,
    section.inspectionMethods,
    section.benefits,
    section.checklist,
    section.repairOptions,
    section.replacementReasons,
    section.selectionFactors,
    section.serviceList,
    section.situations,
    section.technology,
    section.materials,
    section.mistakes,
    section.emergencyIssues,
    section.emergencyServices,
    section.maintenanceSteps,
    section.maintenanceTips,
    section.preventionSteps,
    section.comparisonPoints,
    section.types,
  ];

  const items: Array<{ heading: string; body: string; details?: string[] }> = [];
  for (const group of groups) {
    if (!Array.isArray(group)) continue;
    for (const entry of group) {
      if (!entry || typeof entry !== "object") continue;
      const heading =
        entry.title ||
        entry.name ||
        entry.factor ||
        entry.item ||
        entry.reason ||
        entry.option ||
        entry.service ||
        entry.step ||
        "";
      const body = entry.description || entry.purpose || entry.benefit || "";
      const details = Array.isArray(entry.details) ? entry.details : undefined;
      if (heading || body || (details && details.length > 0)) {
        items.push({ heading, body, details });
      }
    }
  }
  return items;
}

function getSectionBulletLists(section: BlogSection): string[] {
  const combined: string[] = [];
  const pools: Array<Array<string | BlogCardEntry> | undefined> = [
    section.emergencySigns,
    section.warningSigns,
    section.signs,
    section.preventionBenefits,
    section.benefits,
    section.checklist,
    section.services,
    section.advantages,
    section.inspectionMethods,
    section.preventionSteps,
    section.types,
  ];
  for (const pool of pools) {
    if (!Array.isArray(pool)) continue;
    for (const item of pool) {
      if (typeof item === "string" && item.trim()) {
        combined.push(item);
      }
    }
  }
  return combined;
}

const CITY_SLUG_MAP: Record<string, string> = {
  houston: "houston",
  katy: "katy",
  "sugar land": "sugar-land",
  cypress: "cypress",
  spring: "spring",
  pearland: "pearland",
  pasadena: "pasadena",
  richmond: "richmond",
  "missouri city": "missouri-city",
  "the woodlands": "the-woodlands",
};

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

  // Dedupe internalLinks and relatedBlogs by URL for internal linking panel
  const resourceLinksMap = new Map<string, BlogLink>();
  for (const link of [...(blog.internalLinks ?? []), ...(blog.relatedBlogs ?? [])]) {
    if (link?.url && link?.title && !resourceLinksMap.has(link.url) && link.url !== `/blog/${blog.slug}`) {
      resourceLinksMap.set(link.url, {
        title: link.title,
        url: link.url,
      });
    }
  }
  const curatedLinks = Array.from(resourceLinksMap.values()).slice(0, 6);

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
              <span>By {typeof blog.author === "string" ? blog.author : blog.author?.name || "PipeResque"}</span>
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
              alt={blog.imageAlt ?? blog.title ?? "PipeResque Plumbing Guide"}
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
                {renderRichText(paragraph)}
              </p>
            ))}
          </section>
        )}

        {/* Sections */}
        {blog.sections?.map((section, index) => {
          const cardItems = getSectionCardItems(section);
          const extraBullets = getSectionBulletLists(section);
          const noteText = section.note || section.importantNote;

          return (
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
                  {renderRichText(paragraph)}
                </p>
              ))}

              {section.highlight && (
                <div className="my-6 rounded-2xl border-l-4 border-blue-600 bg-blue-50/70 p-5 text-base font-semibold text-slate-900">
                  {renderRichText(section.highlight)}
                </div>
              )}

              {section.bullets && section.bullets.length > 0 && (
                <ul className="my-6 space-y-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-slate-700">
                  {section.bullets.map((bullet, bulletIndex) => (
                    <li key={bulletIndex} className="flex items-start gap-3 text-base leading-7">
                      <ShieldCheck size={18} className="mt-1 shrink-0 text-blue-600" aria-hidden="true" />
                      <span>{renderRichText(bullet)}</span>
                    </li>
                  ))}
                </ul>
              )}

              {extraBullets.length > 0 && (
                <ul className="my-6 grid gap-3 rounded-2xl border border-slate-200 bg-slate-50/60 p-6 text-slate-700 sm:grid-cols-2">
                  {extraBullets.map((item, itemIdx) => (
                    <li key={itemIdx} className="flex items-start gap-2.5 text-base leading-6">
                      <CheckCircle2 size={17} className="mt-1 shrink-0 text-emerald-600" aria-hidden="true" />
                      <span>{renderRichText(item)}</span>
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
                      <span>{renderRichText(item)}</span>
                    </li>
                  ))}
                </ol>
              )}

              {(section.steps?.length || section.process?.length) ? (
                <div className="my-6 space-y-3">
                  {(section.steps ?? []).map((step, stepIdx) => (
                    <div
                      key={stepIdx}
                      className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-black text-white">
                        {stepIdx + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{step.title}</h3>
                        <p className="mt-1 text-sm leading-6 text-slate-600">{renderRichText(step.description)}</p>
                      </div>
                    </div>
                  ))}
                  {(section.process ?? []).map((item, procIdx) => (
                    <div
                      key={procIdx}
                      className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-blue-700 text-xs font-black text-white">
                        {procIdx + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-bold text-slate-900">{item.step || item.title}</h3>
                        {item.description && (
                          <p className="mt-1 text-sm leading-6 text-slate-600">{renderRichText(item.description)}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}

              {cardItems.length > 0 && (
                <div className="my-6 grid gap-4 sm:grid-cols-2">
                  {cardItems.map((card, cardIdx) => (
                    <div
                      key={cardIdx}
                      className="rounded-2xl border border-slate-200 bg-slate-50/50 p-5"
                    >
                      {card.heading && (
                        <h3 className="text-base font-bold text-slate-900">{card.heading}</h3>
                      )}
                      {card.body && (
                        <p className="mt-1.5 text-sm leading-6 text-slate-600">
                          {renderRichText(card.body)}
                        </p>
                      )}
                      {card.details && card.details.length > 0 && (
                        <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                          {card.details.map((d, dIdx) => (
                            <li key={dIdx} className="flex items-start gap-2">
                              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true" />
                              <span>{renderRichText(d)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {section.propertyTypes && section.propertyTypes.length > 0 && (
                <div className="my-6 grid gap-4 sm:grid-cols-2">
                  {section.propertyTypes.map((prop, propIdx) => (
                    <div
                      key={propIdx}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                    >
                      {prop.type && (
                        <h3 className="text-base font-bold text-slate-900">{prop.type}</h3>
                      )}
                      {Array.isArray(prop.services) && prop.services.length > 0 && (
                        <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                          {prop.services.map((srv, sIdx) => (
                            <li key={sIdx} className="flex items-start gap-2">
                              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-blue-600" aria-hidden="true" />
                              <span>{renderRichText(srv)}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {section.comparison && section.comparison.length > 0 && (
                <div className="my-6 grid gap-4 sm:grid-cols-2">
                  {section.comparison.map((comp, compIdx) => {
                    const list = comp.benefits || comp.features || [];
                    return (
                      <div
                        key={compIdx}
                        className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                      >
                        <h3 className="text-base font-bold text-slate-900">
                          {comp.method || comp.type || comp.title || comp.option || comp.service}
                        </h3>
                        {(comp.description || comp.purpose || comp.benefit) && (
                          <p className="mt-1.5 text-sm leading-6 text-slate-600">
                            {renderRichText(comp.description || comp.purpose || comp.benefit)}
                          </p>
                        )}
                        {list.length > 0 && (
                          <ul className="mt-3 space-y-1.5 text-sm text-slate-600">
                            {list.map((entry, eIdx) => (
                              <li key={eIdx} className="flex items-start gap-2">
                                <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-600" aria-hidden="true" />
                                <span>{renderRichText(entry)}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {section.table && section.table.headers?.length > 0 && (
                <div className="my-6 overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-100 text-xs font-bold uppercase tracking-wider text-slate-700">
                      <tr>
                        {section.table.headers.map((header, hIdx) => (
                          <th key={hIdx} className="px-5 py-3.5">
                            {header}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                      {section.table.rows?.map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50/70">
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className={`px-5 py-3.5 ${cIdx === 0 ? "font-semibold text-slate-900" : ""}`}>
                              {renderRichText(cell)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {section.locations && section.locations.length > 0 && (
                <div className="my-6 flex flex-wrap gap-2.5">
                  {section.locations.map((loc) => {
                    const matchedCitySlug = CITY_SLUG_MAP[loc.toLowerCase()];
                    if (matchedCitySlug) {
                      return (
                        <Link
                          key={loc}
                          href={`/service-areas/${matchedCitySlug}`}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-800 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                        >
                          <MapPin size={14} className="text-blue-600" aria-hidden="true" />
                          {loc}, TX
                        </Link>
                      );
                    }
                    return (
                      <span
                        key={loc}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-semibold text-slate-700"
                      >
                        <MapPin size={14} className="text-slate-500" aria-hidden="true" />
                        {loc}, TX
                      </span>
                    );
                  })}
                </div>
              )}

              {section.warning && (
                <div className="my-6 flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-6 text-red-900">
                  <AlertTriangle size={22} className="mt-0.5 shrink-0 text-red-600" aria-hidden="true" />
                  <div className="text-sm leading-6">
                    <strong className="block font-bold uppercase tracking-wider text-red-800 mb-1">Safety Warning</strong>
                    {renderRichText(section.warning)}
                  </div>
                </div>
              )}

              {noteText && (
                <div className="my-6 flex items-start gap-3 rounded-2xl border border-blue-200 bg-blue-50 p-6 text-blue-950">
                  <Info size={22} className="mt-0.5 shrink-0 text-blue-700" aria-hidden="true" />
                  <div className="text-sm leading-6">
                    <strong className="block font-bold uppercase tracking-wider text-blue-900 mb-1">Important Note</strong>
                    {renderRichText(noteText)}
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
                      <li key={tipIndex} className="text-base leading-7">{renderRichText(tip)}</li>
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
          );
        })}

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
                    {renderRichText(faq.answer)}
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
                Request Callback Online
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

        {/* Internal Curated Resource Links */}
        {curatedLinks.length > 0 && (
          <section className="mb-14 border-t border-slate-200 pt-10">
            <h2 className="text-2xl font-black text-slate-900">
              Helpful Houston Plumbing Guides &amp; Resources
            </h2>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {curatedLinks.map((link) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className="group flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-3.5 text-sm font-bold text-slate-800 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                >
                  <span>{link.title}</span>
                  <ArrowRight size={16} className="shrink-0 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Related Services Links */}
        <RelatedServices currentSlug={blog.slug} />
      </article>

      <Footer />
    </main>
  );
}