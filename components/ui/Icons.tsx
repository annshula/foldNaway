import type { SVGProps } from "react";

/**
 * Every icon on the site, as one inline set. No icon-font, no runtime
 * fetch — a stroked 24×24 grid at 1.6 weight so they read as one family
 * next to Figtree's own stroke weight.
 */

const stroke = {
  fill: "none" as const,
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function ArrowIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden {...props}>
      <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" {...stroke} />
    </svg>
  );
}

const paths = {
  bag: (
    <path
      d="M6 8h12l-1 11a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 19zM9.2 8V6.4a2.8 2.8 0 0 1 5.6 0V8"
      {...stroke}
    />
  ),
  close: <path d="M6 6l12 12M18 6 6 18" {...stroke} />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" {...stroke} />,
  check: <path d="M5 12.5l4.5 4.5L19 7" {...stroke} />,
  minus: <path d="M6 12h12" {...stroke} />,
  plus: <path d="M12 6v12M6 12h12" {...stroke} />,
  "arrow-right": <path d="M4 12h15m0 0-5.5-5.5M19 12l-5.5 5.5" {...stroke} />,
  "chevron-down": <path d="M6 9.5l6 6 6-6" {...stroke} />,
  leaf: (
    <>
      <path d="M5 19c0-7 5-12 14-12 0 9-5 13-11 13H5z" {...stroke} />
      <path d="M5 19c3-5 6-7 10-8.5" {...stroke} />
    </>
  ),
  fold: (
    <>
      <path d="M4 7h16v10H4z" {...stroke} />
      <path d="M12 7v10M8 10l4 2 4-2" {...stroke} />
    </>
  ),
  weight: (
    <>
      <path d="M4 20h16l-2-9H6z" {...stroke} />
      <path d="M9.5 11a2.5 2.5 0 1 1 5 0" {...stroke} />
    </>
  ),
  truck: (
    <>
      <path d="M3 7h10v8H3zM13 10h4l3 3v2h-7" {...stroke} />
      <circle cx="7" cy="17.5" r="1.8" {...stroke} />
      <circle cx="17" cy="17.5" r="1.8" {...stroke} />
    </>
  ),
  shield: (
    <path
      d="M12 3.5l7 2.5v5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6z"
      {...stroke}
    />
  ),
  wash: (
    <>
      <path
        d="M4.5 5.5h15v13a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5z"
        {...stroke}
      />
      <path d="M4.5 9.5h15" {...stroke} />
      <circle cx="12" cy="15" r="2.8" {...stroke} />
    </>
  ),
  clip: (
    <path
      d="M14.5 6.5 8 13a3 3 0 0 0 4.2 4.2l6.3-6.3a5 5 0 0 0-7-7L5 10.5a7 7 0 0 0 9.9 9.9l4.6-4.6"
      {...stroke}
    />
  ),
  chat: (
    <path
      d="M20 12a7 7 0 0 1-7 7H9l-4 2.5V12a7 7 0 0 1 7-7h1a7 7 0 0 1 7 7z"
      {...stroke}
    />
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" {...stroke} />
      <circle cx="12" cy="12" r="3.6" {...stroke} />
      <circle cx="17" cy="7" r="0.9" fill="currentColor" />
    </>
  ),
  tiktok: (
    <path
      d="M14 4v9.2a3 3 0 1 1-2.4-2.94M14 4c.4 2.2 1.9 3.6 4.2 3.8"
      {...stroke}
    />
  ),
  facebook: (
    <path
      d="M14.8 8.5h-1.6a1.6 1.6 0 0 0-1.6 1.6V12m0 0H9.6m2 0h2.4m-2.4 0v8"
      {...stroke}
    />
  ),
  youtube: (
    <>
      <rect x="3.5" y="6.5" width="17" height="11" rx="3.2" {...stroke} />
      <path d="M11 10.2l3.6 1.8-3.6 1.8z" {...stroke} />
    </>
  ),
  /** Filled, not stroked — a hairline play triangle disappears against a
      photo/poster thumbnail; solid currentColor reads at 14–16px. */
  play: <path d="M8 5.5v13l11-6.5z" fill="currentColor" stroke="none" />,
  user: (
    <>
      <circle cx="12" cy="8" r="3.6" {...stroke} />
      <path d="M4.5 20c.7-3.6 3.5-5.4 7.5-5.4s6.8 1.8 7.5 5.4" {...stroke} />
    </>
  ),
  package: (
    <>
      <path d="M3.5 7.4 12 3l8.5 4.4v9.2L12 21l-8.5-4.4V7.4Z" {...stroke} />
      <path d="M3.6 7.5 12 12l8.4-4.5M12 12v9" {...stroke} />
    </>
  ),
  "map-pin": (
    <>
      <path
        d="M12 21s-7-5.4-7-11a7 7 0 0 1 14 0c0 5.6-7 11-7 11Z"
        {...stroke}
      />
      <circle cx="12" cy="10" r="2.6" {...stroke} />
    </>
  ),
  logout: (
    <>
      <path
        d="M14 4.5H6a1.5 1.5 0 0 0-1.5 1.5v12A1.5 1.5 0 0 0 6 19.5h8"
        {...stroke}
      />
      <path d="M10 12h11M17.5 8.5 21 12l-3.5 3.5" {...stroke} />
    </>
  ),
  feather: (
    <>
      <path
        d="M20 4c-6 0-12 3-14.5 9.5L4 20l6.5-1.5C17 16 21 10 20 4Z"
        {...stroke}
      />
      <path d="M4 20c1.5-3 4-5.5 7.5-7.5" {...stroke} />
    </>
  ),
  "chevron-right": <path d="m9 6 6 6-6 6" {...stroke} />,
  refresh: (
    <>
      <path d="M20 12a8 8 0 1 1-2.3-5.6" {...stroke} />
      <path d="M20 3.4V8h-4.6" {...stroke} />
    </>
  ),
  alert: (
    <>
      <path d="M12 3.5 21 19.5H3L12 3.5Z" {...stroke} />
      <path d="M12 9v4.5M12 16.6v.2" {...stroke} />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="9" {...stroke} />
      <path d="M3.2 9.6h17.6M3.2 14.4h17.6" {...stroke} opacity={0.6} />
      <ellipse cx="12" cy="12" rx="4.1" ry="9" {...stroke} opacity={0.6} />
    </>
  ),
  "trending-up": (
    <>
      <path d="M4 16l6-6 4 4 6-8" {...stroke} />
      <path d="M15 6h5v5" {...stroke} />
    </>
  ),
  award: (
    <>
      <circle cx="12" cy="8.5" r="5.2" {...stroke} />
      <path d="M9 13l-1.8 7L12 18l4.8 2-1.8-7" {...stroke} />
    </>
  ),
  /** Filled, not stroked — a hairline star reads too faint at badge-row
      size (14–16px); solid currentColor matches RatingStars' own fill. */
  star: (
    <path
      d="M12 3.5l2.5 5.6 6 .6-4.5 4.1 1.3 6-5.3-3.2-5.3 3.2 1.3-6L3.5 9.7l6-.6z"
      fill="currentColor"
      stroke="none"
    />
  ),
  trash: (
    <>
      <path
        d="M5 7h14M9 7V5.5a1.5 1.5 0 0 1 1.5-1.5h3A1.5 1.5 0 0 1 15 5.5V7"
        {...stroke}
      />
      <path
        d="M7 7v12a1.5 1.5 0 0 0 1.5 1.5h7A1.5 1.5 0 0 0 17 19V7"
        {...stroke}
      />
      <path d="M10 11v6M14 11v6" {...stroke} />
    </>
  ),
  camera: (
    <>
      <path
        d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2l1-1.8h7L16.5 7h2A1.5 1.5 0 0 1 20 8.5v9A1.5 1.5 0 0 1 18.5 19h-13A1.5 1.5 0 0 1 4 17.5z"
        {...stroke}
      />
      <circle cx="12" cy="12.5" r="3.4" {...stroke} />
    </>
  ),
  /* ── Social post chrome ────────────────────────────────────────────────
     The Facebook / Instagram card rails
     (components/product/ReviewSocialPosts.tsx) draw the platforms' own
     action rows, so these belong here rather than as one-off SVGs inline in
     that component: same 24×24 grid and 1.6 weight as everything above, so
     the cards read as the real apps and not a hand-drawn impression of
     them. */
  "thumbs-up": (
    <>
      <path
        d="M7.2 20V11l3.3-6.4a1.9 1.9 0 0 1 3.4 1.5L13 10.2h4.3a2 2 0 0 1 2 2.3l-1 6.1a2 2 0 0 1-2 1.7z"
        {...stroke}
      />
      <path
        d="M7.2 20H4.7A1.7 1.7 0 0 1 3 18.3v-5.6A1.7 1.7 0 0 1 4.7 11h2.5"
        {...stroke}
      />
    </>
  ),
  heart: (
    <path
      d="M12 20.2c-1.2-.8-7.8-5.1-7.8-10a4.4 4.4 0 0 1 7.8-2.9 4.4 4.4 0 0 1 7.8 2.9c0 4.9-6.6 9.2-7.8 10z"
      {...stroke}
    />
  ),
  share: (
    <>
      <path d="M20.5 9.3h-7.3A8 8 0 0 0 5.4 17l-.9 2.2" {...stroke} />
      <path d="M17 5.8l3.5 3.5L17 12.8" {...stroke} />
    </>
  ),
  bookmark: (
    <path
      d="M7 4.5h10a1 1 0 0 1 1 1v14l-6-3.9-6 3.9v-14a1 1 0 0 1 1-1z"
      {...stroke}
    />
  ),
  send: (
    <>
      <path d="M20.6 3.4 3.6 10.1l6.2 2.7 2.7 6.2z" {...stroke} />
      <path d="M20.6 3.4 9.8 12.8" {...stroke} />
    </>
  ),
  /** Filled dots, not stroked — three 1.6-weight rings read as a smudge at
      menu size. */
  ellipsis: (
    <>
      <circle cx="6" cy="12" r="1.35" fill="currentColor" />
      <circle cx="12" cy="12" r="1.35" fill="currentColor" />
      <circle cx="18" cy="12" r="1.35" fill="currentColor" />
    </>
  ),
} as const;

export type IconName = keyof typeof paths;

export function Icon({
  name,
  className,
  ...rest
}: { name: IconName; className?: string } & SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden {...rest}>
      {paths[name]}
    </svg>
  );
}
