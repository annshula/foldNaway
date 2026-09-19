import type { MetadataRoute } from "next";

import { products } from "@/lib/product";
import { site } from "@/lib/site";

/**
 * XML sitemap.
 *
 * Product handles come from the synced catalog (data/product.json), so a
 * product renamed in Shopify and re-synced changes its sitemap entry with no
 * other edit. Images are included per product: Google Images and Shopping
 * both use them, and the gallery is the strongest visual signal this site
 * has for a physical product.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    {
      url: site.url,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${site.url}/shop`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...products.map((p) => ({
      url: `${site.url}/products/${p.handle}`,
      lastModified: now,
      changeFrequency: "daily" as const,
      priority: 1,
      images: p.gallery
        .slice(0, 6)
        .map((img) => (img.src.startsWith("http") ? img.src : `${site.url}${img.src}`)),
    })),
    {
      url: `${site.url}/benefits`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${site.url}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${site.url}/contact`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.4,
    },
  ];
}
