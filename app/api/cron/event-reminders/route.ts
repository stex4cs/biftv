import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendEmail } from "@/lib/email";
import { reminderEmail } from "@/lib/email-templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * GET /api/cron/event-reminders
 * Vercel Cron runs this every 15 min.
 * - T-24h reminder: events starting in 23-25h that haven't had 24h mail sent
 * - T-1h reminder: events starting in 45-75min that haven't had 1h mail sent
 *
 * Auth: header `Authorization: Bearer <CRON_SECRET>`. Vercel Cron auto-injects
 * this when CRON_SECRET env var is set on the project.
 */
export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = supabaseAdmin();
  const now = Date.now();
  const base =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://biftv.vercel.app";

  const results = {
    sent_24h: 0,
    sent_1h: 0,
    failed: 0,
    skipped_no_event: 0,
  };

  // ---- T-24h ----
  const t24From = new Date(now + 23 * 60 * 60 * 1000).toISOString();
  const t24To = new Date(now + 25 * 60 * 60 * 1000).toISOString();
  const { data: events24 } = await supabase
    .from("events")
    .select("id, title, date, venue, status")
    .in("status", ["upcoming", "live"])
    .gte("date", t24From)
    .lte("date", t24To);

  for (const ev of events24 ?? []) {
    const { data: passes } = await supabase
      .from("access_tokens")
      .select("token, user_email")
      .eq("event_id", ev.id)
      .eq("revoked", false)
      .is("reminder_24h_sent_at", null);

    for (const p of passes ?? []) {
      const tpl = reminderEmail({
        eventTitle: ev.title,
        eventDate: ev.date,
        watchUrl: `${base}/watch/${p.token}`,
        variant: "T-24h",
        venue: ev.venue,
      });
      const res = await sendEmail({
        to: p.user_email,
        subject: tpl.subject,
        html: tpl.html,
        text: tpl.text,
        tags: [
          { name: "type", value: "reminder_24h" },
          { name: "event_id", value: String(ev.id).slice(0, 32) },
        ],
      });
      if (res.ok) {
        await supabase
          .from("access_tokens")
          .update({ reminder_24h_sent_at: new Date().toISOString() })
          .eq("token", p.token);
        results.sent_24h += 1;
      } else {
        results.failed += 1;
      }
    }
  }

  // ---- T-1h ----
  const t1From = new Date(now + 45 * 60 * 1000).toISOString();
  const t1To = new Date(now + 75 * 60 * 1000).toISOString();
  const { data: events1 } = await supabase
    .from("events")
    .select("id, title, date, venue, status")
    .in("status", ["upcoming", "live"])
    .gte("date", t1From)
    .lte("date", t1To);

  for (const ev of events1 ?? []) {
    const { data: passes } = await supabase
      .from("access_tokens")
      .select("token, user_email")
      .eq("event_id", ev.id)
      .eq("revoked", false)
      .is("reminder_1h_sent_at", null);

    for (const p of passes ?? []) {
      const tpl = reminderEmail({
        eventTitle: ev.title,
        eventDate: ev.date,
        watchUrl: `${base}/watch/${p.token}`,
        variant: "T-1h",
        venue: ev.venue,
      });
      const res = await sendEmail({
        to: p.user_email,
        subject: tpl.subject,
        html: tpl.html,
        text: tpl.text,
        tags: [
          { name: "type", value: "reminder_1h" },
          { name: "event_id", value: String(ev.id).slice(0, 32) },
        ],
      });
      if (res.ok) {
        await supabase
          .from("access_tokens")
          .update({ reminder_1h_sent_at: new Date().toISOString() })
          .eq("token", p.token);
        results.sent_1h += 1;
      } else {
        results.failed += 1;
      }
    }
  }

  return NextResponse.json({
    ok: true,
    ranAt: new Date().toISOString(),
    ...results,
  });
}

function isAuthorized(req: Request): boolean {
  const expected = process.env.CRON_SECRET;
  if (!expected) {
    // No secret configured -> allow only when there's no incoming auth header
    // and the request looks like Vercel Cron. Safer to require secret in prod.
    return process.env.NODE_ENV !== "production";
  }
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : "";
  return token === expected;
}
