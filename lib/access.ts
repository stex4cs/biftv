import { randomBytes } from "crypto";
import { supabaseAdmin } from "./supabase-server";

export type AccessTokenRow = {
  token: string;
  user_email: string;
  event_id: string;
  pass_type: "live" | "vod" | "bundle";
  expires_at: string;
  active_device_id: string | null;
  revoked: boolean;
};

/**
 * Generate a URL-safe random token (32 bytes -> 43 chars base64url).
 */
export function generateAccessToken(): string {
  return randomBytes(32)
    .toString("base64")
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

/**
 * Look up an access token row. Returns null if not found, revoked, or expired.
 */
export async function getValidAccessToken(
  token: string,
): Promise<AccessTokenRow | null> {
  if (!token) return null;
  const supabase = supabaseAdmin();
  const { data, error } = await supabase
    .from("access_tokens")
    .select(
      "token, user_email, event_id, pass_type, expires_at, active_device_id, revoked",
    )
    .eq("token", token)
    .maybeSingle();
  if (error || !data) return null;
  if (data.revoked) return null;
  if (new Date(data.expires_at).getTime() < Date.now()) return null;
  return data as AccessTokenRow;
}

/**
 * Issue a comp access token (no purchase required). Used for testing or
 * manual grants from admin until the payment integration lands.
 */
export async function issueCompAccessToken(opts: {
  email: string;
  eventId: string;
  passType: "live" | "vod" | "bundle";
  expiresAt: Date;
}): Promise<string> {
  const supabase = supabaseAdmin();
  const token = generateAccessToken();
  const { error } = await supabase.from("access_tokens").insert({
    token,
    purchase_id: null,
    user_email: opts.email.toLowerCase(),
    event_id: opts.eventId,
    pass_type: opts.passType,
    expires_at: opts.expiresAt.toISOString(),
  });
  if (error) throw error;
  return token;
}

/**
 * Bind a device to a token on first watch. Returns true if this device
 * is allowed, false if another device already claimed the token.
 */
export async function claimDevice(
  token: string,
  deviceId: string,
  userAgent: string,
): Promise<boolean> {
  const supabase = supabaseAdmin();
  const { data } = await supabase
    .from("access_tokens")
    .select("active_device_id")
    .eq("token", token)
    .maybeSingle();
  if (!data) return false;
  if (!data.active_device_id) {
    await supabase
      .from("access_tokens")
      .update({
        active_device_id: deviceId,
        active_device_user_agent: userAgent,
        last_heartbeat_at: new Date().toISOString(),
      })
      .eq("token", token);
    return true;
  }
  return data.active_device_id === deviceId;
}
