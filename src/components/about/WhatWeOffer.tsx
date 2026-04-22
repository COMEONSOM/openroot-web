// =============================================================================
// src/components/about/WhatWeOffer.tsx
// SECTION 2 — WHAT WE OFFER (HORIZONTAL SNAP CAROUSEL)
// CONTAINS: OfferCardItem · ChevronLeft · ChevronRight (all local, not exported)
// DEPENDS ON: variants.ts · data.tsx · useCarousel.ts · types.ts
// EXPORTS: WhatWeOffer (default)
// REACT 19 COMPATIBLE — ref typing uses RefObject<HTMLDivElement | null>
// MOBILE: floating arrows hidden → replaced by bottom prev/next nav + counter
// =============================================================================
//
// ── RESPONSIVE MODE ──────────────────────────────────────────────────────────
//   ≤ 899 px  →  IMAGE-DRIVEN  (full-card themed image, no body text)
//   ≥ 900 px  →  TEXT-DRIVEN   (original tag / title / highlights / list layout)
//
// The breakpoint is controlled by the NARROW_BP constant below.
// Changing that single value shifts the switch-over point everywhere.
//
// Asset map (all in /assets/):
//   Software Solutions  →  SSLIGHT.png  (light)  /  SSDARK.png  (dark)
//   Openroot Classes    →  OCLIGHT.png  (light)  /  OCDARK.png  (dark)
// =============================================================================

import { memo, useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import styles from "../styles/AboutCompany.module.css";
import { fadeIn, fadeUp, EASE_SOFT, VP } from "../../motion/variants";
import { OFFER_CARDS as ORIGINAL_CARDS } from "../../data/aboutdata";
import { useCarousel, CAROUSEL_SPRING } from "../../motion/useCarousel";
import type { OfferCard, WithVars } from "../../types/types";

// Swap the position of the two cards so Software Solutions is first
const OFFER_CARDS = [...ORIGINAL_CARDS].reverse();

// -----------------------------------------------------------------------------
// Breakpoint constant — edit this one value to shift the image/text threshold
// -----------------------------------------------------------------------------
const NARROW_BP = 899; // px  ≤ this → image mode  |  > this → text mode

// =============================================================================
// THEME-AWARE IMAGE MAP
// Keys must match the `tag` field on each OfferCard exactly.
// =============================================================================
const CARD_IMAGES: Record<string, { light: string; dark: string }> = {
  "Software Solutions": {
    light: "/assets/SSLIGHT.png",
    dark:  "/assets/SSDARK.png",
  },
  "Openroot Classes": {
    light: "/assets/OCLIGHT.png",
    dark:  "/assets/OCDARK.png",
  },
};

// =============================================================================
// useIsDarkTheme
// Detects the active colour scheme via data-theme attr → class → system pref.
// Re-evaluates on MutationObserver + MediaQueryList change events.
// =============================================================================
function useIsDarkTheme(): boolean {
  const getIsDark = (): boolean => {
    const root = document.documentElement;
    const dataTheme = root.getAttribute("data-theme");
    if (dataTheme === "dark")  return true;
    if (dataTheme === "light") return false;
    if (root.classList.contains("dark"))  return true;
    if (root.classList.contains("light")) return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  };

  const [isDark, setIsDark] = useState<boolean>(getIsDark);

  useEffect(() => {
    const update = () => setIsDark(getIsDark());

    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, {
      attributes:      true,
      attributeFilter: ["class", "data-theme"],
    });

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    mq.addEventListener("change", update);

    return () => {
      observer.disconnect();
      mq.removeEventListener("change", update);
    };
  }, []);

  return isDark;
}

// =============================================================================
// useIsNarrow
// Returns true while window.innerWidth ≤ NARROW_BP.
// Uses ResizeObserver on <html> so it reacts to every viewport resize without
// the overhead of polling.  Falls back to an initial synchronous read so there
// is never a flash of the wrong layout on first render.
// =============================================================================
function useIsNarrow(): boolean {
  const [narrow, setNarrow] = useState<boolean>(
    () => typeof window !== "undefined" && window.innerWidth <= NARROW_BP,
  );

  useEffect(() => {
    const update = () => setNarrow(window.innerWidth <= NARROW_BP);

    // ResizeObserver fires on every layout-affecting resize (incl. orientation)
    const ro = new ResizeObserver(update);
    ro.observe(document.documentElement);

    // Belt-and-suspenders: also listen on window for older environments
    window.addEventListener("resize", update, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return narrow;
}

// =============================================================================
// ICON COMPONENTS — INLINE SVG CHEVRONS
// =============================================================================
function ChevronLeft() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ChevronRight() {
  return (
    <svg
      width="16" height="16" viewBox="0 0 24 24"
      fill="none" stroke="currentColor"
      strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

// =============================================================================
// OFFER CARD ITEM — SINGLE CAROUSEL SLIDE CONTENT
//
// isNarrow = true  (≤ 899 px) → IMAGE-DRIVEN layout (full-card themed image)
// isNarrow = false (≥ 900 px) → TEXT-DRIVEN  layout (original body + right panel)
// =============================================================================
interface OfferCardItemProps {
  card:     OfferCard;
  isActive: boolean;
  reduced:  boolean;
  isDark:   boolean;
  isNarrow: boolean; // ← drives layout switch
}

const OfferCardItem = memo(({ card, isActive, reduced, isDark, isNarrow }: OfferCardItemProps) => {
  const navigate = useNavigate();

  const handleCardClick = useCallback(() => {
    if (!isActive) return;
    window.scrollTo({ top: 0, behavior: "instant" });
    if (card.link.startsWith("http")) {
      window.location.href = card.link;
    } else {
      navigate(card.link);
    }
  }, [card.link, isActive, navigate]);

  // Resolve the theme-correct image for this card (used in narrow/image mode)
  const themedImage: string | undefined =
    CARD_IMAGES[card.tag]
      ? isDark
        ? CARD_IMAGES[card.tag].dark
        : CARD_IMAGES[card.tag].light
      : card.image;

  return (
    <motion.article
      className={`${styles.offerCard} card-glass ot-glass-shine`}
      animate={
        reduced ? {} : {
          scale:   isActive ? 1           : 0.94,
          opacity: isActive ? 1           : 0.48,
          filter:  isActive ? "blur(0px)" : "blur(1px)",
        }
      }
      transition={{ duration: 0.4, ease: EASE_SOFT }}
      style={{ "--_accent": card.accentVar, cursor: isActive ? "pointer" : "default" } as WithVars}
      tabIndex={isActive ? 0 : -1}
      onClick={isActive ? handleCardClick : undefined}
      onKeyDown={(e) => {
        if (isActive && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          handleCardClick();
        }
      }}
      role="button"
      aria-label={`Go to ${card.tag}`}
      whileHover={!reduced && isActive ? { y: -4 } : {}}
    >
      {/* TOP SHIMMER HAIRLINE */}
      <span className="ot-card-shimmer" aria-hidden="true" />

      {/* LEFT ACCENT STRIPE */}
      <div className={styles.offerStripe} aria-hidden="true" />

      {/* ── IMAGE-DRIVEN (≤ 899 px) ────────────────────────────────────────── */}
      {isNarrow && (
        <div
          className={styles.offerImageFull}
          aria-label={card.tag}
        >
          {themedImage ? (
            <img
              src={themedImage}
              alt={card.tag}
              style={{
                width:      "100%",
                height:     "100%",
                objectFit:  "cover",
                display:    "block",
                userSelect: "none",
              }}
              loading="eager"
              decoding="async"
              draggable={false}
            />
          ) : (
            <div className={styles.offerImagePlaceholder}>
              <span className={styles.offerImagePlaceholderIcon}>◈</span>
              <span className={styles.offerImagePlaceholderLabel}>{card.tag}</span>
            </div>
          )}
        </div>
      )}

      {/* ── TEXT-DRIVEN (≥ 900 px) ─────────────────────────────────────────── */}
      {!isNarrow && (
        <>
          <div className={styles.offerBody}>
            {/* CATEGORY BADGE */}
            <span className={`${styles.offerTag} badge-pill`}>{card.tag}</span>

            {/* CARD HEADLINE */}
            <h3 className={`${styles.offerTitle} section-title-left text-gradient`}>
              {card.title}
            </h3>

            <hr className="divider" />

            {/* HIGHLIGHT CHIPS */}
            <div className={styles.offerHighlights} aria-label="Key features">
              {card.highlights.map((h) => (
                <span key={h} className={styles.offerHighlightChip}>{h}</span>
              ))}
            </div>

            {/* INTRO PARAGRAPH */}
            <p className={`${styles.offerIntro} text-muted`}>{card.intro}</p>

            {/* SUBHEADING */}
            <p className={styles.offerSubheading}>
              <strong className="text-accent">{card.subheading}</strong>
            </p>

            {/* FEATURE BULLET LIST */}
            <ul className={`${styles.offerList} ot-feature-list`}>
              {card.items.map((item, i) => (
                <li key={i}><span>{item}</span></li>
              ))}
            </ul>

            {/* BOTTOM CALLOUT NOTE */}
            <p className={`${styles.offerNote} note-callout`}>{card.note}</p>
          </div>

          {/* RIGHT IMAGE PANEL (hidden on mobile via CSS) */}
          <div className={styles.offerImagePanel} aria-hidden="true">
            {card.image ? (
              <img
                src={card.image}
                alt=""
                className={styles.offerImageEl}
                loading="lazy"
                decoding="async"
                draggable={false}
              />
            ) : (
              <div className={styles.offerImagePlaceholder}>
                <span className={styles.offerImagePlaceholderIcon}>◈</span>
                <span className={styles.offerImagePlaceholderLabel}>{card.tag}</span>
              </div>
            )}
          </div>
        </>
      )}
    </motion.article>
  );
});
OfferCardItem.displayName = "OfferCardItem";


// =============================================================================
// WHAT WE OFFER SECTION
// =============================================================================
function WhatWeOffer() {
  const reduced  = useReducedMotion() ?? false;
  const isDark   = useIsDarkTheme();
  const isNarrow = useIsNarrow();      // ← true when ≤ 899 px

  const {
    current, cardWidth, trackX, viewportRef,
    go, onDragEnd, onKeyDown,
    isFirst, isLast, total,
  } = useCarousel(OFFER_CARDS.length);

  return (
    <motion.section
      className={`${styles.offersSection} ot-section ot-section--tight-top`}
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
      aria-label="What We Offer"
    >
      {/* SECTION HEADER */}
      <motion.div className={styles.offersHeader} variants={fadeUp}>
        <span className="eyebrow">What We Offer</span>
        <h2 className={`${styles.offersHeading} section-title text-gradient`}>
          Two Ways We Help You Grow
        </h2>
        <p className={`${styles.offersSubtext} text-muted`}>
          Whether you&apos;re building skills or building a business — Openroot
          has a focused offering for you.
        </p>
      </motion.div>

      {/* CAROUSEL REGION */}
      <motion.div
        className={styles.carouselOuter}
        variants={fadeUp}
        onKeyDown={onKeyDown}
        tabIndex={0}
        role="region"
        aria-label="Offer cards carousel"
        aria-roledescription="carousel"
      >
        {/* SCREEN READER LIVE REGION */}
        <span className="sr-only" aria-live="polite" aria-atomic="true">
          {`Slide ${current + 1} of ${total}: ${OFFER_CARDS[current].tag}`}
        </span>

        {/* VIEWPORT ROW */}
        <div className={styles.carouselRow}>

          {/* PREV — desktop capsule, hidden on mobile via CSS */}
          <motion.button
            className={`${styles.arrowBtn} ${styles.arrowBtnPrev}`}
            onClick={() => go(current - 1)}
            disabled={isFirst}
            aria-label="Previous offer"
            whileHover={!reduced && !isFirst ? { scale: 1.1 } : {}}
            whileTap={!reduced  && !isFirst ? { scale: 0.9 } : {}}
          >
            <ChevronLeft />
          </motion.button>

          {/* VIEWPORT */}
          <div className={styles.carouselViewport} ref={viewportRef}>
            <motion.div
              className={`${styles.carouselTrack} ${
                current === 0 && !reduced ? styles.carouselTrackHint : ""
              }`}
              animate={{ x: trackX }}
              transition={CAROUSEL_SPRING}
              drag={reduced ? false : "x"}
              dragConstraints={{ left: trackX, right: trackX }}
              dragElastic={0.08}
              onDragEnd={onDragEnd}
            >
              {OFFER_CARDS.map((card, i) => (
                <div
                  key={card.tag}
                  className={styles.carouselSlide}
                  style={cardWidth > 0 ? { width: cardWidth } : undefined}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`${i + 1} of ${total}: ${card.tag}`}
                >
                  <OfferCardItem
                    card={card}
                    isActive={i === current}
                    reduced={reduced}
                    isDark={isDark}
                    isNarrow={isNarrow}   // ← passed down
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* NEXT — desktop capsule, hidden on mobile via CSS */}
          <motion.button
            className={`${styles.arrowBtn} ${styles.arrowBtnNext}`}
            onClick={() => go(current + 1)}
            disabled={isLast}
            aria-label="Next offer"
            whileHover={!reduced && !isLast ? { scale: 1.1 } : {}}
            whileTap={!reduced  && !isLast ? { scale: 0.9 } : {}}
          >
            <ChevronRight />
          </motion.button>

        </div>

        {/* MOBILE BOTTOM NAV (hidden above 767px via CSS) */}
        <div className={styles.carouselBottomNav}>
          <button
            className={styles.carouselNavBtn}
            onClick={() => go(current - 1)}
            disabled={isFirst}
            aria-label="Previous offer"
          >
            <ChevronLeft /> Prev
          </button>

          <span className={styles.carouselCounter}>
            <span>{current + 1}</span> / {total}
          </span>

          <button
            className={styles.carouselNavBtn}
            onClick={() => go(current + 1)}
            disabled={isLast}
            aria-label="Next offer"
          >
            Next <ChevronRight />
          </button>
        </div>

        {/* DOT INDICATORS — hidden on mobile */}
        <div
          className={styles.carouselDots}
          role="tablist"
          aria-label="Slide indicators"
        >
          {OFFER_CARDS.map((card, i) => (
            <motion.button
              key={card.tag}
              role="tab"
              aria-selected={i === current}
              aria-label={`Go to ${card.tag}`}
              className={`${styles.dot} ${i === current ? styles.dotActive : ""}`}
              onClick={() => go(i)}
              whileHover={!reduced ? { scale: 1.3 } : {}}
              whileTap={!reduced  ? { scale: 0.8 } : {}}
            />
          ))}
        </div>

        {/* PROGRESS BAR */}
        <div className={styles.carouselProgress} aria-hidden="true">
          <motion.div
            className={styles.carouselProgressFill}
            animate={{ scaleX: (current + 1) / total }}
            style={{ transformOrigin: "left" }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          />
        </div>

      </motion.div>
    </motion.section>
  );
}

export default memo(WhatWeOffer);