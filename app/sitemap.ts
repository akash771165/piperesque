import type { MetadataRoute } from "next";

import { getAllBlogData } from "@/lib/blog/get-all-blog-data";
import { siteConfig } from "@/lib/config/site";
import { services } from "@/lib/data/services";
import { cities } from "@/lib/data/cities";
import { locations } from "@/lib/data/locations";

const baseUrl = siteConfig.website.replace(/\/+$/, "");

export default function sitemap(): MetadataRoute.Sitemap {
  const blogs = getAllBlogData();

  // 1. Static Core Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/service-areas`,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/about`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // 2. Core Plumbing Service Pages (All 10 services)
  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    changeFrequency: "monthly",
    priority: service.slug === "emergency-plumbing" ? 0.95 : 0.85,
  }));

  // 3. Service Area City Pages (All 10 cities)
  const cityPages: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/service-areas/${city.slug}`,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  // 4. Location + Service Pages (10 locations x 10 services = 100 pages)
  const supportedLocationServices = [
    "emergency-plumbing",
    "sewer-line-repair",
    "drain-cleaning",
    "leak-detection",
    "water-heater-repair",
    "pipe-repair",
    "toilet-repair",
    "faucet-repair",
    "commercial-plumbing",
    "residential-plumbing",
  ];

  const locationServicePages: MetadataRoute.Sitemap = [];
  for (const loc of locations) {
    for (const serviceSlug of supportedLocationServices) {
      locationServicePages.push({
        url: `${baseUrl}/location/${loc.slug}/${serviceSlug}`,
        changeFrequency: "monthly",
        priority: loc.slug === "houston" ? 0.9 : 0.75,
      });
    }
  }

  // 5. Blog Pages with authentic lastModified timestamps
  const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => {
    const publishedDate = new Date(blog.publishedAt);
    return {
      url: `${baseUrl}/blog/${blog.slug}`,
      ...(Number.isNaN(publishedDate.getTime())
        ? {}
        : { lastModified: publishedDate }),
      changeFrequency: "monthly",
      priority: 0.7,
    };
  });

  return [
    ...staticPages,
    ...servicePages,
    ...cityPages,
    ...locationServicePages,
    ...blogPages,
  ];
}
