import { finalCta } from "@/content/copy";
import Button from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Motion";
import { site } from "@/lib/site";

/** Closing CTA — dark band, one button, nothing competing with it. */
export default function FinalCta() {
  return (
    <section className="grain relative isolate overflow-hidden bg-bark px-5 py-24 text-center sm:px-8 lg:py-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 opacity-60"
        style={{
          background:
            "radial-gradient(60vmax 40vmax at 50% 0%, rgba(125,143,111,0.22), transparent 70%)",
        }}
      />
      <Reveal className="mx-auto max-w-160">
        <p className="font-label text-[0.65rem] font-semibold tracking-[0.24em] text-sage-hot uppercase">
          {finalCta.eyebrow}
        </p>
        <h2 className="font-display mt-6 text-[clamp(1.9rem,4.4vw,3rem)] leading-[1.08] font-medium text-oat text-balance">
          {finalCta.title}
        </h2>
        <p className="mt-5 text-[1.02rem] leading-[1.7] text-oat-soft text-pretty">
          {finalCta.body}
        </p>
        <div className="mt-10 flex justify-center">
          <Button href={finalCta.ctaHref} variant="invert" size="lg" arrow>
            {finalCta.cta}
          </Button>
        </div>
        <p className="font-label mt-7 text-[0.68rem] font-medium tracking-[0.14em] text-oat-mute uppercase">
          {site.promise.shipping} · {site.promise.returns}
        </p>
      </Reveal>
    </section>
  );
}
