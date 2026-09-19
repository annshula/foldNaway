import type { Metadata } from "next";

import FinalCta from "@/components/sections/FinalCta";
import Lifestyle from "@/components/sections/Lifestyle";
import TrustBar from "@/components/sections/TrustBar";
import { Icon, type IconName } from "@/components/ui/Icons";
import { Reveal, Stagger, StaggerItem } from "@/components/ui/Motion";
import { Section, SectionHeading } from "@/components/ui/Section";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: site.description,
  alternates: { canonical: "/about" },
  // Per-page OpenGraph: without an explicit url/title here every page
  // inherits the root layout's, so a shared link shows the homepage.
  // `images` must be repeated too — declaring an openGraph object
  // replaces the inherited one wholesale rather than merging into it,
  // which silently drops the card image.
  openGraph: {
    type: "website",
    url: absoluteUrl("/about"),
    images: ["/opengraph-image.jpg"],
    title: "About",
  },
};

const principles: { icon: IconName; title: string; body: string }[] = [
  {
    icon: "fold",
    title: "It has to be on you",
    body: "A reusable bag only counts on the trips you actually have it for. Everything about this one is in service of it being clipped to your keys already.",
  },
  {
    icon: "leaf",
    title: "Used, not replaced",
    body: "Reinforced seams and a durable weave, so it gets folded and unfolded hundreds of times. A bag that lasts is the only version of this that helps.",
  },
  {
    icon: "shield",
    title: "No invented numbers",
    body: "We publish what we can evidence. If you don't see a gram weight or a kilogram load rating on this site, it's because we haven't measured one.",
  },
];

/** Honest shipping detail — no promised date we can't hold to. */
const logistics = [
  { label: "Dispatch", value: "1–3 business days" },
  { label: "Delivery", value: "Typically 7–15 business days" },
  { label: "Tracking", value: "Emailed the moment it ships" },
  { label: "Cost", value: "Free, worldwide, no minimum" },
];

export default function AboutPage() {
  return (
    <main>
      <Section className="pt-[calc(var(--nav-h)+2.5rem)]">
        <SectionHeading
          eyebrow="About"
          title="We make one thing, properly."
          body={`${site.name} exists because the reusable bag problem isn't a supply problem. It's a "did you bring one" problem. So we built the version that's already with you.`}
          align="center"
        />

        <Stagger as="ul" className="mt-14 grid gap-5 lg:grid-cols-3" stagger={0.08}>
          {principles.map((p) => (
            <StaggerItem
              as="li"
              key={p.title}
              className="rounded-card border border-sand/70 bg-paper p-8"
            >
              <span className="grid size-11 place-items-center rounded-full bg-sage-soft text-sage-deep">
                <Icon name={p.icon} className="size-5" />
              </span>
              <h2 className="font-display mt-5 text-[1.2rem] leading-tight font-medium text-espresso">
                {p.title}
              </h2>
              <p className="mt-2.5 text-[0.94rem] leading-[1.65] text-espresso-soft">
                {p.body}
              </p>
            </StaggerItem>
          ))}
        </Stagger>
      </Section>

      <Lifestyle />

      <Section className="bg-cream-deep">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          <SectionHeading
            eyebrow="Shipping & returns"
            title="What we promise, and what we don't."
            body="We ship worldwide, tracked and free. What we won't do is quote you a delivery date we can't hold to."
          />

          <Reveal>
            <dl className="overflow-hidden rounded-card border border-sand/70">
              {logistics.map((row, i) => (
                <div
                  key={row.label}
                  className={`flex items-baseline justify-between gap-6 bg-paper px-6 py-5 ${
                    i < logistics.length - 1 ? "border-b border-sand/60" : ""
                  }`}
                >
                  <dt className="font-label text-[0.7rem] font-semibold tracking-widest text-espresso-mute uppercase">
                    {row.label}
                  </dt>
                  <dd className="text-right text-[0.94rem] font-medium text-espresso">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 text-[0.9rem] leading-[1.7] text-espresso-soft">
              {site.promise.returnsDetail}
            </p>
          </Reveal>
        </div>
      </Section>

      <TrustBar />
      <FinalCta />
    </main>
  );
}
