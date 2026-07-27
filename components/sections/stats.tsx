"use client";

import Image from "next/image";
import {
  Clock3,
  PhoneCall,
  Wrench,
  MapPin,
  Home,
  Building2,
} from "lucide-react";

const highlights = [
  {
    icon: Clock3,
    title: "24/7 Emergency Assistance",
    desc: "Emergency plumbing assistance is available throughout the day and night for urgent service requests.",
  },
  {
    icon: PhoneCall,
    title: "Request Plumbing Assistance",
    desc: "Call or submit a service request to be connected with a local plumbing service provider.",
  },
  {
    icon: Wrench,
    title: "Plumbing Services",
    desc: "Emergency plumbing, drain cleaning, leak detection, water heater repair, sewer line services and more.",
  },
  {
    icon: Home,
    title: "Residential Plumbing",
    desc: "Helping homeowners request plumbing assistance for common residential plumbing issues.",
  },
  {
    icon: Building2,
    title: "Commercial Plumbing",
    desc: "Support for commercial plumbing service requests across the Houston area.",
  },
  {
    icon: MapPin,
    title: "Houston Service Area",
    desc: "Serving Houston and surrounding communities through our local plumbing service network.",
  },
];

export default function Stats() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-24">

      <Image
        src="/images/emergency.jpg"
        alt="Emergency plumbing assistance in Houston"
        fill
        quality={90}
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-blue-950/80" />

      <div className="container-custom relative z-10">

        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-bold text-white backdrop-blur">
            24/7 EMERGENCY ASSISTANCE
          </span>

          <h2 className="mt-6 text-4xl font-black leading-tight text-white lg:text-5xl">
            Plumbing Assistance Throughout Houston
          </h2>

          <p className="mt-6 text-lg leading-8 text-blue-100">
            Piperesque helps homeowners and businesses request plumbing
            assistance for emergency plumbing, drain cleaning, leak detection,
            sewer line services, water heater repair, and other plumbing needs
            throughout Houston and nearby communities.
          </p>

        </div>

        {/* Feature Cards */}

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

          {highlights.map((item) => {

            const Icon = item.icon;

            return (

              <div
                key={item.title}
                className="rounded-3xl border border-white/20 bg-white/10 p-8 backdrop-blur-lg transition duration-300 hover:-translate-y-2 hover:bg-white/20"
              >

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-blue-600">

                  <Icon size={30} />

                </div>

                <h3 className="mt-6 text-2xl font-bold text-white">
                  {item.title}
                </h3>

                <p className="mt-4 leading-7 text-blue-100">
                  {item.desc}
                </p>

              </div>

            );

          })}

        </div>

        {/* Disclaimer */}

        <div className="mx-auto mt-16 max-w-5xl rounded-3xl border border-white/20 bg-white/10 p-8 text-center backdrop-blur-lg">

          <h3 className="text-2xl font-bold text-white">
            Important Information
          </h3>

          <p className="mt-5 leading-8 text-blue-100">
            Piperesque is an informational website that helps connect users
            with local plumbing service providers. Plumbing services are
            performed by independent providers. Service availability, response
            times, pricing, and coverage may vary depending on location and
            provider availability.
          </p>

        </div>

      </div>

    </section>
  );
}