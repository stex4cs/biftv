import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "BIF.TV — Balkan Influence Fighting";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg, #1a0a0c 0%, #0a0a0a 100%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
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
            fontSize: 28,
            fontWeight: 800,
            letterSpacing: 8,
            color: "#c41e3a",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          BIF.TV
        </div>
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            color: "#ffffff",
            textTransform: "uppercase",
            letterSpacing: 4,
            lineHeight: 1,
            textAlign: "center",
          }}
        >
          Balkan
        </div>
        <div
          style={{
            fontSize: 110,
            fontWeight: 900,
            background: "linear-gradient(90deg, #ffffff, #c41e3a)",
            backgroundClip: "text",
            color: "transparent",
            textTransform: "uppercase",
            letterSpacing: 4,
            lineHeight: 1,
          }}
        >
          Influence Fighting
        </div>
        <div
          style={{
            fontSize: 28,
            color: "rgba(255,255,255,0.7)",
            marginTop: 32,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Live Stream · Replay · PPV
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 32,
            fontSize: 22,
            color: "#ffd700",
            letterSpacing: 4,
            textTransform: "uppercase",
            fontWeight: 700,
          }}
        >
          biftv.vercel.app
        </div>
      </div>
    ),
    { ...size },
  );
}
