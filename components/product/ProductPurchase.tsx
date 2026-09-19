"use client";

import { useRef, useState } from "react";

import { ProductViewTracker } from "@/components/analytics/ProductViewTracker";
import { BuyBox } from "@/components/product/BuyBox";
import { ProductGallery } from "@/components/product/ProductGallery";
import { StickyAddToCart } from "@/components/product/StickyAddToCart";
import type { Product } from "@/lib/product";

/**
 * Owns the one piece of state the gallery and the buy box must agree on: the
 * selected variant. Keeping it here (rather than inside BuyBox) is what lets
 * picking a colourway also move the gallery to that colour's photo.
 *
 * Also mounts ProductViewTracker, which fires ViewContent / view_item once
 * per page view for the variant the shopper actually lands on.
 */
export function ProductPurchase({
  product,
  rating,
}: {
  product: Product;
  rating?: { average: number; count: number };
}) {
  const firstAvailable =
    product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const [selectedId, setSelectedId] = useState(firstAvailable.id);
  const buyBoxRef = useRef<HTMLDivElement>(null);

  const selected =
    product.variants.find((v) => v.id === selectedId) ?? firstAvailable;

  return (
    <>
      <section className="px-5 pt-8 pb-16 sm:px-8 lg:pt-12 lg:pb-24">
        <div className="mx-auto grid w-full max-w-310 gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:gap-16">
          <ProductGallery product={product} activeSrc={selected.image} />
          <div ref={buyBoxRef} className="lg:sticky lg:top-28 lg:self-start">
            <BuyBox
              product={product}
              selectedId={selectedId}
              onSelectId={setSelectedId}
              rating={rating}
            />
          </div>
        </div>
      </section>

      <StickyAddToCart
        product={product}
        selectedId={selectedId}
        watchRef={buyBoxRef}
      />

      <ProductViewTracker
        variantId={selected.id}
        name={`${product.title}, ${selected.title}`}
        amount={selected.price.amount}
        currencyCode={selected.price.currencyCode}
      />
    </>
  );
}
