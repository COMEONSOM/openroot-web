// src/components/AboutCompany/Sections/OfferClasses.tsx
import { memo } from "react";
import { motion, Variants } from "framer-motion";
import styles from "../styles-ac-section/OfferClasses.module.css";

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

function OfferClasses() {
  return (
    <motion.section
      className={styles.offerClassesContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-120px" }}
    >
      {/* Section title */}
      <motion.h2
        className={styles.offerClassesTitle}
        variants={softFade}
      >
        What We Offer
      </motion.h2>

      <div className={styles.offerClassesGrid}>
        <motion.article
          className={styles.offerClassCard}
          variants={cardTech}
        >
          {/* Tag */}
          <motion.div
            className={styles.offerClassTag}
            variants={softFade}
          >
            Openroot Classes
          </motion.div>

          {/* Card title */}
          <motion.h3
            className={styles.offerClassCardTitle}
            variants={softFade}
          >
            Learn Skills That Actually Help
          </motion.h3>

          {/* Intro */}
          <motion.p
            className={styles.offerClassIntro}
            variants={softFade}
          >
            <strong>Openroot Classes</strong> is our education arm — a
            financial-literacy and <strong>investing-education initiative</strong> for{" "}
            <strong>students, beginners, and MSMEs</strong> who want practical
            skills, not just theory. We believe high-quality, in-depth learning
            shouldn’t break the bank. That’s why our programs are{" "}
            <strong>affordable, ad-free, and transparent</strong>, with a deep
            focus on real-life application instead of textbook-style content.
          </motion.p>

          {/* Subheading */}
          <motion.div
            className={styles.offerClassSubheading}
            variants={softFade}
          >
            <strong>Our expert-led programs include:</strong>
          </motion.div>

          {/* List */}
          <motion.ul
            className={styles.offerClassList}
            variants={softFade}
          >
            <li>
              <strong>Prompt Engineering</strong> — Learn how to design{" "}
              <strong>AI workflows and automations</strong> that can help in
              content creation, data handling, business operations, and
              day-to-day productivity.
            </li>
            <li>
              <strong>Financial Investing</strong> — Understand{" "}
              <strong>
                wealth-building fundamentals, risk management, and long-term
                investing strategies
              </strong>{" "}
              so you can make confident financial decisions instead of guessing
              or following hype.
            </li>
          </motion.ul>

          {/* Closing note */}
          <motion.p
            className={styles.offerClassNote}
            variants={softFade}
          >
            Our goal is simple — to make people{" "}
            <strong>future-ready</strong> by combining technology, financial
            literacy, and practical skill-building in one place.
          </motion.p>
        </motion.article>
      </div>
    </motion.section>
  );
}

export default memo(OfferClasses);
