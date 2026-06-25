import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

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
  const { error } = await supabase
    .from("email_subscribers")
    .upsert({ email, source }, { onConflict: "email" });

  if (error) {
    console.error("[subscribe] insert failed:", error);
    return NextResponse.json(
      { error: "Greška, pokušaj ponovo." },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
