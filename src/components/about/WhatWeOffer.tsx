// =============================================================================
// src/components/about/WhatWeOffer.tsx
// SECTION 2 — WHAT WE OFFER (HORIZONTAL SNAP CAROUSEL)
// CONTAINS: OfferCardItem · ChevronLeft · ChevronRight (all local, not exported)
// DEPENDS ON: variants.ts · data.tsx · useCarousel.ts · types.ts
// EXPORTS: WhatWeOffer (default)
// REACT 19 COMPATIBLE — ref typing uses RefObject<HTMLDivElement | null>
// MOBILE: floating arrows hidden → replaced by bottom prev/next nav + counter
// =============================================================================

import { memo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "../styles/AboutCompany.module.css";
import { fadeIn, fadeUp, EASE_SOFT, VP } from "../../motion/variants";
import { OFFER_CARDS } from "../../data/aboutdata";
import { useCarousel, CAROUSEL_SPRING } from "../../motion/useCarousel";
import type { OfferCard, WithVars } from "../../types/types";


// =============================================================================
// ICON COMPONENTS — INLINE SVG CHEVRONS FOR CAROUSEL ARROW BUTTONS
// aria-hidden="true" ON ALL — PARENT BUTTON CARRIES THE aria-label
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
// isActive:    CONTROLS SCALE / OPACITY / BLUR ON INACTIVE ADJACENT SLIDES
// reduced:     DISABLES ALL MOTION WHEN prefers-reduced-motion IS ACTIVE
// "--_accent"  CUSTOM PROPERTY DRIVES THE LEFT STRIPE COLOR VIA CSS MODULE
// tabIndex=-1  REMOVES INACTIVE CARDS FROM TAB ORDER
// =============================================================================
interface OfferCardItemProps {
  card:     OfferCard;
  isActive: boolean;
  reduced:  boolean;
}

const OfferCardItem = memo(({ card, isActive, reduced }: OfferCardItemProps) => (
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
    style={{ "--_accent": card.accentVar } as WithVars}
    tabIndex={isActive ? undefined : -1}
  >
    {/* TOP SHIMMER HAIRLINE — PURELY DECORATIVE */}
    <span className="ot-card-shimmer" aria-hidden="true" />

    {/* LEFT ACCENT STRIPE — COLOR DRIVEN BY "--_accent" CSS CUSTOM PROPERTY */}
    <div className={styles.offerStripe} aria-hidden="true" />

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

      {/* SUBHEADING ABOVE BULLET LIST */}
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

    {/* RIGHT IMAGE PANEL — hidden on mobile via CSS, visible ≥768px */}
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

  </motion.article>
));
OfferCardItem.displayName = "OfferCardItem";


// =============================================================================
// WHAT WE OFFER SECTION
// MOBILE LAYOUT:
//   - Floating side capsule arrows → hidden via CSS
//   - carouselBottomNav shows instead: [← Prev]  1/2  [Next →]
//   - Viewport overflow:visible + section clips peek → next card peeks ~48px
//   - carouselTrack gets swipe-hint class on first slide to nudge left on load
// DESKTOP LAYOUT:
//   - Floating capsule arrows remain on right edge of card
//   - Bottom nav hidden via CSS
//   - Dot indicators visible
// =============================================================================
function WhatWeOffer() {
  // ?? false ENSURES reduced IS ALWAYS boolean — useReducedMotion CAN RETURN null
  const reduced = useReducedMotion() ?? false;

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

        {/* VIEWPORT ROW — desktop arrows float absolutely on right edge */}
        <div className={styles.carouselRow}>

          {/* PREV — desktop capsule only, hidden on mobile via CSS */}
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

          {/* VIEWPORT
              Mobile:  overflow:visible (CSS) so next card peeks right
              Desktop: overflow:hidden (CSS default)                    */}
          <div className={styles.carouselViewport} ref={viewportRef}>
            <motion.div
              className={`${styles.carouselTrack} ${
                // Swipe hint fires once on first slide to signal swipability
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
                  />
                </div>
              ))}
            </motion.div>
          </div>

          {/* NEXT — desktop capsule only, hidden on mobile via CSS */}
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

        {/* ── MOBILE BOTTOM NAV ─────────────────────────────────────
            Hidden on desktop via CSS (display:none above 767px).
            Replaces the floating capsule arrows on small screens.
            [← Prev]  ·  1 / 2  ·  [Next →]                        */}
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

        {/* DOT INDICATORS — hidden on mobile (counter replaces them) */}
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