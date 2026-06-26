import { ImageResponse } from "next/og";
import { supabaseAdmin } from "@/lib/supabase-server";

export const runtime = "nodejs";
export const alt = "BIF event";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OG({ params }: { params: { slug: string } }) {
  const supabase = supabaseAdmin();
  const { data: event } = await supabase
    .from("events")
    .select("title, subtitle, status, date, venue_city, poster_url")
    .eq("slug", params.slug)
    .maybeSingle();

  const title = event?.title ?? "BIF Event";
  const subtitle = event?.subtitle ?? "Balkan Influence Fighting";
  const status = (event?.status as string) ?? "upcoming";
  const venueCity = event?.venue_city ?? "Beograd";
  const date = event?.date ? new Date(event.date) : null;
  const poster = event?.poster_url ?? null;

  const dateLabel = date
    ? `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
    : "";

  const statusLabel =
    status === "live"
      ? "● LIVE NOW"
      : status === "vod"
        ? "REPLAY AVAILABLE"
        : status === "ended"
          ? "ENDED"
          : "UPCOMING";

  const statusColor =
    status === "live"
      ? "#ff3344"
      : status === "vod"
        ? "#ffd700"
        : "#c41e3a";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#000",
          display: "flex",
          position: "relative",
        }}
      >
        {poster ? (
          // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
          <img
            src={poster}
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: 0.55,
            }}
          />
        ) : null}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.85) 100%)",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: "linear-gradient(90deg, #c41e3a, #ffd700, #c41e3a)",
          }}
        />
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 56,
            width: "100%",
            height: "100%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 6,
                color: "#c41e3a",
                textTransform: "uppercase",
              }}
            >
              BIF.TV
            </div>
            <div
              style={{
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 4,
                color: statusColor,
                textTransform: "uppercase",
                border: `2px solid ${statusColor}`,
                padding: "8px 20px",
                borderRadius: 999,
              }}
            >
              {statusLabel}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                fontSize: 96,
                fontWeight: 900,
                color: "#ffffff",
                textTransform: "uppercase",
                letterSpacing: 2,
                lineHeight: 1,
                textShadow: "0 4px 30px rgba(0,0,0,0.8)",
              }}
            >
              {title}
            </div>
            {subtitle ? (
              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  color: "#ffd700",
                  marginTop: 16,
                  textShadow: "0 2px 10px rgba(0,0,0,0.8)",
                }}
              >
                {subtitle}
              </div>
            ) : null}
            <div
              style={{
                display: "flex",
                gap: 32,
                marginTop: 24,
                color: "rgba(255,255,255,0.8)",
                fontSize: 22,
                letterSpacing: 2,
                textTransform: "uppercase",
              }}
            >
              {dateLabel ? <span>📅 {dateLabel}</span> : null}
              <span>📍 {venueCity}</span>
            </div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
