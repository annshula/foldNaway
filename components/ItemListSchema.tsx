import { absoluteUrl } from "@/lib/seo";

/**
 * ItemList structured data for a product listing/collection page — tells
 * Google (CollectionPage rich results) and answer/generative engines that
 * this page enumerates a specific, ordered set of products, rather than
 * leaving them to infer a "shop" page's purpose from its URL/heading alone.
 *
 * Deliberately just ItemList + a plain Product stub per entry (name/url/
 * image), not a full nested Product/Offer graph — the product's own detail
 * page (components/ProductSchema.tsx) is the single place full Offer/
 * AggregateOffer/aggregateRating data lives, so a price or rating can never
 * drift between two schema sources describing the same product.
 */
export default function ItemListSchema({
  items,
}: {
  items: { name: string; path: string; image?: string }[];
}) {
  if (items.length === 0) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Product",
        name: item.name,
        url: absoluteUrl(item.path),
        ...(item.image ? { image: absoluteUrl(item.image) } : {}),
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      // Content is fully author-controlled; no user input reaches this string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
