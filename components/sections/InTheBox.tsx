import { inTheBox } from "@/content/copy";
import { Icon, type IconName } from "@/components/ui/Icons";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { Section, SectionHeading } from "@/components/ui/Section";

const icons: IconName[] = ["bag", "clip", "wash", "truck"];

/** The reference's "order contents" — a quiet 4-card grid. */
export default function InTheBox() {
  return (
    <Section id="in-the-box" className="bg-cream-deep">
      <SectionHeading
        eyebrow={inTheBox.eyebrow}
        title={inTheBox.title}
        align="center"
      />

      <Stagger
        as="ul"
        className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        stagger={0.07}
      >
        {inTheBox.items.map((item, i) => (
          <StaggerItem
            as="li"
            key={item.label}
            className="rounded-(--radius-card) border border-sand/70 bg-paper p-7 text-center"
          >
            <span className="mx-auto grid size-11 place-items-center rounded-full bg-sage-soft">
              <Icon name={icons[i]} className="size-5 text-sage-deep" />
            </span>
            <h3 className="font-display mt-4 text-[1.05rem] leading-tight font-medium text-espresso">
              {item.label}
            </h3>
            <p className="mt-2 text-[0.88rem] leading-[1.55] text-espresso-soft">
              {item.body}
            </p>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
