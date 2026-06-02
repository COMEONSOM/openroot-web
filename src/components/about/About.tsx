import {
  memo,
  lazy,
  Suspense,
  useEffect,
  useState,
} from "react";
import { motion } from "framer-motion";

import styles from "./About.module.css";

import {
  VP,
  fadeIn,
  fadeUp,
  stagger,
} from "../../motion/variants";

const Lottie = lazy(() => import("lottie-react"));

type CertificateItem = {
  href: string;
  imageSrc: string;
  imageAlt: string;
  ariaLabel: string;
};

const CERTIFICATES: readonly CertificateItem[] = [
  {
    href: "https://www.linkedin.com/in/comeonsom/",
    imageSrc: "/assets/about1.avif",
    imageAlt: "Somnath Banerjee — Founder of Openroot Systems on LinkedIn",
    ariaLabel: "Visit Somnath Banerjee's LinkedIn profile",
  },
  {
    href: "https://chromewebstore.google.com/detail/openroot-gdrive-automatio/pndbnlfhpjinfneglecnpgijhcaffdng",
    imageSrc: "/assets/about2.avif",
    imageAlt: "Openroot GDrive Automation System on Chrome Web Store",
    ariaLabel: "View Openroot GDrive Automation System on Chrome Web Store",
  },
] as const;

function About() {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    fetch("/lotties/about.json")
      .then((res) => res.json())
      .then(setAnimationData)
      .catch((error) => {
        console.error("Failed to load about animation:", error);
      });
  }, []);

  return (
    <motion.section
      className={styles.aboutSection}
      variants={fadeIn}
      initial="hidden"
      whileInView="visible"
      viewport={VP}
      aria-labelledby="about-heading"
    >
      <div className={`${styles.aboutContainer} ac-section-inner`}>
        <motion.div
          className={styles.aboutLayout}
          variants={stagger()}
          initial="hidden"
          whileInView="visible"
          viewport={VP}
        >
          <div className={`${styles.aboutTopGrid} ac-two-col`}>
            <motion.div
              className={`${styles.aboutContent} ac-copy-col`}
              variants={fadeUp}
            >
              <h2
                id="about-heading"
                className={`${styles.aboutTitle} ac-title-display`}
              >
                About
              </h2>

              <p className={`${styles.aboutLead} ac-body-copy`}>
                Openroot Systems is a registered MSME under the Government of
                India with UDYAM Registration Number UDYAM-WB-14-0263034. We
                are also a registered employer on the National Career Service
                (NCS) portal.
              </p>

              <div className={styles.aboutBody}>
                <p>
                  We build
                  <strong> custom software solutions</strong>, for MSMEs, Govt
                  Departments and Businesses. Beyond software,
                  <strong> Openroot Systems</strong> is a platform for
                  <strong> skill development and empowerment</strong>, helping
                  students, working professionals, and business owners become
                  confident in using
                  <strong> technology, AI, and finance.</strong>
                </p>

                <p>
                  Our goal is simple: make technology approachable,
                  affordable, and genuinely helpful for people and small
                  businesses.
                </p>
              </div>
            </motion.div>

            <motion.div
              className={`${styles.aboutVisual} ac-visual-col ac-visual-col-center`}
              variants={fadeUp}
            >
              <div className={`${styles.visualFrame} ac-visual-frame`}>
                {animationData && (
                  <Suspense fallback={null}>
                    <Lottie
                      animationData={animationData}
                      loop
                      autoplay
                      className={`${styles.visualAnimation} ac-anim`}
                      aria-hidden="true"
                      rendererSettings={{
                        preserveAspectRatio: "xMidYMid slice",
                      }}
                    />
                  </Suspense>
                )}
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

export default memo(About);