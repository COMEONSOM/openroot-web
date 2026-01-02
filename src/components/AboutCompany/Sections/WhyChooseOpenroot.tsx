// src/components/AboutCompany/Sections/WhyChooseOpenroot.tsx
import { memo } from "react";
import { motion, Variants } from "framer-motion";
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

const cardTech: Variants = {
  hidden: { opacity: 0, scale: 0.985 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.45, ease: "easeOut" },
  },
};

function WhyChooseOpenroot() {
  return (
    <motion.section
      className={styles.whyChooseContainer}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: false, amount: 0.25 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* ✅ Title now visible */}
      <motion.h2
        className={styles.whyChooseTitle}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        Why Choose Openroot?
      </motion.h2>

      <div className={styles.whyChooseGrid}>
        {reasonItems.map((item) => (
          <motion.article
            key={item.title}
            className={styles.whyChooseCard}
            variants={cardTech}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.35 }}
          >
            <div className={styles.whyChooseIcon}>
              <span>✔</span>
            </div>

            <div className={styles.whyChooseText}>
              <h3>{item.title}</h3>
              <p>{item.body}</p>
            </div>
          </motion.article>
        ))}
      </div>
    </motion.section>
  );
}

export default memo(WhyChooseOpenroot);
