import { site } from "@/lib/site";

/**
 * The brand mark — the full logo artwork (icon + its own baked-in
 * "Foldnaway" wordmark, cropped from the supplied lockup only to drop the
 * "carry more of you" tagline strip below it), image only — no separate CSS
 * text beside it. The image's own wordmark is what carries the name here.
 * Two source files, one per surface:
 *
 *   public/brand/logo-dark.png  — espresso ink, for light/cream surfaces.
 *   public/brand/logo-white.png — white ink, for dark surfaces (the mobile
 *     menu drawer, and the header while it's transparent over Hero.tsx's
 *     mobile-only dark scrim).
 *
 * Both files share the exact same 500×311 frame (the white crop was padded
 * to match, not just cropped tighter) so swapping the source never changes
 * the mark's box size/aspect ratio — no layout shift between variants.
 * Plain `<img>`, not the site's Image wrapper: these are small (~25KB)
 * local static files the wrapper's Shopify-CDN loader logic doesn't apply
 * to, and the header logo is always above the fold, so next/image's lazy
 * loading would only add overhead here, not save anything.
 *
 * `light-mobile` needs to react to a breakpoint rather than a fixed surface
 * (Nav.tsx passes this only on the homepage while unscrolled — see its own
 * comment). A `<picture>` with a `media` query on the `<source>` is the
 * browser-native way to do that — only the matching image is ever
 * downloaded, unlike two stacked `<img>`s hidden with CSS (which would
 * fetch both every time).
 */
const MARK_WIDTH = 500;
const MARK_HEIGHT = 311;

export function Logo({
  variant = "dark",
  className = "",
}: {
  /** `dark` = espresso mark, for light surfaces. `light` = white mark, for
      dark ones (the mobile menu drawer). `light-mobile` = white mark below
      `md:`, reverting to plain `dark` at `md:` and up. */
  variant?: "dark" | "light" | "light-mobile";
  className?: string;
}) {
  const light = variant === "light";

  const mark =
    variant === "light-mobile" ? (
      <picture>
        <source media="(min-width: 768px)" srcSet="/brand/logo-dark.png" />
        <img
          src="/brand/logo-white.png"
          alt={site.name}
          width={MARK_WIDTH}
          height={MARK_HEIGHT}
          className="h-full w-auto object-contain"
        />
      </picture>
    ) : (
      <img
        src={light ? "/brand/logo-white.png" : "/brand/logo-dark.png"}
        alt={site.name}
        width={MARK_WIDTH}
        height={MARK_HEIGHT}
        className="h-full w-auto object-contain"
      />
    );

  return (
    <a
      href="/"
      aria-label={`${site.name}, home`}
      className={`inline-flex items-center transition-opacity duration-300 hover:opacity-80 ${className}`}
    >
      <span className="h-12 shrink-0">{mark}</span>
    </a>
  );
}
