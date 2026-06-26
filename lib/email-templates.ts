/**
 * Inline-styled email templates. We avoid external CSS because most email
 * clients (Gmail, Outlook, Apple Mail) strip <style> tags or apply them
 * inconsistently. Hex colors match the BIF brand.
 */

const BRAND_RED = "#c41e3a";
const BRAND_GOLD = "#ffd700";
const BG_DARK = "#0a0a0a";
const BG_PANEL = "#161616";
const TEXT = "#ffffff";
const MUTED = "#a0a0a0";

function shell(opts: {
  preheader?: string;
  body: string;
}): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>BIF.TV</title>
</head>
<body style="margin:0;padding:0;background:${BG_DARK};color:${TEXT};font-family:Helvetica,Arial,sans-serif;">
${opts.preheader ? `<div style="display:none;max-height:0;overflow:hidden;color:${BG_DARK};">${opts.preheader}</div>` : ""}
<table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background:${BG_DARK};padding:24px 0;">
  <tr>
    <td align="center">
      <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="560" style="max-width:560px;width:100%;">
        <tr>
          <td align="center" style="padding:12px 0 32px 0;">
            <div style="font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:800;font-size:13px;letter-spacing:3px;color:${BRAND_RED};text-transform:uppercase;">BIF.TV</div>
            <div style="font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:800;font-size:28px;letter-spacing:1px;color:${TEXT};text-transform:uppercase;">Balkan Influence Fighting</div>
          </td>
        </tr>
        <tr>
          <td style="background:linear-gradient(135deg,${BG_PANEL},${BG_DARK});border:1px solid #222;border-radius:16px;padding:32px;">
            ${opts.body}
          </td>
        </tr>
        <tr>
          <td align="center" style="padding:24px 0;color:${MUTED};font-size:11px;line-height:1.5;">
            Dobio si ovaj email jer si tražio pristup BIF.TV stream-u.<br>
            <a href="https://biftv.vercel.app" style="color:${BRAND_GOLD};text-decoration:none;">biftv.vercel.app</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

function button(href: string, label: string): string {
  return `<table role="presentation" cellspacing="0" cellpadding="0" border="0">
  <tr>
    <td style="background:${BRAND_RED};border-radius:10px;border:2px solid ${BRAND_GOLD}33;">
      <a href="${href}" target="_blank" style="display:inline-block;padding:14px 32px;font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:800;font-size:14px;letter-spacing:2px;color:#fff;text-transform:uppercase;text-decoration:none;">${label}</a>
    </td>
  </tr>
</table>`;
}

export function compPassEmail(opts: {
  eventTitle: string;
  watchUrl: string;
  passType: "live" | "vod" | "bundle";
  expiresAt: string;
}): { subject: string; html: string; text: string } {
  const expDate = opts.expiresAt.slice(0, 10);
  const passLabel =
    opts.passType === "live"
      ? "Live Pass"
      : opts.passType === "vod"
        ? "Replay Pass"
        : "Bundle Pass";

  const body = `
    <div style="font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:700;font-size:11px;letter-spacing:3px;color:${BRAND_RED};text-transform:uppercase;margin-bottom:8px;">
      TVOJ ${passLabel.toUpperCase()}
    </div>
    <h1 style="font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:800;font-size:30px;letter-spacing:1px;color:${TEXT};margin:0 0 16px 0;text-transform:uppercase;">
      ${escapeHtml(opts.eventTitle)}
    </h1>
    <p style="font-size:15px;line-height:1.6;color:${MUTED};margin:0 0 24px 0;">
      Pristup je aktivan do <strong style="color:${BRAND_GOLD};">${expDate}</strong>. Klikni na dugme da otvoriš stream — sačuvaj ovaj email, link radi samo na jednom uređaju istovremeno.
    </p>
    ${button(opts.watchUrl, "▶ OTVORI STREAM")}
    <p style="font-size:12px;line-height:1.5;color:${MUTED};margin:24px 0 0 0;">
      Ne radi dugme? Kopiraj ovaj link u browser:<br>
      <span style="color:${BRAND_GOLD};word-break:break-all;font-size:11px;">${opts.watchUrl}</span>
    </p>
    <hr style="border:none;border-top:1px solid #222;margin:28px 0;">
    <p style="font-size:12px;color:${MUTED};margin:0;line-height:1.6;">
      <strong style="color:${TEXT};">One device only.</strong> Kad otvoriš stream na telefonu i prebaciš se na laptop, prethodna sesija se zatvara. Replay ostaje otključan do datuma isteka.
    </p>
  `;

  return {
    subject: `Tvoj BIF.TV pristup — ${opts.eventTitle}`,
    html: shell({
      preheader: `Klikni i gledaj ${opts.eventTitle}`,
      body,
    }),
    text: `Tvoj BIF.TV ${passLabel} za ${opts.eventTitle} je aktivan.\n\nOtvori stream: ${opts.watchUrl}\n\nVažeći do ${expDate}. Radi na jednom uređaju istovremeno.`,
  };
}

export function welcomeEmail(opts: { siteUrl: string }): {
  subject: string;
  html: string;
  text: string;
} {
  const body = `
    <div style="font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:700;font-size:11px;letter-spacing:3px;color:${BRAND_RED};text-transform:uppercase;margin-bottom:8px;">
      DOBRODOŠAO U RING
    </div>
    <h1 style="font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:800;font-size:28px;color:${TEXT};margin:0 0 16px 0;text-transform:uppercase;">
      Hvala što si se prijavio
    </h1>
    <p style="font-size:15px;line-height:1.7;color:${MUTED};margin:0 0 20px 0;">
      Bićeš prvi koji saznaje datum BIF 3, kako kreće prodaja pasova i kad
      stream počinje uživo. Bez spama — samo bitne stvari.
    </p>
    ${button(opts.siteUrl, "▶ POGLEDAJ DOGAĐAJE")}
    <hr style="border:none;border-top:1px solid #222;margin:28px 0;">
    <p style="font-size:12px;color:${MUTED};margin:0;line-height:1.6;">
      Pratiš nas i ovde:<br>
      <a href="https://kick.com/bifevents" style="color:${BRAND_GOLD};text-decoration:none;">Kick</a> ·
      Instagram · YouTube
    </p>
  `;

  return {
    subject: "Dobrodošao u BIF.TV ring",
    html: shell({
      preheader: "Hvala što si se prijavio za BIF.TV najave",
      body,
    }),
    text: "Hvala što si se prijavio za BIF.TV. Bićeš prvi koji saznaje datume i kad kreće prodaja pasova.",
  };
}

export function broadcastEmail(opts: {
  subject: string;
  headline: string;
  bodyMd: string;
  ctaLabel?: string;
  ctaUrl?: string;
}): { subject: string; html: string; text: string } {
  const paragraphs = opts.bodyMd
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean)
    .map(
      (p) =>
        `<p style="font-size:15px;line-height:1.7;color:${MUTED};margin:0 0 16px 0;">${escapeHtml(p).replace(/\n/g, "<br>")}</p>`,
    )
    .join("");

  const body = `
    <div style="font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:700;font-size:11px;letter-spacing:3px;color:${BRAND_RED};text-transform:uppercase;margin-bottom:8px;">
      BIF.TV ANNOUNCEMENT
    </div>
    <h1 style="font-family:'Oswald',Helvetica,Arial,sans-serif;font-weight:800;font-size:28px;color:${TEXT};margin:0 0 16px 0;text-transform:uppercase;">
      ${escapeHtml(opts.headline)}
    </h1>
    ${paragraphs}
    ${opts.ctaLabel && opts.ctaUrl ? `<div style="margin-top:24px;">${button(opts.ctaUrl, opts.ctaLabel)}</div>` : ""}
  `;

  return {
    subject: opts.subject,
    html: shell({ preheader: opts.headline, body }),
    text: `${opts.headline}\n\n${opts.bodyMd}${opts.ctaUrl ? `\n\n${opts.ctaUrl}` : ""}`,
  };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
