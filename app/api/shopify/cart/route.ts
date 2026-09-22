import { NextRequest, NextResponse } from "next/server";

import { getVariantById } from "@/lib/catalog";
import { isStorefrontConfigured, shopifyConfig } from "@/lib/shopify/config";
import { createCart } from "@/lib/shopify/storefront";
import type { CartAttributeInput } from "@/lib/shopify/types";

/** Cart attribute keys the `orders/paid` webhook reads back out of
 *  note_attributes — keep these two files in sync (see that route's
 *  AD_IDENTITY_ATTRIBUTE_KEYS-equivalent parsing). Namespaced so they never
 *  collide with an attribute a checkout extension or another app sets. */
const AD_IDENTITY_KEYS = {
  fbp: "foldnaway_fbp",
  fbc: "foldnaway_fbc",
  externalId: "foldnaway_external_id",
} as const;

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type CartLine = { variantId?: string; qty?: number };
type CartRequestBody = {
  lines?: CartLine[];
  country?: string;
  /** fbp/fbc/external_id from lib/ad-identity.ts — see createCart's doc
   *  comment for why these ride on the order instead of being read later. */
  adIdentity?: { fbp?: string | null; fbc?: string | null; externalId?: string | null };
};

/**
 * Builds a Shopify Storefront cart from the current bag lines and returns the
 * hosted checkout URL. The client navigates to it — Shopify owns the rest of
 * the purchase flow.
 */
export async function POST(request: NextRequest) {
  if (!isStorefrontConfigured()) {
    return NextResponse.json(
      { ok: false, error: "Shopify checkout is not connected yet." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(
    () => null,
  )) as CartRequestBody | null;
  const lines = Array.isArray(body?.lines) ? body.lines : [];
  // Only ever the 2-letter ISO code LocalizationProvider already resolved
  // client-side (see lib/localization/country.ts) — never trusted beyond
  // shape-checking, since it only selects which market Shopify prices the
  // cart in, nothing security-sensitive.
  const country =
    typeof body?.country === "string" && /^[A-Za-z]{2}$/.test(body.country)
      ? body.country.toUpperCase()
      : null;
  if (lines.length === 0) {
    return NextResponse.json(
      { ok: false, error: "Your bag is empty." },
      { status: 400 },
    );
  }

  const cartLines = lines
    .map((line) => {
      if (!line.variantId) return null;
      const variant = getVariantById(line.variantId);
      if (!variant || !variant.availableForSale) return null;
      const qty = Math.max(1, Math.min(Number(line.qty) || 1, 20));
      return { merchandiseId: variant.id, quantity: qty };
    })
    .filter(
      (l): l is { merchandiseId: string; quantity: number } => l !== null,
    );

  if (cartLines.length === 0) {
    return NextResponse.json(
      {
        ok: false,
        error: "We could not match the items in your bag to the store.",
      },
      { status: 400 },
    );
  }

  const attributes: CartAttributeInput[] = [];
  const identity = body?.adIdentity;
  if (typeof identity?.fbp === "string" && identity.fbp) {
    attributes.push({ key: AD_IDENTITY_KEYS.fbp, value: identity.fbp });
  }
  if (typeof identity?.fbc === "string" && identity.fbc) {
    attributes.push({ key: AD_IDENTITY_KEYS.fbc, value: identity.fbc });
  }
  if (typeof identity?.externalId === "string" && identity.externalId) {
    attributes.push({
      key: AD_IDENTITY_KEYS.externalId,
      value: identity.externalId,
    });
  }

  try {
    const cart = await createCart(cartLines, country, attributes);
    // After a successful payment Shopify redirects the shopper back here,
    // where the local bag is cleared (see /checkout/confirmation).
    const returnTo = `${shopifyConfig().siteUrl}/checkout/confirmation`;
    const checkoutUrl = new URL(cart.checkoutUrl);
    checkoutUrl.searchParams.set("return_to", returnTo);
    return NextResponse.json({
      ok: true,
      checkoutUrl: checkoutUrl.toString(),
      totalQuantity: cart.totalQuantity,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "We could not create your checkout.",
      },
      { status: 500 },
    );
  }
}
