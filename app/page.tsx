import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Countdown } from "@/components/Countdown";
import { EventCard } from "@/components/EventCard";
import { getEvents, getFeaturedUpcoming } from "@/lib/mock-events";
import { formatPrice } from "@/lib/format";

export default function Home() {
  const featured = getFeaturedUpcoming();
  const events = getEvents();

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="relative px-6 pt-16 pb-24 text-center">
        <div className="max-w-3xl mx-auto">
          <span className="inline-block font-oswald uppercase tracking-[0.4em] text-xs font-bold text-bif-gold border border-bif-gold/40 bg-bif-red/15 px-4 py-2 rounded-full mb-6">
            Powered by Oktagonbet
          </span>

          <h1
            className="font-oswald uppercase font-extrabold leading-none mb-4"
            style={{
              fontSize: "clamp(3rem, 9vw, 7rem)",
              background:
                "linear-gradient(180deg, #ffffff 0%, #f0f0f0 50%, #c0c0c0 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textShadow: "0 4px 40px rgba(0, 0, 0, 0.6)",
              letterSpacing: "0.05em",
            }}
          >
            BIF<span style={{ color: "#c41e3a" }}>.</span>TV
          </h1>

          <p className="font-oswald uppercase tracking-[0.3em] text-sm md:text-base font-semibold text-white/85 mb-10">
            The home of Balkan Influence Fighting
          </p>

          {featured ? (
            <div className="relative bg-gradient-to-br from-[#1a0a0c] to-[#0a0a0a] border border-bif-red/30 rounded-2xl p-8 shadow-2xl">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-bif-red via-bif-gold to-bif-red rounded-t-2xl" />
              <div className="font-oswald uppercase text-bif-red font-bold tracking-widest text-xs mb-3">
                NEXT EVENT
              </div>
              <h2
                className="font-oswald font-extrabold uppercase mb-2"
                style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}
              >
                {featured.title}
              </h2>
              {featured.subtitle && (
                <p className="text-bif-gold mb-6 font-semibold">
                  {featured.subtitle}
                </p>
              )}
              <div className="flex justify-center mb-6">
                <Countdown targetIso={featured.date} />
              </div>
              <Link
                href={`/events/${featured.slug}`}
                className="inline-block font-oswald font-extrabold uppercase tracking-widest bg-gradient-to-br from-bif-red to-bif-red-dark text-white px-8 py-4 rounded-xl border-2 border-bif-gold/40 hover:scale-[1.02] hover:shadow-[0_20px_50px_rgba(196,30,58,0.5)] transition-all"
              >
                Reserve your pass →
              </Link>
              <p className="text-xs text-white/40 mt-4">
                Live pass od{" "}
                {formatPrice(
                  featured.prices.livePass,
                  featured.prices.currency,
                )}{" "}
                · Replay od{" "}
                {formatPrice(
                  featured.prices.vodPass ?? featured.prices.livePass,
                  featured.prices.currency,
                )}
              </p>
            </div>
          ) : (
            <p className="text-white/60">
              No upcoming events scheduled. Check back soon.
            </p>
          )}
        </div>
      </section>

      {/* ALL EVENTS */}
      <section className="relative px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-8">
            <div>
              <div className="font-oswald uppercase text-bif-red text-xs tracking-[3px] font-bold mb-1">
                LIVE & REPLAYS
              </div>
              <h3 className="font-oswald font-extrabold text-3xl uppercase tracking-wider">
                All Events
              </h3>
            </div>
            <Link
              href="/events"
              className="text-bif-gold/70 hover:text-bif-gold text-sm font-semibold"
            >
              View all →
            </Link>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            {events.slice(0, 4).map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="relative px-6 py-16">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-6">
          <Feature
            title="HD live stream"
            text="Adaptive bitrate ladder — buffer-free on mobile, fiber-grade on desktop."
          />
          <Feature
            title="48h replay"
            text="Every live pass includes 48h of full-event replay. Miss nothing."
          />
          <Feature
            title="One pass, every device"
            text="Sign in once with magic link. Phone, tablet, Smart TV cast — same access."
          />
        </div>
      </section>

      <Footer />
    </>
  );
}

function Feature({ title, text }: { title: string; text: string }) {
  return (
    <div className="text-center md:text-left">
      <div className="font-oswald font-extrabold uppercase tracking-wider text-bif-gold mb-2 text-sm">
        {title}
      </div>
      <p className="text-white/65 text-sm leading-relaxed">{text}</p>
    </div>
  );
}
