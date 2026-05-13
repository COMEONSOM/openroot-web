import { memo } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

import styles from "./About.module.css";

import {
  VP,
  fadeIn,
  fadeUp,
  stagger,
} from "../../motion/variants";

import xAnimation from "../../animations/about.json";

/* =========================================================
   ABOUT
========================================================= */

function About() {
  return (
    <motion.section
      className={styles.aboutSection}
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
      aria-labelledby="about-heading"
    >
      <div className={styles.aboutContainer}>
        <motion.div
          className={styles.aboutGrid}
          variants={stagger()}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          {/* =================================================
              LEFT CONTENT
          ================================================= */}

          <motion.div
            className={styles.aboutContent}
            variants={fadeUp}
          >
            <h2
              id="about-heading"
              className={styles.aboutTitle}
            >
              About
            </h2>

            <p className={styles.aboutLead}>
              Openroot Systems is a registered
              MSME under the Government of India
              with UDYAM Registration Number
              UDYAM-WB-14-0263034.
              We are also a registered employer
              on the National Career Service
              (NCS) portal.
            </p>

            <div className={styles.aboutBody}>
              <p>
                We build
                <strong>
                  {" "}custom software solutions
                </strong>
                , for MSMEs, Govt Departments
                and Businesses.
                Beyond software,
                <strong>
                  {" "}Openroot Systems
                </strong>
                {" "}is a platform for
                <strong>
                  {" "}skill development and
                  empowerment
                </strong>
                , helping students,
                working professionals,
                and business owners become
                confident in using
                <strong>
                  {" "}technology, AI,
                  and finance.
                </strong>
              </p>

              <p>
                Our goal is simple:
                make technology approachable,
                affordable, and genuinely
                helpful for people and
                small businesses.
              </p>
            </div>

            {/* =============================================
                CERTIFICATION IMAGES
            ============================================== */}

            <div className={styles.certificateGrid}>
              <div className={styles.certificateCard}>
                <img
                  src="/assets/about1.avif"
                  alt="LinkedIn"
                  className={styles.certificateImage}
                  loading="lazy"
                />
              </div>

              <div className={styles.certificateCard}>
                <img
                  src="/assets/about2.avif"
                  alt="openroot systems google review"
                  className={styles.certificateImage}
                  loading="lazy"
                />
              </div>
            </div>
          </motion.div>

          {/* =================================================
              RIGHT VISUAL
          ================================================= */}

          <motion.div
            className={styles.aboutVisual}
            variants={fadeUp}
          >
            <div className={styles.visualFrame}>
              <Lottie
                animationData={xAnimation}
                loop
                autoplay
                className={styles.visualAnimation}
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default memo(About);