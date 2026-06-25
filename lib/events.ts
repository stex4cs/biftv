import { supabaseAdmin } from "./supabase-server";
import type { EventBase, Fight } from "./types";
import { mockEvents } from "./mock-events";

/**
 * Database row → EventBase mapper.
 */
function rowToEvent(row: Record<string, unknown>): EventBase {
  return {
    id: String(row.id),
    slug: String(row.slug),
    title: String(row.title),
    subtitle: (row.subtitle as string) ?? undefined,
    sponsorLine: (row.sponsor_line as string) ?? undefined,
    posterUrl: (row.poster_url as string) ?? "",
    trailerVideoUrl: (row.trailer_video_url as string) ?? undefined,
    date: String(row.date),
    doorsOpen: (row.doors_open as string) ?? undefined,
    mainEventTime: (row.main_event_time as string) ?? undefined,
    venue: (row.venue as string) ?? "",
    venueCity: (row.venue_city as string) ?? "",
    description: (row.description as string) ?? "",
    fights: ((row.fights as Fight[]) ?? []),
    prices: row.prices as EventBase["prices"],
    status: row.status as EventBase["status"],
    muxLiveStreamId: (row.mux_live_stream_id as string) ?? undefined,
    muxPlaybackId: (row.mux_playback_id as string) ?? undefined,
    vodAvailableAt: (row.vod_available_at as string) ?? undefined,
  };
}

/**
 * Fetch all visible events. Falls back to mock data when DB has no rows yet.
 */
export async function getEvents(): Promise<EventBase[]> {
  try {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .in("status", ["upcoming", "live", "ended", "vod"])
      .order("date", { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) return [...mockEvents];
    return data.map(rowToEvent);
  } catch (err) {
    console.warn("[events] Supabase fetch failed, falling back to mocks:", err);
    return [...mockEvents];
  }
}

export async function getEventBySlug(
  slug: string,
): Promise<EventBase | null> {
  try {
    const supabase = supabaseAdmin();
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .eq("slug", slug)
      .maybeSingle();
    if (error) throw error;
    if (data) return rowToEvent(data);
  } catch (err) {
    console.warn(
      "[events] Supabase getEventBySlug failed, trying mocks:",
      err,
    );
  }
  return mockEvents.find((e) => e.slug === slug) ?? null;
}

export async function getFeaturedUpcoming(): Promise<EventBase | null> {
  const events = await getEvents();
  return (
    events.find((e) => e.status === "live" || e.status === "upcoming") ?? null
  );
}
