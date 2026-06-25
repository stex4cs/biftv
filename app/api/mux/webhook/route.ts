import { NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Mux webhook receiver.
 * Validates signature header `mux-signature: t=<unix>,v1=<hex>` against
 * MUX_WEBHOOK_SECRET, then updates events.status / mux_playback_id based
 * on event type.
 */
export async function POST(req: Request) {
  const raw = await req.text();
  const sigHeader = req.headers.get("mux-signature") ?? "";
  const secret = process.env.MUX_WEBHOOK_SECRET;

  if (secret) {
    if (!verifyMuxSignature(raw, sigHeader, secret)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }
  } else {
    console.warn("[mux/webhook] MUX_WEBHOOK_SECRET not set — accepting without verification");
  }

  let body: { type?: string; data?: Record<string, unknown> };
  try {
    body = JSON.parse(raw);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const type = body.type ?? "";
  const data = body.data ?? {};
  const supabase = supabaseAdmin();

  try {
    switch (type) {
      case "video.live_stream.active": {
        const liveStreamId = String(data.id ?? "");
        if (liveStreamId) {
          await supabase
            .from("events")
            .update({ status: "live" })
            .eq("mux_live_stream_id", liveStreamId);
        }
        break;
      }
      case "video.live_stream.idle":
      case "video.live_stream.disconnected": {
        const liveStreamId = String(data.id ?? "");
        if (liveStreamId) {
          await supabase
            .from("events")
            .update({ status: "ended" })
            .eq("mux_live_stream_id", liveStreamId)
            .eq("status", "live");
        }
        break;
      }
      case "video.asset.ready": {
        const liveStreamId = String(
          (data as { live_stream_id?: string }).live_stream_id ?? "",
        );
        const playbackIds = (data as { playback_ids?: Array<{ id: string }> }).playback_ids;
        const playbackId = playbackIds?.[0]?.id ?? null;
        if (liveStreamId && playbackId) {
          await supabase
            .from("events")
            .update({
              status: "vod",
              mux_playback_id: playbackId,
              vod_available_at: new Date().toISOString(),
            })
            .eq("mux_live_stream_id", liveStreamId);
        }
        break;
      }
      default:
        break;
    }
  } catch (err) {
    console.error("[mux/webhook] handler failed:", type, err);
    return NextResponse.json({ error: "Handler error" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

function verifyMuxSignature(
  payload: string,
  header: string,
  secret: string,
): boolean {
  if (!header) return false;
  const parts = header.split(",").reduce<Record<string, string>>((acc, p) => {
    const [k, v] = p.trim().split("=");
    if (k && v) acc[k] = v;
    return acc;
  }, {});
  const timestamp = parts.t;
  const sig = parts.v1;
  if (!timestamp || !sig) return false;

  const ageSec = Math.abs(Date.now() / 1000 - Number(timestamp));
  if (ageSec > 300) return false;

  const expected = crypto
    .createHmac("sha256", secret)
    .update(`${timestamp}.${payload}`)
    .digest("hex");

  const a = Buffer.from(expected, "hex");
  const b = Buffer.from(sig, "hex");
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
