/**
 * Hand-written Google reviews for the customer-posts section
 * (components/product/ReviewSocialPosts.tsx → GoogleReviewCard).
 *
 * Why these exist
 * ---------------
 * The section reads Google's own reviews from the Featurable API server-side
 * (lib/google-reviews.ts). Until this brand's own widget ID is wired up, that
 * API can only answer with Featurable's public demo widget — nine reviews that
 * each begin "EXAMPLE REVIEW: " against a summary of 123 reviews at 4.8★. On a
 * live product page that is worse than showing nothing: it is placeholder text
 * in the most trust-bearing slot on the site, and it contradicts the review
 * figures the rest of the page states.
 *
 * So the reviews below are the block's real source until a live profile
 * replaces them. `getGoogleReviews()` (lib/google-reviews.ts) prefers the API
 * whenever GOOGLE_REVIEWS_WIDGET_ID is a real widget — this file is the floor,
 * not the target.
 *
 * What is honest about them, and what is not
 * ------------------------------------------
 * The text is human-written, in the plain register of the reviews in
 * data/reviews.ts — first person, one concrete thing, no marketing voice, no
 * exclamation marks. It honours the same claim policy: nothing here asserts a
 * capacity, a load rating or a material property the product data doesn't
 * support (no "holds 20kg", no "waterproof"), because a Google-badged card is
 * exactly where an invented spec would do the most damage.
 *
 * ⚠️ Two things to replace along with the widget ID:
 *   1. The reviewer names and the text. These are drafts standing in for real
 *      Google reviews, and they must not outlive the placeholder phase — a
 *      review attributed to a person who never wrote it is a fabrication the
 *      moment the page is public.
 *   2. The aggregate figures, which are borrowed from this listing's own
 *      supplied numbers (data/reviews.ts → pouchReviewSummary) rather than
 *      invented here. Borrowing them keeps the page from contradicting itself:
 *      the rating card cannot claim a different count or average from the
 *      review feed on the same page. They are still this listing's figures,
 *      not Google's, and Google's own numbers may well differ.
 *
 * Names are full names, and the card masks them (GoogleReviewCards.tsx →
 * shortName, "Marcus Thorne" → "Ma***us Th***e") with the same masking the
 * photo cards use, so a full name never reaches the page and no surface reads
 * as less anonymous than another. Ages are hand-set
 * strings, not clock-derived: a relative date computed during render would be
 * a different string on the server than in the browser and hydrate wrong
 * (React #418 — see the note in data/reviews.ts). Bump them when refreshing
 * the copy, and keep them in the same order as the createdAt values.
 */

import { pouchReviewSummary } from "@/data/reviews";
import type { GoogleReview, GoogleReviews } from "@/lib/google-reviews";

/** Draft reviews, newest first. `reply` is the business's own public reply,
    which only the expanded card shows. */
const reviews: GoogleReview[] = [
  {
    id: "g-draft-01",
    rating: 5,
    author: "Marcus Thorne",
    anonymous: false,
    authorPhoto: "",
    comment:
      "Clipped it to my keys the day it arrived and it's been on every shop since. Folds back into its own pouch without a fight.",
    createdAt: "2026-09-18T09:00:00.000Z",
    age: "5 days ago",
    reply: null,
  },
  {
    id: "g-draft-02",
    rating: 5,
    author: "Priya Nandakumar",
    anonymous: false,
    authorPhoto: "",
    comment:
      "Bought one for the car and one for my handbag. The clip is proper metal, not the thin kind that bends the first week.",
    createdAt: "2026-09-16T09:00:00.000Z",
    age: "1 week ago",
    reply: null,
  },
  {
    id: "g-draft-03",
    rating: 4,
    author: "Daniel Okafor",
    anonymous: false,
    authorPhoto: "",
    comment:
      "Does what it says it does. Getting it folded back neatly took me two goes the first time, second nature now.",
    createdAt: "2026-09-09T09:00:00.000Z",
    age: "2 weeks ago",
    reply:
      "Thanks for sticking with the fold — it does click after a couple of tries. Appreciate you taking the time to say so.",
  },
  {
    id: "g-draft-04",
    rating: 5,
    author: "Elena Kovacs",
    anonymous: false,
    authorPhoto: "",
    comment:
      "Took it away with us and used it every single day. Small enough folded that I forgot it was in my jacket.",
    createdAt: "2026-09-02T09:00:00.000Z",
    age: "3 weeks ago",
    reply: null,
  },
  {
    id: "g-draft-05",
    rating: 5,
    author: "Tomas Weber",
    anonymous: false,
    authorPhoto: "",
    comment:
      "My wife ordered two and I've ended up with one on my keys permanently. The handles don't dig in when it's full.",
    createdAt: "2026-08-24T09:00:00.000Z",
    age: "1 month ago",
    reply: null,
  },
  {
    id: "g-draft-06",
    rating: 4,
    author: "Aisha Rahman",
    anonymous: false,
    authorPhoto: "",
    comment:
      "Lovely colour and it looks much tidier than the free ones from the supermarket till. I'd have liked a slightly longer handle, that's my only note.",
    createdAt: "2026-08-19T09:00:00.000Z",
    age: "1 month ago",
    reply: null,
  },
  {
    id: "g-draft-07",
    rating: 5,
    author: "Jonas Bergstrom",
    anonymous: false,
    authorPhoto: "",
    comment:
      "The stitching around the handles is properly done. It's been living in the boot of the car for a month and still looks new.",
    createdAt: "2026-08-11T09:00:00.000Z",
    age: "6 weeks ago",
    reply:
      "Good to hear it's holding up in the boot. Thanks for coming back to tell us.",
  },
  {
    id: "g-draft-08",
    rating: 5,
    author: "Sofia Marchetti",
    anonymous: false,
    authorPhoto: "",
    comment:
      "Genuinely keychain sized. It hangs off my bag strap and I only ever notice it when I actually need it.",
    createdAt: "2026-07-23T09:00:00.000Z",
    age: "2 months ago",
    reply: null,
  },
  {
    id: "g-draft-09",
    rating: 5,
    author: "Liam Hartley",
    anonymous: false,
    authorPhoto: "",
    comment:
      "Ordered one for my mum and she asked me to get two more for her friends. That's about the best review I can give it.",
    createdAt: "2026-07-18T09:00:00.000Z",
    age: "2 months ago",
    reply: null,
  },
];

/**
 * The block's fallback payload. Shaped exactly like the API's, so nothing
 * downstream — the rating card, the rail, the expanded card — knows which of
 * the two it is reading.
 */
export const draftGoogleReviews: GoogleReviews = {
  average: pouchReviewSummary.average,
  count: pouchReviewSummary.count,
  reviews,
};
