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

    title: "24/7 Emergency Plumbing Services in Houston, TX",

    shortTitle: "Emergency Plumbing",

    seoTitle:
      "24/7 Emergency Plumber Houston | Piperesque",

    metaDescription:
      "Need an emergency plumber in Houston? Piperesque provides fast 24/7 emergency plumbing services for burst pipes, leaks, clogged drains, and urgent repairs.",

    keywords: [
      "emergency plumber houston",
      "24 hour plumber houston",
      "emergency plumbing services",
      "burst pipe repair",
      "plumber near me",
    ],

    heroTitle: "24/7 Emergency Plumbing Services",

    heroDescription:
      "Our experienced plumbers respond quickly to plumbing emergencies across Houston and surrounding areas. Whether it's a burst pipe, overflowing toilet, or major leak, we're ready to help day or night.",

    description:
      "Piperesque offers professional emergency plumbing services for residential and commercial properties. We arrive with fully equipped service vehicles to diagnose and repair plumbing emergencies quickly, minimizing water damage and restoring your plumbing system.",

    benefits: [
      "24/7 Emergency Response",
      "Licensed & Experienced Plumbers",
      "Fast Arrival Times",
      "Upfront Pricing",
      "Residential & Commercial Service",
    ],

    image: "/images/services/emergency-plumbing.jpg",

    icon: AlertTriangle,
  },

  {
    slug: "drain-cleaning",

    title: "Professional Drain Cleaning Services in Houston",

    shortTitle: "Drain Cleaning",

    seoTitle:
      "Drain Cleaning Houston, TX | Piperesque",

    metaDescription:
      "Professional drain cleaning services in Houston for clogged sinks, toilets, showers, and sewer lines. Fast, affordable, and reliable service.",

    keywords: [
      "drain cleaning houston",
      "clogged drain repair",
      "drain unclogging",
      "sewer drain cleaning",
      "sink drain cleaning",
    ],

    heroTitle: "Expert Drain Cleaning Services",

    heroDescription:
      "Slow or clogged drains can disrupt your day. Our plumbers use professional equipment to remove blockages and restore proper water flow.",

    description:
      "From kitchen sinks to main sewer lines, Piperesque provides complete drain cleaning services using modern tools and proven techniques. We remove grease, debris, roots, and stubborn clogs without damaging your plumbing.",

    benefits: [
      "Advanced Drain Cleaning Equipment",
      "Safe for Pipes",
      "Fast Service",
      "Long-Lasting Results",
      "Affordable Pricing",
    ],

    image: "/images/services/drain-cleaning.png",

    icon: Droplets,
  },
     {
    slug: "water-heater-repair",

    title: "Water Heater Repair & Installation in Houston, TX",

    shortTitle: "Water Heater Repair",

    seoTitle:
      "Water Heater Repair Houston | Piperesque",

    metaDescription:
      "Need water heater repair in Houston? We repair, replace, and install tank and tankless water heaters for homes and businesses.",

    keywords: [
      "water heater repair houston",
      "tankless water heater",
      "hot water heater repair",
      "water heater installation",
      "water heater replacement",
    ],

    heroTitle: "Reliable Water Heater Services",

    heroDescription:
      "Restore hot water quickly with professional water heater repair and installation services from Piperesque.",

    description:
      "Whether your water heater is leaking, producing no hot water, or needs complete replacement, our licensed plumbers provide fast and reliable repair and installation services for all major brands.",

    benefits: [
      "Tank & Tankless Water Heaters",
      "Same-Day Service",
      "Energy-Efficient Solutions",
      "Licensed Technicians",
      "Upfront Pricing",
    ],

    image: "/images/services/water-heater-repair.png",

    icon: Flame,
  },

  {
    slug: "leak-detection",

    title: "Professional Leak Detection Services in Houston",

    shortTitle: "Leak Detection",

    seoTitle:
      "Leak Detection Houston, TX | Piperesque",

    metaDescription:
      "Accurate leak detection services for homes and businesses in Houston. Find hidden water leaks before they cause expensive damage.",

    keywords: [
      "leak detection houston",
      "water leak repair",
      "slab leak detection",
      "hidden pipe leak",
      "plumbing leak service",
    ],

    heroTitle: "Fast & Accurate Leak Detection",

    heroDescription:
      "Hidden plumbing leaks can waste water and damage your property. We use advanced equipment to locate leaks quickly and accurately.",

    description:
      "Piperesque provides non-invasive leak detection services using modern diagnostic technology. We identify hidden leaks behind walls, under floors, and inside underground plumbing systems.",

    benefits: [
      "Non-Invasive Detection",
      "Advanced Equipment",
      "Prevent Water Damage",
      "Fast Diagnosis",
      "Affordable Repairs",
    ],

    image: "/images/services/leak-detection.jpg",

    icon: Pipette,
  },
      {
    slug: "pipe-repair",

    title: "Professional Pipe Repair Services in Houston, TX",

    shortTitle: "Pipe Repair",

    seoTitle:
      "Pipe Repair Houston, TX | Piperesque",

    metaDescription:
      "Expert pipe repair services in Houston for leaking, frozen, broken, and damaged water or sewer pipes. Fast response and lasting repairs.",

    keywords: [
      "pipe repair houston",
      "burst pipe repair",
      "water pipe repair",
      "leaking pipe repair",
      "plumbing pipe replacement",
    ],

    heroTitle: "Reliable Pipe Repair Services",

    heroDescription:
      "From minor leaks to major pipe damage, Piperesque provides professional pipe repair services that restore your plumbing system quickly and efficiently.",

    description:
      "Our licensed plumbers diagnose and repair damaged water and sewer pipes using modern repair techniques. We minimize disruption while ensuring durable, long-lasting results for residential and commercial properties.",

    benefits: [
      "Fast Pipe Repairs",
      "Leak Detection Included",
      "Modern Repair Methods",
      "Residential & Commercial",
      "Licensed Plumbers",
    ],

    image: "/images/services/pipe-repair.png",

    icon: Wrench,
  },

  {
    slug: "sewer-line-repair",

    title: "Sewer Line Repair Services in Houston, TX",

    shortTitle: "Sewer Line Repair",

    seoTitle:
      "Sewer Line Repair Houston | Piperesque",

    metaDescription:
      "Professional sewer line repair and replacement services in Houston. We fix blocked, damaged, and broken sewer lines quickly and efficiently.",

    keywords: [
      "sewer line repair houston",
      "sewer pipe repair",
      "sewer replacement",
      "drain line repair",
      "underground sewer repair",
    ],

    heroTitle: "Professional Sewer Line Repair",

    heroDescription:
      "Damaged sewer lines can create serious plumbing issues. Our experienced plumbers provide reliable sewer inspections, repairs, and replacements.",

    description:
      "Piperesque uses modern inspection equipment to diagnose sewer line problems accurately. We repair cracked, collapsed, and blocked sewer lines with minimal disruption to your property.",

    benefits: [
      "Camera Sewer Inspection",
      "Accurate Diagnosis",
      "Long-Term Repairs",
      "Minimal Property Damage",
      "Emergency Service Available",
    ],

    image: "/images/services/sewer-line-repair.png",

    icon: ShowerHead,
  },

  {
    slug: "toilet-repair",

    title: "Toilet Repair Services in Houston, TX",

    shortTitle: "Toilet Repair",

    seoTitle:
      "Toilet Repair Houston, TX | Piperesque",

    metaDescription:
      "Professional toilet repair services in Houston for clogged, leaking, overflowing, or constantly running toilets. Fast and affordable plumbing solutions.",

    keywords: [
      "toilet repair houston",
      "clogged toilet repair",
      "running toilet repair",
      "toilet leak repair",
      "plumber for toilet repair",
    ],

    heroTitle: "Professional Toilet Repair Services",

    heroDescription:
      "Whether your toilet is leaking, clogged, or continuously running, our experienced plumbers provide fast and reliable repairs throughout Houston.",

    description:
      "Piperesque offers complete toilet repair services for residential and commercial properties. We repair flushing issues, leaks, damaged components, and install new toilets when replacement is the better option.",

    benefits: [
      "Fast Toilet Repairs",
      "Leak & Flush Repairs",
      "Toilet Installation Available",
      "Affordable Pricing",
      "Same-Day Service",
    ],

    image: "/images/services/toilet-repair.jpg",

    icon: Toilet,
  },
    {
    slug: "faucet-repair",

    title: "Faucet Repair & Replacement Services in Houston",

    shortTitle: "Faucet Repair",

    seoTitle:
      "Faucet Repair Houston, TX | Piperesque",

    metaDescription:
      "Expert faucet repair and replacement services for kitchens, bathrooms, and commercial properties throughout Houston.",

    keywords: [
      "faucet repair houston",
      "kitchen faucet repair",
      "bathroom faucet replacement",
      "leaky faucet repair",
      "plumbing faucet service",
    ],

    heroTitle: "Expert Faucet Repair Services",

    heroDescription:
      "Stop dripping faucets and water waste with professional faucet repair and replacement services from Piperesque.",

    description:
      "We repair and replace all types of kitchen, bathroom, utility room, and commercial faucets. Our plumbers work with all major faucet brands and provide long-lasting repairs.",

    benefits: [
      "Repair All Faucet Brands",
      "Kitchen & Bathroom Faucets",
      "Leak Elimination",
      "Modern Fixture Installation",
      "Licensed Professionals",
    ],

    image: "/images/services/faucet-repair.png",

    icon: Bath,
  },

  {
    slug: "commercial-plumbing",

    title: "Commercial Plumbing Services in Houston, TX",

    shortTitle: "Commercial Plumbing",

    seoTitle:
      "Commercial Plumbing Houston, TX | Piperesque",

    metaDescription:
      "Reliable commercial plumbing services for offices, restaurants, retail stores, warehouses, and commercial buildings throughout Houston.",

    keywords: [
      "commercial plumber houston",
      "commercial plumbing services",
      "business plumbing repair",
      "commercial drain cleaning",
      "commercial plumbing contractor",
    ],

    heroTitle: "Professional Commercial Plumbing Services",

    heroDescription:
      "Piperesque provides dependable commercial plumbing solutions designed to minimize downtime and keep your business running efficiently.",

    description:
      "Our commercial plumbing team handles repairs, maintenance, installations, drain cleaning, leak detection, water heaters, sewer lines, and emergency plumbing for businesses of every size throughout Houston.",

    benefits: [
      "Licensed Commercial Plumbers",
      "Emergency Commercial Service",
      "Preventive Maintenance",
      "Minimal Business Downtime",
      "Upfront Pricing",
    ],

    image: "/images/services/commercial-plumbing.png",

    icon: Building2,
  },

  {
    slug: "residential-plumbing",

    title: "Residential Plumbing Services in Houston, TX",

    shortTitle: "Residential Plumbing",

    seoTitle:
      "Residential Plumbing Houston, TX | Piperesque",

    metaDescription:
      "Complete residential plumbing services for homes in Houston. Repairs, installations, drain cleaning, leak detection, water heaters, and emergency plumbing.",

    keywords: [
      "residential plumber houston",
      "home plumbing services",
      "house plumber",
      "plumbing repair houston",
      "local plumber",
    ],

    heroTitle: "Complete Residential Plumbing Solutions",

    heroDescription:
      "From small plumbing repairs to complete system installations, Piperesque delivers dependable residential plumbing services across Houston.",

    description:
      "Our experienced plumbers provide comprehensive plumbing services for homeowners, including leak repairs, drain cleaning, fixture installation, water heater services, pipe repairs, and emergency plumbing support.",

    benefits: [
      "Friendly Local Plumbers",
      "Same-Day Service Available",
      "Affordable Pricing",
      "Licensed & Insured",
      "100% Customer Satisfaction",
    ],

    image: "/images/services/residential-plumbing.png",

    icon: Home,
  },
];