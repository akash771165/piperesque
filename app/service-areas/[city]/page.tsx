import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { cities } from "@/lib/data/cities";
import { services } from "@/lib/data/services";
import { siteConfig } from "@/lib/config/site";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTASection from "@/components/sections/cta";
import NearbyCities from "@/components/sections/nearby-cities";
import LocalBusinessSchema from "@/components/seo/local-business-schema";

interface PageProps {
  params: Promise<{
    city: string;
  }>;
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

  return {
    title: `Plumbing Services in ${city.name}, TX | Emergency Help`,

    description: `Need plumbing help in ${city.name}, TX? Piperesque connects homeowners with independent local plumbing providers for emergency repairs, drains, leaks, and water heaters. Call (877) 364-0861.`,

    keywords: [
      `${city.name} plumber`,
      `${city.name} plumbing`,
      `${city.name} emergency plumber`,
      `${city.name} drain cleaning`,
      `${city.name} leak detection`,
      `${city.name} water heater repair`,
      "Piperesque",
    ],

    alternates: {
      canonical: `${siteConfig.website}/service-areas/${city.slug}`,
    },

    openGraph: {
      title: `Plumbing Services in ${city.name}, TX`,
      description: `Trusted plumbing referral service in ${city.name}, Texas.`,
      url: `${siteConfig.website}/service-areas/${city.slug}`,
      siteName: "Piperesque",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: `Plumbing Services in ${city.name}`,
      description: `Independent plumbing professionals serving ${city.name}, TX.`,
    },

    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function CityPage({
  params,
}: PageProps) {
  const { city: citySlug } = await params;

  const city = cities.find(
    (c) => c.slug === citySlug
  );

  if (!city) {
    notFound();
  }


    return (
    <>
      <Navbar />
<LocalBusinessSchema city={city} />
      <main className="min-h-screen">

        {/* Hero Section */}

        <section className="bg-slate-900 text-white py-20">

          <div className="container mx-auto px-4">

            <span className="inline-block rounded-full bg-red-600 px-4 py-1 text-sm font-semibold uppercase tracking-wide">
              Service Area
            </span>

            <h1 className="mt-6 text-4xl font-bold md:text-6xl">
              Plumbing Services in {city.name}, TX
            </h1>

            <p className="mt-6 max-w-3xl text-lg text-slate-300">
              Piperesque helps homeowners across {city.name}, Texas connect with
              independent third-party plumbing professionals. Whether you need
              emergency repairs, drain cleaning, leak detection, water heater
              repair, or general residential plumbing, call the PipeResque referral line to connect with an independent local professional.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <a
                href={`tel:${siteConfig.phone}`}
                className="rounded-xl bg-amber-500 px-7 py-3.5 font-black text-slate-950 hover:bg-amber-400 transition shadow-lg shadow-amber-500/20 active:scale-[0.98]"
              >
                Call {siteConfig.phoneDisplay}
              </a>

              <Link
                href="/contact"
                className="rounded-xl border border-white/40 bg-white/10 px-7 py-3.5 font-bold text-white hover:bg-white hover:text-slate-900 transition"
              >
                Contact by Phone or Email
              </Link>

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
                serving {city.name} and surrounding communities.
              </p>

            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

              {services.map((service) => (
                <a
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <service.icon
                    size={40}
                    className="text-red-600"
                  />

                  <h3 className="mt-4 text-xl font-semibold">
                    {service.shortTitle}
                  </h3>

                  <p className="mt-3 text-gray-600">
                    {service.description}
                  </p>

                  <span className="mt-5 inline-block font-semibold text-red-600">
                    Learn More →
                  </span>

                </a>
              ))}

            </div>

          </div>

        </section>
                {/* Why Choose Us */}

        <section className="bg-gray-50 py-20">

          <div className="container mx-auto px-4">

            <div className="mx-auto max-w-3xl text-center">

              <h2 className="text-3xl font-bold">
                Why Connect Through Piperesque in {city.name}?
              </h2>

              <p className="mt-4 text-gray-600">
                We make it straightforward to reach independent plumbing professionals when you need urgent help or scheduled repairs.
              </p>

            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-xl bg-white p-6 shadow">
                <h3 className="font-semibold text-lg">
                  Phone Referral Line
                </h3>
                <p className="mt-3 text-gray-600">
                  Call (877) 364-0861 anytime to connect with service routing.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <h3 className="font-semibold text-lg">
                  Independent Providers
                </h3>
                <p className="mt-3 text-gray-600">
                  Work directly with independent local plumbing contractors.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <h3 className="font-semibold text-lg">
                  Upfront Pricing
                </h3>
                <p className="mt-3 text-gray-600">
                  Review pricing and diagnostic fees directly with the technician before work begins.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <h3 className="font-semibold text-lg">
                  Local Coverage
                </h3>
                <p className="mt-3 text-gray-600">
                  Connecting homeowners throughout {city.name} and Greater Houston.
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

                <div className="rounded-xl border p-6">
                  <h3 className="font-semibold">
                    Can I request plumbing assistance in {city.name} anytime?
                  </h3>

                  <p className="mt-2 text-gray-600">
                    Yes. PipeResque accepts telephone inquiries at any time to connect you with independent plumbing service providers. Provider availability and response times depend on the independent contractor serving your area.
                  </p>
                </div>

                <div className="rounded-xl border p-6">
                  <h3 className="font-semibold">
                    What plumbing services can I find help for in {city.name}?
                  </h3>

                  <p className="mt-2 text-gray-600">
                    Independent providers handle emergency repairs, drain cleaning, leak detection, water heater repair, sewer line repair, and general residential plumbing.
                  </p>
                </div>

                <div className="rounded-xl border p-6">
                  <h3 className="font-semibold">
                    How are estimates and service pricing determined?
                  </h3>

                  <p className="mt-2 text-gray-600">
                    Diagnostic charges, estimates, and repair prices are determined directly by the independent plumbing provider. Homeowners should confirm all pricing and terms directly with the provider before authorizing work.
                  </p>
                </div>

              </div>

            </div>

          </div>

        </section>
<NearbyCities currentCity={city.slug} />
        <CTASection />

      </main>

      <Footer />

    </>
  );
}
