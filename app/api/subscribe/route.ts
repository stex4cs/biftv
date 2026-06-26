import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";
import { sendEmail } from "@/lib/email";
import { welcomeEmail } from "@/lib/email-templates";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: Request) {
  let body: { email?: string; source?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const email = (body.email ?? "").trim().toLowerCase();
  const source = (body.source ?? "homepage").slice(0, 40);

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Neispravan email." }, { status: 400 });
  }

  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("email_subscribers")
    .upsert({ email, source }, { onConflict: "email", ignoreDuplicates: false })
    .select("email, subscribed_at")
    .maybeSingle();

  if (error) {
    console.error("[subscribe] insert failed:", error);
    return NextResponse.json(
      { error: "Greška, pokušaj ponovo." },
      { status: 500 },
    );
  }

  // Only send welcome on fresh signups (subscribed_at within last 60s).
  const isFresh =
    data?.subscribed_at &&
    Date.now() - new Date(data.subscribed_at).getTime() < 60_000;
  if (isFresh) {
    const tpl = welcomeEmail({
      siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://biftv.vercel.app",
    });
    // Fire-and-forget — don't block the response on email send.
    void sendEmail({
      to: email,
      subject: tpl.subject,
      html: tpl.html,
      text: tpl.text,
      tags: [{ name: "type", value: "welcome" }],
    });
  }

  return NextResponse.json({ ok: true });
}
