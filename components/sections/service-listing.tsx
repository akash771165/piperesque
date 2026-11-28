import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, CheckCircle2, MapPin, Phone } from "lucide-react";

import { services as defaultServices, type Service } from "@/lib/data/services";
import { siteConfig } from "@/lib/config/site";

const CYPRESS_CORE_SERVICE_SLUGS = new Set([
  "emergency-plumbing",
  "sewer-line-repair",
  "drain-cleaning",
  "leak-detection",
  "water-heater-repair",
  "pipe-repair",
]);

const SERVICE_GUIDE_MAP: Record<string, { label: string; href: string }> = {
  "emergency-plumbing": {
    label: "Emergency Triage Guide",
    href: "/blog/emergency-plumber-near-me-houston",
  },
  "sewer-line-repair": {
    label: "Sewer Repair Guide",
    href: "/blog/sewer-line-repair-houston-tx",
  },
  "drain-cleaning": {
    label: "Drain Cleaning Guide",
    href: "/blog/drain-cleaning-houston-tx",
  },
  "leak-detection": {
    label: "Leak Detection Guide",
    href: "/blog/leak-detection-houston-tx",
  },
  "water-heater-repair": {
    label: "Water Heater Guide",
    href: "/blog/water-heater-repair-houston-tx",
  },
  "pipe-repair": {
    label: "Burst Pipe Guide",
    href: "/blog/burst-pipe-repair-houston-tx",
  },
};

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  const Icon = service.icon;
  const serviceHref = `/services/${service.slug}`;
  const houstonHref = `/location/houston/${service.slug}`;
  const hasCypressHub = CYPRESS_CORE_SERVICE_SLUGS.has(service.slug);
  const cypressHref = `/location/cypress/${service.slug}`;
  const guide = SERVICE_GUIDE_MAP[service.slug];
  const highlights = service.benefits.slice(0, 3);

  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:border-blue-200 hover:shadow-xl">
      <Link
        href={serviceHref}
        className="relative block h-64 overflow-hidden bg-slate-100"
        aria-label={`Explore ${service.shortTitle} services in Houston, TX`}
      >
        <Image
          src={service.image}
          alt={`${service.shortTitle} plumbing services in Houston, TX`}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          loading="lazy"
          referrerPolicy="no-referrer"
          className="object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="flex flex-1 flex-col p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            <Icon size={28} aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900">
              <Link
                href={serviceHref}
                className="transition hover:text-blue-700"
              >
                {service.shortTitle}
              </Link>
            </h3>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Houston, TX &amp; Greater Suburbs
            </p>
          </div>
        </div>

        <p className="mt-5 leading-7 text-slate-600">{service.description}</p>

        {highlights.length > 0 && (
          <ul className="mt-6 space-y-2.5 text-sm text-slate-700">
            {highlights.map((benefit) => (
              <li key={benefit} className="flex items-center gap-2.5">
                <CheckCircle2
                  size={17}
                  className="shrink-0 text-emerald-600"
                  aria-hidden="true"
                />
                <span>{benefit}</span>
              </li>
            ))}
          </ul>
        )}

        {/* Internal Link Distribution Row */}
        <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-100 pt-5 text-xs font-semibold text-blue-700">
          <Link
            href={houstonHref}
            className="inline-flex items-center gap-1 hover:text-blue-900 hover:underline"
          >
            <MapPin size={13} aria-hidden="true" />
            Houston {service.shortTitle}
          </Link>

          {hasCypressHub && (
            <Link
              href={cypressHref}
              className="inline-flex items-center gap-1 hover:text-blue-900 hover:underline"
            >
              <MapPin size={13} aria-hidden="true" />
              Cypress {service.shortTitle}
            </Link>
          )}

          {guide && (
            <Link
              href={guide.href}
              className="inline-flex items-center gap-1 text-slate-700 hover:text-blue-800 hover:underline"
            >
              <BookOpen size={13} aria-hidden="true" />
              {guide.label}
            </Link>
          )}
        </div>

        <div className="mt-auto flex flex-wrap items-center gap-3 pt-6">
          <a
            href={`tel:${siteConfig.phone}`}
            data-event="phone_click_service"
            aria-label={`Call PipeResque for ${service.shortTitle} at ${siteConfig.phoneDisplay}`}
            className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-black text-slate-950 transition hover:bg-amber-400"
          >
            <Phone size={15} aria-hidden="true" />
            Call {siteConfig.phoneDisplay}
          </a>

          <Link
            href={serviceHref}
            className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:border-blue-300 hover:text-blue-800"
          >
            Explore {service.shortTitle}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}

interface ServiceListingSectionProps {
  items?: Service[];
  heading?: string;
  subheading?: string;
}

export default function ServiceListingSection({
  items = defaultServices,
  heading = "Specialized Plumbing Services",
  subheading = "Select your specific plumbing issue below to explore warning signs, diagnostic methods, local Houston & Cypress hubs, and independent contractor referrals.",
}: ServiceListingSectionProps) {
  return (
    <section id="all-services" className="py-20 md:py-24">
      <div className="container-custom">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <h2 className="text-3xl font-black text-slate-900 md:text-4xl">
            {heading}
          </h2>
          <p className="mt-4 text-slate-600">{subheading}</p>
        </div>

        {/* Crawl-Friendly Service Directory Nav */}
        <nav
          aria-label="All plumbing services directory"
          className="mb-12 flex flex-wrap items-center justify-center gap-2.5"
        >
          {items.map((service) => (
            <Link
              key={service.slug}
              href={`/services/${service.slug}`}
              className="rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-bold text-slate-700 transition hover:border-blue-300 hover:bg-blue-50 hover:text-blue-800 sm:text-sm"
            >
              {service.shortTitle}
            </Link>
          ))}
        </nav>

        <div className="grid gap-8 md:grid-cols-2">
          {items.map((service) => (
            <ServiceCard key={service.slug} service={service} />
          ))}
        </div>
      </div>
    </section>
  );
}
