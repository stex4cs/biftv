"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { uploadPosterAction } from "@/lib/admin-actions";

export default function PosterUpload({
  eventId,
  currentUrl,
}: {
  eventId: string;
  currentUrl?: string | null;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [preview, setPreview] = useState<string | null>(currentUrl ?? null);

  async function handleFile(file: File) {
    setError("");
    setUploading(true);
    try {
      const localPreview = URL.createObjectURL(file);
      setPreview(localPreview);

      const fd = new FormData();
      fd.append("file", file);
      fd.append("event_id", eventId);
      const res = await uploadPosterAction(fd);
      if (!res.ok) {
        setError(res.error);
        setPreview(currentUrl ?? null);
      } else {
        setPreview(res.url);
        router.refresh();
      }
    } catch (e) {
      setError((e as Error).message);
      setPreview(currentUrl ?? null);
    } finally {
      setUploading(false);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void handleFile(file);
  }

  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) void handleFile(file);
  }

  return (
    <div>
      <span className="mb-1 block text-xs font-bold uppercase tracking-wider text-white/50">
        Poster
      </span>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed p-6 transition ${
          dragging
            ? "border-bif-gold bg-bif-gold/5"
            : "border-white/15 hover:border-white/30 bg-black/40"
        }`}
      >
        {preview ? (
          <img
            src={preview}
            alt="Poster preview"
            className="max-h-60 rounded-md object-contain"
          />
        ) : (
          <div className="py-6 text-center">
            <div className="font-oswald text-2xl font-extrabold uppercase tracking-wider text-white/30">
              + Drop image
            </div>
            <div className="mt-1 text-xs text-white/40">
              ili klikni da odabereš · max 10 MB · PNG/JPG/WEBP
            </div>
          </div>
        )}

        {uploading ? (
          <div className="text-xs font-bold uppercase tracking-wider text-bif-gold">
            Šaljem…
          </div>
        ) : preview ? (
          <div className="text-xs text-white/40">
            Klikni ili prevuci novi fajl da zameniš
          </div>
        ) : null}

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </div>

      {error ? (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      ) : null}
    </div>
  );
}
