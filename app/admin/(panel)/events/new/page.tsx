"use client";

import { useFormState } from "react-dom";
import { createEventAction, type ActionResult } from "@/lib/admin-actions";
import {
  Card,
  GhostButton,
  Label,
  PageHeader,
  PrimaryButton,
  Select,
  TextInput,
} from "@/components/admin/ui";

export default function NewEventPage() {
  const [state, action] = useFormState<ActionResult | null, FormData>(
    createEventAction,
    null,
  );

  return (
    <>
      <PageHeader subtitle="CREATE" title="New event" />

      <Card className="p-6">
        <form action={action} className="grid gap-5 md:grid-cols-2">
          <div className="md:col-span-2">
            <Label>Slug</Label>
            <TextInput
              name="slug"
              required
              placeholder="bif-4"
              pattern="[a-z0-9-]+"
            />
            <p className="mt-1 text-xs text-white/40">
              Lowercase, brojevi, crtice. Pojavljuje se u URL-u
              (/events/{`{slug}`}).
            </p>
          </div>

          <div>
            <Label>Title</Label>
            <TextInput name="title" required placeholder="BIF 4" />
          </div>

          <div>
            <Label>Subtitle</Label>
            <TextInput
              name="subtitle"
              placeholder="The crown stays in Belgrade"
            />
          </div>

          <div>
            <Label>Date & time</Label>
            <TextInput
              name="date"
              type="datetime-local"
              required
              defaultValue="2026-12-15T19:00"
            />
          </div>

          <div>
            <Label>Status</Label>
            <Select name="status" defaultValue="upcoming">
              <option value="upcoming">Upcoming</option>
              <option value="live">Live</option>
              <option value="ended">Ended</option>
              <option value="vod">VOD</option>
            </Select>
          </div>

          <div>
            <Label>Venue</Label>
            <TextInput name="venue" placeholder="Beogradski Sajam, Hala 3" />
          </div>

          <div>
            <Label>Venue city</Label>
            <TextInput name="venue_city" placeholder="Beograd" />
          </div>

          <div>
            <Label>Poster URL</Label>
            <TextInput name="poster_url" placeholder="/posters/bif-4.png" />
          </div>

          <div />

          <div>
            <Label>Live pass (EUR)</Label>
            <TextInput
              name="live_pass"
              type="number"
              min="0"
              step="1"
              defaultValue="9"
            />
          </div>

          <div>
            <Label>Replay pass (EUR)</Label>
            <TextInput
              name="vod_pass"
              type="number"
              min="0"
              step="1"
              defaultValue="5"
            />
          </div>

          <div>
            <Label>Bundle pass (EUR)</Label>
            <TextInput
              name="bundle_pass"
              type="number"
              min="0"
              step="1"
              defaultValue="12"
            />
          </div>

          {state && state.ok === false ? (
            <p className="md:col-span-2 text-sm text-red-400">
              {state.error}
            </p>
          ) : null}

          <div className="md:col-span-2 flex gap-3 pt-2">
            <PrimaryButton type="submit">Kreiraj event</PrimaryButton>
            <GhostButton href="/admin/events">Otkaži</GhostButton>
          </div>
        </form>
      </Card>
    </>
  );
}
