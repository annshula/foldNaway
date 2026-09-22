"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { getExternalId } from "@/lib/ad-identity";

/** Minimal shape of the fbq stub the loader snippet installs on `window`. */
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/**
 * Meta (Facebook) Pixel — conversion tracking for ads. Loads only in the
 * browser, only when NEXT_PUBLIC_META_PIXEL_ID is set, so local runs and
 * previews without the id stay out of the production pixel's data.
 *
 * The loader snippet fires the first PageView itself. App Router navigations
 * are client-side, so no further page loads happen and the effect below sends
 * PageView for each subsequent route change.
 *
 * `init` carries `external_id` (Advanced Matching) — the same persisted id
 * `lib/ad-identity.ts` puts on the Shopify cart at checkout, so a purchase
 * the `orders/paid` webhook reports server-side (Conversions API) can still
 * match back to this browser's earlier ViewContent/AddToCart, raising Event
 * Match Quality on every event this pixel fires, not only Purchase. It's
 * read/generated here (not passed as a prop) because it must exist before
 * the very first `init` call — Meta only treats advanced-matching values
 * present in the base init as "manual advanced matching", not a later call.
 */
export function MetaPixel() {
  const pixelId = process.env.NEXT_PUBLIC_META_PIXEL_ID;
  const pathname = usePathname();
  /** Skips the initial render — the loader snippet already sent that one. */
  const bootstrapped = useRef(false);

  useEffect(() => {
    if (!pixelId) return;
    if (!bootstrapped.current) {
      bootstrapped.current = true;
      return;
    }
    window.fbq?.("track", "PageView");
  }, [pixelId, pathname]);

  if (!pixelId) return null;

  // Computed at render time, not in an effect: the Script tag below embeds
  // it directly in the loader string, so it must be ready before that
  // string is built. Safe here specifically because MetaPixel only ever
  // renders client-side content behind the `if (!pixelId) return null`
  // above never differing server/client — see ad-identity.ts for why a
  // missing/blocked localStorage degrades to no external_id rather than
  // throwing.
  const externalId = getExternalId();

  return (
    <>
      <Script id="meta-pixel" strategy="lazyOnload">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${pixelId}'${externalId ? `, {external_id: '${externalId}'}` : ""});
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: "none" }}
          alt=""
          src={`https://www.facebook.com/tr?id=${pixelId}&ev=PageView&noscript=1`}
        />
      </noscript>
    </>
  );
}
