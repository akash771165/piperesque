import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";
import FAQSchema from "@/components/seo/faq-schema";
import BreadcrumbSchema from "@/components/seo/breadcrumb-schema";
import JsonLd from "@/components/seo/json-ld";

import { services } from "@/lib/data/services";
import { locations } from "@/lib/data/locations";

type Props = {
  params: Promise<{
    location: string;
    service: string;
  }>;
};

type FAQItem = {
  question: string;
  answer: string;
};

type ServiceContent = {
  intro: string;
  urgencyTitle: string;
  urgencyText: string;
  problemsTitle: string;
  problems: string[];
  processTitle: string;
  process: {
    title: string;
    description: string;
  }[];
  localTitle: string;
  localText: string;
  costTitle: string;
  costText: string;
  costFactors: string[];
  faqs: FAQItem[];
};

const baseUrl = "https://www.piperesque.com";

const priorityPages = [
  {
    location: "houston",
    service: "emergency-plumbing",
  },
  {
    location: "houston",
    service: "sewer-line-repair",
  },
  {
    location: "houston",
    service: "drain-cleaning",
  },
  {
    location: "houston",
    service: "leak-detection",
  },
  {
    location: "houston",
    service: "water-heater-repair",
  },
];

export const dynamicParams = false;

export function generateStaticParams() {
  return priorityPages;
}

const serviceContent: Record<string, ServiceContent> = {
  "emergency-plumbing": {
    intro:
      "Piperesque helps Houston homeowners connect with independent plumbing professionals for urgent plumbing problems, including major leaks, burst pipes, sewer backups, overflowing fixtures, and other situations that may require prompt attention.",

    urgencyTitle: "When You May Need Emergency Plumbing in Houston",

    urgencyText:
      "A plumbing emergency can cause additional property damage when water continues to flow or wastewater backs up into the home. The appropriate response depends on the source of the problem, the affected plumbing system, and the severity of the situation.",

    problemsTitle: "Common Houston Plumbing Emergencies",

    problems: [
      "Burst or rapidly leaking water pipes",
      "Sewage backup or wastewater entering the property",
      "Overflowing toilets that cannot be cleared normally",
      "Major water leaks around fixtures or plumbing connections",
      "Sudden loss of water caused by a plumbing-system problem",
      "Water heater leaks or failures causing active water damage",
    ],

    processTitle: "What to Expect From an Emergency Plumbing Service",

    process: [
      {
        title: "Describe the emergency",
        description:
          "Explain what happened, where the problem is located, and whether water or wastewater is actively causing damage.",
      },
      {
        title: "Initial assessment",
        description:
          "A plumbing professional can evaluate the visible symptoms and identify the likely source of the problem.",
      },
      {
        title: "Discuss repair options",
        description:
          "Before authorizing significant work, ask about the diagnosis, repair scope, parts, labor, and applicable service charges.",
      },
      {
        title: "Complete the necessary repair",
        description:
          "The selected provider determines the appropriate repair or replacement based on the condition of the plumbing system.",
      },
    ],

    localTitle: "Emergency Plumbing Problems in Houston, TX",

    localText:
      "Houston homes and properties can have different plumbing configurations, construction ages, and maintenance histories. Emergency problems may involve supply lines, fixtures, drainage systems, sewer lines, or water-heating equipment. Prompt assessment can help determine whether the issue is isolated or connected to a larger plumbing problem.",

    costTitle: "Emergency Plumbing Cost in Houston",

    costText:
      "Emergency plumbing pricing varies by provider and depends on the type of failure, time of service, labor, materials, accessibility, equipment, and whether repair or replacement is required. Ask for the applicable diagnostic or service fee and understand the expected scope before authorizing work.",

    costFactors: [
      "Type and severity of the plumbing emergency",
      "Time of day and emergency-service availability",
      "Parts and replacement materials",
      "Accessibility of the affected plumbing",
      "Labor and specialized equipment",
      "Repair versus replacement requirements",
    ],

    faqs: [
      {
        question: "What is considered a plumbing emergency in Houston?",
        answer:
          "Major leaks, burst pipes, sewage backups, severe overflows, and plumbing problems causing active property damage may require prompt professional attention.",
      },
      {
        question: "How quickly can an emergency plumber respond in Houston?",
        answer:
          "Response times depend on provider availability, current demand, traffic, location, and the severity of the plumbing problem. Ask the provider for the expected arrival window.",
      },
      {
        question: "How much does emergency plumbing cost in Houston?",
        answer:
          "The cost depends on the plumbing problem, labor, materials, accessibility, equipment, timing, and whether repair or replacement is necessary. Providers determine their own pricing.",
      },
    ],
  },

  "sewer-line-repair": {
    intro:
      "Piperesque helps Houston homeowners connect with independent plumbing professionals for sewer line inspections, repairs, replacements, backups, and other sewer-related plumbing problems.",

    urgencyTitle: "Sewer Line Problems Should Not Be Ignored",

    urgencyText:
      "A damaged or blocked sewer line can affect multiple drains and may eventually cause wastewater to back up into the property. Repeated backups, sewage odors, unusually slow drains, or changes in drainage behavior can justify a professional sewer-line assessment.",

    problemsTitle: "Common Signs of a Sewer Line Problem",

    problems: [
      "Repeated drain backups affecting multiple fixtures",
      "Sewage odors around drains or outside the property",
      "Slow drainage throughout the home",
      "Wastewater backing up into tubs, showers, or floor drains",
      "Unusual changes in toilet flushing or drainage",
      "Recurring sewer problems after previous drain cleaning",
    ],

    processTitle: "Sewer Line Repair Process",

    process: [
      {
        title: "Identify the symptoms",
        description:
          "A provider reviews which fixtures are affected, how often backups occur, and whether the problem is isolated or widespread.",
      },
      {
        title: "Inspect the sewer line",
        description:
          "Depending on the situation, a professional may use specialized inspection equipment to identify blockages, damage, roots, or structural problems.",
      },
      {
        title: "Determine the repair approach",
        description:
          "The appropriate solution can depend on the location and severity of the damage, pipe condition, accessibility, and property layout.",
      },
      {
        title: "Repair or replace the affected section",
        description:
          "The selected provider determines whether cleaning, localized repair, trenching, replacement, or another method is appropriate.",
      },
    ],

    localTitle: "Sewer Line Repair in Houston, TX",

    localText:
      "Sewer problems can be particularly disruptive because a blockage or damaged section may affect several fixtures at the same time. Houston properties vary in age and plumbing configuration, so the cause and repair method can differ from one property to another.",

    costTitle: "Sewer Line Repair Cost in Houston",

    costText:
      "Sewer repair costs vary considerably. The final price can depend on the location of the damaged pipe, depth, accessibility, pipe material, extent of damage, inspection requirements, labor, equipment, and whether repair or replacement is needed.",

    costFactors: [
      "Location and depth of the sewer line",
      "Extent and type of pipe damage",
      "Pipe material and existing plumbing configuration",
      "Inspection and diagnostic requirements",
      "Accessibility and excavation requirements",
      "Repair, replacement, or specialized installation method",
    ],

    faqs: [
      {
        question: "What are the signs that a sewer line needs repair?",
        answer:
          "Repeated backups, multiple slow drains, sewage odors, wastewater entering fixtures, and recurring problems after drain cleaning can indicate a sewer-line issue.",
      },
      {
        question: "Can a sewer line be repaired instead of replaced?",
        answer:
          "That depends on the condition, location, and extent of the damage. A plumbing professional can determine whether localized repair, replacement, or another method is appropriate.",
      },
      {
        question: "How much does sewer line repair cost in Houston?",
        answer:
          "Costs vary substantially based on the damaged section, accessibility, materials, labor, equipment, and repair method. A provider should evaluate the property before giving a specific estimate.",
      },
    ],
  },

  "drain-cleaning": {
    intro:
      "Piperesque helps Houston homeowners connect with independent plumbing professionals for clogged drains, recurring blockages, slow drainage, and other residential drain-cleaning needs.",

    urgencyTitle: "When Drain Cleaning May Be Necessary",

    urgencyText:
      "A slow or blocked drain can result from buildup, foreign material, grease, hair, roots, or a larger drainage problem. If the same drain repeatedly becomes clogged, the underlying cause may need to be investigated rather than repeatedly treating the symptom.",

    problemsTitle: "Common Drain Problems in Houston Homes",

    problems: [
      "Slow kitchen or bathroom drains",
      "Shower drains that repeatedly become blocked",
      "Toilets that clog frequently",
      "Multiple slow drains in the same property",
      "Recurring blockages after temporary clearing",
      "Unusual odors coming from drains",
    ],

    processTitle: "How Professional Drain Cleaning Works",

    process: [
      {
        title: "Identify the blocked fixture",
        description:
          "The provider determines which fixtures are affected and whether the problem appears isolated or connected to a larger drainage system.",
      },
      {
        title: "Assess the blockage",
        description:
          "The likely cause and location of the blockage are considered before selecting a cleaning method.",
      },
      {
        title: "Clear the drain",
        description:
          "Depending on the blockage, the provider may use appropriate mechanical or specialized drain-cleaning equipment.",
      },
      {
        title: "Investigate recurring problems",
        description:
          "If the blockage repeatedly returns, further assessment may be recommended to determine whether a deeper plumbing issue exists.",
      },
    ],

    localTitle: "Drain Cleaning in Houston, TX",

    localText:
      "Drain problems can range from a localized fixture blockage to an issue affecting a larger section of the drainage system. Houston homeowners should pay attention to recurring clogs, multiple slow drains, sewage odors, or backups because these symptoms can indicate a more significant problem.",

    costTitle: "Drain Cleaning Cost in Houston",

    costText:
      "Drain-cleaning prices vary based on the location and severity of the blockage, the equipment required, accessibility, labor, and whether additional inspection or repair is necessary.",

    costFactors: [
      "Location of the blockage",
      "Severity and type of obstruction",
      "Number of affected fixtures",
      "Equipment required to clear the drain",
      "Accessibility of the plumbing",
      "Whether inspection or additional repair is required",
    ],

    faqs: [
      {
        question: "When should I call a plumber for a clogged drain?",
        answer:
          "A professional assessment may be appropriate when a drain is severely blocked, repeatedly clogs, affects multiple fixtures, or is accompanied by sewage odors or wastewater backup.",
      },
      {
        question: "Why does my drain keep getting clogged?",
        answer:
          "Recurring clogs can result from buildup, foreign material, damaged piping, root intrusion, or a larger drainage problem. A professional can evaluate the underlying cause.",
      },
      {
        question: "How much does drain cleaning cost in Houston?",
        answer:
          "Pricing depends on the location and severity of the blockage, labor, equipment, accessibility, and whether additional inspection or repair is required.",
      },
    ],
  },

  "leak-detection": {
    intro:
      "Piperesque helps Houston homeowners connect with independent plumbing professionals for leak detection, hidden water leaks, unexplained moisture, water stains, and other plumbing problems where the source may not be immediately visible.",

    urgencyTitle: "Why Early Leak Detection Matters",

    urgencyText:
      "A hidden plumbing leak can continue for an extended period before the source becomes obvious. Water stains, unexplained moisture, unusual odors, changes in water usage, or recurring damp areas can justify a professional inspection.",

    problemsTitle: "Signs You May Have a Hidden Plumbing Leak",

    problems: [
      "Unexplained increases in water usage",
      "Water stains on walls, ceilings, or floors",
      "Damp or unusually wet areas around plumbing fixtures",
      "Musty or persistent moisture-related odors",
      "Sound of running water when fixtures are not being used",
      "Recurring leaks that appear to come back after repair",
    ],

    processTitle: "Professional Leak Detection Process",

    process: [
      {
        title: "Describe the symptoms",
        description:
          "Explain where you have noticed moisture, stains, sounds, odors, or changes in water usage.",
      },
      {
        title: "Inspect accessible plumbing",
        description:
          "The provider evaluates visible fixtures, connections, supply lines, drainage components, and other accessible areas.",
      },
      {
        title: "Locate the likely source",
        description:
          "Depending on the situation, specialized diagnostic methods may be used to identify a hidden leak without unnecessary disruption.",
      },
      {
        title: "Discuss repair options",
        description:
          "Once the source is identified, the provider can explain the appropriate repair or replacement options and expected scope of work.",
      },
    ],

    localTitle: "Leak Detection in Houston, TX",

    localText:
      "Houston properties differ in age, construction, plumbing layout, and previous repair history. A leak may originate from a fixture, supply line, drain connection, water heater, or plumbing located behind walls or beneath other surfaces. Accurate diagnosis is important before major repair work is authorized.",

    costTitle: "Leak Detection Cost in Houston",

    costText:
      "Leak-detection pricing depends on the complexity of the problem, accessibility, diagnostic equipment, labor, and the location of the suspected leak. Ask the provider whether a diagnostic or service fee applies before scheduling the inspection.",

    costFactors: [
      "Location and accessibility of the suspected leak",
      "Complexity of the plumbing system",
      "Diagnostic equipment required",
      "Labor and inspection time",
      "Whether the leak is visible or concealed",
      "Repair or replacement work required after detection",
    ],

    faqs: [
      {
        question: "How do I know if I have a hidden plumbing leak?",
        answer:
          "Water stains, unexplained moisture, unusual odors, unexpected water usage, sounds of running water, and recurring damp areas can be signs of a hidden leak.",
      },
      {
        question: "Can a plumber find a leak behind a wall?",
        answer:
          "Depending on the plumbing configuration and symptoms, a plumbing professional may use specialized diagnostic methods to help locate a concealed leak.",
      },
      {
        question: "How much does leak detection cost in Houston?",
        answer:
          "The cost varies according to the location and complexity of the suspected leak, accessibility, diagnostic equipment, and labor. Providers determine their own pricing.",
      },
    ],
  },

  "water-heater-repair": {
    intro:
      "Piperesque helps Houston homeowners connect with independent plumbing professionals for water-heater problems, including insufficient hot water, leaks, temperature issues, unusual noises, and other residential water-heating concerns.",

    urgencyTitle: "When to Consider Water Heater Repair",

    urgencyText:
      "A water heater can develop problems that range from reduced hot-water production to active leaks. Some issues may be related to components inside the unit, connections, temperature controls, sediment buildup, or the age and condition of the system.",

    problemsTitle: "Common Water Heater Problems",

    problems: [
      "Not enough hot water",
      "Water heater producing inconsistent temperatures",
      "Water leaking around the unit",
      "Unusual popping, banging, or other noises",
      "Water taking unusually long to become hot",
      "Visible corrosion or deterioration around connections",
    ],

    processTitle: "Water Heater Repair Process",

    process: [
      {
        title: "Identify the symptoms",
        description:
          "Describe the hot-water problem, when it started, and whether the unit is leaking or producing unusual sounds.",
      },
      {
        title: "Inspect the water heater",
        description:
          "The provider evaluates the unit, connections, controls, visible components, and surrounding plumbing.",
      },
      {
        title: "Determine the cause",
        description:
          "The diagnosis depends on the water heater type, age, condition, installation, and symptoms being reported.",
      },
      {
        title: "Repair or replacement options",
        description:
          "The provider explains whether repair, component replacement, maintenance, or complete water-heater replacement is appropriate.",
      },
    ],

    localTitle: "Water Heater Repair in Houston, TX",

    localText:
      "Water-heater problems can affect everyday household activities and may become more serious when the unit develops an active leak. Houston homes may use different water-heater types and configurations, so the correct repair depends on the specific equipment installed at the property.",

    costTitle: "Water Heater Repair Cost in Houston",

    costText:
      "Water-heater repair costs vary according to the equipment type, failed component, labor, accessibility, replacement parts, and whether the unit can be repaired or needs replacement. Ask for the diagnosis and expected repair scope before authorizing work.",

    costFactors: [
      "Type and age of the water heater",
      "Failed component or source of the problem",
      "Replacement parts and materials",
      "Labor and accessibility",
      "Diagnostic requirements",
      "Repair versus complete replacement",
    ],

    faqs: [
      {
        question: "Why is my water heater not producing enough hot water?",
        answer:
          "Possible causes vary by water-heater type and can include component problems, temperature settings, sediment, system capacity, or other equipment issues. A professional inspection can identify the likely cause.",
      },
      {
        question: "Should I repair or replace my water heater?",
        answer:
          "The appropriate choice depends on the unit's age, condition, failure type, repair cost, efficiency, and expected remaining service life. A provider can evaluate the equipment and explain the available options.",
      },
      {
        question: "How much does water heater repair cost in Houston?",
        answer:
          "Pricing depends on the water-heater type, failed component, parts, labor, accessibility, and whether repair or replacement is required.",
      },
    ],
  },
};
export default async function LocationServicePage({ params }: Props) {
  const { location, service } = await params;

  const city = locations.find((item) => item.slug === location);
  const plumbing = services.find((item) => item.slug === service);

  if (!city || !plumbing) {
    notFound();
  }

  const content = serviceContent[plumbing.slug];

  if (!content) {
    notFound();
  }

  const cityName = city.city;
  const stateName = city.stateCode;
  const serviceName = plumbing.shortTitle;

  const canonical =
    `${baseUrl}/location/${city.slug}/${plumbing.slug}`;

  const breadcrumbItems = [
    {
      name: "Home",
      url: baseUrl,
    },
    {
      name: cityName,
      url: `${baseUrl}/location/${city.slug}`,
    },
    {
      name: serviceName,
      url: canonical,
    },
  ];

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${serviceName} in ${cityName}, ${stateName}`,
    serviceType: serviceName,
    description: content.intro,
    url: canonical,
    areaServed: {
      "@type": "City",
      name: cityName,
      addressRegion: stateName,
      addressCountry: "US",
    },
    provider: {
      "@type": "Organization",
      name: "Piperesque",
      url: baseUrl,
    },
  };

  return (
    <>
      <Navbar />

      <main>
        {/* BREADCRUMB */}

        <section className="border-b border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-4">
            <nav
              aria-label="Breadcrumb"
              className="text-sm text-slate-600"
            >
              <ol className="flex flex-wrap items-center gap-2">
                <li>
                  <Link
                    href="/"
                    className="transition hover:text-slate-950"
                  >
                    Home
                  </Link>
                </li>

                <li aria-hidden="true">/</li>

                <li>
                  <Link
                    href={`/location/${city.slug}`}
                    className="transition hover:text-slate-950"
                  >
                    {cityName}
                  </Link>
                </li>

                <li aria-hidden="true">/</li>

                <li
                  className="font-medium text-slate-950"
                  aria-current="page"
                >
                  {serviceName}
                </li>
              </ol>
            </nav>
          </div>
        </section>

        {/* HERO */}

        <section className="bg-slate-950 text-white">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:py-24">
            <div className="max-w-4xl">
              <p className="mb-4 text-sm font-bold uppercase tracking-[0.18em] text-slate-300">
                {cityName}, {stateName}
              </p>

              <h1 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
                {serviceName} in {cityName}, {stateName}
              </h1>

              <p className="mt-6 max-w-3xl text-lg leading-8 text-slate-300">
                {content.intro}
              </p>

              <div className="mt-8">
                <a
                  href="tel:+18773640861"
                  className="inline-flex items-center justify-center rounded-xl bg-white px-6 py-4 font-bold text-slate-950 transition hover:bg-slate-100"
                >
                  Call for Plumbing Help
                </a>
              </div>

              <p className="mt-5 text-sm text-slate-400">
                Independent plumbing providers • Availability varies by
                location and provider
              </p>
            </div>
          </div>
        </section>

        {/* INTRODUCTION */}

        <section className="bg-white">
          <div className="mx-auto max-w-4xl px-6 py-16 lg:py-20">
            <p className="text-lg leading-8 text-slate-700">
              {content.intro}
            </p>
          </div>
        </section>

        {/* PRIMARY INFORMATION */}

        <section className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {content.urgencyTitle}
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-700">
                {content.urgencyText}
              </p>
            </div>
          </div>
        </section>

        {/* COMMON PROBLEMS */}

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {content.problemsTitle}
              </h2>

              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {content.problems.map((problem) => (
                  <li
                    key={problem}
                    className="rounded-2xl border border-slate-200 bg-white p-5 text-base font-semibold leading-7 text-slate-800 shadow-sm"
                  >
                    {problem}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* PROCESS */}

        <section className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {content.processTitle}
              </h2>

              <div className="mt-10 space-y-5">
                {content.process.map((step, index) => (
                  <article
                    key={step.title}
                    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
                  >
                    <div className="flex gap-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-950 text-sm font-black text-white">
                        {index + 1}
                      </div>

                      <div>
                        <h3 className="text-xl font-black text-slate-950">
                          {step.title}
                        </h3>

                        <p className="mt-2 leading-7 text-slate-700">
                          {step.description}
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* LOCAL SEO CONTENT */}

        <section className="bg-white">
          <div className="mx-auto max-w-4xl px-6 py-16 lg:py-20">
            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              {content.localTitle}
            </h2>

            <p className="mt-6 text-lg leading-8 text-slate-700">
              {content.localText}
            </p>

            <p className="mt-6 text-lg leading-8 text-slate-700">
              If the problem is recurring, affecting multiple fixtures, or
              causing visible water or wastewater damage, explain all of the
              symptoms to the plumbing professional. This can help the
              provider understand whether the issue may involve a larger
              part of the plumbing system.
            </p>
          </div>
        </section>

        {/* COST */}

        <section className="bg-slate-50">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                {content.costTitle}
              </h2>

              <p className="mt-6 text-lg leading-8 text-slate-700">
                {content.costText}
              </p>

              <h3 className="mt-10 text-2xl font-black text-slate-950">
                Factors That Can Affect Cost
              </h3>

              <ul className="mt-6 space-y-3">
                {content.costFactors.map((factor) => (
                  <li
                    key={factor}
                    className="flex gap-3 text-base leading-7 text-slate-700"
                  >
                    <span
                      aria-hidden="true"
                      className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-950"
                    />

                    <span>{factor}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 text-sm leading-7 text-slate-600">
                Pricing is informational only. Piperesque does not guarantee
                pricing, availability, response time, or workmanship. Any
                quote or service terms are determined by the independent
                plumbing provider.
              </div>
            </div>
          </div>
        </section>

        {/* INTERNAL SERVICE LINKS */}

        <section className="bg-white">
          <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
            <div className="max-w-4xl">
              <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
                More Plumbing Services in {cityName}
              </h2>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {services
                  .filter((item) => item.slug !== plumbing.slug)
                  .slice(0, 6)
                  .map((item) => (
                    <Link
                      key={item.slug}
                      href={`/location/${city.slug}/${item.slug}`}
                      className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-slate-400"
                    >
                      <h3 className="text-lg font-black text-slate-950">
                        {item.shortTitle} in {cityName}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        Learn about {item.shortTitle.toLowerCase()} services
                        and plumbing options in {cityName}.
                      </p>

                      <span className="mt-4 inline-block text-sm font-bold text-slate-950">
                        Learn more →
                      </span>
                    </Link>
                  ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}

        <section className="bg-slate-50">
          <div className="mx-auto max-w-4xl px-6 py-16 lg:py-20">
            <h2 className="text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Frequently Asked Questions
            </h2>

            <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
              {content.faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group p-6"
                >
                  <summary className="cursor-pointer list-none pr-8 text-lg font-black text-slate-950">
                    {faq.question}
                  </summary>

                  <p className="mt-4 leading-7 text-slate-700">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* CITY HUB */}

        <section className="bg-white">
          <div className="mx-auto max-w-4xl px-6 py-16 lg:py-20">
            <p className="text-sm font-bold uppercase tracking-[0.16em] text-slate-500">
              Plumbing Services in {cityName}, {stateName}
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">
              Explore Plumbing Services in {cityName}
            </h2>

            <p className="mt-5 text-lg leading-8 text-slate-700">
              Explore additional plumbing services and information for
              homeowners in {cityName}.
            </p>

            <Link
              href={`/location/${city.slug}`}
              className="mt-8 inline-flex rounded-xl bg-slate-950 px-6 py-4 font-bold text-white transition hover:bg-slate-800"
            >
              View {cityName} Plumbing Services
            </Link>
          </div>
        </section>

        {/* PHONE CTA */}

        <section className="bg-slate-950 text-white">
          <div className="mx-auto max-w-4xl px-6 py-16 text-center lg:py-20">
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-400">
              Plumbing Assistance
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
              Need {serviceName}?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
              Connect with an independent plumbing provider serving{" "}
              {cityName}, {stateName}.
            </p>

            <a
              href="tel:+18773640861"
              className="mt-8 inline-flex items-center justify-center rounded-xl bg-white px-7 py-4 font-black text-slate-950 transition hover:bg-slate-100"
            >
              Call (877) 364-0861
            </a>
          </div>
        </section>
      </main>

      <JsonLd schema={serviceSchema} />

      <BreadcrumbSchema items={breadcrumbItems} />

      <FAQSchema faqs={content.faqs} />

      <CTA />

      <Footer />
    </>
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
      title: "Page Not Found | Piperesque",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const content = serviceContent[plumbing.slug];

  if (!content) {
    return {
      title: "Page Not Found | Piperesque",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const title =
    `${plumbing.shortTitle} in ${city.city}, ${city.stateCode} | Piperesque`;

  const description =
    content.intro.length > 155
      ? `${content.intro.slice(0, 152).trimEnd()}...`
      : content.intro;

  const canonical =
    `${baseUrl}/location/${city.slug}/${plumbing.slug}`;

  return {
    title,
    description,

    alternates: {
      canonical,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Piperesque",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}