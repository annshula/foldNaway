"use client";

import { useCallback, useId, useRef, useState } from "react";

import Image from "@/components/ui/Image";
import { cn } from "@/lib/utils";

type Side = {
  src: string;
  alt: string;
  label: string;
  /** Local multi-format sources (public/), smallest-first — AVIF, then WebP.
      `src` is still required as the plain-<img> fallback and as what a
      Shopify-hosted slide uses on its own (that path renders through the
      shared `Image` component instead of a hand-authored `<picture>`, same
      split Hero.tsx documents on its own backdrop picture). */
  avif?: string;
  webp?: string;
};

/** A local (public/) multi-format photo: real <source> negotiation, smallest
    encoding first — same reasoning as Hero.tsx's own <picture>, which this
    mirrors rather than routing through next/image (no multi-format <source>
    support there for a fixed set of pre-built files). */
function PictureSide({ side, className }: { side: Side; className: string }) {
  return (
    <picture>
      {side.avif && <source type="image/avif" srcSet={side.avif} />}
      {side.webp && <source type="image/webp" srcSet={side.webp} />}
      {/* eslint-disable-next-line @next/next/no-img-element -- multi-format
          <picture> needs a plain <img> fallback; next/image can't emit
          multi-format <source> sets. */}
      <img
        src={side.src}
        alt={side.alt}
        draggable={false}
        className={className}
      />
    </picture>
  );
}

/**
 * Before/after image comparison: one photo clipped to the left of a
 * draggable vertical divider, the other filling the frame behind it. Drag
 * (mouse or touch) or use the arrow keys once the handle has focus — the
 * handle is a real `role="slider"` so it's reachable and operable without a
 * pointer, not just decoration.
 *
 * Position is tracked as a percent (0–100) of the frame's own width, so the
 * divider tracks correctly at any container size without recalculating
 * pixel math on resize.
 */
export function CompareSlider({ before, after }: { before: Side; after: Side }) {
  const [position, setPosition] = useState(50);
  const frameRef = useRef<HTMLDivElement>(null);
  const dragging = useRef(false);
  const labelId = useId();

  const updateFromClientX = useCallback((clientX: number) => {
    const frame = frameRef.current;
    if (!frame) return;
    const rect = frame.getBoundingClientRect();
    const pct = ((clientX - rect.left) / rect.width) * 100;
    setPosition(Math.min(100, Math.max(0, pct)));
  }, []);

  const startDrag = useCallback(
    (clientX: number) => {
      dragging.current = true;
      updateFromClientX(clientX);
    },
    [updateFromClientX],
  );

  const onPointerDown = (e: React.PointerEvent) => {
    (e.target as Element).setPointerCapture(e.pointerId);
    startDrag(e.clientX);
  };
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging.current) return;
    updateFromClientX(e.clientX);
  };
  const onPointerUp = () => {
    dragging.current = false;
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.shiftKey ? 10 : 3;
    if (e.key === "ArrowLeft") {
      setPosition((p) => Math.max(0, p - step));
      e.preventDefault();
    } else if (e.key === "ArrowRight") {
      setPosition((p) => Math.min(100, p + step));
      e.preventDefault();
    } else if (e.key === "Home") {
      setPosition(0);
      e.preventDefault();
    } else if (e.key === "End") {
      setPosition(100);
      e.preventDefault();
    }
  };

  return (
    <div className="w-full">
      <div
        ref={frameRef}
        className="relative aspect-16/10 w-full touch-none overflow-hidden rounded-card border border-sand/70 bg-white select-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        {/* After: fills the frame, sits behind. object-contain (not cover):
            both photos are square (1254×1254) inside a wider 16:10 frame —
            cover would crop the top/bottom off to fill it, which is the
            "zoom" that got reported. contain always shows the whole photo,
            letterboxed on the frame's own bg-white instead — the photos'
            own flattened background is white (see ProductDetails.tsx's
            comment), so a mismatched cream frame showed as a visible seam
            around each letterboxed edge. */}
        {after.avif || after.webp ? (
          <PictureSide
            side={after}
            className="absolute inset-0 size-full object-contain"
          />
        ) : (
          <Image
            src={after.src}
            alt={after.alt}
            fill
            sizes="(max-width: 640px) 100vw, 640px"
            quality={80}
            className="object-contain"
            draggable={false}
          />
        )}

        {/* Before: clipped to the divider's left side, on top. */}
        <div
          className="absolute inset-0 overflow-hidden"
          style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}
        >
          {before.avif || before.webp ? (
            <PictureSide
              side={before}
              className="absolute inset-0 size-full object-contain"
            />
          ) : (
            <Image
              src={before.src}
              alt={before.alt}
              fill
              sizes="(max-width: 640px) 100vw, 640px"
              quality={80}
              className="object-contain"
              draggable={false}
            />
          )}
        </div>

        {/* Side labels — each fades as the divider covers it. */}
        <span
          aria-hidden
          className="font-label pointer-events-none absolute top-3 left-3 rounded-full bg-espresso/75 px-2.5 py-1 text-[0.62rem] font-semibold tracking-widest text-cream uppercase backdrop-blur transition-opacity duration-200"
          style={{ opacity: position > 14 ? 1 : 0 }}
        >
          {before.label}
        </span>
        <span
          aria-hidden
          className="font-label pointer-events-none absolute top-3 right-3 rounded-full bg-espresso/75 px-2.5 py-1 text-[0.62rem] font-semibold tracking-widest text-cream uppercase backdrop-blur transition-opacity duration-200"
          style={{ opacity: position < 86 ? 1 : 0 }}
        >
          {after.label}
        </span>

        {/* Divider line + drag handle. */}
        <div
          className="pointer-events-none absolute inset-y-0 w-0.5 bg-cream shadow-[0_0_0_1px_rgb(46_38_32/0.15)]"
          style={{ left: `${position}%` }}
        />
        <div
          role="slider"
          tabIndex={0}
          aria-label={`Comparison: ${before.label} vs ${after.label}`}
          aria-labelledby={labelId}
          aria-valuenow={Math.round(position)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-orientation="horizontal"
          onKeyDown={onKeyDown}
          onPointerDown={onPointerDown}
          className={cn(
            "absolute top-1/2 grid size-11 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full bg-cream text-espresso shadow-(--shadow-e3) outline-none transition-transform duration-150",
            "focus-visible:ring-2 focus-visible:ring-sage focus-visible:ring-offset-2 focus-visible:ring-offset-cream active:scale-95",
          )}
          style={{ left: `${position}%` }}
        >
          <svg viewBox="0 0 24 24" className="size-4.5" aria-hidden>
            <path
              d="M9 6 4 12l5 6M15 6l5 6-5 6"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <p id={labelId} className="sr-only">
        Drag the handle, or focus it and use the arrow keys, to compare{" "}
        {before.label.toLowerCase()} with {after.label.toLowerCase()}.
      </p>
    </div>
  );
}
