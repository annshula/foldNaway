import type { Metadata } from "next";
import { notFound } from "next/navigation";

import BreadcrumbSchema from "@/components/BreadcrumbSchema";
import FaqSchema from "@/components/FaqSchema";
import ProductSchema from "@/components/ProductSchema";
import { ProductBenefitCards } from "@/components/product/ProductBenefitCards";
import { ProductDetails } from "@/components/product/ProductDetails";
import { ProductPurchase } from "@/components/product/ProductPurchase";
import ProductReviews from "@/components/product/ProductReviews";
import QualityTests from "@/components/product/QualityTests";
import ReviewSocialPosts from "@/components/product/ReviewSocialPosts";
import Faq from "@/components/sections/Faq";
import FinalCta from "@/components/sections/FinalCta";
import HowItWorks from "@/components/sections/HowItWorks";
import TrustBar from "@/components/sections/TrustBar";
import { quickAnswers } from "@/content/answers";
import { faq } from "@/content/copy";
import { reviewSetForHandle } from "@/data/reviews";
import { pathForHandle } from "@/lib/catalog";
import { getGoogleReviews } from "@/lib/google-reviews";
import { getProductByHandle, products } from "@/lib/product";
import { absoluteUrl } from "@/lib/seo";
import { site } from "@/lib/site";

export const revalidate = 3600;

/**
 * Every product in the synced catalog gets a page. Handles come from
 * data/product.json (whatever Shopify's currently are), not hardcoded slugs —
 * a rename upstream plus a re-sync changes the route, with nothing else to
 * keep in step.
 */
export function generateStaticParams() {
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  const { handle } = await params;
  const product = getProductByHandle(handle);
  if (!product) {
    return {
      title: "Product not found",
      robots: { index: false, follow: false },
    };
  }
  const path = pathForHandle(product.handle);
  const description =
    `${product.subtitle || site.description} ${site.promise.shipping}.`.trim();
  const cover = product.gallery[0];

  return {
    title: product.title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      url: absoluteUrl(path),
      title: product.title,
      description,
      images: cover
        ? [{ url: cover.src, width: cover.width, height: cover.height }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.title,
      description,
      images: cover ? [cover.src] : undefined,
    },
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = getProductByHandle(handle);
  if (!product) notFound();

  // Scoped to this listing — another product added later never inherits
  // these reviews (see data/reviews.ts).
  const reviewSet = reviewSetForHandle(handle);
  const rating = reviewSet
    ? { average: reviewSet.summary.average, count: reviewSet.summary.count }
    : undefined;

  // The customer-photo subset, which the "Customer posts" wall re-presents as
  // the Facebook / Instagram posts and messages those photos arrived as. Same
  // records the review feed paginates — one dataset, so the wall can't invent
  // a review the feed doesn't have.
  const photoReviews = reviewSet?.reviews.filter((r) => r.images?.length) ?? [];

  // Google's own reviews, read here on the server so the visitor's browser
  // never talks to api.featurable.com (see lib/google-reviews.ts). Fetched in
  // parallel with nothing else to wait on, and `null` on any failure — the
  // section then renders its social cards without the Google rating rather
  // than losing the section or the page.
  const googleReviews = await getGoogleReviews();

  return (
    <main>
      <ProductPurchase product={product} rating={rating} />
      <TrustBar />
      {photoReviews.length > 0 && (
        <ReviewSocialPosts reviews={photoReviews} google={googleReviews} />
      )}
      <ProductBenefitCards />
      <ProductDetails product={product} />
      <QualityTests />
      <HowItWorks />
      {reviewSet && (
        <ProductReviews
          reviews={reviewSet.reviews}
          summary={reviewSet.summary}
        />
      )}
      <Faq items={[...quickAnswers, ...faq]} />
      <FinalCta />
      <ProductSchema product={product} rating={rating} />
      {/* Mirrors the Questions section rendered above — every answer
          marked up here is visible on this page. */}
      <FaqSchema
        id={`${absoluteUrl(pathForHandle(product.handle))}/#faq`}
        items={[...quickAnswers, ...faq]}
      />
      <BreadcrumbSchema
        items={[
          { name: "Home", path: "/" },
          { name: "Shop", path: "/shop" },
          { name: product.title, path: pathForHandle(product.handle) },
        ]}
      />
    </main>
  );
}
