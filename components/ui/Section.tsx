import type { ReactNode } from "react";
import { Reveal } from "@/components/ui/Motion";

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <Reveal
      as="p"
      className="font-label mb-5 text-[0.65rem] font-semibold tracking-[0.24em] text-sage-deep uppercase"
    >
      {children}
    </Reveal>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  className = "",
  dark = false,
}: {
  eyebrow: string;
  title: ReactNode;
  body?: string;
  align?: "left" | "center";
  className?: string;
  /** On the dark bark surfaces the text ramp inverts. */
  dark?: boolean;
}) {
  const centered = align === "center";
  return (
    <header
      className={`${centered ? "mx-auto max-w-180 text-center" : "max-w-2xl"} ${className}`}
    >
      <div className={centered ? "flex justify-center" : ""}>
        <Eyebrow>{eyebrow}</Eyebrow>
      </div>
      <Reveal
        as="h2"
        delay={0.06}
        className={`font-display text-[clamp(1.85rem,4vw,2.9rem)] leading-[1.08] font-medium tracking-[-0.02em] text-balance ${
          dark ? "text-oat" : "text-espresso"
        }`}
      >
        {title}
      </Reveal>
      {body && (
        <Reveal
          as="p"
          delay={0.14}
          className={`mt-5 text-[1.02rem] leading-[1.7] text-pretty ${
            dark ? "text-oat-soft" : "text-espresso-soft"
          }`}
        >
          {body}
        </Reveal>
      )}
    </header>
  );
}

/**
 * The one horizontal rhythm for the whole site: a 1240px measure with
 * generous vertical air. Every section on the page uses this, so spacing is
 * consistent by construction rather than by discipline.
 */
export function Section({
  id,
  children,
  className = "",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      id={id}
      className={`relative px-5 py-20 sm:px-8 lg:py-28 ${className}`}
    >
      <div className="mx-auto w-full max-w-310">{children}</div>
    </section>
  );
}
