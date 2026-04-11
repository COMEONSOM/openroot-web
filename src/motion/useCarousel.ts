// =============================================================================
// src/components/motion/useCarousel.ts
// CUSTOM HOOK — CAROUSEL STATE, RESPONSIVE LAYOUT, DRAG + KEYBOARD NAVIGATION
// USED BY: WhatWeOffer.tsx ONLY
//
// REACT 19 FIX:
//   React 18: useRef<T>(null)  → returns RefObject<T>
//   React 19: useRef<T>(null)  → returns RefObject<T | null>
//   FIX:      Declare viewportRef as useRef<HTMLDivElement | null>(null)
//             and type the interface as RefObject<HTMLDivElement | null>
// =============================================================================

import {
  useState,
  useRef,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import type { RefObject, KeyboardEvent } from "react";
import type { PanInfo } from "framer-motion";

// CARD_GAP:        PX SPACE BETWEEN ADJACENT SLIDES
// CARD_PEEK_MAX:   MAX PX TO REVEAL THE NEXT CARD'S EDGE
// CARD_PEEK_RATIO: FRACTION OF VIEWPORT WIDTH USED AS PEEK ON NARROW SCREENS
// SWIPE_THRESHOLD: MIN GESTURE POWER NEEDED TO ADVANCE/RETREAT A SLIDE
const CARD_GAP        = 16;
const CARD_PEEK_MAX   = 60;
const CARD_PEEK_RATIO = 0.055;
const SWIPE_THRESHOLD = 50;

// SPRING PHYSICS — SNAPPY RESPONSE WITHOUT EXCESSIVE BOUNCE
export const CAROUSEL_SPRING = {
  type:      "spring" as const,
  stiffness: 300,
  damping:   30,
  mass:      0.9,
} as const;

// EXPLICIT RETURN TYPE — FULL IDE AUTOCOMPLETE IN CONSUMING COMPONENTS
// REACT 19 FIX: viewportRef IS RefObject<HTMLDivElement | null>
export interface UseCarouselReturn {
  current:     number;
  cardWidth:   number;
  trackX:      number;
  viewportRef: RefObject<HTMLDivElement | null>; // ← REACT 19 FIX
  go:          (idx: number) => void;
  onDragEnd:   (_: unknown, info: PanInfo) => void;
  onKeyDown:   (e: KeyboardEvent<HTMLElement>) => void;
  isFirst:     boolean;
  isLast:      boolean;
  total:       number;
}

export function useCarousel(count: number): UseCarouselReturn {
  const [current,   setCurrent]   = useState(0);
  const [cardWidth, setCardWidth] = useState(0);

  // REACT 19: useRef<HTMLDivElement | null>(null) — T | null IS NOW REQUIRED
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // MEASURE CARD WIDTH — CALLED ON MOUNT AND ON EVERY CONTAINER RESIZE
  const updateCardWidth = useCallback(() => {
    // NULL GUARD — .current IS null BEFORE THE DIV MOUNTS (REACT 19 BEHAVIOR)
    if (!viewportRef.current) return;
    const vw   = viewportRef.current.offsetWidth;
    const peek = count > 1 ? Math.min(CARD_PEEK_MAX, vw * CARD_PEEK_RATIO) : 0;
    setCardWidth(Math.max(0, vw - peek));
  }, [count]);

  // RESIZE OBSERVER — RECALCULATES ON CONTAINER RESIZE OR ORIENTATION CHANGE
  // DISCONNECTS ON UNMOUNT TO PREVENT MEMORY LEAKS
  useEffect(() => {
    updateCardWidth();
    const ro = new ResizeObserver(updateCardWidth);
    const el = viewportRef.current;
    if (el) ro.observe(el); // GUARD: ONLY OBSERVE IF REF IS MOUNTED
    return () => ro.disconnect();
  }, [updateCardWidth]);

  // GO — CLAMPS INDEX TO [0, count-1] BEFORE SETTING STATE
  const go = useCallback(
    (idx: number) => setCurrent(Math.max(0, Math.min(count - 1, idx))),
    [count],
  );

  // TRACK X — NEGATIVE TRANSLATE VALUE FOR THE SLIDING TRACK
  const trackX = useMemo(
    () => (cardWidth > 0 ? -current * (cardWidth + CARD_GAP) : 0),
    [current, cardWidth],
  );

  // DRAG END — 65% OFFSET + 35% VELOCITY WEIGHTING FOR NATURAL SWIPE FEEL
  const onDragEnd = useCallback(
    (_: unknown, { offset, velocity }: PanInfo) => {
      const power = offset.x * 0.65 + velocity.x * 0.35;
      setCurrent(c => {
        if (power < -SWIPE_THRESHOLD) return Math.min(count - 1, c + 1);
        if (power > SWIPE_THRESHOLD)  return Math.max(0, c - 1);
        return c; // BELOW THRESHOLD — SNAP BACK TO CURRENT SLIDE
      });
    },
    [count],
  );

  // KEYBOARD — ArrowLeft/Right + Home/End FOR FULL ACCESSIBILITY
  const onKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      const map: Partial<Record<string, (c: number) => number>> = {
        ArrowLeft:  c => Math.max(0, c - 1),
        ArrowRight: c => Math.min(count - 1, c + 1),
        Home:       () => 0,
        End:        () => count - 1,
      };
      const fn = map[e.key];
      if (fn) { e.preventDefault(); setCurrent(fn); }
    },
    [count],
  );

  return {
    current, cardWidth, trackX, viewportRef,
    go, onDragEnd, onKeyDown,
    isFirst: current === 0,
    isLast:  current === count - 1,
    total:   count,
  };
}