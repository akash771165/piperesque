import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";

import { CheckCircle2, Phone, ArrowRight, ShieldCheck, Clock3 } from "lucide-react";
import { services } from "@/lib/data/services";

export const metadata: Metadata = {
  title: "Plumbing Services in Houston, TX | PipeResque",
  description:
    "Find fast plumbing assistance in Houston for emergency plumbing, drain cleaning, leak detection, water heaters, and sewer repair. Call (877) 364-0861.",
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
    title: "Plumbing Services in Houston, TX | PipeResque",
    description:
      "Connect with independent licensed plumbing specialists across Greater Houston for burst pipes, drain clogs, leaks, sewer backups, and water heaters.",
    url: "https://www.piperesque.com/services",
    siteName: "PipeResque",
    type: "website",
    locale: "en_US",
    images: [
      {
        url: "/og-image.png",
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
      "Professional plumbing referral services in Greater Houston. Call (877) 364-0861 for fast plumbing help.",
    images: ["/og-image.png"],
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
              href="tel:+18773640861"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 py-4 text-base font-black text-slate-950 shadow-lg shadow-amber-500/20 transition hover:bg-amber-400 active:scale-[0.98]"
            >
              <Phone size={20} aria-hidden="true" />
              Call (877) 364-0861
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
        <div className="container-custom flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-slate-600 sm:text-sm">
          <span className="font-semibold text-slate-900">Urgent Problem?</span>
          <span>• Burst Pipes</span>
          <span>• Main Sewer Backups</span>
          <span>• Overflowing Toilets</span>
          <span>• Water Heater Leaks</span>
          <span>• Clogged Main Drains</span>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 md:py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
              Specialized Plumbing Services
            </h2>
            <p className="mt-4 text-slate-600">
              Select your specific plumbing issue below to learn more about warning signs, diagnostic
              methods, and typical repair solutions.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <div
                  key={service.slug}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-xl"
                >
                  <div className="relative h-64 overflow-hidden bg-slate-100">
                    <Image
                      src={service.image}
                      alt={service.title}
                      fill
                      className="object-cover transition duration-300 group-hover:scale-105"
                    />
                  </div>

                  <div className="flex flex-1 flex-col p-8">
                    <div className="flex items-center gap-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                        <Icon size={28} aria-hidden="true" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900">
                          {service.shortTitle}
                        </h3>
                        <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                          Houston, TX &amp; Suburbs
                        </p>
                      </div>
                    </div>

                    <p className="mt-5 leading-7 text-slate-600">
                      {service.description}
                    </p>

                    <div className="mt-6 space-y-2.5 text-sm text-slate-700">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 size={17} className="text-emerald-600" aria-hidden="true" />
                        <span>Independent licensed local technicians</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 size={17} className="text-emerald-600" aria-hidden="true" />
                        <span>Clear problem diagnosis before work begins</span>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 size={17} className="text-emerald-600" aria-hidden="true" />
                        <span>24/7 phone routing for emergency situations</span>
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap items-center gap-3 pt-6 border-t border-slate-100">
                      <a
                        href="tel:+18773640861"
                        className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-amber-400"
                      >
                        <Phone size={15} aria-hidden="true" />
                        Call (877) 364-0861
                      </a>

                      <Link
                        href={`/services/${service.slug}`}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-slate-300 hover:text-slate-900"
                      >
                        Details &amp; FAQ
                        <ArrowRight size={15} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

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