"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Phone,
  ArrowRight,
  Clock3,
  MapPin,
  Wrench,
  CheckCircle2,
} from "lucide-react";

import { siteConfig } from "@/lib/config/site";
import { trackPhoneCall, trackCTA } from "@/lib/gtag";

export default function CTA() {
  const handlePhoneClick = () => {
    trackPhoneCall("cta_section");
  };

  const handleRequestService = () => {
    trackCTA("cta_request_service");
  };

  return (
    <section className="relative overflow-hidden py-20 lg:py-28">
      {/* Background */}
      <Image
        src="/images/emergency.jpg"
        alt="Emergency plumbing assistance Houston"
        fill
        quality={85}
        sizes="100vw"
        className="object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-blue-950/90 to-blue-900/80" />

      <div className="container-custom relative z-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[36px] border border-white/20 bg-white/10 shadow-2xl backdrop-blur-xl">
          <div className="grid items-center lg:grid-cols-2">
            {/* LEFT CONTENT */}
            <div className="p-8 lg:p-14">
              <span className="inline-flex rounded-full bg-red-500/20 px-5 py-2 text-sm font-bold text-red-100">
                🚨 PLUMBING SERVICE REQUESTS
              </span>

              <h2 className="mt-8 text-4xl font-black leading-tight text-white lg:text-6xl">
                Need A Plumber?
                <span className="block text-blue-300">
                  Call Houston Plumbing Help
                </span>
              </h2>

              <p className="mt-6 max-w-xl text-lg leading-8 text-blue-100">
                Piperesque helps homeowners connect with independent plumbing
                service providers for emergency plumbing, drain cleaning,
                leak detection, sewer repairs, water heater services and
                other plumbing needs throughout Houston.
              </p>

              {/* SERVICES */}
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  "Emergency Plumbing",
                  "Drain Cleaning",
                  "Leak Detection",
                  "Water Heater Repair",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-white"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-green-400"
                    />

                    <span>{item}</span>
                  </div>
                ))}
              </div>

              {/* BUTTONS */}
                            <div className="mt-10 flex flex-wrap gap-4">
                <a
                  href={`tel:${siteConfig.phone}`}
                  onClick={handlePhoneClick}
                  aria-label={`Call ${siteConfig.company}`}
                  className="inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 text-lg font-black text-blue-700 shadow-xl transition hover:scale-105"
                >
                  <Phone size={22} />
                  Call {siteConfig.phoneDisplay}
                </a>

                <Link
                  href="/contact"
                  onClick={handleRequestService}
                  className="inline-flex items-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-blue-700"
                >
                  Request Service
                  <ArrowRight size={20} />
                </Link>
              </div>

              <p className="mt-6 text-sm leading-6 text-blue-100">
                Piperesque is an informational website that connects users
                with independent plumbing service providers. Availability,
                pricing, response times and services are determined by the
                selected provider.
              </p>
            </div>

            {/* IMAGE */}
            <div className="relative h-[380px] lg:h-[620px]">
              <Image
                src="/images/emergency.jpg"
                alt="Houston plumbing service provider"
                fill
                quality={85}
                sizes="(max-width:1024px)100vw,50vw"
                className="object-cover"
              />

              <div className="absolute bottom-8 left-8 rounded-3xl border border-white/20 bg-black/30 p-6 backdrop-blur-xl">
                <div className="text-3xl font-black text-white">
                  Houston
                </div>

                <div className="mt-2 text-blue-100">
                  Plumbing Service Area
                </div>
              </div>
            </div>
          </div>

          {/* TRUST CARDS */}
                    <div className="grid border-t border-white/20 md:grid-cols-3">
            <div className="p-8 text-center">
              <Clock3
                size={34}
                className="mx-auto text-white"
              />

              <h3 className="mt-5 text-xl font-bold text-white">
                Emergency Requests
              </h3>

              <p className="mt-3 text-blue-100">
                Plumbing requests can be submitted anytime.
              </p>
            </div>

            <div className="border-y border-white/20 p-8 text-center md:border-x md:border-y-0">
              <Wrench
                size={34}
                className="mx-auto text-white"
              />

              <h3 className="mt-5 text-xl font-bold text-white">
                Plumbing Services
              </h3>

              <p className="mt-3 text-blue-100">
                Residential and commercial plumbing solutions.
              </p>
            </div>

            <div className="p-8 text-center">
              <MapPin
                size={34}
                className="mx-auto text-white"
              />

              <h3 className="mt-5 text-xl font-bold text-white">
                Houston Coverage
              </h3>

              <p className="mt-3 text-blue-100">
                Connecting customers with providers across Houston areas.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}