"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import {
  Menu,
  X,
  Phone,
  Wrench,
  ChevronDown,
  Clock,
  Droplets,
  Flame,
  AlertTriangle,
  Home,
  ShieldAlert,
} from "lucide-react";

const serviceDropdownLinks = [
  {
    title: "Emergency Plumbing",
    href: "/services/emergency-plumbing",
    description: "Urgent help for burst pipes & active leaks",
    icon: AlertTriangle,
  },
  {
    title: "Drain Cleaning",
    href: "/services/drain-cleaning",
    description: "Clogged sinks, tubs, and slow drains",
    icon: Droplets,
  },
  {
    title: "Leak Detection",
    href: "/services/leak-detection",
    description: "Hidden leaks and slab leak diagnosis",
    icon: ShieldAlert,
  },
  {
    title: "Sewer Line Repair",
    href: "/services/sewer-line-repair",
    description: "Main sewer backups and line inspections",
    icon: Wrench,
  },
  {
    title: "Water Heater Repair",
    href: "/services/water-heater-repair",
    description: "No hot water, tank leaks, and replacements",
    icon: Flame,
  },
  {
    title: "Residential Plumbing",
    href: "/services/residential-plumbing",
    description: "General home plumbing repairs and fixtures",
    icon: Home,
  },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mobileServicesOpen, setMobileServicesOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close desktop dropdown when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setServicesOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setServicesOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-white text-xs border-b border-slate-800">
        <div className="container-custom flex h-9 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">
              Houston Plumbing Referral Hotline • Call (877) 364-0861
            </span>
          </div>

          <div className="hidden items-center gap-6 md:flex text-slate-300">
            <span className="flex items-center gap-1.5">
              <Clock size={13} className="text-amber-400" />
              Plumbing Requests Accepted Anytime
            </span>
            <span className="text-slate-500">|</span>
            <a
              href={`tel:${siteConfig.phone}`}
              className="font-bold text-amber-400 hover:text-amber-300 transition"
            >
              Direct: {siteConfig.phoneDisplay}
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="container-custom flex h-20 items-center justify-between">
          {/* Logo & Descriptor */}
          <Link
            href="/"
            aria-label={`${siteConfig.company} Home`}
            className="flex items-center gap-3.5 group shrink-0"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white transition group-hover:bg-blue-700">
              <Wrench size={22} className="text-amber-400" />
            </div>

            <div>
              <span className="text-xl font-black tracking-tight text-slate-950 block leading-tight">
                {siteConfig.company}
              </span>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Houston Plumbing Help
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            <Link
              href="/"
              className="text-sm font-semibold text-slate-700 transition hover:text-blue-700"
            >
              Home
            </Link>

            {/* Services Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setServicesOpen(!servicesOpen)}
                onMouseEnter={() => setServicesOpen(true)}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
                className="flex items-center gap-1 text-sm font-semibold text-slate-700 transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-md py-1"
              >
                <span>Plumbing Services</span>
                <ChevronDown
                  size={15}
                  className={`text-slate-400 transition-transform duration-200 ${
                    servicesOpen ? "rotate-180 text-blue-700" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {servicesOpen && (
                <div
                  onMouseLeave={() => setServicesOpen(false)}
                  className="absolute left-0 top-full mt-2 w-80 rounded-2xl border border-slate-200 bg-white p-3 shadow-2xl transition-all z-50"
                  role="menu"
                  aria-orientation="vertical"
                >
                  <div className="space-y-1">
                    {serviceDropdownLinks.map((service) => {
                      const Icon = service.icon;
                      return (
                        <Link
                          key={service.href}
                          href={service.href}
                          onClick={() => setServicesOpen(false)}
                          role="menuitem"
                          className="flex items-start gap-3 rounded-xl p-2.5 transition hover:bg-slate-50 group"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white transition">
                            <Icon size={18} aria-hidden="true" />
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900 group-hover:text-blue-700 transition">
                              {service.title}
                            </p>
                            <p className="text-xs text-slate-500 leading-snug">
                              {service.description}
                            </p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>

                  <div className="mt-2 border-t border-slate-100 pt-2 px-2">
                    <Link
                      href="/services"
                      onClick={() => setServicesOpen(false)}
                      className="block text-center text-xs font-bold text-blue-700 hover:text-blue-800 py-1.5"
                    >
                      View All 10 Services →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href="/service-areas"
              className="text-sm font-semibold text-slate-700 transition hover:text-blue-700"
            >
              Service Areas
            </Link>

            <Link
              href="/blog"
              className="text-sm font-semibold text-slate-700 transition hover:text-blue-700"
            >
              Plumbing Guide
            </Link>

            <Link
              href="/about"
              className="text-sm font-semibold text-slate-700 transition hover:text-blue-700"
            >
              About
            </Link>
          </nav>

          {/* Desktop Call Now Button (Primary Conversion Action) */}
          <div className="hidden items-center gap-3 md:flex">
            <a
              href={`tel:${siteConfig.phone}`}
              aria-label={`Call Now at ${siteConfig.phoneDisplay}`}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-6 py-3 text-sm font-black text-slate-950 shadow-md transition hover:bg-amber-400 hover:shadow-lg active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500"
            >
              <Phone size={17} className="fill-slate-950" aria-hidden="true" />
              <span>Call Now: {siteConfig.phoneDisplay}</span>
            </a>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div
            id="mobile-navigation"
            className="border-t border-slate-200 bg-white lg:hidden shadow-xl"
          >
            <div className="container-custom py-6 space-y-4">
              <nav aria-label="Mobile Navigation" className="flex flex-col divide-y divide-slate-100">
                <Link
                  href="/"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-base font-semibold text-slate-800 transition hover:text-blue-700"
                >
                  Home
                </Link>

                {/* Mobile Services Accordion */}
                <div className="py-2">
                  <button
                    type="button"
                    onClick={() => setMobileServicesOpen(!mobileServicesOpen)}
                    className="flex w-full items-center justify-between py-2 text-base font-semibold text-slate-800"
                  >
                    <span>Plumbing Services</span>
                    <ChevronDown
                      size={18}
                      className={`text-slate-400 transition-transform ${
                        mobileServicesOpen ? "rotate-180 text-blue-700" : ""
                      }`}
                    />
                  </button>

                  {mobileServicesOpen && (
                    <div className="mt-2 ml-3 space-y-2 border-l-2 border-blue-100 pl-3">
                      {serviceDropdownLinks.map((service) => (
                        <Link
                          key={service.href}
                          href={service.href}
                          onClick={() => setMobileOpen(false)}
                          className="block py-1.5 text-sm font-medium text-slate-700 hover:text-blue-700"
                        >
                          {service.title}
                        </Link>
                      ))}
                      <Link
                        href="/services"
                        onClick={() => setMobileOpen(false)}
                        className="block py-1.5 text-xs font-bold text-blue-700"
                      >
                        All Plumbing Services →
                      </Link>
                    </div>
                  )}
                </div>

                <Link
                  href="/service-areas"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-base font-semibold text-slate-800 transition hover:text-blue-700"
                >
                  Service Areas
                </Link>

                <Link
                  href="/blog"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-base font-semibold text-slate-800 transition hover:text-blue-700"
                >
                  Plumbing Guide
                </Link>

                <Link
                  href="/about"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-base font-semibold text-slate-800 transition hover:text-blue-700"
                >
                  About
                </Link>

                <Link
                  href="/contact"
                  onClick={() => setMobileOpen(false)}
                  className="py-3 text-base font-semibold text-slate-800 transition hover:text-blue-700"
                >
                  Contact
                </Link>
              </nav>

              <div className="pt-3 space-y-2.5">
                <a
                  href={`tel:${siteConfig.phone}`}
                  aria-label={`Call Now: ${siteConfig.phoneDisplay}`}
                  className="flex items-center justify-center gap-2.5 w-full rounded-xl bg-amber-500 py-3.5 px-4 text-center font-black text-slate-950 shadow transition active:scale-95 hover:bg-amber-400"
                >
                  <Phone size={18} className="fill-slate-950" aria-hidden="true" />
                  <span>Call Now: {siteConfig.phoneDisplay}</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Floating Desktop Hotline Card */}
      <a
        href={`tel:${siteConfig.phone}`}
        aria-label={`Call PipeResque Referral Hotline at ${siteConfig.phoneDisplay}`}
        className="fixed bottom-6 right-6 z-40 hidden md:inline-flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-2xl hover:scale-105 transition-all group"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black group-hover:bg-amber-400 transition">
          <Phone size={18} className="fill-slate-950" />
        </span>
        <div className="text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            Plumbing Referral Line
          </p>
          <p className="text-sm font-black text-white">{siteConfig.phoneDisplay}</p>
        </div>
      </a>

      {/* Persistent Mobile Bottom Call Bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 px-3 pt-2 pb-[calc(0.5rem+env(safe-area-inset-bottom,0px))] bg-slate-950/95 backdrop-blur-md border-t border-slate-800 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        <a
          href={`tel:${siteConfig.phone}`}
          aria-label={`Call Now at ${siteConfig.phoneDisplay}`}
          className="flex items-center justify-center gap-2.5 w-full py-3.5 px-4 rounded-xl bg-amber-500 active:bg-amber-600 text-slate-950 font-black text-base shadow-lg transition"
        >
          <Phone size={18} className="fill-slate-950" aria-hidden="true" />
          <span>Call Now: {siteConfig.phoneDisplay}</span>
        </a>
      </div>
    </>
  );
}