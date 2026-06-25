import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EventCard } from "@/components/EventCard";
import { getEvents } from "@/lib/events";
import type { EventBase } from "@/lib/types";

export const revalidate = 60;

export default async function EventsPage() {
  const events = await getEvents();
  const upcoming = events.filter((e) => e.status === "upcoming");
  const live = events.filter((e) => e.status === "live");
  const past = events.filter((e) => e.status === "vod" || e.status === "ended");

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-6 py-16">
        <h1 className="font-oswald font-extrabold text-5xl md:text-6xl uppercase tracking-wider mb-4">
          Events
        </h1>
        <p className="text-white/60 mb-12">
          Every BIF event — live now, coming soon, or available on replay.
        </p>

        {live.length > 0 && (
          <Section
            label="LIVE"
            title="Live now"
            color="text-red-500"
            events={live}
          />
        )}

        {upcoming.length > 0 && (
          <Section
            label="COMING SOON"
            title="Upcoming"
            color="text-bif-red"
            events={upcoming}
          />
        )}

        {past.length > 0 && (
          <Section
            label="ON DEMAND"
            title="Replays"
            color="text-bif-gold"
            events={past}
          />
        )}
      </main>
      <Footer />
    </>
  );
}

function Section({
  label,
  title,
  color,
  events,
}: {
  label: string;
  title: string;
  color: string;
  events: EventBase[];
}) {
  return (
    <section className="mb-16">
      <div className="mb-6">
        <div
          className={`font-oswald uppercase text-xs tracking-[3px] font-bold mb-1 ${color}`}
        >
          {label}
        </div>
        <h2 className="font-oswald font-extrabold text-3xl uppercase tracking-wider">
          {title}
        </h2>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        {events.map((e) => (
          <EventCard key={e.id} event={e} />
        ))}
      </div>
    </section>
  );
}
