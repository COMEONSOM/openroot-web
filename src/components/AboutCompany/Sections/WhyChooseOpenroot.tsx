// src/components/AboutCompany/Sections/WhyChooseOpenroot.jsx
import React, { memo } from "react";
import { motion } from "framer-motion";
import { createSmallStagger } from "../data";
import styles from "../styles-ac-section/WhyChooseOpenroot.module.css";

const reasonItems = [
  {
    title: "User-First Always",
    body: "No ads. No gimmicks. No dark patterns. We focus on building trust by respecting user time, data, and attention.",
  },
  {
    title: "Transparent & Accessible Pricing",
    body: "We design high-value solutions for students and small businesses at prices that make sense for them, not just for big companies.",
  },
  {
    title: "Small Team, Big Impact",
    body: "We are a lean, focused team that loves building tools that solve concrete problems instead of chasing trends.",
  },
  {
    title: "Education & Empowerment",
    body: "We don’t just give tools — we teach people how to use technology, AI, and investing methods to create real change in their own lives.",
  },
];

function WhyChooseOpenroot() {
  return (
    <motion.section
      className={styles.whyChooseContainer}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.22 }}
      transition={{ duration: 0.6 }}
    >
      <h2 className={styles.whyChooseTitle}>Why Choose Openroot?</h2>

      <div className={styles.whyChooseGrid}>
        {reasonItems.map((item, index) => {
          const stagger = createSmallStagger(index);
          return (
            <motion.article
              key={item.title}
              className={styles.whyChooseCard}
              initial={stagger.initial}
              whileInView={stagger.whileInView}
              viewport={stagger.viewport}
              transition={stagger.transition}
            >
              <div className={styles.whyChooseIcon}>
                <span>✔</span>
              </div>
              <div className={styles.whyChooseText}>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </div>
            </motion.article>
          );
        })}
      </div>
    </motion.section>
  );
}

export default memo(WhyChooseOpenroot);
