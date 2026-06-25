import { supabaseAdmin } from "./supabase-server";
import { getValidAccessToken } from "./access";

const TRANSFER_LIMIT_PER_DAY = 10;
const DISTINCT_IP_LIMIT = 5;
const ABUSE_WINDOW_MIN = 30;

export type ClaimResult =
  | { status: "ok"; deviceId: string }
  | { status: "conflict"; activeDevice: string; activeUserAgent: string | null }
  | { status: "denied"; reason: string };

export async function claimSession(opts: {
  token: string;
  deviceId: string;
  userAgent: string;
  ipAddress?: string | null;
}): Promise<ClaimResult> {
  const access = await getValidAccessToken(opts.token);
  if (!access) return { status: "denied", reason: "Pristup ne važi." };

  const supabase = supabaseAdmin();

  if (await isAbusive(opts.token, opts.ipAddress ?? null)) {
    await supabase
      .from("access_tokens")
      .update({ revoked: true })
      .eq("token", opts.token);
    return {
      status: "denied",
      reason: "Pass je auto-blokiran zbog sumnjivog deljenja.",
    };
  }

  const active = access.active_device_id;
  if (active && active !== opts.deviceId) {
    const { data: row } = await supabase
      .from("access_tokens")
      .select("active_device_user_agent")
      .eq("token", opts.token)
      .maybeSingle();
    return {
      status: "conflict",
      activeDevice: active,
      activeUserAgent: row?.active_device_user_agent ?? null,
    };
  }

  await supabase
    .from("access_tokens")
    .update({
      active_device_id: opts.deviceId,
      active_device_user_agent: opts.userAgent.slice(0, 200),
      last_heartbeat_at: new Date().toISOString(),
    })
    .eq("token", opts.token);

  await supabase.from("viewer_sessions").insert({
    access_token: opts.token,
    device_id: opts.deviceId,
    ip_address: opts.ipAddress ?? null,
    user_agent: opts.userAgent.slice(0, 200),
  });

  return { status: "ok", deviceId: opts.deviceId };
}

export async function transferSession(opts: {
  token: string;
  deviceId: string;
  userAgent: string;
  ipAddress?: string | null;
}): Promise<ClaimResult> {
  const access = await getValidAccessToken(opts.token);
  if (!access) return { status: "denied", reason: "Pristup ne važi." };

  const supabase = supabaseAdmin();

  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from("viewer_sessions")
    .select("id", { count: "exact", head: true })
    .eq("access_token", opts.token)
    .gte("started_at", since);

  if ((count ?? 0) >= TRANSFER_LIMIT_PER_DAY) {
    await supabase
      .from("access_tokens")
      .update({ revoked: true })
      .eq("token", opts.token);
    return {
      status: "denied",
      reason:
        "Previše prebacivanja uređaja u poslednjih 24h. Pass je blokiran.",
    };
  }

  await supabase
    .from("viewer_sessions")
    .update({ ended_at: new Date().toISOString() })
    .eq("access_token", opts.token)
    .is("ended_at", null);

  await supabase
    .from("access_tokens")
    .update({
      active_device_id: opts.deviceId,
      active_device_user_agent: opts.userAgent.slice(0, 200),
      last_heartbeat_at: new Date().toISOString(),
    })
    .eq("token", opts.token);

  await supabase.from("viewer_sessions").insert({
    access_token: opts.token,
    device_id: opts.deviceId,
    ip_address: opts.ipAddress ?? null,
    user_agent: opts.userAgent.slice(0, 200),
  });

  return { status: "ok", deviceId: opts.deviceId };
}

export type HeartbeatResult =
  | { status: "ok" }
  | { status: "kicked"; reason: string }
  | { status: "denied"; reason: string };

export async function heartbeat(opts: {
  token: string;
  deviceId: string;
}): Promise<HeartbeatResult> {
  const access = await getValidAccessToken(opts.token);
  if (!access) return { status: "denied", reason: "Pristup ne važi." };

  if (access.active_device_id && access.active_device_id !== opts.deviceId) {
    return {
      status: "kicked",
      reason: "Pass je preuzet na drugom uređaju.",
    };
  }

  const supabase = supabaseAdmin();
  await supabase
    .from("access_tokens")
    .update({ last_heartbeat_at: new Date().toISOString() })
    .eq("token", opts.token);

  await supabase
    .from("viewer_sessions")
    .update({ last_heartbeat_at: new Date().toISOString() })
    .eq("access_token", opts.token)
    .eq("device_id", opts.deviceId)
    .is("ended_at", null);

  return { status: "ok" };
}

async function isAbusive(
  token: string,
  ip: string | null,
): Promise<boolean> {
  if (!ip) return false;
  const supabase = supabaseAdmin();
  const since = new Date(
    Date.now() - ABUSE_WINDOW_MIN * 60 * 1000,
  ).toISOString();
  const { data } = await supabase
    .from("viewer_sessions")
    .select("ip_address")
    .eq("access_token", token)
    .gte("started_at", since);
  if (!data) return false;
  const ips = new Set<string>();
  for (const r of data) {
    if (r.ip_address) ips.add(String(r.ip_address));
  }
  ips.add(ip);
  return ips.size > DISTINCT_IP_LIMIT;
}

export function getClientIp(req: Request): string | null {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim() ?? null;
  return req.headers.get("x-real-ip");
}
