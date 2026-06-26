import { NextResponse } from "next/server";
import { supabaseUser } from "@/lib/supabase-user";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Supabase Auth magic-link redirect target.
 * URL: /auth/callback?code=... or ?token_hash=...&type=email
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const code = url.searchParams.get("code");
  const tokenHash = url.searchParams.get("token_hash");
  const type = url.searchParams.get("type") as
    | "email"
    | "magiclink"
    | "recovery"
    | "invite"
    | null;
  const next = url.searchParams.get("next") ?? "/my-passes";

  const supabase = supabaseUser();

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, req.url),
      );
    }
  } else if (tokenHash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash: tokenHash,
    });
    if (error) {
      return NextResponse.redirect(
        new URL(`/login?error=${encodeURIComponent(error.message)}`, req.url),
      );
    }
  } else {
    return NextResponse.redirect(
      new URL("/login?error=Nedostaje%20kod", req.url),
    );
  }

  return NextResponse.redirect(new URL(next, req.url));
}
