/**
 * Selected-country cookie. Stores only an ISO country code the shopper picked
 * (e.g. "CA") — never a currency amount or rate. Every price for that choice
 * is a real Shopify Markets price already synced into data/product.json
 * (see lib/catalog.ts's priceForMarket); this cookie just says which market
 * to read for them.
 */

import { cookies, headers } from "next/headers";

import { detectVisitorCountry } from "@/lib/localization/geo";

const COUNTRY_COOKIE = "fna_country";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  maxAge: 60 * 60 * 24 * 365,
};

export async function readSelectedCountry(): Promise<string | null> {
  const store = await cookies();
  return store.get(COUNTRY_COOKIE)?.value ?? null;
}

export async function writeSelectedCountry(isoCode: string): Promise<void> {
  const store = await cookies();
  store.set(COUNTRY_COOKIE, isoCode, cookieOptions);
}

/** "Auto" — clears the manual override so the geo-detected country applies. */
export async function clearSelectedCountry(): Promise<void> {
  const store = await cookies();
  store.delete(COUNTRY_COOKIE);
}

/**
 * The country that should drive pricing: the visitor's explicit choice if
 * they made one, otherwise the edge-geolocated country.
 */
export async function resolveEffectiveCountry(): Promise<string | null> {
  const selected = await readSelectedCountry();
  if (selected) return selected;
  const headerList = await headers();
  return detectVisitorCountry(headerList);
}
