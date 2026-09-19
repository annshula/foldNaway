/**
 * FAQPage structured data — the schema.org type Google, and increasingly the
 * answer/generative engines (ChatGPT, Perplexity, AI Overviews), use to lift
 * a direct question/answer pair out of a page.
 *
 * Only pass questions whose answers are rendered visibly on the same page.
 * Marking up an answer the visitor cannot see is a Google guidelines
 * violation, and answer engines discount invisible text.
 *
 * The home page does not use this component — its FAQPage node is part of the
 * site-wide @graph in components/Schema.tsx, so Organization, WebSite and the
 * FAQ all share one script tag and can cross-reference by @id.
 */
export default function FaqSchema({
  items,
  id,
}: {
  items: { q: string; a: string }[];
  /** Optional @id, so two FAQPage nodes on one site stay distinguishable. */
  id?: string;
}) {
  if (items.length === 0) return null;

  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    ...(id ? { "@id": id } : {}),
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
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
