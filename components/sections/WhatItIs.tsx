import { whatItIs } from "@/content/copy";
import { Icon } from "@/components/ui/Icons";
import Image from "@/components/ui/Image";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Motion";
import { Section, SectionHeading } from "@/components/ui/Section";

/**
 * "Product definition" — the reference's second section: what the thing
 * actually is, as a text block plus a bulleted spec list, against a
 * lifestyle image.
 */
export default function WhatItIs() {
  return (
    <Section id="what-it-is">
      <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <Reveal className="order-2 lg:order-1">
          <figure className="relative aspect-[5/4] w-full overflow-hidden rounded-[24px] bg-cream-deep shadow-(--shadow-e3)">
            <Image
              src="/lifestyle/unfolded-counter.jpg"
              alt="The pouch bag unfolded on a kitchen counter beside groceries"
              fill
              sizes="(max-width: 1024px) 100vw, 48vw"
              quality={82}
              className="object-cover"
            />
          </figure>
        </Reveal>

        <div className="order-1 lg:order-2">
          <SectionHeading
            eyebrow={whatItIs.eyebrow}
            title={whatItIs.title}
            body={whatItIs.body}
          />

          <Stagger as="ul" className="mt-9 grid gap-3.5 sm:grid-cols-2">
            {whatItIs.points.map((point) => (
              <StaggerItem
                as="li"
                key={point}
                className="flex items-start gap-3 text-[0.94rem] leading-[1.55] text-espresso-soft"
              >
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-sage-soft">
                  <Icon name="check" className="size-3 text-sage-deep" />
                </span>
                {point}
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </div>
    </Section>
  );
}
