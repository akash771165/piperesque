"use client";

import Link from "next/link";
import Image from "next/image";
import {
    Phone,
    Mail,
    MapPin,
    Clock3,
    Wrench,
    ArrowRight,
    CheckCircle2,
} from "lucide-react";
import { siteConfig } from "@/lib/config/site";

const services = [
    {
        title: "Emergency Plumbing",
        href: "/services/emergency-plumbing",
    },
    {
        title: "Drain Cleaning",
        href: "/services/drain-cleaning",
    },
    {
        title: "Leak Detection",
        href: "/services/leak-detection",
    },
    {
        title: "Water Heater Repair",
        href: "/services/water-heater-repair",
    },
    {
        title: "Sewer Line Repair",
        href: "/services/sewer-line-repair",
    },
    {
        title: "Residential Plumbing",
        href: "/services/residential-plumbing",
    },
];

const company = [
    { title: "Home", href: "/" },
    { title: "About Us", href: "/about" },
    { title: "Services", href: "/services" },
    { title: "Service Areas", href: "/service-areas" },
    { title: "Blog", href: "/blog" },
    { title: "Contact", href: "/contact" },
];

export default function Footer() {
    return (
        <footer className="relative overflow-hidden bg-slate-950 text-white">

            {/* Background */}

            <Image
                src="/images/map.png"
                alt="Houston plumbing service area map"
                fill
                priority={false}
                quality={75}
                sizes="100vw"
                className="object-cover opacity-10"
            />

            <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/95 to-black" />

            <div className="relative z-10">

                {/* Top CTA */}

               <div className="border-b border-slate-800">

  <div className="container-custom flex flex-col items-center justify-between gap-8 py-14 text-center lg:flex-row lg:text-left">

    <div>

      <span className="rounded-full bg-blue-600/20 px-5 py-2 text-sm font-bold text-blue-300">
        PLUMBING SERVICE REQUESTS
      </span>

      <h2 className="mt-6 text-3xl font-black lg:text-5xl">
        Need Plumbing Assistance?
      </h2>

      <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-300">
        Piperesque helps homeowners submit plumbing service requests and
        connect with independent plumbing service providers serving Houston
        and nearby communities.
      </p>

    </div>

    <div className="flex flex-wrap justify-center gap-4">

      <a
        href={`tel:${siteConfig.phone}`}
        className="rounded-full bg-blue-600 px-8 py-4 font-bold transition hover:bg-blue-700"
      >
        📞 {siteConfig.phoneDisplay}
      </a>

      <Link
        href="/contact"
        className="rounded-full border border-white/30 px-8 py-4 font-bold transition hover:bg-white hover:text-slate-900"
      >
        Request Service
      </Link>

    </div>

  </div>

</div>
                {/* Footer */}

                <div className="container-custom py-20">

                    <div className="grid gap-14 lg:grid-cols-4">

                        {/* Company */}

                        {/* Company */}

<div>

  <div className="flex items-center gap-4">

    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600">

      <Wrench size={28} />

    </div>

    <div>

      <h2 className="text-3xl font-black">
        Piperesque
      </h2>

      <p className="text-sm text-slate-400">
        Houston Plumbing Information
      </p>

    </div>

  </div>

  <p className="mt-6 leading-8 text-slate-400">
    Piperesque is an informational website that helps homeowners submit
    plumbing service requests and connect with independent plumbing service
    providers throughout the Houston area.
  </p>

  <p className="mt-4 leading-8 text-slate-500">
    Service availability, response times, scheduling, warranties and pricing
    are determined by the plumbing company that accepts your request.
  </p>

  <div className="mt-8 space-y-3">

    {[
      "Emergency Plumbing Requests",
      "Drain Cleaning",
      "Leak Detection",
      "Water Heater Services",
    ].map((item) => (

      <div
        key={item}
        className="flex items-center gap-2 text-slate-300"
      >

        <CheckCircle2
          size={18}
          className="text-green-400"
        />

        {item}

      </div>

    ))}

  </div>

</div>
                      {/* Services */}

<div>

  <h3 className="mb-6 text-2xl font-bold">
    Plumbing Services
  </h3>

  <ul className="space-y-4">

    {services.map((service) => (

      <li key={service.href}>

        <Link
          href={service.href}
          className="flex items-center gap-2 text-slate-400 transition hover:text-blue-400"
        >

          <ArrowRight size={16} />

          {service.title}

        </Link>

      </li>

    ))}

  </ul>

</div>

{/* Quick Links */}

<div>

  <h3 className="mb-6 text-2xl font-bold">
    Quick Links
  </h3>

  <ul className="space-y-4">

    {company.map((item) => (

      <li key={item.href}>

        <Link
          href={item.href}
          className="flex items-center gap-2 text-slate-400 transition hover:text-blue-400"
        >

          <ArrowRight size={16} />

          {item.title}

        </Link>

      </li>

    ))}

    <li>

      <Link
        href="/privacy-policy"
        className="flex items-center gap-2 text-slate-400 transition hover:text-blue-400"
      >

        <ArrowRight size={16} />

        Privacy Policy

      </Link>

    </li>

    <li>

      <Link
        href="/terms"
        className="flex items-center gap-2 text-slate-400 transition hover:text-blue-400"
      >

        <ArrowRight size={16} />

        Terms & Conditions

      </Link>

    </li>

  </ul>

</div>      {/* Contact */}

<div>

  <h3 className="mb-6 text-2xl font-bold">
    Contact
  </h3>

  <div className="space-y-7">

    <div className="flex gap-4">

      <Phone className="mt-1 text-blue-500" />

      <div>

        <h4 className="font-bold">
          Call
        </h4>

        <a
          href={`tel:${siteConfig.phone}`}
          className="text-slate-400 transition hover:text-white"
        >
          {siteConfig.phoneDisplay}
        </a>

      </div>

    </div>

    <div className="flex gap-4">

      <Mail className="mt-1 text-blue-500" />

      <div>

        <h4 className="font-bold">
          Email
        </h4>

        <a
          href={`mailto:${siteConfig.email}`}
          className="text-slate-400 transition hover:text-white"
        >
          {siteConfig.email}
        </a>

      </div>

    </div>

    <div className="flex gap-4">

      <MapPin className="mt-1 text-blue-500" />

      <div>

        <h4 className="font-bold">
          Service Area
        </h4>

        <p className="text-slate-400">
          Houston, Texas & Nearby Communities
        </p>

      </div>

    </div>

    <div className="flex gap-4">

      <Clock3 className="mt-1 text-blue-500" />

      <div>

        <h4 className="font-bold">
          Service Requests
        </h4>

        <p className="text-slate-400">
          Requests can be submitted online anytime. Provider availability may vary.
        </p>

      </div>

    </div>

  </div>

</div>

</div>

{/* Bottom */}

<div className="mt-20 border-t border-slate-800 pt-8">

  <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6">

    <p className="text-sm leading-7 text-slate-500">
      <strong className="text-slate-300">Disclaimer:</strong> Piperesque is an
      independent informational website that helps homeowners connect with
      third-party plumbing service providers. Piperesque does not employ,
      dispatch, or directly provide plumbing services. Service availability,
      pricing, response times, warranties and workmanship are determined solely
      by the independent plumbing company selected.
    </p>

  </div>

  <div className="mt-8 flex flex-col items-center justify-between gap-6 text-center lg:flex-row">

    <p className="text-slate-500">
      © 2026 Piperesque. All Rights Reserved.
    </p>

    <div className="flex flex-wrap justify-center gap-8 text-slate-500">

      <Link
        href="/privacy-policy"
        className="transition hover:text-white"
      >
        Privacy Policy
      </Link>

      <Link
        href="/terms"
        className="transition hover:text-white"
      >
        Terms & Conditions
      </Link>

      <Link
        href="/contact"
        className="transition hover:text-white"
      >
        Contact
      </Link>

    </div>

  </div>

</div>

</div>

</div>

</footer>
);
}