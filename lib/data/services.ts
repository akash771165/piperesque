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
      "Emergency Plumbing Services | Piperesque",

    metaDescription:
      "Information about emergency plumbing problems including burst pipes, major leaks, sewer backups, and other urgent plumbing issues.",

    keywords: [
      "emergency plumbing",
      "emergency plumber",
      "burst pipe repair",
      "plumbing emergency",
      "urgent plumbing repair",
    ],

    heroTitle: "Emergency Plumbing Services",

    heroDescription:
      "Information and service options for urgent plumbing problems such as major leaks, burst pipes, sewer backups, and other plumbing emergencies.",

    description:
      "Emergency plumbing problems can cause water damage and disruption. Learn about common warning signs, appropriate next steps, and options for connecting with a local plumbing professional.",

    benefits: [
      "Emergency Plumbing Information",
      "Burst Pipe Guidance",
      "Major Leak Information",
      "Sewer Backup Guidance",
      "Local Service Options",
    ],

    image: "/images/services/emergency-plumbing.jpg",

    icon: AlertTriangle,
  },

  {
    slug: "drain-cleaning",

    title: "Drain Cleaning Services",

    shortTitle: "Drain Cleaning",

    seoTitle:
      "Drain Cleaning Services | Piperesque",

    metaDescription:
      "Learn about drain cleaning for slow or blocked sinks, showers, tubs, toilets, and other plumbing drainage problems.",

    keywords: [
      "drain cleaning",
      "clogged drain",
      "drain unclogging",
      "blocked drain",
      "main drain cleaning",
    ],

    heroTitle: "Drain Cleaning Services",

    heroDescription:
      "Learn about common drain blockages, warning signs, professional cleaning methods, and local plumbing service options.",

    description:
      "Drain problems can result from buildup, debris, grease, hair, mineral deposits, or deeper plumbing issues. The appropriate cleaning method depends on the location and cause of the blockage.",

    benefits: [
      "Drain Blockage Information",
      "Clog Diagnosis",
      "Drain Cleaning Options",
      "Recurring Clog Guidance",
      "Local Service Options",
    ],

    image: "/images/services/drain-cleaning.png",

    icon: Droplets,
  },

  {
    slug: "water-heater-repair",

    title: "Water Heater Repair Services",

    shortTitle: "Water Heater Repair",

    seoTitle:
      "Water Heater Repair Services | Piperesque",

    metaDescription:
      "Learn about water heater problems including insufficient hot water, leaks, unusual noises, and possible repair or replacement options.",

    keywords: [
      "water heater repair",
      "water heater problems",
      "hot water heater repair",
      "water heater replacement",
      "tankless water heater",
    ],

    heroTitle: "Water Heater Repair Services",

    heroDescription:
      "Information about water heater problems, common warning signs, diagnosis, repair, maintenance, and replacement considerations.",

    description:
      "Water heater problems can affect hot water availability and daily activities. A professional assessment can help determine whether a component repair, maintenance service, or replacement is appropriate.",

    benefits: [
      "Water Heater Diagnosis",
      "Repair Information",
      "Replacement Considerations",
      "Tank & Tankless Systems",
      "Local Service Options",
    ],

    image: "/images/services/water-heater-repair.png",

    icon: Flame,
  },

  {
    slug: "leak-detection",

    title: "Leak Detection Services",

    shortTitle: "Leak Detection",

    seoTitle:
      "Leak Detection Services | Piperesque",

    metaDescription:
      "Learn about detecting hidden plumbing leaks, unexplained water loss, damp areas, and other signs of possible plumbing leaks.",

    keywords: [
      "leak detection",
      "hidden water leak",
      "plumbing leak detection",
      "slab leak detection",
      "water leak",
    ],

    heroTitle: "Leak Detection Services",

    heroDescription:
      "Learn about common signs of hidden plumbing leaks and the diagnostic methods professionals may use to locate them.",

    description:
      "Hidden plumbing leaks can occur behind walls, beneath floors, around fixtures, or in other inaccessible areas. Accurate diagnosis helps identify the likely source and determine an appropriate repair.",

    benefits: [
      "Hidden Leak Information",
      "Leak Warning Signs",
      "Diagnostic Methods",
      "Water Damage Prevention",
      "Local Service Options",
    ],

    image: "/images/services/leak-detection.jpg",

    icon: Pipette,
  },
    {
    slug: "pipe-repair",

    title: "Pipe Repair Services",

    shortTitle: "Pipe Repair",

    seoTitle:
      "Pipe Repair Services | Piperesque",

    metaDescription:
      "Learn about leaking, damaged, broken, and deteriorating plumbing pipes and the repair options that may be appropriate.",

    keywords: [
      "pipe repair",
      "water pipe repair",
      "leaking pipe repair",
      "broken pipe repair",
      "pipe replacement",
    ],

    heroTitle: "Pipe Repair Services",

    heroDescription:
      "Information about damaged plumbing pipes, common warning signs, repair considerations, and local plumbing service options.",

    description:
      "Damaged pipes can cause leaks, pressure problems, water damage, and interruptions to plumbing service. The appropriate repair depends on the pipe material, location, accessibility, and extent of the damage.",

    benefits: [
      "Pipe Problem Information",
      "Leak Warning Signs",
      "Repair Options",
      "Pipe Replacement Guidance",
      "Local Service Options",
    ],

    image: "/images/services/pipe-repair.png",

    icon: Wrench,
  },

  {
    slug: "sewer-line-repair",

    title: "Sewer Line Repair Services",

    shortTitle: "Sewer Line Repair",

    seoTitle:
      "Sewer Line Repair Services | Piperesque",

    metaDescription:
      "Learn about sewer line problems including recurring backups, damaged pipes, root intrusion, blockages, and sewer repair options.",

    keywords: [
      "sewer line repair",
      "sewer pipe repair",
      "sewer replacement",
      "drain line repair",
      "underground sewer repair",
    ],

    heroTitle: "Sewer Line Repair Services",

    heroDescription:
      "Information about sewer line problems, warning signs, inspection considerations, repair methods, and local service options.",

    description:
      "Sewer line problems can affect multiple plumbing fixtures and may result from blockages, root intrusion, damaged pipes, or other conditions. Diagnosis helps determine the appropriate repair or replacement approach.",

    benefits: [
      "Sewer Problem Information",
      "Recurring Backup Guidance",
      "Inspection Information",
      "Repair Options",
      "Replacement Considerations",
    ],

    image: "/images/services/sewer-line-repair.png",

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

    image: "/images/services/toilet-repair.jpg",

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

    image: "/images/services/faucet-repair.png",

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

    image: "/images/services/commercial-plumbing.png",

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

    image: "/images/services/residential-plumbing.png",

    icon: Home,
  },
];