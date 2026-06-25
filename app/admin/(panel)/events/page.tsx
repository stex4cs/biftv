import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";
import {
  Card,
  PageHeader,
  PrimaryButton,
  StatusBadge,
} from "@/components/admin/ui";
import { formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function EventsPage() {
  const supabase = supabaseAdmin();
  const { data: events } = await supabase
    .from("events")
    .select("id, slug, title, status, date, mux_playback_id, mux_live_stream_id")
    .order("date", { ascending: false });

  const rows = events ?? [];

  return (
    <>
      <PageHeader
        subtitle="MANAGE"
        title="Events"
        action={<PrimaryButton href="/admin/events/new">+ New event</PrimaryButton>}
      />

      <Card className="overflow-hidden">
        {rows.length === 0 ? (
          <div className="p-12 text-center">
            <p className="mb-4 text-white/50">Nema event-a.</p>
            <PrimaryButton href="/admin/events/new">
              Kreiraj prvi
            </PrimaryButton>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 text-left text-xs font-bold uppercase tracking-wider text-white/40">
                <th className="px-6 py-3">Title</th>
                <th className="px-3 py-3">Status</th>
                <th className="px-3 py-3">Date</th>
                <th className="px-3 py-3">Stream</th>
                <th className="px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {rows.map((e) => (
                <tr key={e.id} className="hover:bg-white/[0.02]">
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/events/${e.slug}`}
                      className="font-oswald font-bold uppercase tracking-wider hover:text-bif-gold"
                    >
                      {e.title}
                    </Link>
                    <div className="text-xs text-white/40">{e.slug}</div>
                  </td>
                  <td className="px-3 py-4">
                    <StatusBadge status={e.status} />
                  </td>
                  <td className="px-3 py-4 text-sm text-white/70">
                    {formatEventDate(e.date).day}.{e.date.slice(5, 7)}.
                    {formatEventDate(e.date).year}
                  </td>
                  <td className="px-3 py-4 text-xs">
                    {e.mux_live_stream_id ? (
                      <span className="text-bif-gold">live ✓</span>
                    ) : e.mux_playback_id ? (
                      <span className="text-white/60">vod ✓</span>
                    ) : (
                      <span className="text-white/30">—</span>
                    )}
                  </td>
                  <td className="px-3 py-4 text-right">
                    <Link
                      href={`/admin/events/${e.slug}`}
                      className="text-xs font-bold uppercase tracking-wider text-bif-gold hover:underline"
                    >
                      Edit →
                    </Link>
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
