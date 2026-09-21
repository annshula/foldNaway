/**
 * Maps a FoldNAway variant SKU (lib/product.ts) to CJDropshipping's own
 * variant id (vid) — the id live freight lookups need, not the Shopify
 * variant id and not the CJ SKU string itself. Looked up once by hand via
 * CJ's product-variants endpoint for pid 2608120323211616500 ("Foldable
 * Keychain Storage Pouch Large-Capacity Portable Handheld Shoulder Eco-Bag")
 * — all 6 colourways are the same physical item (100g, 100×70×70mm), so
 * this rarely needs touching again. Re-run that lookup and update this map
 * if the CJ product listing is ever recreated (a new pid means new vids).
 */
const CJ_VID_BY_SKU: Record<string, string> = {
  "CJYD305398201AZ": "2608120323211617400", // Black
  "CJYD305398202BY": "2608120323211618400", // Brown
  "CJYD305398203CX": "2608120323221610400", // Wine Red
  "CJYD305398204DW": "2608120323221611300", // Army Green
  "CJYD305398205EV": "2608120323221613100", // Green
  "CJYD305398206FU": "2608120323221614500", // Khaki
};

/** Falls back to the Black variant's vid for an unknown SKU — every colourway ships identically, so any real vid gives a correct estimate. */
const DEFAULT_VID = CJ_VID_BY_SKU["CJYD305398201AZ"];

export function cjVidForSku(sku: string): string {
  return CJ_VID_BY_SKU[sku] ?? DEFAULT_VID;
}
