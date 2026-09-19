import { details } from "@/content/copy";
import { Icon, type IconName } from "@/components/ui/Icons";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Motion";
import { Section, SectionHeading } from "@/components/ui/Section";

const cardIcons: IconName[] = ["shield", "clip", "fold"];

/**
 * The reference's "product details": three feature cards over a specs
 * table. The table is a real <dl> so it stays readable to a screen reader
 * and wraps to two columns rather than scrolling on mobile.
 */
export default function Details() {
  return (
    <Section id="details">
      <SectionHeading
        eyebrow={details.eyebrow}
        title={details.title}
        body={details.body}
        align="center"
      />

      <Stagger as="ul" className="mt-14 grid gap-5 lg:grid-cols-3">
        {details.cards.map((card, i) => (
          <StaggerItem
            as="li"
            key={card.label}
            className="rounded-card border border-sand/70 bg-paper p-8"
          >
            <span className="grid size-11 place-items-center rounded-full bg-sage-soft">
              <Icon name={cardIcons[i]} className="size-5 text-sage-deep" />
            </span>
            <h3 className="font-display mt-5 text-[1.22rem] leading-tight font-medium text-espresso">
              {card.label}
            </h3>
            <p className="mt-2.5 text-[0.95rem] leading-[1.6] text-espresso-soft">
              {card.body}
            </p>
          </StaggerItem>
        ))}
      </Stagger>

      <Reveal className="mt-14">
        <dl className="grid overflow-hidden rounded-card border border-sand/70 sm:grid-cols-2">
          {details.specs.map((spec, i) => (
            <div
              key={spec.label}
              className={`flex items-baseline justify-between gap-6 bg-paper px-6 py-5 ${
                // Hairlines only between rows, never on the outer edge.
                i < details.specs.length - 1 ? "border-b border-sand/60" : ""
              } ${i % 2 === 0 ? "sm:border-r sm:border-sand/60" : ""}`}
            >
              <dt className="font-grotesk text-[0.72rem] font-semibold tracking-[0.12em] text-espresso-mute uppercase">
                {spec.label}
              </dt>
              <dd className="font-mono text-right text-[0.95rem] font-medium text-espresso">
                {spec.value}
              </dd>
            </div>
          ))}
        </dl>
      </Reveal>
    </Section>
  );
}
