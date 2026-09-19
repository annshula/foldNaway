import type { Metadata } from "next";

import { ContactForm } from "@/components/contact/ContactForm";
import Faq from "@/components/sections/Faq";
import TrustBar from "@/components/sections/TrustBar";
import { Icon, type IconName } from "@/components/ui/Icons";
import { Reveal } from "@/components/ui/Motion";
import { Section, SectionHeading } from "@/components/ui/Section";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `Questions about an order, shipping or a claim? ${site.promise.support}.`,
  alternates: { canonical: "/contact" },
  // Per-page OpenGraph: without an explicit url/title here every page
  // inherits the root layout's, so a shared link shows the homepage.
  // `images` must be repeated too — declaring an openGraph object
  // replaces the inherited one wholesale rather than merging into it,
  // which silently drops the card image.
  openGraph: {
    type: "website",
    url: absoluteUrl("/contact"),
    images: ["/opengraph-image.jpg"],
    title: "Contact",
  },
};

const channels: { icon: IconName; label: string; value: string; href?: string }[] = [
  { icon: "chat", label: "Email", value: site.email, href: `mailto:${site.email}` },
  { icon: "truck", label: "Order & shipping", value: site.promise.shippingDetail },
  { icon: "shield", label: "Claims", value: site.promise.returns },
];

export default function ContactPage() {
  return (
    <main>
      <Section className="pt-[calc(var(--nav-h)+2.5rem)]">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <div>
            <SectionHeading
              eyebrow="Contact"
              title="Talk to a person."
              body={`${site.promise.support} — no ticket queue, no bot loop.`}
            />

            <ul className="mt-10 flex flex-col gap-5">
              {channels.map((c) => (
                <li key={c.label} className="flex items-start gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-full bg-sage-soft text-sage-deep">
                    <Icon name={c.icon} className="size-4.5" />
                  </span>
                  <span>
                    <span className="font-label block text-[0.66rem] font-bold tracking-widest text-espresso-mute uppercase">
                      {c.label}
                    </span>
                    {c.href ? (
                      <a
                        href={c.href}
                        className="mt-0.5 block text-[0.95rem] font-medium text-espresso underline decoration-sand-strong underline-offset-4 transition-colors duration-300 hover:text-sage-deep"
                      >
                        {c.value}
                      </a>
                    ) : (
                      <span className="mt-0.5 block text-[0.95rem] text-espresso-soft">
                        {c.value}
                      </span>
                    )}
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-10 border-t border-sand/70 pt-6 text-[0.86rem] leading-relaxed text-espresso-mute">
              {site.legalName} · {site.address}
            </p>
          </div>

          <Reveal className="rounded-card border border-sand/70 bg-paper p-7 sm:p-9">
            <ContactForm />
          </Reveal>
        </div>
      </Section>

      <TrustBar />
      <Faq />
    </main>
  );
}
