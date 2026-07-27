import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";

import { CheckCircle2 } from "lucide-react";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Professional Plumbing Services in Houston, TX",

  description:
    "Explore Piperesque's professional plumbing services in Houston, including emergency plumbing, drain cleaning, leak detection, water heater repair, sewer line repair, and residential & commercial plumbing.",

  keywords: [
    "Houston Plumber",
    "Emergency Plumber Houston",
    "Emergency Plumbing Houston",
    "Drain Cleaning Houston",
    "Leak Detection Houston",
    "Water Heater Repair Houston",
    "Pipe Repair Houston",
    "Sewer Line Repair Houston",
    "Residential Plumbing Houston",
    "Commercial Plumbing Houston",
    "Licensed Plumber Houston",
    "24/7 Plumber Houston",
  ],

  alternates: {
    canonical: "https://www.piperesque.com/services",
  },

  openGraph: {
    title: "Professional Plumbing Services in Houston | Piperesque",
    description:
      "Emergency plumbing, drain cleaning, leak detection, water heater repair and sewer line repair in Houston, Texas.",
    url: "https://www.piperesque.com/services",
    siteName: "Piperesque",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Piperesque Plumbing Services",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Professional Plumbing Services in Houston | Piperesque",
    description:
      "Professional plumbing services including emergency plumbing, drain cleaning, leak detection and water heater repair in Houston.",
    images: ["/og-image.png"],
  },
};

export default function ServicesPage() {
  return (
    <main className="overflow-x-hidden bg-white">
      <Navbar />

      <section className="relative overflow-hidden py-28">
        <Image
          src="/images/service-1.png"
          alt="Professional Plumbing Services in Houston"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-blue-900/75" />

        <div className="container-custom relative z-10 text-center">
          <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-bold text-white">
            OUR SERVICES
          </span>

          <h1 className="mt-8 text-6xl font-black text-white">
            Complete Plumbing Solutions
          </h1>

          <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">
            Residential and commercial plumbing services delivered by licensed
            professionals across Houston.
          </p>
        </div>
      </section>

      <section className="py-24">
        <div className="container-custom grid gap-10 lg:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;

            return (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="block overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-xl transition duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                <div className="relative h-72">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <div className="p-8">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">
                    <Icon size={34} className="text-blue-600" />
                  </div>

                  <h2 className="mt-6 text-3xl font-black">
                    {service.shortTitle}
                  </h2>

                  <p className="mt-5 leading-8 text-slate-600">
                    {service.description}
                  </p>

                  <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-green-600" />
                      <span>Licensed Professionals</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-green-600" />
                      <span>Upfront Pricing</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="text-green-600" />
                      <span>24/7 Emergency Support</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <CTA />

      <Footer />
    </main>
  );
}