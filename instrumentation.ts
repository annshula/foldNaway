/**
 * Next.js server-startup hook (https://nextjs.org/docs/app/guides/instrumentation).
 * `register()` runs once when the server process boots — the one place to
 * start anything long-lived like an in-process cron, since Next.js has no
 * other "on server start" lifecycle event.
 *
 * Requires an always-on process (VPS/PM2/systemd, `next start` kept alive) —
 * this does NOT work on Vercel or other serverless hosts, where the process
 * spins down between requests and a setInterval-based schedule never fires
 * reliably. If this app is ever moved to serverless, use a platform cron
 * (e.g. Vercel Cron hitting GET /api/admin/sync-product) instead — see that
 * route's own doc comment for the CRON_SECRET-authenticated path already
 * wired for exactly that swap.
 */
export async function register() {
  // Only the Node.js server runtime has cron/env access — the edge runtime
  // and the client bundle both also execute this file's module scope, so
  // this must be gated or the cron job would attempt to register twice (or
  // crash on APIs the edge runtime doesn't have).
  if (process.env.NEXT_RUNTIME !== "nodejs") return;

  const { registerCatalogSyncCron } = await import(
    "@/lib/catalog/sync-cron"
  );
  registerCatalogSyncCron();
}
