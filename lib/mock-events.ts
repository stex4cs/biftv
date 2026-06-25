import type { EventBase } from "./types";

/**
 * Temporary mock events while Supabase is not yet wired in.
 * Replace getEvents() / getEventBySlug() with real Supabase queries.
 */
export const mockEvents: EventBase[] = [
  {
    id: "bif-3",
    slug: "bif-3",
    title: "BIF 3",
    subtitle: "The crown belongs to whoever takes it",
    sponsorLine: "Powered by Oktagonbet",
    posterUrl: "/posters/bif-3-poster.png",
    date: "2026-10-15T19:00:00+02:00",
    doorsOpen: "19:00",
    mainEventTime: "22:00",
    venue: "TBA",
    venueCity: "Beograd",
    description:
      "After Kengur dethroned Marko Jack at BIF 2, the line of challengers is forming. BIF 3 sets the next chapter — new fights, returning legends, and surprises live from Belgrade.",
    fights: [],
    prices: {
      livePass: 9,
      vodPass: 5,
      bundlePass: 12,
      currency: "EUR",
    },
    status: "upcoming",
  },
  {
    id: "bif-2",
    slug: "bif-2",
    title: "BIF 2 — Beogradski Sajam",
    subtitle: "Kengur crowned new BIF Champion",
    sponsorLine: "Powered by Oktagonbet",
    posterUrl: "/posters/bif-2-poster.png",
    date: "2026-06-20T19:00:00+02:00",
    doorsOpen: "19:00",
    mainEventTime: "22:00",
    venue: "Beogradski Sajam, Hala 3",
    venueCity: "Beograd",
    description:
      "The night that crowned Kengur as BIF Champion. Five main fights, a 3v1 handicap, surprises that lit up Hall 3. Watch the full replay.",
    fights: [
      {
        id: "f1",
        order: 1,
        startTimeHint: "20:00",
        fighter1: "Nenad Antonio",
        fighter2: "Ćure, Riđi & Loki",
        isHandicap: true,
        rounds: 5,
        roundDuration: "1.5 min",
        breakDuration: "1.5 min",
        result: { winner: "Ćure, Riđi & Loki", method: "TKO" },
      },
      {
        id: "f2",
        order: 2,
        startTimeHint: "20:30",
        fighter1: "Ksima",
        fighter2: "Bakić",
        rounds: 3,
        roundDuration: "3 min",
        breakDuration: "1 min",
        result: { winner: "Bakić", method: "TKO" },
      },
      {
        id: "f3",
        order: 3,
        startTimeHint: "21:00",
        fighter1: "Bukur",
        fighter2: "Pena Kamen",
        rounds: 5,
        roundDuration: "1 min",
        breakDuration: "1 min",
        result: { winner: "Pena Kamen", method: "TKO" },
      },
      {
        id: "f4",
        order: 4,
        startTimeHint: "21:30",
        fighter1: "Duka Prase",
        fighter2: "Marko Filipović",
        matchType: "co-main",
        rounds: 5,
        roundDuration: "2 min",
        breakDuration: "2 min",
        result: { winner: "Duka Prase", method: "SD" },
      },
      {
        id: "f5",
        order: 5,
        startTimeHint: "22:00",
        fighter1: "Marko Jack",
        fighter2: "Kengur",
        matchType: "main",
        rounds: 5,
        roundDuration: "2 min",
        breakDuration: "2 min",
        result: { winner: "Kengur", method: "TKO" },
      },
    ],
    prices: {
      livePass: 9,
      vodPass: 5,
      bundlePass: 12,
      currency: "EUR",
    },
    status: "vod",
    vodAvailableAt: "2026-06-22T00:00:00+02:00",
  },
];

export function getFeaturedUpcoming(): EventBase | null {
  return (
    mockEvents.find((e) => e.status === "upcoming" || e.status === "live") ??
    null
  );
}

export function getEvents(): EventBase[] {
  return [...mockEvents].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getEventBySlug(slug: string): EventBase | undefined {
  return mockEvents.find((e) => e.slug === slug);
}
