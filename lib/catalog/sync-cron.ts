import "server-only";
import cron from "node-cron";

/**
 * In-process daily catalog re-sync — started once from instrumentation.ts's
 * register() on server boot. Requires an always-on process (this app runs on
 * a VPS, not serverless); see instrumentation.ts's doc comment for why this
 * would silently never fire on Vercel/serverless.
 *
 * Exists because Shopify Markets exchange rates can drift between syncs with
 * no webhook to react to (confirmed: Shopify does not fire any event on a
 * currency/rate change — community.shopify.dev/t/currency-conversion-rate-
 * changes-do-not-trigger-product-updates/32309). The synced snapshot in
 * data/product.json (read by every page via lib/catalog.ts's priceForMarket)
 * is what BuyBox/CartDrawer display; the automatic pack discount at Shopify
 * checkout is computed off Shopify's LIVE price. A stale snapshot is exactly
 * how the on-page pack total and the checkout total can diverge by a few
 * currency units even when the discount itself is configured correctly.
 *
 * Daily covers Shopify's normal ~weekly rate-update cadence with margin for
 * the faster updates that happen during high volatility (Shopify Help
 * Center: rates can update more often than weekly when they move >5%).
 *
 * Calls the existing POST /api/admin/sync-product route over loopback HTTP
 * rather than importing syncAllProducts()/lib/catalog/storage.ts directly.
 * That module chain pulls in node:crypto, and instrumentation.ts's bundle
 * (traced eagerly for both edge and nodejs targets) hits webpack's
 * UnhandledSchemeError on node:-prefixed builtins even behind a
 * NEXT_RUNTIME guard — a known Next.js/webpack limitation, not something
 * fixable from this file. Going through the route means this module has no
 * Node-builtin-importing dependency at all, so nothing is traced into it.
 */
let started = false;

export function registerCatalogSyncCron(): void {
  if (started) return;
  started = true;

  // 03:00 UTC daily — a low-traffic window for every configured market
  // (AU/CA/IN/ZA/GB/US).
  cron.schedule("0 3 * * *", async () => {
    const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000").replace(/\/+$/, "");
    const adminKey = process.env.ADMIN_API_KEY;
    if (!adminKey) {
      console.error(
        "[catalog-sync-cron] ADMIN_API_KEY is not set — skipping scheduled sync.",
      );
      return;
    }
    try {
      const res = await fetch(`${baseUrl}/api/admin/sync-product`, {
        method: "POST",
        headers: { Authorization: `Bearer ${adminKey}` },
      });
      const body = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        syncedAt?: string;
        products?: unknown[];
        error?: string;
      };
      if (!res.ok || !body.ok) {
        throw new Error(body.error ?? `HTTP ${res.status}`);
      }
      console.log(
        `[catalog-sync-cron] synced ${body.products?.length ?? 0} product(s) at ${body.syncedAt}`,
      );
    } catch (error) {
      // Never let a failed sync crash the server process — tomorrow's run
      // still fires, and the page keeps serving yesterday's (still valid,
      // just older) snapshot in the meantime rather than going down.
      console.error(
        "[catalog-sync-cron] sync failed:",
        (error as Error).message,
      );
    }
  });

  console.log("[catalog-sync-cron] scheduled daily catalog sync at 03:00 UTC");
}
