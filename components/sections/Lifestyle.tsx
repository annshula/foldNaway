import Image from "@/components/ui/Image";
import { Reveal } from "@/components/ui/Motion";
import { site } from "@/lib/site";

/**
 * The reference's single full-bleed lifestyle image with a contextual
 * caption — the one place on the page that breaks the 1240px measure, so it
 * lands as a breath between two dense sections.
 */
export default function Lifestyle() {
  return (
    <section className="relative isolate">
      <div className="relative h-[62svh] min-h-100 w-full overflow-hidden bg-cream-deep lg:h-[74svh]">
        <Image
          src="/lifestyle/market-in-hand.jpg"
          alt="Someone carrying a loaded FoldNAway tote out of an outdoor market"
          fill
          sizes="100vw"
          quality={82}
          className="object-cover"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-linear-to-t from-espresso/80 via-espresso/25 to-espresso/5"
        />

        <div className="absolute inset-x-0 bottom-0 px-5 pb-12 sm:px-8 lg:pb-16">
          <Reveal className="mx-auto max-w-310">
            <p className="font-display max-w-[24ch] text-[clamp(1.6rem,3.6vw,2.6rem)] leading-[1.12] font-medium text-white text-balance">
              {site.tagline}
            </p>
            <p className="font-label mt-4 text-[0.72rem] font-semibold tracking-[0.18em] text-white/65 uppercase">
              {site.promise.capacity}
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
