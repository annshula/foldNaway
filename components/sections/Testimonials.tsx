import { pouchReviews, pouchReviewSummary } from "@/data/reviews";
import { Icon } from "@/components/ui/Icons";
import { Stagger, StaggerItem } from "@/components/ui/Motion";
import { RatingStars, StarRow } from "@/components/ui/Stars";
import { Section, SectionHeading } from "@/components/ui/Section";
import { pathForHandle } from "@/lib/catalog";
import { POUCH_REVIEWS_HANDLE } from "@/data/reviews";

/**
 * Homepage social proof — the four newest reviews from the same dataset the
 * product page paginates (data/reviews.ts), so the homepage can never drift
 * from the product page's numbers.
 *
 * No Review / AggregateRating schema is emitted here; that stays gated on
 * site.metrics.verified (see ProductSchema).
 */
const FEATURED = pouchReviews.slice(0, 4);

/** "Marcus Turner" → "Ma***us Tu***er" — matches the product page's masking. */
function maskWord(word: string): string {
  const clean = word.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (clean.length <= 1) return "***";
  const keep = clean.length <= 4 ? 1 : 2;
  return `${clean.slice(0, keep)}***${clean.slice(-keep)}`;
}

function maskName(full: string): string {
  const parts = full.split(" ").filter(Boolean);
  if (parts.length === 0) return "***";
  return parts.map(maskWord).join(" ");
}

export default function Testimonials() {
  const { average, count } = pouchReviewSummary;

  return (
    <Section id="reviews">
      <SectionHeading
        eyebrow="Customer reviews"
        title="Bought once. Clipped on ever since."
        align="center"
      />

      <div className="mt-8 flex flex-col items-center gap-2">
        <RatingStars value={average} starClassName="h-5 w-5" />
        <p className="text-[0.88rem] text-espresso-soft">
          <span className="font-semibold text-espresso tabular-nums">
            {average.toFixed(1)}
          </span>{" "}
          out of 5 ·{" "}
          <span className="tabular-nums">{count.toLocaleString("en-US")}</span>{" "}
          reviews
        </p>
      </div>

      <Stagger
        as="ul"
        className="mt-12 grid gap-5 sm:grid-cols-2"
        stagger={0.07}
      >
        {FEATURED.map((review) => (
          <StaggerItem
            as="li"
            key={review.id}
            className="rounded-card border border-sand/70 bg-paper p-7"
          >
            <StarRow stars={review.rating} starClassName="h-3.5 w-3.5" />
            <blockquote className="font-display mt-4 text-[1.1rem] leading-normal font-medium text-espresso text-pretty">
              &ldquo;{review.text}&rdquo;
            </blockquote>
            <p className="font-label mt-5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[0.7rem] font-semibold tracking-widest text-espresso-mute uppercase">
              {maskName(review.author)}
              <span className="text-espresso-mute/60">· {review.country}</span>
              {review.verified && (
                <span className="inline-flex items-center gap-1 text-sage-deep">
                  <Icon name="check" className="size-3" />
                  Verified
                </span>
              )}
            </p>
          </StaggerItem>
        ))}
      </Stagger>

      <p className="mt-10 text-center">
        <a
          href={`${pathForHandle(POUCH_REVIEWS_HANDLE)}#reviews`}
          className="font-label inline-flex items-center gap-2 text-[0.74rem] font-semibold tracking-[0.14em] text-sage-deep uppercase underline decoration-sage/40 underline-offset-4 transition-colors duration-300 hover:text-espresso"
        >
          Read all {count.toLocaleString("en-US")} reviews
          <Icon name="arrow-right" className="size-4" />
        </a>
      </p>
    </Section>
  );
}
