"use client";

import { useState } from "react";

import Button from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icons";
import { site } from "@/lib/site";

const CATEGORIES = [
  "Order question",
  "Shipping & tracking",
  "Returns & claims",
  "Product question",
  "Something else",
];

// Same pattern as app/api/newsletter/route.ts, so this validates the way a
// real endpoint would once one exists.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const labelClass =
  "font-label text-[0.68rem] font-bold tracking-widest text-espresso-soft uppercase";
const fieldClass =
  "w-full rounded-card border border-sand bg-cream px-4 py-3 text-sm text-espresso transition-colors duration-300 placeholder:text-espresso-mute/70 hover:border-espresso/25 focus:border-sage focus:outline-none";

/**
 * Contact form.
 *
 * There is no transactional-email provider wired into this project, so
 * rather than show a "Message sent" confirmation for a message that was
 * never delivered, this hands off to the visitor's own mail client with the
 * fields pre-filled. The message genuinely reaches us that way.
 *
 * To make it a true in-page send later: POST these same fields to a new
 * /api/contact route and replace `openMailClient` — the validation and shape
 * are already what such an endpoint would want.
 */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [handedOff, setHandedOff] = useState(false);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Fill in your name, email and a message. We need all three to reply.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setError("That email doesn't look right. Double-check it.");
      return;
    }
    setError(null);

    const subject = `[${category}] ${name.trim()}`;
    const body = `${message.trim()}\n\n-\n${name.trim()}\n${email.trim()}`;
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setHandedOff(true);
  };

  if (handedOff) {
    return (
      <div className="rounded-card border border-sand/70 bg-paper p-8 text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-sage text-white">
          <Icon name="check" className="size-5" />
        </span>
        <p className="font-display mt-5 text-lg font-medium text-espresso">
          Your email client should be open
        </p>
        <p className="mt-2 text-sm leading-relaxed text-espresso-soft">
          Send the draft and we&rsquo;ll reply within 12 hours. If nothing
          opened, email us directly at{" "}
          <a
            href={`mailto:${site.email}`}
            className="font-medium text-sage-deep underline underline-offset-2"
          >
            {site.email}
          </a>
          .
        </p>
        <button
          type="button"
          onClick={() => setHandedOff(false)}
          className="font-label mt-5 text-[0.7rem] font-bold tracking-widest text-espresso-mute uppercase underline underline-offset-4 transition-colors hover:text-espresso"
        >
          Back to the form
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col gap-2">
        <span className={labelClass}>Name</span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoComplete="name"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Email</span>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          className={fieldClass}
        />
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Category</span>
        <div className="relative">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={`${fieldClass} cursor-pointer appearance-none pr-11`}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Icon
            name="chevron-down"
            className="pointer-events-none absolute top-1/2 right-4 size-4 -translate-y-1/2 text-espresso-mute"
          />
        </div>
      </label>

      <label className="flex flex-col gap-2">
        <span className={labelClass}>Message</span>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="What can we help with?"
          rows={5}
          className={`${fieldClass} resize-none`}
        />
      </label>

      {error && (
        <p
          role="alert"
          className="rounded-xl bg-terracotta-soft px-4 py-3 text-sm text-terracotta"
        >
          {error}
        </p>
      )}

      <Button type="submit" className="mt-1 w-full">
        Send message
      </Button>
      <p className="text-center text-[0.76rem] text-espresso-mute">
        Opens your mail app with the message ready to send.
      </p>
    </form>
  );
}
