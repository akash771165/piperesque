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
} from "lucide-react";
import { Button } from "@/components/ui/button";

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
      {/* Floating Call */}

      <a
        href={`tel:${siteConfig.phone}`}
        aria-label={`Call ${siteConfig.company}`}
        className="fixed bottom-6 right-5 z-[999] flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-white shadow-2xl transition hover:scale-110"
      >
        <Phone size={28} />
      </a>

      {/* Top Bar */}

      <div className="bg-blue-700 text-white">
        <div className="container-custom flex h-10 items-center justify-between text-sm">
          <p>🚨 24/7 Emergency Plumbing Assistance</p>

          <div className="hidden gap-6 md:flex">
            <span>Serving Houston &amp; Surrounding Areas</span>
            <span>Emergency Assistance Available 24/7</span>
          </div>
        </div>
      </div>

      {/* Navbar */}

      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-xl">
        <div className="container-custom flex h-24 items-center justify-between">
          {/* Logo */}

          <Link
            href="/"
            aria-label={`${siteConfig.company} Home`}
            className="flex items-center gap-4"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white">
              <Wrench size={28} />
            </div>

            <div>
              <h2 className="text-2xl font-black">
                {siteConfig.company}
              </h2>

              <p className="text-xs text-slate-500">
                Houston Plumbing Services
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}

          <nav
            aria-label="Main Navigation"
            className="hidden items-center gap-8 xl:flex"
          >
            {navLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-1 font-semibold text-slate-700 transition hover:text-blue-600"
              >
                {item.title}

                {item.title === "Services" && (
                  <ChevronDown
                    size={16}
                    aria-hidden="true"
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}

          <div className="hidden items-center gap-4 lg:flex">
            <a
              href={`tel:${siteConfig.phone}`}
              aria-label={`Call ${siteConfig.company}`}
            >
              <Button
                variant="outline"
                className="rounded-full border-2 px-6"
              >
                <Phone className="mr-2 h-4 w-4" />
                {siteConfig.phoneDisplay}
              </Button>
            </a>

            <Link href="/contact">
              <Button className="rounded-full bg-blue-600 px-7 hover:bg-blue-700">
                Request Assistance
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button */}

          <button
            type="button"
            onClick={() => setOpen(!open)}
            aria-label={
              open
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={open}
            aria-controls="mobile-navigation"
            className="rounded-xl border p-3 lg:hidden"
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
                {/* Mobile Menu */}

        {open && (
          <div
            id="mobile-navigation"
            className="border-t bg-white lg:hidden"
          >
            <div className="container-custom py-6">
              <nav
                aria-label="Mobile Navigation"
                className="flex flex-col gap-5"
              >
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className="border-b pb-4 text-lg font-semibold"
                  >
                    {item.title}
                  </Link>
                ))}

                <a
                  href={`tel:${siteConfig.phone}`}
                  aria-label={`Call ${siteConfig.company}`}
                  className="rounded-full border border-blue-600 py-3 text-center font-bold text-blue-600"
                >
                  📞 {siteConfig.phoneDisplay}
                </a>

                <Link href="/contact">
                  <Button className="mt-2 w-full rounded-full bg-blue-600">
                    Request Assistance
                  </Button>
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}