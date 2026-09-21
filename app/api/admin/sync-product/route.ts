import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { isAuthorizedAdminRequest, unauthorizedResponse } from "@/lib/admin/auth";
import { syncAllProducts } from "@/lib/shopify/sync-product";

/**
 * POST /api/admin/sync-product
 *
 * The one place besides `npm run shopify:sync` that talks to Shopify live —
 * refreshes every product already in data/product.json (id, handle, title,
 * images, variants, every curated market's price list), then overwrites the
 * file. Every page reads that file only. Protected by ADMIN_API_KEY (Bearer
 * token).
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

async function runSync(): Promise<Response> {
  try {
    const record = await syncAllProducts();
    return NextResponse.json(
      {
        ok: true,
        syncedAt: record.syncedAt,
        shop: record.shop,
        markets: record.markets,
        products: record.products.map((p) => ({
          handle: p.handle,
          title: p.title,
          price: p.price,
          availableForSale: p.availableForSale,
          variantCount: p.variants.length,
        })),
      },
      { headers: { "Cache-Control": "no-store", "X-Robots-Tag": "noindex, nofollow" } },
    );
  } catch (error) {
    console.error("[admin/sync-product] failed:", (error as Error).message);
    return NextResponse.json(
      { ok: false, error: (error as Error).message },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }
}

export async function POST(request: Request): Promise<Response> {
  if (!isAuthorizedAdminRequest(request)) return unauthorizedResponse();
  return runSync();
}

/**
 * Vercel Cron only ever sends GET, with no custom headers of its own — it
 * authenticates by sending `Authorization: Bearer $CRON_SECRET` itself
 * (Vercel's own convention, separate from this route's POST/ADMIN_API_KEY
 * path). Kept as its own check rather than reusing isAuthorizedAdminRequest
 * so a leaked CRON_SECRET can't be used to hit the POST path or vice versa.
 * Daily cadence (vercel.json) covers Shopify's normal ~weekly Markets rate
 * updates with margin for the faster updates that happen during volatility
 * — Shopify sends no webhook for a currency/rate change at all (confirmed:
 * community.shopify.dev/t/currency-conversion-rate-changes-do-not-trigger-
 * product-updates/32309), so a daily poll is the only option.
 */
export async function GET(request: Request): Promise<Response> {
  const expected = process.env.CRON_SECRET;
  if (!expected) return unauthorizedResponse();

  const header = request.headers.get("authorization") ?? "";
  const provided = header.startsWith("Bearer ")
    ? header.slice("Bearer ".length)
    : "";
  if (!provided) return unauthorizedResponse();

  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !timingSafeEqual(a, b)) {
    return unauthorizedResponse();
  }

  return runSync();
}
