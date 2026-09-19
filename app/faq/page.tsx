import type { Metadata } from "next";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FaqSchema from "@/components/FaqSchema";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";
import QuickAnswers from "@/components/sections/QuickAnswers";
import TrustBar from "@/components/sections/TrustBar";
import { Section, SectionHeading } from "@/components/ui/Section";
import { quickAnswers } from "@/content/answers";
import { faq } from "@/content/copy";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "FAQ",
  description: `Answers on sizing, shipping, care and returns. ${site.promise.support}.`,
  alternates: { canonical: "/faq" },
  // Per-page OpenGraph: without an explicit url/title here every page
  // inherits the root layout's, so a shared link shows the homepage.
  // `images` must be repeated too — declaring an openGraph object
  // replaces the inherited one wholesale rather than merging into it,
  // which silently drops the card image.
  openGraph: {
    type: "website",
    url: absoluteUrl("/faq"),
    images: ["/opengraph-image.jpg"],
    title: "FAQ",
  },
};

export default function FaqPage() {
  return (
    <main>
      <Section className="pt-[calc(var(--nav-h)+2.5rem)] pb-0">
        <SectionHeading
          eyebrow="Help"
          title="Questions, answered."
          body={`If something isn't here, email ${site.email}. A person replies instantly.`}
          align="center"
        />
      </Section>

      <QuickAnswers />
      <Faq />
      <TrustBar />
      <FinalCta />
      <FaqSchema
        id={`${absoluteUrl("/faq")}/#faq`}
        items={[...quickAnswers, ...faq]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]}
      />
    </main>
  );
}
