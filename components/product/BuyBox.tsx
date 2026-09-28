"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

import { useCart } from "@/components/providers/CartProvider";
import { useLocalizedAmount } from "@/components/providers/LocalizationProvider";
import { ProductAccordion } from "@/components/product/ProductAccordion";
import { SaleCountdown } from "@/components/product/SaleCountdown";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import Image from "@/components/ui/Image";
import { RatingStars } from "@/components/ui/Stars";
import { howItWorks } from "@/content/copy";
import { quality } from "@/content/quality";
import { formatMoney } from "@/lib/money";
import type { Product } from "@/lib/product";
import { applyPackDiscount, packTiers, site, type PackTier } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The purchase surface: price, colourway swatches, pack size, and add to
 * bag. The gallery sits beside this in ProductPurchase.
 *
 * `selectedId` / `onSelectId` are controlled by the parent rather than owned
 * here, so picking a colourway can also move the gallery's main image to
 * match it — internal state couldn't reach outside this component to do that.
 *
 * One purchase path — "Add to bag" → useCart().add() → trackAddToCart — no
 * separate Buy Now/Shop Pay button (matches reference/PurchasePanel.tsx's
 * single-CTA pattern; see shopify-checkout.ts if that flow is ever restored).
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
  const { add } = useCart();

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

  return (
    <div className="flex flex-col">
      {/* Rating (jumps to #reviews) and the "checks passed" proof link
          (jumps to "Put to the test") sit side by side in one row — both
          are the same kind of thing: a quick trust signal, shown before the
          title since that's the credibility a shopper wants before reading
          the name. The checks-passed count is pulled from the QC list
          itself so it can never drift from the section it jumps to. Native
          CSS smooth-scroll plus globals.css's global
          `scroll-padding-top: var(--nav-h)` handle the nav-clearing scroll
          position — no per-target scroll-mt-* and no JS handler needed;
          the two targets (ProductReviews.tsx, QualityTests.tsx) used to
          each carry their own scroll-mt-20, which didn't match --nav-h and
          stacked additively with this same global rule, landing 80px past
          the section's real top on every click. */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
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

      <h1 className="font-display text-[clamp(1.6rem,3vw,2.3rem)] leading-[1.15] font-medium tracking-[-0.02em] text-espresso text-balance">
        {product.title}
      </h1>

      {/* Shopify-sourced (custom.perks metafield), not a hardcoded claim —
          merchant-editable from Shopify Admin, no code change needed. This
          replaced a hardcoded chip row that included an unverified "Holds
          50 lbs" weight-capacity claim (an FTC risk with no measured spec
          behind it) — see lib/product.ts's claim-policy note. */}
      {product.perks.length > 0 && (
        <ul className="mt-3 grid grid-cols-1 gap-x-4 gap-y-1.5 sm:grid-cols-2">
          {product.perks.map((perk) => (
            <li
              key={perk}
              className="flex items-center gap-2 text-[0.78rem] font-medium text-espresso-soft"
            >
              <span className="grid size-4.5 shrink-0 place-items-center rounded-full bg-sage">
                <Icon name="check" className="size-2.5 text-white" />
              </span>
              {perk}
            </li>
          ))}
        </ul>
      )}

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
          className="mt-3 flex flex-col gap-3"
        >
          {packTiers.map((tier) => {
            const isSelected = tier.size === packSize;
            const {
              unitPriceCents: tierUnitCents,
              lineTotalCents: tierTotalCents,
            } = applyPackDiscount(Math.round(price * 100), tier.size);

            // Same reference price the hero price block uses (the
            // variant's own markdown compare-at when there is one,
            // otherwise the plain price), scaled to this tier's quantity —
            // so every tile's "was → now → save" reads apples-to-apples
            // with the hero price below, never a different reference.
            const tierReferenceCents = Math.round(
              (hasMarkdown ? compareAt! : price) * 100 * tier.size,
            );
            const tierSavingsCents = tierReferenceCents - tierTotalCents;
            const tierHasMarkdown = tierSavingsCents > 0;

            return (
              <button
                key={tier.size}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => onSelectPackSize(tier.size)}
                className={cn(
                  "relative flex flex-col gap-2.5 rounded-xl border-2 px-4 py-3.5 text-left transition-colors duration-200 sm:flex-row sm:items-center sm:gap-4 sm:px-5 sm:py-4",
                  isSelected
                    ? "border-sage bg-sage-soft"
                    : "border-sand bg-paper hover:border-espresso/30",
                )}
              >
                {/* Top row on mobile: dot + label on the left, price on the
                    right — the natural place an eye looks first. Desktop
                    folds this into the one wide row via sm:contents. */}
                <span className="flex items-center justify-between gap-3 sm:contents">
                  <span className="flex min-w-0 items-center gap-3 sm:contents">
                    <span
                      aria-hidden="true"
                      className={cn(
                        "grid size-5 shrink-0 place-items-center rounded-full border-2 transition-colors duration-200",
                        isSelected ? "border-sage bg-sage" : "border-sand",
                      )}
                    >
                      {isSelected && (
                        <span className="size-2 rounded-full bg-white" />
                      )}
                    </span>
                    <span className="text-[0.9rem] font-semibold text-espresso sm:hidden">
                      {tier.label}
                    </span>
                  </span>

                  <span className="flex shrink-0 items-baseline gap-1.5 sm:hidden">
                    {tierHasMarkdown && (
                      <span className="text-[0.72rem] text-espresso-mute line-through tabular-nums">
                        {formatMoney(tierReferenceCents / 100, currency)}
                      </span>
                    )}
                    <span className="text-[1rem] font-semibold text-espresso tabular-nums">
                      {formatMoney(tierTotalCents / 100, currency)}
                    </span>
                  </span>
                </span>

                <span className="min-w-0 sm:flex-1">
                  <span className="hidden flex-wrap items-center gap-2 sm:flex">
                    <span className="text-[0.9rem] font-semibold text-espresso">
                      {tier.label}
                    </span>
                    {tier.badge && (
                      <span
                        className={cn(
                          "font-label inline-flex items-center rounded-full px-2.5 py-0.5 text-[0.58rem] font-bold tracking-widest uppercase",
                          isSelected
                            ? "bg-sage text-white"
                            : "bg-espresso text-cream",
                        )}
                      >
                        {tier.badge}
                      </span>
                    )}
                  </span>
                  {tier.badge && (
                    <span className="flex flex-wrap items-center gap-1.5 sm:hidden">
                      <span
                        className={cn(
                          "font-label inline-flex items-center rounded-full px-2 py-0.5 text-[0.58rem] font-bold tracking-widest uppercase",
                          isSelected
                            ? "bg-sage text-white"
                            : "bg-espresso text-cream",
                        )}
                      >
                        {tier.badge}
                      </span>
                    </span>
                  )}
                  {/* 1-pack: just the savings line (no per-unit split to
                      show). 2/3-pack: per-unit price, then savings — same
                      "X / set · Save Y" shape as the reference's combo
                      line. */}
                  {tier.size > 1 && (
                    <span className="mt-1 block text-[0.75rem] text-espresso-mute tabular-nums sm:mt-0.5">
                      {formatMoney(tierUnitCents / 100, currency)} / set
                      {tierHasMarkdown && (
                        <span className="text-terracotta">
                          {" "}
                          · Save {formatMoney(tierSavingsCents / 100, currency)}
                        </span>
                      )}
                    </span>
                  )}
                  {tier.size === 1 && tierHasMarkdown && (
                    <span className="mt-1 block text-[0.75rem] font-medium text-terracotta tabular-nums sm:mt-0.5">
                      Save {formatMoney(tierSavingsCents / 100, currency)}
                    </span>
                  )}
                </span>

                <span className="hidden shrink-0 flex-col items-end sm:flex">
                  <span className="flex items-baseline gap-1.5">
                    {tierHasMarkdown && (
                      <span className="text-[0.7rem] text-espresso-mute line-through tabular-nums">
                        {formatMoney(tierReferenceCents / 100, currency)}
                      </span>
                    )}
                    <span className="text-[1.15rem] font-semibold text-espresso tabular-nums">
                      {formatMoney(tierTotalCents / 100, currency)}
                    </span>
                  </span>
                  {tierHasMarkdown && (
                    <span className="text-[0.72rem] font-medium text-terracotta tabular-nums">
                      Save {formatMoney(tierSavingsCents / 100, currency)}
                    </span>
                  )}
                </span>
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
      <div className="mt-7 flex flex-wrap items-center justify-between gap-x-3 gap-y-2">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
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
        {product.saleEndsAt && (
          <SaleCountdown endsAt={product.saleEndsAt} />
        )}
      </div>
      <p className="mt-1.5 text-[0.8rem] text-espresso-mute">
        {site.promise.shipping}.
      </p>

      {/* ------------------------------ buy -------------------------------- */}
      {/* Single full-width "Add to bag" — matches reference/PurchasePanel.tsx
          (one CTA, no separate Buy Now/Shop Pay path). */}
      <div ref={ctaRef} className="mt-4">
        <Button
          onClick={handleAdd}
          disabled={!selected.availableForSale}
          className="w-full"
        >
          {selected.availableForSale ? "Add to bag" : "Sold out"}
        </Button>
      </div>

      <p className="mt-3 flex items-center justify-center gap-1.5 text-[0.8rem] font-medium text-espresso-mute">
        <Icon name="shield" className="size-3.5 shrink-0 text-sage-deep" />
        Secure payment by Shopify
      </p>

      {/* ---------------------------- quick reference ------------------------ */}
      {/* How to use, material & care, storage — matches
          reference/components/product/ProductAccordion.tsx's placement
          (right under the buy button and trust line) and its real-content
          pattern (steps/material pulled from content already on the page,
          not invented copy). */}
      <ProductAccordion
        items={[
          {
            title: "How to use",
            body: (
              <ol className="flex flex-col gap-2">
                {howItWorks.steps.map((step) => (
                  <li key={step.step}>
                    <strong className="font-medium text-espresso">
                      {step.label}.
                    </strong>{" "}
                    {step.body}
                  </li>
                ))}
              </ol>
            ),
          },
          {
            title: "Material & care",
            body: (
              <p>
                {product.material || "Reinforced woven fabric"}, built to be
                folded and unfolded daily without stretching out or splitting at
                the seams. Wipe clean with a damp cloth; air dry before folding
                it back into its pouch.
              </p>
            ),
          },
          {
            title: "Storage & clip",
            body: (
              <p>
                The carabiner comes pre-attached and is rated for a keyring,
                belt loop, backpack strap or stroller handle. Stuff the bag into
                its own pouch and pull the drawcord — no folding pattern to
                remember.
              </p>
            ),
          },
        ]}
      />

      {/* ------------------------------ promises ----------------------------- */}
      {/* Matches reference/app/products/[slug]/page.tsx's promise strip —
          delivery window, checkout trust, and the return/refund line, each
          with a jump to /faq (this site has no separate /pages/shipping or
          /pages/refund-policy route; FAQ covers both). */}
      <ul className="mt-6 flex flex-col gap-3.5 rounded-xl bg-cream/80 p-5 text-[0.82rem] text-espresso-soft">
        <li className="flex gap-3">
          <Icon name="truck" className="size-5 shrink-0 text-sage-deep" />
          <span>
            Tracked delivery in 4–10 days.{" "}
            <Link
              href="/faq"
              className="font-medium text-espresso underline decoration-espresso/30 underline-offset-2 hover:decoration-espresso"
            >
              Shipping details
            </Link>
          </span>
        </li>
        <li className="flex gap-3">
          <Icon name="shield" className="size-5 shrink-0 text-sage-deep" />
          <span>Secure checkout by Shopify.</span>
        </li>
        <li className="flex gap-3">
          <Icon name="refresh" className="size-5 shrink-0 text-sage-deep" />
          <span>
            Damaged, defective or wrong item? We&apos;ll put it right.{" "}
            <Link
              href="/faq"
              className="font-medium text-espresso underline decoration-espresso/30 underline-offset-2 hover:decoration-espresso"
            >
              Refund policy
            </Link>
          </span>
        </li>
      </ul>

      {/* -------------------------- description ----------------------------- */}
      {/* Commented out for now. Was the promises list (shipping/returns/
          support); shipping and returns are already stated above (the line
          under the price, and the checkout/PDP copy respectively), so that
          repeated them for no reason. */}
      {/* {product.descriptionHtml && (
        <div className="mt-8 border-t border-sand/70 pt-6">
          <DescriptionClamp html={product.descriptionHtml} />
        </div>
      )} */}
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
