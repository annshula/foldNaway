import Link from "next/link";

import { Icon } from "@/components/ui/Icons";
import { formatMoney, shortDate } from "@/lib/money";
import type { OrderSummary } from "@/lib/shopify/types";

/**
 * One order in a list. Shared by the overview and the full history so both
 * read identically — a paper panel that lifts on hover, the same gesture as a
 * product card.
 */
export function OrderRow({ order }: { order: OrderSummary }) {
  const images = order.previewImages.filter(
    (img): img is { url: string; altText: string | null } => Boolean(img),
  );

  return (
    <Link
      href={`/account/orders/${encodeURIComponent(order.id)}`}
      className="group flex items-center justify-between gap-3 rounded-card border border-sand bg-paper px-4 py-4 shadow-sm transition-[border-color,box-shadow] duration-500 ease-(--ease-out-expo) hover:border-espresso/40 hover:shadow-(--shadow-lift) sm:gap-4 sm:px-5"
    >
      <div className="flex min-w-0 items-center gap-3 sm:gap-4">
        {/* The stacked previews are the first thing to go on a narrow phone —
            the order number and date carry the row on their own. */}
        <div className="hidden -space-x-3 min-[400px]:flex">
          {images.slice(0, 3).map((img, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              key={i}
              src={img.url}
              alt=""
              className="size-10 rounded-full border-2 border-paper bg-cream-deep object-cover sm:size-11"
            />
          ))}
          {images.length === 0 && (
            <span className="grid size-10 place-items-center rounded-full bg-cream-deep text-espresso-mute sm:size-11">
              <Icon name="bag" className="size-4" />
            </span>
          )}
        </div>
        <div className="min-w-0">
          <p className="font-display wrap-break-word text-[0.95rem] font-semibold text-espresso transition-colors duration-300 group-hover:text-espresso">
            {order.name}
          </p>
          <p className="mt-0.5 text-xs text-espresso-mute">
            {shortDate(order.processedAt)} · {order.lineItemCount} item
            {order.lineItemCount === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <span className="font-display text-[0.95rem] font-semibold text-espresso">
          {order.totalPrice
            ? formatMoney(
                order.totalPrice.amount,
                order.totalPrice.currencyCode,
              )
            : ""}
        </span>
        <Icon
          name="arrow-right"
          className="size-4 text-espresso-mute transition-transform duration-500 ease-(--ease-out-expo) group-hover:translate-x-1 group-hover:text-espresso"
        />
      </div>
    </Link>
  );
}
