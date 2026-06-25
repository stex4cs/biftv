import Link from "next/link";

export function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-white/5 bg-black/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="font-oswald font-extrabold text-2xl tracking-wider">
              BIF<span className="text-bif-red">.</span>TV
            </div>
            <div className="text-xs text-white/40 mt-1">
              Streaming home of Balkan Influence Fighting
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <Link
              href="/events"
              className="text-white/60 hover:text-white transition-colors"
            >
              Events
            </Link>
            <a
              href="https://bif.events"
              className="text-white/60 hover:text-white transition-colors"
              target="_blank"
              rel="noopener"
            >
              bif.events
            </a>
            <Link
              href="/terms"
              className="text-white/60 hover:text-white transition-colors"
            >
              Terms
            </Link>
            <Link
              href="/privacy"
              className="text-white/60 hover:text-white transition-colors"
            >
              Privacy
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-white/5 text-center text-xs text-white/40">
          © {new Date().getFullYear()} Balkan Influence Fighting. All rights
          reserved.
        </div>
      </div>
    </footer>
  );
}
