"use client";
import { useEffect, useState } from "react";
import { timeUntil } from "@/lib/format";

export function Countdown({ targetIso }: { targetIso: string }) {
  const [t, setT] = useState(() => timeUntil(targetIso));

  useEffect(() => {
    const id = setInterval(() => setT(timeUntil(targetIso)), 1000);
    return () => clearInterval(id);
  }, [targetIso]);

  if (!t) {
    return (
      <div className="font-oswald uppercase tracking-widest text-bif-gold font-bold">
        LIVE NOW
      </div>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-3 max-w-md">
      <Cell value={t.days} label="DANA" />
      <Cell value={t.hours} label="SATI" />
      <Cell value={t.mins} label="MIN" />
    </div>
  );
}

function Cell({ value, label }: { value: number; label: string }) {
  return (
    <div className="bg-white/5 border border-bif-gold/20 rounded-lg px-3 py-3 text-center">
      <div className="font-oswald font-extrabold text-3xl md:text-4xl text-white tabular-nums leading-none">
        {value}
      </div>
      <div className="font-oswald font-semibold text-[10px] tracking-[2px] text-bif-gold mt-1">
        {label}
      </div>
    </div>
  );
}
