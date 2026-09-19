import { quickAnswers } from "@/content/answers";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { Section, SectionHeading } from "@/components/ui/Section";

/**
 * The visible half of the AEO layer.
 *
 * Every answer emitted as FAQPage JSON-LD (components/Schema.tsx) is
 * rendered here in plain text — schema whose answer is not on the page is a
 * Google guidelines violation, and answer engines discount text they cannot
 * see. So this component and the structured data read from the one array in
 * content/answers.ts and can never drift apart.
 *
 * Marked up with real <dl>/<dt>/<dd> rather than divs: the
 * question→answer relationship is the whole point of the section, and it is
 * what makes the block cleanly extractable by a crawler that ignores JSON-LD.
 */
export default function QuickAnswers() {
  return (
    <Section id="quick-answers" className="bg-cream-deep">
      <SectionHeading
        eyebrow="Quick answers"
        title="The short version."
        body="Straight answers to what people ask most, before the detail below."
        align="center"
      />

      <Stagger
        as="div"
        className="mt-14 grid gap-x-10 gap-y-9 sm:grid-cols-2"
        stagger={0.05}
      >
        {quickAnswers.map((item) => (
          <StaggerItem key={item.q}>
            <dl>
              <dt className="font-display text-[1.05rem] leading-snug font-medium text-espresso">
                {item.q}
              </dt>
              <dd className="mt-2 text-[0.93rem] leading-[1.7] text-espresso-soft text-pretty">
                {item.a}
              </dd>
            </dl>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
