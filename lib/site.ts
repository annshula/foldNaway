/**
 * Single source of truth for anything a marketer might want to change without
 * touching a component. Swap the numbers here, not in the JSX.
 */

export const site = {
  name: "FoldNAway",
  legalName: "FoldNAway",
  tagline: "Folds to nothing. Carries everything.",
  domain: "foldnaway.com",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.foldnaway.com",
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
    // return, so no copy anywhere may imply one.
    returns: "Free fix for damaged, missing, or wrong items",
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
