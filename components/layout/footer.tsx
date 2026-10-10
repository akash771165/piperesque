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

const companyLinks = [
  { title: "Home", href: "/" },
  { title: "About Us", href: "/about" },
  { title: "All Plumbing Services", href: "/services" },
  { title: "Service Areas", href: "/service-areas" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

const legalLinks = [
  { title: "Privacy Policy", href: "/privacy-policy" },
  { title: "Terms & Conditions", href: "/terms" },
];

const serviceFeatures = [
  "Emergency Plumbing Information",
  "Drain Cleaning Options",
  "Leak Detection Information",
  "Sewer Line Repair Options",
];

export default function Footer() {
  return (
    <footer className="relative isolate overflow-hidden bg-slate-950 text-white">
      {/* Decorative background image */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-20"
      >
        <Image
          src="/images/map.png"
          alt=""
          fill
          priority={false}
          quality={65}
          sizes="100vw"
          className="object-cover opacity-10"
        />
      </div>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-slate-950/95 via-slate-950/95 to-black"
      />

      {/* Call to action */}
      <section
        aria-labelledby="footer-cta-heading"
        className="border-b border-slate-800"
      >
        <div className="container-custom flex flex-col items-center justify-between gap-8 py-12 text-center lg:flex-row lg:text-left">
          <div className="max-w-3xl">
            <span className="inline-flex rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-xs font-bold uppercase tracking-[0.15em] text-blue-300">
              Houston Plumbing Information
            </span>

            <h2
              id="footer-cta-heading"
              className="mt-5 text-3xl font-black leading-tight sm:text-4xl lg:text-5xl"
            >
              Need Help With a Plumbing Problem?
            </h2>

            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
              Explore plumbing service information and submit a request to
              connect with an independent plumbing service provider serving
              Houston and nearby communities.
            </p>

            <p className="mt-3 text-sm leading-6 text-slate-400">
              Provider availability, response times and service terms vary.
            </p>
          </div>

          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <a
              href={`tel:${siteConfig.phone}`}
              aria-label={`Call Piperesque at ${siteConfig.phoneDisplay}`}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-blue-600 px-7 py-4 font-bold text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              <Phone size={18} aria-hidden="true" />
              {siteConfig.phoneDisplay}
            </a>

            <Link
              href="/contact"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-slate-600 px-7 py-4 font-bold text-white transition-colors hover:border-white hover:bg-white hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950"
            >
              Request Service
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      {/* Main footer */}
      <div className="container-custom py-16 lg:py-20">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10">
          {/* Company information */}
          <div>
            <Link
              href="/"
              aria-label="Piperesque home"
              className="inline-flex items-center gap-4 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white">
                <Wrench size={25} aria-hidden="true" />
              </span>

              <span>
                <span className="block text-2xl font-black tracking-tight">
                  Piperesque
                </span>
                <span className="mt-1 block text-sm text-slate-400">
                  Houston Plumbing Information
                </span>
              </span>
            </Link>

            <p className="mt-6 text-sm leading-7 text-slate-300">
              Piperesque helps homeowners explore plumbing information and
              submit requests to connect with independent plumbing service
              providers serving Houston, Texas, and nearby communities.
            </p>

            <p className="mt-4 text-sm leading-7 text-slate-400">
              Plumbing services are provided by independent third parties.
              Scheduling, pricing, availability, warranties and workmanship
              depend on the provider accepting a request.
            </p>

            <ul className="mt-6 space-y-3">
              {serviceFeatures.map((feature) => (
                <li
                  key={feature}
                  className="flex items-start gap-3 text-sm text-slate-300"
                >
                  <CheckCircle2
                    size={18}
                    className="mt-0.5 shrink-0 text-blue-400"
                    aria-hidden="true"
                  />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Service links */}
          <nav aria-label="Plumbing services">
            <h2 className="mb-6 text-lg font-bold text-white">
              Plumbing Services
            </h2>

            <ul className="space-y-4">
              {services.map((service) => (
                <li key={service.href}>
                  <Link
                    href={service.href}
                    className="group inline-flex items-start gap-2 text-sm leading-6 text-slate-400 transition-colors hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    <ArrowRight
                      size={15}
                      className="mt-1 shrink-0 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                    <span>{service.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Company links */}
          <nav aria-label="Company navigation">
            <h2 className="mb-6 text-lg font-bold text-white">
              Explore Piperesque
            </h2>

            <ul className="space-y-4">
              {companyLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-blue-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    <ArrowRight
                      size={15}
                      className="shrink-0 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                    {item.title}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Contact information */}
          <div>
            <h2 className="mb-6 text-lg font-bold text-white">
              Contact Information
            </h2>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <Phone
                  size={20}
                  className="mt-0.5 shrink-0 text-blue-400"
                  aria-hidden="true"
                />

                <div className="min-w-0">
                  <h3 className="font-semibold text-white">Phone</h3>
                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="mt-1 inline-block break-words text-sm leading-6 text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    {siteConfig.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail
                  size={20}
                  className="mt-0.5 shrink-0 text-blue-400"
                  aria-hidden="true"
                />

                <div className="min-w-0">
                  <h3 className="font-semibold text-white">Email</h3>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="mt-1 inline-block break-all text-sm leading-6 text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin
                  size={20}
                  className="mt-0.5 shrink-0 text-blue-400"
                  aria-hidden="true"
                />

                <div>
                  <h3 className="font-semibold text-white">Service Area</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Houston, Texas and nearby communities
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock3
                  size={20}
                  className="mt-0.5 shrink-0 text-blue-400"
                  aria-hidden="true"
                />

                <div>
                  <h3 className="font-semibold text-white">
                    Service Requests
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">
                    Online requests can be submitted anytime. This does not
                    guarantee immediate provider availability or a 24/7
                    response.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-14 rounded-2xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <p className="text-xs leading-6 text-slate-400 sm:text-sm sm:leading-7">
            <strong className="font-semibold text-slate-200">
              Important disclaimer:
            </strong>{" "}
            Piperesque is an informational website that helps homeowners
            connect with independent third-party plumbing service providers.
            Piperesque does not itself employ, dispatch or directly provide
            plumbing services. The independent provider is responsible for
            determining service availability, response times, scheduling,
            pricing, warranties and workmanship. Submitting a request or
            calling the listed number does not guarantee service or a specific
            response time.
          </p>
        </div>

        {/* Bottom navigation and copyright */}
        <div className="mt-8 flex flex-col items-center justify-between gap-5 border-t border-slate-800 pt-8 text-center sm:flex-row sm:text-left">
          <p className="text-xs leading-6 text-slate-500 sm:text-sm">
            © {new Date().getFullYear()} Piperesque. All rights reserved.
          </p>

          <nav aria-label="Legal and contact links">
            <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
              {legalLinks.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-xs text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:text-sm"
                  >
                    {item.title}
                  </Link>
                </li>
              ))}

              <li>
                <Link
                  href="/contact"
                  className="text-xs text-slate-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 sm:text-sm"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
