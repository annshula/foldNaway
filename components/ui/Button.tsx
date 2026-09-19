import type { ReactNode } from "react";
import { ArrowIcon } from "./Icons";

type Variant = "sage" | "invert" | "ghost" | "outline" | "outline-primary" | "espresso";

const base = {
  sm: "h-10 text-[0.78rem]",
  md: "h-12 text-[0.82rem]",
  lg: "h-14 text-[0.9rem]",
} as const;

/**
 * Arrow buttons keep symmetric padding so the label still sits on the true
 * button centre: the arrow variant grows both paddings by half the icon
 * footprint (1rem icon + 0.625rem gap), preserving the pill width while
 * reserving room for an icon pinned to the right edge.
 */
const pad = {
  sm: { plain: "px-4", arrow: "px-[1.8125rem]" },
  md: { plain: "px-6", arrow: "px-[2.3125rem]" },
  lg: { plain: "px-8", arrow: "px-[2.8125rem]" },
} as const;

const iconPos = {
  sm: "right-3",
  md: "right-3.5",
  lg: "right-4",
} as const;

/**
 * sage            — the brand CTA on light/cream surfaces
 * invert          — solid cream on the dark hero and footer
 * ghost           — hairline over imagery
 * outline         — quiet secondary on cream, faint espresso border/text
 * outline-primary — espresso border/text on transparent, filling solid
 *                   espresso (cream text) on hover — a second CTA that
 *                   still needs real presence next to a solid button,
 *                   without being filled at rest.
 * espresso        — solid espresso fill with cream text, always (not just
 *                   on hover) — the dark equivalent of `sage`, for when a
 *                   button needs that same fully-filled weight but in the
 *                   dark/neutral tone instead of the brand green.
 *
 * The hover sheen is a single translated pseudo-gradient, so it costs one
 * composited layer rather than a repaint.
 */
export default function Button({
  children,
  variant = "sage",
  size = "lg",
  arrow = false,
  href,
  onClick,
  disabled = false,
  type = "button",
  className = "",
  title,
  "aria-label": ariaLabel,
  target,
  rel,
}: {
  children: ReactNode;
  variant?: Variant;
  size?: keyof typeof base;
  arrow?: boolean;
  /** When present, renders an anchor; otherwise a button. */
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  className?: string;
  title?: string;
  "aria-label"?: string;
  target?: string;
  rel?: string;
}) {
  const shell =
    "group relative inline-flex items-center justify-center gap-2.5 overflow-hidden rounded-full font-button leading-none tracking-[0.01em] whitespace-nowrap transition-all duration-400 ease-(--ease-out-expo) will-change-transform";

  const styles: Record<Variant, string> = {
    sage: "bg-sage text-on-accent shadow-(--shadow-e2) hover:-translate-y-0.5 hover:bg-sage-hot hover:shadow-(--shadow-e3) active:translate-y-0",
    invert:
      "bg-cream text-espresso shadow-(--shadow-e2) hover:-translate-y-0.5 hover:shadow-(--shadow-e3) active:translate-y-0",
    ghost:
      "border border-white/25 text-oat backdrop-blur-sm hover:border-white/45 hover:bg-white/10 hover:text-white",
    outline:
      "border border-espresso/20 bg-transparent text-espresso hover:border-espresso/45 hover:bg-espresso/[0.04]",
    // Deliberately plain `border` (1px), not `border-2`: this codebase's
    // Tailwind build silently fails to generate a border-color rule when
    // `border-2` and a `border-<color>` utility are combined (confirmed by
    // inspecting the compiled stylesheet — no `.border-espresso` rule
    // existed at all when paired with `border-2`, leaving the universal
    // `* { border-color: var(--color-line) } ` reset as the only rule that
    // applied, so the border silently fell back to sand instead of
    // espresso). `border` + `border-espresso` is the same combination
    // already proven working elsewhere in this codebase (ProductReviews.tsx).
    "outline-primary":
      "border border-espresso bg-transparent text-espresso hover:bg-espresso hover:text-cream",
    espresso:
      "bg-espresso text-cream shadow-(--shadow-e2) hover:-translate-y-0.5 hover:bg-bark hover:shadow-(--shadow-e3) active:translate-y-0",
  };

  const classes = `${shell} ${base[size]} ${
    arrow ? pad[size].arrow : pad[size].plain
  } ${styles[variant]} ${className}${
    disabled ? " pointer-events-none opacity-50" : ""
  }`;

  const content = (
    <>
      {(variant === "sage" || variant === "invert") && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 -translate-x-full bg-[linear-gradient(105deg,transparent_38%,rgba(255,255,255,0.3)_50%,transparent_62%)] transition-transform duration-900 ease-(--ease-out-expo) group-hover:translate-x-full"
        />
      )}
      <span className="relative">{children}</span>
      {arrow && (
        <ArrowIcon
          className={`absolute top-1/2 h-4 w-4 -translate-y-1/2 ${iconPos[size]} transition-transform duration-400 ease-(--ease-out-expo) group-hover:translate-x-1`}
        />
      )}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        title={title}
        aria-label={ariaLabel}
        target={target}
        rel={rel}
      >
        {content}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      title={title}
      aria-label={ariaLabel}
      className={classes}
    >
      {content}
    </button>
  );
}
