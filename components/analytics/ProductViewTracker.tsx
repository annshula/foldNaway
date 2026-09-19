"use client";

import { useEffect, useRef } from "react";

import { trackViewContent } from "@/lib/analytics";

/**
 * Fires Meta `ViewContent` / GA4 `view_item` / TikTok `ViewContent` once per
 * product page view.
 *
 * The `fired` ref blocks any further fire for the life of this mount — a
 * plain empty-deps effect fires twice under React Strict Mode in dev, which
 * would double-count the event.
 *
 * NOTE: this store is single-currency (USD), so the amount passed in is the
 * catalog price as rendered. If multi-currency is added later, feed the
 * shopper's localized amount in through `amount` so the event value always
 * matches what is actually on screen.
 */
export function ProductViewTracker({
  variantId,
  name,
  amount,
  currencyCode,
}: {
  variantId: string;
  name: string;
  amount: number;
  currencyCode: string;
}) {
  const fired = useRef(false);

  useEffect(() => {
    if (fired.current) return;
    fired.current = true;
    trackViewContent(
      { slug: variantId, name, priceCents: Math.round(amount * 100) },
      currencyCode,
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
}
