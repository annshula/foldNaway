import { Icon, type IconName } from "@/components/ui/Icons";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { Section, SectionHeading } from "@/components/ui/Section";
import { productBenefits } from "@/content/copy";

/**
 * Six reasons to buy, each as an image + text card — sits between the trust
 * bar and "Why it works" on the product page.
 *
 * The image is a placeholder: a tinted gradient per card with the benefit's
 * own icon watermarked large and faint, standing in for real product
 * photography. Swap the placeholder `<div>` below for an `<Image>` once art
 * exists — the card markup around it (tag, headline, body) is already final.
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
        {productBenefits.items.map((item, i) => (
          <StaggerItem
            as="li"
            key={item.headline}
            className="group overflow-hidden rounded-card border border-sand/70 bg-paper transition-all duration-500 ease-(--ease-out-expo) hover:-translate-y-1 hover:border-sage/35 hover:shadow-(--shadow-e3)"
          >
            {/* Placeholder art: a per-card tinted gradient + oversized
                watermark icon, standing in for real product photography. */}
            <div
              aria-hidden
              className={`relative grid aspect-4/3 w-full place-items-center ${PLACEHOLDER_TINTS[i % PLACEHOLDER_TINTS.length]}`}
            >
              <Icon
                name={item.icon as IconName}
                className="size-16 text-espresso/15"
              />
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

/** Warm, on-brand gradient tints — cycled per card so six placeholders read as distinct before real photography drops in. */
const PLACEHOLDER_TINTS = [
  "bg-linear-to-br from-sage-soft to-cream-deep",
  "bg-linear-to-br from-terracotta-soft to-cream-deep",
  "bg-linear-to-br from-sand-strong/50 to-cream-deep",
  "bg-linear-to-br from-cream-deep to-sage-soft",
  "bg-linear-to-br from-cream-deep to-terracotta-soft",
  "bg-linear-to-br from-sage-soft to-sand-strong/40",
] as const;
