/**
 * JSON-LD schema.org generators.
 * https://developers.google.com/search/docs/appearance/structured-data
 *
 * Goals:
 * - Rich results in Google SERP (event date/time, location, price)
 * - Brand entity recognition (Organization knowledge panel)
 * - Multilingual signal (inLanguage)
 */

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://biftv.vercel.app";

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    "@id": `${SITE}#organization`,
    name: "BIF — Balkan Influence Fighting",
    alternateName: ["BIF.TV", "Balkan Influence Fighting", "BIF Events"],
    url: SITE,
    logo: {
      "@type": "ImageObject",
      url: `${SITE}/opengraph-image`,
      width: 1200,
      height: 630,
    },
    sport: ["Boxing", "Mixed Martial Arts"],
    sameAs: [
      "https://kick.com/bifevents",
    ],
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE}#website`,
    url: SITE,
    name: "BIF.TV",
    alternateName: "Balkan Influence Fighting TV",
    description:
      "Premium live PPV streaming home of Balkan Influence Fighting · Premijerni dom BIF događaja uživo.",
    inLanguage: ["sr-RS", "en"],
    publisher: { "@id": `${SITE}#organization` },
  };
}

type EventStatusKey = "upcoming" | "live" | "ended" | "vod";

type FightLite = {
  fighter1: string;
  fighter2: string;
  isHandicap?: boolean;
};

export function sportsEventSchema(opts: {
  slug: string;
  title: string;
  subtitle?: string | null;
  description?: string | null;
  date: string;
  posterUrl?: string | null;
  venue?: string | null;
  venueCity?: string | null;
  status: EventStatusKey;
  priceFromEur?: number;
  fights?: FightLite[];
}) {
  const url = `${SITE}/events/${opts.slug}`;
  const startDate = opts.date;
  const endDate = new Date(
    new Date(opts.date).getTime() + 4 * 60 * 60 * 1000,
  ).toISOString();

  const eventStatus =
    opts.status === "live"
      ? "https://schema.org/EventScheduled"
      : opts.status === "ended" || opts.status === "vod"
        ? "https://schema.org/EventScheduled"
        : "https://schema.org/EventScheduled";

  return {
    "@context": "https://schema.org",
    "@type": "SportsEvent",
    "@id": `${url}#event`,
    name: opts.title,
    description:
      opts.description ??
      `${opts.title}${opts.subtitle ? " — " + opts.subtitle : ""}. Live PPV stream + replay na BIF.TV.`,
    startDate,
    endDate,
    eventStatus,
    eventAttendanceMode: "https://schema.org/MixedEventAttendanceMode",
    location: [
      ...(opts.venue && opts.venue !== "TBA"
        ? [
            {
              "@type": "Place" as const,
              name: opts.venue,
              address: {
                "@type": "PostalAddress",
                addressLocality: opts.venueCity ?? "Beograd",
                addressCountry: "RS",
              },
            },
          ]
        : []),
      {
        "@type": "VirtualLocation" as const,
        url,
      },
    ],
    image: opts.posterUrl ? [opts.posterUrl] : [`${SITE}/opengraph-image`],
    organizer: { "@id": `${SITE}#organization` },
    sport: "Combat sports",
    performer:
      opts.fights && opts.fights.length > 0
        ? dedupeByName(
            opts.fights.flatMap((f) => [
              { "@type": "Person", name: f.fighter1 },
              { "@type": "Person", name: f.fighter2 },
            ]),
          )
        : [{ "@type": "PerformingGroup", name: "BIF Fighters" }],
    ...(opts.priceFromEur
      ? {
          offers: {
            "@type": "Offer",
            url,
            price: String(opts.priceFromEur),
            priceCurrency: "EUR",
            availability:
              opts.status === "ended"
                ? "https://schema.org/SoldOut"
                : "https://schema.org/InStock",
            validFrom: new Date().toISOString(),
            category:
              opts.status === "vod" ? "Replay PPV pass" : "Live PPV pass",
          },
        }
      : {}),
  };
}

function dedupeByName<T extends { name: string }>(items: T[]): T[] {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const item of items) {
    const key = item.name.toLowerCase().trim();
    if (key && !seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

export function videoObjectSchema(opts: {
  slug: string;
  title: string;
  description: string;
  uploadDate: string;
  thumbnailUrl?: string | null;
  isLive: boolean;
  durationIso?: string;
}) {
  const url = `${SITE}/events/${opts.slug}`;
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: opts.title,
    description: opts.description,
    thumbnailUrl: opts.thumbnailUrl ?? `${SITE}/opengraph-image`,
    uploadDate: opts.uploadDate,
    contentUrl: url,
    embedUrl: url,
    ...(opts.durationIso ? { duration: opts.durationIso } : {}),
    ...(opts.isLive
      ? {
          publication: {
            "@type": "BroadcastEvent",
            isLiveBroadcast: true,
            startDate: opts.uploadDate,
            endDate: new Date(
              new Date(opts.uploadDate).getTime() + 4 * 60 * 60 * 1000,
            ).toISOString(),
          },
        }
      : {}),
  };
}

export function breadcrumbSchema(
  items: Array<{ name: string; href?: string }>,
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      ...(item.href ? { item: `${SITE}${item.href}` } : {}),
    })),
  };
}

export function collectionPageSchema(opts: {
  url: string;
  name: string;
  description: string;
  events: Array<{ slug: string; title: string }>;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    url: `${SITE}${opts.url}`,
    name: opts.name,
    description: opts.description,
    inLanguage: ["sr-RS", "en"],
    isPartOf: { "@id": `${SITE}#website` },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: opts.events.map((e, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${SITE}/events/${e.slug}`,
        name: e.title,
      })),
    },
  };
}
