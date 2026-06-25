import { notFound } from "next/navigation";
import { supabaseAdmin } from "@/lib/supabase-server";
import {
  Card,
  PageHeader,
  StatusBadge,
} from "@/components/admin/ui";
import EventEditForm from "@/components/admin/EventEditForm";
import StreamControls from "@/components/admin/StreamControls";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

export default async function EventDetailAdmin({
  params,
}: {
  params: { slug: string };
}) {
  const supabase = supabaseAdmin();
  const { data: event } = await supabase
    .from("events")
    .select("*")
    .eq("slug", params.slug)
    .maybeSingle();

  if (!event) notFound();

  return (
    <>
      <PageHeader
        subtitle="EVENT"
        title={event.title}
        action={<StatusBadge status={event.status} />}
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="p-6">
            <h2 className="mb-4 font-oswald text-lg font-extrabold uppercase tracking-wider">
              Event details
            </h2>
            <EventEditForm event={event} />
          </Card>
        </div>

        <div>
          <StreamControls
            eventId={event.id}
            liveStreamId={event.mux_live_stream_id}
            playbackId={event.mux_playback_id}
            streamKey={event.mux_stream_key}
          />
        </div>
      </div>
    </>
  );
}
