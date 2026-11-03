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
    "@type": "Organization",
    "@id": `${siteConfig.website}/#organization`,
    name: siteConfig.company,
    alternateName: `${siteConfig.company} Plumbing Referral Network`,
    url: siteConfig.website,
    logo: `${siteConfig.website}${siteConfig.logo}`,
    telephone: siteConfig.phone,
    email: siteConfig.email,
    description: `Independent plumbing referral and informational resource connecting property owners with independent licensed plumbing service providers serving ${currentCity.name}, Texas.`,
    areaServed: {
      "@type": "AdministrativeArea",
      name: `${currentCity.name}, TX`,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer referral line",
      telephone: siteConfig.phone,
      email: siteConfig.email,
      availableLanguage: ["English"],
      areaServed: "US",
    },
  };

  return <JsonLd schema={schema} />;
}