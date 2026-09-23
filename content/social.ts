/**
 * Copy + presentation for the "customer posts" wall on the product page
 * (components/product/ReviewSocialPosts.tsx).
 *
 * The wall shows the same real customer photos the review feed shows
 * (data/reviews.ts → PHOTO_REVIEWS), but re-presents each one as the
 * Facebook post / Instagram post / Instagram DM it actually arrived as —
 * screenshot-faithful chrome, so the section reads as the social proof it
 * came from rather than as another grid of review cards.
 *
 * What is real here:
 *   - every photo (public/reviews/foldable-keychain-storage-pouch/),
 *   - the review text the customer wrote,
 *   - the masked name, country, star rating and colourway, and
 *   - the relative age ("2 d"), derived from the review's own timestamp.
 *
 * What is NOT real: the reaction / comment / share figures in
 * `postPresentation` below. No social platform is connected to this site, so
 * those are illustrative chrome — hand-set, deterministic, chosen to look
 * plausible rather than to claim reach this listing hasn't had. Replace them
 * with figures read off the real posts before launch, or drop the counts from
 * the card chrome (the cards still work without them).
 *
 * The Google row is the one part of the wall whose words are not ours to
 * write — see content/google-reviews.ts, which stands in for the profile's
 * own reviews until a real widget ID is configured.
 *
 * No Review / AggregateRating markup is emitted for any of this — that stays
 * gated on site.metrics.verified (see components/ProductSchema.tsx). This is
 * page UI, not structured data.
 *
 * Keys below are photo filenames, matching PHOTO_REVIEWS exactly. A photo
 * with no entry still renders (the component falls back to a rotating card
 * style) so dropping a new image into public/reviews/ can never leave a hole
 * in the wall — but add the entry to keep the mix of post types deliberate.
 */

export const customerPosts = {
  eyebrow: "Customer posts",
  title: "Straight from their camera roll.",
  body: "Their photos, their messages, and the Google rating behind them. Nothing edited on the way here.",
  /** Row labels in the customer-posts section. Not drawn: the two rails are
      labelled rows of unlabelled cards, and a heading over each one turned the
      wall into two widgets. They survive as the rails' accessible names, which
      is the one place the two rows still need telling apart (the section's own
      <h2> says what the wall is). */
  googleRowLabel: "Google reviews",
  socialRowLabel: "Posts & messages",
  footnote:
    "Names abbreviated for privacy. Every photo sent in by a customer who bought one.",
} as const;

/**
 * The Google reviews block (components/product/GoogleReviewCards.tsx) — the
 * rating card that heads the customer-posts section, and the review cards it
 * interleaves with the photos.
 *
 * One line, on purpose. Google's own widget is a badge followed by a row of
 * cards with no heading above them, and the block is imitating that: keep it
 * small enough to read as "our Google rating" rather than as a section about
 * Google. The label doubles as the block's <h2> for the document outline.
 *
 * Kept separate from `customerPosts` above because the source is different in
 * kind: those photos and words are ours to place, while everything in the
 * Google block is Google's own review content, shown as Google returns it. The
 * ⚠️ on GOOGLE_REVIEWS_WIDGET_ID (lib/google-reviews.ts) is the switch that
 * makes this block real — see that note, and content/google-reviews.ts for the
 * drafts that stand in until it is flipped.
 */
export const googleReviews = {
  label: "Google rating",
} as const;

export type PostKind = "facebook" | "instagram-post" | "instagram-dm";

export type PostPresentation = {
  kind: PostKind;
  /** Reaction / heart count in the card's own chrome. Illustrative — see the
      file header. */
  likes: number;
  comments: number;
  /** Facebook only. */
  shares?: number;
  /** Instagram DM only — the brand's reply underneath the customer's message. */
  reply?: string;
};

export const postPresentation: Record<string, PostPresentation> = {
  "photo-01.webp": { kind: "facebook", likes: 96, comments: 12, shares: 3 },
  "photo-04.webp": {
    kind: "instagram-dm",
    likes: 0,
    comments: 0,
    reply: "Two in one order is the smart way to do it. Thanks for the photo!",
  },
  "photo-07.webp": { kind: "instagram-post", likes: 412, comments: 27 },
  "photo-12.webp": { kind: "facebook", likes: 63, comments: 9, shares: 1 },
  "photo-13.webp": {
    kind: "instagram-dm",
    likes: 0,
    comments: 0,
    reply:
      "Good to hear it's holding up. Thanks for putting it through its paces.",
  },
  "photo-14.webp": { kind: "instagram-post", likes: 268, comments: 18 },
  "photo-15.webp": { kind: "facebook", likes: 141, comments: 22, shares: 7 },
  "photo-16.webp": { kind: "instagram-post", likes: 356, comments: 31 },
  "photo-17.webp": {
    kind: "instagram-dm",
    likes: 0,
    comments: 0,
    reply: "That's the setup we hoped for. Thanks for sending it in.",
  },
  "photo-18.webp": { kind: "facebook", likes: 88, comments: 14, shares: 2 },
  "photo-19.webp": { kind: "instagram-post", likes: 197, comments: 11 },
};
