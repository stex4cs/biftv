"use client";

import { useFormState } from "react-dom";
import { useState } from "react";
import {
  createMuxStreamAction,
  type ActionResult,
} from "@/lib/admin-actions";
import { Card, Label, PrimaryButton } from "./ui";

export default function StreamControls({
  eventId,
  liveStreamId,
  playbackId,
  streamKey,
}: {
  eventId: string;
  liveStreamId: string | null;
  playbackId: string | null;
  streamKey: string | null;
}) {
  const [state, action] = useFormState<ActionResult | null, FormData>(
    createMuxStreamAction,
    null,
  );

  return (
    <Card className="p-6">
      <h2 className="mb-4 font-oswald text-lg font-extrabold uppercase tracking-wider">
        Stream
      </h2>

      {liveStreamId ? (
        <div className="space-y-4">
          <div>
            <Label>Live stream ID</Label>
            <CodeBlock value={liveStreamId} />
          </div>
          <div>
            <Label>Playback ID (signed)</Label>
            <CodeBlock value={playbackId ?? "—"} />
          </div>
          <div>
            <Label>RTMP URL</Label>
            <CodeBlock value="rtmps://global-live.mux.com:443/app" />
          </div>
          <div>
            <Label>Stream key</Label>
            <CodeBlock value={streamKey ?? "—"} mask />
          </div>
          <p className="text-xs leading-relaxed text-white/40">
            Ubaci RTMP URL + Stream key u OBS (Settings → Stream → Custom).
            Status event-a će automatski preći u Live čim Mux primi signal.
          </p>
        </div>
      ) : (
        <form action={action} className="space-y-4">
          <input type="hidden" name="id" value={eventId} />
          <p className="text-sm text-white/60">
            Klikni da Mux kreira novi live stream za ovaj event. Dobićeš RTMP
            URL i stream key za OBS.
          </p>
          {state && state.ok === false ? (
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm">
              <p className="font-bold text-red-400">{state.error}</p>
              {state.error.toLowerCase().includes("free plan") ? (
                <p className="mt-2 text-xs text-white/60">
                  Live streams traže Pay-as-you-go plan (košta $0 dok ne pustiš
                  stream). Otvori{" "}
                  <a
                    href="https://dashboard.mux.com/settings/billing"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-bif-gold underline"
                  >
                    Mux Billing
                  </a>{" "}
                  i dodaj kreditnu karticu. Tek pri prvom live event-u Mux
                  počinje da naplaćuje po minutu.
                  <br />
                  <br />
                  Za VOD test sad: upload-uj video na dashboard.mux.com sa
                  Signed playback policy i paste playback ID u polje na formi
                  levo.
                </p>
              ) : null}
            </div>
          ) : null}
          <PrimaryButton type="submit">+ Kreiraj Mux stream</PrimaryButton>
        </form>
      )}
    </Card>
  );
}

function CodeBlock({ value, mask = false }: { value: string; mask?: boolean }) {
  const [revealed, setRevealed] = useState(!mask);
  const display = revealed ? value : "•".repeat(Math.min(value.length, 32));
  return (
    <div className="flex items-center gap-2">
      <code className="flex-1 overflow-hidden rounded-md border border-white/10 bg-black/40 px-3 py-2 text-xs">
        {display}
      </code>
      {mask ? (
        <button
          type="button"
          onClick={() => setRevealed((r) => !r)}
          className="rounded-md border border-white/10 px-2 py-1 text-xs text-white/60 hover:bg-white/5"
        >
          {revealed ? "hide" : "show"}
        </button>
      ) : null}
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(value)}
        className="rounded-md border border-white/10 px-2 py-1 text-xs text-white/60 hover:bg-white/5"
      >
        copy
      </button>
    </div>
  );
}
