"use client";

import { useEffect, useState, type RefObject } from "react";

/**
 * True once `el` has scrolled off the TOP of the viewport (the shopper has
 * scrolled past it), false again the moment it's back in view — never true
 * purely because `el` happens to be off-screen for some other reason (e.g.
 * `display: none`). Shared by StickyAddToCart and ScrollToTop so both
 * show/hide on the exact same crossing, not two independently-tuned
 * thresholds that could drift apart.
 */
export function useScrollPastElement(
  elRef: RefObject<HTMLElement | null>,
): boolean {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = elRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Off the top specifically (boundingClientRect.top < 0), not just
        // "not intersecting" — that would also fire while the shopper is
        // still above it near the page header, before ever reaching it.
        setVisible(
          Boolean(entry) &&
            !entry.isIntersecting &&
            entry.boundingClientRect.top < 0,
        );
      },
      { threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [elRef]);

  return visible;
}
