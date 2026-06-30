"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getConsent, setConsent } from "@/lib/consent";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [analytics, setAnalytics] = useState(true);
  const [marketing, setMarketing] = useState(true);

  useEffect(() => {
    if (!getConsent()) setVisible(true);
  }, []);

  if (!visible) return null;

  function accept(opts: { analytics: boolean; marketing: boolean }) {
    setConsent(opts);
    setVisible(false);
  }

  return (
    <div
      role="dialog"
      aria-label="Cookie preferences"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pb-4 sm:px-6 sm:pb-6"
    >
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-white/15 bg-[#0d0d0d]/95 shadow-2xl backdrop-blur-md">
        <div className="p-5 sm:p-6">
          <div className="mb-2 font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
            COOKIES & PRIVACY
          </div>
          <p className="text-sm leading-relaxed text-white/80">
            Koristimo kolačiće da sajt radi i opciono da merimo analitiku i
            optimizujemo reklame. Tehnički neophodni kolačići su uvek aktivni —
            ostalo je tvoj izbor.{" "}
            <Link href="/privacy" className="text-bif-gold underline">
              Privacy Policy
            </Link>
          </p>

          {showDetails ? (
            <div className="mt-4 space-y-3 rounded-lg border border-white/10 bg-black/40 p-4">
              <CategoryRow
                label="Neophodni"
                description="Sesija, login, anti-piracy device ID, payment flow. Bez ovih sajt ne radi."
                checked
                disabled
              />
              <CategoryRow
                label="Analitika"
                description="Google Analytics — anonimni broj poseta i ponašanja na sajtu."
                checked={analytics}
                onChange={setAnalytics}
              />
              <CategoryRow
                label="Marketing"
                description="Meta Pixel za remarketing reklame i merenje konverzija."
                checked={marketing}
                onChange={setMarketing}
              />
            </div>
          ) : null}

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="button"
              onClick={() => setShowDetails((s) => !s)}
              className="text-xs text-white/50 underline hover:text-white"
            >
              {showDetails ? "Sakrij detalje" : "Prilagodi"}
            </button>
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                type="button"
                onClick={() => accept({ analytics: false, marketing: false })}
                className="rounded-lg border border-white/15 px-5 py-2 font-oswald text-xs font-bold uppercase tracking-wider text-white/80 hover:bg-white/5"
              >
                Samo neophodne
              </button>
              {showDetails ? (
                <button
                  type="button"
                  onClick={() => accept({ analytics, marketing })}
                  className="rounded-lg border border-bif-gold/40 bg-bif-gold/10 px-5 py-2 font-oswald text-xs font-bold uppercase tracking-wider text-bif-gold hover:bg-bif-gold/20"
                >
                  Sačuvaj izbor
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => accept({ analytics: true, marketing: true })}
                  className="rounded-lg bg-bif-red px-5 py-2 font-oswald text-xs font-bold uppercase tracking-wider text-white hover:bg-bif-red/90"
                >
                  Prihvati sve
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CategoryRow({
  label,
  description,
  checked,
  disabled,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  disabled?: boolean;
  onChange?: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-3">
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.checked)}
        className="mt-1 h-4 w-4 cursor-pointer accent-bif-red disabled:cursor-not-allowed"
      />
      <div>
        <div className="font-oswald text-xs font-bold uppercase tracking-wider text-white">
          {label}
        </div>
        <p className="text-xs text-white/50">{description}</p>
      </div>
    </div>
  );
}
