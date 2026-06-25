import Link from "next/link";
import Image from "next/image";
import type { EventBase } from "@/lib/types";
import { formatEventDate, formatPrice } from "@/lib/format";

export function EventCard({ event }: { event: EventBase }) {
  const d = formatEventDate(event.date);
  const statusBadge =
    event.status === "live"
      ? { text: "LIVE NOW", color: "bg-red-600" }
      : event.status === "upcoming"
        ? { text: "UPCOMING", color: "bg-bif-red" }
        : event.status === "vod"
          ? { text: "REPLAY", color: "bg-bif-gold/20 text-bif-gold" }
          : { text: "ENDED", color: "bg-white/10" };

  return (
    <Link
      href={`/events/${event.slug}`}
      className="group block bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden hover:border-bif-red/50 hover:-translate-y-1 transition-all"
    >
      <div className="relative aspect-video bg-black overflow-hidden">
        {event.posterUrl ? (
          <Image
            src={event.posterUrl}
            alt={event.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority={event.status === "live" || event.status === "upcoming"}
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:from-black/90 transition-opacity" />
        <div className="absolute top-3 right-3">
          <span
            className={`inline-block ${statusBadge.color} text-white text-[10px] font-oswald font-extrabold tracking-widest px-3 py-1 rounded-full`}
          >
            {statusBadge.text}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 flex items-end gap-3">
          <div className="bg-bif-red rounded-lg px-3 py-2 text-center min-w-[60px] shadow-lg">
            <div className="font-oswald font-extrabold text-2xl leading-none text-white">
              {d.day}
            </div>
            <div className="font-oswald font-bold text-[10px] tracking-widest text-white/80 mt-1">
              {d.month}
            </div>
          </div>
          <div className="font-oswald font-extrabold text-3xl uppercase text-white leading-tight">
            {event.title}
          </div>
        </div>
      </div>
      <div className="p-5">
        {event.subtitle && (
          <p className="text-bif-gold/90 font-semibold mb-2 text-sm">
            {event.subtitle}
          </p>
        )}
        <p className="text-white/70 text-sm leading-relaxed line-clamp-2 mb-4">
          {event.description}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-white/10">
          <div className="text-xs text-white/50">
            📍 {event.venueCity}
            {event.venue && event.venue !== "TBA" ? ` · ${event.venue}` : ""}
          </div>
          <div className="font-oswald font-bold text-white">
            od {formatPrice(event.prices.livePass, event.prices.currency)}
          </div>
        </div>
      </div>
    </Link>
  );
}
