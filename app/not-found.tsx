import Link from "next/link";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function NotFound() {
    return (
        <main className="overflow-x-hidden bg-white">

            <Navbar />

            <section className="flex min-h-[80vh] items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50">

                <div className="container-custom text-center">

                    <h1 className="text-[120px] font-black leading-none text-blue-600 lg:text-[220px]">
                        404
                    </h1>

                    <h2 className="mt-4 text-5xl font-black text-slate-900">
                        Page Not Found
                    </h2>

                    <p className="mx-auto mt-8 max-w-2xl text-xl leading-9 text-slate-600">
                        Sorry, the page you&apos;re looking for doesn&apos;t exist or may have
                        been moved. Return to the homepage or browse our plumbing
                        services.
                    </p>

                    <div className="mt-12 flex flex-wrap justify-center gap-5">

                        <Link
                            href="/"
                            className="rounded-full bg-blue-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-blue-700"
                        >
                            🏠 Back To Home
                        </Link>

                        <Link
                            href="/contact"
                            className="rounded-full border-2 border-slate-300 px-8 py-4 text-lg font-bold transition hover:border-blue-600 hover:text-blue-600"
                        >
                            Contact Us
                        </Link>

                    </div>

                    <div className="mt-20 rounded-[32px] bg-white p-10 shadow-xl">

                        <h3 className="text-3xl font-black text-slate-900">
                            Popular Pages
                        </h3>

                        <div className="mt-8 flex flex-wrap justify-center gap-4">

                            <Link
                                href="/services"
                                className="rounded-full bg-slate-100 px-6 py-3 font-semibold hover:bg-blue-600 hover:text-white"
                            >
                                Services
                            </Link>

                            <Link
                                href="/service-areas"
                                className="rounded-full bg-slate-100 px-6 py-3 font-semibold hover:bg-blue-600 hover:text-white"
                            >
                                Service Areas
                            </Link>

                            <Link
                                href="/about"
                                className="rounded-full bg-slate-100 px-6 py-3 font-semibold hover:bg-blue-600 hover:text-white"
                            >
                                About
                            </Link>

                            <Link
                                href="/blog"
                                className="rounded-full bg-slate-100 px-6 py-3 font-semibold hover:bg-blue-600 hover:text-white"
                            >
                                Blog
                            </Link>

                            <Link
                                href="/contact"
                                className="rounded-full bg-slate-100 px-6 py-3 font-semibold hover:bg-blue-600 hover:text-white"
                            >
                                Contact
                            </Link>

                        </div>

                    </div>

                </div>

            </section>

            <Footer />

        </main>
    );
}

