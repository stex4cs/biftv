import Link from "next/link";

export function Header() {
  return (
    <header className="relative z-10 border-b border-white/5 backdrop-blur-md bg-black/30">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <span
            className="font-oswald font-extrabold uppercase text-2xl tracking-wider text-white"
            style={{ letterSpacing: "0.08em" }}
          >
            BIF<span className="text-bif-red">.</span>TV
          </span>
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/events"
            className="font-oswald uppercase text-sm tracking-widest text-white/70 hover:text-white transition-colors"
          >
            Events
          </Link>
          <Link
            href="/account"
            className="font-oswald uppercase text-sm tracking-widest text-white/70 hover:text-white transition-colors hidden sm:inline"
          >
            My Pass
          </Link>
          <Link
            href="/account/login"
            className="font-oswald uppercase font-bold text-sm tracking-widest bg-bif-red hover:bg-bif-red-dark px-4 py-2 rounded-md transition-colors"
          >
            Sign In
          </Link>
        </nav>
      </div>
    </header>
  );
}
