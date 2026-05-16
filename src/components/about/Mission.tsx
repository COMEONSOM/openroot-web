import { memo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";

import missionAnim from "../../animations/mission.json";

import s from "./Mission.module.css";

/* ============================================================================
   ANIMATION CONFIG
============================================================================ */

const EASE = [0.22, 1, 0.36, 1] as const;

const VP = {
  once: true,
  amount: 0.18,
};

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 28,
    filter: "blur(8px)",
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",

    transition: {
      duration: 0.7,
      ease: EASE,
    },
  },
};

const titleReveal = {
  hidden: {
    opacity: 0,
    y: 42,
    filter: "blur(12px)",
  },

  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",

    transition: {
      duration: 0.85,
      ease: EASE,
    },
  },
};

/* ============================================================================
   RESPONSIVE VISUAL CONTROL
============================================================================ */

const VISUAL_MIN_PX = 361;

function useFitsVisual() {
  const [fits, setFits] = useState<boolean>(() => {
    if (typeof window === "undefined") {
      return true;
    }

    return window.innerWidth >= VISUAL_MIN_PX;
  });

  useEffect(() => {
    const mq = window.matchMedia(
      `(min-width: ${VISUAL_MIN_PX}px)`
    );

    const handler = (
      e: MediaQueryListEvent
    ) => {
      setFits(e.matches);
    };

    mq.addEventListener("change", handler);

    setFits(mq.matches);

    return () => {
      mq.removeEventListener("change", handler);
    };
  }, []);

  return fits;
}

/* ============================================================================
   MISSION SECTION
============================================================================ */

function Mission() {
  const showVisual = useFitsVisual();

  return (
    <section
      className={s.root}
      aria-labelledby="mission-heading"
    >
      {/* =========================================================
          AMBIENT ORBS
      ========================================================= */}

      <motion.div
        className={s.orbA}
        aria-hidden="true"
        animate={{
          x: [0, 22, 0],
          y: [0, 14, 0],
        }}
        transition={{
          duration: 18,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <motion.div
        className={s.orbB}
        aria-hidden="true"
        animate={{
          x: [0, -14, 0],
          y: [0, -18, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* =========================================================
          INNER WRAPPER
      ========================================================= */}

      <div className={s.inner}>

        {/* =========================================================
            MAIN GRID
        ========================================================= */}

        <div
          className={s.missionStage}
          data-visual={
            showVisual
              ? "visible"
              : "hidden"
          }
        >

          {/* =====================================================
              LEFT CONTENT
          ===================================================== */}

          <motion.div
            className={s.missionCopy}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >

            {/* =================================================
                TITLE BLOCK
            ================================================= */}

            <motion.div
              className={s.sectionTitleBlock}
              variants={fadeUp}
            >
              <motion.h2
                id="mission-heading"
                className={s.sectionTitle}
                variants={titleReveal}
              >
                Purpose
              </motion.h2>
            </motion.div>

            {/* =================================================
                BODY COPY
            ================================================= */}

            <motion.p
              className={s.missionCopyP}
              variants={fadeUp}
            >
              Built for people,
              powered by purpose.

              {" "}

              Our mission is to{" "}

              <strong className={s.missionStrong}>
                open new roots of innovation,
                opportunity,
                and digital independence
              </strong>

              {" "}for people and small businesses.

              {" "}

              Everyone deserves access to{" "}

              <strong className={s.missionStrong}>
                smart technology,
                financial knowledge,
                and future-ready skills
              </strong>

              {" "}— regardless of income,
              background,
              or location.
            </motion.p>

            <motion.p
              className={s.missionCopyP}
              variants={fadeUp}
            >
              Every solution is meant to be{" "}

              <strong className={s.missionStrong}>
                understandable,
                maintainable,
                and truly helpful
              </strong>

              {" "}— not just impressive on paper.
            </motion.p>

            <motion.p
              className={s.missionCopyP}
              variants={fadeUp}
            >
              Whether through a simple finance tool,
              a powerful AI workflow,
              or an in-depth class,

              {" "}

              <strong className={s.missionStrong}>
                Openroot exists
                to remove barriers
              </strong>

              {" "}and make growth more achievable.

              {" "}

              Thousands of individuals
              and businesses already rely on Openroot
              to stay ahead —
              and we&apos;re just getting started.

              {" "}

              Let&apos;s grow together —

              {" "}

              <strong
                className={
                  s.missionStrongAccent
                }
              >
                let&apos;s choose
                Openroot Systems.
              </strong>
            </motion.p>
          </motion.div>

          {/* =====================================================
              RIGHT VISUAL
          ===================================================== */}

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
        </div>

        {/* =========================================================
            CTA SECTION
            BELOW CONTENT + VISUAL
        ========================================================= */}

        <motion.div
          className={s.ctaWrap}
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          <div className={s.ctaRow}>

            {/* PRIMARY CTA */}

            <motion.a
              href="/software"
              className={s.btnPrimary}
            >
              <span>
                Explore Our Services
              </span>

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

            {/* SECONDARY CTA */}

            <Link
              to="/openroot-classes"
              className={s.btnGhost}
            >
              Learn with Openroot Classes
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(Mission);