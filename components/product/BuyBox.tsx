"use client";

import { useState } from "react";
import { toast } from "sonner";

import { useCart } from "@/components/providers/CartProvider";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import Image from "@/components/ui/Image";
import { RatingStars } from "@/components/ui/Stars";
import { quality } from "@/content/quality";
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
    toast.success("Added to your bag", {
      description: `${product.title}, ${selected.title}`,
    });
    open();
  };

  const handleBuyNow = async () => {
    if (buying) return;
    setBuying(true);
    setBuyError(null);
    const result = await shopifyCheckout(
      [
        {
          variantId: selected.id,
          qty: quantity,
          priceCents: Math.round(price * 100),
        },
      ],
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
      {/* Static feature callouts, not `product.subtitle` (Shopify's
          custom.subtitle field) — deliberately overridden here rather than
          edited in Shopify, same as the "50 lbs" claim in content/copy.ts's
          productBenefits. ⚠️ "Holds 50 lbs" repeats that same unverified
          weight-capacity claim; see the warning on productBenefits in
          content/copy.ts before this ships live.

          A row of small icon chips, not the single dense uppercase/
          tracked-out text line this replaced — that read as one dense
          string rather than three distinct, scannable facts. Each chip
          pairs an icon with its own short label at normal tracking/case,
          which is what actually reads as "minimal and modern" instead of
          "loud all-caps banner". */}
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {[
          { icon: "weight" as const, label: "Holds 50 lbs" },
          { icon: "fold" as const, label: "Folds to keychain size" },
          { icon: "shield" as const, label: "Premium build" },
        ].map((f) => (
          <li
            key={f.label}
            className="inline-flex items-center gap-1.5 text-[0.78rem] font-medium text-espresso-soft"
          >
            <Icon name={f.icon} className="size-3.5 shrink-0 text-sage-deep" />
            {f.label}
          </li>
        ))}
      </ul>

      <h1 className="font-display mt-3 text-[clamp(1.6rem,3vw,2.3rem)] leading-[1.15] font-medium tracking-[-0.02em] text-espresso text-balance">
        {product.title}
      </h1>

      {/* Rating (jumps to #reviews) and the "checks passed" proof link
          (jumps to "Put to the test") sit side by side in one row — both
          are the same kind of thing: a quick trust signal that jumps
          further down the page. The checks-passed count is pulled from the
          QC list itself so it can never drift from the section it jumps
          to. Native CSS smooth-scroll plus globals.css's global
          `scroll-padding-top: var(--nav-h)` handle the nav-clearing scroll
          position — no per-target scroll-mt-* and no JS handler needed;
          the two targets (ProductReviews.tsx, QualityTests.tsx) used to
          each carry their own scroll-mt-20, which didn't match --nav-h and
          stacked additively with this same global rule, landing 80px past
          the section's real top on every click. */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
        {rating && (
          <a
            href="#reviews"
            className="inline-flex w-fit items-center gap-2.5 transition-opacity duration-200 hover:opacity-75"
          >
            <RatingStars value={rating.average} starClassName="h-4 w-4" />
            <span className="text-[0.82rem] text-espresso-soft">
              <span className="font-semibold text-espresso tabular-nums">
                {rating.average.toFixed(1)}
              </span>{" "}
              ·{" "}
              <span className="underline decoration-sand-strong underline-offset-2 tabular-nums">
                {rating.count.toLocaleString("en-US")} reviews
              </span>
            </span>
          </a>
        )}

        {rating && <span aria-hidden className="h-3.5 w-px bg-sand-strong" />}

        <a
          href="#quality-test"
          aria-label={`Jump to the ${quality.checks.length} quality checks this bag passes`}
          className="group inline-flex w-fit min-h-11 touch-manipulation items-center gap-1.5 text-[0.8rem] font-medium text-espresso-soft underline-offset-4 transition-colors duration-200 hover:text-espresso hover:underline focus-visible:underline"
        >
          <Icon
            name="shield"
            className="size-3.5 shrink-0 text-sage-deep transition-colors duration-200 group-hover:text-espresso"
          />
          {quality.checks.length} checks passed
          <Icon
            name="arrow-right"
            className="size-3 shrink-0 -translate-x-1 text-espresso-mute opacity-0 transition-all duration-300 ease-(--ease-out-expo) group-hover:translate-x-0 group-hover:opacity-100"
          />
        </a>
      </div>

      {/* ------------------------------ price ------------------------------ */}
      {/* The price is a hero moment on a product page, not a spec value —
          it stays in the display serif (Fraunces) with tabular-nums for
          alignment, rather than the mono/grotesk voice reserved for actual
          data rows (specs, step counters, the quantity stepper). */}
      <div className="mt-6 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="font-display text-[2rem] leading-none font-semibold text-espresso tabular-nums">
          {formatMoney(price, currency)}
        </span>
        {compareAt && compareAt > price && (
          <>
            <span className="text-[1rem] text-espresso-mute line-through tabular-nums">
              {formatMoney(compareAt, currency)}
            </span>
            <span className="font-label rounded-full bg-terracotta-soft px-2.5 py-1 text-[0.65rem] font-bold tracking-widest text-terracotta uppercase">
              Save {savings}%
            </span>
          </>
        )}
      </div>
      <p className="mt-1.5 text-[0.8rem] text-espresso-mute">
        {site.promise.shipping}.
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
      {/* Stacked on narrow screens (a half-width button is too tight once
          "Taking you to checkout…" has to fit), side by side from `sm:` up. */}
      <div className="mt-7 flex flex-col gap-3 sm:flex-row">
        <Button
          variant="outline-primary"
          onClick={handleAdd}
          disabled={!selected.availableForSale}
          className="w-full sm:flex-1"
        >
          {selected.availableForSale ? "Add to bag" : "Sold out"}
        </Button>
        <Button
          onClick={handleBuyNow}
          disabled={!selected.availableForSale || buying}
          className="w-full sm:flex-1"
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
