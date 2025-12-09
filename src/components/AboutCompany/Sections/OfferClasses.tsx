// src/components/AboutCompany/Sections/OfferClasses.jsx
import React, { memo } from "react";
import { motion } from "framer-motion";
import { SECTION_FADE, createSmallStagger } from "../data";
import styles from "../styles-ac-section/OfferClasses.module.css";

function OfferClasses() {
  const stagger = createSmallStagger(0);

  return (
    <motion.section
      className={styles.offerClassesContainer}
      initial={SECTION_FADE.initial}
      whileInView={SECTION_FADE.whileInView}
      viewport={SECTION_FADE.viewport}
      transition={SECTION_FADE.transition}
    >
      <h2 className={styles.offerClassesTitle}>What We Offer</h2>

      <div className={styles.offerClassesGrid}>
        <motion.article
          className={styles.offerClassCard}
          initial={stagger.initial}
          whileInView={stagger.whileInView}
          viewport={stagger.viewport}
          transition={stagger.transition}
        >
          <div className={styles.offerClassTag}>Openroot Classes</div>
          <h3 className={styles.offerClassCardTitle}>
            Learn Skills That Actually Help
          </h3>

          <p className={styles.offerClassIntro}>
            <strong>Openroot Classes</strong> is our education arm — a
            financial-literacy and investing-education initiative for{" "}
            <strong>students, beginners, and MSMEs</strong> who want practical
            skills, not just theory.
            We believe high-quality, in-depth learning shouldn’t break the bank.
            That’s why our programs are{" "}
            <strong>affordable, ad-free, and transparent</strong>, with a deep
            focus on real-life application instead of textbook-style content.
          </p>

          <div className={styles.offerClassSubheading}>
            Our expert-led programs include:
          </div>

          <ul className={styles.offerClassList}>
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
          </ul>

          <p className={styles.offerClassNote}>
            Our goal is simple — to make people{" "}
            <strong>future-ready</strong> by combining technology, financial
            literacy, and practical skill-building in one place.
          </p>
        </motion.article>
      </div>
    </motion.section>
  );
}

export default memo(OfferClasses);
