/**
 * Quick answers — the AEO (answer-engine optimization) layer.
 *
 * These are short, self-contained question/answer pairs written to be lifted
 * whole by an answer engine (ChatGPT, Perplexity, Google AI Overviews) or a
 * featured snippet. Rules for anything added here:
 *
 *  1. The answer must lead with the answer, in the first sentence, and be
 *     understandable with zero page context ("FoldNAway's foldable pouch
 *     bag…", not "it" or "this bag").
 *  2. 40–55 words. Long enough to be complete, short enough to be quoted.
 *  3. Only claims the Shopify product data supports. The bag is polyester
 *     fiber with reinforced seams, folds to keychain size, comes in six
 *     colourways, one per order. No dimensions, gram weight or kg load
 *     rating exists anywhere in the product data — never state one.
 *  4. Every answer here is also rendered visibly on a page. Schema.org
 *     FAQPage markup whose answer is not on the page is a guidelines
 *     violation, and answer engines discount text they cannot see.
 *
 * Rendered by <QuickAnswers>, emitted as FAQPage JSON-LD in <Schema>, and
 * included in /llms.txt, /llms-full.txt and /llms-small.txt.
 */

export type QuickAnswer = {
  q: string;
  /** The quotable answer. Leads with the answer; no page context assumed. */
  a: string;
};

export const quickAnswers: QuickAnswer[] = [
  {
    q: "What is a foldable keychain bag?",
    a: "A foldable keychain bag is a reusable shopping tote that folds into a small attached pouch you can clip to a keyring. FoldNAway's version is polyester fiber with reinforced seams: it folds to keychain size and opens into a full-size shoulder tote in seconds.",
  },
  {
    q: "How small does the FoldNAway pouch bag fold?",
    a: "The FoldNAway pouch folds along its seams into its own attached pouch, small enough to clip onto a keyring, bag strap or belt loop. Because the pouch is sewn to the bag, there is no separate cover to lose, and refolding takes a couple of seconds.",
  },
  {
    q: "What is the FoldNAway bag made of?",
    a: "The FoldNAway pouch bag is made of polyester fiber with reinforced, stitched seams and a durable weave. It is built to be folded and unfolded daily without stretching out or splitting, rather than used once like a disposable liner.",
  },
  {
    q: "How much can a foldable shopping bag hold?",
    a: "FoldNAway's pouch opens into a wide, full-capacity tote with dual handles sized for a comfortable grip by hand or over the shoulder — enough for a full grocery run. Published capacity figures are limited to what the product data supports, so no kilogram load rating is claimed.",
  },
  {
    q: "What colours does the FoldNAway bag come in?",
    a: "The FoldNAway Foldable Keychain Storage Pouch comes in six colourways: Black, Brown, Green, Khaki, Wine Red and Army Green. Every colourway uses the same reinforced polyester build, so the choice is purely cosmetic. Each order ships as one tote bag.",
  },
  {
    q: "Are foldable eco-bags worth it?",
    a: "A reusable bag only helps on the trips you actually carry one, which is why a keychain-sized fold matters more than capacity alone. A bag clipped to your keys is already with you at the checkout, so it replaces single-use bags in practice rather than in principle.",
  },
  {
    q: "How long does FoldNAway shipping take?",
    a: "FoldNAway dispatches orders within 1–3 business days, then tracked delivery typically takes 7–15 business days depending on the destination country. Shipping is free worldwide with no minimum order, and the tracking number is emailed as soon as the order ships.",
  },
  {
    q: "What is FoldNAway's return policy?",
    a: "FoldNAway replaces or refunds items that arrive damaged, missing or incorrect — send a photo within 30 days of delivery and the fix is free. This covers damage, missing items and mis-ships specifically; it is not a general change-of-mind return policy.",
  },
];

/** Small helper so every surface formats these identically. */
export function answersAsMarkdown(): string {
  return quickAnswers.map((a) => `**${a.q}**\n${a.a}`).join("\n\n");
}
