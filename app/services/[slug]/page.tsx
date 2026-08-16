import { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import {
  AlertTriangle,
  ArrowRight,
  BadgeCheck,
  ChevronRight,
  Clock3,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles,
  Wrench,
} from "lucide-react";

import FAQSchema from "@/components/seo/faq-schema";
import BreadcrumbSchema from "@/components/seo/breadcrumb-schema";
import JsonLd from "@/components/seo/json-ld";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";

import { services } from "@/lib/data/services";
import { siteConfig } from "@/lib/config/site";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

type ServiceContent = {
  heroBadge: string;
  intro: string[];
  warningSigns: string[];
  repairProcess: string[];
  pricing: {
    label: string;
    value: string;
  }[];
  faqs: {
    question: string;
    answer: string;
  }[];
  overview: string;
};

const serviceContent: Record<string, ServiceContent> = {
  "emergency-plumbing": {
    heroBadge: "Emergency plumbing information",
    intro: [
      "A plumbing emergency can cause significant water damage when it is not addressed quickly. Burst pipes, severe leaks, sewer backups, and major water heater failures can affect walls, floors, cabinets, and other parts of a property.",
      "Piperesque helps visitors find plumbing service options and information. If a plumbing problem is actively causing damage, shutting off the water when safe and contacting an appropriate local plumbing professional can help limit further damage.",
      "The right response depends on the type of plumbing failure, the location of the problem, accessibility, and the condition of the plumbing system. A professional assessment can determine the appropriate repair approach."
    ],
    warningSigns: [
      "Water is actively leaking from a pipe, wall, ceiling, or fixture.",
      "Water or sewage is backing up into tubs, toilets, or floor drains.",
      "Multiple plumbing fixtures stop draining normally at the same time.",
      "A sudden unexplained loss of water pressure occurs.",
      "You hear unusual rushing or banging sounds from the plumbing system."
    ],
    repairProcess: [
      "Assess the plumbing problem and identify the affected area.",
      "If necessary and safe, isolate the water supply to limit additional damage.",
      "Inspect the affected plumbing system and determine the likely cause.",
      "Repair or replace the damaged component using an appropriate repair method.",
      "Test the plumbing system and explain any recommended follow-up work."
    ],
    pricing: [
      { label: "Diagnostic service", value: "Varies by provider and scope" },
      { label: "Burst pipe repair", value: "Varies by damage and access" },
      { label: "Main line repair", value: "Varies by pipe condition and location" },
      { label: "Sewer backup service", value: "Varies by blockage and repair requirements" },
      { label: "Water heater repair", value: "Varies by unit and failed component" }
    ],
    faqs: [
      {
        question: "What counts as a plumbing emergency?",
        answer:
          "Active leaks, burst pipes, sewage backups, flooding, and major plumbing failures that can cause property damage are commonly treated as urgent plumbing problems."
      },
      {
        question: "What should I do during a major plumbing leak?",
        answer:
          "If it is safe, shut off the affected water supply or main water valve and move belongings away from the affected area. Contact a qualified local plumbing professional for an assessment."
      },
      {
        question: "Do emergency plumbing services cost more?",
        answer:
          "Pricing depends on the provider, time of service, repair type, labor, parts, accessibility, and the extent of the plumbing problem."
      },
      {
        question: "Can a burst pipe be repaired the same day?",
        answer:
          "Some accessible burst pipe repairs can be completed during the initial service visit. More complex repairs may require additional work or parts."
      },
      {
        question: "What should I do if sewage is backing up?",
        answer:
          "Avoid using affected plumbing fixtures and contact a plumbing professional promptly. Sewage backups can create sanitation and property-damage concerns."
      }
    ],
    overview:
      "Emergency plumbing problems require timely assessment because active water leaks and sewage backups can cause additional property damage. The appropriate repair depends on the specific plumbing failure."
  },

  "sewer-line-repair": {
    heroBadge: "Sewer line repair information",
    intro: [
      "Sewer line problems can affect multiple plumbing fixtures at the same time. Cracked pipes, root intrusion, collapsed sections, and significant blockages can cause slow drainage, backups, odors, and wastewater problems.",
      "A proper sewer line diagnosis normally begins by determining where the problem is located and whether the issue is a blockage or a structural pipe problem. Camera inspection can be useful when the plumbing professional determines that it is appropriate.",
      "The repair method depends on the pipe material, depth, location, accessibility, and severity of the damage. Some situations may require localized repair while others may require a larger replacement."
    ],
    warningSigns: [
      "Multiple fixtures drain slowly or back up together.",
      "You hear gurgling sounds from toilets or drains.",
      "There is an unexplained sewage odor.",
      "Wastewater appears in floor drains, tubs, or toilets.",
      "A section of the yard remains unusually wet without an obvious explanation."
    ],
    repairProcess: [
      "Identify whether the problem affects a fixture, branch line, or main sewer line.",
      "Inspect the sewer line when appropriate to identify the location and type of problem.",
      "Determine whether the problem is a blockage, damaged pipe, root intrusion, or another condition.",
      "Select a repair or replacement method based on the property's conditions.",
      "Test drainage and verify that the plumbing system is operating properly."
    ],
    pricing: [
      { label: "Sewer camera inspection", value: "Varies by provider and scope" },
      { label: "Localized sewer repair", value: "Varies by pipe and access" },
      { label: "Trenchless repair", value: "Varies by system and damage" },
      { label: "Sewer line replacement", value: "Varies by length and excavation requirements" },
      { label: "Root intrusion service", value: "Varies by severity and treatment" }
    ],
    faqs: [
      {
        question: "How do I know if my sewer line has a problem?",
        answer:
          "Recurring backups, multiple slow drains, sewage odors, and wastewater appearing in unexpected fixtures can indicate a sewer line issue."
      },
      {
        question: "Can a sewer line be repaired without digging?",
        answer:
          "Some sewer problems can be addressed using trenchless methods, but suitability depends on pipe condition, location, material, and the type of damage."
      },
      {
        question: "What causes sewer line problems?",
        answer:
          "Common causes include blockages, root intrusion, aging pipe materials, cracks, ground movement, and collapsed sections."
      },
      {
        question: "Does a sewer backup require immediate attention?",
        answer:
          "A sewage backup should be addressed promptly because wastewater can create sanitation concerns and additional property damage."
      },
      {
        question: "Will the entire sewer line need to be replaced?",
        answer:
          "Not necessarily. The appropriate repair depends on the location, extent, and cause of the damage."
      }
    ],
    overview:
      "Sewer line problems can affect the entire drainage system. Accurate diagnosis helps determine whether clearing, localized repair, or replacement is appropriate."
  },

  "drain-cleaning": {
    heroBadge: "Drain cleaning information",
    intro: [
      "Slow or blocked drains are common plumbing problems. Grease, hair, soap residue, mineral buildup, and other debris can restrict water flow through sinks, showers, tubs, and drain lines.",
      "A recurring clog can sometimes indicate a deeper problem in a branch line or main sewer line. The appropriate cleaning method depends on the location and type of obstruction.",
      "Professional drain cleaning may involve mechanical tools, specialized equipment, or inspection methods when a recurring blockage requires additional diagnosis."
    ],
    warningSigns: [
      "Water drains noticeably slower than normal.",
      "A sink, shower, or tub repeatedly becomes blocked.",
      "An unpleasant odor comes from a drain.",
      "Water backs up when another fixture is used.",
      "Several fixtures begin draining slowly at the same time."
    ],
    repairProcess: [
      "Identify the affected fixture and determine whether the blockage appears localized.",
      "Use an appropriate mechanical or professional drain-cleaning method.",
      "Investigate recurring or difficult blockages for a deeper plumbing issue.",
      "Confirm that water flow has returned to normal.",
      "Provide recommendations for reducing future buildup when appropriate."
    ],
    pricing: [
      { label: "Basic drain cleaning", value: "Varies by provider and blockage" },
      { label: "Drain snaking", value: "Varies by equipment and scope" },
      { label: "Hydro-jetting", value: "Varies by line and buildup" },
      { label: "Main drain clearing", value: "Varies by blockage location" },
      { label: "Emergency drain service", value: "Varies by provider and timing" }
    ],
    faqs: [
      {
        question: "When should I call for drain cleaning?",
        answer:
          "Repeated slow drainage, recurring clogs, multiple affected fixtures, or water backing up through another fixture are good reasons to request a professional assessment."
      },
      {
        question: "What is hydro-jetting?",
        answer:
          "Hydro-jetting uses pressurized water to remove certain types of buildup and debris from plumbing lines. A professional should determine whether it is suitable for the pipe."
      },
      {
        question: "Can a drain clog indicate a sewer problem?",
        answer:
          "Yes. Multiple fixtures backing up together can indicate a blockage or structural issue farther down the drainage system."
      },
      {
        question: "Should I use chemical drain cleaners?",
        answer:
          "Chemical drain cleaners may not address the underlying cause of recurring blockages. A plumbing professional can determine a suitable cleaning method."
      },
      {
        question: "How can I reduce drain clogs?",
        answer:
          "Using appropriate drain strainers, avoiding grease disposal through sinks, and addressing recurring slow drainage early can help reduce plumbing problems."
      }
    ],
    overview:
      "Drain cleaning restores water flow and can help identify recurring plumbing problems before they become more serious."
  },
    "leak-detection": {
    heroBadge: "Leak detection information",
    intro: [
      "Hidden plumbing leaks can occur behind walls, beneath floors, under cabinets, around fixtures, or near water heaters. If left unresolved, even a small leak can contribute to water waste and property damage.",
      "Leak detection focuses on identifying the likely source of unexplained water loss or moisture. Depending on the situation, a plumbing professional may use visual inspection, pressure testing, acoustic equipment, thermal imaging, or other diagnostic methods.",
      "The appropriate repair depends on the location and cause of the leak. A targeted diagnosis can help determine whether the problem involves a fitting, fixture, supply line, drain line, or another part of the plumbing system."
    ],
    warningSigns: [
      "Your water usage increases without an obvious change in household activity.",
      "You notice unexplained dampness, staining, or discoloration.",
      "Water appears around cabinets, fixtures, walls, or floors.",
      "You hear water running when plumbing fixtures are not being used.",
      "A musty odor develops near an area where moisture may be present."
    ],
    repairProcess: [
      "Review the visible symptoms and identify possible areas of water loss.",
      "Inspect accessible plumbing fixtures, valves, and connections.",
      "Use appropriate diagnostic equipment when the leak is not visibly accessible.",
      "Identify the likely source and determine an appropriate repair method.",
      "Repair the affected component and test the plumbing system afterward."
    ],
    pricing: [
      { label: "Leak inspection", value: "Varies by provider and scope" },
      { label: "Hidden leak detection", value: "Varies by diagnostic requirements" },
      { label: "Slab leak diagnosis", value: "Varies by property and access" },
      { label: "Localized leak repair", value: "Varies by pipe and location" },
      { label: "Pipe replacement or rerouting", value: "Varies by repair requirements" }
    ],
    faqs: [
      {
        question: "How can I tell if I have a hidden plumbing leak?",
        answer:
          "Unexplained water usage, damp areas, staining, musty odors, or sounds of running water when fixtures are off can indicate a hidden leak."
      },
      {
        question: "How are hidden leaks detected?",
        answer:
          "Depending on the situation, professionals may use visual inspection, pressure testing, acoustic equipment, thermal imaging, or other diagnostic methods."
      },
      {
        question: "Can a leak damage my home?",
        answer:
          "Yes. An unresolved plumbing leak can contribute to water damage and deterioration of affected building materials."
      },
      {
        question: "Does every hidden leak require opening a wall?",
        answer:
          "Not necessarily. Diagnostic methods may help narrow down the source before invasive access is considered."
      },
      {
        question: "What should I do if I suspect a major leak?",
        answer:
          "If safe, reduce or shut off the water supply to the affected area and contact a plumbing professional for an assessment."
      }
    ],
    overview:
      "Accurate leak detection helps identify unexplained water loss and hidden plumbing problems so that an appropriate repair can be planned."
  },

  "water-heater-repair": {
    heroBadge: "Water heater information",
    intro: [
      "A water heater problem can affect showers, cleaning, laundry, and other daily activities. Common symptoms include inconsistent hot water, unusual noises, visible leaks, or a unit that no longer heats water properly.",
      "A water heater should be diagnosed before deciding whether repair or replacement is appropriate. The problem may involve a heating component, thermostat, connection, valve, sediment buildup, or another part of the system.",
      "The best repair or replacement option depends on the equipment type, age, condition, household demand, installation requirements, and the specific failure."
    ],
    warningSigns: [
      "Hot water runs out unusually quickly.",
      "The water temperature is inconsistent.",
      "Water is leaking around the water heater.",
      "The unit produces unusual rumbling, popping, or banging sounds.",
      "Hot water appears discolored or rusty."
    ],
    repairProcess: [
      "Inspect the water heater and identify the reported symptoms.",
      "Determine whether the problem involves a component, connection, valve, or tank.",
      "Evaluate whether repair is appropriate based on the unit's condition.",
      "Repair the affected component or discuss replacement when necessary.",
      "Test the system and verify that it is operating correctly."
    ],
    pricing: [
      { label: "Water heater diagnosis", value: "Varies by provider and scope" },
      { label: "Component repair", value: "Varies by failed component" },
      { label: "Water heater maintenance", value: "Varies by system and service" },
      { label: "Tank replacement", value: "Varies by model and installation" },
      { label: "Tankless replacement", value: "Varies by system and installation" }
    ],
    faqs: [
      {
        question: "Should I repair or replace my water heater?",
        answer:
          "The decision depends on the unit's age, condition, repair requirements, performance, and replacement cost. A professional diagnosis can help determine the appropriate option."
      },
      {
        question: "What are common water heater problems?",
        answer:
          "Common symptoms include insufficient hot water, inconsistent temperature, leaks, unusual noises, and component failures."
      },
      {
        question: "How long does a water heater last?",
        answer:
          "Service life varies depending on the equipment type, installation, water conditions, usage, and maintenance."
      },
      {
        question: "Is a leaking water heater urgent?",
        answer:
          "An active leak should be addressed promptly because continued water leakage can cause property damage."
      },
      {
        question: "Can sediment affect a water heater?",
        answer:
          "Sediment buildup can affect water heater performance and may contribute to noise and reduced efficiency."
      }
    ],
    overview:
      "Water heater diagnosis helps determine whether a failing system needs a component repair, maintenance, or replacement."
  },

  "burst-pipe-repair": {
    heroBadge: "Burst pipe information",
    intro: [
      "A burst or severely damaged pipe can release a large amount of water into a property. Water may enter walls, ceilings, cabinets, floors, or other areas and can cause additional damage if the flow is not controlled.",
      "If a pipe is actively leaking, shutting off the water supply when it is safe to do so can help limit additional water loss. The next step is identifying the failed section and determining the appropriate repair.",
      "The repair can range from replacing a localized section of pipe to addressing a larger plumbing-system problem. The correct solution depends on the pipe material, location, accessibility, and condition of nearby plumbing."
    ],
    warningSigns: [
      "A pipe is visibly cracked or leaking.",
      "Water suddenly appears from a wall, ceiling, cabinet, or floor.",
      "There is a sudden and unexplained loss of water pressure.",
      "You hear continuous rushing water when fixtures are not being used.",
      "The water meter indicates ongoing water use when the property is not using water."
    ],
    repairProcess: [
      "Shut off the affected water supply when safe to do so.",
      "Locate the failed pipe section and assess surrounding plumbing.",
      "Determine whether the failure is localized or part of a larger plumbing issue.",
      "Repair or replace the affected section using an appropriate method.",
      "Restore water service and test the repaired plumbing system."
    ],
    pricing: [
      { label: "Burst pipe diagnosis", value: "Varies by provider and access" },
      { label: "Localized pipe repair", value: "Varies by pipe and damage" },
      { label: "Pipe section replacement", value: "Varies by material and location" },
      { label: "Main line repair", value: "Varies by system and access" },
      { label: "Additional water-damage work", value: "Handled separately based on damage" }
    ],
    faqs: [
      {
        question: "What should I do if a pipe bursts?",
        answer:
          "If it is safe, shut off the main or affected water supply, move valuables away from the water, and contact a plumbing professional promptly."
      },
      {
        question: "Can a burst pipe be repaired instead of replaced?",
        answer:
          "Depending on the location and condition of the pipe, a localized repair may be possible. A professional should determine the appropriate method."
      },
      {
        question: "What causes pipes to fail?",
        answer:
          "Pipe failures can result from age, corrosion, physical damage, pressure problems, freezing conditions, or deterioration of plumbing components."
      },
      {
        question: "Can a burst pipe cause hidden damage?",
        answer:
          "Yes. Water can enter walls, ceilings, floors, and other areas that may not be immediately visible."
      },
      {
        question: "Should I keep using the plumbing after a pipe bursts?",
        answer:
          "If there is active leakage, avoid using the affected plumbing and shut off the water supply when safe until the problem can be assessed."
      }
    ],
    overview:
      "A burst pipe requires prompt attention because uncontrolled water flow can cause additional property damage. Fast isolation and accurate diagnosis help determine the appropriate repair."
  },
};
export async function generateStaticParams() {
  return services.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;

  const service = services.find((item) => item.slug === slug);

  if (!service) {
    return {
      title: "Service Not Found | Piperesque",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const content = serviceContent[service.slug];

  return {
    title: `${service.shortTitle} | Plumbing Services | Piperesque`,
    description:
      content?.overview ??
      `${service.shortTitle} information and plumbing service options from Piperesque.`,
    alternates: {
      canonical: `https://www.piperesque.com/services/${service.slug}`,
    },
    openGraph: {
      title: `${service.shortTitle} | Plumbing Services | Piperesque`,
      description:
        content?.overview ??
        `${service.shortTitle} information and plumbing service options from Piperesque.`,
      url: `https://www.piperesque.com/services/${service.slug}`,
      type: "website",
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;

  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  const content = serviceContent[service.slug];

  if (!content) {
    notFound();
  }

  const faqItems = content.faqs;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.shortTitle,
    serviceType: service.shortTitle,
    description: content.overview,
    url: `https://www.piperesque.com/services/${service.slug}`,
    areaServed: {
      "@type": "State",
      name: "Texas",
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
            name: "Services",
            url: "https://www.piperesque.com/services",
          },
          {
            name: service.shortTitle,
            url: `https://www.piperesque.com/services/${service.slug}`,
          },
        ]}
      />

      <JsonLd schema={serviceSchema} />

      <FAQSchema faqs={faqItems} />

      <Navbar />

      <section className="relative overflow-hidden bg-blue-950 py-28 text-white">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-900 to-sky-900" />

        <div className="container-custom relative z-10">
          <div className="max-w-5xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.15em] text-blue-100">
              <Wrench size={15} />
              {content.heroBadge}
            </div>

            <h1 className="mt-6 text-5xl font-black leading-tight md:text-6xl">
              {service.shortTitle}
            </h1>

            <p className="mt-6 max-w-3xl text-xl leading-9 text-blue-100">
              {content.overview}
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-4 font-black text-white transition hover:bg-red-700"
              >
                <Phone size={18} />
                Request service
              </Link>

              <Link
                href="/service-areas"
                className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-7 py-4 font-bold text-white transition hover:bg-white hover:text-blue-900"
              >
                <MapPin size={18} />
                View service areas
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-4xl font-black text-slate-900">
              About {service.shortTitle}
            </h2>

            {content.intro.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-6 text-lg leading-9 text-slate-600"
              >
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="container-custom">
          <div className="grid gap-12 lg:grid-cols-2">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-sm font-bold text-amber-800">
                <AlertTriangle size={16} />
                Warning signs
              </div>

              <h2 className="mt-5 text-4xl font-black text-slate-900">
                Signs you may need {service.shortTitle.toLowerCase()}
              </h2>

              <div className="mt-8 space-y-4">
                {content.warningSigns.map((sign) => (
                  <div
                    key={sign}
                    className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <ShieldCheck
                      size={22}
                      className="mt-1 shrink-0 text-blue-600"
                    />

                    <p className="leading-7 text-slate-700">{sign}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-sm font-bold text-blue-800">
                <Wrench size={16} />
                Service process
              </div>

              <h2 className="mt-5 text-4xl font-black text-slate-900">
                What the service may involve
              </h2>

              <div className="mt-8 space-y-4">
                {content.repairProcess.map((step, index) => (
                  <div
                    key={step}
                    className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-black text-white">
                      {index + 1}
                    </div>

                    <p className="leading-7 text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
            <section className="py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-[32px] border border-blue-100 bg-blue-50 p-8 md:p-10">
              <div className="flex items-center gap-3">
                <BadgeCheck className="text-blue-700" size={24} />

                <h2 className="text-3xl font-black text-slate-900">
                  Pricing information
                </h2>
              </div>

              <p className="mt-4 max-w-3xl leading-8 text-slate-600">
                Plumbing pricing varies by provider, location, labor,
                materials, accessibility, equipment, and the complexity of
                the problem. The information below is provided for general
                context and should not be treated as a quote.
              </p>

              <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {content.pricing.map((item) => (
                  <div
                    key={item.label}
                    className="rounded-2xl border border-blue-100 bg-white p-6"
                  >
                    <p className="text-sm font-bold uppercase tracking-[0.12em] text-slate-500">
                      {item.label}
                    </p>

                    <p className="mt-3 text-lg font-black text-blue-700">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-slate-50 py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-4xl">
            <div className="flex items-center gap-3">
              <Sparkles className="text-blue-600" size={24} />

              <h2 className="text-4xl font-black text-slate-900">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="mt-10 space-y-5">
              {content.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-2xl border border-slate-200 bg-white p-6"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 text-lg font-bold text-slate-900">
                    <span>{faq.question}</span>

                    <ChevronRight
                      size={20}
                      className="shrink-0 transition-transform group-open:rotate-90"
                    />
                  </summary>

                  <p className="mt-4 max-w-3xl leading-8 text-slate-600">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container-custom">
          <div className="mx-auto max-w-5xl">
            <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
              <div className="flex items-center gap-3">
                <MapPin className="text-blue-600" size={24} />

                <h2 className="text-3xl font-black text-slate-900">
                  Explore local service pages
                </h2>
              </div>

              <p className="mt-4 max-w-3xl leading-8 text-slate-600">
                Looking for this service in a specific Texas community?
                Explore the available location pages below.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {[
                  "houston",
                  "katy",
                  "sugar-land",
                  "cypress",
                  "spring",
                  "pearland",
                  "pasadena",
                  "richmond",
                  "missouri-city",
                  "the-woodlands",
                ].map((city) => (
                  <Link
                    key={city}
                    href={`/location/${city}/${service.slug}`}
                    className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 font-bold text-slate-800 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700"
                  >
                    <span>
                      {city
                        .split("-")
                        .map(
                          (word) =>
                            word.charAt(0).toUpperCase() + word.slice(1)
                        )
                        .join(" ")}
                    </span>

                    <ArrowRight
                      size={18}
                      className="transition-transform group-hover:translate-x-1"
                    />
                  </Link>
                ))}
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