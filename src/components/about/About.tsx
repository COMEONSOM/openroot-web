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

          {/* =================================================
              CERTIFICATE IMAGES
              Direct child of aboutGrid — placed at col 1,
              row 2 so it sits under text content only.
          ================================================= */}

          <motion.div
            className={styles.certificateGrid}
            variants={fadeUp}
          >
            {/* LinkedIn */}
            <a
              href="https://www.linkedin.com/in/comeonsom/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.certificateCard}
              aria-label="Visit Somnath Banerjee's LinkedIn profile"
            >
              <img
                src="/assets/about1.avif"
                alt="Somnath Banerjee — Founder of Openroot Systems on LinkedIn"
                className={styles.certificateImage}
                loading="lazy"
                draggable={false}
              />
            </a>

            {/* Chrome Web Store */}
            <a
              href="https://chromewebstore.google.com/detail/openroot-gdrive-automatio/pndbnlfhpjinfneglecnpgijhcaffdng"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.certificateCard}
              aria-label="View Openroot GDrive Automation System on Chrome Web Store"
            >
              <img
                src="/assets/about2.avif"
                alt="Openroot GDrive Automation System on Chrome Web Store"
                className={styles.certificateImage}
                loading="lazy"
                draggable={false}
              />
            </a>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default memo(About);