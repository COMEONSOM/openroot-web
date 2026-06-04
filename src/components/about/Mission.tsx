import {
  memo,
  useEffect,
  useState,
  lazy,
  Suspense,
} from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

import s from "./Mission.module.css";

const Lottie = lazy(() => import("lottie-react"));

const EASE = [0.22, 1, 0.36, 1] as const;
const VP = { once: true, amount: 0.18 };

const fadeUp = {
  hidden: { opacity: 0, y: 28, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: EASE },
  },
};

const titleReveal = {
  hidden: { opacity: 0, y: 44, filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.88, ease: EASE },
  },
};

const VISUAL_MIN_PX = 361;

function useFitsVisual() {
  const [fits, setFits] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return window.innerWidth >= VISUAL_MIN_PX;
  });

  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${VISUAL_MIN_PX}px)`);
    const handler = (e: MediaQueryListEvent) => setFits(e.matches);

    setFits(mq.matches);

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", handler);
      return () => mq.removeEventListener("change", handler);
    }

    mq.addListener(handler);
    return () => mq.removeListener(handler);
  }, []);

  return fits;
}

function Mission() {
  const showVisual = useFitsVisual();

  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/lotties/mission.json")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to load mission animation");
        }
        return res.json();
      })
      .then(setAnimationData)
      .catch((error) => {
        console.error("Failed to load mission animation:", error);
      });
  }, []);

  const cta = (
    <div className={s.ctaRow}>
      <a href="/softwares" className={s.btnPrimary}>
        <span>Explore Free Tools</span>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M5 12h14M12 5l7 7-7 7" />
        </svg>
      </a>

      <Link to="/openroot-classes" className={s.btnGhost}>
        Learn with Openroot Classes
      </Link>
    </div>
  );

  return (
    <section className={s.root} aria-labelledby="mission-heading">
      <motion.div
        className={s.orbA}
        aria-hidden="true"
        animate={{ x: [0, 20, 0], y: [0, 14, 0] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className={s.orbB}
        aria-hidden="true"
        animate={{ x: [0, -14, 0], y: [0, -18, 0] }}
        transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className={`${s.inner} ac-section-inner`}>
        <div
          className={`${s.missionStage} ac-two-col`}
          data-visual={showVisual ? "visible" : "hidden"}
        >
          <motion.div
            className={s.missionMain}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={VP}
          >
            <div className={s.missionCopy}>
              <motion.div
                className={s.sectionTitleBlock}
                variants={fadeUp}
              >
                <motion.h2
                  id="mission-heading"
                  className={`${s.sectionTitle} ac-title-display`}
                  variants={titleReveal}
                >
                  Purpose
                </motion.h2>
              </motion.div>

              <motion.p
                className={s.missionCopyP}
                variants={fadeUp}
              >
                Built for people, powered by purpose. Our mission is to{" "}
                <strong className={s.missionStrong}>
                  open new roots of innovation, opportunity, and digital
                  independence
                </strong>{" "}
                for people and small businesses. Everyone deserves access to{" "}
                <strong className={s.missionStrong}>
                  smart technology, financial knowledge, and future-ready skills
                </strong>{" "}
                — regardless of income, background, or location.
              </motion.p>

              <motion.p
                className={s.missionCopyP}
                variants={fadeUp}
              >
                Every solution is meant to be{" "}
                <strong className={s.missionStrong}>
                  understandable, maintainable, and truly helpful
                </strong>{" "}
                — not just impressive on paper.
              </motion.p>

              <motion.p
                className={s.missionCopyP}
                variants={fadeUp}
              >
                Whether through a simple finance tool, a powerful AI workflow,
                or an in-depth class,{" "}
                <strong className={s.missionStrong}>
                  Openroot exists to remove barriers
                </strong>{" "}
                and make growth more achievable. Thousands of individuals and
                businesses already rely on Openroot to stay ahead — and we're
                just getting started. Let's grow together —{" "}
                <strong className={s.missionStrongAccent}>
                  let's choose Openroot Systems.
                </strong>
              </motion.p>
            </div>

            <motion.div
              className={`${s.ctaWrap} ${s.ctaDesktop} ac-cta-wrap ac-cta-wrap-start`}
              variants={fadeUp}
            >
              {cta}
            </motion.div>
          </motion.div>

          {showVisual && (
            <motion.div
              className={`${s.missionVisual} ac-visual-col ac-visual-col-start`}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
              aria-hidden="true"
            >
              <div className={`${s.lottieWrap} ac-lottie-frame`}>
                <span className={s.lottieGlow} />

                {animationData && (
                  <Suspense fallback={null}>
                    <Lottie
                      animationData={animationData}
                      loop
                      autoplay
                      className={`${s.lottieAnimation} ac-lottie-anim`}
                      rendererSettings={{
                        preserveAspectRatio: "xMidYMid meet",
                      }}
                    />
                  </Suspense>
                )}
              </div>
            </motion.div>
          )}

          {showVisual && (
            <motion.div
              className={`${s.ctaWrap} ${s.ctaMobile} ac-cta-wrap`}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={VP}
            >
              {cta}
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}

export default memo(Mission);