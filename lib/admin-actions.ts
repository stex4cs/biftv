"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ADMIN_COOKIE_NAME, verifyAdminSession } from "./admin-session";
import { supabaseAdmin } from "./supabase-server";
import { mux } from "./mux";
import { issueCompAccessToken } from "./access";

async function requireAdmin() {
  const cookie = cookies().get(ADMIN_COOKIE_NAME)?.value;
  if (!(await verifyAdminSession(cookie))) {
    redirect("/admin/login");
  }
}

export type ActionResult = { ok: true } | { ok: false; error: string };

export async function createEventAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const slug = String(formData.get("slug") ?? "").trim().toLowerCase();
  const title = String(formData.get("title") ?? "").trim();
  const subtitle = String(formData.get("subtitle") ?? "").trim();
  const date = String(formData.get("date") ?? "").trim();
  const venue = String(formData.get("venue") ?? "").trim();
  const venueCity = String(formData.get("venue_city") ?? "").trim();
  const livePass = Number(formData.get("live_pass") ?? 9);
  const vodPass = Number(formData.get("vod_pass") ?? 5);
  const bundlePass = Number(formData.get("bundle_pass") ?? 12);
  const posterUrl = String(formData.get("poster_url") ?? "").trim();

  if (!slug || !title || !date) {
    return { ok: false, error: "Slug, title i datum su obavezni." };
  }

  const supabase = supabaseAdmin();
  const { error } = await supabase.from("events").insert({
    slug,
    title,
    subtitle: subtitle || null,
    date,
    venue: venue || null,
    venue_city: venueCity || null,
    poster_url: posterUrl || null,
    fights: [],
    prices: {
      livePass,
      vodPass,
      bundlePass,
      currency: "EUR",
    },
    status: "upcoming",
  });

  if (error) {
    return { ok: false, error: error.message };
  }

  revalidatePath("/admin/events");
  revalidatePath("/admin");
  revalidatePath("/events");
  revalidatePath("/");
  redirect(`/admin/events/${slug}`);
}

export async function updateEventAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "id required" };

  const muxPlayback = String(formData.get("mux_playback_id") ?? "").trim();

  const patch: Record<string, unknown> = {
    title: String(formData.get("title") ?? "").trim(),
    subtitle: (String(formData.get("subtitle") ?? "").trim() || null),
    sponsor_line: String(formData.get("sponsor_line") ?? "").trim() || null,
    date: String(formData.get("date") ?? "").trim(),
    venue: String(formData.get("venue") ?? "").trim() || null,
    venue_city: String(formData.get("venue_city") ?? "").trim() || null,
    description: String(formData.get("description") ?? "").trim() || null,
    status: String(formData.get("status") ?? "upcoming"),
    mux_playback_id: muxPlayback || null,
    prices: {
      livePass: Number(formData.get("live_pass") ?? 9),
      vodPass: Number(formData.get("vod_pass") ?? 5),
      bundlePass: Number(formData.get("bundle_pass") ?? 12),
      currency: "EUR",
    },
  };

  const supabase = supabaseAdmin();
  const { error } = await supabase.from("events").update(patch).eq("id", id);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/admin/events");
  revalidatePath("/admin");
  revalidatePath("/events");
  revalidatePath("/");
  return { ok: true };
}

export async function uploadPosterAction(
  formData: FormData,
): Promise<{ ok: true; url: string } | { ok: false; error: string }> {
  await requireAdmin();
  const file = formData.get("file");
  const eventId = String(formData.get("event_id") ?? "");
  if (!(file instanceof File)) {
    return { ok: false, error: "Nije primljen fajl." };
  }
  if (file.size > 10 * 1024 * 1024) {
    return { ok: false, error: "Fajl je veći od 10 MB." };
  }
  if (!file.type.startsWith("image/")) {
    return { ok: false, error: "Samo slike (PNG/JPG/WEBP)." };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "png";
  const fname = `${eventId || "anon"}-${Date.now()}.${ext}`;

  const supabase = supabaseAdmin();
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error: upErr } = await supabase.storage
    .from("posters")
    .upload(fname, buffer, {
      contentType: file.type,
      upsert: true,
    });
  if (upErr) {
    return { ok: false, error: upErr.message };
  }

  const { data: pub } = supabase.storage.from("posters").getPublicUrl(fname);
  const publicUrl = pub.publicUrl;

  if (eventId) {
    await supabase
      .from("events")
      .update({ poster_url: publicUrl })
      .eq("id", eventId);
    revalidatePath("/admin/events");
    revalidatePath("/admin");
    revalidatePath("/events");
    revalidatePath("/");
  }

  return { ok: true, url: publicUrl };
}

export async function deleteEventAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return;
  const supabase = supabaseAdmin();
  await supabase.from("events").delete().eq("id", id);
  revalidatePath("/admin/events");
  revalidatePath("/admin");
  redirect("/admin/events");
}

export async function createMuxStreamAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, error: "id required" };

  const supabase = supabaseAdmin();
  const { data: ev } = await supabase
    .from("events")
    .select("id, mux_live_stream_id")
    .eq("id", id)
    .maybeSingle();
  if (!ev) return { ok: false, error: "Event nije pronađen." };
  if (ev.mux_live_stream_id) {
    return { ok: false, error: "Event već ima Mux stream." };
  }

  try {
    const live = await mux().video.liveStreams.create({
      playback_policy: ["signed"],
      new_asset_settings: { playback_policy: ["signed"] },
      latency_mode: "low",
      reconnect_window: 60,
      max_continuous_duration: 43200,
    });
    const playbackId =
      live.playback_ids?.find((p) => p.policy === "signed")?.id ??
      live.playback_ids?.[0]?.id ??
      null;
    await supabase
      .from("events")
      .update({
        mux_live_stream_id: live.id,
        mux_playback_id: playbackId,
        mux_stream_key: live.stream_key,
      })
      .eq("id", id);
    revalidatePath("/admin/events");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function issueCompPassAction(
  _prev: ActionResult | null,
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const eventId = String(formData.get("event_id") ?? "");
  const passType = String(formData.get("pass_type") ?? "live") as
    | "live"
    | "vod"
    | "bundle";
  const hours = Math.min(Math.max(Number(formData.get("hours") ?? 72), 1), 24 * 30);

  if (!email || !eventId) {
    return { ok: false, error: "Email i event su obavezni." };
  }

  try {
    await issueCompAccessToken({
      email,
      eventId,
      passType,
      expiresAt: new Date(Date.now() + hours * 60 * 60 * 1000),
    });
    revalidatePath("/admin/passes");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}

export async function revokePassAction(formData: FormData): Promise<void> {
  await requireAdmin();
  const token = String(formData.get("token") ?? "");
  if (!token) return;
  const supabase = supabaseAdmin();
  await supabase.from("access_tokens").update({ revoked: true }).eq("token", token);
  revalidatePath("/admin/passes");
}
