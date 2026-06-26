import type { Metadata, Viewport } from "next";
import "./globals.css";
import MetaPixel from "@/components/MetaPixel";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import JsonLd from "@/components/JsonLd";
import { organizationSchema, websiteSchema } from "@/lib/schema";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://biftv.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default:
      "BIF.TV — Live PPV Streaming · Balkan Influence Fighting uživo",
    template: "%s · BIF.TV",
  },
  description:
    "Premium home of Balkan Influence Fighting · Premijerni dom BIF događaja. Live PPV stream, 48h replay, prenosi uživo i ekskluzivni sadržaj — na jednom mestu.",
  applicationName: "BIF.TV",
  keywords: [
    "BIF",
    "BIF.TV",
    "Balkan Influence Fighting",
    "BIF events",
    "live PPV streaming",
    "boxing live stream",
    "MMA Balkans",
    "Kengur",
    "Marko Jack",
    "Beograd",
    "boks uživo",
    "borbe uživo",
    "prenos uživo",
    "PPV Srbija",
    "BIF online",
    "kupi pass BIF",
    "BIF replay",
  ],
  category: "sports",
  authors: [{ name: "BIF Events" }],
  creator: "BIF",
  publisher: "BIF.TV",
  alternates: {
    canonical: "/",
    languages: {
      "sr-RS": "/",
      en: "/",
      "x-default": "/",
    },
  },
  openGraph: {
    title:
      "BIF.TV — Live PPV Streaming · Balkan Influence Fighting uživo",
    description:
      "Stream every BIF event live · Gledaj BIF događaje uživo. 48h replay, ekskluzivni sadržaj, premium player.",
    type: "website",
    url: SITE,
    siteName: "BIF.TV",
    locale: "sr_RS",
    alternateLocale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BIF.TV — Balkan Influence Fighting uživo",
    description:
      "Live PPV stream + replay svakog BIF događaja · Stream every BIF event live.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  other: {
    "format-detection": "telephone=no",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0a",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sr-RS">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Oswald:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <JsonLd data={organizationSchema()} />
        <JsonLd data={websiteSchema()} />
      </head>
      <body>
        {children}
        <MetaPixel />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
