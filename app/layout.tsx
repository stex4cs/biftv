import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BIF.TV — Balkan Influence Fighting · Live Streaming",
  description:
    "Premium home of Balkan Influence Fighting live broadcasts, replays, and exclusive content. Watch every BIF event live.",
  metadataBase: new URL("https://bif.tv"),
  openGraph: {
    title: "BIF.TV — Live boxing & combat from Balkan Influence Fighting",
    description:
      "Stream every BIF event live. Replays, exclusive content, premium player.",
    type: "website",
    url: "https://bif.tv",
    siteName: "BIF.TV",
  },
  twitter: {
    card: "summary_large_image",
    title: "BIF.TV — Balkan Influence Fighting",
    description:
      "Stream every BIF event live. Replays, exclusive content, premium player.",
  },
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
        <meta name="theme-color" content="#0a0a0a" />
      </head>
      <body>{children}</body>
    </html>
  );
}
