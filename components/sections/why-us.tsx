"use client";

import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import {
  Clock3,
  BadgeCheck,
  Wrench,
  PhoneCall,
  MapPin,
  Home,
  Building2,
  ClipboardCheck,
} from "lucide-react";

const features = [
  {
    icon: Clock3,
    title: "24/7 Emergency Assistance",
    desc: "Emergency plumbing requests can be submitted any time, including nights, weekends and holidays.",
  },
  {
    icon: PhoneCall,
    title: "Quick Connection",
    desc: "We'll help connect you with a local plumbing service provider serving the Houston area.",
  },
  {
    icon: Wrench,
    title: "Complete Plumbing Services",
    desc: "Emergency plumbing, drain cleaning, leak detection, sewer line repair, water heater services and more.",
  },
  {
    icon: Home,
    title: "Residential Plumbing",
    desc: "Support for houses, apartments, condos and other residential properties.",
  },
  {
    icon: Building2,
    title: "Commercial Plumbing",
    desc: "Commercial plumbing solutions for offices, retail stores and business facilities.",
  },
  {
    icon: MapPin,
    title: "Houston Coverage",
    desc: "Helping customers find plumbing services throughout Houston and nearby communities.",
  },
  {
    icon: BadgeCheck,
    title: "Simple Request Process",
    desc: "Call the phone number or submit a request online to get started.",
  },
  {
    icon: ClipboardCheck,
    title: "Service Information",
    desc: "We'll help guide your plumbing request and provide general service information.",
  },
];

export default function WhyUs() {
  return (
    <section className="bg-white py-20 lg:py-24">

      <div className="container-custom">

        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-bold text-blue-600">
            WHY Piperesque
          </span>

          <h2 className="mt-6 text-4xl font-black text-slate-900 lg:text-5xl">
            Helping You Find Plumbing Services in Houston
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Piperesque is an informational website that helps homeowners and
            businesses connect with local plumbing service providers for
            emergency plumbing, drain cleaning, leak detection, sewer line
            services, water heater repair and other plumbing needs.
          </p>

        </div>

        {/* Main Content */}

        <div className="mt-16 grid items-center gap-16 lg:grid-cols-2">

          {/* Image */}

          <div className="relative overflow-hidden rounded-[40px] shadow-2xl">

            <Image
              src="/images/about.png"
              alt="Local plumbing professionals serving Houston"
              width={900}
              height={700}
              quality={90}
              sizes="(max-width:768px) 100vw, 50vw"
              className="h-[420px] w-full object-cover lg:h-[700px]"
            />

          </div>

          {/* Feature Cards */}

          <div className="grid gap-6 sm:grid-cols-2">

            {features.map((item) => {

              const Icon = item.icon;

              return (

                <div
                  key={item.title}
                  className="rounded-3xl border border-slate-200 bg-slate-50 p-7 transition hover:-translate-y-2 hover:border-blue-600 hover:bg-white hover:shadow-xl"
                >

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100">

                    <Icon className="h-8 w-8 text-blue-600" />

                  </div>

                  <h3 className="mt-6 text-xl font-bold text-slate-900">
                    {item.title}
                  </h3>

                  <p className="mt-3 leading-7 text-slate-600">
                    {item.desc}
                  </p>

                </div>

              );

            })}

          </div>

        </div>

        {/* Information */}

        <div className="mt-16 rounded-3xl border border-blue-100 bg-blue-50 p-8">

          <h3 className="text-2xl font-bold text-slate-900">
            How Piperesque Works
          </h3>

          <p className="mt-4 leading-8 text-slate-600">
            Piperesque is an informational website that helps users connect
            with independent plumbing service providers. Piperesque does not
            directly perform plumbing work, dispatch technicians, guarantee
            arrival times, or determine pricing. Availability, scheduling,
            estimates and completed services are provided by the selected
            plumbing company.
          </p>

        </div>

        {/* CTA */}

        <div className="mt-20 rounded-[32px] bg-gradient-to-r from-blue-700 to-blue-600 p-10 text-white lg:flex lg:items-center lg:justify-between">

          <div>

            <h3 className="text-3xl font-black lg:text-4xl">
              Need Plumbing Assistance?
            </h3>

            <p className="mt-4 max-w-2xl text-blue-100">
              Call now or submit a service request to be connected with a local
              plumbing service provider serving the Houston area.
            </p>

          </div>

          <div className="mt-8 flex flex-wrap gap-4 lg:mt-0">

            <a
              href={`tel:${siteConfig.phone}`}
              className="rounded-full bg-white px-8 py-4 font-bold text-blue-700 transition hover:bg-slate-100"
            >
              📞 {siteConfig.phoneDisplay}
            </a>

            <Link
              href="/contact"
              className="rounded-full border-2 border-white px-8 py-4 font-bold transition hover:bg-white hover:text-blue-700"
            >
              Request Service
            </Link>

          </div>

        </div>

      </div>

    </section>
  );
}