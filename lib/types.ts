/**
 * Shared type definitions for BIF.TV
 */

export type EventStatus = "upcoming" | "live" | "ended" | "vod";

export type Fight = {
  id: string;
  order: number;
  startTimeHint?: string; // e.g. "20:00"
  fighter1: string;
  fighter2: string; // for handicap: "Riđi, Ćure & Loki"
  isHandicap?: boolean;
  matchType?: "main" | "co-main" | "standard";
  rounds: number;
  roundDuration: string; // e.g. "2 min"
  breakDuration?: string;
  // Result (only set after fight is over)
  result?: {
    winner: string;
    method: "TKO" | "KO" | "UD" | "SD" | "MD" | "SUB" | "DQ" | "DRAW";
  };
};

export type EventPrices = {
  livePass: number; // €
  vodPass?: number; // €
  bundlePass?: number; // both
  currency: "EUR" | "USD" | "RSD";
};

export type EventBase = {
  id: string;
  slug: string;
  title: string;
  subtitle?: string;
  sponsorLine?: string; // "Powered by Oktagonbet"
  posterUrl: string;
  trailerVideoUrl?: string;
  date: string; // ISO
  doorsOpen?: string; // "19:00"
  mainEventTime?: string; // "22:00"
  venue: string;
  venueCity: string;
  description: string;
  fights: Fight[];
  prices: EventPrices;
  status: EventStatus;
  muxLiveStreamId?: string;
  muxPlaybackId?: string;
  vodAvailableAt?: string; // ISO date when VOD ready
};

export type Purchase = {
  id: string;
  userEmail: string;
  eventId: string;
  amount: number;
  currency: string;
  stripePaymentIntentId: string;
  passType: "live" | "vod" | "bundle";
  status: "pending" | "succeeded" | "refunded" | "failed";
  purchasedAt: string;
};

export type AccessToken = {
  token: string;
  userEmail: string;
  eventId: string;
  passType: "live" | "vod" | "bundle";
  createdAt: string;
  expiresAt: string;
  activeDeviceId?: string;
  lastHeartbeatAt?: string;
};
