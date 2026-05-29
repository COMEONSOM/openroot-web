/**
 * ============================================================
 * OUR SERVICES — OPENROOT SYSTEMS
 * SEAMLESS FLOW VERSION
 * FIX: Lazy-load Lottie animations to reduce initial JS parse
 *      and execution time. Report showed 2,210ms LCP element
 *      render delay and 907ms long task in index-rXxAaXAp.js.
 *      Lottie + two large JSON animation files were loaded
 *      eagerly, contributing to main-thread saturation.
 *      Now loaded only when the section enters the viewport.
 * ============================================================
 */

import { memo, useState, useRef, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import styles from "./OurServices.module.css";

import { OFFER_CARDS } from "../../data/aboutdata";
import type { OfferCard } from "../../types/types";

import {
  fadeIn,
  fadeUp,
  stagger,
  VP,
} from "../../motion/variants";

// FIX: Lazy-load Lottie component — it's a heavy library (~50 KB parsed).
// Only imported when the component actually mounts.
const Lottie = lazy(() => import("lottie-react"));

type ServiceBlock = OfferCard & {
  animationData: object;
};

function getOfferByTag(tag: string): OfferCard {
  const found = OFFER_CARDS.find((card) => card.tag === tag);

  if (!found) {
    throw new Error(`Offer card not found for tag: ${tag}`);
  }

  return found;
}

// FIX: Lazy-load animation JSON data using dynamic import.
// These two JSON files (~several hundred KB uncompressed) were previously
// bundled into the main chunk, inflating index-rXxAaXAp.js and contributing
// to the 82.5 KB unused JS and 907ms long task reported.
// They now load only when this section is visible in the viewport.
async function loadAnimations(): Promise<{ software: object; classes: object }> {
  const [softwareModule, classesModule] = await Promise.all([
    import("../../animations/software.json"),
    import("../../animations/classes.json"),
  ]);
  return {
    software: softwareModule.default,
    classes: classesModule.default,
  };
}

// Placeholder shown while animation data is loading
const AnimationPlaceholder = () => (
  <div
    className={`${styles.serviceAnimation} ac-anim`}
    style={{
      background: "var(--ot-surface, rgba(255,255,255,0.04))",
      borderRadius: "12px",
      minHeight: "200px",
    }}
    aria-hidden="true"
  />
);

function ServiceCard({
  card,
  animationData,
  animationsReady,
}: {
  card: ServiceBlock;
  animationData: object | null;
  animationsReady: boolean;
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
      <div className={`${styles.serviceInner} ac-two-col`}>
        <div className={`${styles.serviceContent} ac-copy-col`}>
          <span className={styles.serviceTag}>
            {card.tag}
          </span>

          <h3 className={`${styles.serviceTitle} ac-title-display`}>
            {card.title}
          </h3>

          <p className={`${styles.serviceIntro} ac-body-copy`}>
            {card.intro}
          </p>

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

          <p className={`${styles.serviceNote} ac-body-copy ac-note-left`}>
            {card.note}
          </p>
        </div>

        <div className={`${styles.serviceVisual} ac-visual-col`}>
          <div className={styles.serviceVisualSticky}>
            <div className={`${styles.serviceVisualFrame} ac-visual-frame`}>
              {/* FIX: Only render Lottie once animation data is loaded.
                  Show placeholder in the meantime to avoid layout shift. */}
              {animationsReady && animationData ? (
                <Suspense fallback={<AnimationPlaceholder />}>
                  <Lottie
                    animationData={animationData}
                    loop
                    autoplay
                    className={`${styles.serviceAnimation} ac-anim`}
                  />
                </Suspense>
              ) : (
                <AnimationPlaceholder />
              )}
            </div>

            <div className={`${styles.serviceCTAWrap} ac-cta-wrap ac-cta-wrap-center`}>
              <button
                type="button"
                className={`${styles.serviceCTA} ac-btn-gradient`}
                onClick={handleCTA}
              >
                {card.tag === "Software Solutions"
                  ? "Explore Solutions"
                  : "Join Classes"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function OurServices() {
  const sectionRef = useRef<HTMLElement | null>(null);

  // FIX: Track whether animation assets have been loaded.
  // We use an IntersectionObserver to defer loading until the section
  // is near the viewport, keeping the initial bundle lean.
  const [animationsReady, setAnimationsReady] = useState(false);
  const [animationMap, setAnimationMap] = useState<Record<string, object>>({});

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          loadAnimations().then(({ software, classes }) => {
            setAnimationMap({
              "Software Solutions": software,
              "Openroot Classes": classes,
            });
            setAnimationsReady(true);
          });
        }
      },
      // Start loading when section is 200px from viewport edge
      { rootMargin: "200px" }
    );

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const SERVICE_BLOCKS: ServiceBlock[] = [
    { ...getOfferByTag("Software Solutions"), animationData: {} },
    { ...getOfferByTag("Openroot Classes"),   animationData: {} },
  ];

  return (
    <motion.section
      ref={sectionRef}
      className={styles.servicesSection}
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
      aria-labelledby="our-services-heading"
    >
      <div className={`${styles.servicesInner} ac-section-inner`}>
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
            <span
              className={styles.servicesEyebrowText}
              id="our-services-heading"
            >
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
            <ServiceCard
              key={card.tag}
              card={card}
              animationData={animationMap[card.tag] ?? null}
              animationsReady={animationsReady}
            />
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
}

export default memo(OurServices);