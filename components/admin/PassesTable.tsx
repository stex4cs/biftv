"use client";

import { revokePassAction } from "@/lib/admin-actions";

type Pass = {
  token: string;
  user_email: string;
  event_id: string;
  pass_type: string;
  expires_at: string;
  active_device_id: string | null;
  revoked: boolean;
  created_at: string;
};

function copyWatchUrl(token: string) {
  const base =
    (typeof window !== "undefined" && window.location.origin) ||
    "https://biftv.vercel.app";
  const url = `${base}/watch/${token}`;
  navigator.clipboard.writeText(url);
}

export default function PassesTable({
  passes,
  eventTitleById,
}: {
  passes: Pass[];
  eventTitleById: Record<string, string>;
}) {
  if (passes.length === 0) {
    return (
      <div className="p-8 text-center text-sm text-white/40">
        Nema izdatih passes.
      </div>
    );
  }

  const now = Date.now();

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/10 text-left text-xs font-bold uppercase tracking-wider text-white/40">
            <th className="px-4 py-3">Email</th>
            <th className="px-3 py-3">Event</th>
            <th className="px-3 py-3">Type</th>
            <th className="px-3 py-3">Expires</th>
            <th className="px-3 py-3">Device</th>
            <th className="px-3 py-3" />
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {passes.map((p) => {
            const expired = new Date(p.expires_at).getTime() < now;
            const inactive = p.revoked || expired;
            return (
              <tr key={p.token} className={inactive ? "opacity-50" : ""}>
                <td className="px-4 py-3 text-sm">{p.user_email}</td>
                <td className="px-3 py-3 text-sm">
                  {eventTitleById[p.event_id] ?? "—"}
                </td>
                <td className="px-3 py-3 text-xs uppercase">{p.pass_type}</td>
                <td className="px-3 py-3 text-xs text-white/60">
                  {p.expires_at.slice(0, 16).replace("T", " ")}
                </td>
                <td className="px-3 py-3 text-xs">
                  {p.active_device_id ? (
                    <span className="text-bif-gold">bound</span>
                  ) : (
                    <span className="text-white/30">—</span>
                  )}
                </td>
                <td className="px-3 py-3 text-right text-xs">
                  {p.revoked ? (
                    <span className="text-red-400">revoked</span>
                  ) : expired ? (
                    <span className="text-white/30">expired</span>
                  ) : (
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => copyWatchUrl(p.token)}
                        className="font-bold uppercase tracking-wider text-bif-gold hover:underline"
                      >
                        copy URL
                      </button>
                      <form action={revokePassAction}>
                        <input type="hidden" name="token" value={p.token} />
                        <button
                          type="submit"
                          className="font-bold uppercase tracking-wider text-red-400 hover:underline"
                        >
                          revoke
                        </button>
                      </form>
                    </div>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
