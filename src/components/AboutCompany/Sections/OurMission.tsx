// ============================================================
// OUR MISSION — OPENROOT ENTERPRISE EDITION
// Elements-style structure + CTA Left-Aligned
// ============================================================

import React, { memo } from "react";
import { motion } from "framer-motion";
import { SECTION_FADE } from "../data";
import styles from "../styles-ac-section/OurMission.module.css";

function OurMission() {
  return (
    <section className={styles.missionSection}>
      <div className={styles.missionContainer}>
        <motion.div
          className={styles.missionContent}
          initial={SECTION_FADE.initial}
          whileInView={SECTION_FADE.whileInView}
          viewport={{ once: true, margin: "-80px" }}
          transition={SECTION_FADE.transition}
          aria-labelledby="mission-heading"
        >
          <div className={styles.textGroup}>
            <h2 id="mission-heading" className={styles.missionTitle}>
              Our Mission
            </h2>

            <div className={styles.missionTextBlock}>
              <p>
                Our mission is to{" "}
                <strong>
                  open new roots of innovation, opportunity, and digital
                  independence
                </strong>{" "}
                for people and small businesses.
                We believe that everyone deserves access to{" "}
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
                <strong>Let's choose Openroot.</strong>
              </p>
            </div>

            <div className={styles.missionCTA}>
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
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default memo(OurMission);
