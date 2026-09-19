import { problemSolution } from "@/content/copy";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { Section, SectionHeading } from "@/components/ui/Section";

/**
 * The reference's problem/solution block: three honest objections, each
 * answered. Problem line is set in the muted ramp and struck through; the
 * answer carries the weight.
 */
export default function ProblemSolution() {
  return (
    <Section id="why" className="bg-bark text-oat">
      <div className="grain pointer-events-none absolute inset-0" />
      <div className="relative">
        <SectionHeading
          eyebrow={problemSolution.eyebrow}
          title={problemSolution.title}
          align="center"
          dark
        />

        <Stagger as="ul" className="mt-14 grid gap-5 lg:grid-cols-3">
          {problemSolution.scenarios.map((s) => (
            <StaggerItem
              as="li"
              key={s.problem}
              className="rounded-(--radius-card) border border-bark-line bg-white/[0.03] p-7"
            >
              <p className="font-label text-[0.72rem] font-semibold tracking-[0.12em] text-oat-mute uppercase line-through decoration-terracotta/70 decoration-2">
                {s.problem}
              </p>
              <p className="mt-4 text-[0.98rem] leading-[1.65] text-oat-soft">
                {s.solution}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}
