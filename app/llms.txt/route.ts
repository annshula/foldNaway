import { buildLlmsTxt } from "@/lib/llms";

export const revalidate = 3600;

/**
 * /llms.txt — the llmstxt.org convention: a plain-markdown map of the site
 * for answer/generative engines (ChatGPT browsing, Claude, Perplexity, AI
 * Overviews) to read instead of crawling and parsing full HTML.
 *
 * Built from the same data the pages render from, so it cannot drift out of
 * sync with what a visitor sees — see lib/llms.ts.
 */
export function GET() {
  return new Response(buildLlmsTxt(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
