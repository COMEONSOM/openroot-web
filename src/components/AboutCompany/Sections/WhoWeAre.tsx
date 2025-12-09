// src/components/AboutCompany/Sections/WhoWeAre.jsx
import React, { memo } from "react";
import { motion } from "framer-motion";
import { SECTION_FADE } from "../data";
import styles from "../styles-ac-section/WhoWeAre.module.css";

function WhoWeAre() {
  return (
    <motion.section
      className={styles.whoWeAreContainer}
      initial={SECTION_FADE.initial}
      whileInView={SECTION_FADE.whileInView}
      viewport={SECTION_FADE.viewport}
      transition={SECTION_FADE.transition}
    >
      <p className={styles.whoWeAreEyebrow}>About Openroot</p>
      <h1 className={styles.whoWeAreTitle}>Who We Are</h1>

      <div className={styles.whoWeAreTextBlock}>
        <p>
          At <strong>Openroot</strong>, we build modern digital technology
          that empowers people and small businesses to do more with less
          effort.
          We create{" "}
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
        </p>

        <p>
          Beyond software, Openroot is a platform for{" "}
          <strong>skill development and empowerment</strong>. Through our
          classes and resources, we help students, working professionals,
          and small business owners become confident in using technology,
          AI, and finance to improve their lives.
        </p>
      </div>
    </motion.section>
  );
}

export default memo(WhoWeAre);
