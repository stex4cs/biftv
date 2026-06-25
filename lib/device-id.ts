/**
 * Stable device ID stored in localStorage. Used as the "first device wins"
 * key for /watch/[token] sessions.
 *
 * It is NOT a hard fingerprint — the user can clear localStorage and get a
 * new ID. That's intentional: it's a "honest user UX" mechanism, not crypto.
 * Real anti-share enforcement happens server-side via active_device_id +
 * heartbeat + abuse heuristics (rapid switching, multi-IP).
 */
const KEY = "biftv_device_id";

export function getDeviceId(): string {
  if (typeof window === "undefined") return "";
  let id = window.localStorage.getItem(KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `dev_${Math.random().toString(36).slice(2)}${Date.now()}`;
    window.localStorage.setItem(KEY, id);
  }
  return id;
}

export function shortDeviceId(id: string | null | undefined): string {
  if (!id) return "—";
  return id.slice(0, 4) + "…" + id.slice(-4);
}
