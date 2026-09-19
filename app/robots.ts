import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      // Let the shopping crawlers in explicitly.
      {
        userAgent: [
          "Googlebot",
          "Googlebot-Image",
          "Storebot-Google",
          "Bingbot",
        ],
        allow: "/",
      },
      // Answer/generative engines (AEO/GEO): named explicitly rather than
      // left to the wildcard rule above, so it is unambiguous to a human or
      // an automated audit that these are welcome, not merely untouched by a
      // disallow. /api/ stays off-limits to everyone.
      {
        userAgent: [
          "GPTBot", // OpenAI (ChatGPT training + browsing)
          "ChatGPT-User", // OpenAI (live browsing on a user's behalf)
          "OAI-SearchBot", // OpenAI (ChatGPT search)
          "ClaudeBot", // Anthropic (Claude training + browsing)
          "Claude-User", // Anthropic (live browsing on a user's behalf)
          "Claude-SearchBot", // Anthropic (Claude search)
          "anthropic-ai",
          "PerplexityBot",
          "Perplexity-User",
          "Google-Extended", // Gemini/AI Overviews, separate from Googlebot
          "Applebot",
          "Applebot-Extended",
          "Bytespider", // TikTok/ByteDance
          "Amazonbot",
          "Meta-ExternalAgent",
          "MistralAI-User",
          "CCBot", // Common Crawl (feeds many LLM training sets)
          "Diffbot",
        ],
        allow: "/",
      },
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
