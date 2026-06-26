import { Resend } from "resend";

let cached: Resend | null = null;

function client(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (cached) return cached;
  cached = new Resend(key);
  return cached;
}

export type SendOpts = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
  tags?: { name: string; value: string }[];
};

export async function sendEmail(opts: SendOpts): Promise<
  { ok: true; id: string } | { ok: false; error: string }
> {
  const r = client();
  if (!r) {
    return { ok: false, error: "RESEND_API_KEY missing" };
  }
  const from = process.env.RESEND_FROM ?? "BIF.TV <onboarding@resend.dev>";
  const replyTo = opts.replyTo ?? process.env.RESEND_REPLY_TO;

  try {
    const res = await r.emails.send({
      from,
      to: opts.to,
      subject: opts.subject,
      html: opts.html,
      text: opts.text,
      replyTo: replyTo,
      tags: opts.tags,
    });
    if (res.error) {
      console.error("[email] resend error:", res.error);
      return { ok: false, error: res.error.message ?? "Unknown Resend error" };
    }
    return { ok: true, id: res.data?.id ?? "" };
  } catch (err) {
    console.error("[email] send threw:", err);
    return { ok: false, error: (err as Error).message };
  }
}
