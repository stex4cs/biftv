import { NextResponse } from "next/server";
import { mux } from "@/lib/mux";
import { supabaseAdmin } from "@/lib/supabase-server";
import { isAdminRequest } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/streams/create
 * Body: { eventId: string }
 * Headers: Authorization: Bearer <ADMIN_API_TOKEN>
 *
 * Creates a Mux live stream for the given event, then writes
 * mux_live_stream_id, mux_playback_id, mux_stream_key back to events.
 */
export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { eventId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const eventId = (body.eventId ?? "").trim();
  if (!eventId) {
    return NextResponse.json({ error: "eventId required" }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { data: ev, error: evErr } = await supabase
    .from("events")
    .select("id, title, mux_live_stream_id")
    .eq("id", eventId)
    .maybeSingle();
  if (evErr || !ev) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }
  if (ev.mux_live_stream_id) {
    return NextResponse.json(
      { error: "Event already has a stream", liveStreamId: ev.mux_live_stream_id },
      { status: 409 },
    );
  }

  try {
    const live = await mux().video.liveStreams.create({
      playback_policy: ["signed"],
      new_asset_settings: {
        playback_policy: ["signed"],
      },
      latency_mode: "low",
      reconnect_window: 60,
      max_continuous_duration: 43200,
    });

    const playbackId =
      live.playback_ids?.find((p) => p.policy === "signed")?.id ??
      live.playback_ids?.[0]?.id ??
      null;

    const { error: updErr } = await supabase
      .from("events")
      .update({
        mux_live_stream_id: live.id,
        mux_playback_id: playbackId,
        mux_stream_key: live.stream_key,
      })
      .eq("id", eventId);

    if (updErr) {
      console.error("[admin/streams/create] update failed:", updErr);
      return NextResponse.json({ error: "DB update failed" }, { status: 500 });
    }

    return NextResponse.json({
      liveStreamId: live.id,
      playbackId,
      streamKey: live.stream_key,
      rtmpUrl: "rtmps://global-live.mux.com:443/app",
    });
  } catch (err) {
    console.error("[admin/streams/create] mux create failed:", err);
    return NextResponse.json(
      { error: "Mux stream creation failed" },
      { status: 500 },
    );
  }
}
