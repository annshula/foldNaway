import { trustBar } from "@/content/copy";
import { Icon, type IconName } from "@/components/ui/Icons";
import { Stagger, StaggerItem } from "@/components/ui/Motion";

const icons: IconName[] = ["truck", "shield", "chat"];

/**
 * Trust bar — deliberately not a <Section>: it is a thin band that butts
 * straight against the sections above and below it, so it reads as a rule
 * rather than another block of content.
 */
export default function TrustBar() {
  return (
    <aside className="border-y border-sand/70 bg-sage-soft/45 px-5 py-7 sm:px-8">
      <Stagger
        as="ul"
        className="mx-auto grid max-w-310 gap-6 sm:grid-cols-3"
        stagger={0.07}
      >
        {trustBar.map((t, i) => (
          <StaggerItem
            as="li"
            key={t.label}
            className="flex flex-col items-center gap-2 text-center sm:flex-row sm:items-center sm:gap-3 sm:text-left"
          >
            <Icon name={icons[i]} className="size-5 shrink-0 text-sage-deep" />
            <span>
              <span className="font-grotesk block text-[0.78rem] font-bold tracking-[0.08em] text-espresso uppercase">
                {t.label}
              </span>
              <span className="block text-[0.82rem] leading-snug text-espresso-mute">
                {t.detail}
              </span>
            </span>
          </StaggerItem>
        ))}
      </Stagger>
    </aside>
  );
}
