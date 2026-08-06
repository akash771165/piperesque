"use client";

import Image from "next/image";

import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import CTA from "@/components/sections/cta";

export default function AboutPage() {
    return (
        <main className="overflow-x-hidden bg-white">

            <Navbar />

            {/* Hero */}

            {/* Hero */}

           {/* Hero */}

<section className="relative flex min-h-[700px] items-center overflow-hidden">

  <Image
    src="/images/about.png"
    alt="Plumbing services in Houston"
    fill
    priority
    sizes="100vw"
    className="object-cover"
  />

  <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-blue-950/80 to-blue-900/70" />

  <div className="container-custom relative z-10 py-28">

    <div className="max-w-3xl">

      <div className="flex flex-wrap gap-3">

        <span className="rounded-full bg-red-600 px-5 py-2 text-sm font-bold text-white">
          🚨 Emergency Plumbing Information
        </span>

        <span className="rounded-full bg-white/15 px-5 py-2 text-sm font-bold text-white backdrop-blur">
          Serving Houston & Nearby Areas
        </span>

        <span className="rounded-full bg-white/15 px-5 py-2 text-sm font-bold text-white backdrop-blur">
          Request Service 24/7
        </span>

      </div>

      <h1 className="mt-8 text-5xl font-black leading-tight text-white md:text-7xl">
        About Piperesque
      </h1>

      <p className="mt-8 max-w-2xl text-xl leading-9 text-blue-100">
        Piperesque is an informational website that helps homeowners connect
        with local plumbing service providers throughout Houston and surrounding
        communities. Whether you need emergency plumbing, drain cleaning, leak
        detection, water heater service or sewer line assistance, we&apos;ll help
        you submit a plumbing service request.
      </p>

      <div className="mt-10 flex flex-wrap gap-5">

        <a
          href="/contact"
          className="rounded-xl bg-blue-600 px-8 py-4 text-lg font-bold text-white transition hover:bg-blue-700"
        >
          Request Service
        </a>

        <a
          href="tel:+18773640861"
          className="rounded-xl border-2 border-white px-8 py-4 text-lg font-bold text-white transition hover:bg-white hover:text-slate-900"
        >
          Call (877) 364-0861
        </a>

      </div>

      <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">

        <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

          <h3 className="text-3xl font-black text-white">
            24/7
          </h3>

          <p className="mt-2 text-blue-100">
            Request Submission
          </p>

        </div>

        <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

          <h3 className="text-3xl font-black text-white">
            Houston
          </h3>

          <p className="mt-2 text-blue-100">
            Primary Service Area
          </p>

        </div>

        <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

          <h3 className="text-3xl font-black text-white">
            Local
          </h3>

          <p className="mt-2 text-blue-100">
            Plumbing Providers
          </p>

        </div>

        <div className="rounded-2xl bg-white/10 p-5 backdrop-blur">

          <h3 className="text-3xl font-black text-white">
            Easy
          </h3>

          <p className="mt-2 text-blue-100">
            Service Requests
          </p>

        </div>

      </div>

    </div>

  </div>

</section>
            {/* About */}

          <section className="py-24">

  <div className="container-custom grid items-center gap-20 lg:grid-cols-2">

    {/* Image */}

    <div className="relative aspect-[9/7] overflow-hidden rounded-[36px] shadow-2xl">

      <Image
        src="/images/plumber-1.png"
        alt="Local plumbing services in Houston"
        fill
        sizes="(max-width:1024px)100vw,50vw"
        className="object-cover"
      />

    </div>

    {/* Content */}

    <div>

      <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-bold text-blue-700">
        ABOUT Piperesque
      </span>

      <h2 className="mt-8 text-5xl font-black leading-tight text-slate-900">
        Helping Homeowners Find Plumbing Services
      </h2>

      <p className="mt-8 text-lg leading-9 text-slate-600">
        Piperesque is an informational website designed to help homeowners
        and businesses connect with local plumbing service providers serving
        Houston and nearby communities.
      </p>

      <p className="mt-6 text-lg leading-9 text-slate-600">
        Whether you need emergency plumbing, drain cleaning, leak detection,
        sewer line services, water heater repair or general plumbing
        assistance, you can request service through our website or by calling
        the phone number provided.
      </p>

      <div className="mt-10 grid gap-4">

        {[
          "Emergency plumbing service requests",
          "Drain cleaning and clog removal",
          "Leak detection assistance",
          "Water heater services",
          "Residential & commercial plumbing",
          "Houston and surrounding service areas",
        ].map((item) => (

          <div
            key={item}
            className="flex items-center gap-3 rounded-xl bg-slate-100 p-4"
          >

            <span className="text-2xl text-green-600">
              ✔
            </span>

            <span className="font-semibold">
              {item}
            </span>

          </div>

        ))}

      </div>

      <div className="mt-12 rounded-3xl border border-blue-100 bg-blue-50 p-8">

        <h3 className="text-2xl font-bold text-slate-900">
          Important Information
        </h3>

        <p className="mt-5 leading-8 text-slate-600">
          Piperesque does not claim to directly employ plumbers or guarantee
          pricing, response times, scheduling or service availability. Those
          details are determined by the plumbing service provider you are
          connected with and may vary based on your location.
        </p>

      </div>

    </div>

  </div>

</section>

            {/* Team */}

            {/* Why Choose Us */}

           <section className="bg-slate-50 py-24">

  <div className="container-custom">

    <div className="mx-auto max-w-3xl text-center">

      <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-bold text-blue-700">
        WHY Piperesque
      </span>

      <h2 className="mt-6 text-5xl font-black text-slate-900">
        A Simple Way to Request Plumbing Services
      </h2>

      <p className="mt-6 text-lg leading-8 text-slate-600">
        Piperesque helps homeowners connect with local plumbing service
        providers serving Houston and surrounding communities. Our goal is to
        make requesting plumbing assistance simple and convenient.
      </p>

    </div>

    <div className="mt-20 grid gap-8 md:grid-cols-2 lg:grid-cols-3">

      <div className="rounded-3xl bg-white p-8 shadow-xl">

        <div className="text-5xl">📞</div>

        <h3 className="mt-6 text-2xl font-black">
          Easy Service Requests
        </h3>

        <p className="mt-4 leading-8 text-slate-600">
          Submit a plumbing request online or call the number listed on our
          website.
        </p>

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-xl">

        <div className="text-5xl">🚨</div>

        <h3 className="mt-6 text-2xl font-black">
          Emergency Assistance
        </h3>

        <p className="mt-4 leading-8 text-slate-600">
          Emergency plumbing requests can be submitted 24 hours a day,
          depending on provider availability.
        </p>

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-xl">

        <div className="text-5xl">🔧</div>

        <h3 className="mt-6 text-2xl font-black">
          Multiple Plumbing Services
        </h3>

        <p className="mt-4 leading-8 text-slate-600">
          Request emergency plumbing, drain cleaning, leak detection, sewer
          line services and water heater repair.
        </p>

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-xl">

        <div className="text-5xl">🏠</div>

        <h3 className="mt-6 text-2xl font-black">
          Residential & Commercial
        </h3>

        <p className="mt-4 leading-8 text-slate-600">
          Plumbing service requests are available for homes, apartments,
          offices and commercial properties.
        </p>

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-xl">

        <div className="text-5xl">📍</div>

        <h3 className="mt-6 text-2xl font-black">
          Houston Service Area
        </h3>

        <p className="mt-4 leading-8 text-slate-600">
          Helping customers find plumbing services throughout Houston and
          nearby communities.
        </p>

      </div>

      <div className="rounded-3xl bg-white p-8 shadow-xl">

        <div className="text-5xl">ℹ️</div>

        <h3 className="mt-6 text-2xl font-black">
          Helpful Information
        </h3>

        <p className="mt-4 leading-8 text-slate-600">
          Our website provides plumbing information and helps connect
          homeowners with local service providers.
        </p>

      </div>

    </div>

    <div className="mt-20 rounded-3xl border border-blue-100 bg-blue-50 p-8">

      <h3 className="text-2xl font-bold text-slate-900">
        Disclaimer
      </h3>

      <p className="mt-5 leading-8 text-slate-600">
        Piperesque is an informational website. We help connect homeowners
        with local plumbing service providers. We do not directly employ,
        dispatch or supervise plumbers, and we do not guarantee pricing,
        scheduling, response times or service availability. These are
        determined by the selected plumbing service provider.
      </p>

    </div>

  </div>

</section>

<CTA />

<Footer />

</main>
);
}