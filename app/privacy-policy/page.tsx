import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Privacy Policy | Piperesque",
  description:
    "Piperesque privacy policy explaining information collection, usage, and data security practices for website visitors.",
  alternates: {
    canonical: `${siteConfig.website}/privacy-policy`,
  },
  openGraph: {
    title: "Privacy Policy | Piperesque",
    description: "Piperesque privacy policy and visitor information safeguards.",
    url: `${siteConfig.website}/privacy-policy`,
    siteName: siteConfig.company,
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Privacy Policy | Piperesque",
    description: "Piperesque privacy policy and visitor information safeguards.",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="overflow-x-hidden bg-white text-slate-900">
      <Navbar />

      <section className="bg-slate-950 py-20 text-white">
        <div className="container-custom text-center max-w-3xl mx-auto">
          <p className="text-xs font-bold uppercase tracking-widest text-amber-400">
            Legal Information
          </p>
          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Your privacy is important to Piperesque. This page explains how we collect, use, and protect your information when using our website.
          </p>
        </div>
      </section>

      <section className="py-20 bg-slate-50">
        <div className="container-custom max-w-4xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 md:p-12 shadow-sm space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-950">Overview</h2>
              <p className="mt-3 leading-7 text-slate-600 text-sm md:text-base">
                Piperesque respects your privacy and is committed to protecting your personal information. This Privacy Policy explains how information is handled when you browse our website or make an inquiry by telephone or electronic request.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-950">Information We May Collect</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-slate-600 text-sm md:text-base">
                <li>Contact name</li>
                <li>Telephone number</li>
                <li>Email address</li>
                <li>Service location or city in Greater Houston</li>
                <li>Plumbing issue details provided during inquiry</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-950">How We Use Your Information</h2>
              <ul className="mt-3 list-disc space-y-2 pl-6 leading-7 text-slate-600 text-sm md:text-base">
                <li>Connecting you with independent local plumbing contractors serving your area.</li>
                <li>Responding to user inquiries and providing customer service assistance.</li>
                <li>Improving website layout, navigation speed, and user experience.</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-950">Cookies &amp; Technical Log Data</h2>
              <p className="mt-3 leading-7 text-slate-600 text-sm md:text-base">
                Our website may use standard session cookies and performance telemetry to maintain security, optimize load times, and monitor technical stability. We do not sell your personal data to third-party marketing lists.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-950">Third-Party Independent Contractors</h2>
              <p className="mt-3 leading-7 text-slate-600 text-sm md:text-base">
                When you call our listed phone number or request plumbing service, your inquiry is routed to independent third-party plumbing professionals. These contractors operate independently under their own privacy policies and business practices.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-slate-950">Data Security</h2>
              <p className="mt-3 leading-7 text-slate-600 text-sm md:text-base">
                We implement industry-standard HTTPS encryption and technical safeguards to prevent unauthorized access or disclosure of transmitted customer information.
              </p>
            </div>

            <div className="rounded-2xl border border-blue-200 bg-blue-50/70 p-6 text-sm text-slate-700">
              <h3 className="font-bold text-slate-950 text-base">Website Operation</h3>
              <p className="mt-2 leading-6">
                This website (<strong>www.piperesque.com</strong>) is an inbound lead-referral resource for residential and commercial plumbing services in Greater Houston, Texas.
              </p>
              <div className="mt-4 border-t border-blue-200/80 pt-3 text-xs text-slate-500">
                <span>Last Updated: 2026</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
