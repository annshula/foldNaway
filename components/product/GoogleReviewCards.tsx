"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Icon } from "@/components/ui/Icons";
import { RatingStars, StarRow } from "@/components/ui/Stars";
import { googleReviews } from "@/content/social";
import type { GoogleReview } from "@/lib/google-reviews";
import { useScrollLock } from "@/lib/scroll-lock";
import { cn } from "@/lib/utils";

/**
 * The Google pieces of the customer-posts section
 * (components/product/ReviewSocialPosts.tsx): the overall rating card that
 * heads it, the review cards that ride the same rail as the Facebook and
 * Instagram cards, and the sheet a Google card opens into.
 *
 * They live here rather than in the section file because the rail needs them
 * as black boxes — a card with its own click behaviour, a sheet with its own
 * focus handling — and because everything Google-branded should be in one
 * place: the mark, and the three places it appears.
 *
 * Nothing links out to Google. The profile URL the API returns belongs to
 * Featurable's demo widget, not to this brand, so an outbound link would take
 * a visitor to a stranger's review page while implying it is ours.
 */

/**
 * Google's "G", in its own four colours.
 *
 * Deliberately not in components/ui/Icons.tsx: everything there is a single
 * stroked 24×24 path set that inherits `currentColor`, and this is a filled,
 * four-colour trademark that must never be recoloured to match a surface. It
 * is used only as the source label for Google-supplied reviews, which is what
 * the mark is for.
 */
export function GoogleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" aria-hidden className={className}>
      <path
        fill="#ea4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"
      />
      <path
        fill="#4285f4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65Z"
      />
      <path
        fill="#fbbc05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19Z"
      />
      <path
        fill="#34a853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"
      />
    </svg>
  );
}

/**
 * The section's main card: the whole Google rating, in one card, sitting above
 * the rail of individual reviews. Aggregates first, evidence after.
 *
 * A link, not a badge: the one thing a visitor wants after reading "4.2" is
 * the reviews behind it, and this page has a full review feed further down
 * (#reviews, ProductReviews.tsx) with the distribution, the country breakdown
 * and every review, paginated. A <button> with a scroll handler would do the
 * same job with more code and no hreflink for anyone without JavaScript; an
 * <a href="#reviews"> gets the jump, the URL fragment, the focus move and the
 * browser's own smooth scroll (app/globals.css) for free.
 *
 * Labelled, not headed: the section already has an <h2> (its own title), and a
 * second one inside a badge would split the section in two for anyone reading
 * the outline.
 */
export function GoogleRatingCard({
  average,
  count,
}: {
  average: number;
  count: number;
}) {
  return (
    <a
      href="#reviews"
      className="group mx-auto flex w-fit max-w-full items-center gap-3.5 rounded-card border border-sand/70 bg-paper px-4 py-3 shadow-e1 transition-all duration-500 ease-(--ease-out-expo) hover:-translate-y-0.5 hover:border-sage/35 hover:shadow-(--shadow-e3)"
    >
      <GoogleMark className="size-8 shrink-0" />

      <span className="min-w-0 text-left">
        <span className="block font-grotesk text-[0.66rem] font-bold tracking-widest text-espresso uppercase">
          {googleReviews.label}
        </span>
        <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-mono text-[1.15rem] leading-none font-semibold text-espresso">
            {average.toFixed(1)}
          </span>
          <RatingStars
            value={average}
            starClassName="h-3.5 w-3.5"
            filledClassName="text-google-gold"
          />
          <span className="text-[0.74rem] whitespace-nowrap text-espresso-mute">
            {count.toLocaleString("en-US")} reviews
          </span>
          <Icon
            name="chevron-right"
            className="size-3.5 shrink-0 text-espresso-mute transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-0.5 group-hover:text-sage-deep"
          />
        </span>
      </span>
    </a>
  );
}

/**
 * One Google review on the rail.
 *
 * Laid out exactly the way Google lays out a review — the reviewer, then the
 * stars, then the words — so a visitor recognises the source before they read
 * a word of it. The source label is the one Google prints there, "3 weeks ago
 * on Google", with the word in Google's own link blue.
 *
 * The card is sized to the clamp rather than the other way round: the text is
 * cut at `line-clamp-3` with the ellipsis the browser draws for it, so the
 * header, the stars, the three lines and nothing else are the whole card, and
 * a review that ends mid-sentence always ends on that ellipsis. The rest of the
 * review is one click away in the sheet.
 *
 * The clamped <p> is `shrink-0` and hugs its own lines — never `flex-1`, never
 * carrying vertical padding. A clamp truncates the text at line three, but the
 * clip happens at the box's own edge, so any box taller than three lines (a
 * flex-1 paragraph, a padded one) gives line four a few pixels to paint the top
 * of itself into: the half-line that appears under the "…" and reads as a
 * glitch. Leftover card height goes under the text, not inside it.
 *
 * No hover state, on purpose. The card is a button only so the full review has
 * somewhere to open from — it is a quote, not a call to action — and a row of
 * cards lifting under the cursor on a rail that is already drifting drew the
 * eye to the animation rather than to the reviews. The cursor and the focus
 * ring still say it is clickable.
 */
export function GoogleReviewCard({
  review,
  onOpen,
}: {
  review: GoogleReview;
  onOpen: (el: HTMLElement) => void;
}) {
  return (
    <button
      type="button"
      onClick={(e) => onOpen(e.currentTarget)}
      aria-label={`Read the full review from ${shortName(review)}`}
      className="flex h-full w-full flex-col rounded-card border border-sand/70 bg-paper p-3.5 text-left"
    >
      <header className="flex items-center gap-2.5">
        <GoogleAvatar review={review} className="size-9" />
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[0.84rem] font-semibold text-espresso">
            {shortName(review)}
          </span>
          <span className="mt-0.5 block truncate text-[0.7rem] text-espresso-mute">
            {review.age ? `${review.age} on ` : "on "}
            <span className="text-google-blue">Google</span>
          </span>
        </span>
      </header>

      <StarRow
        stars={review.rating}
        className="mt-3"
        starClassName="h-4 w-4"
        filledClassName="text-google-gold"
      />

      <p className="mt-2 line-clamp-3 shrink-0 overflow-hidden text-[0.82rem] leading-[1.6] text-espresso-soft text-pretty">
        {review.comment}
      </p>
    </button>
  );
}

/**
 * The full review: a centred dialog on desktop, a bottom sheet below `sm`. One
 * component, one layout switch — `items-end` plus a slide-up in, `items-center`
 * plus a scale-in over `sm` — rather than two components to keep in step.
 */
export function GoogleReviewSheet({
  review,
  onClose,
}: {
  review: GoogleReview | null;
  onClose: () => void;
}) {
  const [mounted, setMounted] = useState(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const open = review !== null;
  useScrollLock(open);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    // Focus lands on the sheet's own close button, so the first Tab goes into
    // the review rather than back out to the page behind it.
    closeRef.current?.focus();
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !review) return null;

  return createPortal(
    <div className="fixed inset-0 z-100">
      <div
        onClick={onClose}
        style={{ backgroundColor: "rgb(36 29 24 / 0.5)" }}
        className="animate-fade-in absolute inset-0"
      />

      <div
        className="absolute inset-0 flex items-end justify-center sm:items-center sm:p-6"
        onClick={onClose}
      >
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`Review from ${shortName(review)}`}
          onClick={(e) => e.stopPropagation()}
          className="animate-slide-up max-h-[88vh] w-full overflow-y-auto rounded-t-3xl bg-paper px-5 pt-3.5 pb-6 shadow-(--shadow-e4) sm:animate-scale-in sm:max-w-lg sm:rounded-card sm:px-6 sm:pt-6 sm:pb-6"
        >
          {/* The sheet's drag affordance — mobile only; there is nothing to
              drag on the desktop dialog. */}
          <span
            aria-hidden
            className="mx-auto mb-3.5 block h-1.5 w-11 rounded-full bg-sand-strong sm:hidden"
          />

          <header className="flex items-start gap-3">
            <GoogleAvatar review={review} className="size-10" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[0.9rem] font-semibold text-espresso">
                {shortName(review)}
              </p>
              <p className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.72rem] text-espresso-mute">
                <GoogleMark className="size-3.5" />
                {/* The phrase is one flex item, not three: siblings in this
                    row are spaced by `gap-x-2`, and letting the gap fall
                    between "on" and "Google" reads as a typo. */}
                <span className="whitespace-nowrap">
                  {review.createdAt && (
                    <time dateTime={review.createdAt}>
                      {`${review.age} on `}
                    </time>
                  )}
                  <span className="text-google-blue">Google</span>
                </span>
              </p>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              aria-label="Close review"
              className="grid size-9 shrink-0 place-items-center rounded-full text-espresso-mute transition-colors duration-300 hover:bg-cream-deep hover:text-espresso"
            >
              <Icon name="close" className="size-4" />
            </button>
          </header>

          <StarRow
            stars={review.rating}
            className="mt-3.5"
            starClassName="h-4 w-4"
          />

          <p className="mt-3.5 text-[0.88rem] leading-[1.7] text-espresso-soft text-pretty whitespace-pre-line">
            {review.comment}
          </p>

          {review.reply && (
            <div className="mt-4 rounded-card border border-sand/70 bg-cream-deep p-3.5">
              <p className="font-label text-[0.62rem] font-semibold tracking-[0.16em] text-espresso-mute uppercase">
                Response from FoldNAway
              </p>
              <p className="mt-2 text-[0.84rem] leading-[1.65] text-espresso-soft text-pretty">
                {review.reply}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* -------------------------------- pieces -------------------------------- */

/** "Isabella Li" → "Is***la Li". Deliberately the same masking the photo cards
    use (ReviewSocialPosts.tsx, ProductReviews.tsx, Testimonials.tsx hold the
    other copies), and a fourth copy on purpose: each surface renders names
    inline, and none of them should be able to change how another reveals a
    customer's name.

    It replaces the initials convention Google's own widget uses ("Isabella
    Li" → "Isabella L.") because on this site every review name is masked the
    same way — a Google card that shortened a name differently would read as a
    less anonymous surface than the cards sliding past beside it. */
function maskWord(word: string): string {
  const clean = word.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (clean.length <= 1) return "***";
  const keep = clean.length <= 4 ? 1 : 2;
  return `${clean.slice(0, keep)}***${clean.slice(-keep)}`;
}

export function shortName(review: GoogleReview): string {
  if (review.anonymous) return "Google user";
  const parts = review.author.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "***";
  return parts.map(maskWord).join(" ");
}

/**
 * Google's own default avatar palette, for reviewers with no profile photo.
 * A Google review's initial sits on a coloured disc rather than on the site's
 * espresso, and the colour is stable per person — the same reviewer gets the
 * same disc on every render and after every revalidate, because it is derived
 * from the name rather than from a random number.
 */
const GOOGLE_AVATAR_COLORS = [
  "#0f9d58",
  "#4285f4",
  "#db4437",
  "#f4b400",
  "#ab47bc",
  "#00acc1",
  "#ff7043",
  "#9e9e9e",
];

function avatarColor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i += 1) {
    hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  }
  const index = Math.abs(hash) % GOOGLE_AVATAR_COLORS.length;
  return GOOGLE_AVATAR_COLORS[index];
}

function GoogleAvatar({
  review,
  className,
}: {
  review: GoogleReview;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (review.anonymous || !review.authorPhoto || failed) {
    return (
      <span
        aria-hidden
        style={{ backgroundColor: avatarColor(review.author) }}
        className={cn(
          "grid shrink-0 place-items-center rounded-full font-semibold text-white",
          className,
        )}
      >
        <span className="text-[0.9rem] leading-none">
          {review.author.trim().charAt(0).toUpperCase() || "G"}
        </span>
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative block shrink-0 overflow-hidden rounded-full bg-cream-deep",
        className,
      )}
    >
      {/* A plain <img>, not components/ui/Image: these are Google-hosted profile
          photos, a host next.config.ts's loader isn't built for, and routing
          someone else's avatars through Vercel's optimizer would bill for
          images we don't own. `referrerPolicy` keeps the review page out of
          Google's referrer logs. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={review.authorPhoto}
        alt=""
        loading="lazy"
        decoding="async"
        referrerPolicy="no-referrer"
        onError={() => setFailed(true)}
        className="size-full object-cover"
      />
    </span>
  );
}
