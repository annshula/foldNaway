"use client";

import { useState } from "react";

import { useCart } from "@/components/providers/CartProvider";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import Image from "@/components/ui/Image";
import { formatMoney } from "@/lib/money";
import { shopifyCheckout } from "@/lib/shopify-checkout";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/**
 * The shopping bag: a right-hand drawer over a blurred scrim, animated with
 * plain CSS transitions (no animation library needed for a slide) and locked
 * against page scroll while open by CartProvider's useScrollLock.
 *
 * Checkout goes through lib/shopify-checkout.ts — the single choke point
 * that fires InitiateCheckout / begin_checkout exactly once before handing
 * off to Shopify's hosted checkout. Do not call /api/shopify/cart directly
 * from a new call site, or that event will be missed.
 */
export function CartDrawer() {
  const { lines, count, subtotalCents, isOpen, close, setQty, remove } =
    useCart();
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (checkingOut) return;
    setCheckingOut(true);
    setCheckoutError(null);
    const result = await shopifyCheckout(
      lines.map((l) => ({
        variantId: l.variantId,
        qty: l.qty,
        priceCents: l.unitPriceCents,
      })),
      site.currency,
    );
    if (result.ok) {
      window.location.href = result.checkoutUrl;
      return;
    }
    setCheckoutError(result.error);
    setCheckingOut(false);
  };

  return (
    <div
      className={cn("fixed inset-0 z-70", !isOpen && "pointer-events-none")}
      inert={!isOpen}
    >
      <div
        onClick={close}
        className={cn(
          "absolute inset-0 bg-overlay backdrop-blur-[2px] transition-opacity duration-300",
          isOpen ? "opacity-100" : "opacity-0",
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Shopping bag"
        className={cn(
          "absolute inset-y-0 right-0 flex w-full max-w-md flex-col bg-cream shadow-(--shadow-lift) transition-transform duration-500 ease-(--ease-out-expo)",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <header className="flex items-center justify-between border-b border-sand/70 px-6 py-5">
          <h2 className="font-display text-[1.15rem] font-medium text-espresso">
            Your bag
            {count > 0 && (
              <span className="ml-2 text-espresso-mute tabular-nums">
                ({count})
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Close bag"
            className="grid size-10 place-items-center rounded-full border border-sand text-espresso transition-colors duration-300 hover:border-espresso/40"
          >
            <Icon name="close" className="size-4" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-5 px-8 text-center">
            <span className="grid size-14 place-items-center rounded-full bg-sage-soft">
              <Icon name="bag" className="size-6 text-sage-deep" />
            </span>
            <p className="text-[0.95rem] text-espresso-soft">
              Your bag is empty.
            </p>
            <Button href="/shop" variant="outline" size="md" onClick={close}>
              Browse the shop
            </Button>
          </div>
        ) : (
          <>
            <ul className="min-h-0 flex-1 divide-y divide-sand/70 overflow-y-auto px-6">
              {lines.map((line) => (
                <li key={line.variantId} className="flex gap-4 py-5">
                  <div className="relative size-20 shrink-0 overflow-hidden rounded-xl bg-cream-deep">
                    {line.image && (
                      <Image
                        src={line.image}
                        alt={line.name}
                        fill
                        sizes="80px"
                        quality={75}
                        className="object-cover"
                      />
                    )}
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <p className="text-[0.92rem] leading-snug font-medium text-espresso">
                      {line.name}
                    </p>
                    <p className="mt-1 text-[0.85rem] text-espresso-mute tabular-nums">
                      {formatMoney(line.unitPriceCents / 100, site.currency)}
                    </p>

                    <div className="mt-auto flex items-center justify-between gap-3 pt-3">
                      <div className="flex items-center rounded-full border border-sand">
                        <button
                          type="button"
                          onClick={() => setQty(line.variantId, line.qty - 1)}
                          aria-label={`Decrease quantity of ${line.name}`}
                          className="grid size-8 place-items-center rounded-full text-espresso-soft transition-colors duration-200 hover:text-espresso"
                        >
                          <Icon name="minus" className="size-3.5" />
                        </button>
                        <span className="min-w-7 text-center text-[0.85rem] font-semibold text-espresso tabular-nums">
                          {line.qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => setQty(line.variantId, line.qty + 1)}
                          aria-label={`Increase quantity of ${line.name}`}
                          className="grid size-8 place-items-center rounded-full text-espresso-soft transition-colors duration-200 hover:text-espresso"
                        >
                          <Icon name="plus" className="size-3.5" />
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => remove(line.variantId)}
                        className="text-[0.78rem] text-espresso-mute underline decoration-sand-strong underline-offset-3 transition-colors duration-200 hover:text-terracotta"
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  <p className="shrink-0 text-[0.92rem] font-semibold text-espresso tabular-nums">
                    {formatMoney(line.lineTotalCents / 100, site.currency)}
                  </p>
                </li>
              ))}
            </ul>

            <footer className="border-t border-sand/70 bg-paper px-6 pt-5 pb-[calc(env(safe-area-inset-bottom)+1.25rem)]">
              <div className="flex items-baseline justify-between">
                <span className="font-label text-[0.72rem] font-bold tracking-[0.12em] text-espresso-mute uppercase">
                  Subtotal
                </span>
                <span className="font-display text-[1.3rem] font-semibold text-espresso tabular-nums">
                  {formatMoney(subtotalCents / 100, site.currency)}
                </span>
              </div>
              <p className="mt-1.5 text-[0.78rem] text-espresso-mute">
                Taxes and any duties are calculated at checkout.{" "}
                {site.promise.shipping}.
              </p>

              {checkoutError && (
                <p
                  role="alert"
                  className="mt-3 rounded-xl bg-terracotta-soft px-4 py-3 text-[0.82rem] leading-snug text-terracotta"
                >
                  {checkoutError}
                </p>
              )}

              <Button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="mt-4 w-full"
                arrow={!checkingOut}
              >
                {checkingOut ? "Taking you to checkout…" : "Checkout"}
              </Button>
            </footer>
          </>
        )}
      </aside>
    </div>
  );
}
