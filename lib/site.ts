/**
 * Single source of truth for anything a marketer might want to change without
 * touching a component. Swap the numbers here, not in the JSX.
 */

export const site = {
  name: "FoldNAway",
  legalName: "FoldNAway",
  tagline: "Folds to nothing. Carries everything.",
  domain: "foldnaway.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.foldnaway.shop",
  email: "support@foldnaway.com",
  address: "Toronto, Ontario, Canada",
  // ⚠️ "50 lbs" repeats the unverified weight-capacity claim flagged in
  // content/copy.ts's productBenefits — no kg/lb spec exists in the Shopify
  // product data. Confirm with real load testing before this ships live.
  description:
    "A premium, keychain-sized carry system that holds up to 50 lbs and opens into a full-size tote in two seconds. Free tracked worldwide shipping.",
  locale: "en_US",
  currency: "USD",

  socials: {
    instagram: "https://www.instagram.com/foldnaway",
    tiktok: "https://tiktok.com/@foldnaway",
    facebook: "https://facebook.com/foldnaway",
    youtube: "https://youtube.com/@foldnaway",
  },

  /**
   * ⚠️ PLACEHOLDER SOCIAL PROOF — replace with figures you can evidence
   * before going live. Fabricated ratings are an FTC problem and Google
   * strips rich results for unverifiable review markup. Nothing in this
   * object is emitted as schema.org markup while `verified` is false.
   */
  metrics: {
    verified: false,
    rating: 4.8,
    reviewCount: 1240,
    bagsFolded: 28000,
    countries: 34,
  },

  promise: {
    shipping: "Free tracked shipping worldwide",
    shippingDetail: "Dispatched in 1–3 business days",
    shippingFull:
      "Orders are processed within 1–3 business days, then tracked delivery typically takes 7–15 business days depending on where you are.",
    // Accurate scope: the supplier's dispute process backs damaged, missing
    // and wrong-item claims only — there is no general change-of-mind
    // return, so no copy anywhere may imply one. "Free 30-day replacement"
    // surfaces the real 30-day window (see returnsDetail) without implying
    // a broader send-it-back-for-any-reason policy.
    returns: "Free 30-day replacement",
    returnsDetail:
      "Send a photo within 30 days of delivery and we'll ship a free replacement or refund. This covers damage, missing items and mis-ships, not general change-of-mind returns.",
    // No kilogram load rating exists in the Shopify product data — do not
    // add one here without a spec sheet to cite. See lib/product.ts's claim
    // policy note.
    capacity: "Full-size tote open, keyring-sized folded",
    support: "Instant human replies",
  },
} as const;

export type Site = typeof site;

/**
 * Pack tiers — "buy more, save more". Every tier checks out as the SAME
 * Shopify variant at a higher cart-line quantity, never a separate
 * product/SKU: the supplier fulfils it as N physical units of the one mapped
 * SKU, so packs never need a new product connection. The % discount is
 * applied at Shopify checkout by an automatic quantity-break discount
 * configured in Shopify Admin (see docs/shopify-pack-discount-setup.md) —
 * this file only mirrors those thresholds so the price shown on the page
 * matches what checkout actually charges. Change a number here and the
 * Shopify automatic discount, together, or the two drift apart.
 */
export type PackTier = {
  size: 1 | 2 | 3;
  /** Off the per-unit price, applied to the whole line — must match the Shopify automatic discount's percentage for this quantity break. */
  discountPercent: number;
  label: string;
  /** Marketing framing shown under the label. */
  blurb: string;
  badge?: string;
  featured?: boolean;
};

export const packTiers: PackTier[] = [
  {
    size: 1,
    discountPercent: 0,
    label: "1 Pack",
    blurb: "Try it out",
  },
  {
    size: 2,
    discountPercent: 20,
    label: "2 Pack",
    blurb: "One for you, one to share",
    badge: "Most popular",
    featured: true,
  },
  {
    size: 3,
    discountPercent: 40,
    label: "3 Pack",
    blurb: "Stock up and save the most",
    badge: "Best value",
  },
] as const;

export const defaultPackSize: PackTier["size"] = 1;

/**
 * The tier a given pack size resolves to. Any size outside 1/2/3 (e.g. a
 * quantity typed past 3 in the cart drawer) falls back to the 3-pack's
 * discount — the highest tier reached, rather than dropping back to full
 * price, since buying 4+ is strictly "more" than the 3-pack, never less.
 */
export const getPackTier = (qty: number): PackTier =>
  packTiers.find((t) => t.size === qty) ?? packTiers[packTiers.length - 1];

/**
 * Display-only: the tile a cart line's badge/label should match once qty
 * exceeds 3 — always the 3-pack's tile, so a manual qty edit to 4, 5, 6…
 * still reads as "Best value" instead of losing its badge past exactly 3.
 * Pricing (`getPackTier`/`applyPackDiscount`) is untouched by this.
 */
export const getDisplayPackTier = (qty: number): PackTier =>
  qty >= 3 ? packTiers[2] : getPackTier(qty);

/**
 * The one place pack-discount math happens. Every UI surface (PackPicker,
 * BuyBox, CartDrawer) calls this instead of re-deriving
 * `amount * (1 - discountPercent / 100)` locally — one formula, one rounding
 * rule, so the PDP tile and the cart-drawer line can never round to
 * different cents for the same tier. `unitAmountCents` is the base per-unit
 * price in integer cents (matches CartProvider's ResolvedLine).
 */
export function applyPackDiscount(
  unitAmountCents: number,
  qty: number,
): { unitPriceCents: number; lineTotalCents: number } {
  const tier = getPackTier(qty);
  const lineTotalCents = Math.round(
    unitAmountCents * qty * (1 - tier.discountPercent / 100),
  );
  return {
    unitPriceCents: Math.round(lineTotalCents / qty),
    lineTotalCents,
  };
}
