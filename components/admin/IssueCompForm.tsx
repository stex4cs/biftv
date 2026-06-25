"use client";

import { useFormState } from "react-dom";
import {
  issueCompPassAction,
  type ActionResult,
} from "@/lib/admin-actions";
import { Label, PrimaryButton, Select, TextInput } from "./ui";

type EventOption = { id: string; slug: string; title: string };

export default function IssueCompForm({ events }: { events: EventOption[] }) {
  const [state, action] = useFormState<ActionResult | null, FormData>(
    issueCompPassAction,
    null,
  );

  return (
    <form action={action} className="space-y-4">
      <div>
        <Label>Email</Label>
        <TextInput
          name="email"
          type="email"
          required
          placeholder="ime@primer.com"
        />
      </div>

      <div>
        <Label>Event</Label>
        <Select name="event_id" required>
          <option value="">— odaberi —</option>
          {events.map((e) => (
            <option key={e.id} value={e.id}>
              {e.title}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Pass type</Label>
          <Select name="pass_type" defaultValue="live">
            <option value="live">Live</option>
            <option value="vod">VOD</option>
            <option value="bundle">Bundle</option>
          </Select>
        </div>
        <div>
          <Label>Hours valid</Label>
          <TextInput
            name="hours"
            type="number"
            min="1"
            max="720"
            defaultValue="72"
          />
        </div>
      </div>

      {state && state.ok === false ? (
        <p className="text-sm text-red-400">{state.error}</p>
      ) : null}
      {state && state.ok ? (
        <p className="text-sm text-bif-gold">
          Pass izdat. Pogledaj dole u listi za link.
        </p>
      ) : null}

      <PrimaryButton type="submit">Izdaj pass</PrimaryButton>
    </form>
  );
}
