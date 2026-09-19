import { quickAnswers } from "@/content/answers";
import { faq } from "@/content/copy";
import { howItWorks } from "@/content/copy";
import { site } from "@/lib/site";

/**
 * Structured data for the home page — Organization, WebSite, FAQPage and a
 * HowTo for the fold. Product/Offer markup lives on the product page itself
 * (components/ProductSchema.tsx), not here: Google's guidance is that Product
 * structured data belongs on the page the product is actually transacted on,
 * and the home page explains the product rather than selling it.
 *
 * The FAQPage below merges the quick answers with the homepage FAQ — both of
 * which are rendered visibly on this page (QuickAnswers and Faq). Never add a
 * question here whose answer is not on screen: that is a guidelines violation
 * and answer engines discount invisible text.
 *
 * AggregateRating is deliberately absent, here and everywhere, while
 * site.metrics.verified is false — see ProductSchema for the full note.
 */
export default function Schema() {
  const url = site.url;

  // Deduplicate by question text: the quick answers and the FAQ overlap on
  // shipping and returns, and a FAQPage with the same question twice is
  // invalid.
  const seen = new Set<string>();
  const questions = [...quickAnswers, ...faq].filter((item) => {
    const key = item.q.trim().toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const graph: Record<string, unknown>[] = [
    {
      "@type": "Organization",
      "@id": `${url}/#organization`,
      name: site.name,
      legalName: site.legalName,
      url,
      slogan: site.tagline,
      description: site.description,
      email: site.email,
      sameAs: Object.values(site.socials),
    },
    {
      "@type": "WebSite",
      "@id": `${url}/#website`,
      url,
      name: site.name,
      description: site.description,
      publisher: { "@id": `${url}/#organization` },
      about: { "@id": `${url}/#foldable-bag` },
      inLanguage: "en",
    },
    {
      // Gives answer engines an explicit topical anchor: this site is about
      // the reusable-bag category, not bags in general.
      "@type": "Thing",
      "@id": `${url}/#foldable-bag`,
      name: "Foldable reusable shopping bag",
      alternateName: ["Packable tote", "Keychain eco-bag", "Foldable eco-bag"],
      description:
        "A reusable shopping tote that folds into a small attached pouch, compact enough to carry on a keyring so it is present at the point of purchase.",
      sameAs: ["https://en.wikipedia.org/wiki/Reusable_shopping_bag"],
    },
    {
      "@type": "FAQPage",
      "@id": `${url}/#faq`,
      mainEntity: questions.map((item) => ({
        "@type": "Question",
        name: item.q,
        acceptedAnswer: { "@type": "Answer", text: item.a },
      })),
    },
    {
      "@type": "HowTo",
      "@id": `${url}/#how-to-fold`,
      name: "How to fold and unfold a FoldNAway pouch bag",
      description:
        "How to open a FoldNAway foldable keychain pouch into a full-size tote and fold it back into its own attached pouch.",
      totalTime: "PT10S",
      supply: [
        { "@type": "HowToSupply", name: "FoldNAway Foldable Keychain Storage Pouch" },
      ],
      step: howItWorks.steps.map((step) => ({
        "@type": "HowToStep",
        name: step.label,
        text: step.body,
      })),
    },
  ];

  return (
    <script
      type="application/ld+json"
      // Content is fully author-controlled; no user input reaches this string.
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          "@context": "https://schema.org",
          "@graph": graph,
        }),
      }}
    />
  );
}
