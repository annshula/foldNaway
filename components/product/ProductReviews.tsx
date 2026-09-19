"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { Icon } from "@/components/ui/Icons";
import Image from "@/components/ui/Image";
import { SectionHeading } from "@/components/ui/Section";
import { RatingStars, StarRow } from "@/components/ui/Stars";
import type { ProductReview, ReviewSummary } from "@/data/reviews";
import { useScrollLock } from "@/lib/scroll-lock";
import { cn } from "@/lib/utils";

/**
 * Full customer-reviews experience: an aggregate summary with a clickable
 * star breakdown, quick filters (all / with photos / by star) and a
 * paginated review feed. Customer photos open in a portal lightbox.
 *
 * Reviews arrive as a prop from the server page — this component never
 * imports the (large) dataset itself, so the client bundle stays lean.
 *
 * Filtering and pagination are deliberately client-side: the dataset is a
 * couple of thousand small records, and it keeps paging instant.
 */

const PAGE_SIZE = 6;

type Filter = "all" | "photo" | 5 | 4 | 3 | 2 | 1;

export default function ProductReviews({
  reviews,
  summary,
}: {
  reviews: ProductReview[];
  summary: ReviewSummary;
}) {
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const listRef = useRef<HTMLDivElement>(null);

  const counts = useMemo(() => {
    const by: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    let photos = 0;
    for (const r of reviews) {
      by[r.rating]++;
      if (r.images?.length) photos++;
    }
    return { by, photos };
  }, [reviews]);

  const filtered = useMemo(() => {
    if (filter === "all") return reviews;
    if (filter === "photo") return reviews.filter((r) => r.images?.length);
    return reviews.filter((r) => r.rating === filter);
  }, [reviews, filter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = useMemo(
    () => filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [filtered, safePage],
  );

  const chooseFilter = (f: Filter) => {
    setFilter(f);
    setPage(1);
  };

  const goTo = (p: number) => {
    const next = Math.min(Math.max(1, p), totalPages);
    setPage(next);
    // Keep the list in view when flipping pages — scroll-mt clears the nav.
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Star rows with zero reviews are dropped from the chips entirely: an
  // always-visible "3 stars (0)" chip that can only ever show an empty state
  // is noise, not transparency — the full distribution is still in the
  // summary panel on the left.
  const chips: { id: Filter; label: string; icon?: true; count: number }[] = [
    { id: "all", label: "All reviews", count: reviews.length },
    { id: "photo", label: "", icon: true, count: counts.photos },
    ...([5, 4, 3, 2, 1] as const)
      .filter((stars) => counts.by[stars] > 0)
      .map((stars) => ({
        id: stars as Filter,
        label: `${stars} star${stars === 1 ? "" : "s"}`,
        count: counts.by[stars],
      })),
  ];

  return (
    <section
      id="reviews"
      aria-label={`${summary.count.toLocaleString("en-US")} customer reviews`}
      className="relative scroll-mt-20 border-t border-sand/70 bg-cream"
    >
      <div className="mx-auto w-full max-w-310 px-5 py-20 sm:px-8 lg:py-28">
        <SectionHeading
          align="center"
          eyebrow="Customer reviews"
          title="Bought once. Clipped on ever since."
          body="Reviews with a photo show the bag exactly as it arrived."
        />

        <div className="mt-12 grid gap-8 lg:mt-16 lg:grid-cols-[minmax(0,19rem)_minmax(0,1fr)] lg:gap-12">
          {/* ------------------------- summary / left ------------------------ */}
          <aside
            aria-label="Rating summary"
            className="lg:sticky lg:top-28 lg:self-start"
          >
            <div className="rounded-(--radius-card) border border-sand/70 bg-paper p-7 shadow-(--shadow-e1)">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-[3rem] leading-none font-semibold tracking-[-0.02em] text-espresso tabular-nums">
                  {summary.average.toFixed(1)}
                </span>
                <span className="text-[0.82rem] text-espresso-mute">
                  / 5 · {summary.count.toLocaleString("en-US")} reviews
                </span>
              </div>

              <RatingStars
                value={summary.average}
                className="mt-3"
                starClassName="h-4 w-4"
              />

              <p className="mt-3 text-[0.8rem] leading-relaxed text-espresso-mute">
                <span className="font-semibold text-espresso">
                  {summary.recommended}% of buyers
                </span>{" "}
                would recommend this bag.
              </p>

              <ul className="mt-7 flex flex-col gap-1">
                {summary.distribution.map((d) => (
                  <li key={d.stars}>
                    <button
                      type="button"
                      onClick={() => chooseFilter(d.stars as Filter)}
                      aria-pressed={filter === d.stars}
                      disabled={d.count === 0}
                      aria-label={`Filter to ${d.stars} star reviews, ${d.count}`}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-lg px-2 py-1.5 transition-colors duration-200",
                        d.count === 0 && "pointer-events-none opacity-45",
                        filter === d.stars
                          ? "bg-sage-soft"
                          : "hover:bg-cream-deep",
                      )}
                    >
                      <StarRow stars={d.stars} starClassName="h-3 w-3" />
                      <span className="relative h-1.5 flex-1 overflow-hidden rounded-full bg-sand">
                        <span
                          className={cn(
                            "block h-full rounded-full transition-all duration-300",
                            d.count > 0
                              ? "bg-linear-to-r from-sage-deep to-sage"
                              : "bg-transparent",
                          )}
                          style={{ width: `${d.percent}%` }}
                        />
                      </span>
                      <span className="w-14 text-right text-[0.7rem] text-espresso-mute tabular-nums">
                        {d.count.toLocaleString("en-US")}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>

              <button
                type="button"
                onClick={() => chooseFilter("photo")}
                aria-pressed={filter === "photo"}
                className={cn(
                  "mt-5 flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left text-[0.8rem] transition-colors duration-200",
                  filter === "photo"
                    ? "border-sage/50 bg-sage-soft text-espresso"
                    : "border-sand bg-paper text-espresso-soft hover:border-line-strong",
                )}
              >
                <Icon name="check" className="size-4 text-sage-deep" />
                <span className="font-medium">
                  With photos ({summary.withPhotos})
                </span>
              </button>
            </div>
          </aside>

          {/* --------------------------- list / right ------------------------ */}
          <div ref={listRef} className="scroll-mt-28">
            <div
              role="group"
              aria-label="Filter reviews"
              className="flex flex-wrap items-center gap-2"
            >
              {chips.map((chip) => (
                <button
                  key={String(chip.id)}
                  type="button"
                  onClick={() => chooseFilter(chip.id)}
                  aria-pressed={filter === chip.id}
                  className={cn(
                    "inline-flex min-h-11 items-center justify-center gap-2 rounded-full border px-4 text-[0.8rem] font-medium transition-all duration-200",
                    filter === chip.id
                      ? "border-espresso bg-espresso text-cream"
                      : "border-sand bg-paper text-espresso-soft hover:border-espresso/30 hover:text-espresso",
                  )}
                >
                  {chip.icon ? (
                    <>
                      <Icon name="check" className="size-4" aria-hidden />
                      <span className="sr-only">Reviews with photos</span>
                      <span className="tabular-nums">{chip.count}</span>
                    </>
                  ) : (
                    <>
                      {chip.label}
                      <span
                        className={cn(
                          "tabular-nums",
                          filter === chip.id
                            ? "text-cream/60"
                            : "text-espresso-mute",
                        )}
                      >
                        {chip.count.toLocaleString("en-US")}
                      </span>
                    </>
                  )}
                </button>
              ))}
            </div>

            <p
              aria-live="polite"
              className="mt-6 text-[0.78rem] tracking-wide text-espresso-mute tabular-nums"
            >
              {filtered.length === 0
                ? "No reviews match this filter."
                : `Showing ${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(
                    safePage * PAGE_SIZE,
                    filtered.length,
                  )} of ${filtered.length.toLocaleString("en-US")} review${
                    filtered.length === 1 ? "" : "s"
                  }`}
            </p>

            {pageItems.length === 0 ? (
              <EmptyFilterState onReset={() => chooseFilter("all")} />
            ) : (
              <ul className="mt-4 flex flex-col gap-5">
                {pageItems.map((r) => (
                  <ReviewCard key={r.id} review={r} />
                ))}
              </ul>
            )}

            {filtered.length > PAGE_SIZE && (
              <Pagination
                page={safePage}
                totalPages={totalPages}
                total={filtered.length}
                onGo={goTo}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------ review card ------------------------------ */

function ReviewCard({ review }: { review: ProductReview }) {
  const [openPhoto, setOpenPhoto] = useState<string | null>(null);
  const date = formatDate(review.createdAt);

  return (
    <li>
      <article className="h-full rounded-(--radius-card) border border-sand/70 bg-paper p-5 sm:p-6">
        <header className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
          <StarRow stars={review.rating} starClassName="h-3.5 w-3.5" />
          <time
            dateTime={new Date(review.createdAt).toISOString().slice(0, 10)}
            className="text-[0.72rem] text-espresso-mute tabular-nums"
          >
            {date}
          </time>
        </header>

        <blockquote className="mt-3 text-[0.93rem] leading-[1.7] text-espresso-soft text-pretty">
          {review.text}
        </blockquote>

        {review.images?.length ? (
          <div className="mt-4 flex gap-2.5">
            {review.images.map((src) => (
              <button
                key={src}
                type="button"
                onClick={() => setOpenPhoto(src)}
                aria-label="Open customer photo"
                className="group relative block size-24 overflow-hidden rounded-lg border border-sand bg-cream-deep"
              >
                {/* Local review photos are pre-optimised WebP shipped from
                    /public — served with `unoptimized` so they never route
                    through Vercel's paid image optimizer, the same reason
                    Shopify art uses its own CDN loader. */}
                <Image
                  src={src}
                  alt="Customer photo of the FoldNAway pouch bag"
                  fill
                  sizes="96px"
                  unoptimized
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </button>
            ))}
          </div>
        ) : null}

        <figcaption className="mt-5 flex items-center gap-3 border-t border-sand/70 pt-4">
          <span className="font-display grid size-10 shrink-0 place-items-center rounded-full bg-espresso text-[0.9rem] font-semibold text-cream">
            {review.author.charAt(0)}
          </span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[0.9rem] font-semibold text-espresso">
              {maskName(review.author)}
            </span>
            <span className="mt-0.5 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[0.72rem] text-espresso-mute">
              {review.country}
              {review.colorway && <span>· {review.colorway}</span>}
              {review.verified && (
                <span className="inline-flex items-center gap-1 font-medium text-espresso-soft">
                  <Icon name="check" className="size-3 text-sage" />
                  Verified purchase
                </span>
              )}
            </span>
          </span>
        </figcaption>
      </article>

      <ReviewImageLightbox
        src={openPhoto}
        onClose={() => setOpenPhoto(null)}
        caption={`${maskName(review.author)} · ${review.country}`}
      />
    </li>
  );
}

/* -------------------------------- lightbox ------------------------------- */

function ReviewImageLightbox({
  src,
  onClose,
  caption,
}: {
  src: string | null;
  onClose: () => void;
  caption: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [zoomed, setZoomed] = useState(false);
  const open = src !== null;
  useScrollLock(open);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    setZoomed(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!mounted || !src) return null;

  return createPortal(
    <div className="fixed inset-0 z-100">
      <div
        onClick={onClose}
        style={{ backgroundColor: "rgba(26,20,16,0.95)" }}
        className="absolute inset-0 animate-fade-in"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Customer review photo"
        className="absolute inset-0 flex animate-fade-in flex-col"
      >
        <div className="flex items-center justify-end px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close photo"
            className="grid size-10 place-items-center rounded-full border border-white/20 text-oat transition-colors duration-300 hover:border-white/50"
          >
            <Icon name="close" className="size-4" />
          </button>
        </div>

        <button
          type="button"
          onClick={() => setZoomed((z) => !z)}
          aria-label={zoomed ? "Zoom out" : "Zoom in"}
          className="relative mx-auto h-[72vh] w-full max-w-4xl flex-1 px-4 pb-2"
        >
          <Image
            src={src}
            alt="Customer photo of the FoldNAway pouch bag"
            fill
            sizes="(max-width: 900px) 100vw, 900px"
            unoptimized
            className={cn(
              "object-contain transition-transform duration-300",
              zoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in",
            )}
          />
        </button>

        <div className="flex items-center justify-center px-5 py-5 text-[0.78rem] text-oat/70">
          {caption}
        </div>
      </div>
    </div>,
    document.body,
  );
}

/* ------------------------------ pagination ------------------------------- */

function Pagination({
  page,
  totalPages,
  total,
  onGo,
}: {
  page: number;
  totalPages: number;
  total: number;
  onGo: (p: number) => void;
}) {
  const pages = pageWindow(page, totalPages);
  const from = (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <nav
      aria-label="Reviews pagination"
      className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-sand/70 pt-6 sm:flex-row"
    >
      <p className="text-[0.78rem] text-espresso-mute tabular-nums">
        Showing {from}–{to} of {total.toLocaleString("en-US")} reviews
      </p>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onGo(page - 1)}
          disabled={page === 1}
          aria-label="Previous page"
          className="grid size-10 place-items-center rounded-full border border-sand bg-paper text-espresso transition-colors duration-200 hover:border-espresso disabled:pointer-events-none disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
            <path
              d="M14.5 6l-6 6 6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        {pages.map((p, i) =>
          p === "…" ? (
            <span
              key={`gap-${i}`}
              aria-hidden
              className="grid size-10 place-items-center text-[0.8rem] text-espresso-mute"
            >
              …
            </span>
          ) : (
            <button
              key={p}
              type="button"
              onClick={() => onGo(p)}
              aria-current={p === page ? "page" : undefined}
              aria-label={`Page ${p}`}
              className={cn(
                "grid size-10 place-items-center rounded-full border text-[0.82rem] font-medium tabular-nums transition-colors duration-200",
                p === page
                  ? "border-espresso bg-espresso text-cream"
                  : "border-sand bg-paper text-espresso-soft hover:border-espresso/40 hover:text-espresso",
              )}
            >
              {p}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => onGo(page + 1)}
          disabled={page === totalPages}
          aria-label="Next page"
          className="grid size-10 place-items-center rounded-full border border-sand bg-paper text-espresso transition-colors duration-200 hover:border-espresso disabled:pointer-events-none disabled:opacity-40"
        >
          <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
            <path
              d="M9.5 6l6 6-6 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </nav>
  );
}

/* -------------------------------- helpers -------------------------------- */

function EmptyFilterState({ onReset }: { onReset: () => void }) {
  return (
    <div className="mt-4 rounded-(--radius-card) border border-dashed border-line-strong bg-paper px-6 py-14 text-center">
      <p className="text-[0.95rem] font-medium text-espresso">
        No reviews match this filter yet.
      </p>
      <p className="mx-auto mt-2 max-w-sm text-[0.82rem] leading-relaxed text-espresso-mute">
        Try another star rating, or go back to see every review.
      </p>
      <button
        type="button"
        onClick={onReset}
        className="mt-5 rounded-full bg-espresso px-5 py-2.5 text-[0.82rem] font-semibold text-cream transition-opacity duration-200 hover:opacity-85"
      >
        Show all reviews
      </button>
    </div>
  );
}

/** Mask a name for display: "Marcus Turner" → "Ma***us Tu***er". */
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

function formatDate(ts: number): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(ts));
  } catch {
    return "";
  }
}

/** Numeric window with ellipsis gaps — e.g. [1, "…", 12, 13, 14, "…", 406]. */
function pageWindow(page: number, total: number): (number | "…")[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  const out: (number | "…")[] = [];
  const push = (n: number | "…") => {
    if (out[out.length - 1] === n) return;
    out.push(n);
  };
  push(1);
  if (page > 4) push("…");
  for (let i = Math.max(2, page - 1); i <= Math.min(total - 1, page + 1); i++) {
    push(i);
  }
  if (page < total - 3) push("…");
  push(total);
  return out;
}
