/**
 * Client helper for kicking off a Shopify-hosted checkout from the current
 * bag. The actual Storefront cart is created server-side (no tokens in the
 * browser); this only calls the API route and navigates to the checkout URL.
 *
 * Fires `InitiateCheckout`/`begin_checkout` itself, once, right here — every
 * caller (BuyBox's "Buy it now", the cart drawer, /checkout's "Pay now") goes
 * through this one function, so the event can never be missed at a call site
 * or double-fired by two of them tracking the same checkout separately.
 */

import { getExternalId, getFacebookBrowserIds } from "@/lib/ad-identity";
import { resolveCartLine } from "@/lib/cart-catalog";
import { trackInitiateCheckout } from "@/lib/analytics";

export type ShopifyCheckoutResult =
  | { ok: true; checkoutUrl: string }
  | { ok: false; error: string };

export async function shopifyCheckout(
  lines: Array<{ variantId: string; qty: number; priceCents?: number }>,
  currency = "USD",
  // The shopper's resolved market (LocalizationProvider's `country`, ISO-2)
  // — forwarded so the API route can create the Shopify cart with the same
  // @inContext(country:) the page's own price came from. Without this the
  // cart prices in Shopify's default market, which can be a different
  // currency entirely than what the pack price on screen just showed
  // (e.g. INR on the page, USD at checkout).
  country?: string | null,
): Promise<ShopifyCheckoutResult> {
  try {
    // Read at checkout time (not earlier) so the freshest _fbp/_fbc cookie
    // values ride on this order — Meta's own guidance calls these "subject
    // to change" and recommends refreshing rather than caching them.
    const { fbp, fbc } = getFacebookBrowserIds();
    const externalId = getExternalId();

    const res = await fetch("/api/shopify/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lines: lines.map(({ variantId, qty }) => ({ variantId, qty })),
        country: country ?? undefined,
        adIdentity: { fbp, fbc, externalId },
      }),
    });
    const data = (await res.json()) as {
      ok?: boolean;
      checkoutUrl?: string;
      error?: string;
    };
    if (data.ok && data.checkoutUrl) {
      const items = lines
        .map((line) => {
          const catalog = resolveCartLine(line.variantId);
          if (!catalog) return null;
          return {
            slug: line.variantId,
            name: catalog.name,
            priceCents: line.priceCents ?? catalog.unitPriceCents,
            quantity: line.qty,
          };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);
      if (items.length > 0) {
        trackInitiateCheckout(items, currency);
      }
      return { ok: true, checkoutUrl: data.checkoutUrl };
    }
    return { ok: false, error: data.error ?? "We could not start checkout." };
  } catch {
    return { ok: false, error: "We could not reach checkout right now." };
  }
}
