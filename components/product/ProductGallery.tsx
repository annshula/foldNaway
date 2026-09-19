"use client";

import { useEffect, useState } from "react";

import Image from "@/components/ui/Image";
import type { Product } from "@/lib/product";
import { cn } from "@/lib/utils";

/**
 * Product gallery: a thumbnail rail plus one large static image — clicking
 * (or tapping) a thumbnail swaps the main image directly, no carousel state
 * to animate through.
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
 * variant, because browsing the photos is not the same act as choosing what
 * to buy.
 */
export function ProductGallery({
  product,
  activeSrc,
}: {
  product: Product;
  activeSrc?: string;
}) {
  const images = product.gallery;
  const [index, setIndex] = useState(0);

  // Follow the parent's variant image when it changes, if that image is in
  // the gallery. A variant photo that isn't in the gallery leaves the view
  // where it is rather than blanking it.
  useEffect(() => {
    if (!activeSrc) return;
    const found = images.findIndex((img) => img.src === activeSrc);
    if (found >= 0) setIndex(found);
  }, [activeSrc, images]);

  if (images.length === 0) return null;
  const current = images[Math.min(index, images.length - 1)];

  return (
    // Height matches reference/components/product/ProductGallery.tsx: the
    // *rail* alone is capped (max-h-115, 460px), not the whole row.
    //
    // `sm:items-start` is load-bearing, not decoration: a flex row with no
    // `items-*` defaults to `align-items: stretch`, which silently forces
    // every flex child to the row's own height — INCLUDING the image div,
    // overriding its `aspect-square` entirely. That's what was actually
    // making the gallery too tall (measured: a 460×460 box rendering at
    // 460×784 in production, `aspect-ratio: 1/1` present in computed style
    // but overridden by the stretch-driven explicit height). `items-start`
    // lets each column size itself from its own content/aspect-ratio
    // instead of inheriting the tallest sibling's height.
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-start">
      {images.length > 1 && (
        <ul className="scrollbar-none flex shrink-0 gap-2 overflow-x-auto sm:max-h-115 sm:w-19 sm:flex-col sm:overflow-x-visible sm:overflow-y-auto">
          {images.map((img, i) => (
            <li key={img.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "relative block size-14 overflow-hidden rounded-lg border-2 bg-cream-deep transition-colors duration-300 sm:size-16",
                  i === index
                    ? "border-sage"
                    : "border-transparent hover:border-sand-strong",
                )}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  sizes="64px"
                  quality={65}
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* aspect-square + max-w-115 (matching the reference) sizes this to
          460×460px at its cap, on every breakpoint — not bounded by a
          shared row height, so it can't grow taller than the reference's
          own main image does. */}
      <div className="relative aspect-square w-full max-w-full overflow-hidden rounded-card bg-cream-deep lg:max-w-115">
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

        {images.length > 1 && (
          <span className="font-label pointer-events-none absolute right-3 bottom-3 rounded-full bg-espresso/75 px-2.5 py-1 text-[0.62rem] font-semibold tracking-widest text-cream tabular-nums backdrop-blur">
            {index + 1} / {images.length}
          </span>
        )}
      </div>
    </div>
  );
}
