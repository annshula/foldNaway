/**
 * Every word of homepage marketing copy, in one file.
 *
 * Section order mirrors the structural reference (accupenpro.com): hero →
 * what-it-is → benefits → where-it-goes → problem/solution → trust bar →
 * details → lifestyle → how-it-works → comparison → in-the-box →
 * testimonials → FAQ → final CTA. Content is FoldNAway's own.
 *
 * Copy rule for this brand: short blocks, concrete numbers, no paragraphs
 * over ~30 words. If a line needs a comma splice to survive, cut it in two.
 */

export const hero = {
  eyebrow: "Foldable eco-bag",
  headline: ["Folds to nothing.", "Carries everything."],
  sub: "A large-capacity shoulder tote that packs down to your keyring. Unfold it in two seconds at the counter, the car, the market.",
  cta: "Shop the pouch",
  ctaHref: "/shop",
  secondary: "See how it folds",
  secondaryHref: "#how-it-works",
  promise: ["Free tracked shipping", "Folds to keyring size", "Six colourways"],
};

export const whatItIs = {
  eyebrow: "What it is",
  title: "One pouch. Two seconds. A full-size bag.",
  body: "The Foldable Keychain Storage Pouch is a polyester-canvas shoulder tote that lives folded in its own pouch, clipped to your keys.",
  points: [
    "Folds into its own built-in pouch — nothing to lose",
    "Carabiner clip for keys, belt loop or backpack strap",
    "Polyester canvas with reinforced seams",
    "Dual handles: hand-carry or over the shoulder",
    "Six colourways, same build underneath",
    "Weighs less than a set of keys",
  ],
};

export const benefits = {
  eyebrow: "Why people carry one",
  title: "The bag you actually have on you.",
  body: "A tote in a drawer is not a tote. This one is already on your keys.",
  items: [
    {
      label: "Grocery runs",
      body: "Skip the checkout bag charge. Unfold, load, go.",
    },
    {
      label: "Travel & overflow",
      body: "Flat in your case until the trip home needs one more bag.",
    },
    {
      label: "Market & farm stands",
      body: "Wide base sits upright. Produce doesn't tumble.",
    },
    {
      label: "Gym & beach",
      body: "Shake it out, fold it away, clip it back on.",
    },
    {
      label: "Car boot kit",
      body: "Keep two clipped in the glovebox for unplanned stops.",
    },
    {
      label: "Everyday overflow",
      body: "For the days your tote was the wrong size.",
    },
  ],
};

export const whereItGoes = {
  eyebrow: "Where it goes",
  title: "Clipped on, out of the way.",
  places: [
    { label: "On your keys", body: "Carabiner clip, pocket-sized folded." },
    { label: "In the glovebox", body: "Two of them take no real space." },
    { label: "In a backpack", body: "Flat against the back panel." },
    { label: "On a stroller", body: "Clips to the handle bar." },
  ],
};

export const problemSolution = {
  eyebrow: "The honest comparison",
  title: "Why the bag you own isn't working.",
  scenarios: [
    {
      problem: "Canvas totes stay at home.",
      solution: "Too bulky to carry on the chance you'll need one. This one clips to your keys, so it's never a decision.",
    },
    {
      problem: "Store-bought plastic bags split.",
      solution: "Polyester canvas with reinforced seams carries a full shop without a sound. You stop buying bags at the till.",
    },
    {
      problem: "Foldable bags never re-fold.",
      solution: "The pouch is sewn to the bag. Stuff it back in, pull the cord, clip it on. Two seconds, no origami.",
    },
  ],
};

export const trustBar = [
  { label: "Free tracked shipping", detail: "Worldwide, no minimum" },
  { label: "Free fix", detail: "Damaged, missing or wrong items" },
  { label: "Replies in 12h", detail: "A person, not a bot" },
];

/**
 * Six customer-facing benefits, shown as image + text cards on the product
 * page between the trust bar and "Why it works" (components/product/
 * ProductBenefitCards.tsx). `icon` keys into components/ui/Icons.tsx and
 * doubles as the placeholder art's watermark until real product photography
 * replaces it.
 */
export const productBenefits = {
  eyebrow: "Made for real life",
  title: "Six reasons it earns a spot on your keys.",
  items: [
    {
      tag: "Never caught out",
      icon: "clip",
      headline: "No more paying for a bag you didn't want.",
      body: "Forgetting a bag at the store means juggling items by hand or paying for plastic at the till. Clip this to your keys and it's already there.",
    },
    {
      tag: "Deceptively roomy",
      icon: "fold",
      headline: "Fits in your palm. Holds a full grocery run.",
      body: "Small enough to close a fist around folded — unfolds into a full-size tote in two seconds, no assembly.",
    },
    {
      tag: "Plastic-free by default",
      icon: "leaf",
      headline: "Skip the bag ban scramble entirely.",
      body: "A practical, guilt-free swap for shoppers who want convenience, not a lecture — always on hand, no plastic bag needed.",
    },
    {
      tag: "One bag, every trip",
      icon: "bag",
      headline: "Groceries. Gym clothes. Beach day. Same bag.",
      body: "One pouch, used across every scenario — not a single-purpose item you buy once and forget in a drawer.",
    },
    {
      tag: "Actually useful gift",
      icon: "check",
      headline: "The stocking stuffer that actually gets used.",
      body: "Inexpensive, useful for anyone, comes in six colours — the rare gift that doesn't sit in a drawer after the holidays.",
    },
    {
      tag: "Looks pricier than it is",
      icon: "shield",
      headline: "Reads as designer. Priced like an everyday bag.",
      body: "Modern, minimalist build that looks premium next to totes several times the price — without the markup.",
    },
  ],
} as const;

export const details = {
  eyebrow: "The details",
  title: "Built to be abused, quietly.",
  body: "Every choice here is about one thing: surviving being crushed into a pocket a thousand times.",
  cards: [
    {
      label: "Polyester canvas",
      body: "A durable weave built for hundreds of unfold cycles, not one.",
    },
    {
      label: "Bar-tacked handles",
      body: "The stitch that fails first on cheap totes, reinforced.",
    },
    {
      label: "Sewn-in pouch",
      body: "Attached, not separate. There is nothing to misplace.",
    },
  ],
  /**
   * These mirror the six `custom.specs` metaobjects already set on the
   * Shopify product (material-pouch, fold-size, capacity, colors-pouch,
   * construction, best-use) — the product page renders the live Shopify
   * ones, and this copy is the homepage's static echo of them.
   *
   * ⚠️ Do not add a dimension, gram weight or kg load rating here: none are
   * in the product data. If those get measured, add them as `custom.specs`
   * metaobjects in Shopify Admin so the merchant owns them, then mirror.
   */
  specs: [
    { label: "Material", value: "Polyester fiber" },
    { label: "Folded size", value: "Keychain-portable" },
    { label: "Capacity", value: "Full-size tote when open" },
    { label: "Colors", value: "Six colourways" },
    { label: "Construction", value: "Reinforced seams" },
    { label: "Best for", value: "Shopping, errands, gym, travel" },
  ],
};

export const howItWorks = {
  eyebrow: "How it folds",
  title: "Two seconds, both directions.",
  steps: [
    { step: "01", label: "Unclip", body: "Pull the pouch off your keyring." },
    { step: "02", label: "Shake out", body: "The bag falls open on its own." },
    { step: "03", label: "Load it", body: "Opens to a full-size tote." },
    { step: "04", label: "Stuff & clip", body: "Push it back in the pouch, clip on." },
  ],
};

export const comparison = {
  eyebrow: "Side by side",
  title: "Against what you're using now.",
  columns: ["FoldNAway", "Canvas tote", "Store plastic bag"],
  rows: [
    { feature: "Always with you", values: [true, false, false] },
    { feature: "Carries a full shop", values: [true, true, false] },
    { feature: "Folds to keyring size", values: [true, false, false] },
    { feature: "Re-folds in seconds", values: [true, false, false] },
    { feature: "Reusable for years", values: [true, true, false] },
    { feature: "Costs nothing per use", values: [true, true, false] },
  ],
};

export const inTheBox = {
  eyebrow: "In the order",
  title: "What arrives.",
  items: [
    { label: "The pouch bag", body: "Folded, in its own sewn-in pouch." },
    { label: "Carabiner clip", body: "Pre-attached, rated for keys." },
    { label: "Six colourways", body: "Black, Brown, Green, Khaki, Wine Red, Army Green." },
    { label: "Tracked shipping", body: "Number emailed on dispatch." },
  ],
};

/*
 * Testimonials live in data/reviews.ts, not here — the homepage
 * <Testimonials> section renders the newest entries from that same dataset
 * so the homepage and the product page can never quote different numbers.
 */

export const faq = [
  {
    q: "How much can it actually hold?",
    a: "It opens into a full-size tote with dual handles sized for hand or shoulder carry — comfortably a whole grocery run.",
  },
  {
    q: "Will it re-fold as small as it arrived?",
    a: "Yes. The pouch is sewn to the bag, so you stuff the bag in, pull the drawcord and clip it back on. No folding pattern to remember.",
  },
  {
    q: "What is it made of?",
    a: "Polyester fiber with reinforced seams and a durable weave — built to be folded and unfolded daily without stretching out or splitting.",
  },
  {
    q: "How many bags come in an order?",
    a: "One tote bag per order. Choose your colourway on the product page — all six are the same reinforced build underneath.",
  },
  {
    q: "How long does shipping take?",
    a: "Dispatch is 1–3 business days, then tracked delivery is typically 7–15 business days depending on your country. You get the tracking number by email.",
  },
  {
    q: "What if it arrives damaged or wrong?",
    a: "Send a photo within 30 days and we'll ship a free replacement or refund you. This covers damage, missing items and mis-ships — it isn't a general change-of-mind return.",
  },
  {
    q: "Does the clip hold on a keyring?",
    a: "Yes, the carabiner comes pre-attached and is rated for keys. It also fits a belt loop, backpack strap or stroller handle.",
  },
  {
    q: "What colours are there?",
    a: "Whatever is currently in stock shows on the product page — colourways come straight from our Shopify inventory, so what you see is what's available.",
  },
];

export const finalCta = {
  eyebrow: "Ready",
  title: "Stop deciding whether to bring a bag.",
  body: "Clip one on your keys. Forget about it until you need it.",
  cta: "Shop the pouch",
  ctaHref: "/shop",
};
