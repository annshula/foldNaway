import { howItWorks } from "@/content/copy";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { Section, SectionHeading } from "@/components/ui/Section";

/**
 * The reference's 4-step process. The connecting rule is drawn with a
 * pseudo-element per step rather than an absolutely-positioned line, so it
 * disappears cleanly when the steps stack on mobile.
 */
export default function HowItWorks() {
  return (
    <Section id="how-it-works" className="bg-cream-deep">
      <SectionHeading
        eyebrow={howItWorks.eyebrow}
        title={howItWorks.title}
        align="center"
      />

      <Stagger as="ol" className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {howItWorks.steps.map((s, i) => (
          <StaggerItem as="li" key={s.step} className="relative">
            {/* Rule to the next step — never after the last, never when stacked. */}
            {i < howItWorks.steps.length - 1 && (
              <span
                aria-hidden
                className="absolute top-6 left-[calc(3rem+0.75rem)] hidden h-px w-[calc(100%-3rem)] bg-sand-strong/70 lg:block"
              />
            )}
            <span className="font-mono relative grid size-12 place-items-center rounded-full border border-sage/35 bg-paper text-[0.95rem] font-semibold text-sage-deep">
              {s.step}
            </span>
            <h3 className="font-display mt-5 text-[1.15rem] leading-tight font-medium text-espresso">
              {s.label}
            </h3>
            <p className="mt-2 text-[0.94rem] leading-[1.6] text-espresso-soft">
              {s.body}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
