// ============================================================
// OUR MISSION — OPENROOT
// Same motion system as WhoWeAre (calm, modern, enterprise)
// ============================================================

import { memo } from "react";
import { motion, Variants } from "framer-motion";
import styles from "../styles-ac-section/OurMission.module.css";

/* -------------------------------------------------
   Same variants as WhoWeAre
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
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const contentBlock: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
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
      <div className={styles.missionContainer}>
        <motion.div
          className={styles.missionContent}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-120px" }}
          aria-labelledby="mission-heading"
        >
          <div className={styles.textGroup}>
            {/* Title — same as WhoWeAre */}
            <motion.h2
              id="mission-heading"
              className={styles.missionTitle}
              variants={titleTech}
            >
              Our Mission
            </motion.h2>

            {/* Text block — single calm reveal */}
            <motion.div
              className={styles.missionTextBlock}
              variants={contentBlock}
            >
              <p>
                Our mission is to{" "}
                <strong>
                  open new roots of innovation, opportunity, and digital
                  independence
                </strong>{" "}
                for people and small businesses. We believe that everyone
                deserves access to{" "}
                <strong>
                  smart technology, financial knowledge, and future-ready skills
                </strong>{" "}
                — regardless of income, background, or location.
              </p>

              <p>
                Whether it’s through a simple finance tool, a powerful AI
                workflow, or an in-depth class,{" "}
                <strong>Openroot exists to remove barriers</strong> and make
                growth more achievable. Let’s grow together,{" "}
                <strong>Let&apos;s choose Openroot.</strong>
              </p>
            </motion.div>

            {/* CTA — fades in with content (no separate animation) */}
            <motion.div
              className={styles.missionCTA}
              variants={softFade}
            >
              <a href="/tools" className={styles.ctaPrimary}>
                Explore Our Tools
              </a>

              <a
                href="https://openroot-classes-firebase.web.app/"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.ctaGhost}
              >
                Learn with Openroot Classes
              </a>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(OurMission);
