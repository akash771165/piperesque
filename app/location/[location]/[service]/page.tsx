import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  AlertTriangle,
  ArrowRight,
  Clock3,
  MapPin,
  Phone,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";
import FAQSchema from "@/components/seo/faq-schema";
import BreadcrumbSchema from "@/components/seo/breadcrumb-schema";
import JsonLd from "@/components/seo/json-ld";

import { services } from "@/lib/data/services";
import { locations } from "@/lib/data/locations";
import { siteConfig } from "@/lib/config/site";

type Props = {
  params: Promise<{
    location: string;
    service: string;
  }>;
};

type CityInfo = {
  intro: string;
  detail: string;
  pricing: {
    label: string;
    value: string;
  }[];
  faq: {
    question: string;
    answer: string;
  }[];
};

const cityCopy: Record<string, CityInfo> = {
  houston: {
    intro:
      "Houston homeowners deal with aging infrastructure, temperature swings, tree roots, and routine wear that can disrupt plumbing systems. A reliable local plumber needs to understand the city’s neighborhoods, the age of the homes, and how quick repairs can prevent bigger damage. Working in Houston means moving fast, diagnosing accurately, and protecting the property while the repair is in progress.",
    detail:
      "Whether you are in Midtown, the Heights, Bellaire, Cypress, or a nearby service area, quick access to quality plumbing support matters. The right local service provider responds quickly, has the right equipment, and explains the repair in plain language so homeowners can make a confident decision. Local expertise makes a difference when a main line, water heater, or drain issue is affecting the home’s day-to-day function.",
    pricing: [
      { label: "Diagnostic service", value: "$120-$260" },
      { label: "Standard repair", value: "$350-$1,400" },
      { label: "Emergency response", value: "$500-$2,400" },
    ],
    faq: [
      {
        question: "Do you serve Houston neighborhoods?",
        answer:
          "Yes. We provide service throughout Houston and nearby communities, including older homes and newer residential construction.",
      },
      {
        question: "How quickly can service happen?",
        answer:
          "Many Houston calls are handled within a short window, with emergency and urgent repair visits prioritized based on severity.",
      },
      {
        question: "Is pricing transparent?",
        answer:
          "Yes. Experienced plumbers explain the issue, review the options, and provide a clear estimate before moving forward with work.",
      },
    ],
  },

  katy: {
    intro:
      "Katy homeowners know that plumbing issues can escalate quickly in homes with heavier irrigation, slab concerns, and expanding pipe systems. When a leak, clog, or water heater issue appears, local knowledge matters because the right repair plan depends on how the plumbing is laid out and how the home has aged over time.",
    detail:
      "A good Katy plumber responds promptly, inspects the source of the problem, and helps homeowners choose a fix that will last instead of a temporary patch. Whether it is a hidden leak behind a cabinet, a drain issue in the kitchen, or an urgent sewer problem, a clear diagnosis is essential for preventing repeat problems and protecting the property.",
    pricing: [
      { label: "Assessment", value: "$120-$250" },
      { label: "Repair call", value: "$350-$1,600" },
      { label: "Urgent service", value: "$500-$2,200" },
    ],
    faq: [
      {
        question: "Do you serve Katy homes?",
        answer:
          "Yes. Houston-area professionals provide plumbing support to homes and neighborhoods across Katy and nearby communities.",
      },
      {
        question: "What issues are common in Katy?",
        answer:
          "Aging supply lines, hidden leaks, slow drains, and water heater wear are common reasons homeowners request service.",
      },
      {
        question: "Can I request immediate service?",
        answer:
          "Yes. Emergency and urgent calls are typically prioritized so repairs can begin promptly and prevent additional damage.",
      },
    ],
  },

  "sugar-land": {
    intro:
      "Sugar Land homeowners rely on dependable plumbing service when problems affect comfort, scheduling, or the structural safety of the home. Fast diagnosis helps prevent hidden leaks from spreading behind finished walls and under slab areas, particularly in homes with more complex plumbing layouts and larger family need.",
    detail:
      "A strong local repair plan includes a full review of the problem, transparent communication, and a practical fix that fits the home’s age and service history. Residents who act early can often avoid larger restoration work and reduce the chance of repeat issues or additional property damage.",
    pricing: [
      { label: "Service call", value: "$120-$260" },
      { label: "Local repair", value: "$350-$1,500" },
      { label: "High-priority repair", value: "$500-$2,400" },
    ],
    faq: [
      {
        question: "Do you serve Sugar Land?",
        answer:
          "Yes. Local plumber support is available across Sugar Land and nearby Fort Bend communities.",
      },
      {
        question: "How soon can a plumber come out?",
        answer:
          "Urgent and emergency calls are typically scheduled as quickly as possible based on current demand and severity.",
      },
      {
        question: "Are estimates provided before work?",
        answer:
          "Yes. Homeowners should always receive a clear estimate before a repair begins so they know the expected scope and pricing.",
      },
    ],
  },

  pearland: {
    intro:
      "Pearland homeowners often need plumbing support when minor issues start affecting multiple fixtures or the home’s foundation. Whether the concern is a drain backup, a sudden leak, or a failing water heater, fast response reduces stress and protects the home from unnecessary disruption.",
    detail:
      "Plumbing work in Pearland benefits from experienced diagnosis and local awareness. The right service can catch hidden leaks, identify recurring drainage issues, and recommend a repair that is both cost-effective and reliable for long-term performance.",
    pricing: [
      { label: "Inspection", value: "$120-$250" },
      { label: "Repair visit", value: "$350-$1,600" },
      { label: "Urgent repair", value: "$500-$2,500" },
    ],
    faq: [
      {
        question: "Do you cover Pearland?",
        answer:
          "Yes. Plumbing service is available to homeowners throughout Pearland and nearby communities in the Greater Houston area.",
      },
      {
        question: "Do you handle urgent repairs?",
        answer:
          "Yes. Emergency priorities are based on water damage risk, active leaks, and the scope of the issue.",
      },
      {
        question: "Can I schedule a same-day repair?",
        answer:
          "In many cases, yes. Availability depends on the exact issue and current schedule, but urgent calls are prioritized.",
      },
    ],
  },

  cypress: {
    intro:
      "Cypress homes need reliable plumbing support when sewage issues, hidden leaks, or water heater failures interrupt everyday life. Because many homes in the area have different plumbing layouts and age profiles, a strong repair plan starts with a correct diagnosis and a practical repair path.",
    detail:
      "A quality local plumber does more than handle the visible symptom. They look for the root cause, explain the repair options, and reduce the risk that the same issue comes back. For Cypress homeowners, that means faster service, fewer surprises, and a smarter fix that fits the home’s long-term needs.",
    pricing: [
      { label: "Assessment", value: "$120-$250" },
      { label: "Repair visit", value: "$350-$1,500" },
      { label: "Urgent response", value: "$500-$2,300" },
    ],
    faq: [
      {
        question: "Do you serve Cypress?",
        answer:
          "Yes. Plumbing support is available across Cypress and nearby communities.",
      },
      {
        question: "Can you handle urgent blockages?",
        answer:
          "Yes. Sewer, leak, and emergency service calls are prioritized based on immediate risk to the home.",
      },
      {
        question: "How do I know when to call?",
        answer:
          "If the issue is causing active water damage, recurring backups, or a major comfort disruption, it is best to call quickly rather than waiting.",
      },
    ],
  },

  pasadena: {
    intro:
      "Pasadena homes regularly see plumbing stress from aging lines, heavier family usage, and repeated wear in kitchens and bathrooms. Small problems left unattended often evolve into larger line cracks, hidden leaks, or drain backups, which is why prompt service matters in residential neighborhoods across the city.",
    detail:
      "A strong Pasadena repair strategy focuses on identifying the actual failure point and preventing future issues. Homeowners benefit from clear communication, accurate diagnosis, and a repair plan that addresses both the immediate problem and the likely root cause of recurring trouble.",
    pricing: [
      { label: "Inspection", value: "$120-$260" },
      { label: "Repair call", value: "$350-$1,600" },
      { label: "Emergency service", value: "$500-$2,400" },
    ],
    faq: [
      {
        question: "Do you serve Pasadena?",
        answer:
          "Yes. Local plumbing professionals can help with service requests across Pasadena and surrounding Houston-area communities.",
      },
      {
        question: "Can you handle urgent leaks and backups?",
        answer:
          "Yes. Active leaks, drain backups, and urgent failures are usually scheduled quickly to reduce further damage.",
      },
      {
        question: "What kinds of issues are common?",
        answer:
          "Many Pasadena homeowners call about water heaters, drain clogs, recurring leaks, and sewer line concerns.",
      },
    ],
  },

  "missouri-city": {
    intro:
      "Missouri City homeowners expect reliable plumbing performance, especially when hot water, drainage, or leak issues affect the whole household. Local service that understands the area’s home stock and repair patterns is essential for a durable fix that preserves the quality of the property.",
    detail:
      "A reliable plumbing review includes the age of the plumbing system, the symptoms being reported, and the possibility of hidden water loss or drainage problems behind walls or under slabs. That approach helps homeowners avoid unnecessary repairs while still addressing the problem at the source.",
    pricing: [
      { label: "Assessment", value: "$120-$250" },
      { label: "Repair visit", value: "$350-$1,500" },
      { label: "Priority service", value: "$500-$2,200" },
    ],
    faq: [
      {
        question: "Do you cover Missouri City?",
        answer:
          "Yes. Service is available across Missouri City and nearby neighborhoods in Greater Houston.",
      },
      {
        question: "What if the leak is hidden?",
        answer:
          "A proper diagnosis often uses leak detection techniques to find the source before invasive repairs begin.",
      },
      {
        question: "Can you help with recurring drain issues?",
        answer:
          "Yes. We commonly help homeowners with drain clearing, sewer risk, and line inspection services here as well.",
      },
    ],
  },

  richmond: {
    intro:
      "Richmond homeowners rely on dependable plumbing support when a sudden leak, blocked drain, or water heater issue can affect daily life. Responding quickly is the key to protecting the home and keeping the family comfortable while repairs are underway.",
    detail:
      "Whether the issue is localized at a sink or spread across a larger line, strong diagnosis matters. A quality plumber verifies the source of the problem, explains whether a repair or replacement is best, and helps the homeowner make an informed decision without unnecessary urgency.",
    pricing: [
      { label: "Inspection", value: "$120-$250" },
      { label: "Repair visit", value: "$350-$1,500" },
      { label: "Urgent response", value: "$500-$2,300" },
    ],
    faq: [
      {
        question: "Do you serve Richmond?",
        answer:
          "Yes. Richmond homeowners can request plumbing help for urgent and residential repair work across the area.",
      },
      {
        question: "How soon can I get service?",
        answer:
          "Availability depends on the urgency of the issue, but prompt assessment is available for emergency and priority calls.",
      },
      {
        question: "What should I do if I think there is a hidden leak?",
        answer:
          "Monitor the water bill, check for signs of moisture, and request a leak inspection before the damage spreads.",
      },
    ],
  },

  spring: {
    intro:
      "Plumbing problems in Spring, Texas can affect kitchens, bathrooms, water heaters, drainage systems, and other parts of a home. The right response depends on the symptoms, the plumbing system, and the severity of the issue.",
    detail:
      "Homeowners in Spring can use this page to understand the selected plumbing service, common warning signs, and the type of professional help that may be appropriate. Service availability and response times depend on the local provider and the specific situation.",
    pricing: [],
    faq: [
      {
        question: "Do you provide plumbing service in Spring?",
        answer:
          "Piperesque helps homeowners in Spring connect with local plumbing professionals for the service they need.",
      },
      {
        question: "How quickly can a plumber respond?",
        answer:
          "Response time depends on the urgency of the issue, provider availability, and current demand.",
      },
      {
        question: "Can I request service for an urgent plumbing problem?",
        answer:
          "Yes. You can request service and discuss the issue with an available local plumbing provider.",
      },
    ],
  },

  "the-woodlands": {
    intro:
      "Plumbing problems in The Woodlands, Texas can range from drainage and water-heater concerns to leaks and other residential plumbing issues. A proper diagnosis helps identify the source of the problem and determine the appropriate next step.",
    detail:
      "Homeowners in The Woodlands can use this page to learn about the selected plumbing service, common warning signs, and available service options. Availability, response times, and pricing depend on the local provider and the specific situation.",
    pricing: [],
    faq: [
      {
        question: "Do you provide plumbing service in The Woodlands?",
        answer:
          "Piperesque helps homeowners in The Woodlands connect with local plumbing professionals who can assist with the selected service.",
      },
      {
        question: "How quickly can a plumber respond?",
        answer:
          "Response time depends on urgency, provider availability, traffic, and the specific plumbing issue.",
      },
      {
        question: "Can I request service for an urgent issue?",
        answer:
          "Yes. You can request service and discuss the problem with an available local plumbing provider.",
      },
    ],
  },
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

  const city = locations.find((item) => item.slug === location);
  const plumbing = services.find((item) => item.slug === service);

  if (!city || !plumbing) {
    return {
      title: "Page Not Found",
    };
  }

  return {
    title: `${plumbing.shortTitle} in ${city.city}, ${city.stateCode} | Piperesque`,
    description: `${plumbing.shortTitle} services in ${city.city}, ${city.state}. Learn about the service, common plumbing problems, and how Piperesque connects homeowners with local plumbing professionals.`,
    alternates: {
      canonical: `https://www.piperesque.com/location/${city.slug}/${plumbing.slug}`,
    },
  };
}

export default async function LocationServicePage({
  params,
}: Props) {
  const { location, service } = await params;

  const city = locations.find((item) => item.slug === location);
  const plumbing = services.find((item) => item.slug === service);

  if (!city || !plumbing) {
    notFound();
  }

  const cityInfo: CityInfo = cityCopy[city.slug] ?? {
    intro: `Plumbing problems in ${city.city}, ${city.state} can affect kitchens, bathrooms, water heaters, drainage systems, and other parts of a home. The right response depends on the symptoms, the plumbing system, and the severity of the issue.`,
    detail: `Homeowners in ${city.city} can use this page to understand ${plumbing.shortTitle.toLowerCase()}, common warning signs, and the type of professional help that may be appropriate. Service availability and response times depend on the local provider and the specific situation.`,
    pricing: [],
    faq: [],
  };

  const localFaqs = [
    ...cityInfo.faq,
    {
      question: `What does ${plumbing.shortTitle.toLowerCase()} involve?`,
      answer: `${plumbing.shortTitle} can involve different causes depending on the property, plumbing system, and symptoms. A local plumbing professional can assess the issue and recommend the appropriate next step.`,
    },
  ];

  const schema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${plumbing.shortTitle} in ${city.city}`,
    serviceType: plumbing.shortTitle,
    description: `${plumbing.shortTitle} information for homeowners in ${city.city}, ${city.state}.`,
    areaServed: {
      "@type": "City",
      name: city.city,
      addressRegion: city.stateCode,
      addressCountry: "US",
    },
    provider: {
      "@type": "Organization",
      name: siteConfig.company,
      url: "https://www.piperesque.com",
    },
  };

  return (
    <main className="overflow-x-hidden bg-white">
      <BreadcrumbSchema
        items={[
          {
            name: "Home",
            url: "https://www.piperesque.com",
          },
          {
            name: "Location",
            url: `https://www.piperesque.com/location/${city.slug}`,
          },
          {
            name: plumbing.shortTitle,
            url: `https://www.piperesque.com/location/${city.slug}/${plumbing.slug}`,
          },
        ]}
      />

      <JsonLd schema={schema} />

      <FAQSchema faqs={localFaqs} />

      <Navbar />

      <section className="relative overflow-hidden bg-blue-950 py-28 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900 to-sky-900" />

        <div className="container-custom relative z-10">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.15em] text-blue-100">
              <Clock3 size={14} className="text-green-400" />
              {city.city} plumbing support
            </div>

            <h1 className="mt-6 text-5xl font-black leading-tight md:text-6xl">
              {plumbing.shortTitle} in {city.city}, {city.stateCode}
            </h1>

            <p className="mt-6 max-w-3xl text-xl leading-9 text-blue-100">
              Learn about {plumbing.shortTitle.toLowerCase()} in{" "}
              {city.city}, including common problems, service considerations,
              and options for connecting with a local plumbing professional.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href={`tel:${siteConfig.phone}`}
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-4 font-black text-white transition hover:bg-red-700"
              >
                <Phone size={18} />
                Call {siteConfig.phoneDisplay}
              </a>

              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-4 font-bold text-white transition hover:bg-white hover:text-blue-900"
              >
                Request service
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container-custom grid gap-12 lg:grid-cols-[1.5fr_0.9fr]">
          <div>
            <p className="text-lg leading-9 text-slate-600">
              {cityInfo.intro}
            </p>

            <p className="mt-6 text-lg leading-9 text-slate-600">
              {cityInfo.detail}
            </p>

            <div className="mt-8 rounded-[30px] border border-blue-100 bg-blue-50 p-8">
              <h2 className="text-3xl font-black text-slate-900">
                {plumbing.shortTitle} in {city.city}
              </h2>

              <p className="mt-4 text-lg leading-8 text-slate-700">
                {plumbing.shortTitle} can involve different causes depending
                on the property, plumbing system, and symptoms. A qualified
                local provider can assess the issue and recommend the
                appropriate next step.
              </p>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {plumbing.benefits.slice(0, 4).map((benefit) => (
                  <div
                    key={benefit}
                    className="rounded-2xl border border-blue-100 bg-white p-5"
                  >
                    <p className="font-semibold leading-7 text-slate-700">
                      {benefit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-10 rounded-[30px] border border-slate-200 bg-slate-50 p-8">
              <h2 className="text-3xl font-black text-slate-900">
                What to expect
              </h2>

              <div className="mt-8 space-y-5">
                {[
                  "Assessment of the reported plumbing issue and its likely cause.",
                  "An explanation of the available service options based on the condition of the plumbing system.",
                  "A discussion of expected work, parts, and pricing before work begins.",
                  "Recommendations for reducing the chance of recurring plumbing problems.",
                ].map((item, idx) => (
                  <div
                    key={item}
                    className="flex gap-4 rounded-2xl bg-white p-4"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                      {idx + 1}
                    </div>

                    <p className="text-base leading-7 text-slate-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {cityInfo.pricing.length > 0 && (
              <div className="mt-12 rounded-[30px] border border-blue-200 bg-blue-50 p-8">
                <h3 className="text-3xl font-black text-slate-900">
                  Typical pricing information in {city.city}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-600">
                  Pricing varies by provider, repair type, parts, labor, access,
                  and urgency. The figures below are informational only and
                  should not be treated as a quote.
                </p>

                <div className="mt-8 grid gap-4 md:grid-cols-3">
                  {cityInfo.pricing.map((item) => (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-blue-100 bg-white p-5"
                    >
                      <div className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
                        {item.label}
                      </div>

                      <div className="mt-3 text-2xl font-black text-blue-700">
                        {item.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          <aside className="lg:pt-6">
            <div className="sticky top-28 rounded-[32px] border border-slate-200 bg-slate-50 p-8 shadow-lg">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-2 text-xs font-black uppercase tracking-[0.15em] text-red-700">
                <ShieldCheck size={14} />
                Local service
              </div>

              <h3 className="mt-6 text-2xl font-black text-slate-900">
                Need {plumbing.shortTitle.toLowerCase()} in {city.city}?
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                Connect with a local plumbing professional to discuss the
                problem, service availability, and next steps.
              </p>

              <a
                href={`tel:${siteConfig.phone}`}
                className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-4 font-black text-white transition hover:bg-blue-700"
              >
                <Phone size={18} />
                {siteConfig.phoneDisplay}
              </a>

              <Link
                href="/contact"
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-4 font-bold text-slate-900 transition hover:border-blue-600 hover:text-blue-700"
              >
                Request service
              </Link>

              <div className="mt-8 rounded-2xl bg-white p-5">
                <div className="text-sm font-bold uppercase tracking-[0.15em] text-slate-500">
                  Related services
                </div>

                <ul className="mt-4 space-y-3 text-slate-700">
                  {services
                    .filter((item) => item.slug !== plumbing.slug)
                    .slice(0, 5)
                    .map((item) => (
                      <li key={item.slug}>
                        <Link
                          href={`/location/${city.slug}/${item.slug}`}
                          className="inline-flex items-center gap-2 hover:text-blue-700"
                        >
                          <ArrowRight size={16} />
                          {item.shortTitle}
                        </Link>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-custom max-w-5xl">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-lg md:p-10">
            <h3 className="text-3xl font-black text-slate-900">
              Common questions about {plumbing.shortTitle.toLowerCase()} in{" "}
              {city.city}
            </h3>

            <div className="mt-8 space-y-6">
              {localFaqs.map((faq) => (
                <div
                  key={faq.question}
                  className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0"
                >
                  <h4 className="text-xl font-bold text-slate-900">
                    {faq.question}
                  </h4>

                  <p className="mt-3 text-base leading-8 text-slate-600">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <CTA />
      <Footer />
    </main>
  );
}
// Part 3 continues from the end of Part 2.

export const dynamicParams = false;