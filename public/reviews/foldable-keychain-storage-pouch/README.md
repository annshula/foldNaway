# Customer review photos

Currently on disk: `photo-01.webp`, `photo-04.webp`, `photo-07.webp`,
`photo-12.webp` — 4 real photos. `data/reviews.ts` → `PHOTO_REVIEWS` is kept
in sync with exactly these 4; don't add an entry there until its file is
actually here.

Drop new review images here as WebP, max ~1200px on the long edge, named the
next free `photo-NN.webp`, then add a matching entry to `PHOTO_REVIEWS` with
its filename, star rating, colourway and review text — and add one more
position to `photoPositions` in the same file's `buildReviews()` so it
appears (see that array's own comment).

Add or remove entries in `PHOTO_REVIEWS` (and keep `photoPositions` the same
length) to change how many photo reviews appear — the 4★/5★ totals rebalance
automatically so the average stays at the stated 4.9.

These are served with `unoptimized` in `ProductReviews.tsx`, so they bypass
Vercel's paid image optimizer — pre-compress them before committing.
