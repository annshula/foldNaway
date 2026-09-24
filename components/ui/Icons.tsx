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

/**
 * The full "Shop [Pay]" lockup, traced from Shop_Pay_logo.svg (project
 * root) — the "Shop" wordmark plus the outlined "Pay" pill, both filled with
 * `currentColor` instead of their native indigo. BuyBox's "Buy with Shop
 * Pay" CTA sets this to white so it reads on the button's own indigo fill,
 * matching Shopify's real button (the pill is drawn evenodd — an outline
 * shape with the word "Pay" cut out of it as negative space — so at
 * `currentColor: white` it renders as a solid white pill with the button's
 * indigo showing through the letters, same as the source SVG's pill vs.
 * background relationship).
 */
export function ShopPayWordmark(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 683 164" fill="none" aria-hidden {...props}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        fill="currentColor"
        d="M454.942 0C441.175 0 430.015 11.1602 430.015 24.927V138.295C430.015 152.062 441.175 163.222 454.942 163.222H658.072C671.839 163.222 682.999 152.062 682.999 138.295V24.927C682.999 11.1602 671.839 0 658.072 0H454.942ZM490.023 113.902V85.1661H508.1C524.616 85.1661 533.399 75.9057 533.399 61.872C533.399 47.8383 524.616 39.4371 508.1 39.4371H478.376V113.902H490.023ZM490.023 50.5114H505.427C516.119 50.5114 521.37 54.9029 521.37 62.2539C521.37 69.6049 516.31 73.9964 505.904 73.9964H490.023V50.5114ZM553.933 115.429C562.811 115.429 568.635 111.515 571.308 104.832C572.071 112.279 576.558 116.098 586.296 113.52L586.391 105.596C582.477 105.978 581.714 104.546 581.714 100.441V80.9655C581.714 69.5094 574.172 62.7312 560.233 62.7312C546.486 62.7312 538.562 69.6049 538.562 81.2519H549.255C549.255 75.7148 553.169 72.3734 560.042 72.3734C567.298 72.3734 570.639 75.5239 570.544 80.9655V83.4477L558.229 84.7842C544.386 86.3117 536.748 91.5624 536.748 100.727C536.748 108.269 542.095 115.429 553.933 115.429ZM556.319 106.837C550.305 106.837 547.918 103.591 547.918 100.345C547.918 95.9539 552.882 93.9491 562.62 92.8035L570.257 91.9443C569.78 100.345 564.148 106.837 556.319 106.837ZM621.754 117.625C616.885 129.463 609.057 132.995 596.837 132.995H591.586V123.258H597.219C603.902 123.258 607.148 121.157 610.68 115.143L589.009 64.2587H601.038L616.504 101.396L630.251 64.2587H641.993L621.754 117.625Z"
      />
      <path
        fill="currentColor"
        d="M57.3945 71.7445C41.4471 68.2852 34.3427 66.9315 34.3427 60.7862C34.3427 55.0063 39.1506 52.127 48.7662 52.127C57.2228 52.127 63.4043 55.8228 67.9545 63.0638C68.2979 63.6225 69.0062 63.8159 69.5857 63.5151L87.5292 54.4476C88.1731 54.1253 88.4092 53.3088 88.0443 52.6857C80.5965 39.7721 66.8384 32.7029 48.7233 32.7029C24.9203 32.7029 10.132 44.4347 10.132 63.0853C10.132 82.8962 28.1398 87.9027 44.1086 91.3621C60.0774 94.8215 67.2033 96.1751 67.2033 102.32C67.2033 108.466 62.0091 111.366 51.6423 111.366C42.0696 111.366 34.9652 106.983 30.6725 98.4742C30.3505 97.8511 29.5993 97.5933 28.9769 97.9156L11.0764 106.79C10.4539 107.112 10.1964 107.864 10.5183 108.509C17.6227 122.797 32.1964 130.833 51.6637 130.833C76.454 130.833 91.4355 119.295 91.4355 100.064C91.4355 80.8335 73.3418 75.2469 57.3945 71.7875V71.7445Z"
      />
      <path
        fill="currentColor"
        d="M153.551 32.7032C143.377 32.7032 134.384 36.3129 127.924 42.7375C127.516 43.1243 126.85 42.845 126.85 42.2863V1.26785C126.85 0.558781 126.292 0.00012207 125.584 0.00012207H103.133C102.425 0.00012207 101.867 0.558781 101.867 1.26785V128.578C101.867 129.287 102.425 129.845 103.133 129.845H125.584C126.292 129.845 126.85 129.287 126.85 128.578V72.7332C126.85 61.9468 135.114 53.6743 146.253 53.6743C157.393 53.6743 165.463 61.7749 165.463 72.7332V128.578C165.463 129.287 166.021 129.845 166.729 129.845H189.18C189.889 129.845 190.447 129.287 190.447 128.578V72.7332C190.447 49.2695 175.079 32.7246 153.551 32.7246V32.7032Z"
      />
      <path
        fill="currentColor"
        d="M235.991 29.0505C223.8 29.0505 212.381 32.7893 204.182 38.1825C203.624 38.5477 203.431 39.2998 203.774 39.8799L213.669 56.7901C214.034 57.3917 214.806 57.6066 215.407 57.2413C221.632 53.4811 228.758 51.5258 236.034 51.5688C255.63 51.5688 270.032 65.4063 270.032 83.6917C270.032 99.2697 258.506 110.808 243.889 110.808C231.977 110.808 223.714 103.868 223.714 94.0698C223.714 88.4618 226.096 83.8636 232.299 80.619C232.943 80.2753 233.179 79.4802 232.793 78.8571L223.456 63.0428C223.156 62.5271 222.512 62.2907 221.932 62.5056C209.419 67.1468 200.641 78.3199 200.641 93.3178C200.641 116.008 218.691 132.94 243.868 132.94C273.273 132.94 294.414 112.549 294.414 83.3049C294.414 51.9556 269.817 29.0505 235.991 29.0505Z"
      />
      <path
        fill="currentColor"
        d="M360.069 32.5311C348.714 32.5311 338.584 36.7211 331.179 44.1126C330.771 44.5208 330.106 44.22 330.106 43.6613V34.7658C330.106 34.0567 329.548 33.498 328.839 33.498H306.968C306.26 33.498 305.702 34.0567 305.702 34.7658V161.882C305.702 162.591 306.26 163.15 306.968 163.15H329.419C330.127 163.15 330.685 162.591 330.685 161.882V120.198C330.685 119.639 331.351 119.36 331.758 119.725C339.142 126.601 348.908 130.619 360.09 130.619C386.426 130.619 406.966 109.282 406.966 81.5642C406.966 53.8461 386.404 32.5096 360.09 32.5096L360.069 32.5311ZM355.84 109.089C340.859 109.089 329.505 97.1637 329.505 81.3923C329.505 65.6209 340.837 53.6957 355.84 53.6957C370.843 53.6957 382.155 65.4275 382.155 81.3923C382.155 97.357 370.994 109.089 355.819 109.089H355.84Z"
      />
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
