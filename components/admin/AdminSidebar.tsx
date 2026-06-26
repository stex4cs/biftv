"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LogoutButton from "./LogoutButton";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: "▣" },
  { href: "/admin/events", label: "Events", icon: "▶" },
  { href: "/admin/passes", label: "Passes", icon: "✦" },
  { href: "/admin/subscribers", label: "Subscribers", icon: "✉" },
  { href: "/admin/broadcast", label: "Broadcast", icon: "📣" },
];

export default function AdminSidebar() {
  const path = usePathname() ?? "";
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        aria-label="Open admin menu"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-40 md:hidden rounded-lg border border-white/10 bg-[#0d0d0d] p-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="22"
          height="22"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </button>

      {open ? (
        <div
          className="fixed inset-0 z-40 md:hidden bg-black/70"
          onClick={() => setOpen(false)}
        />
      ) : null}

      <aside
        className={`fixed left-0 top-0 z-50 h-screen w-60 border-r border-white/10 bg-[#0d0d0d] flex flex-col transition-transform md:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-6 py-6 flex items-center justify-between">
          <div>
            <div className="font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
              BIF.TV
            </div>
            <div className="font-oswald text-2xl font-extrabold uppercase tracking-wider">
              Admin
            </div>
          </div>
          <button
            type="button"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
            className="md:hidden text-white/60 hover:text-white"
          >
            ✕
          </button>
        </div>
        <nav className="flex-1 px-3">
          {NAV.map((item) => {
            const active =
              item.href === "/admin"
                ? path === "/admin"
                : path.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mb-1 flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition ${
                  active
                    ? "bg-bif-red/15 text-bif-gold"
                    : "text-white/70 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className="text-base">{item.icon}</span>
                <span className="font-oswald uppercase tracking-wider">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 p-3">
          <Link
            href="/"
            className="mb-2 flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-white/50 hover:bg-white/5"
          >
            <span>↩</span>
            <span className="font-oswald uppercase tracking-wider">
              View site
            </span>
          </Link>
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
