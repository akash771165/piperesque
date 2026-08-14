import Image from "next/image";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";

import {
  Phone,
  Mail,
  MapPin,
  Clock3,
  Send,
  ShieldCheck,
} from "lucide-react";

import { siteConfig } from "@/lib/config/site";

export default function ContactPage() {
  return (
    <main className="overflow-x-hidden bg-white">
      <Navbar />

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

      <section className="py-24">
        <div className="container-custom max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <div className="rounded-[36px] border border-slate-200 bg-white p-8 shadow-xl md:p-10">
              <h2 className="text-4xl font-black">Contact information</h2>
              <p className="mt-5 leading-8 text-slate-600">
                You can contact us using the information below if you have questions about our website or plumbing service requests.
              </p>

              <div className="mt-10 space-y-8">
                <div className="flex items-start gap-4">
                  <Phone className="mt-1 text-blue-600" />
                  <div>
                    <h3 className="font-bold">Phone</h3>
                    <a href={`tel:${siteConfig.phone}`} className="text-slate-600 transition hover:text-blue-600">
                      {siteConfig.phoneDisplay}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Mail className="mt-1 text-blue-600" />
                  <div>
                    <h3 className="font-bold">Email</h3>
                    <a href={`mailto:${siteConfig.email}`} className="text-slate-600 transition hover:text-blue-600">
                      {siteConfig.email}
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="mt-1 text-blue-600" />
                  <div>
                    <h3 className="font-bold">Service Area</h3>
                    <p className="text-slate-600">Houston, Texas &amp; Nearby Communities</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock3 className="mt-1 text-blue-600" />
                  <div>
                    <h3 className="font-bold">Availability</h3>
                    <p className="text-slate-600">
                      Contact us any time. Service availability depends on your location and the availability of independent plumbing service providers.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-12 rounded-3xl border border-blue-100 bg-blue-50 p-8">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="text-blue-600" />
                  <h3 className="text-2xl font-bold text-slate-900">Important information</h3>
                </div>
                <p className="mt-4 leading-8 text-slate-600">
                  Piperesque is an independent informational website. We help homeowners connect with independent plumbing service providers. Piperesque does not directly perform plumbing services and does not guarantee pricing, scheduling, response times, or service availability.
                </p>
              </div>
            </div>

            <div className="rounded-[36px] border border-slate-200 bg-slate-50 p-8 shadow-xl md:p-10">
              <div className="mb-8 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-600 text-white">
                  <Send size={18} />
                </div>
                <h2 className="text-3xl font-black text-slate-900">Request service</h2>
              </div>

              <form className="space-y-5">
                <div className="grid gap-5 md:grid-cols-2">
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">Full name</span>
                    <input type="text" placeholder="Your name" className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none ring-0 transition focus:border-blue-600" />
                  </label>
                  <label className="block">
                    <span className="mb-2 block text-sm font-bold text-slate-700">Phone</span>
                    <input type="tel" placeholder="(555) 123-4567" className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none ring-0 transition focus:border-blue-600" />
                  </label>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Email</span>
                  <input type="email" placeholder="you@example.com" className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none ring-0 transition focus:border-blue-600" />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Service needed</span>
                  <select className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600">
                    <option>Emergency Plumbing</option>
                    <option>Drain Cleaning</option>
                    <option>Leak Detection</option>
                    <option>Water Heater Repair</option>
                    <option>Sewer Line Repair</option>
                    <option>Other</option>
                  </select>
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-bold text-slate-700">Message</span>
                  <textarea rows={6} placeholder="Tell us about the issue, property type, and urgency." className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 outline-none transition focus:border-blue-600" />
                </label>

                <button type="submit" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-blue-600 px-6 py-4 font-black text-white transition hover:bg-blue-700">
                  <Send size={18} />
                  Submit request
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <CTA />

      <Footer />
    </main>
  );
}