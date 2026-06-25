"use client";

import { useFormState } from "react-dom";
import {
  deleteEventAction,
  updateEventAction,
  type ActionResult,
} from "@/lib/admin-actions";
import {
  GhostButton,
  Label,
  PrimaryButton,
  Select,
  TextArea,
  TextInput,
} from "./ui";

type EventRow = {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  sponsor_line: string | null;
  date: string;
  venue: string | null;
  venue_city: string | null;
  description: string | null;
  poster_url: string | null;
  status: string;
  prices: { livePass?: number; vodPass?: number; bundlePass?: number };
};

function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}

export default function EventEditForm({ event }: { event: EventRow }) {
  const [state, action] = useFormState<ActionResult | null, FormData>(
    updateEventAction,
    null,
  );

  return (
    <form action={action} className="grid gap-5 md:grid-cols-2">
      <input type="hidden" name="id" value={event.id} />

      <div>
        <Label>Title</Label>
        <TextInput name="title" defaultValue={event.title} required />
      </div>

      <div>
        <Label>Status</Label>
        <Select name="status" defaultValue={event.status}>
          <option value="upcoming">Upcoming</option>
          <option value="live">Live</option>
          <option value="ended">Ended</option>
          <option value="vod">VOD</option>
        </Select>
      </div>

      <div className="md:col-span-2">
        <Label>Subtitle</Label>
        <TextInput name="subtitle" defaultValue={event.subtitle ?? ""} />
      </div>

      <div className="md:col-span-2">
        <Label>Sponsor line</Label>
        <TextInput
          name="sponsor_line"
          defaultValue={event.sponsor_line ?? ""}
          placeholder="Powered by Oktagonbet"
        />
      </div>

      <div>
        <Label>Date & time</Label>
        <TextInput
          name="date"
          type="datetime-local"
          required
          defaultValue={toDatetimeLocal(event.date)}
        />
      </div>

      <div>
        <Label>Poster URL</Label>
        <TextInput
          name="poster_url"
          defaultValue={event.poster_url ?? ""}
          placeholder="/posters/bif-x.png"
        />
      </div>

      <div>
        <Label>Venue</Label>
        <TextInput name="venue" defaultValue={event.venue ?? ""} />
      </div>

      <div>
        <Label>Venue city</Label>
        <TextInput name="venue_city" defaultValue={event.venue_city ?? ""} />
      </div>

      <div className="md:col-span-2">
        <Label>Description</Label>
        <TextArea
          name="description"
          rows={4}
          defaultValue={event.description ?? ""}
        />
      </div>

      <div>
        <Label>Live pass (EUR)</Label>
        <TextInput
          name="live_pass"
          type="number"
          min="0"
          step="1"
          defaultValue={event.prices?.livePass ?? 9}
        />
      </div>

      <div>
        <Label>Replay pass (EUR)</Label>
        <TextInput
          name="vod_pass"
          type="number"
          min="0"
          step="1"
          defaultValue={event.prices?.vodPass ?? 5}
        />
      </div>

      <div>
        <Label>Bundle pass (EUR)</Label>
        <TextInput
          name="bundle_pass"
          type="number"
          min="0"
          step="1"
          defaultValue={event.prices?.bundlePass ?? 12}
        />
      </div>

      <div />

      {state && state.ok === false ? (
        <p className="md:col-span-2 text-sm text-red-400">{state.error}</p>
      ) : null}
      {state && state.ok ? (
        <p className="md:col-span-2 text-sm text-bif-gold">Sačuvano.</p>
      ) : null}

      <div className="md:col-span-2 flex items-center justify-between gap-3 pt-2">
        <div className="flex gap-3">
          <PrimaryButton type="submit">Sačuvaj izmene</PrimaryButton>
          <GhostButton href="/admin/events">Lista</GhostButton>
        </div>
        <DeleteForm id={event.id} title={event.title} />
      </div>
    </form>
  );
}

function DeleteForm({ id, title }: { id: string; title: string }) {
  return (
    <form
      action={deleteEventAction}
      onSubmit={(e) => {
        if (!confirm(`Sigurno obrisati event "${title}"?`)) e.preventDefault();
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className="rounded-lg border border-red-500/30 px-4 py-2 font-oswald text-xs font-bold uppercase tracking-wider text-red-400 hover:bg-red-500/10"
      >
        Obriši event
      </button>
    </form>
  );
}
