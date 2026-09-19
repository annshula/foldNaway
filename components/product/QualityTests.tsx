import { quality } from "@/content/quality";
import { Icon, type IconName } from "@/components/ui/Icons";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { Section, SectionHeading } from "@/components/ui/Section";

/**
 * "Put to the test" — the build-quality band, mounted on the product page
 * (id="quality-test", targeted from the in-page jump links).
 *
 * The checks are our own in-house pre-dispatch QC process, framed as bench
 * checks — not a fabricated third-party lab certification. The "Pass" badge
 * refers to that bench check and nothing more.
 */
export default function QualityTests() {
  return (
    // `scroll-mt-20` (5rem/80px) previously here didn't match `--nav-h`
    // (72px) and, worse, stacked additively with globals.css's own
    // `html { scroll-padding-top: var(--nav-h) }` — a click on the
    // "checks passed" link measurably landed 80px past the section's real
    // top instead of flush with the nav (confirmed by measuring the actual
    // post-click scroll position, not just eyeballing a screenshot). The
    // already-correct global scroll-padding-top handles this alone; no
    // per-element scroll-mt-* needed.
    <Section
      id="quality-test"
      className="border-y border-sand/70 bg-cream-deep"
    >
      <SectionHeading
        align="center"
        eyebrow={quality.eyebrow}
        title={quality.heading}
        body={quality.lede}
      />

      <Stagger
        as="ul"
        className="mt-12 grid gap-4 sm:grid-cols-2 lg:mt-16 lg:grid-cols-3"
        stagger={0.07}
      >
        {quality.checks.map((check) => (
          <StaggerItem
            key={check.title}
            as="li"
            className="group relative overflow-hidden rounded-card border border-sand/70 bg-paper p-6 transition-all duration-500 ease-(--ease-out-expo) hover:-translate-y-1 hover:border-sage/35 hover:shadow-(--shadow-e3)"
          >
            <span className="font-label absolute top-5 right-5 inline-flex items-center gap-1 rounded-full border border-sage/25 bg-sage-soft px-2 py-0.5 text-[0.6rem] font-bold tracking-[0.14em] text-sage-deep uppercase">
              <Icon name="check" className="size-2.5" />
              Pass
            </span>
            <span className="grid size-10 place-items-center rounded-full border border-sage/30 bg-cream text-sage-deep">
              <Icon name={check.icon as IconName} className="size-4.5" />
            </span>
            <h3 className="font-grotesk mt-5 pr-16 text-[1.02rem] leading-snug font-semibold text-espresso">
              {check.title}
            </h3>
            <p className="mt-2 text-[0.87rem] leading-[1.6] text-espresso-soft">
              {check.body}
            </p>
          </StaggerItem>
        ))}
      </Stagger>

      <p className="mx-auto mt-10 max-w-160 text-center text-[0.8rem] leading-relaxed text-espresso-mute">
        These are our own pre-dispatch bench checks, not a third-party
        laboratory certification.
      </p>
    </Section>
  );
}
