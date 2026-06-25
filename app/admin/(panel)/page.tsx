import Link from "next/link";
import { supabaseAdmin } from "@/lib/supabase-server";
import { Card, KpiCard, PageHeader, StatusBadge } from "@/components/admin/ui";
import { formatEventDate } from "@/lib/format";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

async function loadDashboard() {
  const supabase = supabaseAdmin();
  const [events, subscribers, passes, recentEvents] = await Promise.all([
    supabase.from("events").select("id, status", { count: "exact", head: false }),
    supabase
      .from("email_subscribers")
      .select("email", { count: "exact", head: true }),
    supabase
      .from("access_tokens")
      .select("token, revoked, expires_at", { count: "exact", head: false }),
    supabase
      .from("events")
      .select("id, slug, title, status, date, mux_playback_id")
      .order("date", { ascending: false })
      .limit(5),
  ]);

  const eventRows = events.data ?? [];
  const passRows = passes.data ?? [];
  const now = Date.now();
  const activePasses = passRows.filter(
    (p) => !p.revoked && new Date(p.expires_at).getTime() > now,
  ).length;
  const liveCount = eventRows.filter((e) => e.status === "live").length;
  const upcomingCount = eventRows.filter((e) => e.status === "upcoming").length;
  const vodCount = eventRows.filter((e) => e.status === "vod").length;

  return {
    totalEvents: eventRows.length,
    liveCount,
    upcomingCount,
    vodCount,
    subscriberCount: subscribers.count ?? 0,
    passCount: passRows.length,
    activePasses,
    recentEvents: recentEvents.data ?? [],
  };
}

export default async function DashboardPage() {
  const d = await loadDashboard();

  return (
    <>
      <PageHeader subtitle="OVERVIEW" title="Dashboard" />

      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Events"
          value={d.totalEvents}
          hint={`${d.liveCount} live · ${d.upcomingCount} upcoming · ${d.vodCount} VOD`}
        />
        <KpiCard
          label="Active passes"
          value={d.activePasses}
          hint={`${d.passCount} total issued`}
        />
        <KpiCard
          label="Subscribers"
          value={d.subscriberCount}
          hint="Email mailing list"
        />
        <KpiCard label="Revenue" value="—" hint="AltaPay not wired yet" />
      </div>

      <Card className="overflow-hidden">
        <div className="border-b border-white/10 px-6 py-4">
          <div className="font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
            RECENT
          </div>
          <h2 className="font-oswald text-xl font-extrabold uppercase tracking-wider">
            Latest events
          </h2>
        </div>
        {d.recentEvents.length === 0 ? (
          <div className="p-8 text-center text-sm text-white/40">
            Nema event-a još. <Link href="/admin/events/new" className="text-bif-gold underline">Kreiraj prvi</Link>.
          </div>
        ) : (
          <ul className="divide-y divide-white/5">
            {d.recentEvents.map((e) => (
              <li key={e.id} className="px-6 py-4">
                <Link
                  href={`/admin/events/${e.slug}`}
                  className="flex items-center justify-between gap-4 hover:opacity-80"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-oswald font-bold uppercase tracking-wider">
                        {e.title}
                      </span>
                      <StatusBadge status={e.status} />
                    </div>
                    <div className="mt-1 text-xs text-white/40">
                      {formatEventDate(e.date).day}.
                      {e.date.slice(5, 7)}.{formatEventDate(e.date).year} · {e.slug}
                    </div>
                  </div>
                  <div className="text-xs text-white/30">
                    {e.mux_playback_id ? "Mux ✓" : "no stream"}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </>
  );
}
