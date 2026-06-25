"use client";

import { useState } from "react";

type Status = "idle" | "loading" | "ok" | "error";

export default function EmailSignup({ source = "homepage" }: { source?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        const dbg = data.debug
          ? ` [${data.debug.code ?? "?"}] ${data.debug.message ?? ""}`
          : "";
        setMessage((data.error ?? "Greška.") + dbg);
        return;
      }
      setStatus("ok");
      setMessage("Hvala! Obavestićemo te kada PPV bude dostupan.");
      setEmail("");
    } catch {
      setStatus("error");
      setMessage("Mreža nije dostupna.");
    }
  }

  return (
    <form onSubmit={submit} className="flex flex-col gap-3 sm:flex-row">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="tvoj@email.com"
        className="flex-1 rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-white placeholder-white/40 focus:border-bif-gold focus:outline-none"
        disabled={status === "loading"}
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-bif-red px-6 py-3 font-bold text-white transition hover:bg-bif-red/90 disabled:opacity-50"
      >
        {status === "loading" ? "Šaljem…" : "Obavesti me"}
      </button>
      {message ? (
        <p
          className={`w-full text-sm ${status === "ok" ? "text-bif-gold" : "text-red-400"}`}
        >
          {message}
        </p>
      ) : null}
    </form>
  );
}
