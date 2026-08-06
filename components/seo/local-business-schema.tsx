import JsonLd from "@/components/seo/json-ld";
import { SCHEMA_CONTEXT } from "@/lib/seo/schema";
import { siteConfig } from "@/lib/config/site";
import type { City } from "@/lib/data/cities";

interface Props {
  city?: City;
}

export default function LocalBusinessSchema({ city }: Props) {
  const currentCity = city ?? {
    name: siteConfig.city,
    slug: "houston",
    state: siteConfig.state,
  };

  const schema = {
    "@context": SCHEMA_CONTEXT,
    "@type": "Plumber",

    "@id": `${siteConfig.website}/service-areas/${currentCity.slug}#localbusiness`,

    name: `${siteConfig.company}`,

    alternateName: `${siteConfig.company} Plumbing Services`,

    url: `${siteConfig.website}/service-areas/${currentCity.slug}`,

    image: `${siteConfig.website}${siteConfig.ogImage}`,

    logo: `${siteConfig.website}${siteConfig.logo}`,

    telephone: siteConfig.phone,

    email: siteConfig.email,

    description: `24/7 emergency plumbing, drain cleaning, leak detection, sewer line repair, water heater repair, and residential & commercial plumbing services in ${currentCity.name}, Texas.`,

    priceRange: "$$",

    address: {
      "@type": "PostalAddress",
      addressLocality: currentCity.name,
      addressRegion: currentCity.state,
      addressCountry: "US",
    },

    areaServed: {
      "@type": "City",
      name: currentCity.name,
    },

    openingHours: siteConfig.openingHours,

    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: siteConfig.phone,
      availableLanguage: ["English"],
      areaServed: "US",
    },

    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Plumbing Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Emergency Plumbing",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Drain Cleaning",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Leak Detection",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Water Heater Repair",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Sewer Line Repair",
          },
        },
      ],
    },

    sameAs: [
      siteConfig.facebook,
      siteConfig.instagram,
      siteConfig.linkedin,
      siteConfig.youtube,
      siteConfig.x,
    ].filter(Boolean),
  };

  return <JsonLd schema={schema} />;
}