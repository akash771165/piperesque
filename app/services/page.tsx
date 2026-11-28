import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";
import ServiceListingSection from "@/components/sections/service-listing";

import { Phone, ArrowRight, ShieldCheck, Clock3 } from "lucide-react";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Plumbing Services in Houston, TX",
  description:
    "Find fast plumbing assistance in Houston for emergency plumbing, drain cleaning, leak detection, water heaters, and sewer repair. Call (877) 587-3986.",
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
    "Local Plumber Houston",
    "Urgent Plumber Houston",
  ],
  alternates: {
    canonical: "https://www.piperesque.com/services",
  },
  openGraph: {
    title: "Plumbing Services in Houston, TX | PipeResque",
    description:
      "Connect with independent plumbing specialists across Greater Houston for burst pipes, drain clogs, leaks, sewer backups, and water heaters.",
    url: "https://www.piperesque.com/services",
    siteName: "PipeResque",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/images/emergency.webp",
        width: 1200,
        height: 630,
        alt: "PipeResque Plumbing Services in Houston",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Plumbing Services in Houston, TX | PipeResque",
    description:
      "Professional plumbing referral services in Greater Houston. Call (877) 587-3986 for fast plumbing help.",
    images: ["/images/emergency.webp"],
  },
};

export default function ServicesPage() {
  return (
    <main className="overflow-x-hidden bg-white text-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-24 text-white md:py-28">
        <Image
          src="/images/service-1.webp"
          alt="Plumbing services in Greater Houston"
          fill
          priority
          sizes="100vw"
          referrerPolicy="no-referrer"
          className="object-cover opacity-25"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/80" />

        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-200">
            <Clock3 size={14} aria-hidden="true" />
            Houston Plumbing Solutions
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            Houston Plumbing Services
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
            Connect quickly with independent plumbing specialists across Greater Houston for
            urgent repairs, routine maintenance, and scheduled installations.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href="tel:+18775873986"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-base font-black text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 active:scale-[0.98]"
            >
              <Phone size={20} aria-hidden="true" />
              Call (877) 587-3986
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white transition hover:bg-white hover:text-slate-950"
            >
              Contact Us
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Problem Intent Strip */}
      <section className="border-b border-slate-200 bg-slate-50 py-4">
        <div className="container-custom flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs font-medium text-slate-600 sm:text-sm">
          <span className="font-semibold text-slate-900">Urgent Problem?</span>
          <Link href="/services/pipe-repair" className="hover:text-blue-700 hover:underline">
            • Burst Pipes
          </Link>
          <Link href="/services/sewer-line-repair" className="hover:text-blue-700 hover:underline">
            • Main Sewer Backups
          </Link>
          <Link href="/services/toilet-repair" className="hover:text-blue-700 hover:underline">
            • Overflowing Toilets
          </Link>
          <Link href="/services/water-heater-repair" className="hover:text-blue-700 hover:underline">
            • Water Heater Leaks
          </Link>
          <Link href="/services/drain-cleaning" className="hover:text-blue-700 hover:underline">
            • Clogged Main Drains
          </Link>
          <Link href="/services/leak-detection" className="hover:text-blue-700 hover:underline">
            • Hidden Slab Leaks
          </Link>
        </div>
      </section>

      {/* Consistent Service Listing Section */}
      <ServiceListingSection items={services} />

      {/* Transparent Service Notice */}
      <section className="bg-slate-50 py-12 border-t border-slate-200">
        <div className="container-custom max-w-4xl text-center">
          <div className="flex justify-center">
            <ShieldCheck className="h-8 w-8 text-blue-700" aria-hidden="true" />
          </div>
          <h3 className="mt-3 text-lg font-bold text-slate-900">
            About Our Houston Plumbing Referral Network
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-600">
            PipeResque provides informational plumbing resources and connects property owners with independent,
            licensed plumbing contractors throughout Greater Houston. PipeResque does not directly dispatch,
            employ, or perform plumbing repairs. Final estimates, pricing, and warranties are established
            directly between you and the servicing provider.
          </p>
        </div>
      </section>

      <CTA />

      <Footer />
    </main>
  );
}