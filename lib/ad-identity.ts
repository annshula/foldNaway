"use client";

/**
 * Ad-platform identity signals gathered client-side and threaded through
 * Shopify checkout as cart attributes, so the `orders/paid` webhook can
 * still see them when it builds the Meta Conversions API `Purchase` event.
 *
 * Why this exists at all: this storefront is headless and checkout is
 * Shopify's own hosted domain, so the shopper's browser never returns to a
 * page this app controls after paying — the webhook is a server-to-server
 * call with no cookies of its own. Meta's Conversions API best practices
 * name `fbp`/`fbc`/`external_id` as the parameters that most improve Event
 * Match Quality for exactly this "server-only, no post-purchase page"
 * shape, so they're captured here, at the one moment (checkout start) where
 * the browser and the order can still be linked, and carried on the order
 * as note attributes (Shopify's `cartCreate` `attributes` input) rather than
 * lost the moment the shopper leaves for Shopify's domain.
 */

const EXTERNAL_ID_KEY = "foldnaway_external_id";

function readCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(
    new RegExp(`(?:^|; )${name}=([^;]*)`),
  );
  return match ? decodeURIComponent(match[1]) : null;
}

/** Meta's own browser-set cookies — present once the Pixel has loaded and
 *  fired at least one event. Never hashed (Meta's spec sends these raw). */
export function getFacebookBrowserIds(): { fbp: string | null; fbc: string | null } {
  return {
    fbp: readCookie("_fbp"),
    fbc: readCookie("_fbc"),
  };
}

/**
 * A stable per-browser id, generated once and persisted in localStorage —
 * this is the `external_id` sent to Meta/TikTok. Not tied to a real account
 * (this store has no login-gated checkout), so it's a random id, not a
 * customer id; Meta's docs accept any stable advertiser-chosen identifier
 * here, hashing it is recommended but its main job is linking the same
 * browser's ViewContent → AddToCart → Purchase into one match, not carrying
 * PII, so no hashing is needed for a random UUID with no personal meaning.
 */
export function getExternalId(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const existing = window.localStorage.getItem(EXTERNAL_ID_KEY);
    if (existing) return existing;
    const fresh = crypto.randomUUID();
    window.localStorage.setItem(EXTERNAL_ID_KEY, fresh);
    return fresh;
  } catch {
    // Private browsing / storage blocked — degrade to no external_id rather
    // than crash checkout over an analytics nicety.
    return null;
  }
}
