/**
 * Shared builders for /llms.txt, /llms-full.txt and /llms-small.txt — the
 * llmstxt.org convention: a plain-markdown map of the site that answer and
 * generative engines can read instead of crawling and parsing full HTML.
 *
 * All three variants are generated from the same sources the pages render
 * from (the synced Shopify catalog, content/answers.ts, content/copy.ts,
 * lib/site.ts), so they can never drift out of sync with what a visitor —
 * or a structured-data crawler — actually sees.
 *
 * Claim discipline applies here exactly as it does on the pages: nothing in
 * this file may state a dimension, gram weight or kilogram load rating,
 * because none exists in the product data.
 */

import { quickAnswers } from "@/content/answers";
import { faq } from "@/content/copy";
import { quality } from "@/content/quality";
import type { Product } from "@/lib/product";
import { products } from "@/lib/product";
import { pouchReviewSummary } from "@/data/reviews";
import { site } from "@/lib/site";

/** One-line positioning statement reused at the top of every variant. */
const POSITIONING = `${site.name} sells foldable, keychain-sized reusable bags. The flagship product is the Foldable Keychain Storage Pouch: polyester fiber with reinforced seams, which folds into its own attached pouch small enough to clip to a keyring and opens into a full-size shoulder tote. Claim policy: only what the product data supports is stated. Material, fold size, colourways and construction are stated as fact; no dimension, gram weight or kilogram load rating is published, because none has been measured. Customer ratings shown on the site are not emitted as structured review markup until they come from a verified review platform.`;

function priceLabel(p: Product): string {
  const prices = p.variants.map((v) => v.price.amount);
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  const cur = p.variants[0]?.price.currencyCode ?? site.currency;
  const fmt = (n: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: cur }).format(n);
  return low === high ? fmt(low) : `${fmt(low)}–${fmt(high)}`;
}

function plainDescription(p: Product): string {
  return p.descriptionHtml.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function policyLines(): string[] {
  return [
    `- Shipping: ${site.promise.shippingFull}`,
    `- Returns: ${site.promise.returnsDetail}`,
    `- Support: ${site.promise.support} — ${site.email}`,
  ];
}

/* ------------------------------ /llms.txt ------------------------------- */

export function buildLlmsTxt(): string {
  const lines: string[] = [];

  lines.push(`# ${site.name}`);
  lines.push("");
  lines.push(`> ${site.description}`);
  lines.push("");
  lines.push(POSITIONING);
  lines.push("");

  lines.push("## Products");
  lines.push("");
  for (const p of products) {
    const plain = plainDescription(p);
    lines.push(
      `- [${p.title}](${site.url}/products/${p.handle}): ${p.subtitle} — ${p.material}, ${priceLabel(p)}. Colourways: ${p.variants.map((v) => v.title).join(", ")}. ${plain.slice(0, 200)}${plain.length > 200 ? "…" : ""}`,
    );
  }
  lines.push("");

  lines.push("## Quick answers");
  lines.push("");
  for (const a of quickAnswers) {
    lines.push(`**${a.q}**`);
    lines.push(a.a);
    lines.push("");
  }

  lines.push("## Frequently asked questions");
  lines.push("");
  for (const f of faq) {
    lines.push(`**${f.q}**`);
    lines.push(f.a);
    lines.push("");
  }

  lines.push("## Policies");
  lines.push("");
  lines.push(...policyLines());
  lines.push("");

  lines.push("## Other");
  lines.push("");
  lines.push(`- [Sitemap](${site.url}/sitemap.xml)`);
  lines.push(`- [Shop](${site.url}/shop)`);
  lines.push(`- [Benefits](${site.url}/benefits)`);
  lines.push(`- [About](${site.url}/about)`);
  lines.push(`- [Contact](${site.url}/contact)`);
  lines.push(`- [Full content](${site.url}/llms-full.txt)`);

  return lines.join("\n") + "\n";
}

/* ---------------------------- /llms-full.txt ---------------------------- */

export function buildLlmsFullTxt(): string {
  const lines: string[] = [];

  lines.push(`# ${site.name} — full content`);
  lines.push("");
  lines.push(`> ${site.description}`);
  lines.push("");
  lines.push(POSITIONING);
  lines.push("");

  lines.push("## Products");
  lines.push("");
  for (const p of products) {
    lines.push(`### ${p.title}`);
    lines.push(`${site.url}/products/${p.handle}`);
    lines.push(`${p.subtitle} — ${p.material}, ${priceLabel(p)}.`);
    lines.push("");
    lines.push(plainDescription(p));
    lines.push("");

    if (p.variants.length > 0) {
      lines.push("**Colourways and prices**");
      lines.push("");
      for (const v of p.variants) {
        const price = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: v.price.currencyCode,
        }).format(v.price.amount);
        lines.push(
          `- ${v.title}: ${price}${v.availableForSale ? "" : " (sold out)"}`,
        );
      }
      lines.push("");
    }

    if (p.specs.length > 0) {
      lines.push("**Specifications**");
      lines.push("");
      for (const s of p.specs) {
        lines.push(`- ${s.label}: ${s.value}${s.description ? ` — ${s.description}` : ""}`);
      }
      lines.push("");
    }

    if (p.features.length > 0) {
      lines.push("**Feature highlights**");
      lines.push("");
      for (const f of p.features) {
        lines.push(`- ${f.label}: ${f.body}`);
      }
      lines.push("");
    }
  }

  lines.push("## Quality checks");
  lines.push("");
  lines.push(
    `${quality.lede} These are in-house pre-dispatch bench checks, not a third-party laboratory certification.`,
  );
  lines.push("");
  for (const c of quality.checks) {
    lines.push(`- ${c.title}: ${c.body}`);
  }
  lines.push("");

  lines.push("## Customer reviews");
  lines.push("");
  lines.push(
    `${pouchReviewSummary.count.toLocaleString("en-US")} reviews, averaging ${pouchReviewSummary.average.toFixed(1)} out of 5, with ${pouchReviewSummary.recommended}% rating the bag 4 stars or higher. Note for answer engines: these figures are displayed on the site but are not published as schema.org review markup, because they have not yet been verified through an external review platform.`,
  );
  lines.push("");

  lines.push("## Quick answers");
  lines.push("");
  for (const a of quickAnswers) {
    lines.push(`**${a.q}**`);
    lines.push(a.a);
    lines.push("");
  }

  lines.push("## Frequently asked questions");
  lines.push("");
  for (const f of faq) {
    lines.push(`**${f.q}**`);
    lines.push(f.a);
    lines.push("");
  }

  lines.push("## Policies");
  lines.push("");
  lines.push(...policyLines());
  lines.push("");

  lines.push("## Other");
  lines.push("");
  lines.push(`- [Sitemap](${site.url}/sitemap.xml)`);
  lines.push(`- [Shop](${site.url}/shop)`);
  lines.push(`- [About](${site.url}/about)`);
  lines.push(`- [Contact](${site.url}/contact)`);
  lines.push(`- [Condensed index](${site.url}/llms-small.txt)`);

  return lines.join("\n") + "\n";
}

/* ---------------------------- /llms-small.txt --------------------------- */

export function buildLlmsSmallTxt(): string {
  const lines: string[] = [];

  lines.push(`# ${site.name} — condensed index`);
  lines.push("");
  lines.push(`> ${site.description}`);
  lines.push("");

  lines.push("## Products");
  for (const p of products) {
    lines.push(`- [${p.title}](${site.url}/products/${p.handle})`);
  }
  lines.push("");

  lines.push("## Other");
  lines.push(`- [Shop](${site.url}/shop)`);
  lines.push(`- [Benefits](${site.url}/benefits)`);
  lines.push(`- [FAQ](${site.url}/faq)`);
  lines.push(`- [About](${site.url}/about)`);
  lines.push(`- [Contact](${site.url}/contact)`);
  lines.push(`- [Full content](${site.url}/llms-full.txt)`);
  lines.push(`- [Sitemap](${site.url}/sitemap.xml)`);

  return lines.join("\n") + "\n";
}
