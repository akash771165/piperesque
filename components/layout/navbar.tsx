"use client";

import { useState } from "react";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";
import {
  Menu,
  X,
  Phone,
  Wrench,
  ChevronDown,
  Clock,
} from "lucide-react";

const navLinks = [
  { title: "Home", href: "/" },
  { title: "Services", href: "/services" },
  { title: "Service Areas", href: "/service-areas" },
  { title: "About", href: "/about" },
  { title: "Blog", href: "/blog" },
  { title: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Top Utility Bar */}
      <div className="bg-slate-900 text-white text-xs border-b border-slate-800">
        <div className="container-custom flex h-9 items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-semibold text-slate-200">
              Houston Plumbing Referral Line • Call (877) 364-0861
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
          {/* Logo */}
          <Link
            href="/"
            aria-label={`${siteConfig.company} Home`}
            className="flex items-center gap-3.5 group"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white transition group-hover:bg-blue-700">
              <Wrench size={22} className="text-amber-400" />
            </div>

            <div>
              <span className="text-xl font-black tracking-tight text-slate-950 block leading-tight">
                {siteConfig.company}
              </span>
              <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider block">
                Houston Plumbing Help
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav
            aria-label="Main Navigation"
            className="hidden items-center gap-7 lg:flex"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm font-semibold text-slate-700 transition hover:text-blue-700 flex items-center gap-1"
              >
                {item.title}
                {item.title === "Services" && (
                  <ChevronDown size={14} className="text-slate-400" aria-hidden="true" />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop Conversion Buttons */}
          <div className="hidden items-center gap-3 md:flex">
            <a
              href={`tel:${siteConfig.phone}`}
              aria-label={`Call ${siteConfig.company} at ${siteConfig.phoneDisplay}`}
              className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black text-slate-950 shadow-md transition hover:bg-amber-400 hover:shadow-lg active:scale-95"
            >
              <Phone size={16} className="fill-slate-950" />
              <span>{siteConfig.phoneDisplay}</span>
            </a>

            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-bold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
            >
              Contact Us
            </Link>
          </div>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 text-slate-700 lg:hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {open && (
          <div
            id="mobile-navigation"
            className="border-t border-slate-200 bg-white lg:hidden shadow-xl"
          >
            <div className="container-custom py-6 space-y-4">
              <nav aria-label="Mobile Navigation" className="flex flex-col divide-y divide-slate-100">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="py-3 text-base font-semibold text-slate-800 transition hover:text-blue-700"
                  >
                    {item.title}
                  </Link>
                ))}
              </nav>

              <div className="pt-3 space-y-2.5">
                <a
                  href={`tel:${siteConfig.phone}`}
                  aria-label={`Call ${siteConfig.company} anytime`}
                  className="flex items-center justify-center gap-2.5 w-full rounded-xl bg-amber-500 py-3.5 px-4 text-center font-black text-slate-950 shadow transition active:scale-95 hover:bg-amber-400"
                >
                  <Phone size={18} className="fill-slate-950" />
                  <span>Call {siteConfig.phoneDisplay}</span>
                </a>

                <Link
                  href="/contact"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-full rounded-xl border border-slate-300 bg-slate-50 py-3 px-4 text-center text-sm font-bold text-slate-800 hover:bg-slate-100 transition"
                >
                  Contact by Phone or Email
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Floating Desktop Hotline Card */}
      <a
        href={`tel:${siteConfig.phone}`}
        aria-label={`Call ${siteConfig.company} 24/7 Hotline`}
        className="fixed bottom-6 right-6 z-40 hidden md:inline-flex items-center gap-3.5 px-5 py-3 rounded-2xl bg-slate-950 text-white border border-slate-800 shadow-2xl hover:scale-105 transition-all group"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-slate-950 font-black group-hover:bg-amber-400 transition">
          <Phone size={18} className="fill-slate-950" />
        </span>
        <div className="text-left">
          <p className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
            24/7 Emergency Line
          </p>
          <p className="text-sm font-black text-white">{siteConfig.phoneDisplay}</p>
        </div>
      </a>

      {/* Persistent Mobile Bottom Call Bar */}
      <div className="fixed bottom-0 inset-x-0 z-50 p-2.5 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 md:hidden shadow-[0_-4px_20px_rgba(0,0,0,0.3)]">
        <a
          href={`tel:${siteConfig.phone}`}
          aria-label={`Call ${siteConfig.company} at ${siteConfig.phoneDisplay}`}
          className="flex items-center justify-center gap-2.5 w-full py-3 px-4 rounded-xl bg-amber-500 active:bg-amber-600 text-slate-950 font-black text-base shadow-lg transition"
        >
          <Phone size={18} className="fill-slate-950" />
          <span>Call {siteConfig.phoneDisplay} · 24/7 Dispatch</span>
        </a>
      </div>
    </>
  );
}