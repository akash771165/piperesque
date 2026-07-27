"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { siteConfig } from "@/lib/config/site";
import {
  ChevronDown,
  Phone,
  Clock3,
  MapPin,
} from "lucide-react";

const faqs = [
  {
    q: "What is Piperesque?",
    a: "Piperesque is an informational website that helps homeowners and businesses connect with independent plumbing service providers serving Houston and nearby communities.",
  },
  {
    q: "Do you provide emergency plumbing services?",
    a: "You can submit emergency plumbing requests 24 hours a day. Availability and response times depend on the independent plumbing service provider serving your location.",
  },
  {
    q: "What services can I request?",
    a: "You can request emergency plumbing, drain cleaning, leak detection, water heater repair, sewer line services, pipe repair, faucet repair, toilet repair and other residential or commercial plumbing services.",
  },
  {
    q: "How quickly will someone respond?",
    a: "Response times vary based on your location, traffic conditions, weather, time of day and provider availability.",
  },
  {
    q: "Do you provide pricing or estimates?",
    a: "Pricing, estimates and warranties are provided directly by the plumbing service provider after reviewing your service request.",
  },
  {
    q: "How do I request service?",
    a: "Call the phone number displayed on this website or complete our contact form. We'll help connect you with a plumbing service provider in your area.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-slate-50 py-24">

      <div className="container-custom">

        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">

          <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-bold text-blue-600">
            FREQUENTLY ASKED QUESTIONS
          </span>

          <h2 className="mt-6 text-4xl font-black text-slate-900 lg:text-5xl">
            Plumbing Questions & Answers
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Find answers to common questions about requesting plumbing services
            through Piperesque.
          </p>

        </div>

        <div className="mt-20 grid gap-10 lg:grid-cols-3">

          {/* FAQ */}

          <div className="space-y-6 lg:col-span-2">

            {faqs.map((item, index) => (

              <div
                key={item.q}
                className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition hover:border-blue-600 hover:shadow-xl"
              >

                <button
                  onClick={() => setOpen(open === index ? -1 : index)}
                  className="flex w-full items-center justify-between p-7 text-left"
                >

                  <span className="text-lg font-bold text-slate-900">
                    {item.q}
                  </span>

                  <ChevronDown
                    size={24}
                    className={`transition ${
                      open === index ? "rotate-180 text-blue-600" : ""
                    }`}
                  />

                </button>

                {open === index && (

                  <div className="border-t border-slate-100 px-7 pb-7 pt-5 leading-8 text-slate-600">
                    {item.a}
                  </div>

                )}

              </div>

            ))}

          </div>

          {/* Sidebar */}

          <aside className="overflow-hidden rounded-[32px] bg-white shadow-2xl">

            <div className="relative h-64">

              <Image
                src="/images/emergency.jpg"
                alt="Emergency plumbing assistance"
                fill
                priority
                quality={90}
                sizes="(max-width:1024px)100vw,33vw"
                className="object-cover"
              />

            </div>

            <div className="bg-gradient-to-b from-blue-700 to-blue-600 p-8 text-white">

              <Phone size={42} />

              <h3 className="mt-6 text-3xl font-black">
                Need Plumbing Assistance?
              </h3>

              <p className="mt-5 leading-8 text-blue-100">
                Call now or submit a service request to be connected with a
                plumbing service provider serving the Houston area.
              </p>

              <div className="mt-8 space-y-5">

                <div className="flex items-center gap-3">

                  <Clock3 size={20} />

                  <span>Emergency Requests Accepted 24/7</span>

                </div>

                <div className="flex items-center gap-3">

                  <MapPin size={20} />

                  <span>Houston & Nearby Communities</span>

                </div>

              </div>

              <div className="mt-10 space-y-4">

                <a
                  href={`tel:${siteConfig.phone}`}
                  className="flex w-full items-center justify-center rounded-full bg-white py-4 text-lg font-bold text-blue-700 transition hover:bg-slate-100"
                >
                  📞 {siteConfig.phoneDisplay}
                </a>

                <Link
                  href="/contact"
                  className="flex w-full items-center justify-center rounded-full border-2 border-white py-4 text-lg font-bold transition hover:bg-white hover:text-blue-700"
                >
                  Request Service
                </Link>

              </div>

              <div className="mt-8 rounded-2xl border border-white/20 bg-white/10 p-4">

                <p className="text-sm leading-6 text-blue-100">
                  Piperesque is an informational website that helps users
                  connect with independent plumbing service providers. Service
                  availability, response times, estimates and completed work are
                  determined by the selected provider.
                </p>

              </div>

            </div>

          </aside>

        </div>

      </div>

    </section>
  );
}