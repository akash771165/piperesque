import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import FAQSchema from "@/components/seo/faq-schema";
import BreadcrumbSchema from "@/components/seo/breadcrumb-schema";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";

import { services } from "@/lib/data/services";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const service = services.find((item) => item.slug === slug);

  if (!service) {
    return {
      title: "Service Not Found",
    };
  }

  return {
    title: service.seoTitle,
    description: service.metaDescription,
    keywords: service.keywords,
robots: {
  index: true,
  follow: true,
},

category: "Plumbing Services",
    alternates: {
      canonical: `https://www.piperesque.com/services/${service.slug}`,
    },

    openGraph: {
      title: service.seoTitle,
      description: service.metaDescription,
      url: `https://www.piperesque.com/services/${service.slug}`,
      type: "website",

      images: [
        {
          url: service.image,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: service.seoTitle,
      description: service.metaDescription,
      images: [service.image],
    },
  };
}
export default async function ServicePage({
  params,
}: Props) {
  const { slug } = await params;

  const service = services.find(
    (item) => item.slug === slug
  );

  if (!service) {
    notFound();
  }

  const Icon = service.icon;

  const currentIndex = services.findIndex(
    (item) => item.slug === service.slug
  );

  const related = Array.from(
    { length: Math.min(3, services.length - 1) },
    (_, offset) =>
      services[(currentIndex + offset + 1) % services.length]
  );

  return (
    <main className="overflow-x-hidden bg-white">
      <BreadcrumbSchema
  items={[
    {
      name: "Home",
      url: "https://www.piperesque.com",
    },
    {
      name: "Services",
      url: "https://www.piperesque.com/services",
    },
    {
      name: service.shortTitle,
      url: `https://www.piperesque.com/services/${service.slug}`,
    },
  ]}
/>
<FAQSchema
  faqs={[
    {
      question: `Do you provide ${service.shortTitle} in Houston?`,
      answer: `Yes. Piperesque provides professional ${service.shortTitle.toLowerCase()} services throughout Houston and nearby areas.`,
    },
    {
      question: "Do you offer emergency plumbing services?",
      answer:
        "Yes. We provide emergency plumbing services for residential and commercial properties.",
    },
    {
      question: "Are your plumbers licensed?",
      answer:
        "Yes. Our plumbing professionals are experienced and trained to handle a wide range of plumbing issues.",
    },
    {
      question: "Can I request a free estimate?",
      answer:
        "Yes. Contact us to request a free plumbing estimate.",
    },
  ]}
/>
      <Navbar />

      {/* Hero */}

      <section className="relative overflow-hidden py-28">

        <Image
          src={service.image}
          alt={service.title}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-blue-950/80" />

        <div className="container-custom relative z-10">

          <div className="max-w-4xl">

            <div className="inline-flex h-20 w-20 items-center justify-center rounded-3xl bg-white/15 backdrop-blur">

              <Icon
                size={42}
                className="text-white"
              />

            </div>

            <h1 className="mt-8 text-5xl font-black leading-tight text-white lg:text-6xl">
              {service.heroTitle}
            </h1>

            <p className="mt-8 max-w-3xl text-xl leading-9 text-blue-100">
              {service.heroDescription}
            </p>

          </div>

        </div>

      </section>

      {/* Content */}

      <section className="py-24">

        <div className="container-custom grid gap-16 lg:grid-cols-[2fr_1fr]">

          <div>

            <h2 className="text-4xl font-black">
              {service.title}
            </h2>

            <p className="mt-8 text-lg leading-9 text-slate-600">
              {service.description}
            </p>

            <h3 className="mt-14 text-3xl font-black">
              Why Choose Piperesque?
            </h3>

            <div className="mt-8 space-y-5">

              {service.benefits.map((benefit) => (

                <div
                  key={benefit}
                  className="flex items-center gap-4"
                >

                  <div className="h-3 w-3 rounded-full bg-green-600" />

                  <span className="text-lg">
                    {benefit}
                  </span>

                </div>

              ))}

            </div>

          </div>
                    <aside>

            <div className="sticky top-28 rounded-[32px] border border-slate-200 bg-slate-50 p-8">

              <h3 className="text-2xl font-black">
                Need Plumbing Help?
              </h3>

              <p className="mt-5 leading-8 text-slate-600">
                Our licensed plumbing professionals are available for
                residential and commercial plumbing services throughout
                Houston.
              </p>

              <Link
                href="/contact"
                className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-6 py-4 font-bold text-white transition hover:bg-blue-700"
              >
                Request Free Estimate
              </Link>

              <Link
                href="/services"
                className="mt-4 inline-flex w-full items-center justify-center rounded-full border border-slate-300 px-6 py-4 font-bold transition hover:bg-white"
              >
                View All Services
              </Link>

            </div>

          </aside>

        </div>

      </section>

      {/* Related Services */}

      <section className="pb-24">

        <div className="container-custom">

          <h2 className="text-4xl font-black">
            Related Services
          </h2>

          <div className="mt-12 grid gap-8 md:grid-cols-3">

            {related.map((item) => {

              const RelatedIcon = item.icon;

              return (

                <Link
                  key={item.slug}
                  href={`/services/${item.slug}`}
                  className="rounded-[28px] border border-slate-200 bg-white p-8 shadow-lg transition hover:-translate-y-2 hover:border-blue-600 hover:shadow-xl"
                >

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">

                    <RelatedIcon
                      size={30}
                      className="text-blue-600"
                    />

                  </div>

                  <h3 className="mt-6 text-2xl font-black">
                    {item.shortTitle}
                  </h3>

                  <p className="mt-4 leading-8 text-slate-600">
                    {item.metaDescription}
                  </p>

                </Link>

              );
            })}

          </div>

        </div>

      </section>

      <CTA />

      <Footer />

    </main>
  );
}