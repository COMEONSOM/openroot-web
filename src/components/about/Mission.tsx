import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import missionAnim from "../../animations/mission.json";
import s from "./Mission.module.css";


const EASE = [0.22, 1, 0.36, 1] as const;
const VP = { once: true, amount: 0.18 };

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

const titleReveal = {
  hidden: { opacity: 0, y: 42, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.85, ease: EASE },
  },
};


function Eyebrow({ label }: { label: string }) {
  return (
    <div className={s.eyebrowRow}>
      <span className={s.eyebrowLine} />
      <span className={s.eyebrowText}>{label}</span>
    </div>
  );
}


/**
 * useFitsVisual
 * Returns true when the viewport is wide enough to show the Lottie panel
 * alongside the copy (≥ 900px, synced with CSS breakpoint).
 */
const VISUAL_MIN_PX = 900;

function useFitsVisual() {
  const [fits, setFits] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= VISUAL_MIN_PX;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${VISUAL_MIN_PX}px)`);
    const handler = (e: MediaQueryListEvent) => setFits(e.matches);
    mq.addEventListener("change", handler);
    setFits(mq.matches);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return fits;
}


function WhyWeImportant() {
  const showVisual = useFitsVisual();

  return (
    <section className={s.root} aria-labelledby="mission-heading">
      {/* Ambient orbs */}
      <motion.div
        className={s.orbA}
        aria-hidden="true"
        animate={{ x: [0, 22, 0], y: [0, 14, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className={s.orbB}
        aria-hidden="true"
        animate={{ x: [0, -14, 0], y: [0, -18, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className={s.inner}>

        {/* ── Title block ── */}
        <motion.div
          className={s.sectionTitleBlock}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          <Eyebrow label="Our Mission" />

          <motion.h2
            id="mission-heading"
            className={s.sectionTitle}
            variants={titleReveal}
          >
            Built for people,
            <br />
            <span className={s.sectionTitleAccent}>powered by purpose.</span>
          </motion.h2>
        </motion.div>

        {/* ── Mission stage ── */}
        <div
          className={s.missionStage}
          data-visual={showVisual ? "visible" : "hidden"}
        >
          {/* Lottie panel — only mounted when screen fits */}
          {showVisual && (
            <motion.div
              className={s.missionVisual}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
              aria-hidden="true"
            >
              <div className={s.lottieWrap}>
                <span className={s.lottieGlow} />

                <Lottie
                  animationData={missionAnim}
                  loop
                  autoplay
                  className={s.lottieAnimation}
                />
              </div>
            </motion.div>
          )}

          {/* Copy */}
          <motion.div
            className={s.missionCopy}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            {/*
              FIX 4 — enriched body copy.
              Para 1: mission statement — bold key phrases, value proposition.
              Para 2: social proof nudge + urgency + link CTA.
              Para 3 (new): short punchy line reinforcing credibility + reach.
            */}
            <motion.p className={s.missionCopyP} variants={fadeUp}>
              Our mission is to{" "}
              <strong className={s.missionStrong}>
                open new roots of innovation, opportunity, and digital
                independence
              </strong>{" "}
              for people and small businesses. Everyone deserves access to{" "}
              <strong className={s.missionStrong}>
                smart technology, financial knowledge, and future-ready skills
              </strong>{" "}
              — regardless of income, background, or location.
            </motion.p>

            {/* Short credibility nudge — concise, not salesy */}
            <motion.p className={s.missionCopyP} variants={fadeUp}>
              Every solution is meant to be{" "}
              <strong className={s.missionStrong}>
                understandable, maintainable, and truly helpful
              </strong>{" "}
              — not just impressive on paper.
            </motion.p>

            <motion.p className={s.missionCopyP} variants={fadeUp}>
              Whether through a simple finance tool, a powerful AI workflow, or
              an in-depth class,{" "}
              <strong className={s.missionStrong}>
                Openroot exists to remove barriers
              </strong>{" "}
              and make growth more achievable. Thousands of individuals and
              businesses already rely on Openroot to stay ahead — and we&apos;re
              just getting started. Let&apos;s grow together —{" "}
              <strong className={s.missionStrongAccent}>
                let&apos;s choose Openroot Systems.
              </strong>
            </motion.p>


            {/* CTAs — always side by side (flex-row, nowrap) */}
            <motion.div className={s.ctaRow} variants={fadeUp}>
              <motion.a
                href="/software"
                className={s.btnPrimary}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                Explore Our Services
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.a>

              <motion.div
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <Link to="/openroot-classes" className={s.btnGhost}>
                  Learn with Openroot Classes
                </Link>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

      </div>
    </section>
  );
}


export default memo(WhyWeImportant);