"use client";

import { useEffect, useState } from "react";

/**
 * Email watermark overlay. Rotates position every 12s to make cropping in
 * post harder. Cannot be removed via DOM inspection without breaking
 * playback because it lives inside the same relative parent as the player.
 *
 * Anyone with devtools can hide a single element, so this is a deterrent —
 * not a fortress. Real anti-piracy is the signed URLs + device limit.
 */
const POSITIONS = [
  "top-4 left-4",
  "top-4 right-4",
  "bottom-12 left-4",
  "bottom-12 right-4",
  "top-1/3 left-1/2 -translate-x-1/2",
] as const;

export default function PlayerWatermark({ email }: { email: string }) {
  const [pos, setPos] = useState(0);

  useEffect(() => {
    const t = setInterval(() => {
      setPos((p) => (p + 1) % POSITIONS.length);
    }, 12_000);
    return () => clearInterval(t);
  }, []);

  const mask = maskEmail(email);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute z-20 select-none rounded-md bg-black/30 px-2 py-1 font-mono text-[10px] text-white/50 backdrop-blur-sm transition-all duration-1000 ${POSITIONS[pos]}`}
      style={{ mixBlendMode: "difference" }}
    >
      {mask}
    </div>
  );
}

function maskEmail(email: string): string {
  if (!email) return "anon";
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const visible = local.slice(0, 2);
  const dots = ".".repeat(Math.min(local.length - 2, 6));
  return `${visible}${dots}@${domain}`;
}
