import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "/logo.png";

import styles from "./OpenrootGDriveSupport.module.css";

type FaqItem = {
  question: string;
  answer: string;
};

type HelpCard = {
  title: string;
  description: string;
  linkText: string;
  href: string;
};

const faqItems: FaqItem[] = [
  {
    question:
      "The extension says Auth failed. What should I do?",
    answer:
      "This usually means the OAuth setup is not matching the extension ID or the Google Cloud OAuth client is incorrect. Make sure the extension uses the correct Chrome Extension OAuth client, the extension ID in Google Cloud matches the installed extension, and the manifest contains the correct client_id.",
  },

  {
    question:
      "Why do I see 'bad client id' during login?",
    answer:
      "That means the OAuth client ID is invalid, mismatched, or created for the wrong application type. Recreate the OAuth client as a Chrome Extension client and paste the correct client ID into the manifest file.",
  },

  {
    question:
      "Why does the extension need Google Drive permission?",
    answer:
      "The extension needs access only to rename and organize files inside the user's selected Google Drive folder. It does not access unrelated data or store anything externally.",
  },

  {
    question:
      "Why is the privacy policy page required?",
    answer:
      "Chrome Web Store requires a valid public privacy policy page when an extension requests user data access. The page must be publicly reachable through a real URL and should clearly explain how the extension handles data.",
  },

  {
    question:
      "Can I use the extension without any manual setup?",
    answer:
      "After the first OAuth authorization, the extension should work directly from the Chrome toolbar. Future use should be simple: open Google Drive, click the extension, and follow the on-screen flow.",
  },

  {
    question:
      "What if the extension does not detect files?",
    answer:
      "Make sure you are inside a Google Drive folder view, not a general Google page. Also confirm that the folder contains supported files such as images or videos.",
  },
];

const helpCards: HelpCard[] = [
  {
    title: "Email Support",
    description:
      "Get help with setup, publishing, or authentication issues.",
    linkText: "connect.openroot@gmail.com",
    href: "mailto:connect.openroot@gmail.com",
  },

  {
    title: "Project Website",
    description:
      "Visit the main Openroot site for product information and updates.",
    linkText: "openroot.in",
    href: "https://openroot.in",
  },

  {
    title: "Privacy Policy",
    description:
      "Read how the extension handles user data and permissions.",
    linkText: "View Policy",
    href: "https://openroot.in/privacy-policy",
  },

  {
    title: "GitHub Repository",
    description:
      "Check the source code, updates, and technical documentation.",
    linkText: "Open Repo",
    href: "https://github.com/COMEONSOM/openroot-gdrive-automation",
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },

  visible: { opacity: 1, y: 0 },
};

export default function OpenrootGDriveSupport() {
  const [openIndex, setOpenIndex] =
    useState<number | null>(0);

  const quickSteps = useMemo(
    () => [
      "Open Google Drive in your browser.",
      "Go inside the folder you want to organize.",
      "Click the Openroot extension icon from the Chrome toolbar.",
      "Allow Google authentication if prompted.",
      "Wait for the rename process to complete.",
    ],
    []
  );

  return (
    <div className={styles.page}>
      <div className={styles.backgroundGlowA} />

      <div className={styles.backgroundGlowB} />

      <main className={styles.shell}>
        {/* HERO */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.55 }}
          className={styles.hero}
        >
          <div className={styles.brandRow}>
            <div className={styles.logoWrapper}>
              <img
                src={logo}
                alt="Openroot Logo"
                className={styles.logoImg}
              />
            </div>

            <div>
              <div className={styles.brandName}>
                Openroot Systems
              </div>

              <div className={styles.brandSub}>
                Support Center · Openroot GDrive
                Automation System
              </div>
            </div>
          </div>

          <div className={styles.badge}>
            Support Portal
          </div>

          <h1 className={styles.title}>
            Need help with the extension?
          </h1>

          <p className={styles.subtitle}>
            This support page helps users
            troubleshoot authentication,
            permission setup, privacy policy
            requirements, and general usage of the
            Openroot GDrive Automation System.
          </p>

          <div className={styles.heroActions}>
            <a
              href="mailto:connect.openroot@gmail.com"
              className={styles.primaryBtn}
            >
              Contact Support
            </a>

            <a
              href="https://openroot.in/privacy-policy"
              target="_blank"
              rel="noreferrer"
              className={styles.secondaryBtn}
            >
              Privacy Policy
            </a>
          </div>
        </motion.section>

        {/* GRID */}
        <section className={styles.grid}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            transition={{
              duration: 0.55,
              delay: 0.1,
            }}
            className={styles.card}
          >
            <h2 className={styles.cardTitle}>
              Quick Start
            </h2>

            <ol className={styles.stepList}>
              {quickSteps.map((step, idx) => (
                <li
                  key={step}
                  className={styles.stepItem}
                >
                  <span
                    className={styles.stepIndex}
                  >
                    {String(idx + 1).padStart(
                      2,
                      "0"
                    )}
                  </span>

                  <span className={styles.stepText}>
                    {step}
                  </span>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            transition={{
              duration: 0.55,
              delay: 0.15,
            }}
            className={styles.card}
          >
            <h2 className={styles.cardTitle}>
              Before You Contact Us
            </h2>

            <div className={styles.tipsWrap}>
              {[
                "Confirm the extension is installed and enabled.",
                "Make sure you are inside Google Drive folder view.",
                "Check whether OAuth consent was completed.",
                "Verify that the manifest contains the correct OAuth client ID.",
                "Confirm your privacy policy URL is publicly accessible.",
              ].map((tip) => (
                <div
                  key={tip}
                  className={styles.tipRow}
                >
                  <span
                    className={styles.tipBullet}
                  />

                  <span className={styles.tipText}>
                    {tip}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* FAQ */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{
            duration: 0.55,
            delay: 0.2,
          }}
          className={styles.card}
        >
          <div className={styles.sectionHeader}>
            <h2 className={styles.cardTitle}>
              Common Questions
            </h2>

            <span className={styles.sectionTag}>
              FAQ
            </span>
          </div>

          <div className={styles.faqList}>
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;

              return (
                <div
                  key={item.question}
                  className={`${styles.faqItem} ${
                    isOpen
                      ? styles.faqItemOpen
                      : ""
                  }`}
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenIndex(
                        isOpen ? null : index
                      )
                    }
                    className={styles.faqButton}
                    aria-expanded={isOpen}
                  >
                    <span
                      className={
                        styles.faqQuestion
                      }
                    >
                      {item.question}
                    </span>

                    <span className={styles.faqIcon}>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{
                          height: 0,
                          opacity: 0,
                        }}
                        animate={{
                          height: "auto",
                          opacity: 1,
                        }}
                        exit={{
                          height: 0,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.25,
                          ease: "easeInOut",
                        }}
                        className={
                          styles.faqAnswerWrap
                        }
                      >
                        <div
                          className={
                            styles.faqAnswer
                          }
                        >
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.section>

        {/* HELP LINKS */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{
            duration: 0.55,
            delay: 0.25,
          }}
          className={styles.card}
        >
          <div className={styles.sectionHeader}>
            <h2 className={styles.cardTitle}>
              Helpful Links
            </h2>

            <span className={styles.sectionTag}>
              Resources
            </span>
          </div>

          <div className={styles.helpGrid}>
            {helpCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                target="_blank"
                rel="noreferrer"
                className={styles.helpCard}
              >
                <div className={styles.helpTitle}>
                  {card.title}
                </div>

                <div className={styles.helpDesc}>
                  {card.description}
                </div>

                <div className={styles.helpLink}>
                  {card.linkText} →
                </div>
              </a>
            ))}
          </div>
        </motion.section>

        {/* CONTACT */}
        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{
            duration: 0.55,
            delay: 0.3,
          }}
          className={styles.contactCard}
        >
          <div>
            <div className={styles.contactLabel}>
              Need direct help?
            </div>

            <h2 className={styles.contactTitle}>
              Reach out to Openroot Systems
            </h2>

            <p className={styles.contactText}>
              If you are facing authentication
              errors, listing issues, privacy
              policy problems, or Chrome Web Store
              rejection problems, contact us
              directly.
            </p>
          </div>

          <div className={styles.contactActions}>
            <a
              href="mailto:connect.openroot@gmail.com"
              className={styles.contactBtn}
            >
              connect.openroot@gmail.com
            </a>

            <a
              href="https://openroot.in"
              target="_blank"
              rel="noreferrer"
              className={
                styles.contactBtnSecondary
              }
            >
              Visit Website
            </a>
          </div>
        </motion.section>
      </main>
    </div>
  );
}