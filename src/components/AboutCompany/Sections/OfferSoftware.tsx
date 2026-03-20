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
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

function OfferSoftware() {
  return (
    <motion.article
      className={`
        ${styles.offerSoftwareCard}
        card-dark card-dark-soft-border card-dark-hover card-compact-mobile
      `}
      variants={cardTech}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-120px" }}
    >
      {/* Tag */}
      <motion.div
        className={`${styles.offerSoftwareTag} badge-pill badge-pill--accent`}
        variants={softFade}
      >
        Software Solutions
      </motion.div>

      {/* Title */}
      <motion.h3
        className={`
          ${styles.offerSoftwareTitle}
          section-title-left text-gradient-strong
        `}
        variants={softFade}
      >
        Software Built for Real-World Businesses
      </motion.h3>

      {/* Intro paragraph */}
      <motion.p
        className={styles.offerSoftwareIntro}
        variants={softFade}
      >
        Under <strong className="text-accent">Software Solutions</strong>, we
        design and build{" "}
        <strong className="text-accent">
          custom digital tools, web apps, and automation systems
        </strong>{" "}
        for micro and small enterprises that need strong online systems at
        practical, sustainable pricing. Our work is focused on enabling
        businesses that often don’t have access to expensive software,
        in-house tech teams, or complex tools — but still need{" "}
        <strong className="text-accent">
          reliable, long-term digital systems
        </strong>{" "}
        to grow.
      </motion.p>

      {/* Subheading */}
      <motion.div
        className={styles.offerSoftwareSubheading}
        variants={softFade}
      >
        <strong className="text-accent">We help MSMEs with:</strong>
      </motion.div>

      {/* List */}
      <motion.ul
        className={`${styles.offerSoftwareList} list-spaced`}
        variants={softFade}
      >
        <li>
          <strong className="text-accent">Business automation</strong> to
          reduce repetitive manual tasks and save time.
        </li>
        <li>
          <strong className="text-accent">
            Custom applications &amp; portals
          </strong>{" "}
          built specifically for their workflows instead of forcing them to
          adjust to generic tools.
        </li>
        <li>
          <strong className="text-accent">
            Practical, scalable architectures
          </strong>{" "}
          designed to grow with the business without unnecessary complexity.
        </li>
      </motion.ul>

      {/* Closing note */}
      <motion.p
        className={styles.offerSoftwareNote}
        variants={softFade}
      >
        Every solution is meant to be{" "}
        <strong className="text-accent">
          understandable, maintainable, and truly helpful
        </strong>{" "}
        — not just impressive on paper.
      </motion.p>
    </motion.article>
  );
}

export default memo(OfferSoftware);
