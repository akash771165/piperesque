"use client";

import Image from "next/image";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";

import {
    MapPin,
    CheckCircle2,
    Clock3,
} from "lucide-react";

const areas = [
    "Houston",
    "Pasadena",
    "Sugar Land",
    "Pearland",
    "Katy",
    "Cypress",
    "Spring",
    "The Woodlands",
    "Missouri City",
    "League City",
    "Bellaire",
    "Stafford",
];

export default function ServiceAreasPage() {
    return (
        <main className="overflow-x-hidden bg-white">

            <Navbar />

            {/* Hero */}

            <section className="relative overflow-hidden py-28">

                <Image
                    src="/images/service-city.png"
                    alt="Service Areas"
                    fill
                    priority
                    className="object-cover"
                />

                <div className="absolute inset-0 bg-blue-900/75" />

                <div className="container-custom relative z-10 text-center">

                    <span className="rounded-full bg-white/20 px-5 py-2 text-sm font-bold text-white">
                        SERVICE AREAS
                    </span>

                    <h1 className="mt-8 text-6xl font-black text-white">
                        Areas We Serve
                    </h1>

                    <p className="mx-auto mt-8 max-w-3xl text-xl leading-9 text-blue-100">
                        Piperesque proudly provides emergency plumbing services
                        across Houston and surrounding communities.
                    </p>

                </div>

            </section>

            {/* Cities */}

            <section className="py-24">

                <div className="container-custom">

                    <div className="text-center">

                        <h2 className="text-5xl font-black">
                            Serving Houston & Nearby Cities
                        </h2>

                        <p className="mt-6 text-lg text-slate-600">
                            Fast response, licensed plumbers and same-day service.
                        </p>

                    </div>

                    <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">

                        {areas.map((city) => (

                            <div
                                key={city}
                                className="rounded-[30px] border border-slate-200 bg-white p-8 shadow-lg transition duration-300 hover:-translate-y-2 hover:border-blue-600 hover:shadow-2xl"
                            >

                                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">

                                    <MapPin
                                        size={38}
                                        className="text-blue-600"
                                    />

                                </div>

                                <h3 className="mt-8 text-center text-3xl font-black">
                                    {city}
                                </h3>

                                <p className="mt-4 text-center leading-8 text-slate-600">
                                    Residential & Commercial Plumbing Services
                                </p>

                                <div className="mt-8 space-y-3">

                                    <div className="flex items-center gap-3">

                                        <CheckCircle2 className="text-green-600" />

                                        <span>24/7 Emergency Service</span>

                                    </div>

                                    <div className="flex items-center gap-3">

                                        <CheckCircle2 className="text-green-600" />

                                        <span>Licensed Technicians</span>

                                    </div>

                                    <div className="flex items-center gap-3">

                                        <CheckCircle2 className="text-green-600" />

                                        <span>Same-Day Response</span>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                </div>

            </section>

            {/* Map */}

            <section className="pb-24">

                <div className="container-custom">

                    <div className="overflow-hidden rounded-[36px] shadow-2xl">

                        <div className="relative h-[600px]">

                            <Image
                                src="/images/service-area.png"
                                alt="Houston Service Area Map"
                                fill
                                className="object-cover"
                            />

                        </div>

                        <div className="bg-blue-600 p-10 text-center text-white">

                            <Clock3
                                size={42}
                                className="mx-auto"
                            />

                            <h2 className="mt-6 text-4xl font-black">
                                Fast Response Across Houston
                            </h2>

                            <p className="mx-auto mt-5 max-w-3xl text-lg leading-8 text-blue-100">
                                Our plumbers are strategically located throughout
                                Houston and surrounding cities, allowing us to
                                respond quickly to residential and commercial
                                plumbing emergencies 24 hours a day.
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

