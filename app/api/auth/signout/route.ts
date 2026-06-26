import { NextResponse } from "next/server";
import { supabaseUser } from "@/lib/supabase-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = supabaseUser();
  await supabase.auth.signOut();
  return NextResponse.json({ ok: true });
}
