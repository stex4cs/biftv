"use client";

import { useState } from "react";
import Link from "next/link";
import { supabaseBrowser } from "@/lib/supabase-browser";

export default function LoginForm({ initialError }: { initialError?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState(initialError ?? "");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const supabase = supabaseBrowser();
      const { error: err } = await supabase.auth.signInWithOtp({
        email: email.trim().toLowerCase(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (err) {
        setStatus("error");
        setError(err.message);
        return;
      }
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError((err as Error).message);
    }
  }

  if (status === "sent") {
    return (
      <div className="space-y-4 text-center">
        <div className="rounded-lg border border-bif-gold/30 bg-bif-gold/5 p-4">
          <div className="mb-1 font-oswald text-xs font-bold uppercase tracking-wider text-bif-gold">
            ✓ POSLATO
          </div>
          <p className="text-sm text-white/80">
            Otvori inbox na{" "}
            <span className="font-bold text-bif-gold">{email}</span> i klikni
            link da uđeš u nalog.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setStatus("idle");
            setEmail("");
          }}
          className="text-sm text-white/50 underline hover:text-white"
        >
          Pošalji opet ili promeni email
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block">
        <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-white/50">
          Email
        </span>
        <input
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tvoj@email.com"
          className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 text-white placeholder-white/30 focus:border-bif-gold focus:outline-none"
        />
      </label>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <button
        type="submit"
        disabled={status === "sending" || !email}
        className="w-full rounded-lg bg-bif-red px-6 py-3 font-oswald font-extrabold uppercase tracking-widest text-white transition hover:bg-bif-red/90 disabled:opacity-50"
      >
        {status === "sending" ? "Šaljem…" : "Pošalji magic link"}
      </button>

      <p className="text-xs text-white/40">
        Nemaš pass?{" "}
        <Link href="/events" className="text-bif-gold underline">
          Pogledaj događaje
        </Link>
      </p>
    </form>
  );
}
