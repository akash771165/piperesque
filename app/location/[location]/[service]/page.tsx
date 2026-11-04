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



const supportedServices = services.map((s) => s.slug);

export const dynamicParams = false;

export function generateStaticParams() {
  const routes: { location: string; service: string }[] = [];
  for (const loc of locations) {
    for (const s of supportedServices) {
      routes.push({
        location: loc.slug,
        service: s,
      });
    }
  }
  return routes;
}



const serviceContent: Record<string, ServiceContent> = {

  "emergency-plumbing": {

    intro:

      "Piperesque helps Houston homeowners connect with independent plumbing professionals for urgent plumbing problems, including burst pipes, major leaks, sewer backups, overflowing fixtures, water-heater leaks, and other situations that may require prompt attention.",



    urgencyTitle: "When You May Need Emergency Plumbing in Houston",



    urgencyText:

      "A plumbing emergency is generally a problem that can cause active water damage, wastewater exposure, loss of essential plumbing service, or additional property damage if it is not addressed promptly. The right response depends on the source of the problem, the affected plumbing system, and the severity of the situation.",



    problemsTitle: "Common Emergency Plumbing Problems in Houston",



    problems: [

      "Burst or rapidly leaking water pipes",

      "Sewage backup or wastewater entering the property",

      "Overflowing toilets that cannot be cleared normally",

      "Major leaks around fixtures, valves, or plumbing connections",

      "Sudden loss of water caused by a plumbing-system problem",

      "Water heater leaks causing active water damage",

      "Multiple drains backing up at the same time",

      "Water accumulating around plumbing fixtures or equipment",

    ],



    processTitle: "What to Expect From an Emergency Plumbing Service",



    process: [

      {

        title: "Describe the emergency",

        description:

          "Explain what happened, where the problem is located, which fixtures are affected, and whether water or wastewater is actively causing damage.",

      },

      {

        title: "Stop or reduce water use",

        description:

          "If it is safe to do so, stop using the affected fixture and minimize additional water entering the plumbing system while waiting for professional assistance.",

      },

      {

        title: "Initial assessment",

        description:

          "A plumbing professional can evaluate the visible symptoms and identify the likely source of the plumbing problem.",

      },

      {

        title: "Discuss repair options",

        description:

          "Before authorizing significant work, ask about the diagnosis, repair scope, parts, labor, and applicable service or diagnostic charges.",

      },

      {

        title: "Complete the necessary repair",

        description:

          "The selected provider determines the appropriate repair, replacement, cleaning, or other service based on the condition of the plumbing system.",

      },

      {

        title: "Test the plumbing",

        description:

          "After the work is completed, the provider should verify that the affected plumbing is operating as expected and explain any additional recommendations.",

      },

    ],



    localTitle: "Emergency Plumbing Problems in Houston, TX",



    localText:

      "Houston properties vary in age, construction, plumbing configuration, and maintenance history. Emergency problems may involve water supply lines, fixtures, drainage systems, sewer lines, or water-heating equipment. A prompt professional assessment can help determine whether the problem is isolated or connected to a larger plumbing issue.",



    costTitle: "Emergency Plumbing Cost in Houston",



    costText:

      "Emergency plumbing pricing varies by provider and depends on the type and severity of the problem, time of service, labor, materials, accessibility, equipment, and whether repair or replacement is required. Ask the provider about applicable diagnostic or service fees and understand the expected scope of work before authorizing repairs.",



    costFactors: [

      "Type and severity of the plumbing emergency",

      "Time of day and emergency-service availability",

      "Parts and replacement materials",

      "Accessibility of the affected plumbing",

      "Labor and specialized equipment",

      "Inspection or diagnostic requirements",

      "Repair versus replacement requirements",

      "Extent of water or wastewater damage",

    ],



    faqs: [

      {

        question: "What is considered a plumbing emergency in Houston?",

        answer:

          "Major leaks, burst pipes, sewage backups, severe overflows, water-heater leaks, and plumbing problems causing active property damage may require prompt professional attention.",

      },

      {

        question: "What should I do during a plumbing emergency?",

        answer:

          "Stop using the affected fixture and minimize additional water use when possible. If it is safe to do so, shut off the appropriate water supply and keep people away from contaminated wastewater.",

      },

      {

        question: "How quickly can an emergency plumber respond in Houston?",

        answer:

          "Response times depend on provider availability, current demand, traffic, location, and the severity of the plumbing problem. Ask the provider for an expected arrival window.",

      },

      {

        question: "How much does emergency plumbing cost in Houston?",

        answer:

          "The cost depends on the plumbing problem, labor, materials, accessibility, equipment, timing, and whether repair or replacement is necessary. Providers determine their own pricing.",

      },

      {

        question: "Should I use chemical drain cleaner during a plumbing emergency?",

        answer:

          "Avoid mixing chemical drain cleaners or repeatedly using harsh chemicals when a serious blockage is present. Chemical residue can create hazardous conditions and may not address the underlying plumbing problem.",

      },

      {

        question: "What if several drains are backing up at the same time?",

        answer:

          "Multiple affected fixtures can indicate a blockage farther down a shared drain or sewer system. Minimize water use and have the plumbing system professionally evaluated.",

      },

      {

        question: "Can a plumbing leak cause serious property damage?",

        answer:

          "Yes. A continuing leak can damage floors, walls, ceilings, cabinets, and personal property. If active water damage is occurring, reducing water flow and seeking prompt professional assistance can help limit further damage.",

      },

      {

        question: "Does Piperesque perform the plumbing repair?",

        answer:

          "Piperesque helps homeowners connect with independent plumbing professionals. Availability, pricing, workmanship, and service terms are determined by the selected provider.",

      },

    ],

  },



  "sewer-line-repair": {

    intro:

      "Piperesque helps Houston homeowners explore sewer line repair, sewer line replacement, sewer backups, and inspection options, and connect with independent plumbing professionals. The right solution depends on the location and condition of the damaged pipe and should be confirmed by an on-site assessment.",



    urgencyTitle: "Sewer Line Problems Should Not Be Ignored",



    urgencyText:

      "A blocked, cracked, collapsed, or root-damaged sewer line can affect several fixtures and may allow wastewater to back up into a home. If multiple drains are slow, sewage odors keep returning, or backups happen again after cleaning, the problem may be farther down the sewer line rather than in one fixture. These symptoms are reasons to arrange an assessment; they do not by themselves confirm the exact fault.",



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

      "For Houston, TX homeowners, sewer-line symptoms can come from a localized blockage, a damaged pipe section, root intrusion, a misaligned joint, or another drainage-system issue. Several fixtures backing up at once can point to a shared drain or sewer-line problem, but inspection is needed to identify the cause. Ask the provider what the inspection found, which section is affected, and why the proposed repair method fits the condition of the pipe. Do not assume every backup requires full sewer-line replacement.",



    costTitle: "Sewer Line Repair Cost in Houston",



    costText:

      "Sewer line repair cost in Houston varies by the problem and the property. Price can depend on inspection findings, pipe depth and material, access to the damaged section, excavation needs, labor and equipment, permits where applicable, and whether a spot repair, pipe rehabilitation, or replacement is recommended. Because these details vary, an on-site diagnosis is more reliable than a generic online price. Request a written estimate that separates diagnosis, labor, materials, restoration, and any additional charges.",



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
        question: "What are the common signs of a sewer line problem?",
        answer:
          "Warning signs can include repeated backups, several slow drains, sewage odors, wastewater coming up through a tub or floor drain, or blockages that return after cleaning. These symptoms can have more than one cause, so an inspection is needed to confirm the source.",
      },
      {
        question: "Do I need sewer line repair or full replacement?",
        answer:
          "Not every sewer problem requires full replacement. A provider should explain the inspection findings, the length and condition of the damaged section, and whether a localized repair, cleaning, rehabilitation, or replacement is suitable. Ask why the recommended option is appropriate for your pipe.",
      },
      {
        question: "How much does sewer line repair cost in Houston, TX?",
        answer:
          "There is no single price that applies to every property. Cost depends on the fault, pipe depth and access, inspection results, materials, labor, equipment, excavation, restoration, and repair method. Request a written estimate after the provider assesses the line.",
      },
      {
        question: "What should I do if sewage is backing up into my home?",
        answer:
          "Stop using water-connected fixtures as much as practical, keep people and pets away from wastewater, and contact a qualified plumbing professional. Avoid contact with sewage and do not use chemical drain cleaners to try to resolve a suspected main sewer-line problem.",
      },
      {
        question: "Can a sewer line be repaired without digging up the whole yard?",
        answer:
          "Sometimes. The available approach depends on the pipe condition, location, access, and the provider's inspection. Ask whether a localized or less-invasive method is appropriate, and have the provider explain its limitations and expected restoration work.",
      },
      {
        question: "Why do sewer backups keep coming back after drain cleaning?",
        answer:
          "A recurring backup may mean the underlying cause was not removed or that there is damage, root intrusion, a misaligned section, or another issue farther along the line. A sewer-line inspection can help distinguish a temporary blockage from a structural problem.",
      },
      {
        question: "Does Piperesque perform sewer line repairs?",
        answer:
          "No. Piperesque is an informational website that helps homeowners connect with independent third-party plumbing providers. Service availability, diagnosis, pricing, workmanship, and terms are determined by the provider you choose.",
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
  "pipe-repair": {
    intro:
      "Piperesque connects homeowners with independent plumbing professionals for damaged, corroded, leaking, or burst residential pipes throughout Greater Houston.",
    urgencyTitle: "Signs You Need Professional Pipe Repair",
    urgencyText:
      "A damaged or leaking pipe can cause sudden water damage, mold growth, reduced water pressure, or structural deterioration. Timely inspection helps isolate pipe issues before widespread damage occurs.",
    problemsTitle: "Common Pipe Problems in Houston Homes",
    problems: [
      "Pinhole leaks in copper or galvanized supply lines",
      "Cracked or bursting pipes during sudden cold snaps",
      "Visible corrosion, rust, or mineral scaling on exposed piping",
      "Unexplained drops in household water pressure",
      "Damp drywall, warped baseboards, or water stains on ceilings",
      "Banging, vibrating, or whistling sounds within the plumbing system",
    ],
    processTitle: "Pipe Repair & Replacement Process",
    process: [
      {
        title: "Isolate the water supply",
        description: "Shut off water supply to stop active leaks and prevent further water intrusion.",
      },
      {
        title: "Inspect and locate damage",
        description: "Assess accessible and hidden pipe sections to identify the leak or pipe failure.",
      },
      {
        title: "Recommend repair method",
        description: "Explain whether localized pipe patching, sectional replacement, or repiping is recommended.",
      },
      {
        title: "Execute repair and test",
        description: "Complete the pipe repair using quality fittings and pressure test the system to verify integrity.",
      },
    ],
    localTitle: "Residential Pipe Repair in the Houston Area",
    localText:
      "Houston homes often feature a mix of copper, CPVC, PEX, and older galvanized supply lines. Soil movement and temperature shifts can stress joints and cause fittings to fail. Local plumbing professionals assess pipe condition and recommend durable repairs.",
    costTitle: "Pipe Repair Costs in Houston, TX",
    costText:
      "The cost of repairing or replacing residential pipes depends on pipe material, accessibility behind walls or slabs, repair technique, and the extent of pipe damage.",
    costFactors: [
      "Location and accessibility of the damaged pipe",
      "Pipe material (copper, PEX, CPVC, galvanized)",
      "Extent of damage (single pinhole vs. cracked section)",
      "Drywall, slab, or ceiling access requirements",
      "Labor, permits, and diagnostic inspection",
    ],
    faqs: [
      {
        question: "How quickly should a leaking pipe be repaired?",
        answer:
          "Active pipe leaks should be addressed as quickly as possible. Shut off the water supply to the affected line or the entire house to prevent structural damage while arranging professional repair.",
      },
      {
        question: "Can a cracked pipe be patched or does it need replacement?",
        answer:
          "Temporary clamps or wraps may hold briefly, but licensed plumbers typically recommend cutting out the damaged section and installing a new replacement section or fitting for lasting security.",
      },
      {
        question: "What causes pipes to burst or leak in Houston?",
        answer:
          "Common causes include water pressure spikes, corrosion in older pipes, shifting expansive clay soils, age-related joint deterioration, and occasional winter freezes.",
      },
      {
        question: "Does Piperesque repair pipes directly?",
        answer:
          "No. Piperesque is an independent referral directory and does not provide direct plumbing repairs. We connect homeowners with qualified, independent plumbing contractors.",
      },
    ],
  },
  "toilet-repair": {
    intro:
      "Piperesque connects homeowners with local plumbing professionals for toilet repairs, continuous running, clogs, leaks, and fixture replacements across Greater Houston.",
    urgencyTitle: "When to Call for Toilet Repair",
    urgencyText:
      "A toilet that constantly runs can waste hundreds of gallons of water per day, while leaks around the base can compromise flooring and subfloor structures. Prompt repair protects your home and lowers water bills.",
    problemsTitle: "Common Toilet Issues in Residential Homes",
    problems: [
      "Toilet runs continuously or cycles on and off without being used",
      "Water leaking around the base of the toilet onto the bathroom floor",
      "Weak, incomplete, or sluggish flushing action",
      "Persistent clogs that do not respond to a standard plunger",
      "Cracked porcelain bowl, tank, or broken fill/flush valve components",
      "Wobbling or unstable toilet mounting on the bathroom floor flange",
    ],
    processTitle: "Professional Toilet Repair Process",
    process: [
      {
        title: "Initial diagnosis",
        description: "Evaluate flush mechanism, flapper, fill valve, wax seal, and supply lines.",
      },
      {
        title: "Determine cause",
        description: "Identify whether the issue is a worn internal part, clogged drain line, or failed wax ring.",
      },
      {
        title: "Perform repair or replacement",
        description: "Install replacement parts or reset the toilet with a new wax ring and brass mounting hardware.",
      },
      {
        title: "Test operation",
        description: "Check flush performance, fill level, and seal tightness to confirm leak-free operation.",
      },
    ],
    localTitle: "Toilet Repair Services in Houston Communities",
    localText:
      "From historic bungalows in the Heights to modern suburban residences across Katy and Sugar Land, toilet problems can quickly cause bathroom disruptions. Local plumbers carry common replacement components for swift resolution.",
    costTitle: "Toilet Repair Pricing Factors",
    costText:
      "Simple toilet repairs such as replacing a flapper or fill valve are generally low cost, while pulling and resetting a toilet, repairing a cracked flange, or installing a replacement toilet involves more labor and parts.",
    costFactors: [
      "Type of repair (valve replacement, wax ring reset, flange repair)",
      "Cost of replacement parts or new toilet fixture",
      "Accessibility and floor condition under the toilet",
      "Drain line clearing if a clog extends past the toilet trap",
    ],
    faqs: [
      {
        question: "Why is my toilet constantly running?",
        answer:
          "A running toilet is usually caused by a worn flapper that no longer seals properly, an improperly adjusted float, or a malfunctioning fill valve that allows water to continually overflow into the drain tube.",
      },
      {
        question: "What does water around the toilet base mean?",
        answer:
          "Water pooling around the base usually indicates a failed wax ring seal, loose closet bolts, a cracked toilet base, or condensation. A failing wax ring should be replaced promptly to prevent subfloor rot.",
      },
      {
        question: "Is it better to repair or replace an old toilet?",
        answer:
          "If the porcelain is in good condition and only internal valves or seals have failed, repair is often cost-effective. If the toilet frequently clogs, has cracked porcelain, or is an inefficient older high-flow model, replacement may be preferable.",
      },
    ],
  },
  "faucet-repair": {
    intro:
      "Piperesque helps homeowners find independent plumbing professionals for leaking, dripping, corroded, or malfunctioning kitchen and bathroom faucets.",
    urgencyTitle: "Why Prompt Faucet Repair Matters",
    urgencyText:
      "Even a small drip can waste thousands of gallons of water each year and cause unsightly calcium buildup or mineral staining. Left unchecked, under-sink leaks can cause extensive cabinetry and drywall damage.",
    problemsTitle: "Common Faucet and Fixture Problems",
    problems: [
      "Persistent dripping from the spout when turned off",
      "Leaks around the faucet base or handle when in use",
      "Under-sink moisture or dripping from supply lines and shutoff valves",
      "Low water pressure restricted to one specific faucet",
      "Squeaking, sticking, or loose faucet handles",
      "Corrosion, mineral buildup, or spraying aerators",
    ],
    processTitle: "Faucet Inspection and Repair Steps",
    process: [
      {
        title: "Inspect faucet and connections",
        description: "Examine cartridges, O-rings, supply lines, and shutoff valves for leaks or wear.",
      },
      {
        title: "Disassemble fixture",
        description: "Remove handles and valve cartridge to check for internal wear, debris, or damaged seals.",
      },
      {
        title: "Replace worn components",
        description: "Install matching OEM cartridges, washers, seals, or supply lines.",
      },
      {
        title: "Reassemble and verify",
        description: "Restore water pressure, check for leaks under pressure, and confirm smooth operation.",
      },
    ],
    localTitle: "Houston Area Faucet & Fixture Services",
    localText:
      "Hard water minerals present in parts of the Houston water supply can contribute to premature cartridge wear and limescale buildup. Independent plumbing professionals can service popular brands and replace failing fixtures.",
    costTitle: "Faucet Repair & Replacement Costs",
    costText:
      "Repairing a faucet typically involves replacement cartridges, O-rings, and labor. If the fixture is heavily corroded, replacing the faucet assembly may offer better long-term reliability.",
    costFactors: [
      "Fixture type (single handle, widespread, pull-down, wall-mount)",
      "Brand and availability of replacement cartridges",
      "Extent of corrosion or access difficulty under the sink",
      "Condition of underlying angle stops and supply lines",
    ],
    faqs: [
      {
        question: "Can a dripping faucet cause damage?",
        answer:
          "A spout drip generally causes water waste and staining in the sink basin. However, leaks beneath the faucet deck or under the sink can soak cabinets, ruin flooring, and encourage hidden mold growth.",
      },
      {
        question: "Why is water leaking under my kitchen sink?",
        answer:
          "Under-sink leaks commonly stem from worn supply lines, leaking shutoff valves, loose drain slip joints, or water seeping down through the faucet base seal.",
      },
      {
        question: "Should I replace the faucet or repair it?",
        answer:
          "If the fixture is relatively new and high quality, replacing cartridges or O-rings is usually straightforward. If the finish is pitted or internal components are frozen with corrosion, full replacement is often recommended.",
      },
    ],
  },
  "commercial-plumbing": {
    intro:
      "Piperesque connects Houston business owners, facility managers, and commercial property owners with independent commercial plumbing contractors for reliable maintenance and urgent repairs.",
    urgencyTitle: "Keeping Business Operations Running Smoothly",
    urgencyText:
      "Plumbing failures in commercial properties can halt business operations, create health code violations, and damage inventory. Reliable commercial plumbing service resolves issues quickly with minimal customer disruption.",
    problemsTitle: "Common Commercial Plumbing Challenges",
    problems: [
      "Restroom fixture failures and high-volume toilet/urinal clogs",
      "Commercial kitchen grease trap backups and drain blockages",
      "Commercial water heater and boiler malfunctions",
      "Backflow preventer testing, maintenance, and certification",
      "Water line leaks affecting tenant spaces and common areas",
      "Sewer main line backups disrupting business operations",
    ],
    processTitle: "Commercial Plumbing Service Workflow",
    process: [
      {
        title: "Rapid assessment",
        description: "Inspect commercial plumbing systems to evaluate the problem and operational impacts.",
      },
      {
        title: "Clear proposal",
        description: "Provide commercial-grade repair recommendations and coordinate scheduling to minimize downtime.",
      },
      {
        title: "Code-compliant execution",
        description: "Perform repairs meeting commercial building codes, municipal standards, and OSHA safety guidelines.",
      },
      {
        title: "Verification and sign-off",
        description: "Test system under load and provide documentation for maintenance records.",
      },
    ],
    localTitle: "Commercial Plumbing Across the Greater Houston Metro",
    localText:
      "From retail storefronts along Westheimer to commercial offices and industrial facilities across Harris and Fort Bend counties, commercial plumbing demands robust materials and prompt response times.",
    costTitle: "Commercial Plumbing Pricing Overview",
    costText:
      "Commercial plumbing costs reflect system scale, specialized commercial components, after-hours requirements, and adherence to municipal commercial plumbing codes.",
    costFactors: [
      "Commercial system scale and pipe diameters",
      "Specialized fixtures (flushometers, grease interceptors, commercial boilers)",
      "Scheduling requirements (after-hours or weekend service to avoid disruption)",
      "Permitting, code compliance, and backflow testing needs",
    ],
    faqs: [
      {
        question: "What types of commercial properties are served?",
        answer:
          "Independent commercial plumbing contractors service office buildings, retail centers, restaurants, multi-family properties, warehouses, and medical clinics.",
      },
      {
        question: "Do commercial plumbers handle backflow testing?",
        answer:
          "Yes. Certified commercial plumbers perform annual backflow prevention assembly testing and submit compliance reports to local water authorities.",
      },
      {
        question: "How does commercial plumbing differ from residential?",
        answer:
          "Commercial plumbing involves higher water volumes, larger pipe dimensions, strict code requirements, specialized fixtures like commercial flush valves, and stringent health regulations.",
      },
    ],
  },
  "residential-plumbing": {
    intro:
      "Piperesque connects Greater Houston homeowners with independent, licensed residential plumbing contractors for comprehensive repairs, upgrades, fixture installations, and maintenance.",
    urgencyTitle: "Complete Residential Plumbing Care",
    urgencyText:
      "From minor fixture updates to whole-home plumbing evaluations, keeping your residential plumbing in good repair protects your home investment and ensures dependable daily comfort.",
    problemsTitle: "Common Home Plumbing Needs in Houston",
    problems: [
      "Whole-home water pressure fluctuations or sudden drops",
      "Noisy pipes, water hammer vibrations, or expansion sounds",
      "Aging supply lines needing evaluation or partial repiping",
      "Appliance hookups for dishwashers, ice makers, and washing machines",
      "Outdoor hose bibb leaks and freeze damage repairs",
      "Water filtration and water softener system installations",
    ],
    processTitle: "Residential Plumbing Consultation & Repair",
    process: [
      {
        title: "Home plumbing evaluation",
        description: "Assess the affected plumbing fixtures, piping, and water pressure levels.",
      },
      {
        title: "Transparent explanation",
        description: "Review findings and discuss practical repair or maintenance options suited to your home.",
      },
      {
        title: "Quality workmanship",
        description: "Complete repairs using professional-grade tools and industry-approved plumbing materials.",
      },
      {
        title: "Clean-up and testing",
        description: "Clean the work area and thoroughly test water flow and drainage.",
      },
    ],
    localTitle: "Residential Plumbing Across Houston Neighborhoods",
    localText:
      "Whether you live in an established neighborhood with mature landscaping and cast iron pipes or a newer suburban build with modern PEX plumbing, residential plumbing contractors understand local regional requirements.",
    costTitle: "Residential Plumbing Cost Considerations",
    costText:
      "Residential plumbing pricing varies based on the nature of the task, required materials, diagnostic time, and the complexity of accessing plumbing lines in walls, attics, or foundations.",
    costFactors: [
      "Type of plumbing service (repair, maintenance, new fixture install)",
      "Parts and materials (fittings, valves, piping, fixtures)",
      "Accessibility of pipes in crawl spaces, attics, or behind walls",
      "Scope of work and estimated labor time",
    ],
    faqs: [
      {
        question: "How often should a home plumbing system be inspected?",
        answer:
          "Having a professional plumbing inspection every 1 to 2 years can catch minor leaks, corrosion, water heater sediment, and drain restrictions before they develop into major emergencies.",
      },
      {
        question: "What should I do if my home water pressure suddenly drops?",
        answer:
          "Check multiple faucets to see if the issue is isolated or whole-home. If whole-home, check the main shutoff valve and pressure reducing valve (PRV), then contact a plumber to diagnose possible main line leaks.",
      },
      {
        question: "Does Piperesque directly employ the plumbers?",
        answer:
          "No. Piperesque is an informational directory and referral service connecting Houston homeowners with independent, locally operating third-party plumbing professionals.",
      },
    ],
  },
};

function getFallbackContent(slug: string, serviceTitle: string, cityName: string, stateName: string): ServiceContent {
  return {
    intro: `Piperesque connects homeowners and property owners in ${cityName}, ${stateName} with independent plumbing professionals for ${serviceTitle.toLowerCase()} services.`,
    urgencyTitle: `Professional ${serviceTitle} in ${cityName}`,
    urgencyText: `Timely attention to plumbing issues prevents further property damage, water waste, and costly repairs. Connect with qualified local contractors experienced in ${serviceTitle.toLowerCase()}.`,
    problemsTitle: `Common ${serviceTitle} Issues`,
    problems: [
      `Signs of wear, malfunction, or active leaks requiring inspection`,
      `Loss of expected plumbing performance or efficiency`,
      `Unusual sounds, odors, or drainage sluggishness`,
      `Need for professional component replacement or code-compliant repairs`,
    ],
    processTitle: `${serviceTitle} Service Process`,
    process: [
      { title: "Initial Assessment", description: `A professional evaluates the plumbing system in your ${cityName} property.` },
      { title: "Diagnosis", description: "The technician identifies the root cause and explains repair or replacement options." },
      { title: "Service Delivery", description: "Repairs are performed using appropriate tools and quality fittings." },
      { title: "Testing & Verification", description: "The system is thoroughly tested under normal pressure to confirm proper operation." },
    ],
    localTitle: `${serviceTitle} in ${cityName}, ${stateName}`,
    localText: `Residential and commercial properties across ${cityName} have diverse plumbing configurations. Local plumbing providers have the right diagnostic equipment and parts to service local homes.`,
    costTitle: `${serviceTitle} Cost in ${cityName}`,
    costText: `Costs depend on problem severity, parts required, accessibility, and labor time. Contact a local provider for an accurate quote.`,
    costFactors: [
      "Extent of required repair or replacement",
      "Cost of replacement parts, pipes, or fixtures",
      "Accessibility of the plumbing installation",
      "Standard vs. emergency or after-hours service",
    ],
    faqs: [
      {
        question: `How do I schedule ${serviceTitle.toLowerCase()} in ${cityName}?`,
        answer: `Call Piperesque at (877) 364-0861 to be connected with an independent plumbing professional servicing ${cityName}.`,
      },
      {
        question: `How quickly can a plumber arrive in ${cityName}?`,
        answer: `Response times depend on independent provider availability, call volume, and location within ${cityName}.`,
      },
      {
        question: `Does Piperesque perform the plumbing repairs?`,
        answer: `No. Piperesque is an informational directory and referral service connecting homeowners with independent third-party plumbing professionals.`,
      },
    ],
  };
}

export default async function LocationServicePage({ params }: Props) {
  const { location, service } = await params;

  const city = locations.find((item) => item.slug === location);
  const plumbing = services.find((item) => item.slug === service);

  if (!city || !plumbing) {
    notFound();
  }

  const content = serviceContent[plumbing.slug] || getFallbackContent(plumbing.slug, plumbing.shortTitle, city.city, city.stateCode);

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
      url: `${baseUrl}/service-areas/${city.slug}`,
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
  };

  return (
    <>
      <Navbar />

      <main>
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8"
        >
          <ol className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
            <li>
              <Link
                href="/"
                className="transition-colors hover:text-gray-900"
              >
                Home
              </Link>
            </li>

            <li aria-hidden="true">/</li>

            <li>
              <Link
                href={`/service-areas/${city.slug}`}
                className="transition-colors hover:text-gray-900"
              >
                {cityName}
              </Link>
            </li>



            <li aria-hidden="true">/</li>



            <li

              aria-current="page"

              className="font-medium text-gray-900"

            >

              {serviceName}

            </li>

          </ol>

        </nav>



        {/* Hero */}

        <section className="mx-auto max-w-7xl px-4 pb-12 pt-10 sm:px-6 lg:px-8 lg:pt-16">

          <div className="max-w-4xl">

            <p className="mb-4 text-sm font-semibold uppercase tracking-wide text-gray-600">

              {cityName}, {stateName}

            </p>



            <h1 className="text-4xl font-bold tracking-tight text-gray-950 sm:text-5xl lg:text-6xl">

              {serviceName} in {cityName}, {stateName}

            </h1>



            <p className="mt-6 max-w-3xl text-lg leading-8 text-gray-700">

              {content.intro}

            </p>



            <div className="mt-8 flex flex-col gap-4 sm:flex-row">

              <a

                href="tel:+18773640861"

                className="inline-flex items-center justify-center rounded-lg bg-black px-6 py-3 text-base font-semibold text-white transition hover:bg-gray-800"

              >

                Call (877) 364-0861

              </a>



              <Link

                href="/contact"

                className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-3 text-base font-semibold text-gray-900 transition hover:bg-gray-50"

              >

                Contact Us

              </Link>

            </div>



            <p className="mt-4 text-sm text-gray-500">

              Independent plumbing providers • Availability varies by

              location and provider

            </p>

          </div>

        </section>



        {/* Main Content */}

        <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">

          <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">

            <article className="min-w-0">

              {/* Introduction */}

              <section className="mb-12">

                <h2 className="text-3xl font-bold tracking-tight text-gray-950">

                  {content.urgencyTitle}

                </h2>



                <p className="mt-5 text-lg leading-8 text-gray-700">

                  {content.urgencyText}

                </p>

              </section>



              {/* Common Problems */}

              <section className="mb-12">

                <h2 className="text-3xl font-bold tracking-tight text-gray-950">

                  {content.problemsTitle}

                </h2>



                <ul className="mt-6 space-y-4">

                  {content.problems.map((problem) => (

                    <li

                      key={problem}

                      className="flex items-start gap-3 text-gray-700"

                    >

                      <span

                        aria-hidden="true"

                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gray-900"

                      />



                      <span className="leading-7">{problem}</span>

                    </li>

                  ))}

                </ul>

              </section>



              {/* Process */}

              <section className="mb-12">

                <h2 className="text-3xl font-bold tracking-tight text-gray-950">

                  {content.processTitle}

                </h2>



                <div className="mt-8 space-y-8">

                  {content.process.map((step, index) => (

                    <div

                      key={step.title}

                      className="flex gap-5"

                    >

                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-900">

                        {index + 1}

                      </div>



                      <div>

                        <h3 className="text-xl font-semibold text-gray-950">

                          {step.title}

                        </h3>



                        <p className="mt-2 leading-7 text-gray-700">

                          {step.description}

                        </p>

                      </div>

                    </div>

                  ))}

                </div>

              </section>



              {/* Local Information */}

              <section className="mb-12">

                <h2 className="text-3xl font-bold tracking-tight text-gray-950">

                  {content.localTitle}

                </h2>



                <p className="mt-5 leading-8 text-gray-700">

                  {content.localText}

                </p>

              </section>



              {/* Cost */}

              <section className="mb-12">

                <h2 className="text-3xl font-bold tracking-tight text-gray-950">

                  {content.costTitle}

                </h2>



                <p className="mt-5 leading-8 text-gray-700">

                  {content.costText}

                </p>



                <h3 className="mt-8 text-xl font-semibold text-gray-950">

                  Factors That Can Affect Cost

                </h3>



                <ul className="mt-5 space-y-3">

                  {content.costFactors.map((factor) => (

                    <li

                      key={factor}

                      className="flex items-start gap-3 text-gray-700"

                    >

                      <span

                        aria-hidden="true"

                        className="mt-2 h-2 w-2 shrink-0 rounded-full bg-gray-900"

                      />



                      <span className="leading-7">{factor}</span>

                    </li>

                  ))}

                </ul>



                <div className="mt-8 rounded-xl border border-gray-200 bg-gray-50 p-6">

                  <p className="text-sm leading-6 text-gray-600">

                    Piperesque does not guarantee pricing, availability,

                    response time, or workmanship. Any estimate, service

                    terms, scheduling, and final price are determined by

                    the independent plumbing provider.

                  </p>

                </div>

              </section>



              {/* Related Services */}

              <section className="mb-12">

                <h2 className="text-3xl font-bold tracking-tight text-gray-950">

                  Related Plumbing Services in {cityName}

                </h2>



                <div className="mt-6 grid gap-4 sm:grid-cols-2">

                  {[

                    {

                      slug: "emergency-plumbing",

                      name: "Emergency Plumbing",

                    },

                    {

                      slug: "sewer-line-repair",

                      name: "Sewer Line Repair",

                    },

                    {

                      slug: "drain-cleaning",

                      name: "Drain Cleaning",

                    },

                    {

                      slug: "leak-detection",

                      name: "Leak Detection",

                    },

                    {

                      slug: "water-heater-repair",

                      name: "Water Heater Repair",

                    },

                  ]

                    .filter((item) => item.slug !== plumbing.slug)

                    .map((item) => (

                      <Link

                        key={item.slug}

                        href={`/location/${city.slug}/${item.slug}`}

                        className="rounded-xl border border-gray-200 p-5 transition hover:border-gray-400 hover:bg-gray-50"

                      >

                        <span className="font-semibold text-gray-950">

                          {item.name}

                        </span>



                        <span className="mt-1 block text-sm text-gray-600">

                          Learn more about {item.name.toLowerCase()} in{" "}

                          {cityName}.

                        </span>

                      </Link>

                    ))}

                </div>

              </section>

            </article>



            {/* Sidebar */}

            <aside className="lg:sticky lg:top-24 lg:self-start">

              <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6">

                <h2 className="text-xl font-bold text-gray-950">

                  Need Plumbing Help?

                </h2>



                <p className="mt-3 text-sm leading-6 text-gray-600">

                  Connect with an independent plumbing professional

                  serving your area.

                </p>



                <a

                  href="tel:+18773640861"

                  className="mt-6 block rounded-lg bg-black px-5 py-3 text-center font-semibold text-white transition hover:bg-gray-800"

                >

                  Call (877) 364-0861

                </a>



                <p className="mt-4 text-xs leading-5 text-gray-500">

                  Availability and service terms vary by provider and

                  location.

                </p>

              </div>

            </aside>

          </div>

        </section>

      </main>

            {/* FAQ Section */}

      <section className="border-t border-gray-200 bg-gray-50">

        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

          <div className="max-w-3xl">

            <h2 className="text-3xl font-bold tracking-tight text-gray-950">

              Frequently Asked Questions

            </h2>



            <p className="mt-4 leading-7 text-gray-600">

              Common questions about {serviceName.toLowerCase()} in{" "}

              {cityName}, {stateName}.

            </p>

          </div>



          <div className="mt-10 max-w-4xl space-y-4">

            {content.faqs.map((faq) => (

              <details

                key={faq.question}

                className="group rounded-xl border border-gray-200 bg-white p-6"

              >

                <summary className="cursor-pointer list-none pr-8 text-lg font-semibold text-gray-950">

                  {faq.question}

                </summary>



                <p className="mt-4 leading-7 text-gray-700">

                  {faq.answer}

                </p>

              </details>

            ))}

          </div>

        </div>

      </section>



      {/* Final CTA */}

      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">

        <div className="rounded-2xl bg-gray-950 px-6 py-10 text-center sm:px-10">

          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">

            Need {serviceName.toLowerCase()} in {cityName}?

          </h2>



          <p className="mx-auto mt-4 max-w-2xl leading-7 text-gray-300">

            Get connected with an independent plumbing professional

            serving your area.

          </p>



          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

            <a

              href="tel:+18773640861"

              className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 font-semibold text-gray-950 transition hover:bg-gray-100"

            >

              Call (877) 364-0861

            </a>



            <Link

              href="/contact"

              className="inline-flex items-center justify-center rounded-lg border border-gray-700 px-6 py-3 font-semibold text-white transition hover:bg-gray-900"

            >

              Contact Us

            </Link>

          </div>



          <p className="mt-5 text-xs leading-5 text-gray-400">

            Independent plumbing providers. Availability, pricing,

            response time, and service terms vary by provider and

            location.

          </p>

        </div>

      </section>



      {/* Structured Data */}

    <JsonLd schema={serviceSchema} />



      <BreadcrumbSchema items={breadcrumbItems} />



      <FAQSchema

        faqs={content.faqs.map((faq) => ({

          question: faq.question,

          answer: faq.answer,

        }))}

      />



      {/* Existing CTA / Footer */}

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
    notFound();
  }







  const isSewerRepair = plumbing.slug === "sewer-line-repair";

  const title = isSewerRepair
    ? `Sewer Line Repair in ${city.city}, ${city.stateCode} | Repair & Replacement | Piperesque`
    : `${plumbing.shortTitle} in ${city.city}, ${city.stateCode} | Piperesque`;

  const description = isSewerRepair
    ? `Need sewer line repair in ${city.city}, ${city.stateCode}? Review warning signs, repair vs. replacement options, cost factors, and steps to take during a sewer backup.`
    : `${plumbing.shortTitle} in ${city.city}, ${city.stateCode}. Learn about common plumbing symptoms, service considerations, and connecting with independent plumbing professionals.`;

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

      locale: "en_US",

    },



    twitter: {

      card: "summary_large_image",

      title,

      description,

    },

  };

}