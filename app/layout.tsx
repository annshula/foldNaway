import type { Metadata, Viewport } from "next";
import { Figtree, Fraunces } from "next/font/google";
import { Toaster } from "sonner";

import { ClarityAnalytics } from "@/components/analytics/ClarityAnalytics";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MetaPixel } from "@/components/analytics/MetaPixel";
import { TikTokPixel } from "@/components/analytics/TikTokPixel";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { CartProvider } from "@/components/providers/CartProvider";
import Footer from "@/components/sections/Footer";
import Nav from "@/components/sections/Nav";
import { site } from "@/lib/site";
import "./globals.css";

/**
 * Two font families, self-hosted at build time by next/font — no
 * third-party request, no FOUT.
 *
 *   Fraunces -> font-display : warm variable serif for headings and the hero
 *   Figtree  -> font-sans    : geometric-humanist for body copy and all UI
 *
 * `font-label` in the CSS is Figtree at wide tracking — a role, not a third
 * family, so the two-family cap holds.
 */
// Fraunces is a variable font: `axes` may only be set when the weight is
// variable (next/font errors otherwise), so the whole weight range ships and
// components pick a weight with a normal `font-*` utility. SOFT and WONK are
// what keep it warm rather than editorial-severe at display sizes — see the
// `.font-display` rule in globals.css.
const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["SOFT", "WONK"],
  variable: "--font-fraunces",
  display: "swap",
  preload: true,
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
  preload: true,
});

/** Google Tag Manager container — loaded high in <head>, noscript after <body>. */
const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export const viewport: Viewport = {
  // Matches --color-cream, so the mobile browser chrome blends into the hero.
  themeColor: "#faf7f1",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const title = `${site.name} — Foldable Keychain Eco-Bags`;

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: title,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "foldable bag",
    "foldable shopping bag",
    "keychain bag",
    "packable tote",
    "reusable grocery bag",
    "eco bag",
    "compact shoulder bag",
    "foldable tote bag",
    "large capacity foldable bag",
    "FoldNAway",
  ],
  authors: [{ name: site.name, url: site.url }],
  creator: site.name,
  publisher: site.name,
  category: "shopping",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    title,
    description: site.description,
    locale: site.locale,
  },
  twitter: {
    card: "summary_large_image",
    title,
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  formatDetection: { telephone: false, address: false, email: false },
  referrer: "strict-origin-when-cross-origin",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${figtree.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Machine-readable content maps for answer/generative engines
            (llmstxt.org). `alternate` with a markdown type is how an agent
            discovers these without guessing the path; /.well-known/ai.txt
            and robots.txt point at them too. */}
        <link
          rel="alternate"
          type="text/markdown"
          href="/llms.txt"
          title="LLM content map"
        />
        <link
          rel="alternate"
          type="text/markdown"
          href="/llms-full.txt"
          title="LLM content map (full)"
        />

        {/* Google Tag Manager — as early as possible so container tags
            (GA4, remarketing, …) fire before the first interaction. */}
        {GTM_ID && (
          <script
            dangerouslySetInnerHTML={{
              __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`,
            }}
          />
        )}
      </head>
      <body className="antialiased" suppressHydrationWarning>
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        <a
          href="#what-it-is"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:rounded-full focus:bg-sage focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>

        <CartProvider>
          <Nav />
          {children}
          <Footer />
          <CartDrawer />
        </CartProvider>

        <Toaster
          position="bottom-center"
          toastOptions={{
            unstyled: true,
            classNames: {
              toast:
                "flex max-w-[min(92vw,21rem)] items-center gap-3 rounded-2xl bg-bark px-4 py-3.5 shadow-(--shadow-lift)",
              icon: "m-0 shrink-0",
              content: "min-w-0 flex-1",
              title: "block truncate text-[0.82rem] font-semibold text-oat",
              // NOTE: no `block` utility here — it would override
              // line-clamp's required display:-webkit-box and silently
              // disable the clamp.
              description:
                "mt-0.5 text-[0.78rem] leading-snug text-oat-mute line-clamp-2",
            },
          }}
        />

        <ClarityAnalytics />
        <GoogleAnalytics />
        <MetaPixel />
        <TikTokPixel />
      </body>
    </html>
  );
}
