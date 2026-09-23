/**
 * Google reviews, read server-side from the Featurable API.
 *
 * Featurable is the free service the `react-google-reviews` widget talks to,
 * and this module reads the very same endpoint (`/v1/widgets/<id>`) — just
 * from the server instead of the browser. That keeps three things this site
 * cares about:
 *
 *   1. No third-party request from the visitor's browser (no api.featurable.com
 *      connection, no widget JS in the client bundle — the review cards are
 *      ordinary page markup, and the only client code is the carousel and the
 *      expanded card).
 *   2. One source of truth: the same payload feeds the rating badge, the cards
 *      and the expanded view, so the text a card truncates and the text the
 *      popup shows can never be two different strings.
 *   3. Failure is quiet. A dead API, a rate limit or a bad widget ID returns
 *      null, and the product page simply doesn't render the section — a
 *      reviews widget must never take the page down with it.
 *
 * The payload's `profileUrl` is deliberately not read or exposed: it belongs to
 * Featurable's demo widget, not to this brand, and a "Read our reviews" link
 * pointing at a stranger's Google profile is worse than no link. Bring it back
 * (both here and in components/product/GoogleReviewCards.tsx) only together with a
 * real Business Profile.
 *
 * ⚠️ GOOGLE_REVIEWS_WIDGET_ID is Featurable's public demo widget, and while it
 * still is, getGoogleReviews() below returns the hand-written reviews in
 * content/google-reviews.ts instead of calling the API at all — the demo
 * widget answers with nine reviews that each begin "EXAMPLE REVIEW: " and a
 * summary of 123 reviews at 4.8★, and placeholder text in a Google-badged
 * card is worse than showing nothing.
 *
 * So there is exactly one line to change to make this block real: put the
 * widget ID from the brand's own Google Business Profile (featurable.com →
 * create a widget → Embed → API) in GOOGLE_REVIEWS_WIDGET_ID, and the live
 * payload takes over. Same posture as site.metrics.verified: the number of
 * places that must be true before Google-branded review content is real is
 * exactly one, and it is this constant.
 */

import { draftGoogleReviews } from "@/content/google-reviews";

const API_BASE = "https://api.featurable.com";

/** ⚠️ Demo widget — see the file header. */
export const GOOGLE_REVIEWS_WIDGET_ID = "example";

/** True while the constant above is still Featurable's demo. */
const USING_DEMO_WIDGET = GOOGLE_REVIEWS_WIDGET_ID === "example";

export type GoogleReview = {
  id: string;
  /** 1–5, whole stars. */
  rating: number;
  author: string;
  /** Reviewer's Google profile photo, when they have one. */
  authorPhoto: string;
  /** Google shows "Google user" for reviews posted without a name. */
  anonymous: boolean;
  /** The full review, exactly as Google returns it. */
  comment: string;
  /** ISO timestamp — used as the `dateTime` on the expanded card's <time>. */
  createdAt: string | null;
  /**
   * Pre-formatted "a month ago". Formatted here, on the server, on purpose:
   * a relative date computed during render would be `Date.now()` on the server
   * and a different `Date.now()` in the browser, which is a hydration mismatch
   * (React #418) — the same trap data/reviews.ts documents. The fetch is
   * cached for an hour, so the label is stable for as long as the payload is.
   */
  age: string;
  /** The business's own public reply, when there is one. */
  reply: string | null;
};

export type GoogleReviews = {
  /** Weighted average across every review on the profile, not just these. */
  average: number;
  /** Total reviews on the profile. */
  count: number;
  reviews: GoogleReview[];
};

/** The subset of Featurable's v1 payload this module reads. */
type FeaturableWidget = {
  success?: boolean;
  totalReviewCount?: number;
  averageRating?: number;
  reviews?: {
    reviewId?: string | null;
    reviewer?: {
      displayName?: string;
      profilePhotoUrl?: string;
      isAnonymous?: boolean;
    };
    starRating?: number;
    comment?: string;
    createTime?: string | null;
    reviewReply?: { comment?: string } | null;
  }[];
};

/** "3 weeks ago" — Google's own phrasing, so the card reads like Google's. */
function relativeAge(iso: string | null, now: number): string {
  if (!iso) return "";
  const then = Date.parse(iso);
  if (Number.isNaN(then)) return "";

  const minutes = Math.round((now - then) / 60_000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`;

  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;

  const days = Math.round(hours / 24);
  if (days < 7) return `${days} day${days === 1 ? "" : "s"} ago`;

  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks} week${weeks === 1 ? "" : "s"} ago`;

  const months = Math.round(days / 30);
  if (months < 24) return `${months} month${months === 1 ? "" : "s"} ago`;

  const years = Math.round(days / 365);
  return `${years} year${years === 1 ? "" : "s"} ago`;
}

export async function fetchGoogleReviews(
  widgetId: string = GOOGLE_REVIEWS_WIDGET_ID,
): Promise<GoogleReviews | null> {
  if (!widgetId) return null;

  try {
    const res = await fetch(
      `${API_BASE}/v1/widgets/${encodeURIComponent(widgetId)}`,
      {
        headers: { accept: "application/json" },
        // The API itself refreshes from Google every 48h; an hour of ISR keeps
        // the page's own revalidate window the thing that decides freshness.
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      },
    );
    if (!res.ok) return null;

    const payload = (await res.json()) as FeaturableWidget;
    if (!payload?.success || !Array.isArray(payload.reviews)) return null;

    const now = Date.now();

    return {
      average: payload.averageRating ?? 0,
      count: payload.totalReviewCount ?? payload.reviews.length,
      // Star-only reviews (no text) have nothing to show in a card that is
      // mostly text, and they read as broken in the expanded view.
      reviews: payload.reviews
        .filter((r) => (r.comment ?? "").trim().length > 0)
        .map((r, i) => ({
          id: r.reviewId ?? `google-${i}`,
          rating: Math.min(5, Math.max(1, Math.round(r.starRating ?? 0))),
          author: r.reviewer?.displayName?.trim() || "Google user",
          authorPhoto: r.reviewer?.profilePhotoUrl ?? "",
          anonymous:
            Boolean(r.reviewer?.isAnonymous) || !r.reviewer?.displayName,
          comment: (r.comment ?? "").trim(),
          createdAt: r.createTime ?? null,
          age: relativeAge(r.createTime ?? null, now),
          reply: r.reviewReply?.comment?.trim() || null,
        })),
    };
  } catch {
    return null;
  }
}

/**
 * What the customer-posts section actually reads.
 *
 * Live profile when one is configured, hand-written drafts while the widget ID
 * is still the demo. Note the asymmetry on failure: a configured widget that
 * errors returns null and the section simply drops its Google row, rather than
 * quietly substituting the drafts — standing in for a named profile with text
 * that profile never wrote would be the one unrecoverable mistake here.
 */
export async function getGoogleReviews(): Promise<GoogleReviews | null> {
  if (USING_DEMO_WIDGET) return draftGoogleReviews;
  return fetchGoogleReviews();
}
