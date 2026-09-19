import { Icon, type IconName } from "@/components/ui/Icons";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { Section, SectionHeading } from "@/components/ui/Section";
import { marketingAngles } from "@/content/copy";

/**
 * Six marketing angles this product is sold on, as one card each — internal
 * reference for whoever is briefing an ad, not shopper-facing copy dressed
 * up as a feature list. Sits between the trust bar and "Why it works" on
 * the product page.
 *
 * Each card carries the same three-part shape: `tag` (the angle's category,
 * set in font-grotesk — the site's data/functional voice), `hook` (the
 * actual ad headline, set in font-display — the emotional voice, same as
 * every other headline on the site), and `bestFor` (a tabular-style footer
 * pill). One visual language, six distinct pitches.
 */
export function MarketingAngles() {
  return (
    <Section id="marketing-angles" className="bg-cream-deep">
      <SectionHeading
        eyebrow={marketingAngles.eyebrow}
        title={marketingAngles.title}
        align="center"
      />

      <Stagger
        as="ul"
        className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.06}
      >
        {marketingAngles.angles.map((angle) => (
          <StaggerItem
            as="li"
            key={angle.hook}
            className="group flex flex-col overflow-hidden rounded-card border border-sand/70 bg-paper p-6 transition-all duration-500 ease-(--ease-out-expo) hover:-translate-y-1 hover:border-sage/35 hover:shadow-(--shadow-e3)"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-sage-soft text-sage-deep">
                <Icon name={angle.icon as IconName} className="size-4" />
              </span>
              <span className="font-grotesk text-[0.64rem] font-bold tracking-[0.12em] text-sage-deep uppercase">
                {angle.tag}
              </span>
            </div>

            <p className="font-display mt-5 text-[1.08rem] leading-snug font-medium text-espresso text-pretty">
              &ldquo;{angle.hook}&rdquo;
            </p>

            <p className="mt-3 flex-1 text-[0.88rem] leading-[1.6] text-espresso-soft">
              {angle.body}
            </p>

            <p className="font-grotesk mt-5 border-t border-sand/70 pt-4 text-[0.68rem] font-semibold tracking-[0.08em] text-espresso-mute uppercase">
              Best for: <span className="text-espresso">{angle.bestFor}</span>
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
