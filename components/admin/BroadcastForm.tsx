"use client";

import { useFormState } from "react-dom";
import {
  broadcastAction,
  type ActionResult,
} from "@/lib/admin-actions";
import {
  Label,
  PrimaryButton,
  TextArea,
  TextInput,
} from "./ui";

export default function BroadcastForm() {
  const [state, action] = useFormState<ActionResult | null, FormData>(
    broadcastAction,
    null,
  );

  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (
          !confirm(
            "Sigurno šalješ email svim subscriber-ima? Ovo se ne može povući.",
          )
        ) {
          e.preventDefault();
        }
      }}
      className="space-y-5"
    >
      <div>
        <Label>Subject (email naslov)</Label>
        <TextInput
          name="subject"
          required
          placeholder="BIF 4 - datum objavljen"
        />
      </div>

      <div>
        <Label>Headline (veliki naslov u email-u)</Label>
        <TextInput
          name="headline"
          required
          placeholder="BIF 4 stiže 15. decembra"
        />
      </div>

      <div>
        <Label>Body (paragrafi razdvojeni praznim redom)</Label>
        <TextArea
          name="body"
          required
          rows={8}
          placeholder={`Stiže nova noć BIF udaraca.\n\nUskoro objavljujemo full card sa svim borbama i cenama pasova.\n\nBudi prvi koji čuje datum prodaje.`}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <Label>CTA dugme (opciono)</Label>
          <TextInput
            name="cta_label"
            placeholder="POGLEDAJ DOGAĐAJ"
          />
        </div>
        <div>
          <Label>CTA URL (opciono)</Label>
          <TextInput
            name="cta_url"
            type="url"
            placeholder="https://biftv.vercel.app/events/bif-4"
          />
        </div>
      </div>

      {state && state.ok === false ? (
        <p className="text-sm text-red-400">{state.error}</p>
      ) : null}
      {state && state.ok ? (
        <p className="text-sm text-bif-gold">
          ✓ Email blast poslat. Proveri Resend dashboard za delivery report.
        </p>
      ) : null}

      <PrimaryButton type="submit">📧 Pošalji svima</PrimaryButton>
    </form>
  );
}
