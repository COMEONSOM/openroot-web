// src/components/AboutCompany/Sections/OfferSoftware.tsx
import { memo } from "react";
import { motion, Variants } from "framer-motion";
import styles from "../styles-ac-section/OfferSoftware.module.css";

/* -------------------------------------------------
   Same motion system as WhoWeAre
-------------------------------------------------- */
const cardTech: Variants = {
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

function OfferSoftware() {
  return (
    <motion.article
      className={styles.offerSoftwareCard}
      variants={cardTech}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-120px" }}
    >
      {/* Tag */}
      <motion.div
        className={styles.offerSoftwareTag}
        variants={softFade}
      >
        Software Solutions
      </motion.div>

      {/* Title */}
      <motion.h3
        className={styles.offerSoftwareTitle}
        variants={softFade}
      >
        Software Built for Real-World Businesses
      </motion.h3>

      {/* Intro paragraph */}
      <motion.p
        className={styles.offerSoftwareIntro}
        variants={softFade}
      >
        Under <strong>Software Solutions</strong>, we design and build{" "}
        <strong>custom digital tools, web apps, and automation systems</strong>{" "}
        for micro and small enterprises that need strong online systems at
        practical, sustainable pricing. Our work is focused on enabling
        businesses that often don’t have access to expensive software,
        in-house tech teams, or complex tools — but still need{" "}
        <strong>reliable, long-term digital systems</strong> to grow.
      </motion.p>

      {/* Subheading */}
      <motion.div
        className={styles.offerSoftwareSubheading}
        variants={softFade}
      >
        <strong>We help MSMEs with:</strong>
      </motion.div>

      {/* List */}
      <motion.ul
        className={styles.offerSoftwareList}
        variants={softFade}
      >
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
      </motion.ul>

      {/* Closing note */}
      <motion.p
        className={styles.offerSoftwareNote}
        variants={softFade}
      >
        Every solution is meant to be{" "}
        <strong>understandable, maintainable, and truly helpful</strong> — not
        just impressive on paper.
      </motion.p>
    </motion.article>
  );
}

export default memo(OfferSoftware);
