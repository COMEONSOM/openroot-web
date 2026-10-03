/**
 * ============================================================
 * OUR SERVICES — OPENROOT SYSTEMS
 * ============================================================
 */

import { memo, useState, useRef, useEffect, lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

import styles from "../components/about/OurServices.module.css";

import { OFFER_CARDS } from "../data/aboutdata";

import { fadeIn, fadeUp, stagger, VP } from "../motion/variants";

const Lottie = lazy(() => import("lottie-react"));

// ─────────────────────────────────────────────────────────────
// TYPES
// Local type — only the fields this component actually uses.
// Avoids fighting the full OfferCard shape from types/types.ts
// ─────────────────────────────────────────────────────────────

type ServiceCardData = {
  tag: string;
  title: string;
  intro: string;
  subheading: string;
  items: string[];
  note: string;
};

type ServiceBlock = ServiceCardData & {
  animationData: object;
};

// ─────────────────────────────────────────────────────────────
// NAVIGATION MAP — tag → route
// ─────────────────────────────────────────────────────────────

const SERVICE_ROUTES: Record<string, string> = {
  "Software Solutions":    "/software-solutions",
  "Openroot Classes":      "/softwares/openroot-classes",
  "Software as a Service": "/our-services",
};

// ─────────────────────────────────────────────────────────────
// LOCAL CARDS
// Copy lives here — independent of OFFER_CARDS in aboutdata.
// ─────────────────────────────────────────────────────────────

const SOFTWARE_SOLUTIONS_CARD: ServiceCardData = {
  tag: "Software Solutions",
  title: "Custom digital tools built for MSMEs that mean business",
  intro:
    "We design and build custom digital tools, web apps, and automation systems for micro and small enterprises that need strong online systems at practical, sustainable pricing. Our work is focused on enabling businesses that often don't have access to expensive software, in-house tech teams, or complex tools — but still need reliable, long-term digital systems to grow.",
  subheading: "We help MSMEs with:",
  items: [
    "Business automation to reduce repetitive manual tasks and save time.",
    "Custom applications & portals built specifically for their workflows instead of forcing them to adjust to generic tools.",
    "Practical, scalable architectures designed to grow with the business without unnecessary complexity.",
  ],
  note: "Every solution is meant to be understandable, maintainable, and truly helpful — not just impressive on paper.",
};

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────

function getOfferByTag(tag: string): ServiceCardData {
  const found = OFFER_CARDS.find((card: { tag: string }) => card.tag === tag);
  if (!found) throw new Error(`Offer card not found for tag: ${tag}`);
  return found as ServiceCardData;
}

async function loadAnimations(): Promise<{
  software: object;
  classes: object;
  saas: object;
}> {
  const [software, classes, saas] = await Promise.all([
    fetch("/lotties/software.json").then((r) => r.json()),
    fetch("/lotties/classes.json").then((r) => r.json()),
    fetch("/lotties/saas.json").then((r) => r.json()),
  ]);
  return { software, classes, saas };
}

// ─────────────────────────────────────────────────────────────
// ANIMATION PLACEHOLDER
// ─────────────────────────────────────────────────────────────

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

// ─────────────────────────────────────────────────────────────
// SERVICE CARD
// ─────────────────────────────────────────────────────────────

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
    const route = SERVICE_ROUTES[card.tag] ?? "/our-services";
    navigate(route);
    window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  };

  const ctaLabel =
    card.tag === "Software Solutions"
      ? "Explore Solutions"
      : card.tag === "Openroot Classes"
      ? "Join Classes"
      : "Explore Tools";

  return (
    <motion.article
      className={styles.serviceCard}
      variants={fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
    >
      <div className={`${styles.serviceInner} ac-two-col`}>

        {/* ── Copy column ── */}
        <div className={`${styles.serviceContent} ac-copy-col`}>
          <span className={styles.serviceTag}>{card.tag}</span>

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
            {card.items.map((item, i) => (
              <li key={i}>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <p className={`${styles.serviceNote} ac-body-copy ac-note-left`}>
            {card.note}
          </p>
        </div>

        {/* ── Visual column ── */}
        <div className={`${styles.serviceVisual} ac-visual-col`}>
          <div className={styles.serviceVisualSticky}>
            <div className={`${styles.serviceVisualFrame} ac-visual-frame`}>
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

            <div
              className={`${styles.serviceCTAWrap} ac-cta-wrap ac-cta-wrap-center`}
            >
              <button
                type="button"
                className={`${styles.serviceCTA} ac-btn-gradient`}
                onClick={handleCTA}
              >
                {ctaLabel}
              </button>
            </div>
          </div>
        </div>

      </div>
    </motion.article>
  );
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────

function OurServices() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const [animationsReady, setAnimationsReady] = useState(false);
  const [animationMap, setAnimationMap] = useState<Record<string, object>>({});

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          observer.disconnect();
          loadAnimations().then(({ software, classes, saas }) => {
            setAnimationMap({
              "Software Solutions":    software,
              "Openroot Classes":      classes,
              "Software as a Service": saas,
            });
            setAnimationsReady(true);
          });
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const SERVICE_BLOCKS: ServiceBlock[] = [
    { ...SOFTWARE_SOLUTIONS_CARD,           animationData: {} },
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

        {/* ── Section header ── */}
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

        {/* ── Cards ── */}
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