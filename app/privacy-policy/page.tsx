"use client";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function PrivacyPolicyPage() {
    return (
        <main className="overflow-x-hidden bg-white">

            <Navbar />

            <section className="bg-gradient-to-r from-blue-700 via-blue-600 to-sky-500 py-24">

                <div className="container-custom text-center">

                    <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-bold text-white">
                        LEGAL
                    </span>

                    <h1 className="mt-8 text-6xl font-black text-white">
                        Privacy Policy
                    </h1>

                    <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">
                        Your privacy is important to Piperesque. This page explains
                        how we collect, use and protect your personal information.
                    </p>

                </div>

            </section>

            <section className="py-24">

                <div className="container-custom max-w-5xl">

                    <div className="rounded-[36px] border border-slate-200 bg-white p-12 shadow-xl">

                        <h2 className="text-4xl font-black">
                            Privacy Policy
                        </h2>

                        <p className="mt-6 leading-8 text-slate-600">
                            Piperesque respects your privacy and is committed to
                            protecting your personal information. This Privacy Policy
                            explains how information is collected, used and safeguarded
                            when you use our website or contact our team.
                        </p>

                        <h3 className="mt-12 text-3xl font-black">
                            Information We Collect
                        </h3>

                        <ul className="mt-6 list-disc space-y-3 pl-6 leading-8 text-slate-600">
                            <li>Name</li>
                            <li>Email Address</li>
                            <li>Phone Number</li>
                            <li>Service Address</li>
                            <li>Messages submitted through contact forms</li>
                        </ul>

                        <h3 className="mt-12 text-3xl font-black">
                            How We Use Your Information
                        </h3>

                        <ul className="mt-6 list-disc space-y-3 pl-6 leading-8 text-slate-600">
                            <li>Provide requested plumbing services.</li>
                            <li>Respond to customer inquiries.</li>
                            <li>Schedule appointments.</li>
                            <li>Improve our website and customer experience.</li>
                            <li>Send service updates when necessary.</li>
                        </ul>

                        <h3 className="mt-12 text-3xl font-black">
                            Cookies
                        </h3>

                        <p className="mt-6 leading-8 text-slate-600">
                            Our website may use cookies and analytics technologies to
                            improve performance and understand visitor behavior.
                        </p>

                        <h3 className="mt-12 text-3xl font-black">
                            Third-Party Services
                        </h3>

                        <p className="mt-6 leading-8 text-slate-600">
                            We may use trusted third-party services such as Google
                            Analytics, Google Maps and email providers to improve our
                            services.
                        </p>

                        <h3 className="mt-12 text-3xl font-black">
                            Data Security
                        </h3>

                        <p className="mt-6 leading-8 text-slate-600">
                            We use reasonable security measures to protect customer
                            information against unauthorized access or disclosure.
                        </p>

                        <h3 className="mt-12 text-3xl font-black">
                            Contact
                        </h3>

                        <p className="mt-6 leading-8 text-slate-600">
                            If you have questions regarding this Privacy Policy,
                            please contact Piperesque.
                        </p>

                       <div className="mt-16 rounded-3xl border border-blue-200 bg-blue-50 p-8">

    <h3 className="text-2xl font-black text-slate-900">
        Website Ownership Verification
    </h3>

    <p className="mt-5 leading-8 text-slate-700">
        This website (<strong>www.piperesque.com</strong>) is owned and
        managed by <strong>Mohit Parmar</strong>.
    </p>

    <p className="mt-4 leading-8 text-slate-700">
        This website is used for SEO-based inbound lead generation for home
        services and is actively maintained by the website owner.
    </p>

    <div className="mt-8 border-t border-blue-200 pt-6">

        <p className="font-bold">
            Website Owner
        </p>

        <p className="text-slate-600">
            Mohit Parmar
        </p>

        <p className="mt-5 font-bold">
            Last Updated
        </p>

        <p className="text-slate-600">
            July 16, 2026
        </p>

    </div>

</div>

                    </div>

                </div>

            </section>

            <Footer />

        </main>
    );
}

