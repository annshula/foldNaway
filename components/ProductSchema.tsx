import type { Product } from "@/lib/product";
import { site } from "@/lib/site";

/**
 * Structured data for the product page. Split out from components/Schema.tsx
 * (Organization / WebSite / FAQPage, mounted on home) because Product and
 * Offer markup belongs on the page the product is actually bought on.
 *
 * ⚠️ AggregateRating is intentionally conditional on `site.metrics.verified`.
 * The on-page review UI runs on a hand-written dataset (data/reviews.ts);
 * marking those up as real ratings would be unverifiable review markup — the
 * fastest way to get every rich result on the domain suppressed, and an FTC
 * matter in the US. Flip that flag only when the rating and count come from a
 * real review platform.
 *
 * Every variant gets its own Offer with real shipping and return terms, so
 * Google Merchant / Shopping surfaces read the same promises the site makes
 * in prose (see lib/site.ts `promise`).
 */
export default function ProductSchema({
  product,
  rating,
}: {
  product: Product;
  rating?: { average: number; count: number };
}) {
  const url = site.url;
  const productUrl = `${url}/products/${product.handle}`;
  const prices = product.variants.map((v) => v.price.amount);

  /** Where free tracked shipping is offered — kept in one place. */
  const shipsTo = ["US", "GB", "CA", "AU", "DE", "FR", "NL", "IE", "NZ"];

  const data = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${productUrl}/#product`,
    name: product.title,
    description:
      product.descriptionHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim() ||
      product.subtitle,
    sku: product.variants[0]?.sku,
    brand: { "@type": "Brand", name: site.name },
    material: product.material,
    category: "Reusable shopping bags",
    // The six real Shopify colourways, so a shopping crawler can match on
    // colour without parsing the variant picker.
    color: product.variants.map((v) => v.title),
    // Gallery images may be absolute (Shopify CDN) or site-relative (local
    // art) — never blindly prefix, or an absolute URL becomes
    // "https://foldnaway.com/https://cdn.shopify.com/…".
    image: product.gallery.map((g) =>
      g.src.startsWith("http") ? g.src : `${url}${g.src}`,
    ),
    ...(site.metrics.verified && rating
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating.average,
            reviewCount: rating.count,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    offers: {
      "@type": "AggregateOffer",
      url: productUrl,
      priceCurrency: product.variants[0]?.price.currencyCode ?? site.currency,
      lowPrice: Math.min(...prices),
      highPrice: Math.max(...prices),
      offerCount: product.variants.length,
      availability: product.variants.some((v) => v.availableForSale)
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: { "@id": `${url}/#organization` },
      offers: product.variants.map((v) => ({
        "@type": "Offer",
        sku: v.sku,
        name: v.title,
        price: v.price.amount,
        priceCurrency: v.price.currencyCode,
        itemCondition: "https://schema.org/NewCondition",
        availability: v.availableForSale
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        url: productUrl,
        shippingDetails: {
          "@type": "OfferShippingDetails",
          shippingRate: {
            "@type": "MonetaryAmount",
            value: 0,
            currency: v.price.currencyCode,
          },
          shippingDestination: {
            "@type": "DefinedRegion",
            addressCountry: shipsTo,
          },
          deliveryTime: {
            "@type": "ShippingDeliveryTime",
            // Matches site.promise.shippingFull exactly: dispatch 1–3
            // business days, then 7–15 business days in transit.
            handlingTime: {
              "@type": "QuantitativeValue",
              minValue: 1,
              maxValue: 3,
              unitCode: "DAY",
            },
            transitTime: {
              "@type": "QuantitativeValue",
              minValue: 7,
              maxValue: 15,
              unitCode: "DAY",
            },
          },
        },
        hasMerchantReturnPolicy: {
          "@type": "MerchantReturnPolicy",
          applicableCountry: shipsTo,
          // Real any-reason 30-day return window — matches
          // site.promise.returnsDetail and the account return flow
          // (lib/account/order-status.ts's RETURN_WINDOW_DAYS).
          returnPolicyCategory:
            "https://schema.org/MerchantReturnFiniteReturnWindow",
          merchantReturnDays: 30,
          returnMethod: "https://schema.org/ReturnByMail",
          returnFees: "https://schema.org/FreeReturn",
        },
      })),
    },
  };

  return (
    <script
      type="application/ld+json"
      // Content is fully author-controlled; no user input reaches this string.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
