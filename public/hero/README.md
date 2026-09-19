# Hero & lifestyle imagery — PLACEHOLDERS

`foldnaway-hero.jpg` and everything in `../lifestyle/` are currently the
product's own Shopify catalogue photos, used so the layout renders with real
content. They are **not** the lifestyle shots the design calls for.

Replace with true lifestyle photography (bag mid-fold, in-hand, packed into a
car, unfolded on a counter). Keep the same filenames and nothing else needs
to change:

    public/hero/foldnaway-hero.jpg        portrait 4:5, the hero
    public/lifestyle/unfolded-counter.jpg  landscape 5:4
    public/lifestyle/on-keys.jpg           portrait 4:5
    public/lifestyle/packed-car.jpg        portrait 4:5
    public/lifestyle/in-backpack.jpg       portrait 4:5
    public/lifestyle/on-stroller.jpg       portrait 4:5
    public/lifestyle/market-in-hand.jpg    wide, full-bleed band

These route through next/image, so a large source file is fine — it is
resized per breakpoint at build/request time.
