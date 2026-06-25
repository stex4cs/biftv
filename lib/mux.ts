import Mux from "@mux/mux-node";

/**
 * Server-only Mux client. Uses MUX_TOKEN_ID + MUX_TOKEN_SECRET.
 * Never instantiate this from client code.
 */
let cached: Mux | null = null;

export function mux(): Mux {
  if (cached) return cached;
  const tokenId = process.env.MUX_TOKEN_ID;
  const tokenSecret = process.env.MUX_TOKEN_SECRET;
  if (!tokenId || !tokenSecret) {
    throw new Error("Missing MUX_TOKEN_ID or MUX_TOKEN_SECRET");
  }
  cached = new Mux({ tokenId, tokenSecret });
  return cached;
}
