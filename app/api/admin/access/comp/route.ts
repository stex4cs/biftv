import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-auth";
import { issueCompAccessToken } from "@/lib/access";
import { supabaseAdmin } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/access/comp
 * Body: { email, eventSlug, passType, hours? }
 * Headers: Authorization: Bearer <ADMIN_API_TOKEN>
 *
 * Issues a complimentary access token without payment. Used for testing
 * the watch flow before AltaPay integration lands and for manual grants.
 */
export async function POST(req: Request) {
  if (!isAdminRequest(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: {
    email?: string;
    eventSlug?: string;
    passType?: "live" | "vod" | "bundle";
    hours?: number;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const eventSlug = (body.eventSlug ?? "").trim();
  const passType = body.passType ?? "live";
  const hours = Math.min(Math.max(body.hours ?? 72, 1), 24 * 30);

  if (!email || !eventSlug) {
    return NextResponse.json(
      { error: "email and eventSlug required" },
      { status: 400 },
    );
  }

  const supabase = supabaseAdmin();
  const { data: ev } = await supabase
    .from("events")
    .select("id")
    .eq("slug", eventSlug)
    .maybeSingle();
  if (!ev) {
    return NextResponse.json({ error: "Event not found" }, { status: 404 });
  }

  try {
    const token = await issueCompAccessToken({
      email,
      eventId: ev.id,
      passType,
      expiresAt: new Date(Date.now() + hours * 60 * 60 * 1000),
    });
    const base =
      process.env.NEXT_PUBLIC_SITE_URL ?? "https://biftv.vercel.app";
    return NextResponse.json({ token, watchUrl: `${base}/watch/${token}` });
  } catch (err) {
    console.error("[admin/access/comp] insert failed:", err);
    return NextResponse.json(
      { error: "Failed to issue token" },
      { status: 500 },
    );
  }
}
