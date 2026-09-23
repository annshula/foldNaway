"use client";

import { useMemo, useRef, useState } from "react";

import CarouselRail from "@/components/product/CarouselRail";
import {
  GoogleRatingCard,
  GoogleReviewCard,
  GoogleReviewSheet,
} from "@/components/product/GoogleReviewCards";
import { Icon } from "@/components/ui/Icons";
import Image from "@/components/ui/Image";
import { SectionHeading } from "@/components/ui/Section";
import {
  customerPosts,
  postPresentation,
  type PostPresentation,
} from "@/content/social";
import type { ProductReview } from "@/data/reviews";
import type {
  GoogleReview,
  GoogleReviews as GoogleReviewsData,
} from "@/lib/google-reviews";

/**
 * "Customer posts" — every piece of social proof this listing has, in two rows
 * above the benefit cards: Google's reviews on top, the real customer photos
 * below as the Facebook post, Instagram post and Instagram DM each one arrived
 * as.
 *
 * Two rows rather than one mixed row, and they drift towards each other:
 * Google's cards travel left→right, the photos right→left. Two rows moving the
 * same way read as one slow conveyor; moving against each other they read as a
 * pair, and each row keeps its own source legible — a Google review card and a
 * Facebook post card are different objects and reading them interleaved made
 * both harder to place.
 *
 * Why a copy of each platform's chrome instead of another review grid: these
 * photos came in *as posts and messages*, and the real thing is the social
 * proof — a card that says "★★★★★ Ma***us T." with a thumbnail throws away the
 * part that makes it believable. Names stay masked and no engagement figure is
 * invented (see the honesty note in content/social.ts); everything else is the
 * real post.
 */

/**
 * Card boxes — one per row, because the two rows hold different things.
 *
 * The photo row's cards are tall: the post's photo is the point of them, and a
 * portrait shot needs the height. The Google row's cards are half that: a name,
 * a star row and three lines of text, and at anything taller the card was
 * mostly empty with the text stopping halfway down. Serving an empty card at
 * the same size as a full one reads as a mistake.
 *
 * Both rows keep the same width, which is what still makes them read as a pair:
 * one card plus a sliver on a phone — the sliver is what says "this swipes"
 * without an arrow explaining it — and a three-quarters card on a laptop.
 */
const PHOTO_CARD = "h-88 w-64 shrink-0 sm:h-96 sm:w-72";
const GOOGLE_CARD = "h-44 w-64 shrink-0 sm:w-72";

/** Fallback chrome for a photo with no entry in content/social.ts, cycled by
    position so a newly added image still lands in a deliberate-looking mix. */
const FALLBACK: PostPresentation[] = [
  { kind: "facebook", likes: 74, comments: 11, shares: 2 },
  {
    kind: "instagram-dm",
    likes: 0,
    comments: 0,
    reply: "Thanks for sending this in!",
  },
  { kind: "instagram-post", likes: 214, comments: 16 },
];

type SocialCard = {
  review: ProductReview;
  /** Public path — also used as the account's avatar, so the wall needs no
      invented profile pictures. */
  photo: string;
  meta: PostPresentation;
};

export default function ReviewSocialPosts({
  reviews,
  google,
}: {
  /** Only the reviews that carry a customer photo — the product page filters
      the dataset before passing it in. */
  reviews: ProductReview[];
  /** Google's reviews, fetched server-side. Absent, empty or null when the API
      is down or its widget ID is unset — the Google row then doesn't render at
      all and the photos row carries the section on its own. */
  google?: GoogleReviewsData | null;
}) {
  const [openReview, setOpenReview] = useState<GoogleReview | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);

  const social = useMemo<SocialCard[]>(
    () =>
      reviews
        .filter((r): r is ProductReview & { images: string[] } =>
          Boolean(r.images?.length),
        )
        .map((review, i) => {
          const photo = review.images[0];
          const file = photo.slice(photo.lastIndexOf("/") + 1);
          return {
            review,
            photo,
            meta: postPresentation[file] ?? FALLBACK[i % FALLBACK.length],
          };
        }),
    [reviews],
  );

  const googleReviews = google?.reviews ?? [];

  /**
   * "Now" for every relative age is the newest review in the set, never
   * `Date.now()`: the dataset is generated against a fixed epoch
   * (data/reviews.ts) and read by both the server render and the client bundle,
   * so a clock-derived figure would hydrate differently on each side (React
   * #418). Ages therefore sit frozen at the dataset's own "now", which is the
   * same trade the review feed already makes. (Google's ages are formatted on
   * the server by lib/google-reviews.ts for the same reason.)
   */
  const now = useMemo(
    () => reviews.reduce((max, r) => Math.max(max, r.createdAt), 0),
    [reviews],
  );

  const openFrom = (review: GoogleReview, el: HTMLElement) => {
    triggerRef.current = el;
    setOpenReview(review);
  };

  const close = () => {
    setOpenReview(null);
    // Hand focus back to the card that opened the sheet, not to the top of the
    // page — a keyboard user opened this from a specific review.
    triggerRef.current?.focus?.();
    triggerRef.current = null;
  };

  if (social.length === 0 && googleReviews.length === 0) return null;

  return (
    <section
      id="customer-posts"
      aria-label="Customer posts and reviews"
      className="relative bg-cream"
    >
      <div className="mx-auto w-full max-w-310 px-5 pt-20 sm:px-8 lg:pt-28">
        <SectionHeading
          align="center"
          eyebrow={customerPosts.eyebrow}
          title={customerPosts.title}
          body={customerPosts.body}
        />

        {/* The section's main card: the rating, before the reviews that make it
            up. Straight on the page, no panel behind it. */}
        {google && google.count > 0 && (
          <div className="mt-8">
            <GoogleRatingCard average={google.average} count={google.count} />
          </div>
        )}
      </div>

      <div className="mt-12 flex flex-col gap-10">
        {googleReviews.length > 0 && (
          <CarouselRail
            label={customerPosts.googleRowLabel}
            /* Left→right. */
            direction={-1}
            itemCount={googleReviews.length}
          >
            {googleReviews.map((review) => (
              <li key={review.id} className={GOOGLE_CARD}>
                <GoogleReviewCard
                  review={review}
                  onOpen={(el) => openFrom(review, el)}
                />
              </li>
            ))}
          </CarouselRail>
        )}

        {social.length > 0 && (
          <CarouselRail
            label={customerPosts.socialRowLabel}
            /* Right→left — the opposite of the row above, on purpose. */
            direction={1}
            itemCount={social.length}
          >
            {social.map((card) => (
              <li key={card.review.id} className={PHOTO_CARD}>
                <PostCard
                  card={card}
                  age={relativeAge(card.review.createdAt, now)}
                />
              </li>
            ))}
          </CarouselRail>
        )}
      </div>

      <div className="mx-auto w-full max-w-310 px-5 pt-10 pb-20 sm:px-8 lg:pb-28">
        <p className="text-center text-[0.74rem] leading-relaxed text-espresso-mute">
          {customerPosts.footnote}
        </p>
      </div>

      <GoogleReviewSheet review={openReview} onClose={close} />
    </section>
  );
}

/* --------------------------------- cards --------------------------------- */

function PostCard({ card, age }: { card: SocialCard; age: string }) {
  if (card.meta.kind === "facebook") {
    return <FacebookPost card={card} age={age} />;
  }
  if (card.meta.kind === "instagram-post") {
    return <InstagramPost card={card} age={age} />;
  }
  return <InstagramMessage card={card} age={age} />;
}

/** Mask a name for display: "Marcus Turner" → "Ma***us Tu***er". Identical to
    the masking in ProductReviews.tsx and Testimonials.tsx — three copies, on
    purpose: each surface renders it inline and none of them should be able to
    change how another reveals a customer's name. */
function maskWord(word: string): string {
  const clean = word.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (clean.length <= 1) return "***";
  const keep = clean.length <= 4 ? 1 : 2;
  return `${clean.slice(0, keep)}***${clean.slice(-keep)}`;
}

function maskName(full: string): string {
  const parts = full.split(" ").filter(Boolean);
  if (parts.length === 0) return "***";
  return parts.map(maskWord).join(" ");
}

/** The same masked name, in Instagram's handle shape: lowercase, dot-joined,
    no spaces. */
function handleFor(author: string): string {
  return maskName(author).toLowerCase().replace(/\s+/g, ".");
}

/** "3 w" / "2 d" / "5 h" — the platforms' own short form, from the review's
    timestamp against the dataset's fixed "now". */
function relativeAge(ts: number, now: number): string {
  if (!now) return "";
  const minutes = Math.max(1, Math.round((now - ts) / 60_000));
  if (minutes < 60) return `${minutes} m`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} h`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days} d`;
  const weeks = Math.round(days / 7);
  if (weeks < 5) return `${weeks} w`;
  return `${Math.round(days / 30)} mo`;
}

function count(n: number): string {
  return n.toLocaleString("en-US");
}

/** The reviewer's own photo, used as the account avatar: real customer art
    rather than a stock face, and never a broken-image placeholder. */
function Avatar({ photo }: { photo: string }) {
  return (
    <span className="relative block size-7 shrink-0 overflow-hidden rounded-full bg-cream-deep">
      <Image
        src={photo}
        alt=""
        fill
        sizes="28px"
        unoptimized
        draggable={false}
        className="object-cover"
      />
    </span>
  );
}

/** The photo area. `flex-1 min-h-0` rather than an aspect ratio: this is what
    makes cards of four different shapes the same height — the photo takes
    whatever the text above it left, and every card in both rows lines up. */
function PostPhoto({ photo, alt }: { photo: string; alt: string }) {
  return (
    <div className="relative min-h-0 w-full flex-1 overflow-hidden bg-cream-deep">
      <Image
        src={photo}
        alt={alt}
        fill
        sizes="(min-width: 640px) 288px, 256px"
        unoptimized
        draggable={false}
        className="object-cover"
      />
    </div>
  );
}

/** Facebook post: the customer tagged the page, so the meta line is a timestamp
    + globe + page name, exactly as the real post reads. */
function FacebookPost({ card, age }: { card: SocialCard; age: string }) {
  const meta = card.meta;
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-sand/70 bg-paper shadow-e1">
      <header className="flex items-center gap-2.5 p-3">
        <Avatar photo={card.photo} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.82rem] font-semibold text-espresso">
            {maskName(card.review.author)}
          </p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[0.66rem] text-espresso-mute">
            <span>{age}</span>
            <span aria-hidden>·</span>
            <span className="truncate">FoldNAway</span>
            <Icon name="globe" className="size-3 shrink-0" />
          </p>
        </div>
        <Icon name="ellipsis" className="size-4 shrink-0 text-espresso-mute" />
      </header>

      {/* Margin, not padding: a clamped element clips at its *padding* edge, so
          vertical padding on it gives the next line 10px of room to paint the
          top of itself into — the phantom half-line under the ellipsis. */}
      <p className="line-clamp-2 mb-2.5 shrink-0 px-3 text-[0.78rem] leading-normal text-espresso">
        {card.review.text}
      </p>

      <div className="flex min-h-0 flex-1 flex-col border-y border-sand/70">
        <PostPhoto
          photo={card.photo}
          alt="Customer photo of the FoldNAway pouch bag"
        />
      </div>

      <div className="flex items-center justify-between gap-2 px-3 pt-2 text-[0.66rem] text-espresso-mute">
        <span className="flex items-center gap-1.5">
          <span className="flex -space-x-1.5">
            <span className="grid size-4 place-items-center rounded-full bg-sage text-paper ring-2 ring-paper">
              <Icon name="thumbs-up" className="size-2.5" />
            </span>
            <span className="grid size-4 place-items-center rounded-full bg-terracotta text-paper ring-2 ring-paper">
              <Icon name="heart" className="size-2.5" />
            </span>
          </span>
          {count(meta.likes)}
        </span>
        <span className="truncate">
          {count(meta.comments)} comments · {count(meta.shares ?? 0)} shares
        </span>
      </div>

      {/* Pinned to the bottom so every card in the row lines up, however many
          lines the post text runs to. */}
      <div className="mt-2 flex items-stretch border-t border-sand/70 px-1 py-1">
        {(["thumbs-up", "chat", "share"] as const).map((icon) => (
          <span
            key={icon}
            className="flex flex-1 items-center justify-center gap-1.5 py-1.5 text-[0.72rem] font-semibold text-espresso-soft"
          >
            <Icon name={icon} className="size-4" />
            {icon === "thumbs-up"
              ? "Like"
              : icon === "chat"
                ? "Comment"
                : "Share"}
          </span>
        ))}
      </div>
    </article>
  );
}

/** Instagram feed post: caption is the review text verbatim, so the photo and
    the words that came with it stay together. */
function InstagramPost({ card, age }: { card: SocialCard; age: string }) {
  const meta = card.meta;
  const handle = handleFor(card.review.author);
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-sand/70 bg-paper shadow-e1">
      <header className="flex items-center gap-2.5 px-3 py-2.5">
        <span className="shrink-0 rounded-full bg-linear-to-tr from-terracotta via-sand-strong to-sage p-0.5">
          <span className="block rounded-full bg-paper p-0.5">
            <Avatar photo={card.photo} />
          </span>
        </span>
        <p className="min-w-0 flex-1 truncate text-[0.8rem] font-semibold text-espresso">
          {handle}
        </p>
        <Icon name="ellipsis" className="size-4 shrink-0 text-espresso" />
      </header>

      <div className="flex min-h-0 flex-1 flex-col border-y border-sand/70">
        <PostPhoto
          photo={card.photo}
          alt="Customer photo of the FoldNAway pouch bag"
        />
      </div>

      <div className="flex items-center gap-3.5 px-3 pt-2 text-espresso">
        <Icon name="heart" className="size-5" />
        <Icon name="chat" className="size-5" />
        <Icon name="share" className="size-5" />
        <Icon name="bookmark" className="ml-auto size-5" />
      </div>

      <p className="mt-1.5 px-3 text-[0.72rem] font-semibold text-espresso">
        {count(meta.likes)} likes
      </p>
      <p className="mt-0.5 line-clamp-2 shrink-0 px-3 text-[0.78rem] leading-normal text-espresso">
        <span className="font-semibold">{handle}</span> {card.review.text}
      </p>
      <p className="mt-1 px-3 pb-2.5 text-[0.68rem] text-espresso-mute">
        View all {count(meta.comments)} comments · {age}
      </p>
    </article>
  );
}

/** Instagram DM: the message the customer actually sent, with the brand's own
    reply underneath and the composer mock at the bottom.
 *
 *  Two rules hold this card together, and both are about the clamp:
 *
 *  1. Every row that carries words is `shrink-0` and the photo is the only
 *     `flex-1`. In a fixed-height column, flex items shrink by default, and a
 *     squeezed bubble loses the bottom of its own last line — the ellipsis is
 *     drawn at the end of line two, so a box cut just short of two lines shows
 *     line one, then a sliver, and no "…" at all.
 *  2. A bubble's padding lives on the wrapper, never on the clamped <p>. A
 *     clamped element clips at its *padding* edge, so vertical padding on it
 *     hands the next line the depth of that padding to paint the top half of
 *     itself into — which is exactly the ghost line that appears under the
 *     "…" and reads as a glitch. With the padding outside, the clip edge and
 *     the last line's edge are the same line. */
function InstagramMessage({ card, age }: { card: SocialCard; age: string }) {
  const meta = card.meta;
  const handle = handleFor(card.review.author);
  return (
    <article className="flex h-full flex-col overflow-hidden rounded-card border border-sand/70 bg-paper shadow-e1">
      <header className="flex shrink-0 items-center gap-2.5 border-b border-sand/70 px-3 py-2.5">
        <Icon
          name="chevron-right"
          className="size-3.5 shrink-0 rotate-180 text-espresso"
        />
        <Avatar photo={card.photo} />
        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.8rem] font-semibold text-espresso">
            {handle}
          </p>
          <p className="text-[0.64rem] text-espresso-mute">Active now</p>
        </div>
        <Icon name="camera" className="size-4 shrink-0 text-espresso" />
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-1.5 px-3 py-2.5">
        <div className="max-w-[88%] shrink-0 rounded-[1.15rem] rounded-bl-md bg-cream-deep px-3 py-2">
          <p className="line-clamp-2 text-[0.78rem] leading-normal text-espresso">
            {card.review.text}
          </p>
        </div>
        <div className="flex min-h-0 w-[74%] flex-1 flex-col overflow-hidden rounded-[1.15rem] rounded-bl-md border border-sand/70">
          <PostPhoto
            photo={card.photo}
            alt="Customer photo of the FoldNAway pouch bag"
          />
        </div>
        {meta.reply && (
          <div className="ml-auto max-w-[86%] shrink-0 rounded-[1.15rem] rounded-br-md bg-sage px-3 py-2">
            <p className="line-clamp-2 text-[0.78rem] leading-normal text-paper">
              {meta.reply}
            </p>
          </div>
        )}
        <p className="ml-auto shrink-0 text-[0.62rem] text-espresso-mute">
          {age} · Seen
        </p>
      </div>

      <footer className="mt-auto flex shrink-0 items-center gap-2 border-t border-sand/70 px-3 py-2.5">
        <Icon name="camera" className="size-4 shrink-0 text-espresso" />
        <span className="flex-1 truncate rounded-full border border-sand px-3 py-1.5 text-[0.74rem] text-espresso-mute">
          Message…
        </span>
        <Icon name="send" className="size-4 shrink-0 text-espresso" />
      </footer>
    </article>
  );
}
