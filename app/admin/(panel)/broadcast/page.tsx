import { supabaseAdmin } from "@/lib/supabase-server";
import { Card, PageHeader } from "@/components/admin/ui";
import BroadcastForm from "@/components/admin/BroadcastForm";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function BroadcastPage() {
  const supabase = supabaseAdmin();
  const { count } = await supabase
    .from("email_subscribers")
    .select("email", { count: "exact", head: true });

  return (
    <>
      <PageHeader subtitle="BROADCAST" title="Email blast" />

      <Card className="p-6">
        <div className="mb-6 flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-white/40">
              Mailing list
            </div>
            <div className="font-oswald text-2xl font-extrabold">
              {count ?? 0}{" "}
              <span className="text-sm font-normal text-white/40">
                subscriber{(count ?? 0) === 1 ? "" : "a"}
              </span>
            </div>
          </div>
          <div className="text-right text-xs text-white/40">
            Email šalje:
            <br />
            <span className="font-mono text-white/60">
              {process.env.RESEND_FROM ?? "onboarding@resend.dev"}
            </span>
          </div>
        </div>

        <BroadcastForm />
      </Card>
    </>
  );
}
