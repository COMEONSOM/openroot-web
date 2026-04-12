// =============================================================================
// src/components/about/WhoWeAre.tsx
// SECTION 1 — WHO WE ARE
//
// ANIMATION STRATEGY — PERFORMANCE FIRST:
//   • All repeat:Infinity loops REMOVED from Framer Motion
//   • Continuous animations moved to CSS @keyframes (compositor thread, zero JS)
//   • Entrance animations kept in Framer Motion but tuned to be snappier
//   • Only animating transform + opacity — no layout-triggering properties
//   • will-change applied via CSS only on actively animating elements
// =============================================================================

import React, { memo, useEffect, useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import styles from "../styles/AboutCompany.module.css";
import { VP } from "../../motion/variants";
import { PROOF_CARDS, ORBIT_BADGES } from "../../data/aboutdata";

// =============================================================================
// LOCAL ANIMATION VARIANTS
// =============================================================================
const SNAP: [number, number, number, number] = [0.22, 1, 0.36, 1];

const snapFadeIn = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" as const } },
};

const snapUp = {
  hidden:  { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: SNAP } },
};

const snapLeft = {
  hidden:  { opacity: 0, x: -16 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.28, ease: SNAP } },
};

const snapStagger = (delay = 0.05, interval = 0.07) => ({
  hidden:  {},
  visible: { transition: { staggerChildren: interval, delayChildren: delay } },
});

const badgePop = {
  hidden:  { opacity: 0, scale: 0.75, y: 10 },
  visible: (i: number) => ({
    opacity: 1, scale: 1, y: 0,
    transition: { delay: 0.3 + i * 0.07, duration: 0.3, ease: SNAP },
  }),
};

const paneEntrance = {
  hidden:  { opacity: 0, scale: 0.97 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.45, ease: SNAP } },
};

// =============================================================================
// PROOF CARD — MICRO-COMPONENT
// =============================================================================
const ProofCard: React.FC<{ title: string; text: string }> = memo(
  ({ title, text }) => (
    <motion.article
      className={`${styles.proofCard} card-surface`}
      variants={snapUp}
    >
      <span className={styles.proofKicker}>{title}</span>
      <p className={`${styles.proofText} text-muted`}>{text}</p>
    </motion.article>
  )
);
ProofCard.displayName = "ProofCard";

// =============================================================================
// CREDIBILITY CARD — HIGHLIGHTER PEN STYLE
// Paper-textured card with marker-highlight animation on key terms.
// Highlights draw left-to-right via IntersectionObserver (no JS loop).
// =============================================================================
const CredibilityCard: React.FC = memo(() => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(styles["cred-inview"]);
          obs.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={cardRef} className={styles.credibility}>
      <p className={styles["credibility-headline"]}>
        <mark className={styles["cred-mark"]}>Openroot Systems</mark> is a
        registered MSME under the Government of India with UDYAM Registration
        Number{" "}
        <mark className={`${styles["cred-mark"]} ${styles["cred-mark--2"]}`}>
          UDYAM-WB-14-0263034
        </mark>
        . We are also a registered employer on the{" "}
        <mark className={`${styles["cred-mark"]} ${styles["cred-mark--3"]}`}>
          National Career Service
        </mark>{" "}
        (NCS) portal.
      </p>
    </div>
  );
});
CredibilityCard.displayName = "CredibilityCard";

// =============================================================================
// WHO WE ARE SECTION
// =============================================================================
function WhoWeAre() {
  const reduced = useReducedMotion();

  const BADGE_POS_CLASSES = [
    styles.floatBadge1,
    styles.floatBadge2,
    styles.floatBadge3,
    styles.floatBadge4,
  ] as const;

  return (
    <motion.section
      className={`${styles.whoSection} ot-section ot-section-aurora`}
      variants={snapFadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
      aria-labelledby="who-we-are-heading"
    >
      <motion.div
        className={`${styles.whoCard} ot-section-card ot-section-card--shimmer-bottom ot-glass-shine card-hover`}
        variants={snapUp}
      >
        <motion.div
          className={styles.whoInner}
          variants={snapStagger(0.05, 0.07)}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
        >
          {/* EYEBROW */}
          <motion.p className="eyebrow-accent" variants={snapLeft}>
            About Openroot
          </motion.p>

          {/* HEADING */}
          <motion.h2
            id="who-we-are-heading"
            className={`${styles.whoTitle} section-title-left text-gradient-strong`}
            variants={snapUp}
          >
            Who We Are
          </motion.h2>

          <div className={styles.whoSplit}>

            {/* ── LEFT COLUMN ─────────────────────────────────── */}
            <motion.div className={styles.whoLeft} variants={snapUp}>
              <div className={styles.whoTextBlock}>

                {/* ── HIGHLIGHTER CREDIBILITY CARD ── */}
                <CredibilityCard />

                <p className="text-muted">
                  We build{" "}
                  <strong className="text-accent">custom software solutions</strong>{" "}
                  for <strong className="text-accent">MSMEs</strong>, helping them
                  scale affordably with practical, real-world systems. Beyond
                  software, Openroot is a platform for{" "}
                  <strong className="text-accent">
                    skill development and empowerment
                  </strong>{" "}
                  — helping students, working professionals, and small business
                  owners become confident in using technology, AI, and finance.
                </p>
              </div>

              <motion.div
                className={styles.proofGrid}
                variants={snapStagger(0.04, 0.07)}
              >
                {PROOF_CARDS.map((c) => (
                  <ProofCard key={c.title} title={c.title} text={c.text} />
                ))}
              </motion.div>
            </motion.div>

            {/* ── RIGHT COLUMN — STACKED IDENTITY CARDS ───────── */}
            <motion.div
              className={styles.whoRight}
              variants={snapUp}
              style={{ width: "100%", display: "flex", justifyContent: "center" }}
            >
              <div className={styles.stackWrapper}>

                {/* Decorative back cards */}
                <div className={`${styles.stackCard} ${styles.stackCardBack}`}  aria-hidden="true" />
                <div className={`${styles.stackCard} ${styles.stackCardMid}`}   aria-hidden="true" />

                {/* Front card */}
                <motion.div
                  className={`${styles.stackCard} ${styles.stackCardFront}`}
                  variants={paneEntrance}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >

                  {/* ── HEADER ── */}
                  <div className={styles.stackHeader}>
                    <div
                      className={styles.stackBrandMark}
                      aria-label="Openroot Systems logo"
                    >
                      <img
                        src="/logo.png"
                        alt="Openroot Systems"
                        width={38}
                        height={38}
                        loading="eager"
                        decoding="async"
                        className={styles.stackLogoImg}
                        onError={(e) => {
                          const el = e.currentTarget;
                          el.style.display = "none";
                          const fallback = el.nextElementSibling as HTMLElement | null;
                          if (fallback) fallback.style.display = "flex";
                        }}
                      />
                      <span
                        className={styles.stackBrandFallback}
                        aria-hidden="true"
                      >
                        OR
                      </span>
                    </div>
                    <div className={styles.stackMeta}>
                      <span className={styles.stackCompanyName}>Openroot Systems</span>
                      <span className={styles.stackLocation}>Kolkata · India</span>
                    </div>
                    <div className={styles.stackStatusRow} aria-label="MSME Verified">
                      <span className={styles.stackStatusDot} aria-hidden="true" />
                      <span className={styles.stackStatusLabel}>LATEST</span>
                    </div>
                  </div>

                  {/* ── TAGLINE ── */}
                  <div className={styles.stackTaglineWrap}>
                    <p className={styles.stackTaglineEyebrow}>Software pricing starts from</p>
                    <p className={styles.stackTagline}>
                      <span className={styles.stackTaglineAccent}>₹2,999</span>
                    </p>
                    <p className={styles.stackTaglineNote}>
                      No consultation charges. Ever.
                    </p>
                  </div>

                  {/* ── 2×2 FEATURE GRID ── */}
                  <div className={styles.stackGrid} role="list">
                    {ORBIT_BADGES.map((b, i) => (
                      <motion.div
                        key={b.label}
                        className={styles.stackChip}
                        role="listitem"
                        variants={badgePop}
                        custom={i}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                      >
                        <span className={styles.stackChipDot} aria-hidden="true" />
                        <span className={styles.stackChipLabel}>{b.label}</span>
                      </motion.div>
                    ))}
                  </div>

                  {/* ── FOOTER ── */}
                  <div className={styles.stackFooter}>
                    <span className={styles.stackFooterLabel}>UDYAM</span>
                    <span className={styles.stackFooterValue}>WB-14-0263034</span>
                  </div>

                </motion.div>
              </div>
            </motion.div>

          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export default WhoWeAre;