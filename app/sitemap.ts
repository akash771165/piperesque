import type { MetadataRoute } from "next";

import { getAllBlogData } from "@/lib/blog/get-all-blog-data";
import { siteConfig } from "@/lib/config/site";

const baseUrl = siteConfig.website.replace(/\/$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getAllBlogData();

  /*
   * =========================================================
   * STATIC PAGES
   * =========================================================
   */

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/service-areas`,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.2,
    },
  ];

  /*
   * =========================================================
   * SERVICE PAGES
   * =========================================================
   */

  const servicePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/services/emergency-plumbing`,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/services/residential-plumbing`,
      changeFrequency: "monthly",
      priority: 0.85,
    },
  ];

  /*
   * =========================================================
   * HOUSTON LOCATION + SERVICE PAGES
   * =========================================================
   */

  const locationServicePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/location/houston/emergency-plumbing`,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/location/houston/sewer-line-repair`,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/location/houston/drain-cleaning`,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/location/houston/leak-detection`,
      changeFrequency: "monthly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/location/houston/water-heater-repair`,
      changeFrequency: "monthly",
      priority: 0.95,
    },
  ];

  /*
   * =========================================================
   * BLOG PAGES
   *
   * BlogCardData does not contain a "published" property.
   * Therefore we use the data returned by getAllBlogData()
   * directly and use publishedAt for lastModified.
   * =========================================================
   */

  const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => {
    const publishedDate = new Date(blog.publishedAt);

    return {
      url: `${baseUrl}/blog/${blog.slug}`,
      ...(Number.isNaN(publishedDate.getTime())
        ? {}
        : { lastModified: publishedDate }),
      changeFrequency: "monthly",
      priority: 0.75,
    };
  });

  /*
   * =========================================================
   * COMBINE ALL SITEMAP URLs
   * =========================================================
   */

  return [
    ...staticPages,
    ...servicePages,
    ...locationServicePages,
    ...blogPages,
  ];
}