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
import LocalBusinessSchema from "@/components/seo/local-business-schema";

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

const serviceContent: Record<string, any> = {
  "emergency-plumbing": {
    heroBadge: "24/7 emergency response",
    intro: [
      "A plumbing emergency in Houston can turn into thousands of dollars in damage in a matter of hours. Burst pipes, severe leaks, sewer backups, and water heater failures do not happen at convenient times, which is why reliable emergency response matters. Homeowners in neighborhoods like Midtown, Bellaire, Spring Branch, and Sugar Land want an immediate answer, not a queue or a delay. The right emergency plumber shows up prepared, assesses the problem fast, and protects the home before damage spreads.",
      "Piperesque helps Houston homeowners connect with professionals who understand the urgency of these situations. Whether your home is dealing with active flooding, a failing water heater, or a clogged sewer line that is forcing wastewater back into the property, fast action prevents more expensive repairs. Houston homes are especially vulnerable to pipe pressure changes, aging infrastructure, and weather-related stress, which means small issues often escalate quickly if left unaddressed.",
      "That is why the best emergency response strategy is to act immediately, shut off the water if needed, and request service from a licensed plumber as soon as possible. The goal is not just to stop the leak or clear the blockage. The goal is to stop the damage, restore safe plumbing, and make sure the repair is done right the first time."
    ],
    warningSigns: [
      "Water suddenly surges from a pipe, ceiling, wall, or under-sink cabinet.",
      "A foul odor is coming from sinks, toilets, or the yard and could point to sewage backup.",
      "High water bills arrive without a clear reason, suggesting hidden leaks under slabs or inside walls.",
      "Water or sewage is backing up into tubs, toilets, or floor drains.",
      "You hear banging, hammering, or rushing sounds in the pipes when fixtures are turned on."
    ],
    repairProcess: [
      "Assess the emergency, isolate water flow, and identify the leak or blockage source.",
      "Protect the home by shutting off valves, moving items from flood zones, and stabilizing the area.",
      "Perform an on-site diagnosis with camera inspection, pressure testing, or leak detection tools when needed.",
      "Repair or replace the failed component with durable materials that match the system requirements.",
      "Test the system, explain follow-up recommendations, and provide a plan to reduce repeat issues."
    ],
    pricing: [
      { label: "Diagnostic + service call", value: "$120-$260" },
      { label: "Burst pipe repair", value: "$350-$1,800" },
      { label: "Main line leak repair", value: "$500-$2,400" },
      { label: "Sewer backup response", value: "$475-$2,100" },
      { label: "Water heater emergency repair", value: "$250-$1,400" }
    ],
    faqs: [
      { question: "What counts as a plumbing emergency in Houston?", answer: "A plumbing emergency includes active leaks, burst pipes, sewer backups, flooding, no hot water during a winter cold snap, or a major drop in pressure that threatens your home. If water is actively damaging your property, call immediately." },
      { question: "How fast can you respond?", answer: "Response time depends on call volume and geography. In Houston, many emergency calls can be addressed within 30 to 90 minutes, especially for urgent leaks and burst pipes." },
      { question: "Should I turn off the water before the plumber arrives?", answer: "If the leak is active or you see significant water flow, shut off the main water valve if it is safe to do so. This can reduce damage while the plumber is traveling." },
      { question: "Do emergency calls cost more?", answer: "Emergency service often includes after-hours rates, rapid dispatch, and urgent diagnosis. Pricing varies by repair type, labor, parts, and the scope of the damage." },
      { question: "Can a plumber fix a burst pipe the same day?", answer: "Often yes. Many burst pipe situations are repaired on the first visit if the pipe is accessible, but some jobs require valve replacement, rerouting, or a more involved repair that may take longer." },
      { question: "What if the issue is a sewer backup?", answer: "Do not keep flushing or running water. If sewage is backing up, call immediately and avoid using toilets, sinks, or tubs until the plumber confirms the blockage is cleared." },
      { question: "Is emergency plumbing available at night?", answer: "Yes. Reliable Houston plumbing professionals operate 24/7, including nights, weekends, and holidays for true emergencies." }
    ],
    overview: "Houston homeowners rely on a responsive emergency plumber when plumbing fails unexpectedly, especially during extreme weather, aging pipe issues, or sudden blockages. Fast diagnostics and immediate repairs protect the home and reduce long-term water damage."
  },
  "sewer-line-repair": {
    heroBadge: "sewer line specialists",
    intro: [
      "A sewer line problem is one of the most disruptive plumbing issues a Houston homeowner can face. When a main sewer line cracks, roots invade the line, or a section collapses, it can cause backups into toilets, tubs, showers, and floor drains. In older neighborhoods and homes with mature landscaping, this is a common cause of stress because the issue often builds slowly before becoming an emergency. Smells, gurgling drains, and slow water flow can all point to a hidden blockage or line failure below the slab or in the yard.",
      "Sewer line repair is not a job to treat casually. Traditional DIY methods may clear a clog for a short time, but they rarely solve the underlying condition if the line has collapsed, settled, or cracked. A proper repair starts with an inspection, often using a camera, to pinpoint the failure and determine whether a cleanout, spot repair, or full replacement is needed. In Houston, clay soil, shifting ground, and tree roots can all contribute to line deterioration, making accurate diagnosis even more important.",
      "The best repair strategy is to solve the root cause while protecting your yard and home structure. Whether the damage is a small cracked section or a complete lateral failure, homeowners should not ignore signs of sewer trouble. Delaying the repair can lead to recurring backups, more serious property damage, and poor sanitation. A fast and professional assessment reduces risk and keeps the repair as efficient as possible."
    ],
    warningSigns: [
      "Toilets or sinks are draining slowly for no clear reason.",
      "You hear gurgling sounds in multiple drains after flushing or running water.",
      "There is a strong sewer smell in the yard, bathroom, or utility area.",
      "Multiple fixtures are backing up at the same time.",
      "Your yard has a wet, spongy area or patches of unusually lush grass."
    ],
    repairProcess: [
      "Inspect the line with a sewer camera and identify whether the issue is a clog, crack, root intrusion, or collapsed section.",
      "Measure the damage and determine if the repair can be localized or if a full line replacement is necessary.",
      "Access the damaged section through the cleanout, yard, or a strategically cut opening to preserve the property when possible.",
      "Repair the pipe using trenchless or traditional methods based on location, age, and access conditions.",
      "Test the line, verify flow and pressure, and finish with recommendations for preventive maintenance and root control."
    ],
    pricing: [
      { label: "Camera inspection", value: "$150-$400" },
      { label: "Spot sewer repair", value: "$600-$2,800" },
      { label: "Trenchless lateral repair", value: "$2,000-$6,500" },
      { label: "Full sewer line replacement", value: "$4,000-$15,000+" },
      { label: "Root intrusion clearing", value: "$300-$1,600" }
    ],
    faqs: [
      { question: "How do I know my sewer line needs repair?", answer: "Recurring backups, slow drains, yard wet spots, and sewage odors are common warning signs. A sewer camera inspection confirms the exact issue before repair work begins." },
      { question: "Can sewer line repair be done without digging?", answer: "In many cases, plumbers can use trenchless methods to access and repair the damaged section without tearing up the entire yard. The best approach depends on pipe depth, material, and damage extent." },
      { question: "How long does sewer line repair usually take?", answer: "A localized repair may be completed in a day or two, while a full line replacement can take several days depending on access and materials." },
      { question: "What causes sewer line damage in Houston?", answer: "Root intrusion, shifting soil, corrosion, aging pipe material, and ground movement are common contributors. Houston's soil and tree growth can accelerate wear over time." },
      { question: "Will the yard be dug up?", answer: "Not always. Some repairs are trenchless and minimize surface disruption, but older homes or severe failures may require excavation. Your plumber should explain the options before starting work." },
      { question: "Can a clogged drain become a sewer line problem?", answer: "Yes. Multiple drains backing up together often indicate a blockage or structural issue in the main sewer line rather than a single fixture issue." },
      { question: "Is sewer line repair considered urgent?", answer: "If sewage is backing up into the home or a line is actively failing, it is urgent. Delay can quickly worsen sanitation and property damage." }
    ],
    overview: "The sewer line is the plumbing system's main exit, and when it fails, the entire home feels it. Professional diagnosis and a properly engineered repair plan keep your home safe and reduce the chance of repeat backups."
  },
  "drain-cleaning": {
    heroBadge: "drain experts",
    intro: [
      "Slow drains are often dismissed as minor inconveniences, but repeated clogging can hide a larger issue in the plumbing system. In Houston homes, kitchen sinks, bathroom drains, tubs, and main vertical stacks all deal with grease, hair, soap residue, and debris buildup over time. A sink that drains slower than usual may be an early sign of a blockage forming in the branch line, while a shower that backs up after heavy rain may point to an issue beyond the fixture itself.",
      "Professional drain cleaning is more than a quick plunge. Skilled plumbers remove built-up grease, hair, scale, and organic material without damaging the pipe. In some homes, the real cause is a deeper obstruction in the sewer line, which means a basic snaking service may not fix the problem. That is why experienced plumbers use professional tools such as drain snakes, hydro-jetting, and camera inspections to identify exactly what is happening before they clear it.",
      "Drain cleaning also protects your fixtures and keeps your home comfortable. When a drain is not fully clearing, it can cause odors, standing water, water backup, and even mold growth in the cabinet or shower area. A proactive cleaning can help maintain flow and reduce future emergency calls, especially in older Houston properties where pipes may have accumulated sediment or grease over many years."
    ],
    warningSigns: [
      "Water drains slowly after you run the faucet or flush the toilet.",
      "The sink or shower smells unpleasant or drains unevenly.",
      "Water comes back up through another fixture when one drain is used.",
      "Your kitchen drain is backing up after grease-heavy cooking.",
      "Toilet water remains high after flushing instead of draining normally."
    ],
    repairProcess: [
      "Identify the clogged fixture and inspect whether the issue is local or connected to a branch line or main sewer line.",
      "Use a drain snake or rotating tool to break up build-up and restore flow.",
      "For tougher obstructions, hydro-jetting can remove grease, soap, sludge, and mineral scale safely.",
      "Inspect the result to confirm the flow is fully restored and no deeper blockage remains.",
      "Provide prevention tips such as strainers, grease management, and routine maintenance guidance."
    ],
    pricing: [
      { label: "Kitchen or bathroom drain cleaning", value: "$120-$300" },
      { label: "Drain snaking service", value: "$150-$450" },
      { label: "Hydro-jetting", value: "$350-$1,200" },
      { label: "Sewer line drain clearing", value: "$400-$2,000" },
      { label: "Emergency clog response", value: "$200-$600" }
    ],
    faqs: [
      { question: "Is drain cleaning a plumbing emergency?", answer: "It can be if a drain is backing up into a shower, kitchen, or toilet or if multiple fixtures are affected. Active backups or sewage smells should be treated as urgent." },
      { question: "What is hydro-jetting?", answer: "Hydro-jetting uses high-pressure water to remove grease, mineral buildup, and debris from inside the pipe. It is effective for recurring clogs and stubborn buildups." },
      { question: "Can I use chemical drain cleaners?", answer: "Chemical cleaners can damage older pipes and often do not solve the underlying blockage. Mechanical cleaning or hydro-jetting is usually safer and more effective." },
      { question: "How often should I have drains cleaned?", answer: "It depends on usage and age. Households with heavy grease or hair buildup may benefit from routine cleaning every 12 to 24 months." },
      { question: "Why does one drain backup when another is in use?", answer: "This often points to a shared blockage in a branch line or main sewer line rather than a single fixture issue." },
      { question: "Do you handle kitchen and bathroom clogs?", answer: "Yes. We service kitchen sinks, bathroom sinks, showers, tubs, floor drains, and larger line clogs for residential homes and some commercial spaces." },
      { question: "What should I do before the plumber arrives?", answer: "Stop running water, remove standing water if it is safe, and avoid harsh drain chemicals. This helps protect the fixtures while you wait." }
    ],
    overview: "Drain cleaning is often the difference between a minor nuisance and a major plumbing issue. Timely service keeps the system flowing, stops odors and backups, and helps Houston homeowners avoid larger repair bills."
  },
  "leak-detection": {
    heroBadge: "hidden leak specialists",
    intro: [
      "Hidden leaks are silent destroyers. They often start behind walls, beneath slabs, around toilets, under kitchen cabinets, or near a water heater. A small leak can stay unnoticed for months while slowly raising water bills, reducing pressure, weakening drywall, and causing mold or deterioration in flooring and framing. In Houston properties, where older homes, slab foundations, and seasonal moisture changes all play a role, leak detection is a proactive service that often saves far more money than a delayed repair.",
      "The key is not just finding the leak but finding it accurately. A plumber with the right tools can use acoustic listening equipment, thermal readings, and pressure testing to locate hidden water flow without unnecessary demolition. That matters because many homeowners do not know the source is behind a cabinet, beneath a concrete slab, or inside a wall cavity until the damage has already spread.",
      "A good leak diagnosis also helps prevent unnecessary pipe replacement. Sometimes the issue is a loose connection, failed seal, or localized pipe damage. In other cases, the line has corroded or become compromised by shifting soil. Either way, accurate detection keeps the repair targeted, efficient, and less invasive. For homeowners who want to protect finishes, preserve indoor air quality, and reduce bill shock, leak detection is one of the most valuable plumbing services a Houston property can get."
    ],
    warningSigns: [
      "Your water bill is rising without a matching increase in usage.",
      "The floor, wall, or ceiling feels damp, soft, or stained.",
      "You hear water running when no fixtures are in use.",
      "There is musty odor near a cabinet, bathroom, or utility room.",
      "The foundation or slab feels unusually damp in a certain area."
    ],
    repairProcess: [
      "Conduct a visual inspection and review usage patterns, water pressure, and any recent damage signals.",
      "Use acoustic sensing, thermal imaging, or pressure diagnostics to narrow the leak location.",
      "Confirm the exact pipe or fitting, then plan a repair that minimizes invasive wall or slab work.",
      "Replace or repipe the damaged section using durable materials designed for residential use.",
      "Retest the system and help you monitor for recurrence or secondary issues."
    ],
    pricing: [
      { label: "Basic leak inspection", value: "$150-$350" },
      { label: "Slab leak detection", value: "$300-$900" },
      { label: "Wall or cabinet leak diagnosis", value: "$200-$600" },
      { label: "Leak repair", value: "$250-$2,000" },
      { label: "Pipe reroute or localized replacement", value: "$750-$4,000" }
    ],
    faqs: [
      { question: "How do plumbers find a hidden leak?", answer: "They use advanced equipment, pressure checks, and sometimes thermal or acoustic tools to trace the exact source without tearing open the home unnecessarily." },
      { question: "Is leak detection worth it?", answer: "Absolutely. Early detection prevents structural damage, mold issues, and expensive rework. It can be far less costly than repairing damage after the leak has spread." },
      { question: "Does a hidden leak always mean a pipe burst?", answer: "No. Many hidden leaks are caused by failing fittings, corrosion, pressure issues, or aging supply lines that develop slowly over time." },
      { question: "Can leak detection help protect my foundation?", answer: "Yes. Slab leaks and water intrusion can weaken the foundation and surrounding soil, so early detection helps protect your home's structural integrity." },
      { question: "Do you inspect under slabs?", answer: "Yes. Leak specialists can diagnose slab and underground leaks when the symptoms match the problem and the repair strategy is appropriate." },
      { question: "Will the plumber cut into walls right away?", answer: "Not necessarily. Modern leak detection methods often narrow the area before any invasive work is recommended, saving time and disruption." },
      { question: "What if the leak is in a wall?", answer: "A professional assessment can often determine whether a repair is achievable through the access point or whether a section of drywall or a pipe chase needs to be opened." }
    ],
    overview: "Leak detection is not about guesswork. It is a structured diagnosis process that helps Houston homeowners find water loss early, reduce property damage, and correct the issue before it affects the foundation or finishes."
  },
  "water-heater-repair": {
    heroBadge: "hot water solutions",
    intro: [
      "A failing water heater is one of the most disruptive home problems a family can face. A tank that stops heating, leaks near the base, or makes banging sounds can leave residents without hot water for showers, dishes, laundry, and cleaning. For Houston homeowners, hot water reliability matters year-round, and when a water heater fails, the needed repair often is time-sensitive. Whether the unit is a traditional tank model or a modern tankless system, the problem is easy to notice because the comfort and routine of the home are directly affected.",
      "Water heater service is not always a full replacement. Sometimes a pressure issue, failing thermostat, broken dip tube, sediment buildup, or worn heating element creates an obvious hot water problem that can be solved with targeted repair. Other situations call for replacement with a new, more efficient unit that better matches the home’s demand and energy needs. A licensed plumber can help weigh repair vs. replacement based on age, performance, and cost to run the unit long-term.",
      "Choosing the right repair starts with a diagnosis, not a guess. Houston homes differ widely in demand, plumbing layout, and the age of the system. A plumber can determine whether your hot water problem is isolated to the heater, the control system, or a broader issue in the plumbing network. That targeted diagnosis helps prevent expensive trial-and-error repairs and keeps the system operating efficiently."
    ],
    warningSigns: [
      "Your shower runs cold unexpectedly or hot water is inconsistent.",
      "The water heater is leaking around the base or from the pressure relief valve.",
      "You hear rumbling, banging, or popping sounds coming from the tank.",
      "Rusty or discolored water appears in the hot taps.",
      "The water heater is old and can no longer maintain temperature reliably."
    ],
    repairProcess: [
      "Inspect the unit, identify the failure mode, and determine whether the problem is a thermostat, heating element, pressure issue, or tank leak.",
      "Flush sediment, replace worn components, and verify the pressure and safety features are operating correctly.",
      "If repair is not cost-effective, recommend a replacement model that matches the household's hot water demand.",
      "Install the replacement or repair parts with correct venting, connections, and code compliance.",
      "Test the system, explain proper maintenance, and provide recommendations to extend the life of the unit."
    ],
    pricing: [
      { label: "Thermostat or element repair", value: "$180-$650" },
      { label: "Tank flush + maintenance", value: "$200-$500" },
      { label: "Pressure relief valve or fitting repair", value: "$250-$800" },
      { label: "Tank replacement", value: "$1,200-$3,500" },
      { label: "Tankless replacement", value: "$2,500-$7,500" }
    ],
    faqs: [
      { question: "How do I know if my water heater needs repair or replacement?", answer: "Age, corrosion, leaking, repeated repairs, and inconsistent hot water are all signs. A plumber can help compare repair costs to the value of a new unit." },
      { question: "Do you repair tankless water heaters?", answer: "Yes. Tankless systems can have scale buildup, flow issues, ignition problems, and sensor failures that require a diagnosis and component repair." },
      { question: "How long do water heaters normally last?", answer: "Traditional tank units often last 8 to 15 years, while tankless systems may last 15 to 20 years with proper maintenance." },
      { question: "Can sediment damage my heater?", answer: "Yes. Sediment buildup reduces efficiency and can cause overheating, noise, and premature wear on the tank or heating components." },
      { question: "Is a leaking water heater an emergency?", answer: "If the leak is active or the tank is failing, it should be addressed quickly because water damage can spread and the unit may continue to fail."
      },
      { question: "Do you install energy-efficient models?", answer: "Yes. Many homeowners choose a newer, more efficient unit when replacement becomes necessary to reduce utility costs and improve reliability." },
      { question: "How do I maintain my water heater?", answer: "Routine flushing, checking pressure settings, and monitoring for leaks or noise can extend the lifespan of the system and reduce emergency service needs." }
    ],
    overview: "Hot water is a daily necessity, and a failing water heater can disrupt every routine in the home. A smart repair or replacement plan improves reliability, reduces energy waste, and helps Houston homeowners avoid repeated interruptions."
  },
  "burst-pipe-repair": {
    heroBadge: "burst pipe emergency",
    intro: [
      "A burst pipe is one of the most urgent plumbing problems a Houston homeowner can face. When a supply line fails, water can flow quickly into cabinets, walls, ceilings, and floor areas, creating serious water damage in a short period. In homes built decades ago, aging galvanized or corroded lines may fail without warning, especially when pressure spikes or weather conditions stress the system. The difference between a small repair and a large restoration project often comes down to speed and knowing exactly which valve to shut off.",
      "Time matters in a burst pipe event because water keeps flowing until the main supply is controlled. A homeowner who notices active leaks should shut off the main water valve, move valuables away from the impact area, and call a licensed plumber immediately. Once the water is stopped, the next step is identifying the exact failure point and determining whether the damage is isolated to one pipe or if a larger section of plumbing needs attention.",
      "Professional burst pipe repair usually includes a diagnosis of the damaged line, an evaluation of surrounding materials, and a repair or replacement plan that restores water flow without creating repeat problems. Houston homeowners also benefit from having a plumber inspect nearby lines because a burst pipe often is a sign of broader aging, corrosion, or pressure issues in the system. Fixing only the visible break may not stop the next failure later down the line."
    ],
    warningSigns: [
      "You hear rushing water behind walls or under sinks when no fixtures are on.",
      "Water stains appear suddenly on ceilings, walls, or under cabinets.",
      "A pipe is visibly cracked, bulging, or leaking at a fitting.",
      "There is a sudden drop in water pressure or a shutoff that triggers unexpectedly.",
      "The water meter is running even when no water is being used."
    ],
    repairProcess: [
      "Shut off the main water supply and isolate the affected line to prevent further damage.",
      "Locate the failure point, assess the surrounding area, and check whether nearby pipes show corrosion or stress.",
      "Repair or replace the leaking section with code-compliant pipe material and durable fittings.",
      "Pressure test the line and confirm restoration of normal flow before closing the job.",
      "Explain preventive steps, including insulation, water pressure checks, and awareness of repeat stress points."
    ],
    pricing: [
      { label: "Emergency shutoff + diagnosis", value: "$150-$350" },
      { label: "Small pipe section repair", value: "$300-$1,200" },
      { label: "Burst pipe replacement", value: "$500-$2,500" },
      { label: "Main line or slab pipe repair", value: "$1,200-$6,000" },
      { label: "Water damage mitigation support", value: "$200-$1,500" }
    ],
    faqs: [
      { question: "What should I do immediately if a pipe bursts?", answer: "Turn off the main water supply, if it is safe to do so, and call for emergency plumbing help right away. The faster you stop the water, the less damage the home will sustain." },
      { question: "Can burst pipe repair be done the same day?", answer: "Often yes, especially when the damaged section is accessible and the plumber has the right parts available. More extensive damage may require a second visit if the line is difficult to reach." },
      { question: "Why do pipes burst in Houston homes?", answer: "Pressure changes, freezing nights, corrosion, age, and soil movement can create cracks and weakened sections. Even a small leak can eventually turn into a full pipe failure." },
      { question: "Will insurance cover a burst pipe?", answer: "Homeowners insurance may cover sudden water damage, but coverage often depends on the cause, timing, and the condition of the plumbing. It's smart to document the event and consult your policy." },
      { question: "Do you replace the whole line or just the damaged section?", answer: "The right repair depends on the pipe location, age, and whether the nearby lines show wear. A plumber may recommend a localized repair or a broader reroute to avoid repeat issues." },
      { question: "How can I reduce the chance of a burst pipe?", answer: "Insulate exposed pipes, monitor water pressure, replace old corroded lines, and address small leaks before they become major failures." },
      { question: "Can a burst pipe happen without visible water damage?", answer: "Yes. Some failures occur in walls or under slabs and may not be obvious until the drywall, flooring, or ceiling begins to show signs of water intrusion." }
    ],
    overview: "Burst pipe repair is a time-sensitive service because water damage escalates quickly. A fast diagnosis and a durable fix help Houston homeowners reduce risk, restore flow, and prevent repeat failures."
  }
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
      title: "Service Not Found",
    };
  }

  const serviceInfo = serviceContent[service.slug] ?? {};

  return {
    title: service.seoTitle,
    description: serviceInfo.metaDescription ?? service.metaDescription,
    keywords: service.keywords,
    robots: {
      index: true,
      follow: true,
    },
    category: "Plumbing Services",
    alternates: {
      canonical: `https://www.piperesque.com/services/${service.slug}`,
    },
    openGraph: {
      title: service.seoTitle,
      description: serviceInfo.metaDescription ?? service.metaDescription,
      url: `https://www.piperesque.com/services/${service.slug}`,
      type: "website",
      images: [
        {
          url: service.image,
          width: 1200,
          height: 630,
          alt: service.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: service.seoTitle,
      description: serviceInfo.metaDescription ?? service.metaDescription,
      images: [service.image],
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = services.find((item) => item.slug === slug);

  if (!service) {
    notFound();
  }

  const Icon = service.icon;
  const content = serviceContent[service.slug] ?? serviceContent["emergency-plumbing"];
  const currentIndex = services.findIndex((item) => item.slug === service.slug);
  const related = Array.from(
    { length: Math.min(3, services.length - 1) },
    (_, offset) => services[(currentIndex + offset + 1) % services.length]
  );

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.shortTitle,
    areaServed: {
      "@type": "City",
      name: "Houston",
      addressRegion: "TX",
    },
    provider: {
      "@type": "LocalBusiness",
      name: siteConfig.company,
      telephone: siteConfig.phone,
      url: siteConfig.website,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Houston",
        addressRegion: "TX",
        addressCountry: "US",
      },
    },
    offers: {
      "@type": "Offer",
      priceRange: "$$",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <main className="overflow-x-hidden bg-white">
      <BreadcrumbSchema
        items={[
          { name: "Home", url: "https://www.piperesque.com" },
          { name: "Services", url: "https://www.piperesque.com/services" },
          { name: service.shortTitle, url: `https://www.piperesque.com/services/${service.slug}` },
        ]}
      />
      <LocalBusinessSchema city={{ name: "Houston", slug: "houston", county: "Harris County", state: "Texas", zipCodes: ["77002"] }} />
      <JsonLd schema={serviceSchema} />
      <FAQSchema faqs={content.faqs} />
      <Navbar />

      <section className="relative overflow-hidden py-24 md:py-28">
        <Image src={service.image} alt={service.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-blue-950/85" />
        <div className="container-custom relative z-10">
          <div className="max-w-5xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.18em] text-blue-100">
              <Sparkles size={14} className="text-blue-300" />
              {content.heroBadge}
            </span>
            <h1 className="mt-6 text-5xl font-black leading-tight text-white md:text-6xl">
              {service.heroTitle}
            </h1>
            <p className="mt-6 max-w-3xl text-xl leading-9 text-blue-100">
              {service.heroDescription}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href={`tel:${siteConfig.phone}`} className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-4 text-base font-black text-white shadow-xl transition hover:bg-red-700">
                <Phone size={18} />
                Call {siteConfig.phoneDisplay}
              </a>
              <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/40 bg-white/10 px-7 py-4 text-base font-bold text-white transition hover:bg-white hover:text-blue-950">
                Request Service
              </Link>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <Clock3 className="mb-3 text-green-400" size={24} />
                <p className="font-bold text-white">30-90 min response</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <ShieldCheck className="mb-3 text-green-400" size={24} />
                <p className="font-bold text-white">Licensed professionals</p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur">
                <MapPin className="mb-3 text-green-400" size={24} />
                <p className="font-bold text-white">Houston-area service</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-24">
        <div className="container-custom grid gap-12 lg:grid-cols-[1.6fr_0.9fr]">
          <div>
            <div className="mb-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
                <BadgeCheck size={16} />
                {service.shortTitle} overview
              </span>
              <h2 className="mt-6 text-4xl font-black text-slate-900 md:text-5xl">
                {service.title}
              </h2>
            </div>

            {content.intro.map((paragraph: string, index: number) => (
              <p key={index} className="mt-6 text-lg leading-9 text-slate-600">
                {paragraph}
              </p>
            ))}

            <div className="mt-12 rounded-[30px] border border-slate-200 bg-slate-50 p-8">
              <h3 className="text-3xl font-black text-slate-900">Warning signs to act on fast</h3>
              <div className="mt-8 space-y-4">
                {content.warningSigns.map((item: string) => (
                  <div key={item} className="flex items-start gap-4 rounded-2xl bg-white p-4">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-red-100 text-red-600">
                      <AlertTriangle size={16} />
                    </div>
                    <p className="text-base leading-7 text-slate-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-14 rounded-[30px] border border-blue-200 bg-blue-50 p-8">
              <h3 className="text-3xl font-black text-slate-900">Typical pricing in Houston</h3>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {content.pricing.map((item: { label: string; value: string }) => (
                  <div key={item.label} className="rounded-2xl border border-blue-100 bg-white p-5">
                    <div className="text-sm font-bold uppercase tracking-[0.15em] text-slate-500">{item.label}</div>
                    <div className="mt-3 text-2xl font-black text-blue-700">{item.value}</div>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-base leading-7 text-slate-600">
                Final costs vary based on pipe material, access, labor, and whether the repair involves additional damage mitigation or replacement parts. A professional inspection gives the clearest estimate before work begins.
              </p>
            </div>

            <div className="mt-14">
              <h3 className="text-3xl font-black text-slate-900">Our repair process</h3>
              <div className="mt-8 space-y-5">
                {content.repairProcess.map((step: string, index: number) => (
                  <div key={step} className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-lg font-black text-white">
                      {index + 1}
                    </div>
                    <p className="text-lg leading-8 text-slate-700">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-14 rounded-[30px] bg-slate-900 p-8 text-white">
              <h3 className="text-3xl font-black">Why Houston homeowners call early</h3>
              <p className="mt-5 text-lg leading-9 text-slate-300">
                Early action prevents bigger repairs and keeps your family comfortable. In a city where home systems work hard throughout the year, a quick diagnosis and a durable repair can reduce long-term costs, prevent additional water damage, and keep your plumbing operating reliably for years.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a href={`tel:${siteConfig.phone}`} className="inline-flex items-center gap-2 rounded-full bg-red-600 px-7 py-4 font-black text-white transition hover:bg-red-700">
                  <Phone size={18} />
                  Talk to a plumber now
                </a>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/20 px-7 py-4 font-bold text-white transition hover:bg-white hover:text-slate-900">
                  Request a quote
                </Link>
              </div>
            </div>
          </div>

          <aside className="lg:pt-10">
            <div className="sticky top-28 rounded-[32px] border border-slate-200 bg-slate-50 p-8 shadow-lg">
              <div className="inline-flex items-center gap-2 rounded-full bg-red-100 px-3 py-2 text-xs font-black uppercase tracking-[0.15em] text-red-700">
                <Clock3 size={14} />
                Same-day response
              </div>
              <h3 className="mt-6 text-2xl font-black text-slate-900">Need help now?</h3>
              <p className="mt-4 leading-8 text-slate-600">
                We help Houston homeowners connect with local plumbing professionals for quick diagnostics, urgent repair planning, and dependable follow-up support.
              </p>
              <div className="mt-8 space-y-4 text-sm text-slate-700">
                <div className="flex items-center gap-3"><Wrench size={18} className="text-blue-600" /> Fast assessment</div>
                <div className="flex items-center gap-3"><ShieldCheck size={18} className="text-blue-600" /> Licensed professionals</div>
                <div className="flex items-center gap-3"><MapPin size={18} className="text-blue-600" /> Houston-area coverage</div>
              </div>
              <a href={`tel:${siteConfig.phone}`} className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-4 font-black text-white transition hover:bg-blue-700">
                <Phone size={18} />
                {siteConfig.phoneDisplay}
              </a>
              <Link href="/contact" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full border border-slate-300 bg-white px-6 py-4 font-bold text-slate-900 transition hover:border-blue-600 hover:text-blue-700">
                Request service quote
              </Link>
              <div className="mt-8 rounded-2xl bg-white p-5">
                <div className="text-sm font-bold uppercase tracking-[0.15em] text-slate-500">Related services</div>
                <ul className="mt-4 space-y-3 text-slate-700">
                  {related.map((item) => (
                    <li key={item.slug}>
                      <Link href={`/services/${item.slug}`} className="inline-flex items-center gap-2 hover:text-blue-700">
                        <ChevronRight size={16} />
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

      <section className="pb-20">
        <div className="container-custom max-w-5xl">
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-lg md:p-10">
            <h3 className="text-3xl font-black text-slate-900">Common questions about {service.shortTitle.toLowerCase()}</h3>
            <div className="mt-8 space-y-6">
              {content.faqs.map((faq: { question: string; answer: string }) => (
                <div key={faq.question} className="border-b border-slate-200 pb-6 last:border-b-0 last:pb-0">
                  <h4 className="text-xl font-bold text-slate-900">{faq.question}</h4>
                  <p className="mt-3 text-base leading-8 text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="container-custom">
          <div className="rounded-[32px] bg-gradient-to-r from-blue-700 to-sky-700 p-10 text-white shadow-2xl">
            <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-bold uppercase tracking-[0.15em] text-blue-100">
                  <ArrowRight size={14} />
                  Houston plumbing support
                </div>
                <h3 className="mt-5 text-3xl font-black md:text-5xl">Ready to fix the problem before it gets worse?</h3>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href={`tel:${siteConfig.phone}`} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-4 font-black text-blue-700 transition hover:bg-slate-100">
                  <Phone size={18} />
                  {siteConfig.phoneDisplay}
                </a>
                <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/30 px-6 py-4 font-bold text-white transition hover:bg-white hover:text-blue-700">
                  Contact us
                </Link>
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