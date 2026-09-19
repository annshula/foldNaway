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
 * The rail is capped to the gallery's own fixed height (see the 34rem cap
 * below) so with more thumbnails than fit, the *rail* scrolls independently
 * of the page — vertically at `sm:` and up (left column beside the image),
 * horizontally below it (a row above the image, native touch-swipe/scroll,
 * same overflow-scroll mechanism as desktop, just the other axis).
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
    // Capped at 34rem: without a height ceiling the flex row stretches to
    // fit the main image's own aspect-square width, which on a wide desktop
    // column makes it enormous — and the thumbnail rail never gets a chance
    // to overflow (so it never scrolls) because it just matches whatever
    // height that oversized image ends up being.
    <div className="flex max-h-136 flex-col-reverse gap-3 sm:h-136 sm:flex-row">
      {images.length > 1 && (
        <ul className="scrollbar-none flex shrink-0 gap-2 overflow-x-auto sm:h-full sm:w-20 sm:flex-col sm:overflow-x-visible sm:overflow-y-auto">
          {images.map((img, i) => (
            <li key={img.src} className="shrink-0">
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "relative block size-16 overflow-hidden rounded-lg border-2 bg-cream-deep transition-colors duration-300 sm:size-20",
                  i === index
                    ? "border-sage"
                    : "border-transparent hover:border-sand-strong",
                )}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  sizes="80px"
                  quality={65}
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Mobile sizes itself by aspect-square (bounded by viewport width,
          since there's no fixed-height ancestor there). Desktop switches to
          the row's own fixed height instead, so the image is bounded by
          height rather than by the wide grid column's width. */}
      <div className="relative aspect-square max-w-full flex-1 overflow-hidden rounded-card bg-cream-deep sm:aspect-auto sm:h-full">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority={index === 0}
          sizes="(max-width: 1024px) 100vw, 45vw"
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
