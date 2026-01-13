// src/components/AboutCompany/Sections/WhoWeAre.tsx
import { memo } from "react";
import { motion, Variants } from "framer-motion";
import { SECTION_FADE } from "../data";
import styles from "../styles-ac-section/WhoWeAre.module.css";

/* -------------------------------------------------
   Premium tech-style motion system
-------------------------------------------------- */

/**
 * Container orchestrates staggered reveal
 */
const containerMotion: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.05,
    },
  },
};

/**
 * Eyebrow — gentle slide from left + fade
 */
const eyebrowMotion: Variants = {
  hidden: {
    opacity: 0,
    x: -24,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.55,
      ease: [0.22, 1, 0.36, 1], // smooth cubic-bezier
    },
  },
};

/**
 * Title — micro scale + vertical lift
 */
const titleMotion: Variants = {
  hidden: {
    opacity: 0,
    y: 16,
    scale: 0.97,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.65,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/**
 * Content block — soft rise + fade
 */
const contentMotion: Variants = {
  hidden: {
    opacity: 0,
    y: 24,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function WhoWeAre() {
  return (
    <motion.section
      className={styles.whoWeAreContainer}
      initial={SECTION_FADE.initial}
      whileInView={SECTION_FADE.whileInView}
      viewport={SECTION_FADE.viewport}
      transition={SECTION_FADE.transition}
    >
      <motion.div
        variants={containerMotion}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-120px" }}
      >
        {/* Eyebrow */}
        <motion.p
          className={styles.whoWeAreEyebrow}
          variants={eyebrowMotion}
        >
          About Openroot
        </motion.p>

        {/* Title */}
        <motion.h1
          className={styles.whoWeAreTitle}
          variants={titleMotion}
        >
          Who We Are
        </motion.h1>

        {/* Content */}
        <motion.div
          className={styles.whoWeAreTextBlock}
          variants={contentMotion}
        >
          <p>
            At <strong>Openroot</strong>, we build modern digital technology
            that empowers people and small businesses to do more with less
            effort. We create{" "}
            <strong>
              free-to-use financial utilities, AI-powered tools, and
              productivity apps
            </strong>{" "}
            that simplify everyday tasks — from managing expenses and planning
            investments to automating workflows and staying organized.
          </p>

          <p>
            We also build <strong>custom software solutions</strong> for{" "}
            <strong>MSMEs</strong>, helping them scale affordably and efficiently
            with practical, real-world systems instead of over-engineered
            complexity. Beyond software, Openroot is a platform for{" "}
            <strong>skill development and empowerment</strong>. Through our
            classes and resources, we help students, working professionals,
            and small business owners become confident in using technology,
            AI, and finance to improve their lives.
          </p>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}

export default memo(WhoWeAre);
