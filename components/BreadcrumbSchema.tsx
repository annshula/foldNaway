import { absoluteUrl } from "@/lib/seo";

/**
 * BreadcrumbList structured data — powers Google's breadcrumb rich result and
 * gives answer engines an explicit site-hierarchy signal (this page sits
 * under Shop) beyond what they would infer from the URL alone.
 *
 * `items` is passed in rather than derived from the page's own markup, so
 * this component has no JSX dependency on any one page's layout.
 */
export default function BreadcrumbSchema({
  items,
}: {
  items: { name: string; path: string }[];
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
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
