"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

type Props = { signedIn: boolean };

export default function HeaderNav({ signedIn }: Props) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <nav className="hidden md:flex items-center gap-6">
        <NavLink href="/events" label="Events" />
        {signedIn ? (
          <Link
            href="/my-passes"
            className="font-oswald uppercase font-bold text-sm tracking-widest border border-bif-gold/40 text-bif-gold hover:bg-bif-gold/10 px-4 py-2 rounded-md transition-colors"
          >
            My Passes
          </Link>
        ) : (
          <Link
            href="/login"
            className="font-oswald uppercase font-bold text-sm tracking-widest bg-bif-red hover:bg-bif-red-dark px-4 py-2 rounded-md transition-colors"
          >
            Sign In
          </Link>
        )}
      </nav>

      <button
        type="button"
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="md:hidden flex flex-col gap-1.5 p-2 rounded-md hover:bg-white/5"
      >
        <span
          className={`block h-0.5 w-6 bg-white transition-transform ${
            open ? "rotate-45 translate-y-2" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-white transition-opacity ${
            open ? "opacity-0" : ""
          }`}
        />
        <span
          className={`block h-0.5 w-6 bg-white transition-transform ${
            open ? "-rotate-45 -translate-y-2" : ""
          }`}
        />
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/95 backdrop-blur-lg flex flex-col items-center justify-center gap-8 px-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <MobileLink href="/" label="Home" />
          <MobileLink href="/events" label="Events" />
          {signedIn ? (
            <MobileLink href="/my-passes" label="My Passes" highlight="gold" />
          ) : (
            <MobileLink href="/login" label="Sign In" highlight="red" />
          )}
        </div>
      ) : null}
    </>
  );
}

function NavLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="font-oswald uppercase text-sm tracking-widest text-white/70 hover:text-white transition-colors"
    >
      {label}
    </Link>
  );
}

function MobileLink({
  href,
  label,
  highlight,
}: {
  href: string;
  label: string;
  highlight?: "red" | "gold";
}) {
  const cls =
    highlight === "red"
      ? "bg-bif-red text-white px-6 py-3 rounded-lg"
      : highlight === "gold"
        ? "border border-bif-gold/40 text-bif-gold px-6 py-3 rounded-lg"
        : "text-white/80";
  return (
    <Link
      href={href}
      className={`font-oswald uppercase font-bold text-2xl tracking-widest hover:text-white transition ${cls}`}
    >
      {label}
    </Link>
  );
}
