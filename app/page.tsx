import Schema from "@/components/Schema";
import Benefits from "@/components/sections/Benefits";
import Comparison from "@/components/sections/Comparison";
import Details from "@/components/sections/Details";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";
import Hero from "@/components/sections/Hero";
import HowItWorks from "@/components/sections/HowItWorks";
import InTheBox from "@/components/sections/InTheBox";
import Lifestyle from "@/components/sections/Lifestyle";
import ProblemSolution from "@/components/sections/ProblemSolution";
import QuickAnswers from "@/components/sections/QuickAnswers";
import Testimonials from "@/components/sections/Testimonials";
import TrustBar from "@/components/sections/TrustBar";
import WhatItIs from "@/components/sections/WhatItIs";
import WhereItGoes from "@/components/sections/WhereItGoes";

/**
 * Homepage.
 *
 * Section order mirrors the structural reference (accupenpro.com): hero →
 * definition → benefits → locations → problem/solution → trust → details →
 * lifestyle → how-it-works → comparison → contents → testimonials → quick
 * answers → FAQ → final CTA. Surfaces alternate cream / cream-deep / bark so
 * no two adjacent blocks share a background.
 *
 * <QuickAnswers> is the visible half of the AEO layer: <Schema> emits those
 * same answers as FAQPage JSON-LD, and markup whose answer is not on the page
 * is a guidelines violation — so the two always ship together.
 */
export default function HomePage() {
  return (
    <main>
      <Hero />
      <WhatItIs />
      <Benefits />
      <WhereItGoes />
      <ProblemSolution />
      <TrustBar />
      <Details />
      <Lifestyle />
      <HowItWorks />
      <Comparison />
      <InTheBox />
      <Testimonials />
      <QuickAnswers />
      <Faq />
      <FinalCta />
      <Schema />
    </main>
  );
}
