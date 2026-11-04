import type { Metadata } from "next";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import { FileText, AlertCircle } from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms & Conditions | Piperesque",
  description:
    "Review the Terms & Conditions for Piperesque. Learn how our Houston plumbing referral and matching service connects homeowners with independent licensed plumbing contractors.",
  alternates: {
    canonical: "https://www.piperesque.com/terms",
  },
  openGraph: {
    title: "Terms & Conditions | Piperesque",
    description:
      "Review the Terms & Conditions for Piperesque's plumbing referral service in Houston, Texas.",
    url: "https://www.piperesque.com/terms",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <main className="overflow-x-hidden bg-white text-slate-900">
      <Navbar />

      {/* Header */}
      <section className="bg-slate-950 py-20 text-white md:py-24">
        <div className="container-custom text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-blue-200">
            <FileText size={14} aria-hidden="true" />
            Legal Agreement
          </div>

          <h1 className="mt-6 text-4xl font-black tracking-tight text-white md:text-5xl">
            Terms &amp; Conditions
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
            Please read these Terms &amp; Conditions carefully before using the
            Piperesque website or contacting us for plumbing referrals.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 md:py-24">
        <div className="container-custom max-w-4xl">
          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-12">
            
            {/* Lead Gen / Referral Disclaimer Callout */}
            <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-6">
              <div className="flex items-start gap-4">
                <AlertCircle className="mt-1 h-6 w-6 shrink-0 text-amber-700" aria-hidden="true" />
                <div>
                  <h2 className="text-lg font-bold text-amber-950">
                    Important Notice: Referral &amp; Lead-Generation Service
                  </h2>
                  <p className="mt-2 text-sm leading-6 text-amber-900">
                    PipeResque is a free referral and lead-generation service that connects homeowners
                    and property owners with independent, third-party plumbing professionals serving Greater
                    Houston, Texas. PipeResque is <strong>not</strong> a plumbing contractor, does not directly
                    employ plumbers, does not own a plumbing fleet, does not dispatch technicians, and does not
                    perform plumbing services or repairs.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-10 space-y-10 text-slate-700 leading-relaxed">
              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  1. Agreement to Terms
                </h2>
                <p className="mt-4">
                  By accessing or using piperesque.com (the &quot;Site&quot;) or calling any telephone number listed on our website, including (877) 364-0861, you agree to be bound by these Terms &amp; Conditions and our Privacy Policy. If you do not agree to these terms, please do not use our website or phone referral service.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  2. Description of Service
                </h2>
                <p className="mt-4">
                  Piperesque acts solely as a matching and referral intermediary. When you call our verified telephone routing line, your inquiry is connected with independent third-party plumbing contractors or plumbing network partners who operate in your local Houston area.
                </p>
                <p className="mt-3">
                  All plumbing services, emergency repairs, drain cleanings, inspections, estimates, and installations are provided strictly and directly by independent licensed contractors, not by Piperesque.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  3. Independent Contractor Relationship
                </h2>
                <p className="mt-4">
                  Independent plumbing providers are separate third-party business entities. Piperesque does not control, supervise, manage, or employ any technician who visits your home or commercial facility. Any contractual relationship, scope of work, warranty, or financial transaction is strictly between you and the independent plumbing contractor you choose to hire.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  4. Estimates, Pricing &amp; Payments
                </h2>
                <p className="mt-4">
                  Piperesque does not set plumbing prices, dispatch fees, or hourly rates. All diagnostic charges, written estimates, pricing structures, payment terms, and warranties are determined directly by the independent service provider. You should review and confirm all estimates and terms with the contractor prior to authorizing any work.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  5. No Guarantees or Warranties
                </h2>
                <p className="mt-4">
                  Piperesque makes no express or implied representations or warranties regarding:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>The immediate availability or arrival times of independent contractors.</li>
                  <li>The specific pricing, cost estimates, or fee structures of third-party providers.</li>
                  <li>The workmanship, materials, licensing status, or insurance coverage of any independent contractor (users are encouraged to independently verify licensing with the Texas State Board of Plumbing Examiners).</li>
                  <li>The continuous, uninterrupted, or error-free availability of our telephone referral line or website.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  6. Limitation of Liability
                </h2>
                <p className="mt-4">
                  To the maximum extent permitted by applicable Texas law, Piperesque, its owners, operators, affiliates, and partners shall not be liable for any direct, indirect, incidental, consequential, special, or exemplary damages resulting from:
                </p>
                <ul className="mt-3 list-disc space-y-2 pl-6">
                  <li>Any work, repairs, negligence, acts, or omissions of independent plumbing contractors.</li>
                  <li>Any property damage, personal injury, or water intrusion.</li>
                  <li>Any disputes regarding billing, warranties, or satisfaction with third-party plumbing providers.</li>
                  <li>Inability to access the site or delays in phone connectivity.</li>
                </ul>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  7. Intellectual Property
                </h2>
                <p className="mt-4">
                  All text, layout, graphic assets, brand styling, and code on piperesque.com are the exclusive property of Piperesque and are protected by applicable copyright, trademark, and unfair competition laws. Unauthorized copying, scraping, or redistribution is strictly prohibited.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  8. Modifications &amp; Updates
                </h2>
                <p className="mt-4">
                  Piperesque reserves the right to revise these Terms &amp; Conditions at any time. Changes become effective immediately upon posting to this page. Your continued use of the website or phone referral service after any update constitutes acceptance of the revised terms.
                </p>
              </div>

              <div>
                <h2 className="text-2xl font-black text-slate-900">
                  9. Contact Information
                </h2>
                <p className="mt-4">
                  If you have questions or concerns regarding these Terms &amp; Conditions, please reach out via our contact page or by phone:
                </p>
                <div className="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-5">
                  <p className="font-semibold text-slate-900">PipeResque Referral Service</p>
                  <p className="mt-1 text-sm text-slate-600">Greater Houston, Texas</p>
                  <p className="mt-2 text-sm">
                    Phone:{" "}
                    <a href="tel:+18773640861" className="font-bold text-blue-700 hover:underline">
                      (877) 364-0861
                    </a>
                  </p>
                  <p className="mt-1 text-sm">
                    Website:{" "}
                    <Link href="/" className="text-blue-700 hover:underline">
                      www.piperesque.com
                    </Link>
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-8 text-sm text-slate-500">
                <p>Last updated: January 2026</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
