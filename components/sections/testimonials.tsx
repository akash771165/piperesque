import {
  Phone,
  Clock3,
  Wrench,
  MapPin,
  Home,
  Building2,
} from "lucide-react";
import { siteConfig } from "@/lib/config/site";

const benefits = [
  {
    icon: Clock3,
    title: "24/7 Emergency Assistance",
    description:
      "Request emergency plumbing assistance at any time, day or night.",
  },
  {
    icon: Wrench,
    title: "Plumbing Services",
    description:
      "Emergency plumbing, drain cleaning, leak detection, water heater repair, sewer line services, and more.",
  },
  {
    icon: Home,
    title: "Residential Plumbing",
    description:
      "Helping homeowners request assistance for common residential plumbing needs.",
  },
  {
    icon: Building2,
    title: "Commercial Plumbing",
    description:
      "Commercial plumbing assistance for offices, retail spaces, and other business properties.",
  },
  {
    icon: MapPin,
    title: "Houston Service Area",
    description:
      "Serving Houston and surrounding communities through our local plumbing service network.",
  },
  {
    icon: Phone,
    title: "Simple Service Request",
    description:
      "Call or submit an online request to be connected with a local plumbing service provider.",
  },
];

export default function Testimonials() {
  return (
       <section className="bg-slate-50 py-24">
      <div className="container-custom">
        {/* Heading */}

        <div className="mx-auto max-w-3xl text-center">
          <span className="rounded-full bg-blue-100 px-5 py-2 text-sm font-bold text-blue-600">
            HOW Piperesque WORKS
          </span>

          <h2 className="mt-6 text-4xl font-black text-slate-900 lg:text-5xl">
            Plumbing Assistance Across Houston
          </h2>

          <p className="mt-6 text-lg leading-8 text-slate-600">
            Piperesque helps homeowners and businesses connect with local
            plumbing service providers for emergency plumbing, drain cleaning,
            leak detection, water heater repair, sewer line services, and other
            plumbing needs throughout Houston and nearby communities.
          </p>
        </div>

        {/* Cards */}

        <div className="mt-20 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {benefits.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-3xl border border-slate-200 bg-white p-10 shadow-lg transition hover:-translate-y-2 hover:shadow-xl"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                  <Icon
                    size={30}
                    aria-hidden="true"
                  />
                </div>

                <h3 className="mt-8 text-2xl font-bold text-slate-900">
                  {item.title}
                </h3>

                <p className="mt-5 leading-8 text-slate-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>

        {/* Information */}

        <div className="mt-16 rounded-3xl border border-blue-100 bg-blue-50 p-8">
          <h3 className="text-2xl font-bold text-slate-900">
            Important Information
          </h3>

          <p className="mt-4 leading-8 text-slate-600">
            Piperesque is an informational website that helps users connect
            with local plumbing service providers. Plumbing services are
            performed by independent providers. Service availability, response
            times, scheduling, pricing, and coverage may vary depending on
            provider availability and your location.
          </p>
        </div>

        {/* CTA */}

        <div className="mt-20 rounded-[32px] bg-blue-600 p-10 text-center text-white">
          <h3 className="text-3xl font-black lg:text-4xl">
            Need Plumbing Assistance?
          </h3>

          <p className="mx-auto mt-5 max-w-2xl text-lg text-blue-100">
            Call now or submit a service request to be connected with a local
            plumbing service provider serving the Houston area.
          </p>

          <a
            href={`tel:${siteConfig.phone}`}
            aria-label={`Call ${siteConfig.company}`}
            className="mt-8 inline-flex items-center gap-3 rounded-full bg-white px-8 py-4 font-bold text-blue-700 transition hover:bg-slate-100"
          >
            <Phone
              size={20}
              aria-hidden="true"
            />
            {siteConfig.phoneDisplay}
          </a>
        </div>
      </div>
    </section>
  );
}