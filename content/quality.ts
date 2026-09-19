/**
 * "Put to the test" — the build-quality band shown on the product page.
 *
 * These are our own in-house pre-dispatch bench checks, framed as exactly
 * that. Nothing here claims a third-party lab certification, a load rating
 * in kilograms, or any material property the Shopify product data doesn't
 * support: the product is polyester canvas with reinforced seams, and every
 * check below is about workmanship we can actually inspect by hand.
 *
 * If you add a check, it must describe something a person physically does at
 * the bench. Do not add a number you cannot evidence.
 */

export const quality = {
  eyebrow: "Put to the test",
  heading: "Checked by hand. Only the passers ship.",
  lede: "A folding bag fails in predictable places: the crease lines, the handle joins, the pouch seam. Every unit clears the same six checks on our bench before it's packed.",
  checks: [
    {
      icon: "fold" as const,
      title: "Fold & refold cycle",
      body: "Folded back into its own pouch and reopened repeatedly. We're looking for crease lines that start to whiten or split, and a pouch seam that still closes flat on the last fold as easily as the first.",
    },
    {
      icon: "weight" as const,
      title: "Loaded carry",
      body: "Filled to a heavy, real-world load and carried by hand, then over the shoulder. The base has to hold its shape without bunching, and the handles must not stretch out of true under real weight.",
    },
    {
      icon: "shield" as const,
      title: "Seam & stitch",
      body: "Every seam is run through by hand, with extra attention at the handle joins and base corners, the two places a loaded tote gives out first. Loose, skipped or puckered stitching is rejected outright.",
    },
    {
      icon: "clip" as const,
      title: "Clip & attachment",
      body: "The carabiner is clipped and unclipped on a real keyring, then left hanging with the folded pouch attached. The gate has to spring back cleanly every time and the anchor loop must not deform.",
    },
    {
      icon: "check" as const,
      title: "Colour & finish",
      body: "Each of the six colourways is compared against its reference sample in daylight. Uneven dye, a visible weave fault, or a press mark left from folding means it doesn't ship.",
    },
    {
      icon: "truck" as const,
      title: "Packed for dispatch",
      body: "Folded into its pouch, matched against the colourway on the order, then sealed. One tote per order, with the tracking number emailed the moment it leaves us.",
    },
  ],
};

export type QualityCheck = (typeof quality.checks)[number];
