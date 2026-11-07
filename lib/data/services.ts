import {
  Wrench,
  Droplets,
  Flame,
  ShowerHead,
  Toilet,
  Pipette,
  Building2,
  Home,
  Bath,
  AlertTriangle,
} from "lucide-react";

export interface Service {
  slug: string;
  title: string;
  shortTitle: string;

  seoTitle: string;
  metaDescription: string;
  keywords: string[];

  heroTitle: string;
  heroDescription: string;

  description: string;
  benefits: string[];

  image: string;

  icon: React.ComponentType<{
    size?: number;
    className?: string;
  }>;
}

export const services: Service[] = [
  {
    slug: "emergency-plumbing",

    title: "Emergency Plumbing Services",

    shortTitle: "Emergency Plumbing",

    seoTitle:
      "Emergency Plumber Houston, TX | 24/7 Urgent Plumbing Referral | PipeResque",

    metaDescription:
      "Facing a plumbing emergency in Houston, TX? Connect with licensed independent plumbers for burst pipes, sewer backups & active leaks. Fast phone referral: (877) 364-0861.",

    keywords: [
      "emergency plumbing houston tx",
      "emergency plumber houston",
      "burst pipe repair houston",
      "24 hour plumber houston",
      "urgent plumbing repair houston tx",
    ],

    heroTitle: "Emergency Plumbing Services in Houston, TX",

    heroDescription:
      "Urgent assistance connecting Houston homeowners with independent licensed plumbing contractors for burst pipes, active flooding, and sewer backups.",

    description:
      "Emergency plumbing problems can cause severe water damage and property disruption. PipeResque connects you with independent licensed plumbing contractors who can evaluate burst supply lines, sewer overflows, and active flooding across Greater Houston.",

    benefits: [
      "Urgent Phone Referral Matching",
      "Burst Pipe & Active Leak Response",
      "Major Sewer Backup Evaluation",
      "Direct Hotline: (877) 364-0861",
      "Independent Licensed Providers",
    ],

    image: "/images/services/emergency-plumbing.webp",

    icon: AlertTriangle,
  },

  {
    slug: "drain-cleaning",

    title: "Drain Cleaning Services",

    shortTitle: "Drain Cleaning",

    seoTitle:
      "Drain Cleaning Houston, TX | Hydro-Jetting & Clog Clearing | PipeResque",

    metaDescription:
      "Clogged drains or slow sinks in Houston, TX? Connect with licensed independent plumbers for motorized snaking, hydro-jetting & main cleanout clearing. Call (877) 364-0861.",

    keywords: [
      "drain cleaning houston tx",
      "clogged drain houston",
      "hydro jetting houston",
      "unclog drain houston tx",
      "main sewer cleanout houston",
    ],

    heroTitle: "Drain Cleaning Services in Houston, TX",

    heroDescription:
      "Connect with independent local plumbing professionals for kitchen sinks, shower drains, and main sewer line cleanouts across Greater Houston.",

    description:
      "Drain problems can result from grease buildup, hair accumulation, mineral scale, or root infiltration into Houston lateral lines. We connect you with local independent contractors equipped with motorized augers and high-pressure hydro-jetting.",

    benefits: [
      "Motorized Cable Snaking",
      "High-Pressure Hydro-Jetting",
      "Main Sewer Cleanout Clearing",
      "Kitchen & Bathroom Drain Help",
      "Independent Contractor Network",
    ],

    image: "/images/services/drain-cleaning.webp",

    icon: Droplets,
  },

  {
    slug: "water-heater-repair",

    title: "Water Heater Repair Services",

    shortTitle: "Water Heater Repair",

    seoTitle:
      "Water Heater Repair Houston, TX | Gas, Electric & Tankless | PipeResque",

    metaDescription:
      "Water heater leaking or no hot water in Houston, TX? Connect with licensed independent plumbers for gas, electric & tankless diagnosis. Fast referral: (877) 364-0861.",

    keywords: [
      "water heater repair houston",
      "hot water heater repair houston tx",
      "tankless water heater repair houston",
      "water heater leaking houston",
      "attic water heater replacement houston",
    ],

    heroTitle: "Water Heater Repair Services in Houston, TX",

    heroDescription:
      "Independent contractor referral for water heater leaks, heating element failures, thermal expansion issues, and code compliance in Greater Houston.",

    description:
      "From leaking attic tanks to extinguished pilot lights and failed heating elements, water heater breakdowns disrupt household sanitation. PipeResque connects you with independent licensed plumbers serving the Greater Houston metropolitan area.",

    benefits: [
      "Gas & Electric Tank Systems",
      "Tankless Water Heater Diagnosis",
      "Attic Drain Pan & Relief Valve Inspection",
      "Sediment Flush & Element Replacement",
      "Licensed Independent Plumbers",
    ],

    image: "/images/services/water-heater-repair.webp",

    icon: Flame,
  },

  {
    slug: "leak-detection",

    title: "Leak Detection Services",

    shortTitle: "Leak Detection",

    seoTitle:
      "Water Leak Detection Houston, TX | Slab Leaks & Hidden Pipes | PipeResque",

    metaDescription:
      "Suspect a slab leak or hidden pipe leak in Houston, TX? Connect with independent leak detection specialists for non-invasive acoustic & thermal diagnostics. Call (877) 364-0861.",

    keywords: [
      "leak detection houston tx",
      "slab leak detection houston",
      "hidden water leak houston",
      "foundation leak detection houston",
      "under slab leak test houston",
    ],

    heroTitle: "Water Leak Detection in Houston, TX",

    heroDescription:
      "Connect with independent Houston leak detection contractors for precision acoustic listening, thermal imaging, and foundation slab leak diagnosis.",

    description:
      "Hidden water leaks beneath concrete foundation slabs or behind drywall cause structural damage and inflated water bills. We connect homeowners with independent plumbing specialists utilizing non-invasive acoustic, thermal, and hydrostatic testing.",

    benefits: [
      "Non-Invasive Acoustic Listening",
      "Infrared Thermal Imaging",
      "Under-Slab Hydrostatic Pressure Tests",
      "High Water Bill Investigation",
      "Independent Specialized Providers",
    ],

    image: "/images/services/leak-detection.webp",

    icon: Pipette,
  },

  {
    slug: "pipe-repair",

    title: "Pipe Repair Services",

    shortTitle: "Pipe Repair",

    seoTitle:
      "Pipe Repair Services in Houston, TX | Burst & Leaking Pipes | PipeResque",

    metaDescription:
      "Leaking or burst pipes in Houston, TX? Connect with independent licensed plumbers for copper, CPVC & PEX pipe repairs, repiping & valve fixes. Call (877) 364-0861.",

    keywords: [
      "pipe repair houston tx",
      "burst pipe repair houston",
      "leaking water pipe houston",
      "pex repipe houston",
      "copper pipe repair houston",
    ],

    heroTitle: "Plumbing Pipe Repair Services in Houston, TX",

    heroDescription:
      "Information and referral options for frozen burst pipes, pinhole copper leaks, corroded galvanized lines, and whole-home PEX repiping across Greater Houston.",

    description:
      "Damaged water supply lines threaten drywall, flooring, and property structure. PipeResque connects Houston homeowners with independent licensed contractors for localized pipe spot repairs, valve replacements, and whole-home repiping.",

    benefits: [
      "Copper Pinhole Leak Repair",
      "PEX & CPVC Supply Line Fixes",
      "Frozen Pipe Thawing & Repair",
      "Main Water Shutoff Valve Replacement",
      "Independent Contractor Connection",
    ],

    image: "/images/services/pipe-repair.webp",

    icon: Wrench,
  },

  {
    slug: "sewer-line-repair",

    title: "Sewer Line Repair Services",

    shortTitle: "Sewer Line Repair",

    seoTitle:
      "Sewer Line Repair Houston, TX | Camera Inspections & Replacement | PipeResque",

    metaDescription:
      "Main sewer line backing up in Houston, TX? Connect with licensed independent contractors for video camera diagnostics, trenchless relining & pipe replacement. Call (877) 364-0861.",

    keywords: [
      "sewer line repair houston tx",
      "sewer replacement houston",
      "sewer camera inspection houston",
      "trenchless sewer repair houston",
      "sewer backup repair houston tx",
    ],

    heroTitle: "Sewer Line Repair & Replacement in Houston, TX",

    heroDescription:
      "Connect with independent Houston plumbing contractors specializing in video camera line inspections, tree root clearing, trenchless relining, and sewer replacement.",

    description:
      "Sewer line problems can cause raw wastewater to back up into bathtubs, toilets, and floor drains. Houston's expansive clay soil and mature tree roots often crack or belly underground sewer laterals. PipeResque connects you with independent licensed contractors for camera evaluations, trenchless CIPP lining, and structural excavation.",

    benefits: [
      "High-Definition Video Camera Inspections",
      "Trenchless CIPP Pipe Relining Options",
      "Tree Root Intrusion Hydro-Jetting",
      "Sewer Lateral Line Spot & Full Replacement",
      "Independent Licensed Plumbing Contractors",
    ],

    image: "/images/services/sewer-line-repair.webp",

    icon: ShowerHead,
  },

  {
    slug: "toilet-repair",

    title: "Toilet Repair Services",

    shortTitle: "Toilet Repair",

    seoTitle:
      "Toilet Repair Services | Piperesque",

    metaDescription:
      "Learn about clogged, leaking, overflowing, and continuously running toilets and the plumbing repair options available.",

    keywords: [
      "toilet repair",
      "clogged toilet repair",
      "running toilet repair",
      "toilet leak repair",
      "toilet plumbing service",
    ],

    heroTitle: "Toilet Repair Services",

    heroDescription:
      "Information about common toilet problems including clogs, leaks, flushing issues, and continuously running toilets.",

    description:
      "Toilet problems can result from blocked drains, worn components, leaks, or other plumbing conditions. A professional assessment can identify the cause and determine whether repair or replacement is appropriate.",

    benefits: [
      "Toilet Problem Information",
      "Clog Guidance",
      "Leak Information",
      "Flush Problem Guidance",
      "Replacement Considerations",
    ],

    image: "/images/services/toilet-repair.webp",

    icon: Toilet,
  },

  {
    slug: "faucet-repair",

    title: "Faucet Repair Services",

    shortTitle: "Faucet Repair",

    seoTitle:
      "Faucet Repair Services | Piperesque",

    metaDescription:
      "Learn about leaking, dripping, damaged, and malfunctioning kitchen and bathroom faucets and available repair options.",

    keywords: [
      "faucet repair",
      "leaky faucet repair",
      "kitchen faucet repair",
      "bathroom faucet repair",
      "faucet replacement",
    ],

    heroTitle: "Faucet Repair Services",

    heroDescription:
      "Information about common faucet problems, water leaks, worn components, fixture repairs, and replacement considerations.",

    description:
      "A dripping or leaking faucet can waste water and may indicate a worn component or damaged fixture. The appropriate solution depends on the faucet condition, failed component, and whether repair or replacement is more suitable.",

    benefits: [
      "Faucet Problem Information",
      "Leak Guidance",
      "Fixture Repair Options",
      "Replacement Considerations",
      "Kitchen & Bathroom Information",
    ],

    image: "/images/services/faucet-repair.webp",

    icon: Bath,
  },
    {
    slug: "commercial-plumbing",

    title: "Commercial Plumbing Services",

    shortTitle: "Commercial Plumbing",

    seoTitle:
      "Commercial Plumbing Services | Piperesque",

    metaDescription:
      "Learn about commercial plumbing problems, maintenance considerations, repairs, drainage, water heaters, leaks, and other plumbing services for commercial properties.",

    keywords: [
      "commercial plumbing",
      "commercial plumber",
      "business plumbing repair",
      "commercial drain cleaning",
      "commercial plumbing services",
    ],

    heroTitle: "Commercial Plumbing Services",

    heroDescription:
      "Information about plumbing systems and common service needs for offices, retail properties, restaurants, warehouses, and other commercial buildings.",

    description:
      "Commercial plumbing systems can involve fixtures, drainage, water heaters, supply lines, and other plumbing components. Service requirements depend on the property, plumbing system, and specific problem.",

    benefits: [
      "Commercial Plumbing Information",
      "Drainage Guidance",
      "Leak Information",
      "Water Heater Guidance",
      "Local Service Options",
    ],

    image: "/images/services/commercial-plumbing.webp",

    icon: Building2,
  },

  {
    slug: "residential-plumbing",

    title: "Residential Plumbing Services",

    shortTitle: "Residential Plumbing",

    seoTitle:
      "Residential Plumbing Services | Piperesque",

    metaDescription:
      "Learn about residential plumbing problems including leaks, clogged drains, fixtures, water heaters, pipes, and emergency plumbing situations.",

    keywords: [
      "residential plumbing",
      "residential plumber",
      "home plumbing services",
      "house plumbing repair",
      "residential plumbing repair",
    ],

    heroTitle: "Residential Plumbing Services",

    heroDescription:
      "Information about common residential plumbing problems, repairs, maintenance considerations, and local plumbing service options.",

    description:
      "Residential plumbing systems include fixtures, supply lines, drainage, water heaters, and other components. The appropriate service depends on the property's plumbing system and the specific problem.",

    benefits: [
      "Residential Plumbing Information",
      "Leak Guidance",
      "Drain Problem Information",
      "Water Heater Guidance",
      "Local Service Options",
    ],

    image: "/images/services/residential-plumbing.webp",

    icon: Home,
  },
];