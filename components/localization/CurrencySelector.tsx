"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";

import { useLocalization } from "@/components/providers/LocalizationProvider";
import { Icon } from "@/components/ui/Icons";
import { useScrollLock } from "@/lib/scroll-lock";
import { cn } from "@/lib/utils";

const displayNames = new Intl.DisplayNames(["en"], { type: "currency" });
function currencyDisplayName(code: string): string {
  try {
    return displayNames.of(code) ?? code;
  } catch {
    return code;
  }
}

type Option = {
  countryCode: string;
  currencyCode: string;
  name: string;
  symbol: string;
};

/**
 * Currency switcher. One row per currency this store has a real synced
 * Shopify Markets price for (see data/product.json's `markets`), with a
 * type-to-search filter. Picking a currency re-resolves every price on the
 * page from the synced catalog (lib/catalog.ts's priceForMarket) instantly —
 * no fetch, see LocalizationProvider's own doc comment.
 *
 * `bar` is the desktop nav pill (symbol + code), opening as a popover
 * anchored under the trigger. `drawer` is the mobile menu's icon-only
 * circle; its list opens as a bottom sheet portalled to <body>, since a
 * popover anchored inside a transformed mobile drawer has nowhere to go but
 * off the side of the screen.
 */
export function CurrencySelector({
  variant = "bar",
  dark = false,
  lightMobile = false,
}: {
  variant?: "bar" | "drawer";
  /** True inside the mobile nav's dark drawer (bg-bark/text-oat) — matches AccountMenu's own `dark` prop. */
  dark?: boolean;
  /** `bar` variant only: true in the same window AccountMenu's own `lightMobile` is — Nav.tsx's transparent-header state, still visible between `sm` and `md`. */
  lightMobile?: boolean;
}) {
  const { ready, countries, defaultCountry, country, setCountry } =
    useLocalization();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [mounted, setMounted] = useState(false);
  const rootRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);
  const searchRef = useRef<HTMLInputElement | null>(null);

  const isDrawer = variant === "drawer";

  useEffect(() => setMounted(true), []);

  // The sheet covers the page, so the page must stop moving underneath it.
  useScrollLock(isDrawer && open);

  // One row per currency, keyed to the country that carries it — this
  // store's 6 curated markets never share a currency, so this is a plain
  // pass-through (no dedup needed, unlike a storefront with EU-wide markets).
  const options = useMemo<Option[]>(
    () =>
      countries.map((entry) => ({
        countryCode: entry.isoCode,
        currencyCode: entry.currency.isoCode,
        name: currencyDisplayName(entry.currency.isoCode),
        symbol: entry.currency.symbol,
      })),
    [countries],
  );

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return options;
    return options.filter(
      (o) =>
        o.currencyCode.toLowerCase().includes(needle) ||
        o.name.toLowerCase().includes(needle),
    );
  }, [options, query]);

  const toggle = () => {
    setOpen((v) => {
      const next = !v;
      if (next) setQuery("");
      return next;
    });
  };

  /* Focus the search box the moment the panel opens — except on the sheet,
     where it would summon the keyboard over the list the shopper came to
     read. There they tap the field themselves. */
  useEffect(() => {
    if (open && !isDrawer) searchRef.current?.focus();
  }, [open, isDrawer]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      const target = e.target as Node;
      // The sheet is portalled outside rootRef, so it needs its own check or
      // every tap inside it would read as "outside" and close it.
      if (rootRef.current?.contains(target)) return;
      if (sheetRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const triggerClass = isDrawer
    ? cn(
        "grid size-11 place-items-center rounded-full transition-colors duration-300",
        dark
          ? "text-oat hover:bg-white/10"
          : "text-espresso hover:bg-espresso/[0.07]",
      )
    : cn(
        "flex items-center gap-2 rounded-full border px-3.5 py-2 font-label text-[0.68rem] font-bold tracking-widest uppercase transition-colors duration-300",
        lightMobile
          ? "border-oat/30 text-oat hover:border-oat/60 md:border-sand md:text-espresso md:hover:border-espresso/40"
          : "border-sand text-espresso hover:border-espresso/40",
      );

  /* The country list is a round trip away. Hold the control's own footprint
     with a spinner rather than rendering nothing, so the header and the
     drawer's icon row do not reflow when it lands. */
  if (!ready) {
    return (
      <span
        role="status"
        aria-label="Loading currencies"
        className={cn(
          triggerClass,
          "pointer-events-none",
          !isDrawer && "min-w-22 justify-center",
        )}
      >
        <span
          aria-hidden="true"
          className="size-3.5 animate-spin rounded-full border-2 border-espresso-mute/30 border-t-espresso-mute"
        />
      </span>
    );
  }

  if (options.length <= 1) return null;

  const current = options.find(
    (o) => o.countryCode === (country ?? defaultCountry?.isoCode),
  );

  const pick = (code: string) => {
    setCountry(code);
    setOpen(false);
  };

  const list = (
    <CurrencyList
      searchRef={searchRef}
      query={query}
      setQuery={setQuery}
      filtered={filtered}
      country={country}
      currentCode={current?.countryCode ?? null}
      onPick={pick}
      size={isDrawer ? "sheet" : "popover"}
    />
  );

  return (
    <div ref={rootRef} className={isDrawer ? undefined : "relative"}>
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={
          current
            ? `Currency: ${current.currencyCode}. Change currency`
            : "Select currency"
        }
        className={cn(
          triggerClass,
          open &&
            (isDrawer
              ? dark
                ? "bg-white/10"
                : "bg-espresso/[0.07]"
              : "border-espresso/40"),
        )}
      >
        <span
          aria-hidden="true"
          className={cn("leading-none", isDrawer ? "text-base font-semibold" : "text-[0.9rem]")}
        >
          {current?.symbol ?? "$"}
        </span>
        {!isDrawer && <span>{current?.currencyCode ?? "USD"}</span>}
      </button>

      {open && !isDrawer && (
        <div className="absolute top-full right-0 z-50 mt-2 w-72 overflow-hidden rounded-2xl border border-sand bg-paper shadow-(--shadow-lift)">
          {list}
        </div>
      )}

      {/* Portalled to <body>: the mobile drawer animates on a transform,
          which would otherwise trap a `position: fixed` sheet inside its box. */}
      {open &&
        isDrawer &&
        mounted &&
        createPortal(
          <div className="fixed inset-0 z-90" role="dialog" aria-modal="true">
            <div
              aria-hidden="true"
              onClick={() => setOpen(false)}
              className="absolute inset-0 bg-overlay backdrop-blur-[2px]"
            />

            <div
              ref={sheetRef}
              className="absolute inset-x-0 bottom-0 flex max-h-[85svh] flex-col overflow-hidden rounded-t-[1.75rem] bg-paper pb-[env(safe-area-inset-bottom)] shadow-(--shadow-lift)"
            >
              {/* Grab handle — the affordance that says "this can be
                  dismissed" before anyone reads a word. */}
              <span
                aria-hidden="true"
                className="mx-auto mt-3 h-1 w-11 shrink-0 rounded-full bg-sand"
              />

              <div className="flex shrink-0 items-center justify-between gap-4 px-5 pt-4 pb-1">
                <h2 className="font-display text-[1.1rem] font-medium text-espresso">
                  Currency
                </h2>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close currency picker"
                  className="-mr-2 grid size-11 place-items-center rounded-full text-espresso-soft transition-colors duration-300 hover:bg-sage-soft hover:text-espresso"
                >
                  <Icon name="close" className="size-4" />
                </button>
              </div>

              {list}
            </div>
          </div>,
          document.body,
        )}
    </div>
  );
}

/**
 * The picker's contents, identical in the desktop popover and the mobile
 * sheet. Only the row height and list cap differ — a sheet gets thumb-sized
 * rows and the height the viewport allows.
 */
function CurrencyList({
  searchRef,
  query,
  setQuery,
  filtered,
  country,
  currentCode,
  onPick,
  size,
}: {
  searchRef: React.RefObject<HTMLInputElement | null>;
  query: string;
  setQuery: (value: string) => void;
  filtered: Option[];
  country: string | null;
  currentCode: string | null;
  onPick: (code: string) => void;
  size: "popover" | "sheet";
}) {
  const isSheet = size === "sheet";
  const rowClass = cn(
    "flex w-full items-center justify-between gap-3 rounded-xl text-left transition-colors duration-200 hover:bg-sage-soft",
    isSheet ? "px-4 py-3.5" : "px-3 py-2.5",
  );

  return (
    <>
      <div className={cn("pb-0", isSheet ? "px-3.5 pt-1" : "p-1.5 pb-0")}>
        <button
          type="button"
          role="option"
          aria-selected={country == null}
          onClick={() => onPick("AUTO")}
          className={rowClass}
        >
          <span className="font-label text-[0.68rem] font-bold tracking-widest text-espresso uppercase">
            Auto
          </span>
          <span className="text-[0.78rem] text-espresso-mute">
            based on your location
          </span>
        </button>
      </div>

      <div className={cn("pt-1 pb-1", isSheet ? "px-3.5" : "px-3")}>
        <div className="flex items-center gap-2 rounded-xl border border-sand bg-cream px-3 focus-within:border-sage">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
            className="size-4 shrink-0 text-espresso-mute"
          >
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
          <input
            ref={searchRef}
            type="text"
            role="searchbox"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search currency…"
            aria-label="Search currencies"
            className={cn(
              "w-full bg-transparent text-[0.85rem] text-espresso outline-none placeholder:text-espresso-mute",
              isSheet ? "py-3" : "py-2",
            )}
          />
        </div>
      </div>

      <ul
        role="listbox"
        aria-label="Currencies"
        className={cn(
          "overflow-y-auto overscroll-contain",
          isSheet ? "min-h-0 flex-1 px-3.5 pt-1 pb-4" : "max-h-[min(60vh,20rem)] p-1.5",
        )}
      >
        {filtered.map((option) => (
          <li key={option.countryCode}>
            <button
              type="button"
              role="option"
              aria-selected={
                country != null && option.countryCode === currentCode
              }
              onClick={() => onPick(option.countryCode)}
              className={rowClass}
            >
              <span className="flex items-center gap-2.5">
                <span
                  aria-hidden="true"
                  className="w-5 shrink-0 text-center text-[0.9rem] leading-none"
                >
                  {option.symbol}
                </span>
                <span className="text-[0.9rem] font-semibold text-espresso">
                  {option.currencyCode}
                </span>
              </span>
              <span className="truncate text-[0.78rem] text-espresso-mute">
                {option.name}
              </span>
            </button>
          </li>
        ))}
        {filtered.length === 0 && (
          <li className="px-3 py-4 text-center text-[0.78rem] text-espresso-mute">
            No currencies match "{query}".
          </li>
        )}
      </ul>
    </>
  );
}
