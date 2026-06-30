import type { MetadataRoute } from "next";
import { supabaseAdmin } from "@/lib/supabase-server";

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? "https://biftv.vercel.app";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = supabaseAdmin();
  const { data: events } = await supabase
    .from("events")
    .select("slug, date, status, updated_at")
    .in("status", ["upcoming", "live", "vod", "ended"]);

  const eventEntries: MetadataRoute.Sitemap = (events ?? []).map((e) => ({
    url: `${SITE}/events/${e.slug}`,
    lastModified: new Date(e.updated_at ?? e.date),
    changeFrequency:
      e.status === "live" ? "always" : e.status === "upcoming" ? "daily" : "weekly",
    priority: e.status === "upcoming" || e.status === "live" ? 0.9 : 0.6,
  }));

  const now = new Date();
  return [
    {
      url: SITE,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${SITE}/events`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${SITE}/login`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${SITE}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${SITE}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
    {
      url: `${SITE}/terms`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${SITE}/privacy`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    ...eventEntries,
  ];
}
