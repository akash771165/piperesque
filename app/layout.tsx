import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";

const Analytics = () => null;
const SpeedInsights = () => null;

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
    "Looking for emergency plumbing assistance in Houston, TX? Call (877) 364-0861 to connect with independent local plumbing professionals for burst pipes, clogged drains, leaks, sewer backups, and water heaters.",

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
    "urgent plumbing Houston",
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
      "Looking for emergency plumbing assistance in Houston, TX? Call (877) 364-0861 to connect with independent local plumbing professionals for burst pipes, clogged drains, leaks, sewer backups, and water heaters.",

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
      "Looking for emergency plumbing assistance in Houston, TX? Call (877) 364-0861 to connect with independent local plumbing professionals for burst pipes, clogged drains, leaks, sewer backups, and water heaters.",

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
      <body
        suppressHydrationWarning
        className="min-h-screen bg-white text-slate-900 antialiased"
      >
        {children}

        {/* Microsoft Clarity */}
        <ClarityProvider />

        {/* Vercel Analytics */}
        <Analytics />

        {/* Vercel Speed Insights */}
        <SpeedInsights />
      </body>
    </html>
  );
}