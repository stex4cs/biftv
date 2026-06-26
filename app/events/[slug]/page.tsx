import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Countdown } from "@/components/Countdown";
import { FightCard } from "@/components/FightCard";
import { getEventBySlug } from "@/lib/events";
import { formatEventDate, formatPrice } from "@/lib/format";
import type { EventBase } from "@/lib/types";

export const revalidate = 60;

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const event = await getEventBySlug(params.slug);
  if (!event) return { title: "Event nije pronađen" };

  const d = formatEventDate(event.date);
  const dateLabel = `${d.day}.${event.date.slice(5, 7)}.${d.year}`;
  const desc =
    event.description?.slice(0, 160) ??
    `${event.title} — ${event.subtitle ?? "Balkan Influence Fighting"} · ${dateLabel} · ${event.venueCity}`;

  return {
    title: event.title,
    description: desc,
    openGraph: {
      title: `${event.title} — BIF.TV`,
      description: desc,
      type: "video.movie",
      url: `/events/${event.slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: `${event.title} — BIF.TV`,
      description: desc,
    },
  };
}

export default async function EventDetailPage({
  params,
}: {
  params: { slug: string };
}) {
  const event = await getEventBySlug(params.slug);
  if (!event) notFound();

  const d = formatEventDate(event.date);
  const isLive = event.status === "live";
  const isUpcoming = event.status === "upcoming";
  const isVod = event.status === "vod";

  return (
    <>
      <Header />
      {event.posterUrl ? (
        <div className="relative h-[420px] w-full overflow-hidden">
          <Image
            src={event.posterUrl}
            alt={event.title}
            fill
            sizes="100vw"
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-bif-black" />
        </div>
      ) : null}
      <main className={`max-w-5xl mx-auto px-6 ${event.posterUrl ? "-mt-24 relative z-10 pb-16" : "py-16"}`}>
        {/* HEADER */}
        <div className="text-center mb-12">
          {event.sponsorLine && (
            <span className="inline-block font-oswald uppercase tracking-[0.4em] text-xs font-bold text-bif-gold border border-bif-gold/40 bg-bif-red/15 px-4 py-2 rounded-full mb-6">
              ⭐ {event.sponsorLine}
            </span>
          )}
          <h1
            className="font-oswald font-extrabold uppercase tracking-wider leading-none mb-4"
            style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}
          >
            {event.title}
          </h1>
          {event.subtitle && (
            <p className="text-bif-gold text-lg font-semibold">
              {event.subtitle}
            </p>
          )}
          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-white/70">
            <span>
              📅 {d.day}.{event.date.slice(5, 7)}.{d.year} · {d.time}
            </span>
            {event.venue !== "TBA" && <span>📍 {event.venue}</span>}
          </div>
        </div>

        {/* CTA BOX */}
        <div className="bg-gradient-to-br from-[#1a0a0c] to-[#0a0a0a] border border-bif-red/40 rounded-2xl p-8 mb-12 shadow-2xl relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-bif-red via-bif-gold to-bif-red rounded-t-2xl" />

          {isUpcoming && (
            <>
              <div className="text-center mb-6">
                <div className="font-oswald uppercase text-bif-red font-bold tracking-widest text-xs mb-3">
                  STARTS IN
                </div>
                <div className="flex justify-center">
                  <Countdown targetIso={event.date} />
                </div>
              </div>
              <PassButtons event={event} />
            </>
          )}

          {isLive && (
            <div className="text-center">
              <div className="font-oswald font-extrabold text-2xl text-red-500 tracking-widest mb-4">
                ● LIVE NOW
              </div>
              <PassButtons event={event} />
            </div>
          )}

          {isVod && (
            <div className="text-center">
              <div className="font-oswald uppercase text-bif-gold font-bold tracking-widest text-xs mb-3">
                FULL REPLAY AVAILABLE
              </div>
              <PassButtons event={event} />
            </div>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="mb-12">
          <p className="text-white/80 text-lg leading-relaxed max-w-3xl mx-auto">
            {event.description}
          </p>
        </div>

        {/* FIGHT CARD */}
        {event.fights.length > 0 && (
          <div className="mb-12">
            <div className="mb-6">
              <div className="font-oswald uppercase text-bif-red text-xs tracking-[3px] font-bold mb-1">
                {isVod ? "OFFICIAL RESULTS" : "FULL CARD"}
              </div>
              <h2 className="font-oswald font-extrabold text-3xl uppercase tracking-wider">
                🥊 Fights
              </h2>
            </div>
            <div className="space-y-3">
              {event.fights.map((f) => (
                <FightCard key={f.id} fight={f} />
              ))}
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function PassButtons({ event }: { event: EventBase }) {
  const isVod = event.status === "vod";

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      {!isVod && (
        <Link
          href={`/checkout?event=${event.slug}&type=live`}
          className="font-oswald font-extrabold uppercase tracking-widest bg-gradient-to-br from-bif-red to-bif-red-dark text-white px-8 py-4 rounded-xl border-2 border-bif-gold/40 hover:scale-[1.02] transition-all"
        >
          🎬 Live pass — {formatPrice(event.prices.livePass, event.prices.currency)}
        </Link>
      )}
      {event.prices.vodPass != null && (
        <Link
          href={`/checkout?event=${event.slug}&type=vod`}
          className="font-oswald font-bold uppercase tracking-widest border border-bif-gold/40 text-bif-gold px-8 py-4 rounded-xl hover:bg-bif-gold/10 transition-all"
        >
          ⏯ Replay pass — {formatPrice(event.prices.vodPass, event.prices.currency)}
        </Link>
      )}
    </div>
  );
}
