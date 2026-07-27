import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";

import { locations } from "@/lib/data/locations";

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
      title: "Location Not Found",
    };
  }

  return {
    title: `Plumber in ${currentLocation.city}, ${currentLocation.stateCode} | Piperesque`,
    description: `Professional plumbing services in ${currentLocation.city}, ${currentLocation.state}. Emergency plumbing, drain cleaning, leak detection and water heater repair.`,
    alternates: {
      canonical: `https://www.piperesque.com/location/${currentLocation.slug}`,
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

  return (
    <main className="overflow-x-hidden bg-white">
      <Navbar />

      <section className="bg-blue-900 py-28 text-white">
        <div className="container-custom">
          <h1 className="text-6xl font-black">
            Plumber in {currentLocation.city}, {currentLocation.stateCode}
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-9 text-blue-100">
            Piperesque provides emergency plumbing, drain cleaning, leak
            detection, water heater repair and residential plumbing services
            throughout {currentLocation.city}, {currentLocation.state}.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container-custom max-w-4xl">
          <h2 className="text-4xl font-black">
            Trusted Plumbing Services in {currentLocation.city}
          </h2>

          <p className="mt-8 text-lg leading-9 text-slate-600">
            Our licensed plumbing professionals provide residential and
            commercial plumbing services across {currentLocation.city}. Whether
            you need emergency plumbing, drain cleaning, water heater repair or
            leak detection, Piperesque is ready to help.
          </p>

          <div className="mt-12">
            <Link
              href="/contact"
              className="rounded-full bg-blue-600 px-8 py-4 font-bold text-white hover:bg-blue-700 transition-colors"
            >
              Request Free Estimate
            </Link>
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </main>
  );
}