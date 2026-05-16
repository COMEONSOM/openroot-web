/**
 * ============================================================
 * OUR SERVICES — OPENROOT SYSTEMS
 * CLEANED + PRODUCTION READY
 * ============================================================
 * Changes from original:
 *   • ZERO structural changes
 *   • Animation hidden on ≤767px via CSS only (.serviceVisual)
 *   • Text sizes use clamp() in the CSS — component untouched
 * ============================================================
 */

import { memo } from "react";

import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import Lottie from "lottie-react";

import styles from "./OurServices.module.css";

import { OFFER_CARDS } from "../../data/aboutdata";
import type { OfferCard } from "../../types/types";

import {
  fadeIn,
  fadeUp,
  stagger,
  VP,
} from "../../motion/variants";

import softwareAnimation from "../../animations/software.json";
import classesAnimation from "../../animations/classes.json";

/* ============================================================
   TYPES
============================================================ */

type ServiceBlock = OfferCard & {
  animationData: object;
};

/* ============================================================
   HELPERS
============================================================ */

function getOfferByTag(tag: string): OfferCard {
  const found = OFFER_CARDS.find(
    (card) => card.tag === tag
  );

  if (!found) {
    throw new Error(
      `Offer card not found for tag: ${tag}`
    );
  }

  return found;
}

/* ============================================================
   SERVICE DATA
============================================================ */

const SERVICE_BLOCKS: ServiceBlock[] = [
  {
    ...getOfferByTag("Software Solutions"),
    animationData: softwareAnimation,
  },

  {
    ...getOfferByTag("Openroot Classes"),
    animationData: classesAnimation,
  },
];

/* ============================================================
   SERVICE CARD — original structure, untouched
============================================================ */

function ServiceCard({
  card,
}: {
  card: ServiceBlock;
}) {
  const navigate = useNavigate();

  const handleCTA = () => {
    if (card.tag === "Software Solutions") {
      navigate("/software-solutions");
    } else {
      navigate("/software/openroot-classes");
    }

    window.scrollTo({
      top: 0,
      behavior: "instant" as ScrollBehavior,
    });
  };

  return (
    <motion.article
      className={styles.serviceCard}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
    >
      <div className={styles.serviceInner}>

        {/* ==================================================
            LEFT CONTENT — original, untouched
        ================================================== */}

        <div className={styles.serviceContent}>
          <span className={styles.serviceTag}>
            {card.tag}
          </span>

          <h3 className={styles.serviceTitle}>
            {card.title}
          </h3>

          <p className={styles.serviceIntro}>
            {card.intro}
          </p>

          <p className={styles.serviceSubheading}>
            <strong>{card.subheading}</strong>
          </p>

          <ul className={styles.serviceList}>
            {card.items.map(
              (item, itemIndex) => (
                <li key={itemIndex}>
                  <span>{item}</span>
                </li>
              )
            )}
          </ul>

          <p className={styles.serviceNote}>
            {card.note}
          </p>

          {/* Mobile CTA — visible only ≤767px via CSS */}
          <button
            type="button"
            className={`${styles.serviceCTA} ${styles.mobileCTA}`}
            onClick={handleCTA}
          >
            {card.tag === "Software Solutions"
              ? "Explore Solutions"
              : "Join Classes"}
          </button>
        </div>

        {/* ==================================================
            RIGHT VISUAL PANEL — hidden ≤767px via CSS only
        ================================================== */}

        <div className={styles.serviceVisual}>
          <div className={styles.serviceVisualSticky}>
            <div className={styles.serviceVisualFrame}>
              <Lottie
                animationData={card.animationData}
                loop
                autoplay
                className={styles.serviceAnimation}
              />
            </div>

            {/* Desktop CTA — inside visual panel */}
            <button
              type="button"
              className={styles.serviceCTA}
              onClick={handleCTA}
            >
              {card.tag === "Software Solutions"
                ? "Explore Solutions"
                : "Join Classes"}
            </button>
          </div>
        </div>

      </div>
    </motion.article>
  );
}

/* ============================================================
   MAIN COMPONENT — original, untouched
============================================================ */

function OurServices() {
  return (
    <motion.section
      className={styles.servicesSection}
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
      aria-labelledby="our-services-heading"
    >
      <div className={styles.servicesInner}>

        {/* Header */}
        <motion.div
          className={styles.servicesHeader}
          variants={stagger()}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          <motion.div
            className={styles.servicesEyebrowRow}
            variants={fadeUp}
          >
            <span className={styles.servicesEyebrowLine} />
            <span className={styles.servicesEyebrowText}>Our Services</span>
          </motion.div>
        </motion.div>

        {/* Service stack */}
        <motion.div
          className={styles.servicesStack}
          variants={stagger()}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          {SERVICE_BLOCKS.map((card) => (
            <ServiceCard
              key={card.tag}
              card={card}
            />
          ))}
        </motion.div>

      </div>
    </motion.section>
  );
}

export default memo(OurServices);