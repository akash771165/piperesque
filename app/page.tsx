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

export const metadata: Metadata = {
  title: "Emergency Plumbing Help in Houston, TX | Piperesque",
  description:
    "Piperesque helps homeowners in Houston, TX connect with independent plumbing professionals for emergency plumbing, drain cleaning, leak detection, sewer line repair, and water heater services.",
  keywords: [
    "emergency plumbing Houston",
    "emergency plumber Houston",
    "plumbing services Houston TX",
    "24 hour plumbing Houston",
    "drain cleaning Houston",
    "leak detection Houston",
    "sewer line repair Houston",
    "water heater repair Houston",
  ],
  alternates: {
    canonical: "https://www.piperesque.com/",
  },
  openGraph: {
    title: "Emergency Plumbing Help in Houston, TX | Piperesque",
    description:
      "Connect with independent plumbing professionals serving Houston and surrounding areas.",
    url: "https://www.piperesque.com/",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Piperesque plumbing assistance in Houston",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Piperesque | Emergency Plumbing Help in Houston",
    description:
      "Connect with independent plumbing professionals serving Houston and surrounding areas.",
    images: ["/og-image.png"],
  },
};

const services = [
  {
    title: "Emergency Plumbing",
    description:
      "Get help finding an independent plumbing professional for urgent plumbing problems.",
    href: "/services/emergency-plumbing",
    icon: Wrench,
  },
  {
    title: "Drain Cleaning",
    description:
      "Find plumbing assistance for clogged, slow, or backed-up drains.",
    href: "/location/houston/drain-cleaning",
    icon: ArrowRight,
  },
  {
    title: "Sewer Line Repair",
    description:
      "Connect with plumbing professionals for sewer line problems and backups.",
    href: "/location/houston/sewer-line-repair",
    icon: Wrench,
  },
  {
    title: "Leak Detection",
    description:
      "Get connected with professionals who can evaluate suspected plumbing leaks.",
    href: "/location/houston/leak-detection",
    icon: ShieldCheck,
  },
  {
    title: "Water Heater Repair",
    description:
      "Find plumbing assistance for water heater problems and related issues.",
    href: "/location/houston/water-heater-repair",
    icon: Clock3,
  },
  {
    title: "Residential Plumbing",
    description:
      "Explore plumbing assistance for common residential plumbing needs.",
    href: "/services/residential-plumbing",
    icon: MapPin,
  },
];

const faqs = [
  {
    question: "What is Piperesque?",
    answer:
      "Piperesque is an informational service that helps homeowners find and connect with independent plumbing professionals serving their area.",
  },
  {
    question: "Do you provide plumbing services directly?",
    answer:
      "No. Piperesque does not directly perform plumbing work or employ plumbing technicians. Service is provided by an independent plumbing company that handles the customer's request.",
  },
  {
    question: "What plumbing services can I request?",
    answer:
      "Depending on provider availability, homeowners may request assistance for emergency plumbing, drain cleaning, sewer line problems, leak detection, water heater issues, and other common plumbing needs.",
  },
  {
    question: "Is emergency plumbing assistance available 24/7?",
    answer:
      "Piperesque accepts service requests at any time. Provider availability varies by location, time, and current service capacity.",
  },
  {
    question: "How quickly will a plumbing professional respond?",
    answer:
      "Response times depend on the independent provider, location, time of day, and current demand. Piperesque does not guarantee a specific response or arrival time.",
  },
  {
    question: "Does Piperesque provide pricing or estimates?",
    answer:
      "No. Pricing and estimates are determined directly by the independent plumbing provider. Customers should discuss applicable service fees, estimates, and repair costs with the provider before authorizing work.",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white text-slate-900">
      <Navbar />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative overflow-hidden bg-slate-950">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-950 to-slate-900" />

        <div className="container-custom relative z-10 py-20 md:py-28 lg:py-32">
          <div className="max-w-4xl">

            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-sm font-semibold text-blue-100">
              <Clock3 size={17} aria-hidden="true" />
              Plumbing Assistance Available 24/7
            </div>

            <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl md:text-6xl">
              Emergency Plumbing Help in Houston, TX
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300 md:text-xl">
              Facing a burst pipe, major leak, sewer backup, clogged drain,
              or another urgent plumbing problem? Piperesque helps Houston
              homeowners connect with independent plumbing professionals
              serving their area.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href="tel:+18773640861"
                className="btn btn-emergency"
              >
                <Phone size={20} aria-hidden="true" />
                Call (877) 364-0861
              </a>

              <Link
                href="/contact"
                className="btn btn-outline border-white/30 bg-white/10 text-white hover:bg-white hover:text-slate-950"
              >
                Request Plumbing Assistance
                <ArrowRight size={19} aria-hidden="true" />
              </Link>
            </div>

            <div className="mt-8 max-w-3xl rounded-xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm leading-6 text-slate-300">
                <strong className="text-white">Important:</strong>{" "}
                Piperesque does not directly provide or dispatch plumbing
                services. We help connect homeowners with independent
                plumbing providers. Availability, response times, pricing,
                warranties, and workmanship are determined by the provider.
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
            <Clock3
              className="text-blue-700"
              size={24}
              aria-hidden="true"
            />

            <div>
              <p className="font-bold">24/7 Requests</p>
              <p className="text-sm text-slate-500">
                Request assistance anytime
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
              <p className="font-bold">Houston Focused</p>
              <p className="text-sm text-slate-500">
                Houston & nearby areas
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
                Provider terms may vary
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
              How Piperesque Works
            </h2>

            <p className="text-body-lg mx-auto mt-5">
              We make it easier to start a plumbing service request without
              claiming to be the company performing the work.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">

            {[
              {
                number: "01",
                title: "Describe the Problem",
                text:
                  "Tell us what type of plumbing assistance you need and where the problem is located.",
              },
              {
                number: "02",
                title: "Request Assistance",
                text:
                  "Call the listed number or submit a service request through the site.",
              },
              {
                number: "03",
                title: "Connect With a Provider",
                text:
                  "An independent plumbing provider may handle the request based on availability and service area.",
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
              Piperesque focuses on Houston and nearby communities. Provider
              availability varies by location.
            </p>
          </div>

          <div className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3">
            {[
              "Houston",
              "Pasadena",
              "Sugar Land",
              "Pearland",
              "Missouri City",
              "Katy",
              "Cypress",
              "Spring",
              "The Woodlands",
              "Tomball",
            ].map((area) => (
              <span
                key={area}
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-semibold text-white"
              >
                {area}
              </span>
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
                About Piperesque
              </p>

              <h2 className="heading-lg mt-3 text-slate-900">
                A Simple Way to Start a Plumbing Request
              </h2>

              <p className="text-body-lg mt-5">
                Finding plumbing assistance during an urgent problem can be
                difficult. Piperesque provides plumbing information and helps
                homeowners connect with independent service providers.
              </p>

              <Link
                href="/about"
                className="btn btn-outline mt-8"
              >
                Learn More About Piperesque
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
            Start a service request and connect with an independent plumbing
            professional serving your area.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

            <a
              href="tel:+18773640861"
              className="btn btn-emergency"
            >
              <Phone size={20} aria-hidden="true" />
              Call (877) 364-0861
            </a>

            <Link
              href="/contact"
              className="btn btn-outline border-white/30 bg-white/10 text-white hover:bg-white hover:text-slate-950"
            >
              Request Assistance
              <ArrowRight size={19} aria-hidden="true" />
            </Link>

          </div>

          <p className="mx-auto mt-8 max-w-3xl text-sm leading-6 text-slate-400">
            Piperesque does not employ, dispatch, or directly provide
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