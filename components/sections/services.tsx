import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Phone } from "lucide-react";
import { siteConfig } from "@/lib/config/site";

const services = [
  {
    title: "Emergency Plumbing",
    image: "/images/service-1.png",
    desc: "Emergency plumbing assistance for burst pipes, leaks, overflowing toilets and other urgent plumbing problems.",
    href: "/services/emergency-plumbing",
  },
  {
    title: "Drain Cleaning",
    image: "/images/service-2.png",
    desc: "Drain cleaning services to help restore proper drainage for sinks, tubs, showers and sewer lines.",
    href: "/services/drain-cleaning",
  },
  {
    title: "Leak Detection",
    image: "/images/service-3.png",
    desc: "Leak detection services for hidden water leaks, slab leaks and plumbing system inspections.",
    href: "/services/leak-detection",
  },
  {
    title: "Water Heater Services",
    image: "/images/service-1.png",
    desc: "Water heater repair, replacement and installation services for residential and commercial properties.",
    href: "/services/water-heater-repair",
  },
  {
    title: "Sewer Line Services",
    image: "/images/service-2.png",
    desc: "Sewer line inspection, repair and replacement services performed by local plumbing providers.",
    href: "/services/sewer-line-repair",
  },
  {
    title: "Residential Plumbing",
    image: "/images/service-3.png",
    desc: "General residential plumbing services including repairs, maintenance and plumbing installations.",
    href: "/services/residential-plumbing",
  },
];

export default function Services() {
  return (
    <section
      className="bg-slate-50 py-20 lg:py-24"
      aria-labelledby="services-heading"
    >
      <div className="container-custom">
        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-bold text-blue-600">
            PLUMBING SERVICES
          </span>

          <h2
            id="services-heading"
            className="mt-6 text-4xl font-black text-slate-900 lg:text-5xl"
          >
            Plumbing Services Available in Houston
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Piperesque helps homeowners and businesses connect with
            independent plumbing service providers offering emergency plumbing,
            drain cleaning, leak detection, sewer line services, water heater
            repair and other plumbing solutions throughout the Houston area.
          </p>
        </div>

        {/* Service Cards */}

        <div className="mt-16 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {services.map((service) => (
            <article
              key={service.title}
              className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg transition duration-300 hover:-translate-y-2 hover:border-blue-600 hover:shadow-2xl"
            >
              <div className="relative h-64 overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.title}
                  fill
                  quality={65}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="p-8">
                <h3 className="text-2xl font-bold text-slate-900">
                  {service.title}
                </h3>

                <p className="mt-4 leading-8 text-slate-600">
                  {service.desc}
                </p>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={18}
                      aria-hidden="true"
                      className="text-green-600"
                    />
                    <span>Residential &amp; Commercial</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={18}
                      aria-hidden="true"
                      className="text-green-600"
                    />
                    <span>Service Requests Accepted 24/7</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <CheckCircle2
                      size={18}
                      aria-hidden="true"
                      className="text-green-600"
                    />
                    <span>Houston &amp; Nearby Areas</span>
                  </div>
                </div>

                <div className="mt-8 flex flex-wrap gap-3">
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700"
                  >
                    Learn More About {service.title}
                    <ArrowRight size={18} aria-hidden="true" />
                  </Link>

                  <a
                    href={`tel:${siteConfig.phone}`}
                    aria-label={`Call ${siteConfig.company}`}
                    className="inline-flex items-center gap-2 rounded-full border border-slate-300 px-5 py-3 font-semibold transition hover:border-blue-600 hover:text-blue-600"
                  >
                    <Phone size={18} aria-hidden="true" />
                    Call Now
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Disclaimer */}

        <div className="mt-16 rounded-3xl border border-blue-100 bg-blue-50 p-8">
          <h3 className="text-2xl font-bold text-slate-900">
            Important Information
          </h3>

          <p className="mt-4 leading-8 text-slate-600">
            Piperesque is an informational website that helps users connect
            with independent plumbing service providers. Plumbing services,
            scheduling, pricing, warranties and response times are provided by
            the selected service provider and may vary depending on location and
            availability.
          </p>
        </div>
      </div>
    </section>
  );
}