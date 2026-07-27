import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

export default function Hero() {
  const highlights = [
    ["24/7", "Emergency Assistance"],
    ["Houston", "Service Area"],
    ["Residential", "Plumbing"],
    ["Commercial", "Plumbing"],
  ] as const;

  const services = [
    "Emergency Plumbing",
    "Drain Cleaning",
    "Leak Detection",
    "Water Heater Repair",
    "Sewer Line Services",
  ];

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Background Decoration */}

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-64 w-64 rounded-full bg-blue-100/30" />
        <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-sky-100/30" />
      </div>

      <div className="container-custom relative z-10 grid min-h-[80vh] items-center gap-14 py-14 lg:min-h-[90vh] lg:grid-cols-2 lg:gap-20 lg:py-20">
        {/* Left Content */}

        <div>
          <span className="inline-flex items-center rounded-full border border-red-200 bg-red-50 px-5 py-2 text-sm font-semibold text-red-700">
            🚨 24/7 Emergency Plumbing Assistance
          </span>

          <h1 className="mt-8 text-4xl font-black leading-tight text-slate-900 sm:text-5xl lg:text-7xl">
            Emergency
            <span className="block text-blue-600">
              Plumbing Services
            </span>
            in Houston, TX
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-slate-600 lg:text-xl">
            Piperesque helps homeowners connect with local plumbing
            professionals for emergency plumbing, drain cleaning, leak
            detection, water heater repair, sewer line services, and
            residential or commercial plumbing assistance throughout
            Houston and nearby communities.
          </p>

          {/* CTA */}

          <div className="mt-10 flex flex-wrap gap-5">
            <Link
              href="/contact"
              className="rounded-full bg-blue-600 px-10 py-5 font-bold text-white transition hover:bg-blue-700"
            >
              Request Assistance
            </Link>

            <a
              href={`tel:${siteConfig.phone}`}
              className="rounded-full border-2 border-slate-300 bg-white px-10 py-5 font-bold transition hover:border-blue-600 hover:text-blue-600"
            >
              📞 {siteConfig.phoneDisplay}
            </a>
          </div>

          <p className="mt-5 text-sm font-semibold text-red-700">
            Need plumbing assistance? Contact us anytime.
          </p>

          {/* Highlights */}

          <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {highlights.map(([title, label]) => (
              <div
                key={title}
                className="rounded-2xl bg-white p-5 text-center shadow-soft"
              >
                <h2 className="text-3xl font-black text-blue-600">
                  {title}
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  {label}
                </p>
              </div>
            ))}
          </div>

          {/* Services */}

          <div className="mt-10 flex flex-wrap gap-3">
            {services.map((service) => (
              <span
                key={service}
                className="rounded-full bg-blue-100 px-4 py-2 text-sm font-semibold text-blue-700"
              >
                {service}
              </span>
            ))}
          </div>

          {/* Trust Badges */}

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              ✔ Emergency Plumbing
            </span>

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              ✔ Drain Cleaning
            </span>

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              ✔ Residential &amp; Commercial
            </span>

            <span className="rounded-full bg-green-100 px-4 py-2 text-sm font-semibold text-green-700">
              ✔ Emergency Assistance
            </span>
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-6 text-slate-500">
            Piperesque helps connect homeowners with local plumbing service
            providers. Services and availability may vary depending on
            location and provider availability.
          </p>
        </div>

        {/* Right Image */}

        <div className="relative">
          <div className="overflow-hidden rounded-[40px] shadow-xl">
            <Image
              src="/images/hero.avif"
              alt="Emergency plumbing services in Houston, Texas"
              width={1200}
              height={800}
              priority
              fetchPriority="high"
              quality={60}
              sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 600px"
              className="aspect-[3/2] h-auto w-full object-cover lg:h-[650px]"
            />
          </div>
        </div>
      </div>
    </section>
  );
}