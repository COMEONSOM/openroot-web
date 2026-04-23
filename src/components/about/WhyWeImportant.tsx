// =============================================================================
// src/components/about/WhyWeImportant.tsx
// SECTION 3 — WHY CHOOSE OPENROOT
// CONTAINS: ReasonCard (local micro-component, not exported)
// DEPENDS ON: variants.ts · data.tsx · types.ts
// EXPORTS: WhyWeImportant (default)
//
// SUB-SECTIONS:
//   1. Reasons Header  — eyebrow + subtext
//   2. Reasons Grid    — 2×2 staggered card grid (1 column on mobile)
//   3. Mission Card    — large glass card with mission copy + two CTA buttons
// =============================================================================

import { memo } from "react";
import { motion } from "framer-motion";
import styles from "../styles/AboutCompany.module.css";
import { fadeIn, fadeUp, stagger, cardReveal, VP } from "../../motion/variants";
import { REASONS } from "../../data/aboutdata";
import type { Reason } from "../../types/types";
import { Link } from "react-router-dom";

// =============================================================================
// REASON CARD — MICRO-COMPONENT
// index: PASSED AS custom PROP TO cardReveal VARIANT FOR PER-CARD STAGGER DELAY
//   e.g. index=0 → delay 0s · index=1 → delay 0.09s · index=2 → delay 0.18s
// NOT EXPORTED — USED ONLY INSIDE THIS FILE
// =============================================================================
const ReasonCard = memo(({ item, index }: { item: Reason; index: number }) => (
  <motion.article
    className={`${styles.reasonCard} card-glass card-hover ot-glass-shine`}
    variants={cardReveal}
    custom={index}
  >
    {/* TOP SHIMMER HAIRLINE — DECORATIVE, ARIA HIDDEN */}
    <span className="ot-card-shimmer" aria-hidden="true" />

    <div className={styles.reasonBody}>

      {/* ICON PILL — CIRCULAR CONTAINER AROUND THE UNICODE GLYPH */}
      <div className={`${styles.reasonIcon} icon-pill`} aria-hidden="true">
        {item.icon}
      </div>

      <div className={styles.reasonText}>
        <h3 className={`${styles.reasonTitle} section-title-left text-gradient`}>
          {item.title}
        </h3>
        <p className="text-muted">{item.body}</p>
      </div>

    </div>
  </motion.article>
));
ReasonCard.displayName = "ReasonCard";


// =============================================================================
// WHY WE'RE IMPORTANT SECTION
// =============================================================================
function WhyWeImportant() {
  return (
    <motion.section
      className={`${styles.whySection} ot-section ot-section-aurora`}
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
      aria-labelledby="why-heading"
    >

      {/* ── SUB-SECTION 1: REASONS HEADER ───────────────────────────────────── */}
      <motion.div className={styles.reasonsHeader} variants={fadeUp}>
        <span className="eyebrow">Why Choose Openroot</span>
        <p className={`${styles.reasonsSubtext} text-muted`}>
          Four principles that define how we work and who we work for.
        </p>
      </motion.div>

      {/* ── SUB-SECTION 2: REASONS GRID ─────────────────────────────────────── */}
      {/* stagger() PARENT PROVIDES SEQUENTIAL ENTRANCE FOR ALL CHILD ReasonCards
          whileInView ON THE GRID (NOT THE SECTION) FIRES CLOSER TO THE CARDS    */}
      <motion.div
        className={styles.reasonsGrid}
        variants={stagger(0.06, 0.1)}
        initial="hidden"
        whileInView="visible"
        viewport={VP}
      >
        {REASONS.map((item, i) => (
          <ReasonCard key={item.title} item={item} index={i} />
        ))}
      </motion.div>

      {/* ── SUB-SECTION 3: MISSION CARD ─────────────────────────────────────── */}
      <div className={styles.missionWrapper}>
        <motion.div
          className={`${styles.missionCard} ot-section-card ot-section-card--shimmer-top ot-glass-shine`}
          variants={fadeUp}
        >
          <div className={styles.missionInner}>

            {/* LEFT: MISSION COPY + CTA BUTTONS */}
            <div className={styles.missionLeft}>
              <span className="eyebrow">Our Mission</span>

              {/* ID MATCHES aria-labelledby ON THE OUTER <section> */}
              <h2
                id="why-heading"
                className={`${styles.missionTitle} text-gradient`}
              >
                Open Innovation!
                <br />
                Where Ideas Never Back Down.
              </h2>

              <hr className="divider" />

              {/* MISSION BODY COPY */}
              <div className={`${styles.missionBody} stack-col`}>
                <p className="text-muted">
                  Our mission is to{" "}
                  <strong className="text-accent">
                    open new roots of innovation, opportunity, and digital
                    independence
                  </strong>{" "}
                  for people and small businesses. Everyone deserves access to{" "}
                  <strong className="text-accent">
                    smart technology, financial knowledge, and future-ready
                    skills
                  </strong>{" "}
                  — regardless of income, background, or location.
                </p>
                <p className="text-muted">
                  Whether through a simple finance tool, a powerful AI workflow,
                  or an in-depth class,{" "}
                  <strong className="text-accent">
                    Openroot exists to remove barriers
                  </strong>{" "}
                  and make growth more achievable. Let&apos;s grow together —{" "}
                  <strong className="text-accent">
                    let&apos;s choose Openroot Systems.
                  </strong>
                </p>
              </div>

              {/* CTA BUTTONS — btn-stack-mobile STACKS THEM VERTICALLY ON MOBILE */}
              <motion.div
                className={`${styles.missionCTA} stack-row btn-stack-mobile`}
                variants={fadeUp}
              >
                <a href="/software" className="btn-pill btn-pill-primary">
                  Explore Our Softwares
                </a>
                <Link
                  to="/openroot-classes"
                  className="btn-pill btn-pill-ghost"
                >
                  Learn with Openroot Classes
                </Link>
              </motion.div>
            </div>

            {/* RIGHT: DECORATIVE WATERMARK + TAGLINE
                aria-hidden="true" — PURELY VISUAL, NO MEANINGFUL CONTENT */}
            <div className={styles.missionRight} aria-hidden="true">
              <span className={styles.missionWatermark}>OR</span>
              <hr className={styles.missionDivider} />
              <p className={styles.missionTagline}>
                Built for people,
                <br />
                powered by purpose.
              </p>
            </div>

          </div>
        </motion.div>
      </div>

    </motion.section>
  );
}

export default memo(WhyWeImportant);