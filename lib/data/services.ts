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

    seoTitle: "Emergency Plumbing Help in Houston, TX",

    metaDescription:
      "Facing a plumbing emergency in Houston, TX? Connect with licensed independent plumbers for burst pipes, sewer backups & leaks. Call (877) 587-3986.",

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
      "Direct Hotline: (877) 587-3986",
      "Independent Licensed Providers",
    ],

    image: "/images/services/emergency-plumbing.webp",

    icon: AlertTriangle,
  },

  {
    slug: "drain-cleaning",

    title: "Drain Cleaning Services",

    shortTitle: "Drain Cleaning",

    seoTitle: "Drain Cleaning & Hydro-Jetting Houston, TX",

    metaDescription:
      "Clogged drains or slow sinks in Houston, TX? Connect with licensed independent plumbers for snaking, hydro-jetting & cleanout clearing. Call (877) 587-3986.",

    keywords: [
      "drain cleaning houston tx",
      "clogged drain houston",
      "hydro jetting houston",
      "unclog drain houston tx",
      "main sewer cleanout houston",
    ],

    heroTitle: "Drain Cleaning Services in Houston, TX",

    heroDescription:
      "Connect with independent local plumbing professionals for kitchen sinks, shower drains, hydro-jetting, and main sewer cleanouts across Greater Houston.",

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

    seoTitle: "Water Heater Repair & Tankless Houston, TX",

    metaDescription:
      "Water heater leaking or no hot water in Houston, TX? Connect with licensed independent plumbers for gas, electric & tankless repairs. Call (877) 587-3986.",

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

    seoTitle: "Slab & Water Leak Detection in Houston, TX",

    metaDescription:
      "Suspect a slab leak or hidden pipe leak in Houston, TX? Connect with independent acoustic & thermal leak detection specialists. Call (877) 587-3986.",

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

    seoTitle: "Burst & Copper Pipe Repair in Houston, TX",

    metaDescription:
      "Leaking or burst pipes in Houston, TX? Connect with independent licensed plumbers for copper, CPVC & PEX repiping and valve fixes. Call (877) 587-3986.",

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

    seoTitle: "Sewer Line Repair & Backups in Houston, TX",

    metaDescription:
      "Main sewer backing up in Houston, TX? Connect with independent plumbers for video camera checks, hydro-jetting & line repair. Call (877) 587-3986.",

    keywords: [
      "sewer line repair houston tx",
      "sewer replacement houston",
      "sewer camera inspection houston",
      "trenchless sewer repair houston",
      "sewer backup repair houston tx",
      "emergency sewer backup houston",
    ],

    heroTitle: "Sewer Line Repair & Replacement in Houston, TX",

    heroDescription:
      "Connect with independent Houston plumbing contractors specializing in emergency sewer backups, video camera inspections, hydro-jetting, and pipe replacement.",

    description:
      "Sewer line problems can cause raw wastewater to back up into bathtubs, toilets, and floor drains. Houston's expansive clay soil and mature tree roots often crack or belly underground sewer laterals. PipeResque connects you with independent licensed contractors for camera evaluations, hydro-jetting, trenchless CIPP lining, and excavation.",

    benefits: [
      "High-Definition Video Camera Inspections",
      "Emergency Sewer Backup Evaluation",
      "Trenchless CIPP Pipe Relining Options",
      "Tree Root Intrusion Hydro-Jetting",
      "Independent Licensed Plumbing Contractors",
    ],

    image: "/images/services/sewer-line-repair.webp",

    icon: ShowerHead,
  },

  {
    slug: "toilet-repair",

    title: "Toilet Repair Services",

    shortTitle: "Toilet Repair",

    seoTitle: "Toilet Repair, Clogs & Leaks Houston, TX",

    metaDescription:
      "Overflowing, leaking, or continuously running toilet in Houston, TX? Connect with independent local plumbers for wax rings & valve fixes: (877) 587-3986.",

    keywords: [
      "toilet repair houston tx",
      "clogged toilet repair houston",
      "running toilet repair houston",
      "toilet leak repair houston",
      "wax ring replacement houston",
    ],

    heroTitle: "Toilet Repair Services in Houston, TX",

    heroDescription:
      "Connect with independent Houston plumbing professionals for overflowing bowls, base wax-ring leaks, fill valve failures, and toilet replacements.",

    description:
      "Toilet problems can stem from trap obstructions, failed wax seals, worn flappers, or deeper main sewer backups. PipeResque connects Houston homeowners with independent licensed contractors for reliable diagnostics and repairs.",

    benefits: [
      "Stubborn Clog & Auger Clearing",
      "Base Leak & Wax Ring Replacement",
      "Fill Valve & Flush Mechanism Repair",
      "New Toilet Installation Help",
      "Independent Licensed Providers",
    ],

    image: "/images/services/toilet-repair.webp",

    icon: Toilet,
  },

  {
    slug: "faucet-repair",

    title: "Faucet Repair Services",

    shortTitle: "Faucet Repair",

    seoTitle: "Faucet & Hose Bibb Repair in Houston, TX",

    metaDescription:
      "Dripping kitchen faucet or leaking outdoor hose bibb in Houston, TX? Connect with independent plumbers for cartridge & fixture repairs: (877) 587-3986.",

    keywords: [
      "faucet repair houston tx",
      "leaky faucet repair houston",
      "kitchen faucet replacement houston",
      "hose bibb repair houston",
      "cartridge valve repair houston",
    ],

    heroTitle: "Faucet Repair Services in Houston, TX",

    heroDescription:
      "Connect with independent Greater Houston plumbers for leaking kitchen faucets, worn bathroom cartridges, under-sink supply lines, and outdoor hose bibbs.",

    description:
      "A dripping faucet or leaking outdoor sillcock wastes treated water and can damage cabinetry or exterior brick framing. PipeResque connects Houston homeowners with independent contractors for cartridge rebuilds, shutoff valves, and fixture swaps.",

    benefits: [
      "Kitchen & Bathroom Cartridge Fixes",
      "Under-Sink Supply Valve Replacement",
      "Frost-Free Outdoor Hose Bibbs",
      "Pressure & Aerator Diagnostics",
      "Independent Local Plumbing Pros",
    ],

    image: "/images/services/faucet-repair.webp",

    icon: Bath,
  },
  {
    slug: "commercial-plumbing",

    title: "Commercial Plumbing Services",

    shortTitle: "Commercial Plumbing",

    seoTitle: "Commercial Plumbing Services Houston, TX",

    metaDescription:
      "Need commercial plumbing in Houston, TX? Connect with independent licensed contractors for grease traps, backflow testing, drains & boilers: (877) 587-3986.",

    keywords: [
      "commercial plumbing houston tx",
      "commercial plumber houston",
      "grease trap drain cleaning houston",
      "commercial backflow testing houston",
      "commercial water heater houston",
    ],

    heroTitle: "Commercial Plumbing Referral in Houston, TX",

    heroDescription:
      "Connect with independent commercial plumbing contractors serving Houston offices, restaurants, retail centers, and multi-family properties.",

    description:
      "Commercial properties across Greater Houston face strict health-code standards for hot water delivery, backflow prevention, grease traps, and high-traffic restroom drains. PipeResque connects facility managers with independent commercial plumbers.",

    benefits: [
      "Commercial Hydro-Jetting & Drains",
      "Backflow Preventer Testing Prep",
      "Commercial Water Heaters & Boilers",
      "Restroom Flushometer & Valve Repairs",
      "Independent Commercial Contractors",
    ],

    image: "/images/services/commercial-plumbing.webp",

    icon: Building2,
  },

  {
    slug: "residential-plumbing",

    title: "Residential Plumbing Services",

    shortTitle: "Residential Plumbing",

    seoTitle: "Residential Plumbing Help in Houston, TX",

    metaDescription:
      "Need a residential plumber in Houston, TX? Connect with independent local contractors for leaks, slow drains, water heaters & repiping: (877) 587-3986.",

    keywords: [
      "residential plumbing houston tx",
      "residential plumber houston",
      "home plumbing repair houston",
      "house plumbing service houston",
      "greater houston home plumber",
    ],

    heroTitle: "Residential Plumbing Services in Houston, TX",

    heroDescription:
      "Referral assistance for Greater Houston homeowners needing trusted help with leaks, clogged drains, water heaters, shutoff valves, and everyday fixtures.",

    description:
      "Greater Houston homes experience unique stresses from expansive clay soil, coastal freeze events, and mineralized water. PipeResque connects homeowners with independent licensed plumbers for diagnostic inspections, repairs, and replacements.",

    benefits: [
      "Supply Line & Fixture Repairs",
      "Main Shutoff & PRV Valves",
      "Leak & Drainage Troubleshooting",
      "Whole-Home PEX Repiping Referrals",
      "Clear Independent Provider Terms",
    ],

    image: "/images/services/residential-plumbing.webp",

    icon: Home,
  },
];