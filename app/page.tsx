import type { Metadata } from "next";
import dynamic from "next/dynamic";

import Navbar from "@/components/layout/navbar";
import Hero from "@/components/sections/hero";
import Footer from "@/components/layout/footer";

const Services = dynamic(
  () => import("@/components/sections/services"),
  {
    loading: () => null,
    ssr: true,
  }
);

const WhyUs = dynamic(
  () => import("@/components/sections/why-us"),
  {
    loading: () => null,
    ssr: true,
  }
);

const Stats = dynamic(
  () => import("@/components/sections/stats"),
  {
    loading: () => null,
    ssr: true,
  }
);

const Testimonials = dynamic(
  () => import("@/components/sections/testimonials"),
  {
    loading: () => null,
    ssr: true,
  }
);

const FAQ = dynamic(
  () => import("@/components/sections/faq"),
  {
    loading: () => null,
    ssr: true,
  }
);

const CTA = dynamic(
  () => import("@/components/sections/cta"),
  {
    loading: () => null,
    ssr: true,
  }
);

export const metadata: Metadata = {
  title: "24/7 Emergency Plumbing Services in Houston, TX",

  description:
    "24/7 emergency plumber in Houston, TX. Fast drain cleaning, leak detection, water heater repair, sewer line repair, and residential plumbing services.",

  keywords: [
    "Emergency Plumber Houston",
    "Houston Plumber",
    "24/7 Emergency Plumbing",
    "Emergency Plumbing Houston TX",
    "Drain Cleaning Houston",
    "Leak Detection Houston",
    "Water Heater Repair Houston",
    "Water Heater Installation",
    "Pipe Repair Houston",
    "Sewer Line Repair Houston",
    "Residential Plumbing",
    "Commercial Plumbing",
    "Licensed Plumber Houston",
    "Houston Plumbing Company",
  ],

  alternates: {
    canonical: "https://www.piperesque.com/",
  },

  openGraph: {
    title: "24/7 Emergency Plumbing Services in Houston | Piperesque",

    description:
      "24/7 emergency plumber in Houston, TX. Fast drain cleaning, leak detection, sewer repair and water heater services.",

    url: "https://www.piperesque.com/",

    type: "website",

    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Piperesque Emergency Plumbing Services",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: "Piperesque | Emergency Plumbing Houston",

    description:
      "24/7 emergency plumber in Houston, TX. Drain cleaning, leak detection, sewer repair and water heater services.",

    images: ["/og-image.png"],
  },
};

export default function Home() {
  return (
    <main className="overflow-x-hidden bg-white">
      <Navbar />

      <Hero />

      <Services />

      <WhyUs />

      <Stats />

      <Testimonials />

      <FAQ />

      <CTA />

      <Footer />
    </main>
  );
}