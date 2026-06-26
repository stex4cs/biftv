import type { Metadata, Viewport } from "next";
import "./globals.css";
import MetaPixel from "@/components/MetaPixel";
import GoogleAnalytics from "@/components/GoogleAnalytics";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://biftv.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "BIF.TV — Balkan Influence Fighting · Live Streaming",
    template: "%s · BIF.TV",
  },
  description:
    "Premijerni dom Balkan Influence Fighting-a. Gledaj svaki BIF događaj uživo, replay-eve i ekskluzivni sadržaj — na jednom mestu.",
  keywords: [
    "BIF",
    "Balkan Influence Fighting",
    "boks",
    "PPV",
    "live stream",
    "Kengur",
    "Marko Jack",
    "Beograd",
  ],
  authors: [{ name: "BIF.TV" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "BIF.TV — Live boxing & combat from Balkan Influence Fighting",
    description:
      "Stream every BIF event live. Replays, exclusive content, premium player.",
    type: "website",
    url: SITE,
    siteName: "BIF.TV",
    locale: "sr_RS",
  },
  twitter: {
    card: "summary_large_image",
    title: "BIF.TV — Balkan Influence Fighting",
    description:
      "Stream every BIF event live. Replays, exclusive content, premium player.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
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
    <html lang="sr">
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
      </head>
      <body>
        {children}
        <MetaPixel />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
