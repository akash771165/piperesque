import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";
import OrganizationSchema from "@/components/seo/organization-schema";
import BreadcrumbSchema from "@/components/seo/breadcrumb-schema";

import { Phone, CheckCircle2, ShieldCheck, Clock, Wrench } from "lucide-react";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "About PipeResque | Plumbing Connection Service in Houston, TX",
  description:
    "Learn about PipeResque: how we help Houston homeowners find and connect with independent local plumbing professionals for emergency and routine repairs.",
  alternates: {
    canonical: `${siteConfig.website}/about`,
  },
  openGraph: {
    title: "About PipeResque | Houston Plumbing Resource",
    description:
      "Learn about PipeResque: how we help Houston homeowners find and connect with independent local plumbing professionals for emergency and routine repairs.",
    url: `${siteConfig.website}/about`,
    siteName: siteConfig.company,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "About PipeResque | Houston Plumbing Resource",
    description:
      "Learn about PipeResque: how we help Houston homeowners find and connect with independent local plumbing professionals.",
  },
};

export default function AboutPage() {
  return (
    <main className="overflow-x-hidden bg-white text-slate-900">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.website },
          { name: "About Us", url: `${siteConfig.website}/about` },
        ]}
      />
      <OrganizationSchema />
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-24 md:py-32 bg-slate-950">
        <Image
          src="/images/about.webp"
          alt="Plumbing services in Houston"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

        <div className="container-custom relative z-10 text-center max-w-4xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
            About Our Directory &amp; Referral Service
          </p>

          <h1 className="mt-4 text-4xl font-black text-white sm:text-5xl lg:text-6xl tracking-tight">
            Connecting Houston Homeowners With Independent Plumbing Providers
          </h1>

          <p className="mt-6 text-lg leading-8 text-slate-300">
            When a plumbing emergency occurs, time matters. PipeResque provides a straightforward way to explore plumbing information and contact independent service providers across Greater Houston.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href={`tel:${siteConfig.phone}`}
              className="inline-flex items-center justify-center gap-2.5 w-full sm:w-auto rounded-xl bg-amber-500 px-7 py-4 text-base font-black text-slate-950 shadow-lg transition hover:bg-amber-400 active:scale-95"
            >
              <Phone size={18} className="fill-slate-950" />
              Call {siteConfig.phoneDisplay}
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center w-full sm:w-auto rounded-xl border border-slate-600 bg-slate-900/60 px-7 py-4 text-base font-bold text-white transition hover:bg-white hover:text-slate-950"
            >
              Contact by Phone or Email
            </Link>
          </div>
        </div>
      </section>

      {/* Mission & What We Do */}
      <section className="py-20 lg:py-28 bg-white">
        <div className="container-custom grid items-center gap-14 lg:grid-cols-2">
          <div className="relative aspect-[4/3] overflow-hidden rounded-3xl border border-slate-200 shadow-xl bg-slate-100">
            <Image
              src="/images/plumber-1.webp"
              alt="Independent plumbing professional inspecting residential pipework"
              fill
              loading="lazy"
              sizes="(max-width:1024px)100vw,50vw"
              className="object-cover"
            />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-blue-700">
              Our Role
            </span>

            <h2 className="mt-3 text-3xl font-black text-slate-950 sm:text-4xl">
              Simplifying the Search for Urgent Plumbing Help
            </h2>

            <p className="mt-5 text-base leading-7 text-slate-600">
              Plumbing problems rarely happen at a convenient time. Finding an available, trustworthy technician when a pipe bursts or a drain backs up can be stressful and chaotic.
            </p>

            <p className="mt-4 text-base leading-7 text-slate-600">
              PipeResque is an informational referral platform. It does not employ plumbers, operate service vehicles, or perform plumbing work. It helps homeowners contact independent plumbing service providers. Each provider is responsible for its own credentials, availability, pricing, scheduling, and workmanship. Homeowners should confirm relevant licenses, insurance, and terms directly with the provider.
            </p>

            <div className="mt-8 grid gap-3 sm:grid-cols-2 text-sm font-semibold text-slate-800">
              {[
                "Referral Line Access",
                "Independent Local Providers",
                "Clear Referral Information",
                "Emergency & Routine Repairs",
                "Drain & Sewer Line Solutions",
                "Water Heater Assistance",
              ].map((item) => (
                <div key={item} className="flex items-center gap-2.5 rounded-lg bg-slate-50 p-3 border border-slate-100">
                  <CheckCircle2 size={18} className="text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Transparency Guidelines */}
      <section className="py-20 bg-slate-50 border-y border-slate-200">
        <div className="container-custom max-w-5xl">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="heading-lg text-slate-950">
              Transparency First
            </h2>
            <p className="mt-3 text-slate-600 text-base">
              We believe in honest, upfront expectations so you always know how our service operates.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="card p-7 bg-white">
              <ShieldCheck size={32} className="text-blue-700" />
              <h3 className="mt-4 text-xl font-bold text-slate-950">Independent Network</h3>
              <p className="mt-2 text-sm text-slate-600 leading-6">
                Calls and requests are routed to independent third-party contractors who independently determine their service availability and rates.
              </p>
            </div>

            <div className="card p-7 bg-white">
              <Wrench size={32} className="text-blue-700" />
              <h3 className="mt-4 text-xl font-bold text-slate-950">Provider-Set Pricing</h3>
              <p className="mt-2 text-sm text-slate-600 leading-6">
                Pricing, diagnostic fees, repair estimates, and warranties are set by the independent provider. Confirm the details directly before authorizing work.
              </p>
            </div>

            <div className="card p-7 bg-white">
              <Clock size={32} className="text-blue-700" />
              <h3 className="mt-4 text-xl font-bold text-slate-950">Realistic Timing</h3>
              <p className="mt-2 text-sm text-slate-600 leading-6">
                Arrival and response times vary based on demand, weather, traffic, and technician availability. We never promise unrealistic arrival times.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border border-blue-200 bg-blue-50/60 p-6 text-sm leading-6 text-slate-700">
            <p>
              <strong className="font-semibold text-slate-900">Legal Notice:</strong> PipeResque is a lead-referral website. PipeResque does not own or operate a plumbing company and does not warrant the workmanship or representations of independent providers. Customers are encouraged to confirm licenses, insurance, and terms with the servicing contractor.
            </p>
          </div>
        </div>
      </section>

      <CTA />

      <Footer />
    </main>
  );
}