# Graph Report - .  (2026-09-21)

## Corpus Check
- 187 files · ~246,682 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 847 nodes · 2031 edges · 65 communities (37 shown, 28 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 14 edges (avg confidence: 0.64)
- Token cost: 46,356 input · 3,415 output

## Community Hubs (Navigation)
- Marketing Landing Sections
- Order Returns & Status
- Package Dependencies
- Reviews & LLM Text Feeds
- Localization & Shipping Estimate
- TypeScript Config
- Root Layout & Analytics Scripts
- Shopify Product Sync Types
- Shopify Cart & Storefront API
- Shopify Admin Auth & Newsletter
- Contact & Footer
- Customer Account OAuth Flow
- Product & Shop Pages SEO
- Cart Drawer & Buy Box
- Account Dashboard Pages
- Catalog & Cart Line Mapping
- Product Gallery & UI Image
- Product Sync Script
- Account Nav & Site Nav
- Cart & Localization Providers
- Account Auth Guard
- Order-Paid Webhook & Ad Pixels
- Catalog Variant Pricing
- Admin Revalidate & Cache Tags
- Currency Selector & Scroll Lock
- Analytics Tracking Events
- Catalog Blob Storage
- Product Webhook Sync
- Webhook Registration Script
- Product Reviews Display
- Button & Icon Primitives
- Account Logout
- Encrypted Session Cookies
- Profile Update Form
- Reviews Data File
- Misc Root Files
- OpenGraph Image
- Global CSS Types
- Next Config
- PostCSS Config
- Hero Image Assets
- Apple Icon
- App Icon
- Benefit Image: Roomy
- Benefit Image: Designer Look
- Benefit Image: Capacity
- Benefit Image: Everyday Carry
- Benefit Image: Gift Premium
- Brand Logo White
- Hero Image JPG
- Hero Mobile WebP
- Hero Image WebP
- App Icon 192
- App Icon 512
- Lifestyle: In Backpack
- Lifestyle: Market In Hand
- Lifestyle: On Keys
- Lifestyle: On Stroller
- Lifestyle: Packed Car
- Lifestyle: Unfolded Counter
- Product Compare 1 JPG
- Product Compare 1 WebP
- Product Compare 2 JPG
- Product Compare 2 WebP

## God Nodes (most connected - your core abstractions)
1. `cn()` - 46 edges
2. `Icon()` - 40 edges
3. `Site` - 31 edges
4. `shopifyConfig` - 22 edges
5. `SectionHeading()` - 20 edges
6. `Section()` - 19 edges
7. `requireCustomer()` - 19 edges
8. `syncAllProducts()` - 19 edges
9. `formatMoney()` - 17 edges
10. `Stagger()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `OpenGraph Social Preview` --semantically_similar_to--> `Brand Logo Dark`  [INFERRED] [semantically similar]
  app/opengraph-image.jpg → public/brand/logo-dark.png
- `Customer Review Photos README` --references--> `ProductReviews Component`  [EXTRACTED]
  public/reviews/foldable-keychain-storage-pouch/README.md → ProductReviews.tsx
- `ProductReviews Component` --references--> `Customer Review Photo 01`  [INFERRED]
  ProductReviews.tsx → public/reviews/foldable-keychain-storage-pouch/photo-01.webp
- `CurrencyList()` --calls--> `cn()`  [EXTRACTED]
  components/localization/CurrencySelector.tsx → lib/utils.ts
- `storefrontRequest()` --indirect_call--> `storefrontEndpoint()`  [INFERRED]
  scripts/sync-product.mjs → lib/shopify/config.ts

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Brand Identity Assets** — app_icon, public_brand_logo_dark, public_brand_logo_white, app_apple_icon [EXTRACTED 0.90]
- **Product Benefit Visuals** — public_benefits_built_for_outdoors, public_benefits_deceptively_roomy, public_benefits_engineered_capacity, public_benefits_gift_premium [EXTRACTED 0.95]

## Communities (65 total, 28 thin omitted)

### Community 0 - "Marketing Landing Sections"
Cohesion: 0.07
Nodes (49): logistics, metadata, principles, metadata, metadata, asCompareSlides(), CompareSide, ICONS (+41 more)

### Community 1 - "Order Returns & Status"
Cohesion: 0.05
Nodes (73): allowedReasons, requestReturnAction(), ReturnSelection, ReturnState, metadata, OrderDetailPage(), PageProps, metadata (+65 more)

### Community 2 - "Package Dependencies"
Cohesion: 0.04
Nodes (48): @microsoft/clarity, motion, next, dependencies, @microsoft/clarity, motion, next, react (+40 more)

### Community 3 - "Reviews & LLM Text Feeds"
Cohesion: 0.08
Nodes (31): GET(), GET(), GET(), FEATURED, maskName(), maskWord(), Testimonials(), quality (+23 more)

### Community 4 - "Localization & Shipping Estimate"
Cohesion: 0.10
Nodes (28): currencyFor(), GET(), regionNames, SYMBOL_OVERRIDES, toLocalizationCountry(), POST(), POST(), DeliveryPincodeCheck() (+20 more)

### Community 5 - "TypeScript Config"
Cohesion: 0.07
Nodes (29): dom, dom.iterable, esnext, next-env.d.ts, .next/types/**/*.ts, node_modules, reference, reference2 (+21 more)

### Community 6 - "Root Layout & Analytics Scripts"
Cohesion: 0.09
Nodes (20): figtree, fraunces, inter, kumbhSans, metadata, plexMono, plusJakarta, NOTE: no `block` utility here — it would override (+12 more)

### Community 7 - "Shopify Product Sync Types"
Cohesion: 0.09
Nodes (25): sanitizeProductHtml(), discoverCuratedMarketCountries(), FeatureHighlightNode, ImageNode, MarketPrice, MediaNode, MetaobjectImageField, MetaobjectVideoField (+17 more)

### Community 8 - "Shopify Cart & Storefront API"
Cohesion: 0.16
Nodes (21): CartLine, POST(), getVariantById(), isStorefrontConfigured(), storefrontEndpoint(), getLocalization(), getLocalizedVariantPrices(), Localization (+13 more)

### Community 9 - "Shopify Admin Auth & Newsletter"
Cohesion: 0.16
Nodes (20): POST(), StagedTarget, uploadOne(), CustomerCreateResponse, isRateLimited(), POST(), signupAttempts, adminAuthSource (+12 more)

### Community 10 - "Contact & Footer"
Cohesion: 0.13
Nodes (11): channels, metadata, CATEGORIES, ContactForm(), NewsletterForm(), Status, groups, socials (+3 more)

### Community 11 - "Customer Account OAuth Flow"
Cohesion: 0.16
Nodes (18): ERROR_REDIRECTS, GET(), customerAccountAuthorizeUrl(), customerAccountTokenUrl(), base64Url(), beginOAuth(), buildAuthorizeUrl(), consumeOAuthTransaction() (+10 more)

### Community 12 - "Product & Shop Pages SEO"
Cohesion: 0.18
Nodes (15): FaqPage(), generateMetadata(), ProductPage(), metadata, ShopPage(), BreadcrumbSchema(), FaqSchema(), ProductBenefitCards() (+7 more)

### Community 13 - "Cart Drawer & Buy Box"
Cohesion: 0.25
Nodes (14): CartDrawer(), BuyBox(), ScrollToTop(), StickyAddToCart(), useCart(), formatMoney(), Product, shopifyCheckout() (+6 more)

### Community 14 - "Account Dashboard Pages"
Cohesion: 0.21
Nodes (15): AddressesPage(), metadata, metadata, OrdersPage(), PageProps, AccountOverviewPage(), metadata, metadata (+7 more)

### Community 15 - "Catalog & Cart Line Mapping"
Cohesion: 0.11
Nodes (14): CartCatalogLine, cartVariantIds, lineMap, localVariantById, CatalogImage, CatalogVideo, mapSyncedProducts(), MediaItem (+6 more)

### Community 16 - "Product Gallery & UI Image"
Cohesion: 0.18
Nodes (11): AccountNav(), CompareSlider(), Side, ProductGallery(), thumbSrc(), Image(), isShopifyHosted(), RatingStars() (+3 more)

### Community 17 - "Product Sync Script"
Cohesion: 0.18
Nodes (16): adminRequest(), cfg, __dirname, discoverCuratedMarketCountries(), env, getAdminToken(), main(), OUTPUT (+8 more)

### Community 18 - "Account Nav & Site Nav"
Cohesion: 0.21
Nodes (12): AccountLink, AccountMenu(), LINKS, items, NavItem, SignOutDialog(), SignOutLabel(), CartButton() (+4 more)

### Community 19 - "Cart & Localization Providers"
Cohesion: 0.19
Nodes (15): Action, CartContext, CartContextValue, CartLine, CartProvider(), reducer(), ResolvedLine, LocalizationContext (+7 more)

### Community 20 - "Account Auth Guard"
Cohesion: 0.25
Nodes (11): GET(), AccountLayout(), ERROR_MESSAGES, LoginPage(), metadata, PageProps, GET(), isCustomerAccountConfigured() (+3 more)

### Community 21 - "Order-Paid Webhook & Ad Pixels"
Cohesion: 0.23
Nodes (15): ack(), customerMatchData(), hashField(), hashPhone(), isOurLineItem(), POST(), productIdNums, sendGa4Purchase() (+7 more)

### Community 22 - "Catalog Variant Pricing"
Cohesion: 0.14
Nodes (12): defaultVariant(), foldnawayProductIds, foldnawayVariantIds, liveVariantFor(), mainSaleVariant, MarketPrice, productPriceCents, SyncedImage (+4 more)

### Community 23 - "Admin Revalidate & Cache Tags"
Cohesion: 0.33
Nodes (9): isStringArray(), POST(), POST(), isAuthorizedAdminRequest(), unauthorizedResponse(), CACHE_TAGS, purgePath(), purgeTag() (+1 more)

### Community 24 - "Currency Selector & Scroll Lock"
Cohesion: 0.21
Nodes (10): ItemStatusPanel(), currencyDisplayName(), CurrencyList(), CurrencySelector(), displayNames, Option, ReviewImageLightbox(), Nav() (+2 more)

### Community 25 - "Analytics Tracking Events"
Cohesion: 0.33
Nodes (12): ProductViewTracker(), NOTE: this store is single-currency (USD), so the amount passed in is the, AnalyticsItem, fbq(), gtag(), lineValue(), toGtagItems(), trackAddToCart() (+4 more)

### Community 26 - "Catalog Blob Storage"
Cohesion: 0.29
Nodes (12): acquireLock(), blobPathname(), CATALOG_PATH, DATA_DIR, ensureDataDir(), LOCK_PATH, LockHandle, readJsonFile() (+4 more)

### Community 27 - "Product Webhook Sync"
Cohesion: 0.33
Nodes (8): ack(), ALLOWED_PRODUCT_BRANDS, POST(), PRODUCT_TOPICS, syncProductFromWebhook(), isDuplicateWebhook(), seen, verifyWebhookSignature()

### Community 28 - "Webhook Registration Script"
Cohesion: 0.24
Nodes (9): adminRequest(), cfg, __dirname, env, getAdminToken(), main(), REQUIRED_TOPICS, ROOT (+1 more)

### Community 29 - "Product Reviews Display"
Cohesion: 0.29
Nodes (8): Filter, formatDate(), maskName(), maskWord(), pageWindow(), Pagination(), ProductReviews(), ReviewCard()

### Community 30 - "Button & Icon Primitives"
Cohesion: 0.22
Nodes (7): base, iconPos, pad, Variant, ArrowIcon(), paths, stroke

### Community 31 - "Account Logout"
Cohesion: 0.43
Nodes (6): GET(), POST(), customerAccountLogoutUrl(), env(), clearSession(), readSession()

### Community 32 - "Encrypted Session Cookies"
Cohesion: 0.50
Nodes (7): cookieOptions(), decryptJson(), encryptJson(), keyFrom(), readEncrypted(), secret(), writeEncrypted()

### Community 33 - "Profile Update Form"
Cohesion: 0.48
Nodes (5): ProfileState, updateProfileAction(), initialState, ProfileForm(), updateCustomer()

### Community 34 - "Reviews Data File"
Cohesion: 0.40
Nodes (6): ProductReviews Component, Customer Review Photo 01, Customer Review Photo 04, Customer Review Photo 07, Customer Review Photo 12, Customer Review Photos README

### Community 35 - "Misc Root Files"
Cohesion: 0.67
Nodes (3): Built for Outdoors Benefit Image, AI Usage & Crawling Policy, FoldNAway Project Configuration

## Knowledge Gaps
- **262 isolated node(s):** `metadata`, `principles`, `logistics`, `metadata`, `ERROR_REDIRECTS` (+257 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **28 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Icon()` connect `Account Nav & Site Nav` to `Marketing Landing Sections`, `Order Returns & Status`, `Profile Update Form`, `Reviews & LLM Text Feeds`, `Localization & Shipping Estimate`, `Contact & Footer`, `Product & Shop Pages SEO`, `Cart Drawer & Buy Box`, `Account Dashboard Pages`, `Product Gallery & UI Image`, `Account Auth Guard`, `Currency Selector & Scroll Lock`, `Product Reviews Display`, `Button & Icon Primitives`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Why does `Site` connect `Contact & Footer` to `Marketing Landing Sections`, `Order Returns & Status`, `Reviews & LLM Text Feeds`, `Root Layout & Analytics Scripts`, `Product & Shop Pages SEO`, `Cart Drawer & Buy Box`, `Account Dashboard Pages`, `Catalog & Cart Line Mapping`, `Account Nav & Site Nav`, `Account Auth Guard`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `cn()` connect `Product Gallery & UI Image` to `Order Returns & Status`, `Profile Update Form`, `Cart Drawer & Buy Box`, `Account Dashboard Pages`, `Account Nav & Site Nav`, `Currency Selector & Scroll Lock`, `Product Reviews Display`?**
  _High betweenness centrality (0.032) - this node is a cross-community bridge._
- **What connects `metadata`, `principles`, `logistics` to the rest of the system?**
  _262 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Marketing Landing Sections` be split into smaller, more focused modules?**
  _Cohesion score 0.06562819203268641 - nodes in this community are weakly interconnected._
- **Should `Order Returns & Status` be split into smaller, more focused modules?**
  _Cohesion score 0.05426356589147287 - nodes in this community are weakly interconnected._
- **Should `Package Dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.04081632653061224 - nodes in this community are weakly interconnected._