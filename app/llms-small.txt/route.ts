import { buildLlmsSmallTxt } from "@/lib/llms";

export const revalidate = 3600;

/**
 * /llms-small.txt — a condensed, link-only variant for models and retrieval
 * systems that want the site map without prose. Same sources as /llms.txt —
 * see lib/llms.ts.
 */
export function GET() {
  return new Response(buildLlmsSmallTxt(), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
