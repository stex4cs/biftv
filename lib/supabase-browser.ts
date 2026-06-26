import { createBrowserClient } from "@supabase/ssr";

/**
 * Browser-safe Supabase client. Uses the PUBLISHABLE key — safe to expose.
 * RLS policies enforce what the public can actually read.
 *
 * Uses @supabase/ssr's createBrowserClient (PKCE flow, cookie-based session)
 * so that magic links integrate with the server-side /auth/callback handler.
 */
let cached: ReturnType<typeof createBrowserClient> | null = null;

export function supabaseBrowser() {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishable) {
    throw new Error(
      "Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }
  cached = createBrowserClient(url, publishable);
  return cached;
}
