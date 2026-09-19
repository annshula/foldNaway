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
  bag: <path d="M6 8h12l-1 11a2 2 0 0 1-2 1.8H9A2 2 0 0 1 7 19zM9.2 8V6.4a2.8 2.8 0 0 1 5.6 0V8" {...stroke} />,
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
  shield: <path d="M12 3.5l7 2.5v5c0 4.5-3 7.8-7 9.5-4-1.7-7-5-7-9.5V6z" {...stroke} />,
  wash: (
    <>
      <path d="M4.5 5.5h15v13a1.5 1.5 0 0 1-1.5 1.5H6a1.5 1.5 0 0 1-1.5-1.5z" {...stroke} />
      <path d="M4.5 9.5h15" {...stroke} />
      <circle cx="12" cy="15" r="2.8" {...stroke} />
    </>
  ),
  clip: <path d="M14.5 6.5 8 13a3 3 0 0 0 4.2 4.2l6.3-6.3a5 5 0 0 0-7-7L5 10.5a7 7 0 0 0 9.9 9.9l4.6-4.6" {...stroke} />,
  chat: <path d="M20 12a7 7 0 0 1-7 7H9l-4 2.5V12a7 7 0 0 1 7-7h1a7 7 0 0 1 7 7z" {...stroke} />,
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
  facebook: <path d="M14.8 8.5h-1.6a1.6 1.6 0 0 0-1.6 1.6V12m0 0H9.6m2 0h2.4m-2.4 0v8" {...stroke} />,
  youtube: (
    <>
      <rect x="3.5" y="6.5" width="17" height="11" rx="3.2" {...stroke} />
      <path d="M11 10.2l3.6 1.8-3.6 1.8z" {...stroke} />
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
