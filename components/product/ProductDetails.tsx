import { CompareSlider } from "@/components/product/CompareSlider";
import { Icon, type IconName } from "@/components/ui/Icons";
import Image from "@/components/ui/Image";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Motion";
import { Section, SectionHeading } from "@/components/ui/Section";
import type { Product } from "@/lib/product";

/**
 * The Shopify-owned half of the product page: the `custom.feature_highlights`
 * and `custom.specs` metaobjects, plus the product's own description HTML.
 *
 * Everything rendered here is merchant-editable from Shopify Admin — adding
 * a spec row or reordering the highlights needs no code change. The HTML is
 * sanitized at sync time (lib/shopify/sync-product.ts), not here.
 */

/** Shopify's icon keys mapped to this site's icon set; unknown keys fall back. */
const ICONS: Record<string, IconName> = {
  fit: "fold",
  fold: "fold",
  ship: "truck",
  truck: "truck",
  shield: "shield",
  check: "check",
  clip: "clip",
  leaf: "leaf",
  weight: "weight",
  wash: "wash",
};

/**
 * The "Folds to keychain size" and "Opens to a full-size tote" feature
 * images come from Shopify mislabeled — swapped relative to their own
 * label, confirmed by eye (the "folds to keychain size" entry shows the
 * fully unfolded tote, and vice versa). This is a fix on the Shopify side
 * (the `custom.feature_highlights` metaobject), not something wrong in this
 * repo, so it can't be fixed by editing data/product.json — that file is
 * overwritten wholesale on every sync (see sync-product.ts). Un-swap by
 * label at render time instead, so the fix survives re-syncs until the
 * metaobject itself is corrected in Shopify Admin.
 */
const SWAPPED_FEATURE_IMAGE_LABELS = new Set([
  "Folds to keychain size",
  "Opens to a full-size tote",
]);

function imageForFeature(features: Product["features"], label: string) {
  const own = features.find((f) => f.label === label);
  if (!own?.image) return own?.image;
  if (!SWAPPED_FEATURE_IMAGE_LABELS.has(label)) return own.image;
  const other = features.find(
    (f) => f.label !== label && SWAPPED_FEATURE_IMAGE_LABELS.has(f.label),
  );
  return other?.image ?? own.image;
}

/**
 * When the feature set is exactly this before/after pair, a drag-to-compare
 * slider shows the relationship between them directly (one photo, one
 * gesture) instead of two side-by-side cards the shopper has to mentally
 * compare themselves. Any other feature set (a future third highlight, a
 * differently-labelled pair) falls back to the plain card grid below —
 * this is a presentation upgrade for one known case, not a replacement for
 * the general renderer.
 */
type CompareSide = {
  src: string;
  alt: string;
  label: string;
  avif?: string;
  webp?: string;
};

function asCompareSlides(
  features: Product["features"],
): { before: CompareSide; after: CompareSide } | null {
  if (features.length !== 2) return null;
  const before = features.find((f) => f.label === "Folds to keychain size");
  const after = features.find((f) => f.label === "Opens to a full-size tote");
  if (!before || !after) return null;
  return {
    // Both sides are hand-shot local photos (public/product/), not the
    // Shopify ones — they read as the premium/lifestyle pairing rather than
    // plain product shots. AVIF/WebP pre-built at build time from the
    // project root's compare_1.png/compare_2.png, each flattened onto a
    // white background first (both source PNGs carry a transparent
    // background, and JPEG has no alpha channel to fall back to). PictureSide
    // in CompareSlider.tsx renders the <picture> from these instead of the
    // Shopify-CDN <Image> path this component also supports.
    before: {
      src: "/product/compare-1.jpg",
      avif: "/product/compare-1.avif",
      webp: "/product/compare-1.webp",
      alt: "Reads as luxury. Works as hard as gear.",
      label: before.label,
    },
    after: {
      src: "/product/compare-2.jpg",
      avif: "/product/compare-2.avif",
      webp: "/product/compare-2.webp",
      alt: after.label,
      label: after.label,
    },
  };
}

export function ProductDetails({ product }: { product: Product }) {
  const { features, specs, descriptionHtml } = product;
  const compareSlides = asCompareSlides(features);

  return (
    <>
      {features.length > 0 && (
        <Section id="features">
          <SectionHeading
            eyebrow="Why it works"
            title="Built around one idea: always on you."
            align="center"
          />

          {compareSlides ? (
            <div className="mx-auto mt-12 max-w-130">
              <CompareSlider
                before={compareSlides.before}
                after={compareSlides.after}
              />
              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                {features.map((f) => (
                  <div key={f.label} className="flex items-start gap-3">
                    <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sage-soft text-sage-deep">
                      <Icon name={ICONS[f.icon] ?? "check"} className="size-4" />
                    </span>
                    <div>
                      <h3 className="font-display text-[1.02rem] leading-tight font-medium text-espresso">
                        {f.label}
                      </h3>
                      <p className="mt-1 text-[0.86rem] leading-[1.6] text-espresso-soft">
                        {f.body}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <Stagger
              as="ul"
              className="mx-auto mt-12 grid max-w-160 gap-4 sm:grid-cols-2"
              stagger={0.08}
            >
              {features.map((f) => {
                const image = imageForFeature(features, f.label);
                return (
                  <StaggerItem
                    as="li"
                    key={f.label}
                    className="overflow-hidden rounded-card border border-sand/70 bg-paper"
                  >
                    {image && (
                      <div className="relative aspect-4/3 w-full bg-cream-deep">
                        <Image
                          src={image.src}
                          alt={image.alt}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 30vw"
                          quality={80}
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="p-5">
                      <span className="grid size-9 place-items-center rounded-full bg-sage-soft text-sage-deep">
                        <Icon
                          name={ICONS[f.icon] ?? "check"}
                          className="size-4"
                        />
                      </span>
                      <h3 className="font-display mt-3 text-[1.02rem] leading-tight font-medium text-espresso">
                        {f.label}
                      </h3>
                      <p className="mt-1.5 text-[0.86rem] leading-[1.6] text-espresso-soft">
                        {f.body}
                      </p>
                    </div>
                  </StaggerItem>
                );
              })}
            </Stagger>
          )}
        </Section>
      )}

      {specs.length > 0 && (
        <Section id="specs" className="bg-cream-deep">
          <SectionHeading
            eyebrow="Specifications"
            title="The details, straight."
            align="center"
          />

          <Stagger
            as="ul"
            className="mt-12 grid gap-4 lg:grid-cols-3"
            stagger={0.06}
          >
            {specs.map((spec) => (
              <StaggerItem
                as="li"
                key={spec.label}
                className="overflow-hidden rounded-card border border-sand/70 bg-paper"
              >
                {spec.image && (
                  <div className="relative aspect-4/3 w-full bg-cream-deep">
                    <Image
                      src={spec.image.src}
                      alt={spec.image.alt}
                      fill
                      sizes="(max-width: 1024px) 50vw, 30vw"
                      quality={75}
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="p-6">
                  <dt className="font-label text-[0.66rem] font-bold tracking-widest text-espresso-mute uppercase">
                    {spec.label}
                  </dt>
                  <dd className="font-display mt-1.5 text-[1.05rem] leading-snug font-medium text-espresso">
                    {spec.value}
                  </dd>
                  {spec.description && (
                    <p className="mt-2.5 text-[0.87rem] leading-[1.6] text-espresso-soft">
                      {spec.description}
                    </p>
                  )}
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </Section>
      )}

      {descriptionHtml && (
        <Section id="description">
          <div className="mx-auto max-w-180">
            <SectionHeading
              eyebrow="In full"
              title="About this bag."
              align="center"
            />
            <Reveal
              className="prose-product mt-10 space-y-5 text-[1rem] leading-[1.75] text-espresso-soft"
              // Sanitized once at the source, in lib/shopify/sync-product.ts —
              // this store is shared with other merchants, so the description
              // HTML is never trusted raw.
              // eslint-disable-next-line react/no-danger
            >
              <div dangerouslySetInnerHTML={{ __html: descriptionHtml }} />
            </Reveal>
          </div>
        </Section>
      )}
    </>
  );
}
