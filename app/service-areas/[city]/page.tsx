import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { cities } from "@/lib/data/cities";
import { services } from "@/lib/data/services";

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
    return {
      title: "City Not Found | Piperesque",
    };
  }

  return {
    title: `Plumber in ${city.name}, TX | 24/7 Plumbing Services | Piperesque`,

    description: `Piperesque provides emergency plumbing, drain cleaning, leak detection, water heater repair, sewer line repair and residential plumbing services throughout ${city.name}, Texas.`,

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
      canonical: `https://piperescue.com/service-areas/${city.slug}`,
    },

    openGraph: {
      title: `Plumbing Services in ${city.name}, TX`,
      description: `Trusted plumbing services in ${city.name}, Texas.`,
      url: `https://piperescue.com/service-areas/${city.slug}`,
      siteName: "Piperesque",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: `Plumbing Services in ${city.name}`,
      description: `Professional plumbers serving ${city.name}, TX.`,
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
              Piperesque proudly provides fast, affordable, and professional
              plumbing services throughout {city.name}, Texas. Whether you need
              emergency plumbing, drain cleaning, leak detection, water heater
              repair, or complete residential plumbing solutions, our licensed
              plumbers are ready 24/7.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">

              <a
                href="tel:+18327100000"
                className="rounded-lg bg-red-600 px-6 py-3 font-semibold hover:bg-red-700 transition"
              >
                Call Now
              </a>

              <a
                href="/contact"
                className="rounded-lg border border-white px-6 py-3 font-semibold hover:bg-white hover:text-slate-900 transition"
              >
                Request Service
              </a>

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
                We proudly offer complete residential and commercial plumbing
                services across {city.name}.
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
                Why Choose Piperesque in {city.name}?
              </h2>

              <p className="mt-4 text-gray-600">
                We are committed to delivering fast, honest, and professional
                plumbing solutions backed by experienced licensed plumbers and
                exceptional customer service.
              </p>

            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-4">

              <div className="rounded-xl bg-white p-6 shadow">
                <h3 className="font-semibold text-lg">
                  24/7 Emergency Service
                </h3>
                <p className="mt-3 text-gray-600">
                  Available day and night for urgent plumbing emergencies.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <h3 className="font-semibold text-lg">
                  Licensed Professionals
                </h3>
                <p className="mt-3 text-gray-600">
                  Experienced plumbers delivering quality workmanship.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <h3 className="font-semibold text-lg">
                  Upfront Pricing
                </h3>
                <p className="mt-3 text-gray-600">
                  Honest estimates with no hidden charges.
                </p>
              </div>

              <div className="rounded-xl bg-white p-6 shadow">
                <h3 className="font-semibold text-lg">
                  Fast Response
                </h3>
                <p className="mt-3 text-gray-600">
                  Quick arrival across {city.name} and nearby communities.
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
                    Do you offer 24/7 emergency plumbing in {city.name}?
                  </h3>

                  <p className="mt-2 text-gray-600">
                    Yes. Our emergency plumbers are available 24 hours a day,
                    7 days a week.
                  </p>
                </div>

                <div className="rounded-xl border p-6">
                  <h3 className="font-semibold">
                    What plumbing services do you provide?
                  </h3>

                  <p className="mt-2 text-gray-600">
                    We provide drain cleaning, leak detection, water heater
                    repair, sewer line repair, pipe repair, toilet repair,
                    faucet repair, residential, commercial, and emergency
                    plumbing services.
                  </p>
                </div>

                <div className="rounded-xl border p-6">
                  <h3 className="font-semibold">
                    Are estimates free?
                  </h3>

                  <p className="mt-2 text-gray-600">
                    Contact us today for service availability and pricing in
                    your area.
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
