import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Home,
  Phone,
  Wrench,
} from "lucide-react";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

const popularPages = [
  {
    title: "Plumbing Services",
    description: "Explore available plumbing service categories.",
    href: "/services",
  },
  {
    title: "Service Areas",
    description: "Explore Houston and surrounding service areas.",
    href: "/service-areas",
  },
  {
    title: "About Piperesque",
    description: "Learn how Piperesque helps homeowners.",
    href: "/about",
  },
  {
    title: "Plumbing Blog",
    description: "Read helpful plumbing information and guides.",
    href: "/blog",
  },
  {
    title: "Contact",
    description: "Request plumbing assistance.",
    href: "/contact",
  },
];

export default function NotFound() {
  return (
    <main className="min-h-screen overflow-x-hidden bg-white">
      <Navbar />

      {/* =====================================================
          404 HERO
      ===================================================== */}

      <section className="section section-light flex min-h-[75vh] items-center">
        <div className="container-custom w-full">
          <div className="mx-auto max-w-4xl text-center">

            {/* Icon */}
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
              <Wrench size={28} aria-hidden="true" />
            </div>

            {/* Error Code */}
            <p className="mt-8 text-8xl font-black leading-none tracking-tight text-blue-600 sm:text-9xl md:text-[11rem]">
              404
            </p>

            {/* Heading */}
            <h1 className="heading-xl mt-4 text-slate-900">
              Page Not Found
            </h1>

            {/* Description */}
            <p className="text-body-lg mx-auto mt-6 max-w-2xl">
              Sorry, the page you&apos;re looking for doesn&apos;t exist or may
              have been moved. You can return to the homepage or explore our
              plumbing services and information.
            </p>

            {/* Main Actions */}
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/"
                className="btn btn-primary"
              >
                <Home size={18} aria-hidden="true" />
                Back to Home
              </Link>

              <Link
                href="/services"
                className="btn btn-outline"
              >
                Explore Services
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>

            {/* =================================================
                CALL CTA
            ================================================= */}

            <div className="mx-auto mt-12 max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:text-left">

                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Phone size={22} aria-hidden="true" />
                </div>

                <div className="flex-1">
                  <h2 className="font-bold text-slate-900">
                    Need Plumbing Assistance?
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Contact Piperesque to start a plumbing service request.
                  </p>
                </div>

                <a
                  href="tel:+18773640861"
                  className="btn btn-emergency w-full sm:w-auto"
                >
                  Call Now
                </a>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =====================================================
          POPULAR PAGES
      ===================================================== */}

      <section className="section section-white">
        <div className="container-custom">

          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-blue-600">
              Explore Piperesque
            </p>

            <h2 className="heading-lg mt-3 text-slate-900">
              Popular Pages
            </h2>

            <p className="text-body mx-auto mt-4 max-w-2xl">
              Continue browsing our plumbing services, service areas, guides,
              and contact options.
            </p>
          </div>

          <div className="mx-auto mt-10 grid max-w-6xl gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {popularPages.map((page) => (
              <Link
                key={page.href}
                href={page.href}
                className="card card-hover group p-6"
              >
                <div className="flex items-start justify-between gap-4">

                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {page.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {page.description}
                    </p>
                  </div>

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                    <ArrowRight size={18} aria-hidden="true" />
                  </div>

                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {/* =====================================================
          PROVIDER DISCLOSURE
      ===================================================== */}

      <section className="border-t border-slate-200 bg-slate-50">
        <div className="container-custom py-10">
          <p className="mx-auto max-w-4xl text-center text-sm leading-6 text-slate-500">
            Piperesque is an informational service that helps homeowners
            connect with independent plumbing professionals. Piperesque does
            not directly perform or dispatch plumbing services. Availability,
            response times, pricing, warranties, and workmanship are
            determined by the independent provider handling the request.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}