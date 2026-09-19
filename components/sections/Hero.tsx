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
 * ── Requirement 2: the hero fits the screen exactly ──
 * `h-svh` (a fixed height, not a minimum) — see the reference's own
 * `min-h-svh` note: this build uses the fixed form because a fixed height is
 * the version that's actually guaranteed to stop at the fold; `min-h-svh`
 * only sets a floor; and there's no longer an intrinsic-height child that
 * could push past it. `svh`, not `vh`: on mobile `100vh` is measured against
 * the *large* viewport, taller than what's actually visible while the URL
 * bar shows; `svh` measures the visible box and, unlike `dvh`, is static, so
 * nothing re-lays-out mid-scroll as the bar hides.
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
      className="grain relative isolate -mt-(--nav-h) flex h-svh flex-col overflow-hidden bg-cream px-5 sm:px-8"
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
      {/* The section is pulled up under the nav by `-mt-(--nav-h)` (see the
          section className below), so this flex-1 wrapper's box already
          spans exactly the true viewport height — `justify-center` here
          centres against the real svh, not a nav-padded remainder. The nav
          itself floats on top via its own `sticky` position, so it doesn't
          need to be excluded from this box by padding. */}
      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 mx-auto flex w-full max-w-310 flex-1 flex-col items-center justify-center text-left md:items-start"
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
          <Button href={hero.secondaryHref} size="lg" variant="outline">
            {hero.secondary}
          </Button>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42, ease: easeOut }}
          className="mt-11 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 md:justify-start"
        >
          {hero.promise.map((line, i) => (
            <li
              key={line}
              className="font-label flex items-center gap-2 text-[0.7rem] font-medium tracking-widest text-espresso-mute uppercase"
            >
              <Icon
                name={promiseIcons[i] ?? "check"}
                className="size-4 text-sage-deep"
              />
              {line}
            </li>
          ))}
        </motion.ul>
      </motion.div>
    </section>
  );
}
