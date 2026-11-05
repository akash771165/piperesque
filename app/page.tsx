import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import FAQSchema from "@/components/seo/faq-schema";
import OrganizationSchema from "@/components/seo/organization-schema";

export const metadata: Metadata = {
  title: "Emergency Plumbing Help in Houston, TX | PipeResque",
  description:
    "Looking for plumbing assistance in Houston, TX? Call (877) 364-0861 to connect with independent local plumbing professionals for burst pipes, drains, leaks, and water heaters.",
  keywords: [
    "emergency plumbing Houston",
    "emergency plumber Houston",
    "plumbing services Houston TX",
    "urgent plumbing Houston",
    "drain cleaning Houston",
    "leak detection Houston",
    "sewer line repair Houston",
    "water heater repair Houston",
    "residential plumbing Houston",
  ],
  alternates: {
    canonical: "https://www.piperesque.com/",
  },
  openGraph: {
    title: "Emergency Plumbing Help in Houston, TX | PipeResque",
    description:
      "Looking for plumbing assistance in Houston, TX? Call (877) 364-0861 to connect with independent local plumbing professionals for burst pipes, drains, leaks, and water heaters.",
    url: "https://www.piperesque.com/",
    type: "website",
    images: [
      {
        url: "/images/emergency.webp",
        width: 1200,
        height: 630,
        alt: "PipeResque plumbing assistance in Houston",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PipeResque | Emergency Plumbing Help in Houston",
    description:
      "Looking for plumbing assistance in Houston, TX? Call (877) 364-0861 to connect with independent local plumbing professionals for burst pipes, drains, leaks, and water heaters.",
    images: ["/images/emergency.webp"],
  },
};

const services = [
  {
    title: "Emergency Plumbing",
    description:
      "Find independent plumbing professionals for urgent problems including burst pipes and major leaks.",
    href: "/services/emergency-plumbing",
    icon: Wrench,
  },
  {
    title: "Drain Cleaning",
    description:
      "Find assistance for slow, blocked, or backed-up sinks, showers, and main drain lines.",
    href: "/services/drain-cleaning",
    icon: ArrowRight,
  },
  {
    title: "Sewer Line Repair",
    description:
      "Connect with plumbing professionals for sewer line inspections, repairs, and clearing.",
    href: "/services/sewer-line-repair",
    icon: Wrench,
  },
  {
    title: "Leak Detection",
    description:
      "Connect with specialists who can locate and diagnose hidden water leaks in walls, ceilings, and slabs.",
    href: "/services/leak-detection",
    icon: ShieldCheck,
  },
  {
    title: "Water Heater Repair",
    description:
      "Find plumbing assistance for no hot water, tank leaks, temperature inconsistency, and replacements.",
    href: "/services/water-heater-repair",
    icon: Clock3,
  },
  {
    title: "Residential Plumbing",
    description:
      "Explore assistance for common home plumbing fixtures, piping repairs, and general installations.",
    href: "/services/residential-plumbing",
    icon: MapPin,
  },
];

const faqs = [
  {
    question: "What is PipeResque?",
    answer:
      "PipeResque is an informational website and referral service that helps Houston homeowners find and connect with independent third-party plumbing professionals.",
  },
  {
    question: "Do you provide plumbing services directly?",
    answer:
      "No. PipeResque does not directly perform plumbing work, dispatch vehicles, or employ technicians. Any plumbing assessment, quote, and repair is handled by an independent third-party provider.",
  },
  {
    question: "What plumbing services can I call about?",
    answer:
      "Homeowners can call (877) 364-0861 for referral assistance regarding burst pipes, active water leaks, clogged drains, sewer backups, water heaters, and general residential plumbing problems.",
  },
  {
    question: "When can I call regarding a plumbing emergency?",
    answer:
      "Homeowners can call the PipeResque referral line at (877) 364-0861. Independent third-party providers determine their own availability, response times, pricing, and service terms. PipeResque does not employ plumbers, perform physical repairs, or guarantee technician dispatch.",
  },
  {
    question: "How quickly will a plumbing professional respond?",
    answer:
      "Response times depend on independent provider availability, call volume, weather, and distance to your property. PipeResque does not guarantee a specific arrival or response time.",
  },
  {
    question: "Does PipeResque set pricing or give estimates?",
    answer:
      "No. Pricing, estimates, diagnostic fees, and warranties are determined directly by the independent plumbing provider. Homeowners should review pricing with the technician before authorizing work.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <OrganizationSchema />
      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900" />

        <div className="container-custom relative z-10 py-20 md:py-28 lg:py-32">
          <div className="max-w-4xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-lg border border-white/15 bg-white/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-amber-300">
              <Phone size={14} className="text-amber-400" aria-hidden="true" />
              Houston Plumbing Referral Hotline • (877) 364-0861
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
              Plumbing Problems in Houston? Start With the Right Next Step.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              Facing a burst pipe, backed-up drain, hidden leak, sewer blockage, or failing water heater?
              Explore your plumbing concern and connect with independent plumbing providers through the PipeResque referral line.
            </p>

            {/* 3 Verifiable Benefit Points */}
            <div className="mt-6 grid gap-2.5 sm:grid-cols-3 max-w-2xl text-sm text-slate-200">
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 border border-white/10">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" aria-hidden="true" />
                <span>Discuss your concern</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 border border-white/10">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" aria-hidden="true" />
                <span>Understand next steps</span>
              </div>
              <div className="flex items-center gap-2 rounded-lg bg-white/5 px-3 py-2 border border-white/10">
                <CheckCircle2 size={16} className="text-emerald-400 shrink-0" aria-hidden="true" />
                <span>Connect with providers</span>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3.5 sm:flex-row">
              <a
                href="tel:+18773640861"
                data-event="phone_click_hero"
                aria-label="Call PipeResque Referral Hotline at (877) 364-0861"
                className="inline-flex items-center justify-center gap-3 rounded-xl bg-amber-500 px-8 py-4 text-base md:text-lg font-black text-slate-950 shadow-lg shadow-amber-500/25 transition hover:bg-amber-400 active:scale-[0.98]"
              >
                <Phone size={20} className="fill-slate-950" aria-hidden="true" />
                Call (877) 364-0861
              </a>

              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-4 text-base font-semibold text-white transition hover:bg-white hover:text-slate-950"
              >
                Explore Service Guides
                <ArrowRight size={19} aria-hidden="true" />
              </Link>
            </div>

            <p className="mt-3.5 text-xs text-slate-300 flex items-center gap-2">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 shrink-0" aria-hidden="true" />
              <span>Call the PipeResque referral line to discuss your plumbing issue and ask about independent-provider referral options. Provider coverage and availability vary.</span>
            </p>

            {/* Quick Problem Intent Bar */}
            <div className="mt-8 pt-6 border-t border-white/10">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
                Select your urgent plumbing issue:
              </p>
              <div className="flex flex-wrap gap-2 text-xs">
                <Link
                  href="/services/emergency-plumbing"
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-medium text-slate-200 transition hover:bg-white/15 hover:text-white"
                >
                  💥 Burst Pipe
                </Link>
                <Link
                  href="/services/drain-cleaning"
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-medium text-slate-200 transition hover:bg-white/15 hover:text-white"
                >
                  🚰 Clogged Drain
                </Link>
                <Link
                  href="/services/sewer-line-repair"
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-medium text-slate-200 transition hover:bg-white/15 hover:text-white"
                >
                  🚽 Sewer Backup
                </Link>
                <Link
                  href="/services/water-heater-repair"
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-medium text-slate-200 transition hover:bg-white/15 hover:text-white"
                >
                  🔥 Water Heater
                </Link>
                <Link
                  href="/services/leak-detection"
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-medium text-slate-200 transition hover:bg-white/15 hover:text-white"
                >
                  💧 Active Leak
                </Link>
                <Link
                  href="/services/pipe-repair"
                  className="rounded-lg border border-white/15 bg-white/5 px-3 py-1.5 font-medium text-slate-200 transition hover:bg-white/15 hover:text-white"
                >
                  🔧 Pipe Repair
                </Link>
              </div>
            </div>

            <div className="mt-8 max-w-3xl rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm leading-6 text-slate-300">
                <strong className="text-white">Referral Notice:</strong>{" "}
                PipeResque is a referral service connecting property owners with independent,
                third-party plumbing professionals. PipeResque does not employ plumbers, own fleet vehicles,
                or perform repairs directly. Pricing, warranties, arrival times, and service availability are set solely by the independent provider.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          TRUST BAR
      ===================================================== */}

      <section className="border-b border-slate-200 bg-white">
        <div className="container-custom grid grid-cols-1 divide-y divide-slate-200 py-2 sm:grid-cols-3 sm:divide-x sm:divide-y-0">

          <div className="flex items-center justify-center gap-3 px-5 py-5">
            <Phone
              className="text-blue-700"
              size={24}
              aria-hidden="true"
            />

            <div>
              <p className="font-bold">Referral Line Access</p>
              <p className="text-sm text-slate-500">
                Call (877) 364-0861
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 px-5 py-5">
            <MapPin
              className="text-blue-700"
              size={24}
              aria-hidden="true"
            />

            <div>
              <p className="font-bold">Greater Houston Focus</p>
              <p className="text-sm text-slate-500">
                Houston &amp; surrounding communities
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 px-5 py-5">
            <ShieldCheck
              className="text-blue-700"
              size={24}
              aria-hidden="true"
            />

            <div>
              <p className="font-bold">Independent Providers</p>
              <p className="text-sm text-slate-500">
                Transparent referral model
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* =====================================================
          SERVICES
      ===================================================== */}

      <section className="section section-white">
        <div className="container-custom">

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Plumbing Services
            </p>

            <h2 className="heading-lg mt-3 text-slate-900">
              Find Plumbing Assistance for Your Needs
            </h2>

            <p className="text-body-lg mx-auto mt-5 max-w-2xl">
              Explore common plumbing services and connect with independent
              professionals serving Houston and surrounding communities.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <Link
                  key={service.href}
                  href={service.href}
                  className="card card-hover group p-7"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                    <Icon size={23} aria-hidden="true" />
                  </div>

                  <h3 className="mt-5 text-xl font-bold text-slate-900">
                    {service.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {service.description}
                  </p>

                  <div className="mt-5 inline-flex items-center gap-2 font-semibold text-blue-700">
                    Explore service
                    <ArrowRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </Link>
              );
            })}
          </div>

        </div>
      </section>

      {/* =====================================================
          EMERGENCY PLUMBING
      ===================================================== */}

      <section className="section section-light">
        <div className="container-custom">

          <div className="grid items-center gap-12 lg:grid-cols-2">

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-red-600">
                Plumbing Emergencies
              </p>

              <h2 className="heading-lg mt-3 text-slate-900">
                When a Plumbing Problem Cannot Wait
              </h2>

              <p className="text-body-lg mt-5">
                Some plumbing problems can quickly lead to water damage or
                create unsafe conditions. Getting professional assistance
                promptly may help limit further damage.
              </p>

              <div className="mt-8 space-y-4">
                {[
                  "Burst or damaged water pipes",
                  "Major active water leaks",
                  "Sewer backups",
                  "Overflowing toilets or fixtures",
                  "Multiple drains backing up",
                  "Water heater leaks",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-3"
                  >
                    <CheckCircle2
                      className="mt-1 shrink-0 text-green-600"
                      size={20}
                      aria-hidden="true"
                    />

                    <span className="text-slate-700">
                      {item}
                    </span>
                  </div>
                ))}
              </div>

              <Link
                href="/services/emergency-plumbing"
                className="btn btn-primary mt-8"
              >
                Emergency Plumbing Information
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>

            <div className="card rounded-3xl p-8 shadow-lg md:p-10">

              <h3 className="text-2xl font-black text-slate-900">
                What should you do first?
              </h3>

              <div className="mt-7 space-y-6">

                <div>
                  <p className="font-bold text-slate-900">
                    1. Stop the water if safe
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    If you can safely identify the appropriate shutoff valve,
                    turning off the water may help reduce additional damage.
                  </p>
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    2. Protect the affected area
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Move belongings away from leaking water when it is safe
                    to do so.
                  </p>
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    3. Avoid unsafe repairs
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Do not attempt repairs that could expose you to
                    electrical, structural, sewage, or other hazards.
                  </p>
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    4. Request professional assistance
                  </p>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Contact a plumbing professional and explain what
                    happened, what you have already done, and whether water
                    is still flowing.
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="section section-white">
        <div className="container-custom">

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
              Simple Process
            </p>

            <h2 className="heading-lg mt-3 text-slate-900">
              How PipeResque Works
            </h2>

            <p className="text-body-lg mx-auto mt-5">
              PipeResque helps homeowners contact independent plumbing service providers
              serving Houston and surrounding communities.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {[
              {
                number: "01",
                title: "Identify Your Problem",
                text:
                  "Note where your leak, drain backup, or water heater issue is located and whether water can be safely shut off.",
              },
              {
                number: "02",
                title: "Call for a Referral",
                text:
                  "Call the PipeResque referral line at (877) 364-0861 to discuss your plumbing issue and ask about independent-provider referral options.",
              },
              {
                number: "03",
                title: "Schedule On-Site Service",
                text:
                  "The independent provider can explain its availability, diagnostic fees, pricing, and scheduling directly. Confirm the scope and terms before authorizing work.",
              },
            ].map((step) => (
              <div
                key={step.number}
                className="card p-7"
              >
                <span className="text-4xl font-black text-blue-100">
                  {step.number}
                </span>

                <h3 className="mt-4 text-xl font-bold text-slate-900">
                  {step.title}
                </h3>

                <p className="mt-3 leading-7 text-slate-600">
                  {step.text}
                </p>
              </div>
            ))}

          </div>
        </div>
      </section>

      {/* =====================================================
          SERVICE AREA
      ===================================================== */}

      <section className="section section-dark">
        <div className="container-custom">

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-300">
              Service Area
            </p>

            <h2 className="heading-lg mt-3 text-white">
              Plumbing Assistance in Houston
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-blue-100">
              PipeResque focuses on Houston and nearby communities. Provider
              availability varies by location.
            </p>
          </div>

          <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
            {[
              { name: "Houston", slug: "houston" },
              { name: "Katy", slug: "katy" },
              { name: "Sugar Land", slug: "sugar-land" },
              { name: "Cypress", slug: "cypress" },
              { name: "Spring", slug: "spring" },
              { name: "Pearland", slug: "pearland" },
              { name: "Pasadena", slug: "pasadena" },
              { name: "Richmond", slug: "richmond" },
              { name: "Missouri City", slug: "missouri-city" },
              { name: "The Woodlands", slug: "the-woodlands" },
            ].map((area) => (
              <Link
                key={area.slug}
                href={`/service-areas/${area.slug}`}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15 hover:border-amber-400/50"
              >
                {area.name}, TX
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* =====================================================
          WHY PIPERESQUE
      ===================================================== */}

      <section className="section section-white">
        <div className="container-custom">

          <div className="grid gap-12 lg:grid-cols-2">

            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                About PipeResque
              </p>

              <h2 className="heading-lg mt-3 text-slate-900">
                A Simple Way to Start a Plumbing Request
              </h2>

              <p className="text-body-lg mt-5">
                Finding plumbing assistance during an urgent problem can be
                difficult. PipeResque provides plumbing information and helps
                homeowners connect with independent service providers.
              </p>

              <Link
                href="/about"
                className="btn btn-outline mt-8"
              >
                Learn More About PipeResque
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              {[
                "Houston-focused plumbing information",
                "Multiple plumbing service categories",
                "Simple call and request options",
                "Clear independent-provider disclosure",
              ].map((item) => (
                <div
                  key={item}
                  className="card bg-slate-50 p-6"
                >
                  <CheckCircle2
                    className="text-green-600"
                    size={22}
                    aria-hidden="true"
                  />

                  <p className="mt-4 font-bold text-slate-900">
                    {item}
                  </p>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          FAQ
      ===================================================== */}

      <section className="section section-light">
        <FAQSchema faqs={faqs} />
        <div className="container-custom">

          <div className="mx-auto max-w-3xl">

            <div className="text-center">
              <p className="text-sm font-bold uppercase tracking-widest text-blue-700">
                FAQ
              </p>

              <h2 className="heading-lg mt-3 text-slate-900">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="mt-10 space-y-4">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="card bg-white p-6"
                >
                  <summary className="cursor-pointer list-none pr-8 font-bold text-slate-900">
                    {faq.question}
                  </summary>

                  <p className="mt-4 leading-7 text-slate-600">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="section section-dark">
        <div className="container-custom text-center">

          <h2 className="heading-lg text-white">
            Need Plumbing Assistance in Houston?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Call our telephone referral hotline to connect with an independent
            plumbing professional serving your neighborhood.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <a
              href="tel:+18773640861"
              data-event="phone_click_content"
              aria-label="Call PipeResque Referral Hotline at (877) 364-0861"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-8 py-4 font-black text-slate-950 transition hover:bg-amber-400 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
            >
              <Phone size={20} aria-hidden="true" />
              Call (877) 364-0861
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/10 px-7 py-4 font-bold text-white transition hover:bg-white hover:text-slate-950"
            >
              Contact by Phone or Email
              <ArrowRight size={19} aria-hidden="true" />
            </Link>

          </div>

          <p className="mx-auto mt-8 max-w-3xl text-sm leading-6 text-slate-400">
            PipeResque does not employ, dispatch, or directly provide
            plumbing services. Independent providers determine service
            availability, response times, pricing, warranties, and
            workmanship.
          </p>

        </div>
      </section>

      <Footer />
    </main>
  );
}