import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";

import { locations } from "@/lib/data/locations";
import { services } from "@/lib/data/services";

type Props = {
  params: Promise<{
    location: string;
  }>;
};

export async function generateStaticParams() {
  return locations.map((location) => ({
    location: location.slug,
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { location } = await params;

  const currentLocation = locations.find(
    (item) => item.slug === location
  );

  if (!currentLocation) {
    return {
      title: "Location Not Found | Piperesque",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  return {
    title: `Plumbing Services in ${currentLocation.city}, ${currentLocation.stateCode} | Piperesque`,
    description: `Explore plumbing services available in ${currentLocation.city}, ${currentLocation.state}. Find information about emergency plumbing, drain cleaning, water heater repair, leak detection, and other residential plumbing services.`,
    alternates: {
      canonical: `https://www.piperesque.com/location/${currentLocation.slug}`,
    },
    openGraph: {
      title: `Plumbing Services in ${currentLocation.city}, ${currentLocation.stateCode} | Piperesque`,
      description: `Explore plumbing services available in ${currentLocation.city}, ${currentLocation.state}.`,
      url: `https://www.piperesque.com/location/${currentLocation.slug}`,
      type: "website",
    },
  };
}
export default async function LocationPage({
  params,
}: Props) {
  const { location } = await params;

  const currentLocation = locations.find(
    (item) => item.slug === location
  );

  if (!currentLocation) {
    notFound();
  }

  const locationServices = services.map((service) => ({
    ...service,
    url: `/location/${currentLocation.slug}/${service.slug}`,
  }));

  return (
    <main className="overflow-x-hidden bg-white">
      <Navbar />

      <section className="bg-blue-900 py-28 text-white">
        <div className="container-custom">
          <div className="max-w-5xl">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-blue-200">
              Plumbing services in {currentLocation.city}
            </p>

            <h1 className="mt-5 text-5xl font-black leading-tight md:text-6xl">
              Plumbing Services in {currentLocation.city},{" "}
              {currentLocation.stateCode}
            </h1>

            <p className="mt-8 max-w-3xl text-xl leading-9 text-blue-100">
              Explore plumbing services available in{" "}
              {currentLocation.city}, {currentLocation.state}. Find
              information about common plumbing problems, service options,
              and how to connect with a local plumbing professional.
            </p>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-black text-slate-900">
              Plumbing Services in {currentLocation.city}
            </h2>

            <p className="mt-6 text-lg leading-9 text-slate-600">
              Homeowners in {currentLocation.city} can explore the plumbing
              services below. Each service page provides information about
              the specific plumbing issue, common considerations, and
              available local service options.
            </p>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {locationServices.map((service) => (
              <Link
                key={service.slug}
                href={service.url}
                className="group rounded-[28px] border border-slate-200 bg-white p-7 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-300 hover:shadow-xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <span className="text-xl font-black">+</span>
                </div>

                <h3 className="mt-6 text-2xl font-black text-slate-900 transition-colors group-hover:text-blue-700">
                  {service.shortTitle}
                </h3>

                <p className="mt-4 leading-7 text-slate-600">
                  Learn about {service.shortTitle.toLowerCase()} in{" "}
                  {currentLocation.city}, including common problems,
                  service considerations, and local service options.
                </p>

                <span className="mt-6 inline-flex items-center font-bold text-blue-700">
                  View service
                  <span className="ml-2 transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-black text-slate-900">
              Local Plumbing Information for {currentLocation.city}
            </h2>

            <p className="mt-6 text-lg leading-9 text-slate-600">
              Plumbing problems can range from minor fixture issues to
              problems involving drains, water heaters, leaks, or larger
              plumbing lines. The appropriate response depends on the
              symptoms, the condition of the plumbing system, and the
              specific property.
            </p>

            <p className="mt-6 text-lg leading-9 text-slate-600">
              If you are dealing with an urgent plumbing problem in{" "}
              {currentLocation.city}, review the relevant service page to
              understand the issue and available options before contacting
              a local plumbing professional.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                href="/services"
                className="rounded-full bg-blue-600 px-7 py-4 font-bold text-white transition-colors hover:bg-blue-700"
              >
                Explore all services
              </Link>

              <Link
                href="/contact"
                className="rounded-full border border-slate-300 bg-white px-7 py-4 font-bold text-slate-900 transition-colors hover:border-blue-600 hover:text-blue-700"
              >
                Request service
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl rounded-[32px] border border-blue-100 bg-blue-50 p-8 md:p-10">
            <h2 className="text-3xl font-black text-slate-900">
              Need plumbing help in {currentLocation.city}?
            </h2>

            <p className="mt-4 text-lg leading-8 text-slate-600">
              Choose the service that best matches your plumbing problem to
              learn more about the issue and available local service
              options.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {locationServices.slice(0, 6).map((service) => (
                <Link
                  key={`featured-${service.slug}`}
                  href={service.url}
                  className="rounded-2xl border border-blue-100 bg-white px-5 py-4 font-bold text-slate-800 transition-colors hover:border-blue-400 hover:text-blue-700"
                >
                  {service.shortTitle}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </main>
  );
}
export const dynamicParams = false;