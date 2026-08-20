import type { MetadataRoute } from "next";

import { services } from "@/lib/data/services";
import { locations } from "@/lib/data/locations";
import { getAllBlogData } from "@/lib/blog/get-all-blog-data";

const baseUrl = "https://www.piperesque.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const blogs = getAllBlogData();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/service-areas`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.85,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  const servicePages: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const locationPages: MetadataRoute.Sitemap = locations.map((location) => ({
    url: `${baseUrl}/location/${location.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  const blogPages: MetadataRoute.Sitemap = blogs.map((blog) => {
    const publishedDate = new Date(blog.publishedAt);

    return {
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: Number.isNaN(publishedDate.getTime())
        ? now
        : publishedDate,
      changeFrequency: "monthly",
      priority: 0.8,
    };
  });
    const locationServicePages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/location/houston/emergency-plumbing`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/location/houston/sewer-line-repair`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/location/houston/drain-cleaning`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/location/houston/leak-detection`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
    {
      url: `${baseUrl}/location/houston/water-heater-repair`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.95,
    },
  ];

  const sitemap: MetadataRoute.Sitemap = [
    ...staticPages,
    ...servicePages,
    ...locationPages,
    ...blogPages,
    ...locationServicePages,
  ];

  return sitemap;
}