import { cn } from "@/lib/utils";

/**
 * Star rating primitives for the review UI.
 *
 * - `StarRow` — whole stars for a single review ("4 out of 5").
 * - `RatingStars` — fractional precision for aggregate figures (4.9), drawn
 *   as an outline row under a sage fill clipped to `value / 5` width, so a
 *   partial fifth star reads accurately instead of rounding up to 5.
 *
 * Filled = sage (the brand accent), empty = line-strong (a quiet warm
 * hairline) — see app/globals.css @theme.
 */

function StarIcon({
  filled,
  className,
}: {
  filled: boolean;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden>
      <path
        d="M12 3.6l2.6 5.28 5.83.85-4.22 4.11.997 5.81L12 16.93l-5.21 2.74.996-5.81-4.22-4.11 5.83-.85z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0 : 1.5}
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Row({ count, className }: { count: number; className?: string }) {
  return (
    <>
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon
          key={i}
          filled={i < count}
          className={cn("h-3.5 w-3.5 shrink-0", className)}
        />
      ))}
    </>
  );
}

export function StarRow({
  stars,
  className,
  starClassName,
}: {
  stars: number;
  className?: string;
  starClassName?: string;
}) {
  return (
    <span
      role="img"
      aria-label={`${stars} out of 5 stars`}
      className={cn("inline-flex items-center gap-0.5", className)}
    >
      {Array.from({ length: 5 }, (_, i) => (
        <StarIcon
          key={i}
          filled={i < stars}
          className={cn(
            "h-3.5 w-3.5 shrink-0",
            i < stars ? "text-sage" : "text-line-strong",
            starClassName,
          )}
        />
      ))}
    </span>
  );
}

export function RatingStars({
  value,
  className,
  starClassName,
}: {
  value: number;
  className?: string;
  starClassName?: string;
}) {
  const clamped = Math.max(0, Math.min(5, value));
  const pct = (clamped / 5) * 100;
  return (
    <span
      role="img"
      aria-label={`${clamped} out of 5 stars`}
      className={cn("relative inline-flex items-center", className)}
    >
      <span className="flex items-center gap-0.5 text-line-strong">
        <Row count={0} className={starClassName} />
      </span>
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 overflow-hidden"
        style={{ width: `${pct}%` }}
      >
        <span className="flex items-center gap-0.5 text-sage">
          <Row count={5} className={starClassName} />
        </span>
      </span>
    </span>
  );
}
