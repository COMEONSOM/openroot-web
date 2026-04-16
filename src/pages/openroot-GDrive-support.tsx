import React, { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import logo from "/logo.png";

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
    question: "The extension says Auth failed. What should I do?",
    answer:
      "This usually means the OAuth setup is not matching the extension ID or the Google Cloud OAuth client is incorrect. Make sure the extension uses the correct Chrome Extension OAuth client, the extension ID in Google Cloud matches the installed extension, and the manifest contains the correct client_id.",
  },
  {
    question: "Why do I see 'bad client id' during login?",
    answer:
      "That means the OAuth client ID is invalid, mismatched, or created for the wrong application type. Recreate the OAuth client as a Chrome Extension client and paste the correct client ID into the manifest file.",
  },
  {
    question: "Why does the extension need Google Drive permission?",
    answer:
      "The extension needs access only to rename and organize files inside the user's selected Google Drive folder. It does not access unrelated data or store anything externally.",
  },
  {
    question: "Why is the privacy policy page required?",
    answer:
      "Chrome Web Store requires a valid public privacy policy page when an extension requests user data access. The page must be publicly reachable through a real URL and should clearly explain how the extension handles data.",
  },
  {
    question: "Can I use the extension without any manual setup?",
    answer:
      "After the first OAuth authorization, the extension should work directly from the Chrome toolbar. Future use should be simple: open Google Drive, click the extension, and follow the on-screen flow.",
  },
  {
    question: "What if the extension does not detect files?",
    answer:
      "Make sure you are inside a Google Drive folder view, not a general Google page. Also confirm that the folder contains supported files such as images or videos.",
  },
];

const helpCards: HelpCard[] = [
  {
    title: "Email Support",
    description: "Get help with setup, publishing, or authentication issues.",
    linkText: "connect.openroot@gmail.com",
    href: "mailto:connect.openroot@gmail.com",
  },
  {
    title: "Project Website",
    description: "Visit the main Openroot site for product information and updates.",
    linkText: "openroot.in",
    href: "https://openroot.in",
  },
  {
    title: "Privacy Policy",
    description: "Read how the extension handles user data and permissions.",
    linkText: "View Policy",
    href: "https://openroot.in/privacy-policy",
  },
  {
    title: "GitHub Repository",
    description: "Check the source code, updates, and technical documentation.",
    linkText: "Open Repo",
    href: "https://github.com/COMEONSOM/openroot-gdrive-automation",
  },
];

const sectionVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

export default function OpenrootGDriveSupport() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
    <div style={styles.page}>
      <div style={styles.backgroundGlowA} />
      <div style={styles.backgroundGlowB} />

      <main style={styles.shell}>
        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.55 }}
          style={styles.hero}
        >
          <div style={styles.brandRow}>
            <div style={styles.logoWrapper}>
                <img src={logo} alt="Openroot Logo" style={styles.logoImg} />
            </div>
            <div>
              <div style={styles.brandName}>Openroot Systems</div>
              <div style={styles.brandSub}>Support Center · Openroot GDrive Automation System</div>
            </div>
          </div>

          <div style={styles.badge}>Support Portal</div>

          <h1 style={styles.title}>Need help with the extension?</h1>

          <p style={styles.subtitle}>
            This support page helps users troubleshoot authentication, permission
            setup, privacy policy requirements, and general usage of the Openroot
            GDrive Automation System.
          </p>

          <div style={styles.heroActions}>
            <a href="mailto:connect.openroot@gmail.com" style={styles.primaryBtn}>
              Contact Support
            </a>
            <a href="https://openroot.in/privacy-policy" target="_blank" rel="noreferrer" style={styles.secondaryBtn}>
              Privacy Policy
            </a>
          </div>
        </motion.section>

        <section style={styles.grid}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            transition={{ duration: 0.55, delay: 0.1 }}
            style={styles.card}
          >
            <h2 style={styles.cardTitle}>Quick Start</h2>
            <ol style={styles.stepList}>
              {quickSteps.map((step, idx) => (
                <li key={step} style={styles.stepItem}>
                  <span style={styles.stepIndex}>{String(idx + 1).padStart(2, "0")}</span>
                  <span style={styles.stepText}>{step}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          <motion.div
            initial="hidden"
            animate="visible"
            variants={sectionVariants}
            transition={{ duration: 0.55, delay: 0.15 }}
            style={styles.card}
          >
            <h2 style={styles.cardTitle}>Before You Contact Us</h2>
            <div style={styles.tipsWrap}>
              {[
                "Confirm the extension is installed and enabled.",
                "Make sure you are inside Google Drive folder view.",
                "Check whether OAuth consent was completed.",
                "Verify that the manifest contains the correct OAuth client ID.",
                "Confirm your privacy policy URL is publicly accessible.",
              ].map((tip) => (
                <div key={tip} style={styles.tipRow}>
                  <span style={styles.tipBullet} />
                  <span style={styles.tipText}>{tip}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.55, delay: 0.2 }}
          style={styles.card}
        >
          <div style={styles.sectionHeader}>
            <h2 style={styles.cardTitle}>Common Questions</h2>
            <span style={styles.sectionTag}>FAQ</span>
          </div>

          <div style={styles.faqList}>
            {faqItems.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div
                  key={item.question}
                  style={{
                    ...styles.faqItem,
                    ...(isOpen ? styles.faqItemOpen : {}),
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    style={styles.faqButton}
                    aria-expanded={isOpen}
                  >
                    <span style={styles.faqQuestion}>{item.question}</span>
                    <span style={styles.faqIcon}>{isOpen ? "−" : "+"}</span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        style={styles.faqAnswerWrap}
                      >
                        <div style={styles.faqAnswer}>{item.answer}</div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.55, delay: 0.25 }}
          style={styles.card}
        >
          <div style={styles.sectionHeader}>
            <h2 style={styles.cardTitle}>Helpful Links</h2>
            <span style={styles.sectionTag}>Resources</span>
          </div>

          <div style={styles.helpGrid}>
            {helpCards.map((card) => (
              <a
                key={card.title}
                href={card.href}
                target="_blank"
                rel="noreferrer"
                style={styles.helpCard}
              >
                <div style={styles.helpTitle}>{card.title}</div>
                <div style={styles.helpDesc}>{card.description}</div>
                <div style={styles.helpLink}>{card.linkText} →</div>
              </a>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          transition={{ duration: 0.55, delay: 0.3 }}
          style={styles.contactCard}
        >
          <div>
            <div style={styles.contactLabel}>Need direct help?</div>
            <h2 style={styles.contactTitle}>Reach out to Openroot Systems</h2>
            <p style={styles.contactText}>
              If you are facing authentication errors, listing issues, privacy policy
              problems, or Chrome Web Store rejection problems, contact us directly.
            </p>
          </div>

          <div style={styles.contactActions}>
            <a href="mailto:connect.openroot@gmail.com" style={styles.contactBtn}>
              connect.openroot@gmail.com
            </a>
            <a href="https://openroot.in" target="_blank" rel="noreferrer" style={styles.contactBtnSecondary}>
              Visit Website
            </a>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background:
      "radial-gradient(circle at top left, rgba(16,185,129,0.12), transparent 28%), linear-gradient(180deg, #05070a 0%, #081017 42%, #0b1116 100%)",
    color: "#f8fafc",
    fontFamily: "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    position: "relative",
    overflow: "hidden",
    padding: "40px 16px 56px",
  },
  backgroundGlowA: {
    position: "absolute",
    inset: "10% auto auto -8%",
    width: 300,
    height: 300,
    background: "radial-gradient(circle, rgba(16,185,129,0.18), transparent 70%)",
    filter: "blur(8px)",
    pointerEvents: "none",
  },
  backgroundGlowB: {
    position: "absolute",
    inset: "auto -10% 10% auto",
    width: 360,
    height: 360,
    background: "radial-gradient(circle, rgba(34,197,94,0.10), transparent 70%)",
    filter: "blur(8px)",
    pointerEvents: "none",
  },
  shell: {
    position: "relative",
    zIndex: 2,
    maxWidth: 1120,
    margin: "0 auto",
    display: "grid",
    gap: 20,
  },
  logoWrapper: {
    width: 52,
    height: 52,
    borderRadius: 14,
    overflow: "hidden",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  logoImg: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
  },
  hero: {
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 24,
    background: "linear-gradient(180deg, rgba(9,14,20,0.95), rgba(5,9,12,0.92))",
    boxShadow: "0 20px 60px rgba(0,0,0,0.35)",
    padding: "28px",
    backdropFilter: "blur(10px)",
  },
  brandRow: {
    display: "flex",
    alignItems: "center",
    gap: 14,
    marginBottom: 16,
  },
  logoMark: {
    width: 52,
    height: 52,
    borderRadius: 16,
    background:
      "linear-gradient(145deg, rgba(16,185,129,0.18), rgba(16,185,129,0.04))",
    border: "1px solid rgba(16,185,129,0.35)",
    display: "grid",
    placeItems: "center",
    boxShadow: "0 0 0 1px rgba(16,185,129,0.08) inset",
  },
  logoDot: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "radial-gradient(circle at 30% 30%, #9ef3d0 0%, #10b981 45%, #047857 100%)",
    boxShadow: "0 0 20px rgba(16,185,129,0.35)",
  },
  brandName: {
    fontSize: 18,
    fontWeight: 700,
    letterSpacing: 0.2,
    color: "#f8fafc",
  },
  brandSub: {
    fontSize: 13,
    color: "#94a3b8",
    marginTop: 2,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    width: "fit-content",
    gap: 8,
    padding: "7px 12px",
    borderRadius: 999,
    background: "rgba(16,185,129,0.10)",
    color: "#8af0c5",
    border: "1px solid rgba(16,185,129,0.18)",
    fontSize: 12,
    fontWeight: 600,
    marginBottom: 18,
  },
  title: {
    margin: 0,
    fontSize: "clamp(2rem, 4vw, 3.6rem)",
    lineHeight: 1.05,
    letterSpacing: "-0.04em",
    maxWidth: 780,
    color: "#ffffff",
  },
  subtitle: {
    marginTop: 16,
    fontSize: 16,
    lineHeight: 1.8,
    color: "#cbd5e1",
    maxWidth: 860,
  },
  heroActions: {
    marginTop: 22,
    display: "flex",
    flexWrap: "wrap",
    gap: 12,
  },
  primaryBtn: {
    textDecoration: "none",
    color: "#04120c",
    background: "linear-gradient(135deg, #34d399, #10b981)",
    padding: "12px 18px",
    borderRadius: 14,
    fontWeight: 700,
    boxShadow: "0 12px 30px rgba(16,185,129,0.25)",
  },
  secondaryBtn: {
    textDecoration: "none",
    color: "#e2e8f0",
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    padding: "12px 18px",
    borderRadius: 14,
    fontWeight: 600,
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 20,
  },
  card: {
    border: "1px solid rgba(255,255,255,0.08)",
    borderRadius: 22,
    background: "rgba(8,12,16,0.92)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.28)",
    padding: 22,
    backdropFilter: "blur(10px)",
  },
  cardTitle: {
    margin: 0,
    fontSize: 20,
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: "-0.02em",
  },
  stepList: {
    listStyle: "none",
    padding: 0,
    margin: "18px 0 0",
    display: "grid",
    gap: 14,
  },
  stepItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 14,
    padding: "14px 14px",
    borderRadius: 16,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  stepIndex: {
    minWidth: 40,
    height: 40,
    borderRadius: 12,
    display: "grid",
    placeItems: "center",
    background: "rgba(16,185,129,0.12)",
    color: "#8af0c5",
    fontWeight: 800,
    letterSpacing: 0.8,
  },
  stepText: {
    color: "#dbe4ef",
    lineHeight: 1.6,
  },
  tipsWrap: {
    display: "grid",
    gap: 12,
    marginTop: 18,
  },
  tipRow: {
    display: "flex",
    gap: 10,
    alignItems: "flex-start",
    padding: "10px 12px",
    borderRadius: 14,
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(255,255,255,0.06)",
  },
  tipBullet: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#10b981",
    marginTop: 6,
    flexShrink: 0,
    boxShadow: "0 0 12px rgba(16,185,129,0.4)",
  },
  tipText: {
    color: "#dbe4ef",
    lineHeight: 1.6,
    fontSize: 14,
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 16,
  },
  sectionTag: {
    fontSize: 12,
    fontWeight: 700,
    color: "#8af0c5",
    padding: "6px 10px",
    borderRadius: 999,
    background: "rgba(16,185,129,0.10)",
    border: "1px solid rgba(16,185,129,0.16)",
  },
  faqList: {
    display: "grid",
    gap: 12,
  },
  faqItem: {
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "rgba(255,255,255,0.03)",
    overflow: "hidden",
  },
  faqItemOpen: {
    borderColor: "rgba(16,185,129,0.24)",
    boxShadow: "0 0 0 1px rgba(16,185,129,0.10) inset",
  },
  faqButton: {
    width: "100%",
    padding: "16px 16px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 16,
    border: "none",
    background: "transparent",
    color: "#fff",
    cursor: "pointer",
    textAlign: "left",
  },
  faqQuestion: {
    fontSize: 15,
    lineHeight: 1.5,
    fontWeight: 600,
    color: "#f8fafc",
  },
  faqIcon: {
    width: 30,
    height: 30,
    borderRadius: 10,
    display: "grid",
    placeItems: "center",
    color: "#10b981",
    background: "rgba(16,185,129,0.10)",
    fontSize: 20,
    fontWeight: 700,
    flexShrink: 0,
  },
  faqAnswerWrap: {
    overflow: "hidden",
  },
  faqAnswer: {
    padding: "0 16px 16px",
    color: "#cbd5e1",
    lineHeight: 1.75,
    fontSize: 14,
  },
  helpGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 14,
    marginTop: 14,
  },
  helpCard: {
    display: "block",
    textDecoration: "none",
    borderRadius: 18,
    border: "1px solid rgba(255,255,255,0.08)",
    background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02))",
    padding: 18,
    transition: "transform 0.2s ease, border-color 0.2s ease, box-shadow 0.2s ease",
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: "#ffffff",
    marginBottom: 8,
  },
  helpDesc: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "#cbd5e1",
    marginBottom: 14,
  },
  helpLink: {
    color: "#8af0c5",
    fontWeight: 700,
    fontSize: 14,
  },
  contactCard: {
    border: "1px solid rgba(16,185,129,0.22)",
    borderRadius: 24,
    background:
      "linear-gradient(135deg, rgba(16,185,129,0.11), rgba(8,12,16,0.98) 55%)",
    boxShadow: "0 18px 50px rgba(0,0,0,0.35)",
    padding: 24,
    display: "flex",
    justifyContent: "space-between",
    gap: 18,
    alignItems: "center",
    flexWrap: "wrap",
  },
  contactLabel: {
    fontSize: 12,
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    color: "#8af0c5",
    marginBottom: 8,
  },
  contactTitle: {
    fontSize: 22,
    margin: 0,
    color: "#ffffff",
    fontWeight: 800,
    letterSpacing: "-0.02em",
  },
  contactText: {
    marginTop: 10,
    maxWidth: 720,
    color: "#dbe4ef",
    lineHeight: 1.75,
    fontSize: 14,
  },
  contactActions: {
    display: "flex",
    gap: 10,
    flexWrap: "wrap",
  },
  contactBtn: {
    textDecoration: "none",
    color: "#04120c",
    background: "linear-gradient(135deg, #34d399, #10b981)",
    padding: "12px 16px",
    borderRadius: 14,
    fontWeight: 800,
    whiteSpace: "nowrap",
  },
  contactBtnSecondary: {
    textDecoration: "none",
    color: "#e2e8f0",
    border: "1px solid rgba(255,255,255,0.10)",
    background: "rgba(255,255,255,0.04)",
    padding: "12px 16px",
    borderRadius: 14,
    fontWeight: 700,
    whiteSpace: "nowrap",
  },
};

declare module "react" {
  interface CSSProperties {
    [key: string]: string | number | undefined;
  }
}