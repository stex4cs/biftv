import { supabaseAdmin } from "@/lib/supabase-server";
import { Card, GhostButton, PageHeader } from "@/components/admin/ui";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function SubscribersPage() {
  const supabase = supabaseAdmin();
  const { data: subs, count } = await supabase
    .from("email_subscribers")
    .select("email, source, subscribed_at", { count: "exact" })
    .order("subscribed_at", { ascending: false })
    .limit(500);

  const rows = subs ?? [];

  return (
    <>
      <PageHeader
        subtitle="MAILING LIST"
        title="Subscribers"
        action={
          <GhostButton href="/api/admin/subscribers/export">
            Export CSV
          </GhostButton>
        }
      />

      <div className="mb-6 text-sm text-white/60">
        Ukupno: <span className="font-bold text-white">{count ?? 0}</span>
        {(count ?? 0) > rows.length ? (
          <span className="text-white/40">
            {" "}
            · prikazujem prvih {rows.length}
          </span>
        ) : null}
      </div>

      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-12 text-center text-sm text-white/40">
            Niko se još nije prijavio.
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs font-bold uppercase tracking-wider text-white/40">
                <th className="px-6 py-3">Email</th>
                <th className="px-3 py-3">Source</th>
                <th className="px-3 py-3">Subscribed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((s) => (
                <tr key={s.email}>
                  <td className="px-6 py-3 text-sm">{s.email}</td>
                  <td className="px-3 py-3 text-xs text-white/60">
                    {s.source ?? "—"}
                  </td>
                  <td className="px-3 py-3 text-xs text-white/40">
                    {s.subscribed_at?.slice(0, 16).replace("T", " ")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>
    </>
  );
}
