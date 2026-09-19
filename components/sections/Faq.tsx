import { faq } from "@/content/copy";
import { Reveal } from "@/components/ui/Motion";
import { Section, SectionHeading } from "@/components/ui/Section";

/**
 * FAQ accordion, built on native <details>. The answers stay in the DOM for
 * crawlers, it needs no JavaScript, and the open/close height animation is
 * the CSS grid-template-rows trick in globals.css (`.faq-item`).
 */
export default function Faq() {
  return (
    <Section id="faq" className="bg-cream-deep">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <SectionHeading
          eyebrow="Questions"
          title="Before you order."
          body="If something isn't answered here, email us — a person replies inside 12 hours."
        />

        <Reveal className="divide-y divide-sand/80 border-y border-sand/80">
          {faq.map((item) => (
            <details key={item.q} className="faq-item group py-1">
              <summary className="flex items-start justify-between gap-6 py-5 text-left">
                <span className="font-display text-[1.05rem] leading-snug font-medium text-espresso transition-colors duration-300 group-hover:text-sage-deep">
                  {item.q}
                </span>
                <span
                  aria-hidden
                  className="faq-sign mt-1 grid size-6 shrink-0 place-items-center rounded-full border border-sand-strong text-espresso-mute"
                >
                  <svg viewBox="0 0 24 24" className="size-3">
                    <path
                      d="M12 6v12M6 12h12"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
              </summary>
              <div className="faq-body">
                <div>
                  <p className="max-w-[62ch] pr-10 pb-6 text-[0.95rem] leading-[1.7] text-espresso-soft">
                    {item.a}
                  </p>
                </div>
              </div>
            </details>
          ))}
        </Reveal>
      </div>
    </Section>
  );
}
