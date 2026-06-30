"use client";

import { useState } from "react";
import Link from "next/link";

type Status = "idle" | "sending" | "sent" | "error";

const TOPICS = [
  { value: "support", label: "Tehnička podrška" },
  { value: "billing", label: "Plaćanje / Refundacija" },
  { value: "partnerships", label: "Partnerstva" },
  { value: "press", label: "Press / Mediji" },
  { value: "gdpr", label: "GDPR — pristup/brisanje" },
  { value: "other", label: "Drugo" },
];

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("support");
  const [message, setMessage] = useState("");
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, topic, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setError(data.error ?? "Greška, probaj kasnije.");
        return;
      }
      setStatus("sent");
    } catch {
      setStatus("error");
      setError("Mreža nije dostupna.");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-bif-gold/30 bg-bif-gold/5 p-6 text-center">
        <div className="mb-1 font-oswald text-xs font-bold uppercase tracking-wider text-bif-gold">
          ✓ POSLATO
        </div>
        <p className="text-sm text-white/80">
          Hvala. Odgovaramo u roku od 48h na{" "}
          <span className="font-bold text-bif-gold">{email}</span>.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Ime">
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={80}
            className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-bif-gold focus:outline-none"
            placeholder="Tvoje ime"
          />
        </Field>
        <Field label="Email">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-bif-gold focus:outline-none"
            placeholder="ime@primer.com"
          />
        </Field>
      </div>

      <Field label="Tema">
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-sm text-white focus:border-bif-gold focus:outline-none"
        >
          {TOPICS.map((t) => (
            <option key={t.value} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Poruka">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          required
          minLength={10}
          maxLength={4000}
          rows={6}
          className="w-full rounded-lg border border-white/15 bg-black/40 px-4 py-3 text-sm text-white placeholder-white/30 focus:border-bif-gold focus:outline-none"
          placeholder="Detaljno opiši pitanje ili problem…"
        />
      </Field>

      <label className="flex items-start gap-2 text-xs text-white/60">
        <input
          type="checkbox"
          checked={agree}
          onChange={(e) => setAgree(e.target.checked)}
          required
          className="mt-1 h-4 w-4 accent-bif-red"
        />
        <span>
          Saglasan/na sam sa{" "}
          <Link href="/privacy" className="text-bif-gold underline">
            Politikom privatnosti
          </Link>
          .
        </span>
      </label>

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      <button
        type="submit"
        disabled={status === "sending" || !agree}
        className="rounded-lg bg-bif-red px-6 py-3 font-oswald text-sm font-extrabold uppercase tracking-widest text-white hover:bg-bif-red/90 disabled:opacity-50"
      >
        {status === "sending" ? "Šaljem…" : "Pošalji poruku"}
      </button>
    </form>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-white/50">
        {label}
      </span>
      {children}
    </label>
  );
}
