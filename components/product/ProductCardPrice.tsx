"use client";

import { useLocalization } from "@/components/providers/LocalizationProvider";
import { priceForMarket } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";

/**
 * "From <price>" on a shop-grid card, in the shopper's localized market
 * currency — not the catalog's default/US price. The shop page itself stays
 * a server component (it doesn't need the shopper's country to render), so
 * only this price fragment is a client island, same split as BuyBox's own
 * price row (see useLocalizedAmount's doc comment: pricing is a synchronous
 * lookup against the already-synced catalog, no fetch, so this never shows
 * a loading state — it renders the fallback instantly, then the localized
 * price the moment LocalizationProvider knows the shopper's country).
 */
export function ProductCardPrice({
  variantIds,
  fallbackAmount,
  fallbackCurrency,
}: {
  /** Every variant id on this product — the lowest localized price among them is "From". */
  variantIds: string[];
  fallbackAmount: number;
  fallbackCurrency: string;
}) {
  const { country, defaultCountry } = useLocalization();
  const effectiveCountry = country ?? defaultCountry?.isoCode ?? null;

  let amount = fallbackAmount;
  let currency = fallbackCurrency;

  if (variantIds.length > 0) {
    const prices = variantIds.map((id) => priceForMarket(id, effectiveCountry));
    const lowest = prices.reduce((min, p) => (p.amount < min.amount ? p : min));
    amount = lowest.amount;
    currency = lowest.currencyCode;
  }

  return (
    <span className="font-mono text-[0.9rem] font-semibold text-espresso">
      From {formatMoney(amount, currency)}
    </span>
  );
}
