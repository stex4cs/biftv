import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="relative z-10 mt-24 border-t border-white/5 bg-black/40 backdrop-blur-sm">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid gap-8 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="font-oswald font-extrabold text-2xl tracking-wider">
              BIF<span className="text-bif-red">.</span>TV
            </div>
            <div className="text-xs text-white/40 mt-1 mb-4">
              Streaming home of Balkan Influence Fighting · Premijerni dom BIF
              prenosa
            </div>
            <p className="text-xs text-white/40 leading-relaxed max-w-md">
              Premium live PPV streaming, replay i ekskluzivni sadržaj. Sve
              borbe, sve emocije, jedan klik.
            </p>
            <div className="mt-5 flex items-center gap-3">
              <SocialLink href="https://kick.com/bifevents" label="Kick" />
              <SocialLink href="https://bif.events" label="bif.events" />
            </div>
          </div>

          <div>
            <div className="mb-3 font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
              PLATFORMA
            </div>
            <ul className="space-y-2 text-sm">
              <FooterLink href="/events">Events</FooterLink>
              <FooterLink href="/my-passes">My Passes</FooterLink>
              <FooterLink href="/login">Sign In</FooterLink>
              <FooterLink href="/faq">FAQ</FooterLink>
            </ul>
          </div>

          <div>
            <div className="mb-3 font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
              LEGAL & HELP
            </div>
            <ul className="space-y-2 text-sm">
              <FooterLink href="/terms">Terms of Service</FooterLink>
              <FooterLink href="/privacy">Privacy Policy</FooterLink>
              <FooterLink href="/contact">Kontakt</FooterLink>
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/40">
          <div>© {year} Balkan Influence Fighting. All rights reserved.</div>
          <div>Plaćanje za osobe starije od 18 godina. Igraj odgovorno.</div>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="text-white/60 hover:text-bif-gold transition-colors"
      >
        {children}
      </Link>
    </li>
  );
}

function SocialLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white/70 hover:bg-white/5 hover:text-white"
    >
      {label}
    </a>
  );
}
