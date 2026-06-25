import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";

export default function WatchPage({ params }: { params: { token: string } }) {
  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="relative aspect-video bg-black border border-white/10 rounded-xl overflow-hidden mb-6">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <div className="font-oswald uppercase text-bif-red text-xs tracking-[3px] font-bold mb-2">
              PLAYER PLACEHOLDER
            </div>
            <div className="font-oswald font-extrabold text-2xl uppercase tracking-wider mb-3">
              Mux Player goes here
            </div>
            <p className="text-white/50 text-sm max-w-md mb-4">
              Token:{" "}
              <code className="bg-white/10 px-2 py-1 rounded">
                {params.token.slice(0, 8)}...
              </code>
            </p>
            <p className="text-white/40 text-xs max-w-md">
              When Mux is wired up: signed HLS URL fetched server-side,
              HLS.js / Mux Player on this page, presence channel + heartbeat
              for device-limit + active viewer count.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] border border-white/10 rounded-xl p-6">
          <h1 className="font-oswald font-extrabold text-2xl uppercase tracking-wider mb-2">
            Your stream is ready
          </h1>
          <p className="text-white/60 text-sm leading-relaxed">
            One device only. If you sign in elsewhere, the current session ends.
            Replay stays unlocked for 48h after the event.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
