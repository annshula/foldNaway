import type { ReactNode } from "react";

import { Icon } from "@/components/ui/Icons";

/**
 * Compact buy-box accordion — a quick reference (how to use, material/care,
 * storage) right under the buy button, for a shopper who wants the essentials
 * without leaving the buy panel. Modeled on
 * reference/components/product/ProductAccordion.tsx; content is passed in by
 * the caller (BuyBox) rather than hardcoded here, same as the reference.
 */
export function ProductAccordion({
  items,
}: {
  items: { title: string; body: ReactNode }[];
}) {
  return (
    <div className="mt-6 flex flex-col divide-y divide-sand border-y border-sand">
      {items.map((item) => (
        <details key={item.title} className="group py-1">
          <summary className="flex min-h-12 cursor-pointer list-none items-center justify-between gap-4 py-2 text-[0.85rem] font-semibold text-espresso">
            {item.title}
            <Icon
              name="plus"
              className="size-4 shrink-0 text-espresso-mute transition-transform duration-300 group-open:rotate-45"
            />
          </summary>
          <div className="pb-4 text-[0.8rem] leading-relaxed text-espresso-mute">
            {item.body}
          </div>
        </details>
      ))}
    </div>
  );
}
