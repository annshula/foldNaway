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
  /** `dark` = espresso "Fold"/"Away" + sage "N", for light surfaces.
      `light` = oat "Fold"/"Away" + sage-soft "N", for dark ones (the mobile
      menu drawer). `light-mobile` = oat "Fold"/"Away" + sage-soft "N" below
      `md:`, reverting to plain `dark` (espresso/sage) at `md:` and up — for
      the one spot the header itself needs to react to a breakpoint rather
      than a fixed surface: Nav.tsx passes this only on the homepage while
      unscrolled, the one state where the transparent header sits over
      Hero.tsx's mobile-only dark scrim but desktop's lighter crop
      underneath doesn't need it. Every other page/state keeps plain
      `dark`. */
  variant?: "dark" | "light" | "light-mobile";
  className?: string;
}) {
  const light = variant === "light";
  const lightMobile = variant === "light-mobile";
  return (
    <a
      href="/"
      aria-label={`${site.name}, home`}
      className={`font-logo inline-flex items-baseline text-[1.4rem] leading-none font-semibold tracking-[-0.02em] transition-opacity duration-300 hover:opacity-80 ${
        light
          ? "text-oat"
          : lightMobile
            ? "text-oat md:text-espresso"
            : "text-espresso"
      } ${className}`}
    >
      Fold
      <span
        className={lightMobile ? "text-sage-soft md:text-sage" : "text-sage"}
        aria-hidden
      >
        N
      </span>
      Away
    </a>
  );
}
