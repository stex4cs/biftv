import { createClient } from "@supabase/supabase-js";

/**
 * Browser-safe Supabase client. Uses the PUBLISHABLE key — safe to expose.
 * RLS policies enforce what the public can actually read.
 */
let cached: ReturnType<typeof createClient> | null = null;

export function supabaseBrowser() {
  if (cached) return cached;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const publishable = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  if (!url || !publishable) {
    throw new Error(
      "Missing Supabase env: NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    );
  }
  cached = createClient(url, publishable);
  return cached;
}
