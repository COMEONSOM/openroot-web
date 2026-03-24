// ============================================================
// OUR MISSION — OPENROOT
// Same motion system as WhoWeAre (calm, modern, enterprise)
// ============================================================

import { memo } from "react";
import { motion, Variants } from "framer-motion";
import styles from "../styles-ac-section/OurMission.module.css";

/* -------------------------------------------------
   Motion variants
-------------------------------------------------- */
const softFade: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

const titleTech: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.985,
    y: 8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const contentBlock: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.05,
    },
  },
};

function OurMission() {
  return (
    <section className={styles.missionSection}>
      <section
        className={`
          ${styles.missionContainer}
          card-dark card-dark-hover card-compact-mobile
        `}
      >
        <motion.div
          className={styles.missionContent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-120px" }}
          aria-labelledby="mission-heading"
        >
          <div className={styles.textGroup}>
            {/* Title */}
            <motion.h2
              id="mission-heading"
              className={`
                ${styles.missionTitle}
                section-title-left text-gradient-strong
              `}
              variants={titleTech}
            >
              Our Mission
            </motion.h2>

            {/* Text block */}
            <motion.div
              className={styles.missionTextBlock}
              variants={contentBlock}
            >
              <p>
                Our mission is to{" "}
                <strong className="text-accent">
                  open new roots of innovation, opportunity, and digital
                  independence
                </strong>{" "}
                for people and small businesses. We believe that everyone
                deserves access to{" "}
                <strong className="text-accent">
                  smart technology, financial knowledge, and future-ready skills
                </strong>{" "}
                — regardless of income, background, or location.
              </p>

              <p>
                Whether it’s through a simple finance tool, a powerful AI
                workflow, or an in-depth class,{" "}
                <strong className="text-accent">
                  Openroot exists to remove barriers
                </strong>{" "}
                and make growth more achievable. Let’s grow together,{" "}
                <strong className="text-accent">
                  let&apos;s choose Openroot Systems.
                </strong>
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              className={`${styles.missionCTA} btn-stack-mobile`}
              variants={softFade}
            >
              <a href="/software" className="btn-pill btn-pill-primary">
                Explore Our Softwares
              </a>

              <a
                href="https://openroot-classes-firebase.web.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-pill btn-pill-ghost"
              >
                Learn with Openroot Classes
              </a>
            </motion.div>
          </div>
        </motion.div>
      </section>
    </section>
  );
}

export default memo(OurMission);