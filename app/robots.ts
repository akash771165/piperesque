import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

const privateRoutes = [
  "/api/",
  "/admin/",
  "/dashboard/",
  "/private/",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // Standard search engine crawlers
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: privateRoutes,
      },
      // AI Search & Grounding Crawlers (for real-time citations & answer engines)
      {
        userAgent: "OAI-SearchBot", // ChatGPT Search engine crawler
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "ChatGPT-User", // User-directed browsing in ChatGPT
        allow: "/",
        disallow: privateRoutes,
      },
      {
        userAgent: "PerplexityBot", // Perplexity AI search crawler
        allow: "/",
        disallow: privateRoutes,
      },
      // Universal fallback for all other legitimate crawlers
      {
        userAgent: "*",
        allow: "/",
        disallow: privateRoutes,
      },
    ],
    sitemap: `${siteConfig.website}/sitemap.xml`,
    host: siteConfig.website,
  };
}