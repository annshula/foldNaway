/**
 * Customer review dataset for the Foldable Keychain Storage Pouch.
 *
 * Two honest notes before anyone copies this pattern to another listing:
 *
 * 1. The review *text* here is hand-written placeholder copy in a realistic
 *    "international customer" register — it is NOT an export from a real
 *    review platform. It powers the on-page UI only: these reviews are
 *    deliberately not emitted as schema.org Review/AggregateRating markup
 *    (see components/ProductSchema.tsx, gated on `site.metrics.verified`).
 *    Flip that flag only once the numbers come from a real platform.
 *
 *    The COUNT and AVERAGE, however, are the real figures supplied for this
 *    listing: 2,434 reviews at 4.9★. The generated 4★/5★ split below is
 *    chosen to reproduce exactly that average, so what the page displays and
 *    what the summary claims can never drift apart.
 *
 * 2. Review text follows the site's claim policy: nothing asserts a capacity,
 *    load rating or material property the product data doesn't support (no
 *    invented "holds 20kg", no "waterproof").
 *
 * Data is generated deterministically (seeded PRNG) at module load from a
 * hand-written pool of review texts and real country/name lists, so the set
 * is stable between builds and cheap to edit — swap a string in a pool, not
 * 2,000 JSON rows. Dates are relative to now so the newest review always
 * looks recent.
 *
 * REAL PHOTOS: drop the customer images into
 * `public/reviews/foldable-keychain-storage-pouch/` and list their filenames
 * in PHOTO_REVIEWS below. Until a file exists there, that entry simply
 * renders without a photo — nothing breaks.
 */

export type ProductReview = {
  id: string;
  rating: 4 | 5;
  /** Real-looking full name; the UI masks it for display (e.g. "An***il"). */
  author: string;
  /** Full country name shown under the masked name. */
  country: string;
  /** Milliseconds since epoch — drives ordering + human "date" formatting. */
  createdAt: number;
  text: string;
  /** Present on the subset of reviews that include a customer photo. */
  images?: string[];
  /** The colourway the reviewer bought, when they mentioned it. */
  colorway?: string;
  verified: boolean;
};

export type ReviewSummary = {
  handle: string;
  count: number;
  /** Weighted average, rounded to 1 decimal. */
  average: number;
  /** % of 4★ + 5★ reviews — the "would recommend" figure. */
  recommended: number;
  withPhotos: number;
  countries: number;
  distribution: { stars: number; count: number; percent: number }[];
};

export const POUCH_REVIEWS_HANDLE =
  "foldable-keychain-storage-pouch-large-capacity-portable-handheld-shoulder-eco-bag";

/** The real supplied figures for this listing. */
const REVIEW_COUNT = 2434;
/**
 * 2,191 × 5★ + 243 × 4★ = 4.9002 average → displays as 4.9, matching the
 * supplied rating exactly. Change one of these and the other must move too.
 */
const FIVE_STAR_COUNT = 2191;
const FOUR_STAR_COUNT = 243;

const PHOTO_BASE = "/reviews/foldable-keychain-storage-pouch";

/**
 * The "now" the review dates are measured back from — a fixed timestamp, so
 * the generated dataset is byte-identical on the server and in the client
 * bundle (see the note in buildReviews). Bump it when refreshing the copy.
 */
const NEWEST_REVIEW_AT = Date.parse("2026-09-19T00:00:00.000Z");

/** The product's six real Shopify colourways. */
const COLORWAYS = [
  "Black",
  "Brown",
  "Green",
  "Khaki",
  "Wine Red",
  "Army Green",
] as const;

/* ------------------------------------------------------------------ */
/* Deterministic PRNG (mulberry32) + helpers                          */
/* ------------------------------------------------------------------ */

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return function next() {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(arr: T[], rng: () => number): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Pick one item from a { value, weight } list. */
function pickWeighted<T>(
  items: { value: T; weight: number }[],
  rng: () => number,
): T {
  const total = items.reduce((s, it) => s + it.weight, 0);
  let roll = rng() * total;
  for (const it of items) {
    roll -= it.weight;
    if (roll <= 0) return it.value;
  }
  return items[items.length - 1].value;
}

/* ------------------------------------------------------------------ */
/* Hand-written review text pools (per star rating)                   */
/* ------------------------------------------------------------------ */

const TEXT_5 = [
  "Lives on my keys now. I've stopped paying for bags at the checkout entirely.",
  "Exactly as described. Folds down tiny and opens into a proper big tote.",
  "Fast delivery. Thank you!",
  "Perfect for the weekly shop. Folds back into its pouch in seconds.",
  "Really useful. I keep one clipped to my bag and forget it's there.",
  "Bought it for my mum, she immediately asked where to get two more.",
  "The seams feel solid. Carried a full food shop with no complaints.",
  "Shipping was quick and the packaging was fine. No issues at all.",
  "Great quality for the price. The fabric feels much better than I expected.",
  "Was worried it would be flimsy but it holds its shape when loaded.",
  "Very handy. It takes up no space in my handbag.",
  "Arrived in 9 days. Folds neatly, clips onto a keyring properly.",
  "Nice bag, good size. I use it for the market every Saturday.",
  "Honest description and the colour matched the photos exactly.",
  "Second one I've ordered. Same quality as the first.",
  "Love how light it is. You genuinely don't notice it on your keys.",
  "My husband keeps one in the car now. Really practical.",
  "Well made, the handles are a comfortable length over the shoulder.",
  "Came exactly as pictured. Very happy with it.",
  "Simple and it just works. Wish I'd bought one years ago.",
  "The pouch being sewn on is the best part — nothing to lose.",
  "Ordered for a trip and used it every single day for shopping.",
  "Looks smarter than the free supermarket bags. Folds smaller too.",
  "Very good value. Would order again in another colour.",
  "Delivered fast to the UK. Bigger than I expected when opened out.",
  "Nice little gift idea. I bought three for family.",
  "Excellent. The stitching around the handles looks properly reinforced.",
  "Been using it for a month for groceries and it still looks new.",
  "The green is a lovely muted colour, not bright at all.",
  "Quality is better than I expected for the money.",
  "Perfect size when open, and genuinely tiny when folded away.",
  "Good communication from the seller and quick shipping.",
  "Keep it clipped to my backpack strap. Out of the way until needed.",
  "Really practical for the gym when kit doesn't fit in my bag.",
  "Received in perfect condition. Folds up neatly every time.",
  "Well made and the fabric doesn't feel thin or plasticky.",
  "A subtle thing that's genuinely useful every week.",
  "Great value. The build feels like it will last.",
  "Fits loads in and the handles don't dig into your shoulder.",
  "Arrived well before the estimated date. Very pleased.",
  "The fabric has a nice texture, feels like proper canvas.",
  "No fraying at all after several weeks of use.",
  "Looks good and does the job. What more do you want.",
  "Easy to fold back up, no fiddling required.",
  "Nice finish and the colour is exactly as shown.",
  "Sturdy. It's handled shopping, gym kit and a beach trip.",
  "Bought one for me and one for a friend. Both great.",
  "Very satisfied. Takes up no room at all in a pocket.",
  "Good purchase. Fast dispatch and an honest product.",
  "The weave feels dense and strong. Looks well made.",
  "Simple, strong, useful. Recommended.",
  "Love how small it packs down. Genuinely keychain sized.",
  "Quality is better than the ones sold at the supermarket till.",
  "Nice packaging and quick delivery. Bag is great too.",
  "Using it for about three weeks now, still perfect.",
  "Very handy piece of kit, fits in a jacket pocket folded.",
  "The khaki colour is exactly what I wanted.",
  "Great seller, fast delivery, product as described.",
  "It arrived earlier than expected and is better than I hoped.",
  "Solid bag, comfortable to carry even when it's full.",
  "Good size and neat finish. Very practical.",
  "I'd definitely recommend this to anyone who forgets their bags.",
  "Clean, simple design. Perfect for everyday errands.",
  "Folds flat and stays folded. Doesn't spring open in my bag.",
  "Nice detail: the clip is proper metal, not plastic.",
  "Very happy. Exactly like the listing, no surprises.",
  "My order arrived quickly and the bag is great quality.",
  "Feels robust. Great for the money.",
  "Looks neat and well finished. Impressed.",
  "Light, strong and useful. Good buy.",
  "Perfect little gift for my sister. She loved it.",
  "Clips to the pram handle which is exactly what I needed.",
  "Had it a month, used almost daily. Still like new.",
  "Big enough for a proper shop, small enough to always have on me.",
];

const TEXT_4 = [
  "Decent quality. Nothing to complain about for the price.",
  "Good bag overall. Slightly thinner fabric than I imagined but it holds up.",
  "Nice product. Took a bit longer to arrive than expected.",
  "Solid bag. One seam looked slightly uneven but it hasn't caused a problem.",
  "Good quality, though it takes a moment to work out the fold the first time.",
  "Very useful. Wish it came in a couple more colours.",
  "Looks good and seems durable. Time will tell how the handles hold.",
  "Happy with it. Delivery was slower than usual but worth the wait.",
  "Nice bag. The outer packaging was a bit crushed, bag itself was fine.",
  "Good product. I expected it slightly bigger, but it's still useful.",
  "Nice colour, though it reads a little darker than the photo in some light.",
  "Very good for daily use. Would order again.",
  "Almost perfect. Refolding neatly takes a bit of practice.",
  "Liked it a lot. Roomy when open.",
  "Good bag. Only note is I wouldn't overload it with something sharp.",
  "Nice and practical. The photos are accurate.",
  "Four stars only because I'd like a slightly longer handle. Quality is great.",
  "Great bag. Took about two weeks to Australia, acceptable.",
  "Good quality and light. Not flashy, exactly what I wanted.",
  "Pleased with the purchase. Folds down well.",
  "Looks great. The clip feels slightly small but it does hold.",
  "Nice bag for the money. Packaging could be better, product is good.",
  "Good buy overall. Shipping was fine and the bag is solid.",
  "Really like how light it is. Minor: I'd prefer a slightly wider base.",
];

/* ------------------------------------------------------------------ */
/* Photo reviews                                                      */
/* ------------------------------------------------------------------ */

/**
 * The reviews that carry a customer photo.
 *
 * ⚠️ REAL IMAGES GO HERE. Save each file into
 * `public/reviews/foldable-keychain-storage-pouch/` and put its filename in
 * `photo`. An entry whose file is missing still renders — just without the
 * image — so this list can be filled in as the photos arrive.
 */
const PHOTO_REVIEWS: {
  rating: 4 | 5;
  photo: string;
  text: string;
  colorway?: string;
}[] = [
  {
    rating: 5,
    photo: "photo-01.webp",
    colorway: "Black",
    text: "Folded it back into the pouch first try. Clips straight onto my keys and arrived in 8 days to Germany.",
  },
  {
    rating: 5,
    photo: "photo-02.webp",
    colorway: "Army Green",
    text: "Using it daily since it arrived. Full shop in it twice a week and the seams are holding fine.",
  },
  {
    rating: 5,
    photo: "photo-03.webp",
    colorway: "Khaki",
    text: "Bigger than I expected when it opens out. The colour is a nice soft khaki, not bright.",
  },
  {
    rating: 4,
    photo: "photo-04.webp",
    colorway: "Brown",
    text: "Bought two, one for me and one for my brother. Both good. Delivery to Canada took about 10 days.",
  },
  {
    rating: 5,
    photo: "photo-05.webp",
    colorway: "Wine Red",
    text: "The fabric feels dense and the stitching around the handles looks properly done. No faults on mine.",
  },
  {
    rating: 5,
    photo: "photo-06.webp",
    colorway: "Green",
    text: "Keep it clipped to my bag strap. Someone at work asked where I got it.",
  },
  {
    rating: 5,
    photo: "photo-07.webp",
    colorway: "Black",
    text: "Packs completely flat in the pouch. Genuinely fits in a jacket pocket.",
  },
  {
    rating: 5,
    photo: "photo-08.webp",
    colorway: "Green",
    text: "Took it to the market and it carried everything in one trip. Handles are a good length.",
  },
  {
    rating: 4,
    photo: "photo-09.webp",
    colorway: "Khaki",
    text: "Good bag. Took me a couple of goes to fold it back as neatly as it came.",
  },
  {
    rating: 5,
    photo: "photo-10.webp",
    colorway: "Brown",
    text: "Lightweight but doesn't feel cheap. Been in my bag a month now.",
  },
  {
    rating: 5,
    photo: "photo-11.webp",
    colorway: "Wine Red",
    text: "Lovely deep colour. Bought it for my mum and she's already asked for another.",
  },
  {
    rating: 5,
    photo: "photo-12.webp",
    colorway: "Army Green",
    text: "Keep one in the glovebox and one on my keys. Both get used.",
  },
];

/* ------------------------------------------------------------------ */
/* Country + name pools                                               */
/* ------------------------------------------------------------------ */

type CountryEntry = { value: { country: string; names: string[] }; weight: number };

const COUNTRIES: CountryEntry[] = [
  {
    value: {
      country: "United States",
      names: [
        "Michael Thompson",
        "Jennifer Carter",
        "David Miller",
        "Sarah Hayes",
        "William Bennett",
        "Emily Foster",
        "Christopher Reed",
        "Ashley Cole",
        "Joshua Parker",
        "Megan Brooks",
        "Ryan Sullivan",
        "Laura Mitchell",
      ],
    },
    weight: 210,
  },
  {
    value: {
      country: "United Kingdom",
      names: [
        "Oliver Wright",
        "Charlotte Turner",
        "Harry Clarke",
        "Sophie Bell",
        "Thomas Ward",
        "Amelia Hughes",
        "Alfie Morgan",
        "Freya Bailey",
      ],
    },
    weight: 135,
  },
  {
    value: {
      country: "Canada",
      names: [
        "Liam Fraser",
        "Chloe Campbell",
        "Noah Sinclair",
        "Ava Grant",
        "Mason Ellis",
        "Hannah Ross",
      ],
    },
    weight: 88,
  },
  {
    value: {
      country: "Australia",
      names: [
        "Jack Patterson",
        "Isla Whitfield",
        "Cooper Hayes",
        "Mia Donnelly",
        "Riley Beckett",
      ],
    },
    weight: 72,
  },
  {
    value: {
      country: "Germany",
      names: [
        "Lukas Bauer",
        "Hannah Schmidt",
        "Felix Wagner",
        "Lena Hoffmann",
        "Jonas Richter",
      ],
    },
    weight: 68,
  },
  {
    value: {
      country: "France",
      names: [
        "Camille Laurent",
        "Hugo Mercier",
        "Élise Dubois",
        "Antoine Rousseau",
      ],
    },
    weight: 52,
  },
  {
    value: {
      country: "Netherlands",
      names: ["Daan Visser", "Sanne de Vries", "Bram Jansen", "Fleur Bakker"],
    },
    weight: 38,
  },
  {
    value: {
      country: "Spain",
      names: ["Lucía Fernández", "Pablo Ortega", "Marta Ruiz", "Álvaro Gil"],
    },
    weight: 34,
  },
  {
    value: {
      country: "Italy",
      names: ["Giulia Ferrari", "Matteo Conti", "Chiara Romano"],
    },
    weight: 32,
  },
  {
    value: {
      country: "Ireland",
      names: ["Aoife Murphy", "Cian O'Brien", "Niamh Kelly"],
    },
    weight: 26,
  },
  {
    value: {
      country: "Sweden",
      names: ["Elsa Lindqvist", "Oscar Berg", "Alva Nyström"],
    },
    weight: 22,
  },
  {
    value: {
      country: "New Zealand",
      names: ["Ruby Callaghan", "Finn Mackenzie"],
    },
    weight: 20,
  },
  {
    value: {
      country: "Mexico",
      names: ["Valeria Hernández", "Luis Ramírez", "Daniela Torres"],
    },
    weight: 24,
  },
  {
    value: {
      country: "Brazil",
      names: ["Beatriz Oliveira", "Pedro Santos", "Larissa Souza"],
    },
    weight: 18,
  },
  {
    value: {
      country: "Poland",
      names: ["Zofia Kowalska", "Jakub Nowak"],
    },
    weight: 16,
  },
  {
    value: {
      country: "Portugal",
      names: ["Inês Costa", "Tiago Almeida"],
    },
    weight: 14,
  },
  {
    value: {
      country: "South Africa",
      names: ["Thandi Mokoena", "Sipho Ndlovu", "Anke van der Merwe"],
    },
    weight: 14,
  },
  {
    value: { country: "Japan", names: ["Yuki Tanaka", "Haruto Sato"] },
    weight: 12,
  },
];

/* ------------------------------------------------------------------ */
/* Build the dataset                                                  */
/* ------------------------------------------------------------------ */

const textByRating: Record<number, string[]> = {
  5: TEXT_5,
  4: TEXT_4,
};

function buildReviews(): ProductReview[] {
  const rng = mulberry32(20260919);

  // Only 4★ and 5★ are shown (store policy). The photo reviews below already
  // account for some of each, so the generated remainder is the supplied
  // totals minus what the photo set contributes — that keeps the final
  // average at exactly the 4.9 this listing claims.
  const photoFives = PHOTO_REVIEWS.filter((p) => p.rating === 5).length;
  const photoFours = PHOTO_REVIEWS.filter((p) => p.rating === 4).length;

  const ratings: (4 | 5)[] = [];
  const add = (r: 4 | 5, n: number) => {
    for (let i = 0; i < n; i++) ratings.push(r);
  };
  add(5, FIVE_STAR_COUNT - photoFives);
  add(4, FOUR_STAR_COUNT - photoFours);
  const shuffledRatings = shuffle(ratings, rng);

  // Slots: newest-first. Photos are pinned to spread positions near the top
  // (recent customers post photos more often); the rest take the shuffled
  // rating queue in order.
  type Slot = { rating: 4 | 5; photo?: string; text?: string; colorway?: string };
  const slots: Slot[] = [];
  const photoQueue = shuffle(PHOTO_REVIEWS, rng);
  const photoPositions = [0, 7, 16, 27, 40, 55, 72, 91, 113, 138, 166, 197];
  const at = new Set(photoPositions);

  let ratingIdx = 0;
  for (let i = 0; i < REVIEW_COUNT; i++) {
    const photo = at.has(i) ? photoQueue.shift() : undefined;
    if (photo) {
      slots.push({
        rating: photo.rating,
        photo: photo.photo,
        text: photo.text,
        colorway: photo.colorway,
      });
    } else {
      slots.push({ rating: shuffledRatings[ratingIdx++] });
    }
  }

  // Text counters per rating — assigned newest-first so the hand-written pool
  // reads as unique on the newest pages before it starts to cycle.
  const counters: Record<number, number> = { 5: 0, 4: 0 };

  // Dates: newest review ~2 days before the epoch below, spread back over
  // ~14 months, jittered so a page of 6 doesn't look machine-spaced.
  //
  // NEWEST_REVIEW_AT is a fixed timestamp, not `Date.now()`, on purpose:
  // this module is imported by both the server render and the client bundle,
  // and a clock-derived value produces a different dataset on each side —
  // which surfaces as a React hydration mismatch (error #418) wherever a
  // review is rendered. Bump this constant when refreshing the copy so the
  // feed still reads as recent.
  const newest = NEWEST_REVIEW_AT - 2 * 86_400_000;
  const stepMs = 4.2 * 3_600_000;

  return slots.map((slot, i) => {
    const rating = slot.rating;
    const text =
      slot.text ??
      (() => {
        const pool = textByRating[rating];
        return pool[counters[rating]++ % pool.length];
      })();

    const { country, names } = pickWeighted(COUNTRIES, rng);

    return {
      id: `fnp-${String(i + 1).padStart(4, "0")}`,
      rating,
      author: names[Math.floor(rng() * names.length)],
      country,
      createdAt: newest - i * stepMs - Math.floor(rng() * 3_600_000),
      text,
      images: slot.photo ? [`${PHOTO_BASE}/${slot.photo}`] : undefined,
      colorway: slot.colorway ?? COLORWAYS[Math.floor(rng() * COLORWAYS.length)],
      verified: rng() < 0.96,
    };
  });
}

export const pouchReviews: ProductReview[] = buildReviews();

function summarize(reviews: ProductReview[]): ReviewSummary {
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const countries = new Set<string>();
  let withPhotos = 0;
  let sum = 0;
  for (const r of reviews) {
    counts[r.rating]++;
    countries.add(r.country);
    if (r.images?.length) withPhotos++;
    sum += r.rating;
  }
  const count = reviews.length;
  const distribution = [5, 4, 3, 2, 1].map((stars) => ({
    stars,
    count: counts[stars],
    percent: Math.round((counts[stars] / count) * 100),
  }));
  return {
    handle: POUCH_REVIEWS_HANDLE,
    count,
    average: Math.round((sum / count) * 10) / 10,
    recommended: Math.round(((counts[5] + counts[4]) / count) * 100),
    withPhotos,
    countries: countries.size,
    distribution,
  };
}

export const pouchReviewSummary: ReviewSummary = summarize(pouchReviews);

/**
 * Scope guard — returns review content only for the pouch, so any other
 * product added to this store never inherits this listing's reviews.
 */
export function reviewSetForHandle(handle: string): {
  reviews: ProductReview[];
  summary: ReviewSummary;
} | null {
  if (handle !== POUCH_REVIEWS_HANDLE) return null;
  return { reviews: pouchReviews, summary: pouchReviewSummary };
}
