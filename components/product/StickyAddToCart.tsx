"use client";

import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { useCart } from "@/components/providers/CartProvider";
import Image from "@/components/ui/Image";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/product";
import { cn } from "@/lib/utils";

/**
 * Sticky add-to-cart bar for mobile (hidden from `lg` up, where the BuyBox
 * is always on screen beside the gallery anyway).
 *
 * It appears only once the main BuyBox has been scrolled past, so it never
 * double-renders the same button while the real one is still visible — that
 * would just cover content for no reason. An IntersectionObserver on the
 * BuyBox wrapper drives that, rather than a scroll-position threshold, so it
 * stays correct at any viewport height.
 *
 * Adds through the same `useCart().add()` choke point as the BuyBox, so the
 * AddToCart analytics event fires identically from here.
 */
export function StickyAddToCart({
  product,
  selectedId,
  watchRef,
}: {
  product: Product;
  selectedId: string;
  /** The BuyBox wrapper — the bar shows once this leaves the viewport. */
  watchRef: React.RefObject<HTMLElement | null>;
}) {
  const [visible, setVisible] = useState(false);
  const { add, open } = useCart();
  const barRef = useRef<HTMLDivElement>(null);

  const selected =
    product.variants.find((v) => v.id === selectedId) ?? product.variants[0];

  useEffect(() => {
    const target = watchRef.current;
    if (!target) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Show only when the BuyBox has scrolled off the TOP — not when the
        // shopper is still above it near the page header.
        setVisible(!entry.isIntersecting && entry.boundingClientRect.top < 0);
      },
      { threshold: 0 },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [watchRef]);

  const handleAdd = () => {
    add(selected.id, 1, Math.round(selected.price.amount * 100), selected.price.currencyCode);
    toast.success("Added to your bag", {
      description: `${product.title}, ${selected.title}`,
    });
    open();
  };

  return (
    <div
      ref={barRef}
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        "fixed inset-x-0 bottom-0 z-60 border-t border-sand/70 bg-cream/95 backdrop-blur-xl transition-transform duration-400 ease-(--ease-out-expo) lg:hidden",
        visible ? "translate-y-0" : "translate-y-full",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center gap-3 px-4 py-3">
        {selected.image && (
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-cream-deep">
            <Image
              src={selected.image}
              alt=""
              fill
              sizes="48px"
              quality={60}
              className="object-cover"
            />
          </div>
        )}

        <div className="min-w-0 flex-1">
          <p className="truncate text-[0.8rem] font-medium text-espresso">
            {selected.title}
          </p>
          <p className="text-[0.92rem] font-semibold text-espresso tabular-nums">
            {formatMoney(selected.price.amount, selected.price.currencyCode)}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!selected.availableForSale}
          className="font-label shrink-0 rounded-full bg-sage px-6 py-3.5 text-[0.76rem] font-bold tracking-widest text-white uppercase transition-colors duration-300 hover:bg-sage-hot disabled:opacity-50"
        >
          {selected.availableForSale ? "Add to bag" : "Sold out"}
        </button>
      </div>
    </div>
  );
}
