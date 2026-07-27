import Image from "next/image";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";

import {
  Phone,
  Mail,
  MapPin,
  Clock3,
} from "lucide-react";

import { siteConfig } from "@/lib/config/site";

export default function ContactPage() {
  return (
    <main className="overflow-x-hidden bg-white">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden py-28">
        <Image
          src="/images/contact.png"
          alt="Contact Piperesque"
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-blue-900/80" />

        <div className="container-custom relative z-10 text-center">
          <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-bold text-white backdrop-blur">
            CONTACT Piperesque
          </span>

          <h1 className="mt-8 text-5xl font-black text-white lg:text-6xl">
            Contact Piperesque
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-blue-100">
            Have questions about plumbing services? Contact us by phone or
            email. We help connect homeowners with independent plumbing service
            providers serving Houston and nearby communities.
          </p>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-24">
        <div className="container-custom max-w-4xl">
          <div className="rounded-[36px] border border-slate-200 bg-white p-10 shadow-xl">
            <h2 className="text-4xl font-black">
              Contact Information
            </h2>

            <p className="mt-5 leading-8 text-slate-600">
              You can contact us using the information below if you have
              questions about our website or plumbing service requests.
            </p>

            <div className="mt-10 space-y-8">
              <div className="flex items-start gap-4">
                <Phone className="mt-1 text-blue-600" />

                <div>
                  <h3 className="font-bold">Phone</h3>

                  <a
                    href={`tel:${siteConfig.phone}`}
                    className="text-slate-600 transition hover:text-blue-600"
                  >
                    {siteConfig.phoneDisplay}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Mail className="mt-1 text-blue-600" />

                <div>
                  <h3 className="font-bold">Email</h3>

                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="text-slate-600 transition hover:text-blue-600"
                  >
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <MapPin className="mt-1 text-blue-600" />

                <div>
                  <h3 className="font-bold">Service Area</h3>

                  <p className="text-slate-600">
                    Houston, Texas &amp; Nearby Communities
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <Clock3 className="mt-1 text-blue-600" />

                <div>
                  <h3 className="font-bold">Availability</h3>

                  <p className="text-slate-600">
                    Contact us any time. Service availability depends on your
                    location and the availability of independent plumbing
                    service providers.
                  </p>
                </div>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="mt-12 rounded-3xl border border-blue-100 bg-blue-50 p-8">
              <h3 className="text-2xl font-bold text-slate-900">
                Important Information
              </h3>

              <p className="mt-4 leading-8 text-slate-600">
                Piperesque is an independent informational website. We help
                homeowners connect with independent plumbing service providers.
                Piperesque does not directly perform plumbing services and does
                not guarantee pricing, scheduling, response times, or service
                availability.
              </p>
            </div>
          </div>
        </div>
      </section>

      <CTA />

      <Footer />
    </main>
  );
}