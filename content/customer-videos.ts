/**
 * Copy + source list for the "Customer videos" wall on the product page
 * (components/product/CustomerVideos.tsx) — replaces the old
 * ReviewSocialPosts "Customer posts" wall (Facebook/Instagram-post mockups
 * built from customer photos). This section shows real customer video clips
 * instead, in the same auto-drifting horizontal rail (CarouselRail).
 *
 * Files live in public/videos/ — add a path here and it appears in the rail,
 * no other code change needed. The section renders nothing when this list is
 * empty (same "no data, no section" rule as ReviewSocialPosts had).
 */

export const customerVideos = {
  eyebrow: "Customer videos",
  title: "See it in their hands.",
  body: "Real clips from customers who bought one — unfolding it, loading it up, clipping it back on.",
  /** The rail's accessible name (see CarouselRail's own doc comment on why
      this is the row's label, not a visible heading). */
  rowLabel: "Customer videos",
} as const;

export type CustomerVideo = {
  /** Path under public/, e.g. "/videos/video_1.mp4". */
  src: string;
  /** Poster frame shown before playback starts — optional; the browser's own
      first-frame grab is used when this is omitted. */
  poster?: string;
};

export const customerVideoList: CustomerVideo[] = [
  { src: "/videos/video_1.mp4" },
  { src: "/videos/video_2.mp4" },
  { src: "/videos/video_3.mp4" },
  { src: "/videos/video_4.mp4" },
  { src: "/videos/video_5.mp4" },
  { src: "/videos/video_6.mp4" },
];
