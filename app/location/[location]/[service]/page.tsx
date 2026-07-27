import { Metadata } from "next";
import { notFound } from "next/navigation";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";

import { services } from "@/lib/data/services";
import { locations } from "@/lib/data/locations";

type Props = {
  params: Promise<{
    location: string;
    service: string;
  }>;
};

export async function generateStaticParams() {
  return locations.flatMap((location) =>
    services.map((service) => ({
      location: location.slug,
      service: service.slug,
    }))
  );
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { location, service } = await params;

  const city = locations.find((l) => l.slug === location);
  const plumbing = services.find((s) => s.slug === service);

  if (!city || !plumbing) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: `${plumbing.shortTitle} in ${city.city}, ${city.stateCode} | Piperesque`,
    description: `${plumbing.shortTitle} services in ${city.city}, ${city.state}. Fast response from Piperesque.`,
    alternates: {
      canonical: `https://www.piperesque.com/location/${city.slug}/${plumbing.slug}`,
    },
  };
}

export default async function LocationServicePage({
  params,
}: Props) {
  const { location, service } = await params;

  const city = locations.find((l) => l.slug === location);
  const plumbing = services.find((s) => s.slug === service);

  if (!city || !plumbing) {
    notFound();
  }

  return (
    <main className="overflow-x-hidden bg-white">

      <Navbar />

      <section className="bg-blue-900 py-28 text-white">

        <div className="container-custom">

          <h1 className="text-6xl font-black">
            {plumbing.shortTitle} in {city.city}, {city.stateCode}
          </h1>

          <p className="mt-8 max-w-3xl text-xl leading-9 text-blue-100">
            Piperesque provides professional{" "}
            {plumbing.shortTitle.toLowerCase()} services throughout{" "}
            {city.city}, {city.state}.
          </p>

        </div>

      </section>

      <section className="py-24">

        <div className="container-custom max-w-4xl">

          <h2 className="text-4xl font-black">
            Professional {plumbing.shortTitle}
          </h2>

          <p className="mt-8 text-lg leading-9 text-slate-600">
            Our experienced plumbing professionals provide
            residential and commercial plumbing services
            throughout {city.city}. Contact Piperesque
            for fast and reliable plumbing solutions.
          </p>

        </div>

      </section>

      <CTA />

      <Footer />

    </main>
  );
}