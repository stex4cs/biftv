/**
 * Cookie consent state. Stored in localStorage so it persists across sessions
 * without sending any cookie to the server (consent != tracking).
 *
 * Anything marketing/analytics-related (Meta Pixel, GA, ad SDKs) must check
 * hasConsent("analytics") / hasConsent("marketing") before loading.
 */

export type ConsentCategory = "necessary" | "analytics" | "marketing";

export type ConsentState = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  decidedAt: string;
};

const STORAGE_KEY = "biftv_consent";
const EVENT_NAME = "biftv:consent-changed";

export function getConsent(): ConsentState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

export function setConsent(opts: { analytics: boolean; marketing: boolean }) {
  if (typeof window === "undefined") return;
  const next: ConsentState = {
    necessary: true,
    analytics: opts.analytics,
    marketing: opts.marketing,
    decidedAt: new Date().toISOString(),
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: next }));
}

export function hasConsent(category: ConsentCategory): boolean {
  if (category === "necessary") return true;
  const c = getConsent();
  return !!c && c[category];
}

export function onConsentChanged(cb: (state: ConsentState) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<ConsentState>).detail;
    cb(detail);
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
