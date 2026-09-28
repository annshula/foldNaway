"use client";

import { useEffect, useRef } from "react";

import CarouselRail from "@/components/product/CarouselRail";
import { SectionHeading } from "@/components/ui/Section";
import { customerVideoList, customerVideos } from "@/content/customer-videos";

/**
 * "Customer videos" — replaces the old ReviewSocialPosts "Customer posts"
 * wall (Facebook/Instagram-post mockups). Same auto-drifting horizontal rail
 * (CarouselRail) the photo wall used, now carrying real customer video clips
 * instead of screenshot-style photo cards.
 *
 * Every clip autoplays muted + looped as soon as it's mounted, with no sound
 * and no unmute control — browsers allow muted autoplay without a user
 * gesture, unlike sound-on playback, so this needs no click-to-play step the
 * way ProductGallery's single hero video does. A silent scrolling wall
 * (several clips potentially in view/near-view at once) never plays audio
 * from multiple sources at the same time, so muted-only is the deliberate
 * choice here, not just the autoplay-permission default.
 */
const VIDEO_CARD = "h-88 w-64 shrink-0 sm:h-96 sm:w-72";

export default function CustomerVideos() {
  if (customerVideoList.length === 0) return null;

  return (
    <section
      id="customer-videos"
      aria-label="Customer videos"
      className="relative bg-cream"
    >
      <div className="mx-auto w-full max-w-310 px-5 pt-20 sm:px-8 lg:pt-28">
        <SectionHeading
          align="center"
          eyebrow={customerVideos.eyebrow}
          title={customerVideos.title}
          body={customerVideos.body}
        />
      </div>

      <div className="mt-12">
        <CarouselRail
          label={customerVideos.rowLabel}
          direction={1}
          itemCount={customerVideoList.length}
        >
          {customerVideoList.map((video) => (
            <li key={video.src} className={VIDEO_CARD}>
              <VideoCard video={video} />
            </li>
          ))}
        </CarouselRail>
      </div>

      <div className="pt-10 pb-20 lg:pb-28" />
    </section>
  );
}

function VideoCard({ video }: { video: { src: string; poster?: string } }) {
  const ref = useRef<HTMLVideoElement>(null);

  // Play as soon as the card is actually visible, not just mounted — the
  // rail renders every card up front (CarouselRail has no virtualization),
  // so an unconditional autoplay would start every clip's decode/network
  // load at once. Matches the rail's own on/off-screen gate for the drift
  // loop (see CarouselRail's IntersectionObserver).
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
        } else {
          el.pause();
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative h-full w-full overflow-hidden rounded-card border border-sand/70 bg-cream-deep shadow-e1">
      <video
        ref={ref}
        src={video.src}
        poster={video.poster}
        muted
        loop
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
      />
    </div>
  );
}
