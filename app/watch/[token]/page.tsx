import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import MuxPlayer from "@/components/MuxPlayer";
import { getValidAccessToken } from "@/lib/access";
import { supabaseAdmin } from "@/lib/supabase-server";
import { signedPlaybackTokens } from "@/lib/playback";

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function WatchPage({
  params,
}: {
  params: { token: string };
}) {
  const access = await getValidAccessToken(params.token);
  if (!access) {
    return <Denied reason="Pristup ne važi ili je istekao." />;
  }

  const supabase = supabaseAdmin();
  const { data: event } = await supabase
    .from("events")
    .select(
      "id, title, subtitle, status, mux_playback_id, poster_url, vod_available_at",
    )
    .eq("id", access.event_id)
    .maybeSingle();

  if (!event) return <Denied reason="Događaj nije pronađen." />;
  if (!event.mux_playback_id) {
    return (
      <Denied reason="Stream još nije aktivan. Pokušaj ponovo kasnije." />
    );
  }

  const isLive = event.status === "live";
  const isVod = event.status === "vod";
  if (!isLive && !isVod) {
    return <Denied reason="Događaj još nije počeo." />;
  }

  const tokens = signedPlaybackTokens({
    playbackId: event.mux_playback_id,
    expSeconds: 60 * 60 * 6,
  });

  return (
    <>
      <Header />
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="overflow-hidden rounded-xl border border-white/10 bg-black">
          <MuxPlayer
            playbackId={event.mux_playback_id}
            playbackToken={tokens.playback}
            thumbnailToken={tokens.thumbnail}
            storyboardToken={tokens.storyboard}
            streamType={isLive ? "live" : "on-demand"}
            title={event.title}
            poster={event.poster_url ?? undefined}
            metadata={{
              video_title: event.title,
              video_id: event.id,
              viewer_user_id: access.user_email,
            }}
          />
        </div>

        <div className="mt-6 rounded-xl border border-white/10 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] p-6">
          <div className="mb-1 font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
            {isLive ? "● LIVE" : "REPLAY"}
          </div>
          <h1 className="font-oswald text-2xl font-extrabold uppercase tracking-wider">
            {event.title}
          </h1>
          {event.subtitle ? (
            <p className="mt-1 text-bif-gold">{event.subtitle}</p>
          ) : null}
          <p className="mt-4 text-sm leading-relaxed text-white/60">
            Pristup vezan za jedan uređaj. Ako se prijaviš negde drugde,
            trenutna sesija se zatvara. Replay ostaje otključan do{" "}
            {access.expires_at.slice(0, 10)}.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Denied({ reason }: { reason: string }) {
  return (
    <>
      <Header />
      <main className="mx-auto max-w-xl px-4 py-24 text-center">
        <div className="mb-2 font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
          NEMA PRISTUPA
        </div>
        <h1 className="mb-4 font-oswald text-3xl font-extrabold uppercase">
          {reason}
        </h1>
        <Link href="/events" className="text-bif-gold underline">
          Pogledaj događaje
        </Link>
      </main>
      <Footer />
    </>
  );
}
