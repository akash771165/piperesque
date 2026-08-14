import bundleAnalyzer from "@next/bundle-analyzer";
import type { NextConfig } from "next";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,

  compress: true,

  poweredByHeader: false,

  trailingSlash: false,

  generateEtags: true,

  images: {
    formats: ["image/avif", "image/webp"],

    qualities: [75, 90],

    minimumCacheTTL: 31536000,

    remotePatterns: [],
  },

  experimental: {
    optimizePackageImports: ["lucide-react"],
  },

  async redirects() {
    return [
      // Individual location pages → emergency plumbing pages
      { source: "/location/houston", destination: "/location/houston/emergency-plumbing", permanent: true },
      { source: "/location/katy", destination: "/location/katy/emergency-plumbing", permanent: true },
      { source: "/location/sugar-land", destination: "/location/sugar-land/emergency-plumbing", permanent: true },
      { source: "/location/cypress", destination: "/location/cypress/emergency-plumbing", permanent: true },
      { source: "/location/spring", destination: "/location/spring/emergency-plumbing", permanent: true },
      { source: "/location/pearland", destination: "/location/pearland/emergency-plumbing", permanent: true },
      { source: "/location/pasadena", destination: "/location/pasadena/emergency-plumbing", permanent: true },
      { source: "/location/richmond", destination: "/location/richmond/emergency-plumbing", permanent: true },
      { source: "/location/missouri-city", destination: "/location/missouri-city/emergency-plumbing", permanent: true },
      { source: "/location/the-woodlands", destination: "/location/the-woodlands/emergency-plumbing", permanent: true },
      { source: "/location/tomball", destination: "/services/emergency-plumbing", permanent: true },
      { source: "/location/conroe", destination: "/services/emergency-plumbing", permanent: true },
      { source: "/location/league-city", destination: "/services/emergency-plumbing", permanent: true },

      // Deleted low-priority blog posts → most relevant service pages
      { source: "/blog/faucet-repair-houston-tx", destination: "/services/emergency-plumbing", permanent: true },
      { source: "/blog/garbage-disposal-repair-houston-tx", destination: "/services/emergency-plumbing", permanent: true },
      { source: "/blog/toilet-repair-houston-tx", destination: "/services/emergency-plumbing", permanent: true },
      { source: "/blog/shower-repair-houston-tx", destination: "/services/emergency-plumbing", permanent: true },
      { source: "/blog/bathtub-repair-houston-tx", destination: "/services/emergency-plumbing", permanent: true },
      { source: "/blog/gas-line-repair-houston-tx", destination: "/services/burst-pipe-repair", permanent: true },
      { source: "/blog/commercial-plumbing-houston-tx", destination: "/about", permanent: true },
      { source: "/blog/emergency-drain-cleaning-houston-tx", destination: "/blog/emergency-drain-cleaning-houston", permanent: true },

      // Service area city pages for deleted cities
      { source: "/service-areas/tomball", destination: "/service-areas", permanent: true },
      { source: "/service-areas/conroe", destination: "/service-areas", permanent: true },
      { source: "/service-areas/league-city", destination: "/service-areas", permanent: true },
    ];
  },

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },

          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          {
            key: "Permissions-Policy",
            value:
              "camera=(), microphone=(), geolocation=(), browsing-topics=()",
          },
        ],
      },

      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },

      {
        source: "/fonts/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);