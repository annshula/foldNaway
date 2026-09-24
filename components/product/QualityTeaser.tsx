import { Icon } from "@/components/ui/Icons";
import { quality } from "@/content/quality";

/**
 * Compact "Put to the test" teaser for the buy box — three of
 * `quality.checks` (content/quality.ts), not a generic trust badge. Every
 * word here is one of our own in-house bench checks, same content the full
 * "Put to the test" section (QualityTests.tsx, id="quality-test") stands
 * behind. Picked the three most concrete/visual checks (fold cycle, loaded
 * carry, seam & stitch) rather than all six, since this is a teaser, not
 * the section itself.
 */
export default function QualityTeaser() {
  return (
    <div className="mt-6 border-t border-sand/70 pt-6">
      <p className="font-label text-[0.7rem] font-bold tracking-widest text-espresso-mute uppercase">
        {quality.eyebrow}
      </p>
      <ul className="mt-3 grid gap-2.5">
        {quality.checks.slice(0, 3).map((check) => (
          <li
            key={check.title}
            className="flex items-start gap-2.5 text-[0.82rem] text-espresso-soft"
          >
            <Icon
              name={check.icon}
              className="mt-0.5 size-4 shrink-0 text-sage"
            />
            <span>{check.title}</span>
          </li>
        ))}
      </ul>
      <a
        href="#quality-test"
        className="mt-3 inline-block text-[0.8rem] font-medium text-espresso underline decoration-espresso/30 underline-offset-2 hover:decoration-espresso"
      >
        See the full test →
      </a>
    </div>
  );
}
