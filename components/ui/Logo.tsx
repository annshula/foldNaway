import { site } from "@/lib/site";

/**
 * Wordmark, set in the brand's own logo font (Fraunces, via `.font-logo`)
 * — no image asset, so it is crisp at every density, themeable via
 * currentColor, and costs no request. Deliberately on its own token, not
 * `.font-display` (headings): the brand mark must stay fixed no matter how
 * heading type changes elsewhere on the site. The "N" sits in the accent
 * and at a smaller size so "Fold" and "Away" read as the two halves of the
 * name rather than one long word.
 */
export function Logo({
  variant = "dark",
  className = "",
}: {
  /** `dark` = espresso type for light surfaces, `light` = oat for dark ones. */
  variant?: "dark" | "light";
  className?: string;
}) {
  return (
    <a
      href="/"
      aria-label={`${site.name}, home`}
      className={`font-logo inline-flex items-baseline text-[1.4rem] leading-none font-semibold tracking-[-0.02em] transition-opacity duration-300 hover:opacity-80 ${
        variant === "light" ? "text-oat" : "text-espresso"
      } ${className}`}
    >
      Fold
      <span className="text-sage" aria-hidden>
        N
      </span>
      Away
    </a>
  );
}
