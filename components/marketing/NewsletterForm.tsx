"use client";

import { useId, useState } from "react";

import { Icon } from "@/components/ui/Icons";

type Status = "idle" | "loading" | "done" | "error";

/**
 * Quiet email capture — one field, no popup, no gated quiz. Posts to
 * /api/newsletter, which creates a real Shopify customer with PENDING
 * marketing consent (double opt-in, so nothing is fabricated) and returns
 * the one shared welcome code.
 *
 * Lives in the footer rather than an exit-intent overlay on purpose.
 */
export function NewsletterForm() {
  const inputId = useId();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [code, setCode] = useState<string | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");
    setMessage(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(data.error ?? "Couldn't sign you up. Try again.");
        return;
      }
      setStatus("done");
      setCode(data.code ?? null);
    } catch {
      setStatus("error");
      setMessage("Couldn't sign you up. Try again.");
    }
  };

  if (status === "done") {
    return (
      <p className="max-w-[38ch] text-[0.88rem] leading-relaxed text-oat">
        You&rsquo;re in. Check your inbox to confirm.
        {code && (
          <>
            {" "}
            Then use{" "}
            <span className="font-display font-semibold tracking-wide text-sage-hot">
              {code}
            </span>{" "}
            for 10% off your first order.
          </>
        )}
      </p>
    );
  }

  return (
    <form onSubmit={submit} className="newsletter-form">
      <label
        htmlFor={inputId}
        className="font-label block text-[0.68rem] font-bold tracking-[0.16em] text-oat uppercase"
      >
        10% off your first order
      </label>
      <div className="mt-3 flex items-center gap-2 rounded-full border border-bark-line bg-white/4 pr-1.5 pl-5 transition-colors duration-300 focus-within:border-sage/60">
        <input
          id={inputId}
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12 min-w-0 flex-1 bg-transparent text-[0.9rem] text-oat placeholder:text-oat-mute/70 focus:outline-none"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          aria-label="Subscribe"
          className="grid size-9 shrink-0 place-items-center rounded-full bg-sage text-white transition-all duration-300 hover:bg-sage-hot disabled:opacity-50"
        >
          <Icon name="arrow-right" className="size-4" />
        </button>
      </div>
      {message && (
        <p role="alert" className="mt-2.5 text-[0.8rem] text-terracotta">
          {message}
        </p>
      )}
      <p className="mt-2.5 text-[0.74rem] leading-snug text-oat-mute">
        Occasional emails. Unsubscribe any time.
      </p>
    </form>
  );
}
