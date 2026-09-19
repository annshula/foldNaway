import { benefits } from "@/content/copy";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { Section, SectionHeading } from "@/components/ui/Section";

/** Benefits grid — the reference's use-case list, as cards rather than bullets. */
export default function Benefits() {
  return (
    <Section id="benefits" className="bg-cream-deep">
      <SectionHeading
        eyebrow={benefits.eyebrow}
        title={benefits.title}
        body={benefits.body}
        align="center"
      />

      <Stagger
        as="ul"
        className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3"
        stagger={0.07}
      >
        {benefits.items.map((b, i) => (
          <StaggerItem
            as="li"
            key={b.label}
            className="group relative overflow-hidden rounded-(--radius-card) border border-sand/70 bg-paper p-7 transition-all duration-500 ease-(--ease-out-expo) hover:-translate-y-1 hover:border-sage/35 hover:shadow-(--shadow-e3)"
          >
            <span
              aria-hidden
              className="font-mono block text-[0.95rem] font-semibold text-sage/50"
            >
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3 className="font-display mt-3 text-[1.2rem] leading-tight font-medium text-espresso">
              {b.label}
            </h3>
            <p className="mt-2.5 text-[0.94rem] leading-[1.6] text-espresso-soft">
              {b.body}
            </p>
            {/* Sage edge that wipes in on hover — the one motion per card. */}
            <span
              aria-hidden
              className="absolute inset-x-0 bottom-0 h-0.5 origin-left scale-x-0 bg-sage transition-transform duration-500 ease-(--ease-out-expo) group-hover:scale-x-100"
            />
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
