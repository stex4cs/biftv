"use client";

import { useEffect, useState, useRef } from "react";
import { getDeviceId, shortDeviceId } from "@/lib/device-id";
import PlayerWatermark from "./PlayerWatermark";

type Status =
  | { kind: "loading" }
  | { kind: "ready" }
  | {
      kind: "conflict";
      activeDevice: string;
      activeUserAgent: string | null;
    }
  | { kind: "kicked"; reason: string }
  | { kind: "denied"; reason: string };

const HEARTBEAT_INTERVAL_MS = 25_000;

export default function WatchSession({
  token,
  email,
  children,
}: {
  token: string;
  email: string;
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<Status>({ kind: "loading" });
  const deviceIdRef = useRef<string>("");
  const heartbeatTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    deviceIdRef.current = getDeviceId();
    void claim();
    return () => stopHeartbeat();
  }, []);

  function stopHeartbeat() {
    if (heartbeatTimerRef.current) {
      clearInterval(heartbeatTimerRef.current);
      heartbeatTimerRef.current = null;
    }
  }

  function startHeartbeat() {
    stopHeartbeat();
    heartbeatTimerRef.current = setInterval(async () => {
      try {
        const res = await fetch("/api/access/heartbeat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            token,
            device_id: deviceIdRef.current,
          }),
        });
        if (res.ok) return;
        const data = await res.json().catch(() => ({}));
        if (res.status === 409) {
          stopHeartbeat();
          setStatus({
            kind: "kicked",
            reason: data.reason ?? "Sesija je preuzeta na drugom uređaju.",
          });
        } else if (res.status === 403) {
          stopHeartbeat();
          setStatus({
            kind: "denied",
            reason: data.reason ?? "Pristup je opozvan.",
          });
        }
      } catch {
        // network blip — try again next tick
      }
    }, HEARTBEAT_INTERVAL_MS);
  }

  async function claim() {
    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/access/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          device_id: deviceIdRef.current,
        }),
      });
      const data = await res.json();
      if (res.ok && data.status === "ok") {
        setStatus({ kind: "ready" });
        startHeartbeat();
        return;
      }
      if (res.status === 409 && data.status === "conflict") {
        setStatus({
          kind: "conflict",
          activeDevice: data.activeDevice,
          activeUserAgent: data.activeUserAgent,
        });
        return;
      }
      setStatus({
        kind: "denied",
        reason: data.reason ?? "Pristup nije moguć.",
      });
    } catch {
      setStatus({
        kind: "denied",
        reason: "Mreža nije dostupna. Probaj ponovo.",
      });
    }
  }

  async function transfer() {
    setStatus({ kind: "loading" });
    try {
      const res = await fetch("/api/access/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          device_id: deviceIdRef.current,
        }),
      });
      const data = await res.json();
      if (res.ok && data.status === "ok") {
        setStatus({ kind: "ready" });
        startHeartbeat();
        return;
      }
      setStatus({
        kind: "denied",
        reason: data.reason ?? "Prebacivanje nije uspelo.",
      });
    } catch {
      setStatus({
        kind: "denied",
        reason: "Mreža nije dostupna.",
      });
    }
  }

  if (status.kind === "loading") {
    return <CenterMessage title="Učitavam sesiju…" muted />;
  }

  if (status.kind === "conflict") {
    return (
      <CenterMessage title="Pass je aktivan na drugom uređaju">
        <p className="mt-2 max-w-md text-sm text-white/60">
          Trenutno gleda uređaj{" "}
          <span className="font-mono text-bif-gold">
            {shortDeviceId(status.activeDevice)}
          </span>
          {status.activeUserAgent ? (
            <span className="text-white/40"> · {truncate(status.activeUserAgent, 60)}</span>
          ) : null}
        </p>
        <p className="mt-2 max-w-md text-xs text-white/40">
          Možeš da preuzmeš sesiju ovde — onaj drugi uređaj će u par sekundi
          biti izlogovan.
        </p>
        <button
          type="button"
          onClick={transfer}
          className="mt-6 rounded-lg bg-bif-red px-6 py-3 font-oswald text-sm font-extrabold uppercase tracking-widest text-white hover:bg-bif-red/90"
        >
          Preuzmi sesiju
        </button>
      </CenterMessage>
    );
  }

  if (status.kind === "kicked") {
    return (
      <CenterMessage title="Pass je preuzet drugde">
        <p className="mt-2 max-w-md text-sm text-white/60">{status.reason}</p>
        <p className="mt-2 max-w-md text-xs text-white/40">
          Ako si to bio ti, klikni dole da vratiš sesiju.
        </p>
        <button
          type="button"
          onClick={transfer}
          className="mt-6 rounded-lg border border-bif-gold/40 px-6 py-3 font-oswald text-sm font-extrabold uppercase tracking-widest text-bif-gold hover:bg-bif-gold/10"
        >
          Vrati sesiju ovde
        </button>
      </CenterMessage>
    );
  }

  if (status.kind === "denied") {
    return <CenterMessage title="Nema pristupa">{status.reason}</CenterMessage>;
  }

  return (
    <div className="relative">
      {children}
      <PlayerWatermark email={email} />
    </div>
  );
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n) + "…" : s;
}

function CenterMessage({
  title,
  children,
  muted = false,
}: {
  title: string;
  children?: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <div className="flex aspect-video w-full flex-col items-center justify-center rounded-xl border border-white/10 bg-black text-center">
      <div className="mb-2 font-oswald text-xs font-bold uppercase tracking-[3px] text-bif-red">
        {muted ? "WAIT" : "SESIJA"}
      </div>
      <h2 className="px-4 font-oswald text-2xl font-extrabold uppercase tracking-wider">
        {title}
      </h2>
      {children ? <div className="px-4">{children}</div> : null}
    </div>
  );
}
