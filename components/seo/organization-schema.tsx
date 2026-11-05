import JsonLd from "@/components/seo/json-ld";
import { siteConfig } from "@/lib/config/site";

export default function OrganizationSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${siteConfig.website}/#organization`,
        name: siteConfig.company,
        alternateName: [
          `${siteConfig.company} Plumbing Referral`,
          `${siteConfig.company} Houston`,
        ],
        url: siteConfig.website,
        logo: {
          "@type": "ImageObject",
          url: `${siteConfig.website}/logo.png`,
          caption: "PipeResque Plumbing Referral Platform",
        },
        telephone: siteConfig.phone,
        email: siteConfig.email,
        description:
          "PipeResque is an informational plumbing resource and referral platform connecting property owners with independent third-party plumbing professionals in Greater Houston, Texas.",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Houston",
          addressRegion: "TX",
          addressCountry: "US",
        },
        areaServed: [
          {
            "@type": "City",
            name: "Houston",
            sameAs: "https://en.wikipedia.org/wiki/Houston",
          },
          { "@type": "City", name: "Katy" },
          { "@type": "City", name: "Sugar Land" },
          { "@type": "City", name: "Cypress" },
          { "@type": "City", name: "Spring" },
          { "@type": "City", name: "Pearland" },
          { "@type": "City", name: "Pasadena" },
          { "@type": "City", name: "Richmond" },
          { "@type": "City", name: "Missouri City" },
          { "@type": "City", name: "The Woodlands" },
        ],
        knowsAbout: [
          "Emergency Plumbing",
          "Drain Cleaning",
          "Sewer Line Repair",
          "Leak Detection",
          "Water Heater Repair",
          "Water Heater Expansion Tanks",
          "Burst Pipe Repair",
          "Slab Leak Detection",
          "Closed Plumbing Systems",
          "Houston Municipal Water Pressure and PRVs",
        ],
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: siteConfig.phone,
            contactType: "customer referral line",
            areaServed: "US",
            availableLanguage: ["English"],
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteConfig.website}/#website`,
        url: siteConfig.website,
        name: siteConfig.company,
        description:
          "Helpful plumbing guides, problem diagnosis, and telephone referral connections for Houston homeowners.",
        publisher: {
          "@id": `${siteConfig.website}/#organization`,
        },
        inLanguage: "en-US",
      },
    ],
  };

  return <JsonLd schema={schema} />;
}
