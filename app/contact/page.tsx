import type { Metadata } from "next";
import Image from "next/image";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";
import OrganizationSchema from "@/components/seo/organization-schema";
import BreadcrumbSchema from "@/components/seo/breadcrumb-schema";
import ReferralLeadForm from "@/components/contact/referral-lead-form";

import {
  Phone,
  Mail,
  MapPin,
  Clock3,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";

import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Contact Piperesque | Phone & Email Plumbing Referral in Houston, TX",
  description:
    "Contact Piperesque for plumbing assistance in Houston, TX. Call (877) 364-0861 or email resquepipe@gmail.com to connect with independent local plumbing professionals.",
  alternates: {
    canonical: `${siteConfig.website}/contact`,
  },
  openGraph: {
    title: "Contact Piperesque | Plumbing Assistance in Houston, TX",
    description:
      "Have questions about plumbing services? Call (877) 364-0861 or email resquepipe@gmail.com to connect with independent plumbing providers in Greater Houston.",
    url: `${siteConfig.website}/contact`,
    type: "website",
  },
};

export default function ContactPage() {
  return (
    <main className="overflow-x-hidden bg-white text-slate-900">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: siteConfig.website },
          { name: "Contact", url: `${siteConfig.website}/contact` },
        ]}
      />
      <OrganizationSchema />
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 py-24 text-white md:py-28">
        <Image
          src="/images/contact.webp"
          alt="Contact Piperesque plumbing referral team in Houston, TX"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/80" />

        <div className="container-custom relative z-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-200">
            <Phone size={14} aria-hidden="true" />
            Direct Contact Options
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
            Contact Piperesque
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
            Have questions about plumbing services or our website? Contact us by phone
            or email. Piperesque helps connect homeowners with independent plumbing service
            providers serving Houston and nearby communities.
          </p>

          {/* Primary Phone Call CTA and Secondary Email Button */}
          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <a
              href={`tel:${siteConfig.phone}`}
              data-event="phone_click_contact"
              aria-label={`Call PipeResque at ${siteConfig.phoneDisplay}`}
              className="inline-flex items-center justify-center gap-2.5 rounded-xl bg-amber-500 px-8 py-4 text-base font-black text-slate-950 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400 active:scale-[0.98]"
            >
              <Phone size={20} aria-hidden="true" />
              Call {siteConfig.phoneDisplay}
            </a>

            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center justify-center gap-2.5 rounded-xl border border-white/25 bg-white/10 px-7 py-4 text-base font-semibold text-white transition hover:bg-white hover:text-slate-950"
            >
              <Mail size={19} aria-hidden="true" />
              Email {siteConfig.email}
            </a>
          </div>
        </div>
      </section>

      {/* Main Contact Section */}
      <section className="py-20 md:py-24">
        <div className="container-custom max-w-5xl">
          <div className="grid gap-8 md:grid-cols-2">
            
            {/* Phone Card (Primary) */}
            <div className="flex flex-col justify-between rounded-3xl border-2 border-amber-500/30 bg-amber-50/30 p-8 shadow-sm transition hover:shadow-md md:p-10">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20">
                  <Phone size={26} aria-hidden="true" />
                </div>

                <div className="mt-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-900">
                    Fastest Response • Tap to Call
                  </span>
                  <h2 className="mt-1 text-2xl font-black text-slate-900">
                    Phone Contact
                  </h2>
                  <p className="mt-3 text-slate-600 leading-7">
                    For urgent plumbing issues, burst pipes, drain clogs, or immediate questions,
                    calling our telephone line connects you directly to service routing.
                  </p>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Telephone Number
                  </p>
                  <p className="mt-1 text-2xl font-black text-slate-900">
                    {siteConfig.phoneDisplay}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-amber-200/60">
                <a
                  href={`tel:${siteConfig.phone}`}
                  data-event="phone_click_contact"
                  aria-label={`Call Now at ${siteConfig.phoneDisplay}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-amber-500 px-6 py-3.5 text-base font-black text-slate-950 shadow-sm transition hover:bg-amber-400 active:scale-[0.98]"
                >
                  <Phone size={18} aria-hidden="true" />
                  Call Now: {siteConfig.phoneDisplay}
                </a>
              </div>
            </div>

            {/* Email Card (Secondary) */}
            <div className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:shadow-md md:p-10">
              <div>
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
                  <Mail size={26} aria-hidden="true" />
                </div>

                <div className="mt-6">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-700">
                    Inquiries &amp; Non-Urgent
                  </span>
                  <h2 className="mt-1 text-2xl font-black text-slate-900">
                    Email Contact
                  </h2>
                  <p className="mt-3 text-slate-600 leading-7">
                    Have questions about our website, partnerships, or non-urgent general questions?
                    Send an email to our inbox and we will follow up with you.
                  </p>
                </div>

                <div className="mt-6">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Email Address
                  </p>
                  <p className="mt-1 text-xl font-bold text-slate-900">
                    {siteConfig.email}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-6 py-3.5 text-base font-bold text-slate-800 transition hover:bg-slate-100"
                >
                  <Mail size={18} aria-hidden="true" />
                  Send Email
                  <ArrowRight size={16} aria-hidden="true" />
                </a>
              </div>
            </div>

          </div>

          {/* Online Referral Intake Form */}
          <div className="mt-12">
            <ReferralLeadForm />
          </div>

          {/* Service Area & Availability Cards */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-blue-700">
                  <MapPin size={20} aria-hidden="true" />
                </div>
                <h3 className="font-bold text-slate-900">Service Area</h3>
              </div>
              <p className="mt-3 text-slate-600">
                Houston, Texas &amp; Nearby Communities
              </p>
              <p className="mt-1 text-xs text-slate-500">
                Including Pasadena, Sugar Land, Pearland, Katy, Cypress, Spring, The Woodlands, and Tomball.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-blue-700">
                  <Clock3 size={20} aria-hidden="true" />
                </div>
                <h3 className="font-bold text-slate-900">Availability</h3>
              </div>
              <p className="mt-3 text-slate-600">
                You can contact us anytime. Service availability depends on your location and the availability of independent plumbing service providers.
              </p>
            </div>
          </div>

          {/* Transparent Business Disclaimer */}
          <div className="mt-10 rounded-2xl border border-blue-100 bg-blue-50/60 p-6 md:p-8">
            <div className="flex items-start gap-4">
              <ShieldCheck className="mt-1 h-6 w-6 shrink-0 text-blue-700" aria-hidden="true" />
              <div>
                <h3 className="text-lg font-bold text-slate-900">
                  Important Information About Our Service
                </h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Piperesque is an informational and lead-generation website connecting users with independent
                  third-party plumbing providers. Piperesque does not directly perform plumbing work, employ
                  plumbers, own fleet vehicles, dispatch technicians, or guarantee arrival times, pricing,
                  or service availability. All quotes, scheduling, diagnostic fees, and warranties are
                  determined solely by the independent plumbing provider servicing the request.
                </p>
              </div>
            </div>
          </div>

        </div>
      </section>

      <CTA />

      <Footer />
    </main>
  );
}