"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

import Button from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { easeOut } from "@/components/ui/Motion";
import { hero } from "@/content/copy";

const promiseIcons = ["truck", "fold", "leaf"] as const;

/**
 * Hero — full-bleed background photograph, with copy set to the left so the
 * product stays fully visible on the right with no scrim over it.
 *
 * The source photo (public/hero/foldnaway-hero.*) holds the bag on its
 * right side, so left-aligned type sits over the clearer left portion of the
 * frame. No gradient/scrim sits over the image — legibility comes from the
 * text column's own width and left alignment, not from darkening the photo.
 *
 * ── Requirement 1: the navbar shares the hero's background ──
 * The section pulls itself up under the sticky bar with `-mt-(--nav-h)`, so
 * at page load the transparent nav sits directly on this photograph and the
 * two read as one surface. Nav.tsx gives itself a background only on scroll.
 *
 * ── Requirement 2: the hero is at least one screen tall ──
 * `min-h-svh` (a floor, not a fixed height) at every breakpoint, matching
 * the reference build exactly — fixing the hero to exactly one viewport
 * (`h-svh`) is not a desktop behavior here; it was tried and reverted. A
 * fixed height is only right when the content stack is guaranteed to fit
 * the viewport at every breakpoint, and that guarantee doesn't hold once
 * content can be taller at one breakpoint than another (e.g. the mobile
 * centered layout, Requirement 3) — `min-h-svh` lets the section grow past
 * one viewport wherever its content needs it, on any screen size. `svh`,
 * not `vh`: on mobile `100vh` is measured against the *large* viewport,
 * taller than what's actually visible while the URL bar shows; `svh`
 * measures the visible box and, unlike `dvh`, is static, so nothing
 * re-lays-out mid-scroll as the bar hides.
 *
 * ── Requirement 3: mobile text is centered, desktop stays left ──
 * `text-center` below `md:`, `md:text-left` at `md:` and up. The outer
 * content wrapper was already `items-center` on mobile (to center the whole
 * block against a mobile hero photo with no clear "left side" the way the
 * desktop crop has), but the text inside it stayed `text-left` — a mismatch
 * that read as ragged/off-center type in a centered column. Centering the
 * text itself on mobile fixes that; desktop's left-aligned column (matched
 * to the desktop photo's product-on-the-right composition) is unchanged.
 *
 * ── Formats ──
 * <picture> offers AVIF, then WebP, then a JPEG fallback — same crop, three
 * encodings, smallest-first. A second, taller crop swaps in under 768px so
 * the bag stays in frame at a phone's aspect ratio.
 *
 * ── LCP ──
 * The h1 and subhead render as plain elements, not `motion.*` with variants.
 * They are the LCP candidate, and an opacity 0 → 1 entrance means the browser
 * cannot count them as rendered until hydration *and* the stagger timeline
 * finish — in the reference build that measured as ~2.7s of LCP render delay.
 * Motion stays on the CTAs and the promise row, which are not LCP-critical.
 */
export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const imageY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 90]);
  const contentY = useTransform(scrollYProgress, [0, 1], reduce ? [0, 0] : [0, 50]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.65], [1, 0]);

  return (
    <section
      ref={ref}
      id="top"
      className="grain relative isolate -mt-(--nav-h) flex min-h-svh flex-col overflow-hidden bg-cream px-5 sm:px-8"
    >
      {/* --------------------------- backdrop ---------------------------- */}
      <motion.div
        aria-hidden
        style={{ y: imageY }}
        className="pointer-events-none absolute inset-x-0 -bottom-12 -z-10 h-[118%] w-full will-change-transform"
      >
        <picture>
          <source
            media="(max-width: 767px)"
            type="image/avif"
            srcSet="/hero/foldnaway-hero-mobile.avif"
          />
          <source
            media="(max-width: 767px)"
            type="image/webp"
            srcSet="/hero/foldnaway-hero-mobile.webp"
          />
          <source type="image/avif" srcSet="/hero/foldnaway-hero.avif" />
          <source type="image/webp" srcSet="/hero/foldnaway-hero.webp" />
          {/* eslint-disable-next-line @next/next/no-img-element -- a
              hand-authored <picture> needs a plain <img> fallback; next/image
              can't emit multi-format <source> sets. */}
          <img
            src="/hero/foldnaway-hero.jpg"
            alt=""
            fetchPriority="high"
            decoding="async"
            className="h-full w-full object-cover object-[65%_100%] md:object-[62%_100%]"
          />
        </picture>
      </motion.div>

      {/* ----------------------------- content ---------------------------- */}
      {/* Mobile and desktop use genuinely different layout strategies here,
          not just different alignment:
           - Desktop (md: and up): `flex-1` + `justify-center`, same as
             before — the section is pulled up under the nav by
             `-mt-(--nav-h)` (see the section className below), so this
             box already spans exactly the true viewport height, and the
             desktop copy (2-line headline, left-aligned) reliably fits
             within it with room to spare. The nav floats on top via its
             own `sticky` position, so it doesn't need to be excluded from
             this box by padding.
           - Mobile (below md:): plain top-down flow with real `pt-*` to
             clear the nav and `pb-*` for bottom breathing room, no
             `flex-1`/`justify-center`. Forcing mobile into that same
             "exactly one viewport, centered" box silently crammed
             everything to fit whenever the content was taller than the
             screen (eyebrow colliding with the nav, the second button and
             promise row squeezed against the bottom edge) — `justify-center`
             centers within whatever height it's given without ever
             signalling "I need more room," so the browser never grew the
             section past one viewport even though `min-h-svh` allows it.
             Natural flow lets the section grow taller than one screen
             exactly when the (now 3-line, centered) mobile copy needs it. */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-310 flex-col items-center pt-28 pb-14 text-center md:flex-1 md:items-start md:justify-center md:pt-0 md:pb-0 md:text-left"
      >
        <p className="font-label text-[0.68rem] font-semibold tracking-[0.26em] text-sage-deep uppercase">
          {hero.eyebrow}
        </p>

        <h1 className="font-display mt-6 w-full max-w-[14ch] text-[clamp(2.25rem,5.5vw,4rem)] leading-[1.05] font-medium tracking-[-0.03em] text-espresso text-balance">
          {hero.headline[0]}
          <br />
          {hero.headline[1]}
        </h1>

        <p className="mt-6 max-w-[48ch] text-[clamp(1rem,1.5vw,1.12rem)] leading-[1.65] text-espresso-soft text-pretty">
          {hero.sub}
        </p>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.25, ease: easeOut }}
          className="mt-10 flex flex-col items-center gap-3.5 sm:flex-row sm:gap-4 md:items-start"
        >
          <Button href={hero.ctaHref} size="lg" arrow className="min-w-56">
            {hero.cta}
          </Button>
          {/* variant="outline" is espresso-on-transparent — reads fine on
              desktop's crop (button sits over the open left side of the
              photo) but is nearly illegible on mobile, where this button
              lands over the black bag itself. Two separate buttons, each
              hidden at the other breakpoint, rather than one button with a
              className colour override: Button.tsx concatenates its variant
              styles and any passed className with a plain template string
              (no cn()/tailwind-merge), so a later className utility isn't
              guaranteed to beat an earlier same-property variant utility —
              confirmed the hard way: a first attempt at `hidden
              md:inline-flex` directly on the Button rendered BOTH buttons on
              mobile, because `shell`'s own `inline-flex` (display:
              inline-flex) was compiled earlier in the build than this
              page's `hidden` (display: none) and won regardless of string
              order. `display: contents` wrapper divs sidestep this
              entirely: the visibility toggle lives on an element with no
              other classes to conflict with, and `contents` removes the
              wrapper from the box tree so it doesn't affect the Button's
              own flex-item sizing either. */}
          <div className="contents md:hidden">
            <Button href={hero.secondaryHref} size="lg" variant="ghost">
              {hero.secondary}
            </Button>
          </div>
          <div className="hidden md:contents">
            <Button href={hero.secondaryHref} size="lg" variant="outline">
              {hero.secondary}
            </Button>
          </div>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42, ease: easeOut }}
          className="mt-11 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:justify-start"
        >
          {/* Same mobile-vs-desktop colour problem as the outline button
              above: text-espresso-mute/text-sage-deep are dark, and on
              mobile this row sits over the black bag in the photo, not the
              open cream desktop crop. Light on mobile, back to the normal
              dark tones at md: and up. */}
          {hero.promise.map((line, i) => (
            <li
              key={line}
              className="font-label flex items-center gap-2 text-[0.7rem] font-medium tracking-widest text-oat uppercase md:text-espresso-mute"
            >
              <Icon
                name={promiseIcons[i] ?? "check"}
                className="size-4 text-oat md:text-sage-deep"
              />
              {line}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
