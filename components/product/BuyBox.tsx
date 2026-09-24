"use client";

import { useRef, useState } from "react";
import { toast } from "sonner";

import { useCart } from "@/components/providers/CartProvider";
import {
  useLocalization,
  useLocalizedAmount,
} from "@/components/providers/LocalizationProvider";
import { DeliveryPincodeCheck } from "@/components/product/DeliveryPincodeCheck";
import Button from "@/components/ui/Button";
import { Icon, ShopPayWordmark } from "@/components/ui/Icons";
import Image from "@/components/ui/Image";
import { RatingStars } from "@/components/ui/Stars";
import { quality } from "@/content/quality";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/product";
import { shopifyCheckout } from "@/lib/shopify-checkout";
import { applyPackDiscount, packTiers, site, type PackTier } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The purchase surface: price, colourway swatches, pack size, and the two
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
  packSize,
  onSelectPackSize,
  ctaRef,
  rating,
}: {
  product: Product;
  selectedId: string;
  onSelectId: (id: string) => void;
  /** Controlled by ProductPurchase, not owned here — StickyAddToCart needs the same value. */
  packSize: PackTier["size"];
  onSelectPackSize: (size: PackTier["size"]) => void;
  /** Attached to the Add to bag / Buy it now row — StickyAddToCart and ScrollToTop watch this specifically, not the whole BuyBox, so they appear the moment the real CTA scrolls out of view, not only once the entire (much taller) buy box does. */
  ctaRef?: React.RefObject<HTMLDivElement | null>;
  rating?: { average: number; count: number };
}) {
  const [buying, setBuying] = useState(false);
  const [buySlow, setBuySlow] = useState(false);
  const [buyError, setBuyError] = useState<string | null>(null);
  const slowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { add } = useCart();
  // Same resolution CartProvider uses for its own lines, so the market
  // Shopify prices the checkout cart in is exactly the one this page's
  // price came from — see shopifyCheckout's country param doc comment.
  const { country, defaultCountry } = useLocalization();
  const effectiveCountry = country ?? defaultCountry?.isoCode ?? null;

  // No separate quantity stepper — the cart-line quantity IS the chosen pack
  // size (1/2/3). applyPackDiscount(unitCents, qty) resolves its discount
  // tier from this directly.
  const qty = packSize;

  const selected =
    product.variants.find((v) => v.id === selectedId) ?? product.variants[0];

  // The synced catalog's real per-market price for the shopper's country
  // (lib/catalog.ts's priceForMarket via LocalizationProvider) when known,
  // falling back to this variant's own build-time USD price until
  // localization resolves — see useLocalizedAmount's own doc comment for why
  // the price shown is never blank while that resolves.
  const {
    amount: price,
    currencyCode: currency,
    compareAtAmount: compareAt,
  } = useLocalizedAmount(
    selected.id,
    selected.price.amount,
    selected.price.currencyCode,
    selected.compareAtPrice?.amount ?? null,
  );
  const hasMarkdown = compareAt != null && compareAt > price;

  // Pack-discount math on top of whatever markdown the variant already has —
  // the same formula CartProvider and the cart drawer use, so the price
  // shown here can never round to a different cent than the bag total.
  const { unitPriceCents: packUnitPriceCents, lineTotalCents: packTotalCents } =
    applyPackDiscount(Math.round(price * 100), qty);

  // Combined savings vs. the reference price (the markdown's compare-at when
  // there is one, otherwise the plain 1-pack price) — so the badge always
  // reflects both the variant's own markdown AND the pack discount together,
  // never just one of the two.
  const referenceCents = Math.round((hasMarkdown ? compareAt! : price) * 100);
  const totalSavingsPercent =
    referenceCents > 0
      ? Math.round((1 - packUnitPriceCents / referenceCents) * 100)
      : 0;

  const handleAdd = () => {
    add(selected.id, qty, packUnitPriceCents, currency);
    // No cart drawer here — a top-right toast (see app/layout.tsx's Toaster)
    // confirms the add without pulling the shopper into a full panel every
    // time, matching reference2's ToastProvider pattern. The drawer's own
    // cart icon in the header still opens it if they want to check the bag.
    toast.success("Added to your bag", {
      description: `${product.title}, ${selected.title}`,
    });
  };

  const handleBuyNow = async () => {
    if (buying) return;
    setBuying(true);
    setBuyError(null);
    setBuySlow(false);
    // On a slow/flaky network the request itself can take several seconds
    // (see lib/shopify/client.ts's timeout+retry) before it either succeeds
    // or errors — with no signal in between, "Taking you to checkout…"
    // reads as frozen rather than working. This swaps the label once we've
    // clearly exceeded the fast-network case, so the shopper knows it's
    // still in flight instead of assuming the button is dead.
    slowTimerRef.current = setTimeout(() => setBuySlow(true), 5_000);
    const result = await shopifyCheckout(
      [
        {
          variantId: selected.id,
          qty,
          priceCents: packUnitPriceCents,
        },
      ],
      currency,
      effectiveCountry,
    );
    if (slowTimerRef.current) clearTimeout(slowTimerRef.current);
    if (result.ok) {
      window.location.href = result.checkoutUrl;
      return;
    }
    setBuyError(result.error);
    setBuying(false);
    setBuySlow(false);
  };

  return (
    <div className="flex flex-col">
      {/* ⚠️ PLACEHOLDER SOCIAL PROOF — "17k+ sold", "Best Seller 2026" and
          "Highest rated" are marketing copy with no figure behind them yet
          (no sales-count field exists anywhere in the synced Shopify data or
          site.metrics). Same policy as the "50 lbs" claim below and
          site.metrics's own ⚠️ note: replace with real, evidenceable numbers
          before this ships live — fabricated sales/ranking claims are an FTC
          problem. Plain badge chips (not schema.org markup), so nothing here
          is machine-read as verified fact. Wraps naturally on narrow screens
          — no separate mobile markup needed, same pattern as the feature-chip
          row below. */}
      <ul className="flex flex-wrap items-center gap-x-4 gap-y-1.5">
        {[
          {
            icon: "trending-up" as const,
            label: "17k+ sold in the last 5 months",
          },
          { icon: "award" as const, label: "Best Seller 2026" },
          { icon: "star" as const, label: "Highest rated seller" },
        ].map((f) => (
          <li
            key={f.label}
            className="inline-flex items-center gap-1.5 text-[0.78rem] font-semibold text-terracotta"
          >
            <Icon name={f.icon} className="size-3.5 shrink-0" />
            {f.label}
          </li>
        ))}
      </ul>

      <h1 className="font-display mt-3 text-[clamp(1.6rem,3vw,2.3rem)] leading-[1.15] font-medium tracking-[-0.02em] text-espresso text-balance">
        {product.title}
      </h1>

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
      <ul className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5">
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

      {/* ---------------------------- pack size ----------------------------- */}
      {/* Picks the discount tier AND the cart-line quantity in one control —
          not a separate SKU or flag (see lib/site.ts's packTiers doc
          comment). qty = packSize directly, no separate stepper. Each tile
          shows the price at its own size (1×/2×/3×), priced by the shared
          applyPackDiscount so this can never drift from what the cart
          drawer or Shopify checkout charges. */}
      <fieldset className="mt-7">
        <legend className="font-label text-[0.68rem] font-bold tracking-widest text-espresso uppercase">
          Choose your pack
        </legend>

        <div
          role="radiogroup"
          aria-label="Pack size"
          // Extra vertical gap below `sm`: stacked in one column, each
          // tile's "Most popular"/"Best value" badge floats to -top-2.5
          // (-10px) — exactly the old gap-2.5, so it visually bridged into
          // the card above it and read as no space at all. Side-by-side on
          // sm+ doesn't have this problem (the badge floats into clear
          // space above the row), so only mobile needs the wider gap.
          className="mt-3 grid gap-y-5 gap-x-2.5 sm:grid-cols-3 sm:gap-y-2.5"
        >
          {packTiers.map((tier) => {
            const isSelected = tier.size === packSize;
            const { unitPriceCents: tierUnitCents } = applyPackDiscount(
              Math.round(price * 100),
              tier.size,
            );

            return (
              <button
                key={tier.size}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelectPackSize(tier.size)}
                className={cn(
                  "relative flex flex-col items-start gap-1 rounded-xl border-2 px-3.5 py-3 text-left transition-colors duration-200",
                  isSelected
                    ? "border-sage bg-sage-soft"
                    : "border-sand bg-paper hover:border-espresso/30",
                )}
              >
                {tier.badge && (
                  <span
                    className={cn(
                      "font-label absolute -top-2.5 left-3 rounded-full px-2 py-0.5 text-[0.58rem] font-bold tracking-widest uppercase",
                      isSelected
                        ? "bg-sage text-white"
                        : "bg-espresso text-cream",
                    )}
                  >
                    {tier.badge}
                  </span>
                )}

                <span className="flex w-full items-center justify-between gap-2">
                  <span className="text-[0.9rem] font-semibold text-espresso">
                    {tier.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={cn(
                      "grid size-4.5 shrink-0 place-items-center rounded-full border-2 transition-colors duration-200",
                      isSelected ? "border-sage bg-sage" : "border-sand",
                    )}
                  >
                    {isSelected && (
                      <Icon name="check" className="size-2.5 text-white" />
                    )}
                  </span>
                </span>

                <span className="text-[0.76rem] text-espresso-mute">
                  {tier.blurb}
                </span>

                <span className="mt-1 font-semibold text-espresso tabular-nums">
                  {formatMoney(tierUnitCents / 100, currency)}
                  <span className="ml-1 text-[0.72rem] font-normal text-espresso-mute">
                    /unit
                  </span>
                </span>

                {tier.discountPercent > 0 && (
                  <span className="font-label text-[0.66rem] font-bold tracking-widest text-terracotta uppercase">
                    Save {tier.discountPercent}%
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </fieldset>

      {/* ------------------------------ price ------------------------------ */}
      {/* The price is a hero moment on a product page, not a spec value —
          it stays in the display serif (Fraunces) with tabular-nums for
          alignment, rather than the mono/grotesk voice reserved for actual
          data rows.

          Shows the TOTAL for the selected pack (qty = packSize), not a
          per-unit price — what the shopper is about to pay, matching the
          "Add to bag" button right below it. The compare-at reference leads
          the same row (was → now → save%, the standard markdown read: the
          anchor price sets up the number that beats it), scaled to the same
          qty (qty × compareAt) so both numbers stay apples-to-apples — the
          bigger absolute crossed-out number is the point, for conversion.
          No quantity stepper here — the pack tiles above are the only
          quantity control. */}
      <div className="mt-7 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {hasMarkdown && (
          <span className="text-[1.35rem] text-espresso-mute line-through tabular-nums">
            {formatMoney(compareAt * qty, currency)}
          </span>
        )}
        <span className="font-display text-[2rem] leading-none font-semibold text-espresso tabular-nums">
          {formatMoney(packTotalCents / 100, currency)}
        </span>
        {totalSavingsPercent > 0 && (
          <span className="font-label rounded-full bg-terracotta-soft px-2.5 py-1 text-[0.65rem] font-bold tracking-widest text-terracotta uppercase">
            Save {totalSavingsPercent}%
          </span>
        )}
      </div>
      <p className="mt-1.5 text-[0.8rem] text-espresso-mute">
        {site.promise.shipping}.
      </p>

      {/* ------------------------------ buy -------------------------------- */}
      {/* Stacked on narrow screens (a half-width button is too tight once
          "Taking you to checkout…" has to fit), side by side from `sm:` up. */}
      <div ref={ctaRef} className="mt-4 flex flex-col gap-3 sm:flex-row">
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
          // Shop Pay's real button is indigo (#5433EB); this site uses
          // Shopify's blue (#0a6cff) instead, with the same "Shop [Pay]"
          // lockup recolored to white (ShopPayWordmark, traced from
          // Shop_Pay_logo.svg — the lockup's own fill doesn't carry the
          // indigo, so swapping the button's bg here is enough). Shoppers
          // still pattern-match the lockup + accent-color pairing to "fast
          // checkout" from every other Shopify store, while this goes
          // through this site's own handleBuyNow/checkout route (no
          // Shopify Buy SDK here — see shopify-checkout.ts's doc comment on
          // why the cart is created server-side).
          //
          // `!` (important) on bg/hover:bg because Button defaults to
          // variant="sage" when unset, which bakes `bg-sage` into the same
          // class string ahead of this override — Tailwind's generated
          // stylesheet doesn't guarantee our later-in-string arbitrary value
          // wins over that named utility, so this button rendered sage
          // green instead of blue without `!`.
          className="w-full bg-[#5B31F3]! text-white shadow-(--shadow-e2) hover:-translate-y-0.5 hover:bg-[#0857d1]! hover:shadow-(--shadow-e3) active:translate-y-0 sm:flex-1"
        >
          {buying ? (
            buySlow ? (
              "Still connecting…"
            ) : (
              "Taking you to checkout…"
            )
          ) : (
            <span className="inline-flex items-center gap-1">
              <span>Buy with</span>
              <ShopPayWordmark className="h-4.5 w-auto shrink-0 text-white" />
            </span>
          )}
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

      {/* ------------------------- delivery estimate ------------------------ */}
      {/* Checked against `selected` (the current colourway) — transit time
          barely moves between colourways of the same physical item, so this
          doesn't need to track the pack/quantity picker above it. */}
      <div className="mt-4">
        <DeliveryPincodeCheck sku={selected.sku} />
      </div>

      {/* -------------------------- description ----------------------------- */}
      {/* Was the promises list (shipping/returns/support) — shipping and
          returns are already stated above (the line under the price, and
          the checkout/PDP copy respectively), so this repeated them for no
          reason. Shopify's own description is more useful real estate here. */}
      {product.descriptionHtml && (
        <div className="mt-8 border-t border-sand/70 pt-6">
          <DescriptionClamp html={product.descriptionHtml} />
        </div>
      )}
    </div>
  );
}

/**
 * Shopify's `descriptionHtml`, clamped to 3 lines with a "Read more" toggle.
 * Sits between price and the buy buttons — was a plain paragraph repeating
 * the shipping perk that's already in the promises list a few rows down.
 *
 * `html` is sanitized at sync time (sanitizeProductHtml, run once in
 * lib/shopify/sync-product.ts against the raw Shopify field), not here — so
 * this is the only place in the buy box safe to hand straight to
 * dangerouslySetInnerHTML.
 */
function DescriptionClamp({ html }: { html: string }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="mt-1.5 text-[0.8rem] leading-[1.6] text-espresso-mute">
      <div
        className={cn(
          "[&_a]:underline [&_a]:decoration-espresso-mute/40 [&_p]:m-0 [&_p+p]:mt-1.5",
          !expanded && "line-clamp-3",
        )}
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="mt-1 font-medium text-espresso underline decoration-espresso/30 underline-offset-2 hover:decoration-espresso"
      >
        {expanded ? "Show less" : "Read more"}
      </button>
    </div>
  );
}
