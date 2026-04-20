// ============================================================
// BANNER COMPONENT — PRODUCTION-READY -- VERSION 1.2.0
// - 24:9 CINEMATIC CONTAINER + 16:9 SAFE CENTER FRAME
// - NO CROPPING, NO STRETCHING OF ORIGINAL BANNERS
// - DECORATIVE BACKGROUND LAYER
// - ES2023+ FEATURES
// - ACCESSIBILITY + KEYBOARD SUPPORT
// - OPTIMIZED TIMERS + REDUCED-MOTION SUPPORT
// ============================================================

import React, { useCallback, useEffect, useRef, useState } from "react";
import banner1 from "../../assets-oc/banner_openroot_classes_1.avif";
import banner2 from "../../assets-oc/banner_openroot_classes_2.avif";
import banner3 from "../../assets-oc/banner_openroot_classes_3.avif";
import banner4 from "../../assets-oc/banner_openroot_classes_4.avif";
import "../openrootClasses/OCStyle/OCBanner.css";

// ============================================================
// TYPES
// ============================================================

interface BannerSlide {
  id: string | number;
  image: string;
  alt?: string;
}

interface BannerProps {
  banners?: BannerSlide[];
  autoRotateMs?: number;
}

// ============================================================
// UTILITY: SLEEP
// ============================================================

const sleep = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

// ============================================================
// UTILITY: SAFE CLAMP INDEX
// ============================================================

const clampIndex = (index: number, length: number): number => {
  if (!length || length <= 0) return 0;
  return ((index % length) + length) % length;
};

// ============================================================
// DEFAULT BANNERS
// ============================================================

const DEFAULT_BANNERS: BannerSlide[] = [
  { id: 1, image: banner1, alt: "Banner 1" },
  { id: 2, image: banner2, alt: "Banner 2" },
  { id: 3, image: banner3, alt: "Banner 3" },
  { id: 4, image: banner4, alt: "Banner 4" },
];

// ============================================================
// COMPONENT
// ============================================================

export default function Banner({
  banners = DEFAULT_BANNERS,
  autoRotateMs = 10000,
}: BannerProps) {
  if (!Array.isArray(banners)) {
    throw new TypeError("BANNERS MUST BE AN ARRAY");
  }

  const slideCount = banners.length;

  if (slideCount === 0) {
    return (
      <section className="home-banner placeholder" aria-live="polite">
        <div className="banner-placeholder">NO BANNERS AVAILABLE</div>
      </section>
    );
  }

  // ============================================================
  // INTERNAL STATE
  // ============================================================

  const [current, setCurrent] = useState<number>(0);
  const [anim, setAnim] = useState<boolean>(true);
  const [hovered, setHovered] = useState<boolean>(false);

  const userInteractedAt = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const restartTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ============================================================
  // SWIPE STATE
  // ============================================================

  const pointerStartX = useRef<number | null>(null);
  const pointerLastX = useRef<number | null>(null);
  const SWIPE_THRESHOLD = 50;

  // ============================================================
  // REDUCED MOTION
  // ============================================================

  const prefersReducedMotion = useRef<boolean>(false);

  useEffect(() => {
    try {
      prefersReducedMotion.current = window.matchMedia
        ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
        : false;
    } catch {
      prefersReducedMotion.current = false;
    }
  }, []);

  // ============================================================
  // TIMER HELPERS
  // ============================================================

  const clearTimers = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
      restartTimeoutRef.current = null;
    }
  }, []);

  const startAutoRotate = useCallback(
    (delay: number = autoRotateMs) => {
      clearTimers();
      if (prefersReducedMotion.current) return;

      intervalRef.current = setInterval(() => {
        setCurrent((c) => clampIndex(c + 1, slideCount));
      }, delay);
    },
    [autoRotateMs, clearTimers, slideCount]
  );

  const pauseAfterInteraction = useCallback(() => {
    clearTimers();
    userInteractedAt.current = Date.now();
    restartTimeoutRef.current = setTimeout(() => {
      if (!hovered) startAutoRotate();
    }, 30000);
  }, [clearTimers, hovered, startAutoRotate]);

  useEffect(() => {
    startAutoRotate();
    return () => clearTimers();
  }, [startAutoRotate, clearTimers]);

  // ============================================================
  // NAVIGATION
  // ============================================================

  const goTo = useCallback(
    (targetIndex: number) => {
      const next = clampIndex(targetIndex, slideCount);
      setCurrent(next);
    },
    [slideCount]
  );

  const goNext = useCallback(() => goTo(current + 1), [goTo, current]);
  const goPrev = useCallback(() => goTo(current - 1), [goTo, current]);

  const handleDotClick = (idx: number): void => {
    goTo(idx);
    pauseAfterInteraction();
  };

  // ============================================================
  // POINTER HANDLERS
  // ============================================================

  const handlePointerDown = (
    e: React.PointerEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ): void => {
    const clientX =
      "clientX" in e
        ? e.clientX
        : (e as React.TouchEvent).touches?.[0]?.clientX ?? 0;
    pointerStartX.current = clientX;
    pointerLastX.current = clientX;
    pauseAfterInteraction();
  };

  const handlePointerMove = (
    e: React.PointerEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ): void => {
    const clientX =
      "clientX" in e
        ? e.clientX
        : (e as React.TouchEvent).touches?.[0]?.clientX ?? pointerLastX.current ?? 0;
    pointerLastX.current = clientX;
  };

  const handlePointerUp = async (): Promise<void> => {
    const start = pointerStartX.current ?? 0;
    const end = pointerLastX.current ?? start;
    const delta = start - end;

    if (Math.abs(delta) > SWIPE_THRESHOLD) {
      if (delta > 0) goNext();
      else goPrev();
    }

    pointerStartX.current = null;
    pointerLastX.current = null;
    await sleep(0);
  };

  // ============================================================
  // HOVER
  // ============================================================

  const onMouseEnter = (): void => {
    setHovered(true);
    clearTimers();
  };

  const onMouseLeave = (): void => {
    setHovered(false);
    const since = Date.now() - (userInteractedAt.current || 0);
    if (since < 30000) {
      const remaining = Math.max(0, 30000 - since);
      restartTimeoutRef.current = setTimeout(() => startAutoRotate(), remaining);
    } else {
      startAutoRotate();
    }
  };

  // ============================================================
  // KEYBOARD
  // ============================================================

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>): void => {
    if (e.key === "ArrowLeft") {
      goPrev();
      pauseAfterInteraction();
    } else if (e.key === "ArrowRight") {
      goNext();
      pauseAfterInteraction();
    }
  };

  useEffect(() => {
    setAnim(true);
  }, [current]);

  const translate = `translateX(-${current * 100}%)`;
  const transitionStyle =
    anim && !prefersReducedMotion.current
      ? "transform 0.5s ease-in-out"
      : "none";

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <section
      className="home-banner"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onKeyDown={onKeyDown}
      tabIndex={0}
      role="region"
      aria-roledescription="carousel"
      aria-label="Homepage banners"
    >
      {/* DECORATIVE BACKGROUND LAYER */}
      <div className="hero-bg" aria-hidden="true" />

      {/* CENTER 16:9 SAFE FRAME */}
      <div className="hero-center-frame">
        <div
          className="banner-container"
          style={{ transform: translate, transition: transitionStyle }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          onTouchStart={handlePointerDown}
          onTouchMove={handlePointerMove}
          onTouchEnd={handlePointerUp}
          aria-live="polite"
        >
          {banners.map(({ id, image, alt }, idx) => (
            <div
              key={`${id}-${idx}`}
              className="banner-slide"
              aria-hidden={current !== idx}
            >
              <img
                src={image}
                alt={alt ?? `Banner ${idx + 1}`}
                className="banner-image"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* NAVIGATION ARROWS */}
      <button
        className="arrow left-arrow"
        aria-label="Previous banner"
        onClick={() => {
          goPrev();
          pauseAfterInteraction();
        }}
      >
        ‹
      </button>

      <button
        className="arrow right-arrow"
        aria-label="Next banner"
        onClick={() => {
          goNext();
          pauseAfterInteraction();
        }}
      >
        ›
      </button>

      {/* DOTS */}
      <div
        className="dots-container"
        role="tablist"
        aria-label="Banner pagination"
      >
        {banners.map((_, idx) => (
          <button
            key={idx}
            role="tab"
            aria-selected={current === idx}
            className={`dot ${current === idx ? "active" : ""}`}
            onClick={() => handleDotClick(idx)}
            aria-label={`Go to slide ${idx + 1}`}
          />
        ))}
      </div>
    </section>
  );
}