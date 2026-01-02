// src/components/AboutCompany/Sections/WhoWeAre.tsx
import { memo } from "react";
import { motion, Variants } from "framer-motion";
import { SECTION_FADE } from "../data";
import styles from "../styles-ac-section/WhoWeAre.module.css";

/* -------------------------------------------------
   Modern tech-style motion variants
-------------------------------------------------- */
const softFade: Variants = {
  hidden: {
    opacity: 0,
  },
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
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      delay: 0.05,
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
      {/* Eyebrow */}
      <motion.p
        className={styles.whoWeAreEyebrow}
        variants={softFade}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-120px" }}
      >
        About Openroot
      </motion.p>

      {/* Title */}
      <motion.h1
        className={styles.whoWeAreTitle}
        variants={titleTech}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-120px" }}
      >
        Who We Are
      </motion.h1>

      {/* Content — single calm reveal */}
      <motion.div
        className={styles.whoWeAreTextBlock}
        variants={contentBlock}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: false, margin: "-120px" }}
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
          complexity.
          Beyond software, Openroot is a platform for{" "}
          <strong>skill development and empowerment</strong>. Through our
          classes and resources, we help students, working professionals,
          and small business owners become confident in using technology,
          AI, and finance to improve their lives.
        </p>
      </motion.div>
    </motion.section>
  );
}

export default memo(WhoWeAre);
