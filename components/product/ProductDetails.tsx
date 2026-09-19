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

export function ProductDetails({ product }: { product: Product }) {
  const { features, specs, descriptionHtml } = product;

  return (
    <>
      {features.length > 0 && (
        <Section id="features">
          <SectionHeading
            eyebrow="Why it works"
            title="Built around one idea: always on you."
            align="center"
          />
          <Stagger
            as="ul"
            className="mt-12 grid gap-5 sm:grid-cols-2"
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
                    <div className="relative aspect-square w-full bg-cream-deep">
                      <Image
                        src={image.src}
                        alt={image.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 45vw"
                        quality={80}
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="p-7">
                    <span className="grid size-10 place-items-center rounded-full bg-sage-soft text-sage-deep">
                      <Icon
                        name={ICONS[f.icon] ?? "check"}
                        className="size-4.5"
                      />
                    </span>
                    <h3 className="font-display mt-4 text-[1.15rem] leading-tight font-medium text-espresso">
                      {f.label}
                    </h3>
                    <p className="mt-2 text-[0.93rem] leading-[1.65] text-espresso-soft">
                      {f.body}
                    </p>
                  </div>
                </StaggerItem>
              );
            })}
          </Stagger>
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
