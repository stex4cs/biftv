"use client";

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
  return (
    <aside className="fixed left-0 top-0 z-30 hidden h-screen w-60 border-r border-white/10 bg-[#0d0d0d] md:flex md:flex-col">
      <div className="px-6 py-6">
        <div className="font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
          BIF.TV
        </div>
        <div className="font-oswald text-2xl font-extrabold uppercase tracking-wider">
          Admin
        </div>
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
  );
}
