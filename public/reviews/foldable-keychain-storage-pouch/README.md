# Customer review photos

Drop the real review images here as WebP, max ~1200px on the long edge, named:

    photo-01.webp
    photo-02.webp
    ...
    photo-12.webp

They are wired up in `data/reviews.ts` → `PHOTO_REVIEWS`. Each entry there
already has its filename, star rating, colourway and review text, so adding a
file is all that is needed — nothing else to change.

An entry whose file is missing simply renders without a photo; the page does
not break. Add or remove entries in `PHOTO_REVIEWS` to change how many photo
reviews appear (the 4★/5★ totals rebalance automatically so the average stays
at the stated 4.9).

These are served with `unoptimized` in `ProductReviews.tsx`, so they bypass
Vercel's paid image optimizer — pre-compress them before committing.
