import { buildLlmsFullTxt } from "@/lib/llms";

export const revalidate = 3600;

/**
 * /llms-full.txt — the expanded llmstxt.org variant: full product
 * descriptions, every colourway and price, the specs, the quality checks and
 * every answer inline, so a model can answer from this one file without a
 * further fetch. Same sources as /llms.txt — see lib/llms.ts.
 */
export function GET() {
  return new Response(buildLlmsFullTxt(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
