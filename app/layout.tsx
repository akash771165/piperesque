import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

import {
  GoogleAnalytics,
  GoogleTagManager,
} from "@next/third-parties/google";

import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

import "./globals.css";

import ClarityProvider from "@/components/providers/clarity";
import { siteConfig } from "@/lib/config/site";

/* =========================================================
   GLOBAL FONT
========================================================= */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  preload: true,
});

/* =========================================================
   GLOBAL METADATA
========================================================= */

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.website),

  title: {
    default: `${siteConfig.company} | Emergency Plumbing Help in Houston, TX`,
    template: `%s | ${siteConfig.company}`,
  },

  description:
    "Piperesque helps homeowners in Houston, TX connect with independent plumbing professionals for emergency plumbing, drain cleaning, leak detection, sewer line repair, and water heater services.",

  applicationName: siteConfig.company,

  referrer: "origin-when-cross-origin",

  formatDetection: {
    telephone: false,
    address: false,
    email: false,
  },

  keywords: [
    "emergency plumbing Houston",
    "emergency plumber Houston",
    "plumbing services Houston TX",
    "24 hour plumbing Houston",
    "drain cleaning Houston",
    "leak detection Houston",
    "sewer line repair Houston",
    "water heater repair Houston",
    "residential plumbing Houston",
  ],

  authors: [
    {
      name: siteConfig.company,
      url: siteConfig.website,
    },
  ],

  creator: siteConfig.company,

  publisher: siteConfig.company,

  category: "Home Services",

  alternates: {
    canonical: `${siteConfig.website}/`,
  },

  robots: {
    index: true,
    follow: true,
    nocache: false,

    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-video-preview": -1,
      "max-snippet": -1,
    },
  },

  openGraph: {
    type: "website",
    locale: "en_US",
    url: siteConfig.website,
    siteName: siteConfig.company,

    title: `${siteConfig.company} | Emergency Plumbing Help in Houston`,

    description:
      "Connect with independent plumbing professionals serving Houston and surrounding areas.",

    images: [
      {
        url: siteConfig.ogImage,
        width: 1200,
        height: 630,
        alt: `${siteConfig.company} plumbing assistance in Houston`,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",

    title: `${siteConfig.company} | Emergency Plumbing Help Houston`,

    description:
      "Connect with independent plumbing professionals serving Houston and surrounding areas.",

    images: [siteConfig.ogImage],
  },

  icons: {
    icon: siteConfig.favicon,
    shortcut: siteConfig.favicon,
    apple: "/apple-touch-icon.png",
  },

  verification: {
    google: "cISOThami1OgkEXgEDJFCmELq48QtmnNTdu7V-Iovu4",
    other: {
      "msvalidate.01": "F3D745A737355A821E78CB7B47E9DD92",
    },
  },
};

/* =========================================================
   VIEWPORT
========================================================= */

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#0b5fff",
};

/* =========================================================
   ROOT LAYOUT
========================================================= */

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={inter.variable}
      suppressHydrationWarning
    >
      <head>
        {/* Performance hints for analytics */}
        <link
          rel="preconnect"
          href="https://www.googletagmanager.com"
          crossOrigin="anonymous"
        />

        <link
          rel="preconnect"
          href="https://www.google-analytics.com"
          crossOrigin="anonymous"
        />

        <link
          rel="dns-prefetch"
          href="//www.googletagmanager.com"
        />

        <link
          rel="dns-prefetch"
          href="//www.google-analytics.com"
        />
      </head>

      <body
        suppressHydrationWarning
        className="min-h-screen bg-white text-slate-900 antialiased"
      >
        {children}

        {/* Microsoft Clarity */}
        <ClarityProvider />

        {/* Google Tag Manager */}
        <GoogleTagManager gtmId="GTM-TC26LK2X" />

        {/* Google Analytics */}
        <GoogleAnalytics gaId="G-CEVKCPR498" />

        {/* Vercel Analytics */}
        <Analytics />

        {/* Vercel Speed Insights */}
        <SpeedInsights />
      </body>
    </html>
  );
}