import { Icon, type IconName } from "@/components/ui/Icons";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { Section, SectionHeading } from "@/components/ui/Section";
import { productBenefits } from "@/content/copy";

/**
 * Six reasons to buy, each as an image + text card — sits between the trust
 * bar and "Why it works" on the product page.
 *
 * Each card's photo is a hand-authored `<picture>` (AVIF → WebP → JPEG,
 * smallest-first), same pattern as Hero.tsx's background photo — not
 * `next/image`, because these are local files outside the Shopify CDN this
 * app's `<Image>` loader is built around (see components/ui/Image.tsx), and
 * a plain `<picture>` needs no loader at all for a fixed set of pre-built
 * formats. The three files per card (public/benefits/<item.image>.{avif,
 * webp,jpg}) were generated from sourced PNGs with `sharp` — the same
 * library Next's own image pipeline uses — via a one-off conversion script,
 * not committed separately since it's a single `sharp(...).toFile(...)`
 * call per format per image.
 */
export function ProductBenefitCards() {
  return (
    <Section id="benefits-detail" className="bg-cream-deep">
      <SectionHeading
        eyebrow={productBenefits.eyebrow}
        title={productBenefits.title}
        align="center"
      />

      <Stagger
        as="ul"
        className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.06}
      >
        {productBenefits.items.map((item) => (
          <StaggerItem
            as="li"
            key={item.headline}
            className="group overflow-hidden rounded-card border border-sand/70 bg-paper transition-all duration-500 ease-(--ease-out-expo) hover:-translate-y-1 hover:border-sage/35 hover:shadow-(--shadow-e3)"
          >
            <div className="relative aspect-4/3 w-full overflow-hidden bg-cream-deep">
              <picture>
                <source
                  type="image/avif"
                  srcSet={`/benefits/${item.image}.avif`}
                />
                <source
                  type="image/webp"
                  srcSet={`/benefits/${item.image}.webp`}
                />
                {/* eslint-disable-next-line @next/next/no-img-element -- a
                    hand-authored <picture> needs a plain <img> fallback;
                    next/image can't emit multi-format <source> sets. */}
                <img
                  src={`/benefits/${item.image}.jpg`}
                  alt={item.headline}
                  loading="lazy"
                  decoding="async"
                  className="h-full w-full object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.03]"
                />
              </picture>

              <span className="absolute top-3 right-3 grid size-8 place-items-center rounded-full bg-cream/90 text-sage-deep backdrop-blur">
                <Icon name={item.icon as IconName} className="size-4" />
              </span>
            </div>

            <div className="p-6">
              <span className="font-grotesk text-[0.64rem] font-bold tracking-[0.12em] text-sage-deep uppercase">
                {item.tag}
              </span>
              <h3 className="font-display mt-2 text-[1.08rem] leading-snug font-medium text-espresso">
                {item.headline}
              </h3>
              <p className="mt-2 text-[0.88rem] leading-[1.6] text-espresso-soft">
                {item.body}
              </p>
            </div>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
