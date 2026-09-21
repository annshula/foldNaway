"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { Icon } from "@/components/ui/Icons";
import { useScrollPastElement } from "@/lib/use-scroll-past-element";
import { cn } from "@/lib/utils";

/**
 * A small circular "back to top" button, bottom-right — the product page
 * runs long (gallery, reviews, quality checks, FAQ). Shares `watchRef` with
 * StickyAddToCart and the same useScrollPastElement hook, so this shows and
 * hides on the exact same crossing (visible once the BuyBox CTA scrolls out
 * of view scrolling down, hidden the instant it's back in view) rather than
 * a separately-tuned scroll threshold that could drift out of sync with it.
 *
 * StickyAddToCart is a full-width bar on mobile (not confined to one
 * corner), so avoiding it there means stacking above it: this button sits at
 * a fixed offset tall enough to clear the bar's stacked mobile height, then
 * drops back to a normal corner offset from `lg` up, where StickyAddToCart
 * is hidden (the real BuyBox sits beside the gallery there instead).
 * Portalled to `document.body` so it never scopes to a clipped/transformed
 * ancestor.
 */
export function ScrollToTop({
  watchRef,
}: {
  /** BuyBox's own wrapper — same ref StickyAddToCart watches. */
  watchRef: React.RefObject<HTMLElement | null>;
}) {
  const visible = useScrollPastElement(watchRef);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <button
      type="button"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "auto"
            : "smooth",
        })
      }
      aria-hidden={!visible}
      inert={!visible}
      aria-label="Back to top"
      className={cn(
        "fixed right-3 bottom-[calc(env(safe-area-inset-bottom)+6.5rem)] z-60 grid size-11 place-items-center rounded-full border border-sand bg-cream text-espresso shadow-(--shadow-lift) transition-all duration-300 ease-(--ease-out-expo) hover:border-espresso/40 sm:right-6 lg:bottom-[calc(env(safe-area-inset-bottom)+1.5rem)] lg:size-12",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
    >
      <Icon name="arrow-right" className="size-4 -rotate-90" />
    </button>,
    document.body,
  );
}
