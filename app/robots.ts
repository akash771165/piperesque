import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/admin/",
        "/dashboard/",
        "/private/",
      ],
    },

    sitemap: "https://www.piperesque.com/sitemap.xml",

    host: "https://www.piperesque.com",
  };
}