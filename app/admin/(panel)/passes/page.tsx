import { supabaseAdmin } from "@/lib/supabase-server";
import { Card, PageHeader } from "@/components/admin/ui";
import IssueCompForm from "@/components/admin/IssueCompForm";
import PassesTable from "@/components/admin/PassesTable";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function PassesPage() {
  const supabase = supabaseAdmin();
  const [eventsRes, passesRes] = await Promise.all([
    supabase
      .from("events")
      .select("id, slug, title, status")
      .order("date", { ascending: false }),
    supabase
      .from("access_tokens")
      .select(
        "token, user_email, event_id, pass_type, expires_at, active_device_id, revoked, created_at",
      )
      .order("created_at", { ascending: false })
      .limit(100),
  ]);

  const events = eventsRes.data ?? [];
  const passes = passesRes.data ?? [];
  const eventMap = new Map(events.map((e) => [e.id, e]));

  return (
    <>
      <PageHeader subtitle="ACCESS" title="Passes" />

      <div className="mb-8 grid gap-6 lg:grid-cols-3">
        <Card className="p-6 lg:col-span-1">
          <h2 className="mb-4 font-oswald text-lg font-extrabold uppercase tracking-wider">
            Issue comp pass
          </h2>
          <IssueCompForm events={events} />
        </Card>

        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className="border-b border-white/10 px-6 py-4">
              <div className="font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
                LATEST
              </div>
              <h2 className="font-oswald text-xl font-extrabold uppercase tracking-wider">
                Issued passes
              </h2>
            </div>
            <PassesTable
              passes={passes}
              eventTitleById={Object.fromEntries(
                events.map((e) => [e.id, e.title]),
              )}
            />
          </Card>
        </div>
      </div>
    </>
  );
}
