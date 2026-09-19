"use client";

import { useEffect, useRef, useState } from "react";

import Image from "@/components/ui/Image";
import { Icon } from "@/components/ui/Icons";
import type { MediaItem, Product } from "@/lib/product";
import { cn } from "@/lib/utils";

/** The thumbnail image for any gallery entry — a video's own poster frame for a video, its photo for an image. Also doubles as the React `key` (poster/src URLs are unique per entry). */
function thumbSrc(item: MediaItem): string {
  return item.kind === "video" ? item.poster : item.src;
}

/**
 * Product gallery: a thumbnail rail plus one large main slot — clicking (or
 * tapping) a thumbnail swaps the main slot directly, no carousel state to
 * animate through. Reads `product.media` (images and video interleaved, in
 * real Shopify merchandising order), not the images-only `product.gallery`
 * — a video entry in Shopify Admin shows up here with its poster frame in
 * the rail and a play badge, same as the reference build.
 *
 * Clicking a video thumbnail swaps the main slot to a real `<video>` and
 * starts it playing immediately: the click itself is the user gesture that
 * makes unmuted `autoPlay` allowed, so `video.play()` is called explicitly
 * in the click handler rather than relying on the `autoPlay` attribute
 * (which only fires on mount — useless here, since the element it belongs
 * to doesn't exist until this same click creates it). Clicking away to an
 * image (or another video) unmounts it via React's `key`, which stops
 * playback for free — no manual pause needed.
 *
 * The rail is capped to its own fixed height (max-h-115, see below) so with
 * more thumbnails than fit, the *rail* scrolls independently of the page —
 * vertically at `sm:` and up (left column beside the image), horizontally
 * below it (a row above the image, native touch-swipe/scroll, same
 * overflow-scroll mechanism as desktop, just the other axis).
 *
 * `activeSrc` is driven by the parent so choosing a colourway in the BuyBox
 * moves this gallery to that variant's photo. Clicking a thumbnail here only
 * changes the local index — it deliberately does NOT change the selected
 * variant, because browsing the media is not the same act as choosing what
 * to buy. Variant images are always photos, so this only ever matches an
 * image entry, same as the reference.
 */
export function ProductGallery({
  product,
  activeSrc,
}: {
  product: Product;
  activeSrc?: string;
}) {
  const media = product.media;
  const [index, setIndex] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Follow the parent's variant image when it changes, if that image is in
  // the gallery. A variant photo that isn't in the gallery leaves the view
  // where it is rather than blanking it.
  useEffect(() => {
    if (!activeSrc) return;
    const found = media.findIndex(
      (m) => m.kind === "image" && m.src === activeSrc,
    );
    if (found >= 0) setIndex(found);
  }, [activeSrc, media]);

  if (media.length === 0) return null;
  const current = media[Math.min(index, media.length - 1)];
  const isVideo = current.kind === "video";

  return (
    // Height matches reference/components/product/ProductGallery.tsx: the
    // *rail* alone is capped (max-h-115, 460px), not the whole row.
    //
    // `sm:items-start` is load-bearing, not decoration: a flex row with no
    // `items-*` defaults to `align-items: stretch`, which silently forces
    // every flex child to the row's own height — INCLUDING the main slot,
    // overriding its `aspect-square` entirely. That's what was actually
    // making the gallery too tall (measured: a 460×460 box rendering at
    // 460×784 in production, `aspect-ratio: 1/1` present in computed style
    // but overridden by the stretch-driven explicit height). `items-start`
    // lets each column size itself from its own content/aspect-ratio
    // instead of inheriting the tallest sibling's height.
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-start">
      {media.length > 1 && (
        <ul className="scrollbar-none flex shrink-0 gap-2 overflow-x-auto sm:max-h-115 sm:w-19 sm:flex-col sm:overflow-x-visible sm:overflow-y-auto">
          {media.map((item, i) => (
            <li key={thumbSrc(item)} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={
                  item.kind === "video"
                    ? "Play product video"
                    : `Show image ${i + 1} of ${media.length}`
                }
                aria-pressed={i === index}
                className={cn(
                  // The selected thumbnail's border is deliberately doubled
                  // up (2px border-sage + an offset ring in the same
                  // colour) rather than just the plain 2px border every
                  // other state already used — a same-weight border read as
                  // "barely different" next to the unselected 2px
                  // transparent border; the extra ring-offset gives the
                  // active thumb a visible gap of its own colour around it,
                  // not just a colour swap on an identical-weight line.
                  "relative block size-14 overflow-hidden rounded-lg border-2 bg-cream-deep transition-all duration-300 sm:size-16",
                  i === index
                    ? "border-sage ring-2 ring-sage ring-offset-2 ring-offset-cream"
                    : "border-transparent hover:border-sand-strong",
                )}
              >
                <Image
                  src={thumbSrc(item)}
                  // The <button>'s own aria-label already names each
                  // thumbnail ("Play product video" / "Show image N of
                  // M") — an alt here too would announce it twice.
                  alt=""
                  fill
                  sizes="64px"
                  quality={65}
                  className="object-cover"
                />
                {item.kind === "video" && (
                  <span
                    aria-hidden
                    className="absolute inset-0 grid place-items-center bg-espresso/30"
                  >
                    <span className="grid size-6 place-items-center rounded-full bg-cream/90 text-espresso">
                      <Icon name="play" className="ml-0.5 size-3" />
                    </span>
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* aspect-square + max-w-115 (matching the reference) sizes this to
          460×460px at its cap, on every breakpoint — not bounded by a
          shared row height, so it can't grow taller than the reference's
          own main slot does. */}
      <div className="relative aspect-square w-full max-w-full overflow-hidden rounded-card bg-cream-deep lg:max-w-115">
        {isVideo ? (
          <video
            key={current.poster}
            ref={videoRef}
            controls
            playsInline
            poster={current.poster}
            className="h-full w-full object-cover"
            // autoPlay alone only fires once, on mount — this element is
            // created by the very click that selects it, so React has
            // already mounted it *with* the attribute by the time the
            // click handler above returns. Kept as a fallback for browsers
            // that don't block it; the explicit ref.play() a frame later
            // (below) is what actually guarantees playback starts,
            // covering browsers that ignore the attribute on a
            // freshly-mounted element.
            autoPlay
            onCanPlay={() => videoRef.current?.play().catch(() => {})}
          >
            {current.sources.map((s) => (
              <source key={s.src} src={s.src} type={s.type} />
            ))}
          </video>
        ) : (
          <Image
            key={current.src}
            src={current.src}
            alt={current.alt}
            fill
            priority={index === 0}
            sizes="(max-width: 1024px) 100vw, 460px"
            quality={82}
            className="animate-fade-in object-cover"
          />
        )}

        {media.length > 1 && !isVideo && (
          <span className="font-label pointer-events-none absolute right-3 bottom-3 rounded-full bg-espresso/75 px-2.5 py-1 text-[0.62rem] font-semibold tracking-widest text-cream tabular-nums backdrop-blur">
            {index + 1} / {media.length}
          </span>
        )}
      </div>
    </div>
  );
}
