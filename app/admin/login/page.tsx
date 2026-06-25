"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.get("next") ?? "/admin";
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Pogrešan token.");
        setLoading(false);
        return;
      }
      router.push(next);
      router.refresh();
    } catch {
      setError("Mreža nije dostupna.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-bif-black flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-gradient-to-br from-[#1a0a0c] to-[#0a0a0a] p-8 shadow-2xl">
        <div className="mb-6 text-center">
          <div className="font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
            BIF.TV
          </div>
          <h1 className="font-oswald text-3xl font-extrabold uppercase tracking-wider">
            Admin
          </h1>
        </div>

        <form onSubmit={submit} className="space-y-4">
          <label className="block">
            <span className="mb-1 block text-sm text-white/70">
              Admin token
            </span>
            <input
              type="password"
              autoComplete="current-password"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              required
              className="w-full rounded-lg border border-white/15 bg-black/50 px-4 py-3 font-mono text-sm text-white placeholder-white/30 focus:border-bif-gold focus:outline-none"
              placeholder="Paste your ADMIN_API_TOKEN"
            />
          </label>

          {error ? (
            <p className="text-sm text-red-400">{error}</p>
          ) : null}

          <button
            type="submit"
            disabled={loading || !token}
            className="w-full rounded-lg bg-bif-red px-6 py-3 font-oswald font-extrabold uppercase tracking-widest text-white transition hover:bg-bif-red/90 disabled:opacity-50"
          >
            {loading ? "Šaljem…" : "Uđi u admin"}
          </button>
        </form>
      </div>
    </div>
  );
}
