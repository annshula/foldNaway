import type { Metadata } from "next";

import Benefits from "@/components/sections/Benefits";
import Comparison from "@/components/sections/Comparison";
import FinalCta from "@/components/sections/FinalCta";
import HowItWorks from "@/components/sections/HowItWorks";
import Lifestyle from "@/components/sections/Lifestyle";
import ProblemSolution from "@/components/sections/ProblemSolution";
import TrustBar from "@/components/sections/TrustBar";
import WhereItGoes from "@/components/sections/WhereItGoes";
import { Section, SectionHeading } from "@/components/ui/Section";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Benefits",
  description: `Why a bag that lives on your keys beats one in a drawer. ${site.promise.shipping}.`,
  alternates: { canonical: "/benefits" },
  // Per-page OpenGraph: without an explicit url/title here every page
  // inherits the root layout's, so a shared link shows the homepage.
  // `images` must be repeated too — declaring an openGraph object
  // replaces the inherited one wholesale rather than merging into it,
  // which silently drops the card image.
  openGraph: {
    type: "website",
    url: absoluteUrl("/benefits"),
    images: ["/opengraph-image.jpg"],
    title: "Benefits",
  },
};

export default function BenefitsPage() {
  return (
    <main>
      {/* Clears the transparent nav — see Nav.tsx. */}
      <Section className="pt-[calc(var(--nav-h)+2.5rem)] pb-0">
        <SectionHeading
          eyebrow="Benefits"
          title="The bag you actually have on you."
          body="A tote in a drawer is not a tote. Everything below is about closing that gap."
          align="center"
        />
      </Section>

      <Benefits />
      <WhereItGoes />
      <ProblemSolution />
      <TrustBar />
      <Lifestyle />
      <HowItWorks />
      <Comparison />
      <FinalCta />
    </main>
  );
}
