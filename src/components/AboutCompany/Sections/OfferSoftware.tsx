// src/components/AboutCompany/Sections/OfferSoftware.jsx
import React, { memo } from "react";
import { motion } from "framer-motion";
import { createSmallStagger } from "../data";
import styles from "../styles-ac-section/OfferSoftware.module.css";

function OfferSoftware() {
  const stagger = createSmallStagger(1);

  return (
    <motion.article
      className={styles.offerSoftwareCard}
      initial={stagger.initial}
      whileInView={stagger.whileInView}
      viewport={stagger.viewport}
      transition={stagger.transition}
    >
      <div className={styles.offerSoftwareTag}>Software Solutions</div>
      <h3 className={styles.offerSoftwareTitle}>
        Software Built for Real-World Businesses
      </h3>

      <p className={styles.offerSoftwareIntro}>
        Under <strong>Software Solutions</strong>, we design and build{" "}
        <strong>custom digital tools, web apps, and automation systems</strong>{" "}
        for micro and small enterprises that need strong online systems at
        practical, sustainable pricing.
        Our work is focused on enabling businesses that often don’t have access
        to expensive software, in-house tech teams, or complex tools — but still
        need <strong>reliable, long-term digital systems</strong> to grow.
      </p>

      <div className={styles.offerSoftwareSubheading}>
        We help MSMEs with:
      </div>

      <ul className={styles.offerSoftwareList}>
        <li>
          <strong>Business automation</strong> to reduce repetitive manual tasks
          and save time.
        </li>
        <li>
          <strong>Custom applications & portals</strong> built specifically for
          their workflows instead of forcing them to adjust to generic tools.
        </li>
        <li>
          <strong>Practical, scalable architectures</strong> designed to grow
          with the business without unnecessary complexity.
        </li>
      </ul>

      <p className={styles.offerSoftwareNote}>
        Every solution is meant to be{" "}
        <strong>understandable, maintainable, and truly helpful</strong> — not
        just impressive on paper.
      </p>
    </motion.article>
  );
}

export default memo(OfferSoftware);
