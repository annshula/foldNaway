"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import { useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";

/**
 * One auto-drifting card rail: a full-bleed horizontal list the reader can
 * also drag or flick by hand.
 *
 * Extracted so the customer-posts section can run two of these side by side in
 * opposite directions (`direction`) without two copies of the drift loop, the
 * drag maths and the edge state to keep in step.
 *
 * The rail carries no chrome of its own — no row label, no arrows. A label
 * above each row turned two feeds into two labelled widgets, and arrows on a
 * row that is already drifting read as controls for something the reader isn't
 * driving. The cards running past both edges are the whole affordance: what
 * says "this moves" and "this swipes" is a half card at the edge, plus the
 * drift itself. `label` therefore survives only as the rail's accessible name.
 *
 * A normal, natively scrollable `overflow-x-auto` list — not a CSS transform
 * marquee — because a transform loop can't be dragged or scrolled by hand.
 * Auto-drift is a rAF loop nudging `scrollLeft`, and at either end it turns
 * around rather than wrapping: nothing on the rail is duplicated, so there is
 * no second copy of every card to tab through, and a card under the cursor is
 * always the card that gets the click. (A seamless loop would need a second
 * copy of the cards, and with focusable review cards inside that costs either
 * duplicate tab stops or a clone nobody can click.)
 */

/** Drift speed, px/second. Slow enough to read a card as it goes past. */
const SPEED = 26;

/** px of travel before a press on the rail becomes a drag instead of a click. */
const DRAG_THRESHOLD = 5;

export default function CarouselRail({
  label,
  direction = 1,
  itemCount,
  children,
}: {
  /**
   * The rail's accessible name — not drawn anywhere, since the rows have no
   * heading. It is what tells a screen reader which of the two rows it is on
   * the way past; the section's own <h2> already says what the wall is.
   */
  label: string;
  /**
   * Which way the cards *travel*, not which way the scrollbar moves:
   *   `1`  cards travel right → left — scrollLeft grows, the row starts at its
   *        left end and reveals what comes next;
   *   `-1` cards travel left → right — scrollLeft shrinks, the row starts
   *        parked at its right end.
   * Two rows drifting opposite ways is the whole reason this is a component.
   */
  direction?: 1 | -1;
  /** Card count — restarts the drift and re-parks the row when the list
      changes size. */
  itemCount: number;
  /** The row's `<li>` cards. */
  children: ReactNode;
}) {
  const railRef = useRef<HTMLUListElement>(null);
  /** Held in refs, not state: pausing is per-frame input to the drift loop and
      must not re-render a rail of cards every time a cursor crosses it. */
  const pausedRef = useRef(false);
  const dirRef = useRef<1 | -1>(direction);
  const resumeTimer = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const reduceMotion = useReducedMotion();

  /** Park the row at the end it travels away from, so its first move has the
      whole rail ahead of it — a row drifting left→right that started at 0
      would have nowhere to go and would turn around immediately. */
  useEffect(() => {
    const rail = railRef.current;
    if (!rail || itemCount === 0) return;
    rail.scrollLeft =
      direction === -1 ? rail.scrollWidth - rail.clientWidth : 0;
    dirRef.current = direction;
  }, [direction, itemCount]);

  const pause = useCallback(() => {
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    resumeTimer.current = null;
    pausedRef.current = true;
  }, []);

  /** Pause, then pick the drift back up on its own. Used after a drag, a
      wheel or the pointer leaving, where holding the pause forever would
      leave the row parked. */
  const pauseThenResume = useCallback((ms: number) => {
    if (resumeTimer.current !== null) window.clearTimeout(resumeTimer.current);
    pausedRef.current = true;
    resumeTimer.current = window.setTimeout(() => {
      resumeTimer.current = null;
      pausedRef.current = false;
    }, ms);
  }, []);

  useEffect(
    () => () => {
      if (resumeTimer.current !== null)
        window.clearTimeout(resumeTimer.current);
    },
    [],
  );

  useEffect(() => {
    const rail = railRef.current;
    if (reduceMotion || !rail || itemCount === 0) return;

    let frame = 0;
    let last: number | null = null;
    /** Off-screen rails don't need to move — and an idle rAF loop writing to a
        scroll container is exactly the kind of thing that shows up in a long
        task trace on a low-end phone. */
    let onScreen = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
      },
      { rootMargin: "240px" },
    );
    observer.observe(rail);

    const tick = (nowMs: number) => {
      frame = requestAnimationFrame(tick);
      const elapsed = last === null ? 16 : Math.min(nowMs - last, 64);
      last = nowMs;
      if (pausedRef.current || !onScreen || document.hidden) return;

      const max = rail.scrollWidth - rail.clientWidth;
      if (max <= 8) return;

      let next = rail.scrollLeft + dirRef.current * SPEED * (elapsed / 1000);
      if (next >= max) {
        next = max;
        dirRef.current = -1;
      } else if (next <= 0) {
        next = 0;
        dirRef.current = 1;
      }
      rail.scrollLeft = next;
    };

    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [itemCount, reduceMotion]);

  /**
   * Mouse drag. Touch and trackpad already pan an `overflow-x-auto` list
   * natively, so this only handles a mouse press; letting touches through to the
   * browser keeps momentum and rubber-banding.
   *
   * The pointer capture is taken on movement, never on `pointerdown`: capturing
   * on the way down retargets the click that follows to this <ul> — a captured
   * pointer's events belong to the capture element, click included — which
   * would silently swallow every review card's "read the full review" click. A
   * few pixels of travel now decides it: under the threshold the card gets its
   * click, over it the rail gets the drag.
   */
  const dragRef = useRef<{
    id: number;
    x: number;
    left: number;
    moved: boolean;
  } | null>(null);

  const onPointerDown = (e: ReactPointerEvent<HTMLUListElement>) => {
    const rail = railRef.current;
    if (!rail || e.pointerType !== "mouse" || e.button !== 0) return;
    dragRef.current = {
      id: e.pointerId,
      x: e.clientX,
      left: rail.scrollLeft,
      moved: false,
    };
  };

  const onPointerMove = (e: ReactPointerEvent<HTMLUListElement>) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag || drag.id !== e.pointerId) return;

    const dx = e.clientX - drag.x;
    if (!drag.moved) {
      if (Math.abs(dx) < DRAG_THRESHOLD) return;
      drag.moved = true;
      rail.setPointerCapture(e.pointerId);
      setDragging(true);
      pause();
    }

    rail.scrollLeft = drag.left - dx;
  };

  const endDrag = (e: ReactPointerEvent<HTMLUListElement>) => {
    const rail = railRef.current;
    const drag = dragRef.current;
    if (!rail || !drag || drag.id !== e.pointerId) return;
    dragRef.current = null;
    if (!drag.moved) return;
    if (rail.hasPointerCapture(e.pointerId))
      rail.releasePointerCapture(e.pointerId);
    setDragging(false);
    pauseThenResume(1600);
  };

  return (
    /* Full-bleed rail: the cards run past both edges of the viewport, which is
       what makes it read as a feed rather than a component. */
    <div className="relative">
      <ul
        ref={railRef}
        aria-label={label}
        className={cn(
          "scrollbar-none flex cursor-grab gap-4 overflow-x-auto overscroll-x-contain px-5 pb-2 select-none sm:px-8",
          dragging && "cursor-grabbing",
        )}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        /* Every card is a photo, and a photo is natively draggable: without
           this the browser starts its own drag-and-drop the moment a mouse
           drag begins, which fires pointercancel and kills the drag-scroll a
           pixel or two in. */
        onDragStart={(e) => e.preventDefault()}
        onPointerEnter={pause}
        onPointerLeave={() => {
          if (!dragRef.current) pauseThenResume(400);
        }}
        onWheel={() => pauseThenResume(1600)}
        onFocus={pause}
        onBlur={() => pauseThenResume(400)}
      >
        {children}
      </ul>

      {/* The edge fades are the only chrome left, and they do the job the
          removed label and arrows used to: they say the row continues. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 w-4 bg-linear-to-r from-cream to-transparent sm:w-10"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 w-4 bg-linear-to-l from-cream to-transparent sm:w-10"
      />
    </div>
  );
}
