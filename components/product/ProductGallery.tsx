"use client";

import { useEffect, useState } from "react";

import { Icon } from "@/components/ui/Icons";
import Image from "@/components/ui/Image";
import type { Product } from "@/lib/product";
import { cn } from "@/lib/utils";

/**
 * Product gallery: one large image with a thumbnail rail.
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
  const go = (next: number) =>
    setIndex((next + images.length) % images.length);

  return (
    <div className="flex flex-col gap-3">
      <div className="group relative aspect-square w-full overflow-hidden rounded-card bg-cream-deep">
        <Image
          key={current.src}
          src={current.src}
          alt={current.alt}
          fill
          priority={index === 0}
          sizes="(max-width: 1024px) 100vw, 52vw"
          quality={82}
          className="animate-fade-in object-cover"
        />

        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(index - 1)}
              aria-label="Previous image"
              className="absolute top-1/2 left-3 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-sand bg-cream/85 text-espresso opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
                <path
                  d="M14.5 6l-6 6 6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <button
              type="button"
              onClick={() => go(index + 1)}
              aria-label="Next image"
              className="absolute top-1/2 right-3 grid size-10 -translate-y-1/2 place-items-center rounded-full border border-sand bg-cream/85 text-espresso opacity-0 backdrop-blur transition-all duration-300 group-hover:opacity-100 focus-visible:opacity-100"
            >
              <svg viewBox="0 0 24 24" className="size-4" aria-hidden>
                <path
                  d="M9.5 6l6 6-6 6"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <span className="font-label absolute right-3 bottom-3 rounded-full bg-espresso/75 px-2.5 py-1 text-[0.62rem] font-semibold tracking-widest text-cream tabular-nums backdrop-blur">
              {index + 1} / {images.length}
            </span>
          </>
        )}
      </div>

      {images.length > 1 && (
        <ul className="grid grid-cols-5 gap-2 sm:grid-cols-6">
          {images.map((img, i) => (
            <li key={img.src}>
              <button
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`View image ${i + 1}`}
                aria-current={i === index ? "true" : undefined}
                className={cn(
                  "relative block aspect-square w-full overflow-hidden rounded-lg border-2 transition-colors duration-300",
                  i === index
                    ? "border-sage"
                    : "border-transparent hover:border-sand-strong",
                )}
              >
                <Image
                  src={img.src}
                  alt=""
                  fill
                  sizes="100px"
                  quality={65}
                  className="object-cover"
                />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
