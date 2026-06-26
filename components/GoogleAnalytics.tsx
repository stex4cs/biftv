"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

export default function GoogleAnalytics() {
  if (!GA_ID) return null;
  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}', { send_page_view: false });
        `}
      </Script>
      <Suspense fallback={null}>
        <GaRouteTracker />
      </Suspense>
    </>
  );
}

function GaRouteTracker() {
  const pathname = usePathname();
  const params = useSearchParams();
  useEffect(() => {
    if (typeof window === "undefined" || !window.gtag) return;
    const search = params?.toString();
    const path = search ? `${pathname}?${search}` : pathname;
    window.gtag("event", "page_view", {
      page_path: path,
      page_location: window.location.href,
    });
  }, [pathname, params]);
  return null;
}
