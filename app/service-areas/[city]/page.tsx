import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { cities } from "@/lib/data/cities";
import { locationContent, locations } from "@/lib/data/locations";
import { services } from "@/lib/data/services";
import { siteConfig } from "@/lib/config/site";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTASection from "@/components/sections/cta";
import NearbyCities from "@/components/sections/nearby-cities";
import BreadcrumbSchema from "@/components/seo/breadcrumb-schema";
import FAQSchema from "@/components/seo/faq-schema";
import LocalBusinessSchema from "@/components/seo/local-business-schema";
import ReferralLeadForm from "@/components/contact/referral-lead-form";

interface PageProps {
  params: Promise<{
    city: string;
  }>;
}

const primaryLocationSlugs = new Set(locations.map((loc) => loc.slug));
const coreLocationServices = new Set([
  "emergency-plumbing",
  "sewer-line-repair",
  "drain-cleaning",
  "leak-detection",
  "water-heater-repair",
  "pipe-repair",
]);

function getCityInfrastructureNote(cityName: string, slug: string, county: string): {
  soilAndWater: string;
  housingNote: string;
} {
  const rich = locationContent[slug];
  if (rich) {
    return {
      soilAndWater: rich.localSoilAndWater,
      housingNote: rich.housingProfile,
    };
  }

  return {
    soilAndWater: `Properties across ${cityName} and surrounding parts of ${county} frequently sit over expansive Gulf Coast clay and alluvial soils that shift seasonally, stressing slab water lines, sewer cleanouts, and main laterals.`,
    housingNote: `Whether servicing established 1960s–1980s ranch homes with cast-iron drains or newer ${county} subdivisions equipped with attic tank water heaters and PEX runs, independent local contractors tailor repairs to regional pipe materials and local code rules.`,
  };
}

export const dynamicParams = false;

export async function generateStaticParams() {
  return cities.map((city) => ({
    city: city.slug,
  }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { city: citySlug } = await params;

  const city = cities.find((c) => c.slug === citySlug);

  if (!city) {
    notFound();
  }

  const pageTitle = `Plumbing Referral in ${city.name}, TX`;
  const pageDescription = `Need plumbing help in ${city.name}, TX (${city.county})? Call (877) 587-3986 to connect with independent plumbers for leaks, drains, sewers & water heaters.`;

  return {
    title: pageTitle,
    description: pageDescription,
    keywords: [
      `${city.name} plumber`,
      `${city.name} plumbing`,
      `${city.name} emergency plumber`,
      `${city.name} drain cleaning`,
      `${city.name} leak detection`,
      `${city.name} water heater repair`,
      "PipeResque",
    ],
    alternates: {
      canonical: `${siteConfig.website}/service-areas/${city.slug}`,
    },
    openGraph: {
      title: `${pageTitle} | PipeResque`,
      description: pageDescription,
      url: `${siteConfig.website}/service-areas/${city.slug}`,
      siteName: siteConfig.company,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${pageTitle} | PipeResque`,
      description: pageDescription,
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CityPage({ params }: PageProps) {
  const { city: citySlug } = await params;

  const city = cities.find((c) => c.slug === citySlug);

  if (!city) {
    notFound();
  }

  const hasDedicatedLocationHubs = primaryLocationSlugs.has(city.slug);
  const infraNote = getCityInfrastructureNote(city.name, city.slug, city.county);
  const zipText = city.zipCodes.join(", ");

  const faqs = [
    {
      question: `How can I request plumbing help in ${city.name}, TX?`,
      answer: `Call PipeResque at ${siteConfig.phoneDisplay} or submit the callback request form on this page to connect with independent plumbing contractors serving ${city.name} (${zipText}). Provider availability varies by schedule.`,
    },
    {
      question: `What plumbing problems are common in ${city.name}?`,
      answer: `Homeowners in ${city.name} and ${city.county} commonly request help for emergency pipe leaks, sewer line backups, hydro-jetting and drain clearing, slab leak diagnostics, and gas or tankless water heater repairs.`,
    },
    {
      question: `Does PipeResque perform plumbing repairs in ${city.name}?`,
      answer: `No. PipeResque is a plumbing referral platform. All diagnostic evaluations, estimates, workmanship, and warranties are provided solely by independent third-party contractors.`,
    },
  ];

  return (
    <>
      <Navbar />
      <LocalBusinessSchema city={city} />
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.website },
          { name: "Service Areas", url: `${siteConfig.website}/service-areas` },
          {
            name: `${city.name}, TX`,
            url: `${siteConfig.website}/service-areas/${city.slug}`,
          },
        ]}
      />
      <FAQSchema faqs={faqs} />

      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="bg-slate-900 text-white py-20">
          <div className="container mx-auto px-4">
            <span className="inline-block rounded-full bg-red-600 px-4 py-1 text-sm font-semibold uppercase tracking-wide">
              {city.county} • ZIP {zipText}
            </span>

            <h1 className="mt-6 text-4xl font-bold md:text-6xl">
              Plumbing Services in {city.name}, TX
            </h1>

            <p className="mt-6 max-w-3xl text-lg text-slate-300">
              PipeResque helps homeowners across {city.name}, Texas ({city.county}) connect with
              independent third-party plumbing professionals. Whether you need
              emergency repairs, drain cleaning, slab leak detection, water heater
              repair, or sewer line evaluation, call the PipeResque referral line or request a callback below.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={`tel:${siteConfig.phone}`}
                data-event="phone_click_service"
                aria-label={`Call PipeResque for ${city.name} plumbing at ${siteConfig.phoneDisplay}`}
                className="rounded-xl bg-amber-500 px-7 py-3.5 font-black text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 active:scale-[0.98]"
              >
                Call {siteConfig.phoneDisplay}
              </a>

              <Link
                href="#request-referral"
                className="rounded-xl border border-white/40 bg-white/10 px-7 py-3.5 font-bold text-white hover:bg-white hover:text-slate-900 transition"
              >
                Request Callback
              </Link>
            </div>
          </div>
        </section>

        {/* Local Infrastructure Context */}
        <section className="border-b border-slate-200 bg-slate-50 py-14">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-5xl grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {city.name} Soil, Water &amp; Drain Conditions
                </h2>
                <p className="mt-3 text-slate-600 leading-7">
                  {infraNote.soilAndWater}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-6">
                <h2 className="text-xl font-bold text-slate-900">
                  {city.county} Housing &amp; Pipe Profile
                </h2>
                <p className="mt-3 text-slate-600 leading-7">
                  {infraNote.housingNote}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Services */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h2 className="text-3xl font-bold">
                Plumbing Services Available in {city.name}
              </h2>

              <p className="mt-3 text-gray-600">
                Explore common plumbing services and connect with independent contractors
                serving {city.name} ({zipText}) and surrounding communities.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const targetHref =
                  hasDedicatedLocationHubs &&
                  (city.slug === "houston" || coreLocationServices.has(service.slug))
                    ? `/location/${city.slug}/${service.slug}`
                    : `/services/${service.slug}`;

                return (
                  <Link
                    key={service.slug}
                    href={targetHref}
                    className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                  >
                    <service.icon size={40} className="text-red-600" />

                    <h3 className="mt-4 text-xl font-semibold">
                      {service.shortTitle} in {city.name}
                    </h3>

                    <p className="mt-3 text-gray-600">{service.description}</p>

                    <span className="mt-5 inline-block font-semibold text-red-600">
                      Explore {service.shortTitle} →
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="bg-gray-50 py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="text-3xl font-bold">
                Why Connect Through PipeResque in {city.name}?
              </h2>

              <p className="mt-4 text-gray-600">
                We make it straightforward to reach independent plumbing professionals when you need urgent help or scheduled repairs.
              </p>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-xl bg-white p-6 shadow">
                <h3 className="font-semibold text-lg">Phone Referral Line</h3>
                <p className="mt-3 text-gray-600">
                  Call {siteConfig.phoneDisplay} to connect with independent local service routing.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <h3 className="font-semibold text-lg">Independent Providers</h3>
                <p className="mt-3 text-gray-600">
                  Work directly with independent local plumbing contractors.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <h3 className="font-semibold text-lg">Upfront Discussion</h3>
                <p className="mt-3 text-gray-600">
                  Review pricing and diagnostic fees directly with the technician before work begins.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <h3 className="font-semibold text-lg">Local Coverage</h3>
                <p className="mt-3 text-gray-600">
                  Connecting homeowners throughout {city.name}, {city.county}, and Greater Houston.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-center text-3xl font-bold">
                Frequently Asked Questions
              </h2>

              <div className="mt-10 space-y-6">
                {faqs.map((faq) => (
                  <div key={faq.question} className="rounded-xl border p-6">
                    <h3 className="font-semibold">{faq.question}</h3>
                    <p className="mt-2 text-gray-600">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Inline Callback Form */}
        <section className="py-16 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-4 max-w-4xl">
            <ReferralLeadForm
              defaultService="Emergency Plumbing"
              heading={`Request Plumbing Help in ${city.name}, TX`}
              id="request-referral"
            />
          </div>
        </section>

        <NearbyCities currentCity={city.slug} />
        <CTASection />
      </main>

      <Footer />
    </>
  );
}
