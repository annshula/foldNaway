import type { Metadata } from "next";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FinalCta from "@/components/sections/FinalCta";
import TrustBar from "@/components/sections/TrustBar";
import { Icon } from "@/components/ui/Icons";
import Image from "@/components/ui/Image";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Motion";
import { Section, SectionHeading } from "@/components/ui/Section";
import { RatingStars } from "@/components/ui/Stars";
import { reviewSetForHandle } from "@/data/reviews";
import { pathForHandle } from "@/lib/catalog";
import { formatMoney } from "@/lib/money";
import { products } from "@/lib/product";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Shop",
  description: `Every ${site.name} bag. ${site.promise.shipping}.`,
  alternates: { canonical: "/shop" },
  // Per-page OpenGraph: without an explicit url/title here every page
  // inherits the root layout's, so a shared link shows the homepage.
  // `images` must be repeated too — declaring an openGraph object
  // replaces the inherited one wholesale rather than merging into it,
  // which silently drops the card image.
  openGraph: {
    type: "website",
    url: absoluteUrl("/shop"),
    images: ["/opengraph-image.jpg"],
    title: "Shop",
  },
};

export default function ShopPage() {
  return (
    <main>
      {/* The nav is transparent at the top of every page, so each page needs
          its own top padding to clear it — see Nav.tsx. */}
      <Section className="pt-[calc(var(--nav-h)+2.5rem)]">
        <SectionHeading
          eyebrow="Shop"
          title="One bag. Six colourways."
          body="Everything folds to keychain size and opens to a full-capacity tote."
          align="center"
        />

        <Stagger
          as="ul"
          className="mx-auto mt-14 grid max-w-4xl gap-6 sm:grid-cols-2"
          stagger={0.08}
        >
          {products.map((product) => {
            const reviewSet = reviewSetForHandle(product.handle);
            const from = Math.min(...product.variants.map((v) => v.price.amount));
            const currency = product.variants[0]?.price.currencyCode ?? site.currency;
            const cover = product.gallery[0];

            return (
              <StaggerItem as="li" key={product.id}>
                <a
                  href={pathForHandle(product.handle)}
                  className="group block overflow-hidden rounded-card border border-sand/70 bg-paper transition-all duration-500 ease-(--ease-out-expo) hover:-translate-y-1 hover:border-sage/35 hover:shadow-(--shadow-e3)"
                >
                  {cover && (
                    <div className="relative aspect-square w-full overflow-hidden bg-cream-deep">
                      <Image
                        src={cover.src}
                        alt={cover.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 45vw"
                        quality={80}
                        className="object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.03]"
                      />
                    </div>
                  )}

                  <div className="p-6">
                    {product.subtitle && (
                      <p className="font-label text-[0.64rem] font-semibold tracking-widest text-sage-deep uppercase">
                        {product.subtitle}
                      </p>
                    )}
                    <h2 className="font-display mt-2 text-[1.15rem] leading-snug font-medium text-espresso">
                      {product.title}
                    </h2>

                    {reviewSet && (
                      <span className="mt-2.5 flex items-center gap-2">
                        <RatingStars
                          value={reviewSet.summary.average}
                          starClassName="h-3.5 w-3.5"
                        />
                        <span className="text-[0.76rem] text-espresso-mute tabular-nums">
                          {reviewSet.summary.average.toFixed(1)} ·{" "}
                          {reviewSet.summary.count.toLocaleString("en-US")}
                        </span>
                      </span>
                    )}

                    <div className="mt-4 flex items-center justify-between gap-3">
                      <span className="text-[1.05rem] font-semibold text-espresso tabular-nums">
                        From {formatMoney(from, currency)}
                      </span>
                      <span className="font-label inline-flex items-center gap-1.5 text-[0.7rem] font-bold tracking-widest text-sage-deep uppercase">
                        Shop
                        <Icon
                          name="arrow-right"
                          className="size-4 transition-transform duration-300 group-hover:translate-x-1"
                        />
                      </span>
                    </div>

                    {/* Colourway dots — a quick read of what's available
                        without opening the product. */}
                    <ul className="mt-4 flex flex-wrap gap-1.5 border-t border-sand/70 pt-4">
                      {product.variants.map((v) => (
                        <li
                          key={v.id}
                          className="relative size-7 overflow-hidden rounded-full border border-sand"
                          title={v.title}
                        >
                          {v.image && (
                            <Image
                              src={v.image}
                              alt=""
                              fill
                              sizes="28px"
                              quality={50}
                              className="object-cover"
                            />
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </a>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal className="mt-12 text-center">
          <p className="text-[0.88rem] text-espresso-mute">
            {site.promise.shipping} · {site.promise.returns}
          </p>
        </Reveal>
      </Section>

      <TrustBar />
      <FinalCta />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
        ]}
      />
    </main>
  );
}
