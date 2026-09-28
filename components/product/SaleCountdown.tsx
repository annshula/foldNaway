"use client";

import { useEffect, useState } from "react";

/** Digits only, no design decisions — remaining time to a real, merchant-set Shopify deadline. */
function remaining(
  target: number,
): { hours: number; minutes: number; seconds: number } | null {
  const ms = target - Date.now();
  if (ms <= 0) return null;
  const totalSeconds = Math.floor(ms / 1000);
  return {
    hours: Math.floor(totalSeconds / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

/**
 * Offer countdown — only ever renders a deadline the merchant actually set in
 * Shopify (`custom.sale_ends_at`); the sync scripts already drop a past
 * date, and this component hides itself the moment the real deadline passes
 * rather than freezing at 00:00:00 or looping. Modeled on
 * reference/components/product/SaleCountdown.tsx.
 *
 * Starts as `null` on both the server and the client's first paint — the
 * exact countdown text depends on the visitor's clock the moment their page
 * loads, which the server can never predict (worse with ISR: the HTML may
 * have been generated minutes or hours earlier). Computing it eagerly in
 * `useState`'s initializer would make the server-rendered text disagree with
 * what the client immediately recomputes — a React hydration-mismatch error
 * (#418), not just a visual flicker. Filling it in from an effect after
 * mount avoids that, at the cost of one tick where nothing renders.
 */
export function SaleCountdown({ endsAt }: { endsAt: string }) {
  const target = Date.parse(endsAt);
  const [left, setLeft] = useState<ReturnType<typeof remaining>>(null);

  useEffect(() => {
    setLeft(remaining(target));
    const id = setInterval(() => setLeft(remaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  if (!left) return null;

  return (
    <p
      className="font-label inline-flex items-center gap-1.5 rounded-full bg-terracotta-soft px-2.5 py-1 text-[0.65rem] font-bold tracking-widest text-terracotta uppercase tabular-nums"
      role="timer"
      aria-live="off"
    >
      Offer ends {pad(left.hours)}:{pad(left.minutes)}:{pad(left.seconds)}
    </p>
  );
}
