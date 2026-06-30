import { NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ALLOWED_TOPICS = new Set([
  "support",
  "billing",
  "partnerships",
  "press",
  "gdpr",
  "other",
]);

export async function POST(req: Request) {
  let body: {
    name?: string;
    email?: string;
    topic?: string;
    message?: string;
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const name = (body.name ?? "").trim().slice(0, 80);
  const email = (body.email ?? "").trim().toLowerCase();
  const topic = (body.topic ?? "other").trim();
  const message = (body.message ?? "").trim().slice(0, 4000);

  if (!name || !email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Ime i validan email su obavezni." },
      { status: 400 },
    );
  }
  if (message.length < 10) {
    return NextResponse.json(
      { error: "Poruka je prekratka (min 10 karaktera)." },
      { status: 400 },
    );
  }
  if (!ALLOWED_TOPICS.has(topic)) {
    return NextResponse.json({ error: "Nepoznata tema." }, { status: 400 });
  }

  const inbox =
    process.env.CONTACT_INBOX ?? process.env.RESEND_REPLY_TO ?? null;
  if (!inbox) {
    return NextResponse.json(
      { error: "Server nije konfigurisan za kontakt poruke." },
      { status: 500 },
    );
  }

  const subject = `[BIF.TV contact · ${topic}] ${name}`;
  const html = `
    <p><strong>From:</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
    <p><strong>Topic:</strong> ${escapeHtml(topic)}</p>
    <hr>
    <pre style="font-family: inherit; white-space: pre-wrap;">${escapeHtml(message)}</pre>
  `;
  const text = `From: ${name} <${email}>\nTopic: ${topic}\n\n${message}`;

  const res = await sendEmail({
    to: inbox,
    replyTo: email,
    subject,
    html,
    text,
    tags: [
      { name: "type", value: "contact_form" },
      { name: "topic", value: topic },
    ],
  });
  if (!res.ok) {
    console.error("[contact] send failed:", res.error);
    return NextResponse.json(
      { error: "Slanje poruke nije uspelo." },
      { status: 500 },
    );
  }
  return NextResponse.json({ ok: true });
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}
