"use client";

import { toast } from "sonner";

import { useCart } from "@/components/providers/CartProvider";
import { useLocalizedAmount } from "@/components/providers/LocalizationProvider";
import Image from "@/components/ui/Image";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/product";
import { applyPackDiscount, getPackTier, type PackTier } from "@/lib/site";
import { useScrollPastElement } from "@/lib/use-scroll-past-element";
import { cn } from "@/lib/utils";

/**
 * Sticky add-to-cart bar, shown at every breakpoint — same component, same
 * state, two different shells picked by CSS: a full-width bar docked to the
 * bottom edge on mobile, a compact card floating bottom-center from `lg` up
 * (content-sized up to a max width, not spanning the page — a lightweight
 * nudge, not a mobile-style docked bar stretched wide). On desktop the
 * BuyBox is `lg:sticky`, but it's the CTA row (`ctaRef`) specifically that's
 * being watched — on a tall page (long reviews, a short viewport) even the
 * sticky BuyBox scrolls past its own container, so this still earns its
 * keep there.
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
  packSize,
  watchRef,
}: {
  product: Product;
  selectedId: string;
  /** The pack size picked in BuyBox — quick-add here adds the same tier, not always a plain 1-pack. */
  packSize: PackTier["size"];
  /** The BuyBox wrapper — the bar shows once this leaves the viewport. */
  watchRef: React.RefObject<HTMLElement | null>;
}) {
  const visible = useScrollPastElement(watchRef);
  const { add } = useCart();

  const selected =
    product.variants.find((v) => v.id === selectedId) ?? product.variants[0];

  const {
    amount: price,
    currencyCode: currency,
  } = useLocalizedAmount(
    selected.id,
    selected.price.amount,
    selected.price.currencyCode,
    selected.compareAtPrice?.amount ?? null,
  );

  const qty = packSize;
  const { unitPriceCents, lineTotalCents } = applyPackDiscount(
    Math.round(price * 100),
    qty,
  );
  const tier = getPackTier(packSize);

  const handleAdd = () => {
    add(selected.id, qty, unitPriceCents, currency);
    // No cart drawer here — a top-right toast (see app/layout.tsx's Toaster)
    // confirms the add without pulling the shopper into a full panel.
    toast.success("Added to your bag", {
      description: `${product.title}, ${selected.title}`,
    });
  };

  return (
    <div
      aria-hidden={!visible}
      inert={!visible}
      className={cn(
        // Mobile: a full-bleed bar docked flush to the bottom edge.
        // Desktop (lg+): a compact card floating bottom-center instead —
        // inset-x-0 stays (needed to center a w-fit box via mx-auto), width
        // resets to content-sized rather than the mobile full-bleed one.
        "fixed inset-x-0 bottom-0 z-60 w-full border-t border-sand/70 bg-cream/95 backdrop-blur-xl transition-transform duration-400 ease-(--ease-out-expo)",
        "lg:bottom-6 lg:mx-auto lg:w-fit lg:max-w-md lg:rounded-2xl lg:border lg:border-sand lg:shadow-(--shadow-lift)",
        visible
          ? "translate-y-0"
          : "translate-y-[calc(100%+1.5rem)] lg:translate-y-[calc(100%+2rem)]",
      )}
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
    >
      <div className="flex items-center gap-3 px-4 py-3 lg:gap-4 lg:px-5 lg:py-3.5">
        {selected.image && (
          <div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-cream-deep lg:size-12">
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

        <div className="min-w-0 flex-1 lg:max-w-48">
          <p className="truncate text-[0.8rem] font-medium text-espresso">
            {selected.title}
            {packSize > 1 && (
              <span className="text-espresso-mute"> · {tier.label}</span>
            )}
          </p>
          <p className="text-[0.92rem] font-semibold text-espresso tabular-nums">
            {formatMoney(lineTotalCents / 100, currency)}
          </p>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!selected.availableForSale}
          className="font-label shrink-0 rounded-full bg-sage px-6 py-3.5 text-[0.76rem] font-bold tracking-widest text-white uppercase transition-colors duration-300 hover:bg-sage-hot disabled:opacity-50 lg:px-5 lg:py-3 lg:text-[0.7rem]"
        >
          {selected.availableForSale ? "Add to bag" : "Sold out"}
        </button>
      </div>
    </div>
  );
}
