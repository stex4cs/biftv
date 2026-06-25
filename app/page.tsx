export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full text-center">
        <span
          className="inline-block font-oswald uppercase tracking-[0.4em] text-xs font-bold text-bif-gold border border-bif-gold/40 bg-bif-red/15 px-4 py-2 rounded-full mb-6"
        >
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

        <p className="font-oswald uppercase tracking-[0.3em] text-sm md:text-base font-semibold text-white/85 mb-8">
          The home of Balkan Influence Fighting
        </p>

        <p className="text-white/70 leading-relaxed text-base md:text-lg max-w-md mx-auto mb-10">
          The official streaming platform for every BIF event. Live broadcasts,
          full replays, and exclusive premium content — all in one place.
        </p>

        <div className="inline-block">
          <div
            className="font-oswald uppercase font-bold tracking-[0.3em] text-bif-gold text-sm mb-3"
            style={{ letterSpacing: "0.3em" }}
          >
            Coming Soon
          </div>
          <div className="font-oswald text-white/90 font-semibold uppercase tracking-widest text-lg">
            BIF 3 · Live on BIF.TV
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-white/10">
          <a
            href="https://bif.events"
            className="text-bif-gold/80 hover:text-bif-gold transition-colors text-sm"
          >
            ← Visit bif.events
          </a>
        </div>
      </div>
    </main>
  );
}
