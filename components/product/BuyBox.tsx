"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useCart } from "@/components/providers/CartProvider";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import Image from "@/components/ui/Image";
import { RatingStars } from "@/components/ui/Stars";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/product";
import { shopifyCheckout } from "@/lib/shopify-checkout";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const MAX_QTY = 10;

/**
 * The purchase surface: price, colourway swatches, quantity, and the two
 * ways to check out. The gallery sits beside this in ProductPurchase.
 *
 * `selectedId` / `onSelectId` are controlled by the parent rather than owned
 * here, so picking a colourway can also move the gallery's main image to
 * match it — internal state couldn't reach outside this component to do that.
 *
 * Both purchase paths go through the shared choke points, so the analytics
 * events can never be missed:
 *   • "Add to bag"  → useCart().add()      → trackAddToCart
 *   • "Buy it now"  → shopifyCheckout()    → trackInitiateCheckout
 */
export function BuyBox({
  product,
  selectedId,
  onSelectId,
  rating,
}: {
  product: Product;
  selectedId: string;
  onSelectId: (id: string) => void;
  rating?: { average: number; count: number };
}) {
  const [quantity, setQuantity] = useState(1);
  const [buying, setBuying] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const { add, open } = useCart();

  const selected =
    product.variants.find((v) => v.id === selectedId) ?? product.variants[0];

  const price = selected.price.amount;
  const currency = selected.price.currencyCode;
  const compareAt = selected.compareAtPrice?.amount ?? null;
  const savings =
    compareAt && compareAt > price
      ? Math.round((1 - price / compareAt) * 100)
      : 0;

  const handleAdd = () => {
    add(selected.id, quantity, Math.round(price * 100), currency);
    toast.success("Added to your bag", { description: `${product.title}, ${selected.title}` });
    open();
  };

  const handleBuyNow = async () => {
    if (buying) return;
    setBuying(true);
    setBuyError(null);
    const result = await shopifyCheckout(
      [{ variantId: selected.id, qty: quantity, priceCents: Math.round(price * 100) }],
      currency,
    );
    if (result.ok) {
      window.location.href = result.checkoutUrl;
      return;
    }
    setBuyError(result.error);
    setBuying(false);
  };

  return (
    <div className="flex flex-col">
      {product.subtitle && (
        <p className="font-label text-[0.68rem] font-semibold tracking-widest text-sage-deep uppercase">
          {product.subtitle}
        </p>
      )}

      <h1 className="font-display mt-3 text-[clamp(1.6rem,3vw,2.3rem)] leading-[1.15] font-medium tracking-[-0.02em] text-espresso text-balance">
        {product.title}
      </h1>

      {rating && (
        <a
          href="#reviews"
          className="mt-3 inline-flex w-fit items-center gap-2.5 transition-opacity duration-200 hover:opacity-75"
        >
          <RatingStars value={rating.average} starClassName="h-4 w-4" />
          <span className="text-[0.82rem] text-espresso-soft">
            <span className="font-mono font-semibold text-espresso">
              {rating.average.toFixed(1)}
            </span>{" "}
            ·{" "}
            <span className="font-mono underline decoration-sand-strong underline-offset-2">
              {rating.count.toLocaleString("en-US")} reviews
            </span>
          </span>
        </a>
      )}

      {/* ------------------------------ price ------------------------------ */}
      <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-mono text-[2rem] leading-none font-semibold text-espresso">
          {formatMoney(price, currency)}
        </span>
        {compareAt && compareAt > price && (
          <>
            <span className="font-mono text-[1rem] text-espresso-mute line-through">
              {formatMoney(compareAt, currency)}
            </span>
            <span className="font-label rounded-full bg-terracotta-soft px-2.5 py-1 text-[0.65rem] font-bold tracking-widest text-terracotta uppercase">
              Save {savings}%
            </span>
          </>
        )}
      </div>
      <p className="mt-1.5 text-[0.8rem] text-espresso-mute">
        {site.promise.shipping}. Taxes calculated at checkout.
      </p>

      {/* ---------------------------- colourway ---------------------------- */}
      <fieldset className="mt-8">
        <legend className="font-label text-[0.68rem] font-bold tracking-widest text-espresso uppercase">
          Colour:{" "}
          <span className="font-sans text-espresso-soft normal-case">
            {selected.title}
          </span>
        </legend>

        <div className="mt-3.5 flex flex-wrap gap-2.5">
          {product.variants.map((v) => {
            const active = v.id === selected.id;
            return (
              <button
                key={v.id}
                type="button"
                onClick={() => onSelectId(v.id)}
                disabled={!v.availableForSale}
                aria-pressed={active}
                aria-label={`${v.title}${v.availableForSale ? "" : ", sold out"}`}
                title={v.title}
                className={cn(
                  "relative size-16 overflow-hidden rounded-xl border-2 transition-all duration-300 ease-(--ease-out-expo)",
                  active
                    ? "border-sage shadow-(--shadow-e2)"
                    : "border-sand hover:border-espresso/30",
                  !v.availableForSale && "cursor-not-allowed opacity-40",
                )}
              >
                {v.image && (
                  <Image
                    src={v.image}
                    alt=""
                    fill
                    sizes="64px"
                    quality={75}
                    className="object-cover"
                  />
                )}
                {!v.availableForSale && (
                  <span className="absolute inset-0 grid place-items-center bg-cream/70 text-[0.58rem] font-bold text-espresso uppercase">
                    Sold
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {selected.lowStock && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-[0.8rem] font-medium text-terracotta">
            <span
              aria-hidden
              className="inline-block size-1.5 rounded-full bg-terracotta"
            />
            Low stock in {selected.title}
          </p>
        )}
      </fieldset>

      {/* ---------------------------- quantity ----------------------------- */}
      <div className="mt-7 flex items-center gap-4">
        <span className="font-label text-[0.68rem] font-bold tracking-widest text-espresso uppercase">
          Qty
        </span>
        <div className="flex items-center rounded-full border border-sand bg-paper">
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
            aria-label="Decrease quantity"
            className="grid size-10 place-items-center rounded-full text-espresso-soft transition-colors duration-200 hover:text-espresso disabled:opacity-35"
          >
            <Icon name="minus" className="size-3.5" />
          </button>
          <span
            aria-live="polite"
            className="font-mono min-w-8 text-center text-[0.92rem] font-semibold text-espresso"
          >
            {quantity}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((q) => Math.min(MAX_QTY, q + 1))}
            disabled={quantity >= MAX_QTY}
            aria-label="Increase quantity"
            className="grid size-10 place-items-center rounded-full text-espresso-soft transition-colors duration-200 hover:text-espresso disabled:opacity-35"
          >
            <Icon name="plus" className="size-3.5" />
          </button>
        </div>
      </div>

      {/* ------------------------------ buy -------------------------------- */}
      <div className="mt-7 flex flex-col gap-3">
        <Button
          onClick={handleAdd}
          disabled={!selected.availableForSale}
          className="w-full"
        >
          {selected.availableForSale ? "Add to bag" : "Sold out"}
        </Button>
        <Button
          variant="outline"
          onClick={handleBuyNow}
          disabled={!selected.availableForSale || buying}
          className="w-full"
        >
          {buying ? "Taking you to checkout…" : "Buy it now"}
        </Button>
      </div>

      {buyError && (
        <p
          role="alert"
          className="mt-3 rounded-xl bg-terracotta-soft px-4 py-3 text-[0.82rem] leading-snug text-terracotta"
        >
          {buyError}
        </p>
      )}

      {/* ---------------------------- promises ----------------------------- */}
      <ul className="mt-8 grid gap-3 border-t border-sand/70 pt-6">
        {[
          { icon: "truck" as const, text: site.promise.shipping },
          { icon: "shield" as const, text: site.promise.returns },
          { icon: "chat" as const, text: site.promise.support },
        ].map((row) => (
          <li
            key={row.text}
            className="flex items-center gap-3 text-[0.87rem] text-espresso-soft"
          >
            <Icon name={row.icon} className="size-4.5 shrink-0 text-sage" />
            {row.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
