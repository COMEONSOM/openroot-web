import { memo } from "react";
import type { CSSProperties } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";

import styles from "./OurServices.module.css";
import { OFFER_CARDS } from "../../data/aboutdata";
import type { OfferCard } from "../../types/types";
import { fadeIn, fadeUp, stagger, VP } from "../../motion/variants";

import softwareAnimation from "../../animations/software.json";
import classesAnimation from "../../animations/classes.json";

type ServiceBlock = OfferCard & {
  animationData: object;
  accentGradient: string;
};

function getOfferByTag(tag: string): OfferCard {
  const found = OFFER_CARDS.find((card) => card.tag === tag);
  if (!found) {
    throw new Error(`Offer card not found for tag: ${tag}`);
  }
  return found;
}

const SERVICE_BLOCKS: ServiceBlock[] = [
  {
    ...getOfferByTag("Software Solutions"),
    animationData: softwareAnimation,
    accentGradient: "linear-gradient(90deg, var(--ot-brand), var(--ot-brand-2))",
  },
  {
    ...getOfferByTag("Openroot Classes"),
    animationData: classesAnimation,
    accentGradient: "linear-gradient(90deg, var(--ot-brand-2), var(--ot-brand))",
  },
];

function ServiceCard({ card }: { card: ServiceBlock }) {
  return (
    <motion.article
      className={styles.serviceCard}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
      style={
        {
          ["--svc-accent" as string]: card.accentGradient,
        } as CSSProperties
      }
    >
      <div className={styles.serviceInner}>
        <div className={styles.serviceContent}>
          <span className={styles.serviceTag}>{card.tag}</span>

          <h3 className={styles.serviceTitle}>{card.title}</h3>

          <p className={styles.serviceIntro}>{card.intro}</p>

          <p className={styles.serviceSubheading}>
            <strong>{card.subheading}</strong>
          </p>

          <ul className={styles.serviceList}>
            {card.items.map((item, itemIndex) => (
              <li key={itemIndex}>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className={styles.serviceNote}>{card.note}</p>

          <div
            className={styles.serviceHighlights}
            aria-label={`${card.tag} highlights`}
          >
          </div>
        </div>

        <div className={styles.serviceVisual} aria-hidden="true">
          <div className={styles.serviceVisualFrame}>
            <Lottie
              animationData={card.animationData}
              loop
              autoplay
              className={styles.serviceAnimation}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

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

            <span className={styles.servicesEyebrowText}>
              Our Services
            </span>
          </motion.div>
        </motion.div>

        <motion.div
          className={styles.servicesStack}
          variants={stagger()}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          {SERVICE_BLOCKS.map((card) => (
            <ServiceCard key={card.tag} card={card} />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default memo(OurServices);