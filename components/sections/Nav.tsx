"use client";

import { AnimatePresence, motion } from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useState, type ButtonHTMLAttributes } from "react";

import { AccountMenu } from "@/components/account/AccountMenu";
import { useCart } from "@/components/providers/CartProvider";
import Button from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { Logo } from "@/components/ui/Logo";
import { easeOut } from "@/components/ui/Motion";
import { useScrollLock } from "@/lib/scroll-lock";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Flat structure, matching the structural reference — no dropdowns. */
const links = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Benefits", href: "/benefits" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

/** Shared look for every circular header icon, so the cluster reads as one
    family: no border, just a tint that appears on hover.
    `lightMobile` mirrors Logo.tsx's own variant: only true on the homepage
    while unscrolled, the one state where these icons sit over Hero.tsx's
    mobile-only dark scrim instead of the normal light header — everywhere
    else stays the plain espresso icon regardless of `solid`. */
function iconButtonClass(lightMobile: boolean, className = "") {
  return cn(
    "relative grid size-11 place-items-center rounded-full transition-colors duration-300",
    lightMobile
      ? "text-oat hover:bg-oat/10 md:text-espresso md:hover:bg-espresso/[0.07]"
      : "text-espresso hover:bg-espresso/[0.07]",
    className,
  );
}

function IconButton({
  lightMobile,
  className = "",
  ...rest
}: { lightMobile: boolean; className?: string } & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={iconButtonClass(lightMobile, className)}
      {...rest}
    />
  );
}

function CartButton({
  lightMobile,
  onOpen,
}: {
  lightMobile: boolean;
  onOpen?: () => void;
}) {
  const { itemCount, open } = useCart();
  return (
    <IconButton
      lightMobile={lightMobile}
      onClick={() => {
        onOpen?.();
        open();
      }}
      aria-label={`Open bag${itemCount > 0 ? ` (${itemCount} item${itemCount === 1 ? "" : "s"})` : ""}`}
    >
      <span className="relative inline-flex">
        <Icon name="bag" className="size-5" />
        {itemCount > 0 && (
          <span
            aria-hidden
            className="font-label absolute -top-1.5 -right-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-sage px-0.5 text-[0.58rem] font-bold tracking-tight text-white tabular-nums"
          >
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </span>
    </IconButton>
  );
}

/**
 * Sticky header.
 *
 * REQUIREMENT: at page load the navbar shares the hero's background — it is
 * fully transparent, and the hero's own cream sits behind it (the hero pulls
 * itself up under the bar with a negative margin, see Hero.tsx). Past the
 * fold the bar takes its own translucent cream background plus a blur, so
 * content scrolling underneath never collides with the links.
 *
 * Because the hero on this brand is *light* (warm cream, not a dark video),
 * the type colour does not need to invert between the two states — only the
 * background does. That is why `solid` drives background/shadow/height and
 * nothing else.
 */
export default function Nav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { open: openCart } = useCart();
  useScrollLock(menuOpen);

  const solid = scrolled;
  // Only true on the homepage while unscrolled — the one state where the
  // transparent header sits over Hero.tsx's mobile-only dark scrim. Drives
  // the logo's "N" and the cart/menu icons; every other page/state stays
  // the plain espresso look regardless of `solid`.
  const lightMobile = pathname === "/" && !solid;

  useEffect(() => {
    // 24px of travel is enough to read as "the page has moved" without the
    // bar flickering on a trackpad's rubber-band at the very top.
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-50 px-5 transition-colors duration-500 ease-(--ease-out-expo) sm:px-8",
          // No bottom border: the scrolled bar and the page below it are the
          // same cream, so a hairline there would just be a stray line, not a
          // real edge. The blur + translucency alone read as "the bar has
          // lifted off the page" on scroll.
          solid ? "bg-cream/85 backdrop-blur-xl" : "bg-transparent",
        )}
        style={{ height: "var(--nav-h)" }}
      >
        <nav className="mx-auto flex h-full max-w-310 items-center justify-between gap-4 sm:gap-6">
          <Logo variant={lightMobile ? "light-mobile" : "dark"} />

          <ul className="hidden items-center gap-9 lg:flex">
            {links.map((l) => {
              const active =
                l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
              return (
                <li key={l.href}>
                  <a
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "font-label group relative text-[0.72rem] font-semibold tracking-[0.18em] uppercase transition-colors duration-300",
                      active
                        ? "text-espresso"
                        : "text-espresso-soft hover:text-espresso",
                    )}
                  >
                    {l.label}
                    <span
                      className={cn(
                        "absolute -bottom-1.5 left-0 h-px bg-sage transition-all duration-400 ease-(--ease-out-expo)",
                        active ? "w-full" : "w-0 group-hover:w-full",
                      )}
                    />
                  </a>
                </li>
              );
            })}
          </ul>

          <div className="flex items-center justify-end gap-1.5 sm:gap-2">
            <span className="hidden sm:block">
              <AccountMenu variant="dropdown" lightMobile={lightMobile} />
            </span>
            <CartButton lightMobile={lightMobile} onOpen={() => setMenuOpen(false)} />
            <span className="ml-1 hidden sm:block">
              <Button href="/shop" size="sm">
                Shop now
              </Button>
            </span>

            <IconButton
              lightMobile={lightMobile}
              className="lg:hidden"
              onClick={() => setMenuOpen(true)}
              aria-label="Open menu"
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
            >
              <Icon name="menu" className="size-5" />
            </IconButton>
          </div>
        </nav>
      </header>

      {/* ── Mobile drawer: unfolds from the top, links staggering a beat
          behind the panel — the one place the "unfold" motion is literal. */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="grain fixed inset-0 z-80 overflow-hidden bg-bark text-oat lg:hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.55, ease: easeOut }}
          >
            <div className="relative flex h-full flex-col px-6 pt-5 pb-[calc(env(safe-area-inset-bottom)+1.5rem)]">
              <div className="flex items-center justify-between">
                <Logo variant="light" />
                <button
                  type="button"
                  onClick={() => setMenuOpen(false)}
                  aria-label="Close menu"
                  className="grid size-11 place-items-center rounded-full text-oat transition-colors duration-300 hover:bg-white/10"
                >
                  <Icon name="close" className="size-4" />
                </button>
              </div>

              <motion.nav
                aria-label="Mobile"
                className="mt-10 min-h-0 flex-1 overflow-x-hidden overflow-y-auto"
                initial="hidden"
                animate="visible"
                variants={{
                  visible: {
                    transition: { staggerChildren: 0.05, delayChildren: 0.15 },
                  },
                }}
              >
                <ul className="flex flex-col">
                  {links.map((l) => (
                    <motion.li
                      key={l.href}
                      className="border-b border-white/10"
                      variants={{
                        hidden: { opacity: 0, y: 14 },
                        visible: {
                          opacity: 1,
                          y: 0,
                          transition: { duration: 0.4, ease: easeOut },
                        },
                      }}
                    >
                      <a
                        href={l.href}
                        onClick={() => setMenuOpen(false)}
                        className="font-label group flex items-center justify-between gap-4 py-4 text-[0.9rem] font-semibold tracking-[0.2em] text-oat uppercase transition-colors duration-300 hover:text-white"
                      >
                        {l.label}
                        <Icon
                          name="arrow-right"
                          className="size-4 -translate-x-1 text-white/35 transition-all duration-300 group-hover:translate-x-0 group-hover:text-white/75"
                        />
                      </a>
                    </motion.li>
                  ))}
                </ul>
              </motion.nav>

              <motion.div
                className="mt-auto flex flex-col gap-4 pt-6"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.32, ease: easeOut }}
              >
                <div className="flex items-center justify-center gap-3">
                  <AccountMenu variant="list" dark />
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      openCart();
                    }}
                    aria-label="Open bag"
                    className="grid size-11 place-items-center rounded-full text-oat transition-colors duration-300 hover:bg-white/10"
                  >
                    <Icon name="bag" className="size-5" />
                  </button>
                </div>

                <Button
                  href="/shop"
                  variant="invert"
                  className="w-full"
                  onClick={() => setMenuOpen(false)}
                >
                  Shop now
                </Button>

                <p className="font-display text-center text-lg text-oat-mute">
                  {site.tagline}
                </p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
