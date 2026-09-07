import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",

    name: `${siteConfig.company} | Plumbing Assistance in Houston`,

    short_name: siteConfig.company,

    description:
      "Piperesque helps homeowners in Houston and surrounding areas connect with independent plumbing professionals for emergency and routine plumbing needs.",

    start_url: "/",

    scope: "/",

    display: "standalone",

    display_override: ["standalone", "minimal-ui"],

    orientation: "portrait",

    background_color: "#ffffff",

    theme_color: "#0b5fff",

    lang: "en-US",

    dir: "ltr",

    categories: [
      "business",
      "home-services",
      "plumbing",
      "utilities",
    ],

    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },

      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },

      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },

      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],

    shortcuts: [
      {
        name: "Call for Plumbing Assistance",
        short_name: "Call",
        url: `tel:${siteConfig.phone}`,
      },

      {
        name: "Request Plumbing Assistance",
        short_name: "Request Help",
        url: "/contact",
      },

      {
        name: "Explore Plumbing Services",
        short_name: "Services",
        url: "/services",
      },
    ],
  };
}