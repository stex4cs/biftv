import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { getEventBySlug } from "@/lib/mock-events";
import { formatPrice } from "@/lib/format";

export default function CheckoutPage({
  searchParams,
}: {
  searchParams: { event?: string; type?: string };
}) {
  const event = searchParams.event ? getEventBySlug(searchParams.event) : null;
  const passType = searchParams.type === "vod" ? "vod" : "live";

  if (!event) {
    return (
      <>
        <Header />
        <main className="max-w-xl mx-auto px-6 py-24 text-center">
          <h1 className="font-oswald font-extrabold text-3xl uppercase mb-4">
            No event selected
          </h1>
          <Link href="/events" className="text-bif-gold underline">
            Browse events
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  const price =
    passType === "vod"
      ? (event.prices.vodPass ?? event.prices.livePass)
      : event.prices.livePass;

  return (
    <>
      <Header />
      <main className="max-w-xl mx-auto px-6 py-16">
        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-2xl p-8">
          <div className="font-oswald uppercase text-bif-red text-xs tracking-[3px] font-bold mb-2">
            CHECKOUT
          </div>
          <h1 className="font-oswald font-extrabold text-3xl uppercase mb-6">
            {event.title}
          </h1>

          <div className="border-t border-white/10 pt-6 space-y-4 mb-8">
            <Row
              label={passType === "vod" ? "Replay Pass" : "Live Pass"}
              value={formatPrice(price, event.prices.currency)}
            />
            {passType === "live" && (
              <Row label="48h replay included" value="✓" />
            )}
            <Row
              label="One device at a time"
              value="✓"
              subtle
            />
          </div>

          <form className="space-y-4">
            <label className="block">
              <span className="text-sm text-white/70 mb-2 block">
                Email (we'll send your access link here)
              </span>
              <input
                type="email"
                required
                placeholder="you@example.com"
                className="w-full bg-black border border-white/15 rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-bif-red"
              />
            </label>

            <button
              type="button"
              disabled
              className="w-full font-oswald font-extrabold uppercase tracking-widest bg-gradient-to-br from-bif-red to-bif-red-dark text-white px-8 py-4 rounded-xl border-2 border-bif-gold/40 opacity-60 cursor-not-allowed"
              title="Stripe integration coming next"
            >
              Pay {formatPrice(price, event.prices.currency)} (Stripe — coming)
            </button>

            <p className="text-xs text-white/40 text-center">
              By purchasing you agree to our{" "}
              <Link href="/terms" className="underline">
                Terms
              </Link>
              .
            </p>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}

function Row({
  label,
  value,
  subtle,
}: {
  label: string;
  value: string;
  subtle?: boolean;
}) {
  return (
    <div className="flex justify-between items-center">
      <span className={subtle ? "text-white/50 text-sm" : "text-white/80"}>
        {label}
      </span>
      <span
        className={
          subtle
            ? "text-white/50 text-sm"
            : "font-oswald font-bold text-white text-lg"
        }
      >
        {value}
      </span>
    </div>
  );
}
