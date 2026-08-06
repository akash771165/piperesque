"use client";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function TermsPage() {
    return (
        <main className="overflow-x-hidden bg-white">

            <Navbar />

            <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 py-24">

                <div className="container-custom text-center">

                    <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-bold text-white">
                        LEGAL
                    </span>

                    <h1 className="mt-8 text-6xl font-black text-white">
                        Terms & Conditions
                    </h1>

                    <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">
                        Please read these Terms & Conditions carefully before using
                        Piperesque&apos;s website or requesting our plumbing services.
                    </p>

                </div>

            </section>

            <section className="py-24">

                <div className="container-custom max-w-5xl">

                    <div className="rounded-[36px] border border-slate-200 bg-white p-12 shadow-xl">

                        <h2 className="text-4xl font-black">
                            Terms & Conditions
                        </h2>

                        <p className="mt-6 leading-8 text-slate-600">
                            By accessing this website or requesting services from
                            Piperesque, you agree to these Terms & Conditions.
                            If you do not agree with any part of these terms,
                            please do not use our website or services.
                        </p>

                        <h3 className="mt-12 text-3xl font-black">
                            Plumbing Services
                        </h3>

                        <p className="mt-6 leading-8 text-slate-600">
                            Piperesque provides residential and commercial plumbing
                            services, including emergency plumbing, drain cleaning,
                            leak detection, water heater repair, sewer repair and
                            general plumbing maintenance.
                        </p>

                        <h3 className="mt-12 text-3xl font-black">
                            Estimates & Pricing
                        </h3>

                        <p className="mt-6 leading-8 text-slate-600">
                            Estimates are provided based on available information.
                            Final pricing may change if additional work or hidden
                            plumbing issues are discovered during service.
                        </p>

                        <h3 className="mt-12 text-3xl font-black">
                            Scheduling
                        </h3>

                        <p className="mt-6 leading-8 text-slate-600">
                            Appointment times are approximate. Emergency calls are
                            prioritized and arrival times may vary due to traffic,
                            weather or other emergency service requests.
                        </p>

                        <h3 className="mt-12 text-3xl font-black">
                            Customer Responsibilities
                        </h3>

                        <ul className="mt-6 list-disc space-y-3 pl-6 leading-8 text-slate-600">

                            <li>Provide accurate contact information.</li>

                            <li>Ensure safe access to the work area.</li>

                            <li>Inform technicians of known plumbing issues.</li>

                            <li>Make payment according to agreed terms.</li>

                        </ul>

                        <h3 className="mt-12 text-3xl font-black">
                            Warranty
                        </h3>

                        <p className="mt-6 leading-8 text-slate-600">
                            Piperesque stands behind the quality of its workmanship.
                            Warranty coverage depends on the type of repair,
                            installation and materials used.
                        </p>

                        <h3 className="mt-12 text-3xl font-black">
                            Limitation of Liability
                        </h3>

                        <p className="mt-6 leading-8 text-slate-600">
                            Piperesque shall not be liable for indirect,
                            incidental or consequential damages arising from
                            the use of our website or plumbing services,
                            except where required by law.
                        </p>

                        <h3 className="mt-12 text-3xl font-black">
                            Website Content
                        </h3>

                        <p className="mt-6 leading-8 text-slate-600">
                            All website content including text, graphics,
                            images and logos is the property of Piperesque
                            and may not be copied or reproduced without
                            written permission.
                        </p>

                        <h3 className="mt-12 text-3xl font-black">
                            Changes To These Terms
                        </h3>

                        <p className="mt-6 leading-8 text-slate-600">
                            Piperesque reserves the right to update these
                            Terms & Conditions at any time without prior notice.
                        </p>

                        <h3 className="mt-12 text-3xl font-black">
                            Contact
                        </h3>

                        <p className="mt-6 leading-8 text-slate-600">
                            For questions regarding these Terms & Conditions,
                            please contact Piperesque directly.
                        </p>

                        <div className="mt-16 rounded-3xl bg-slate-100 p-8">

                            <p className="font-bold">
                                Last Updated
                            </p>

                            <p className="mt-2 text-slate-600">
                                January 2026
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            <Footer />

        </main>
    );
}

