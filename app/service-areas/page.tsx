import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";

import { MapPin, CheckCircle2, Clock3, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/config/site";
import { cities } from "@/lib/data/cities";

export const metadata: Metadata = {
  title: "Plumbing Service Areas in Greater Houston, TX",
  description:
    "Explore plumbing service coverage across Houston, Pasadena, Sugar Land, Pearland, Katy, The Woodlands, and surrounding Texas communities.",
  alternates: {
    canonical: `${siteConfig.website}/service-areas`,
  },
  openGraph: {
    title: "Plumbing Service Areas in Greater Houston, TX",
    description:
      "Explore plumbing service coverage across Houston, Pasadena, Sugar Land, Pearland, Katy, The Woodlands, and surrounding Texas communities.",
    url: `${siteConfig.website}/service-areas`,
    siteName: siteConfig.company,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Plumbing Service Areas in Houston, TX | Piperesque",
    description:
      "Explore plumbing service coverage across Houston, Pasadena, Sugar Land, Pearland, Katy, The Woodlands, and surrounding Texas communities.",
  },
};

export default function ServiceAreasPage() {
  return (
    <main className="overflow-x-hidden bg-white text-slate-900">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32 bg-slate-950">
        <Image
          src="/images/service-city.webp"
          alt="Houston Plumbing Service Areas"
          fill
          priority
          quality={80}
          sizes="100vw"
          className="object-cover opacity-25"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

        <div className="container-custom relative z-10 text-center">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Coverage Information
          </p>

          <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl lg:text-6xl tracking-tight">
            Plumbing Service Areas in Greater Houston
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Piperesque helps homeowners across the Houston metropolitan area connect with
            independent, licensed plumbing professionals.
          </p>
        </div>
      </section>

      {/* Cities Grid */}
      <section className="section section-light">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-lg text-slate-950">
              Communities We Help Connect
            </h2>
            <p className="mt-4 text-body text-slate-600">
              Click any service area below to learn more about common plumbing solutions and local service options.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((city) => (
              <Link
                key={city.slug}
                href={`/service-areas/${city.slug}`}
                className="card card-hover group p-8 flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition group-hover:bg-amber-500 group-hover:text-slate-950">
                    <MapPin size={26} aria-hidden="true" />
                  </div>

                  <h3 className="mt-6 text-2xl font-bold text-slate-950">
                    {city.name}, TX
                  </h3>

                  <p className="mt-2 text-sm text-slate-600">
                    Emergency plumbing, drain cleaning, leak detection, and water heater assistance.
                  </p>

                  <div className="mt-6 space-y-2 text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Direct Phone Routing</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Independent Local Providers</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                      <span>Residential &amp; Commercial Help</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-4 text-sm font-bold text-blue-700 group-hover:text-amber-600 transition">
                  <span>View local service options</span>
                  <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Informational Disclaimer Box */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="container-custom max-w-4xl">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 md:p-10 shadow-sm text-center">
            <Clock3 size={36} className="mx-auto text-blue-700" />
            <h2 className="mt-4 text-2xl font-bold text-slate-950">
              Service Availability &amp; Response Terms
            </h2>
            <p className="mt-4 text-slate-600 text-sm md:text-base leading-7">
              Piperesque is an independent informational directory and lead-referral service. We help homeowners connect with independent, licensed plumbing service providers serving Greater Houston. Piperesque does not directly dispatch technicians or perform plumbing services. Service availability, scheduling, pricing, and warranties are determined directly by the independent provider.
            </p>
            <div className="mt-6">
              <a
                href={`tel:${siteConfig.phone}`}
                className="inline-flex items-center gap-2.5 rounded-xl bg-amber-500 px-6 py-3.5 text-base font-black text-slate-950 shadow-md transition hover:bg-amber-400 active:scale-95"
              >
                <span>Call {siteConfig.phoneDisplay} to Inquire</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      <CTA />

      <Footer />
    </main>
  );
}
