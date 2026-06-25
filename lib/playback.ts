import jwt from "jsonwebtoken";

/**
 * Sign a Mux playback URL with the signing key.
 * Returns a JWT to append as `?token=...` on stream.mux.com URLs.
 *
 * Token aud values: "v" (video), "t" (thumbnail), "g" (GIF), "s" (storyboard).
 * Default is "v" for HLS playback.
 */
export type PlaybackTokenAud = "v" | "t" | "g" | "s";

export function signMuxPlaybackToken(opts: {
  playbackId: string;
  aud?: PlaybackTokenAud;
  expSeconds?: number;
  params?: Record<string, string | number | boolean>;
}): string {
  const keyId = process.env.MUX_SIGNING_KEY_ID;
  const keyB64 = process.env.MUX_SIGNING_KEY_PRIVATE;
  if (!keyId || !keyB64) {
    throw new Error(
      "Missing MUX_SIGNING_KEY_ID or MUX_SIGNING_KEY_PRIVATE",
    );
  }
  const privateKey = Buffer.from(keyB64, "base64").toString("utf8");

  const aud = opts.aud ?? "v";
  const exp =
    Math.floor(Date.now() / 1000) + (opts.expSeconds ?? 60 * 60 * 6);

  return jwt.sign(
    {
      sub: opts.playbackId,
      aud,
      exp,
      kid: keyId,
      ...(opts.params ?? {}),
    },
    privateKey,
    { algorithm: "RS256", keyid: keyId },
  );
}

/**
 * Returns full signed HLS playback URL for a given playback ID.
 */
export function signedHlsUrl(opts: {
  playbackId: string;
  expSeconds?: number;
}): string {
  const token = signMuxPlaybackToken({
    playbackId: opts.playbackId,
    aud: "v",
    expSeconds: opts.expSeconds,
  });
  return `https://stream.mux.com/${opts.playbackId}.m3u8?token=${token}`;
}

/**
 * Returns signed token for thumbnail/storyboard requests (mux-player needs them).
 */
export function signedPlaybackTokens(opts: {
  playbackId: string;
  expSeconds?: number;
}) {
  const exp = opts.expSeconds ?? 60 * 60 * 6;
  return {
    playback: signMuxPlaybackToken({
      playbackId: opts.playbackId,
      aud: "v",
      expSeconds: exp,
    }),
    thumbnail: signMuxPlaybackToken({
      playbackId: opts.playbackId,
      aud: "t",
      expSeconds: exp,
    }),
    storyboard: signMuxPlaybackToken({
      playbackId: opts.playbackId,
      aud: "s",
      expSeconds: exp,
    }),
  };
}
