import { whereItGoes } from "@/content/copy";
import Image from "@/components/ui/Image";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { Section, SectionHeading } from "@/components/ui/Section";

/** The reference's "usage locations" — a 4-card image grid. */
const images = [
  "/lifestyle/on-keys.jpg",
  "/lifestyle/packed-car.jpg",
  "/lifestyle/in-backpack.jpg",
  "/lifestyle/on-stroller.jpg",
];

export default function WhereItGoes() {
  return (
    <Section id="where-it-goes">
      <SectionHeading
        eyebrow={whereItGoes.eyebrow}
        title={whereItGoes.title}
        align="center"
      />

      <Stagger
        as="ul"
        className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4"
        stagger={0.08}
      >
        {whereItGoes.places.map((place, i) => (
          <StaggerItem as="li" key={place.label} className="group">
            <figure className="relative aspect-[4/5] w-full overflow-hidden rounded-(--radius-card) bg-cream-deep">
              <Image
                src={images[i]}
                alt={`${place.label} — ${place.body}`}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 24vw"
                quality={75}
                className="object-cover transition-transform duration-700 ease-(--ease-out-expo) group-hover:scale-[1.04]"
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-espresso/70 via-espresso/10 to-transparent"
              />
              <figcaption className="absolute inset-x-0 bottom-0 p-5">
                <h3 className="font-display text-[1.08rem] leading-tight font-medium text-white">
                  {place.label}
                </h3>
                <p className="mt-1 text-[0.86rem] leading-snug text-white/75">
                  {place.body}
                </p>
              </figcaption>
            </figure>
          </StaggerItem>
        ))}
      </Stagger>
    </Section>
  );
}
