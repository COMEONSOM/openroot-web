import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import styles from "./terms.module.css";

// ───────────────────────────────────────────────────────
// TYPES
// ───────────────────────────────────────────────────────

interface Section {
  id: string;
  number: string;
  icon: string;
  title: string;
  subtitle: string;
  content: string;
}

// ───────────────────────────────────────────────────────
// DATA
// ───────────────────────────────────────────────────────

const SECTIONS: Section[] = [
  {
    id: "acceptance",
    number: "01",
    icon: "◈",
    title: "Acceptance of Terms",
    subtitle: "Age requirements & agreement",

    content:
      "You must be at least 13 years old to use this website. By accessing or using any part of this site, you agree to comply with and be bound by these Terms, as well as our Privacy Policy.",
  },

  {
    id: "compliance",
    number: "02",
    icon: "◆",
    title: "Compliance with Laws",
    subtitle: "Legal obligations in India",

    content:
      "You agree to comply with all applicable Indian laws, including the Information Technology Act, 2000 and its amendments, and not to use the platform for unlawful purposes.",
  },

  {
    id: "accounts",
    number: "03",
    icon: "◉",
    title: "User Accounts & Security",
    subtitle: "Your responsibilities",

    content:
      "Maintain the confidentiality of your account credentials and notify us immediately of unauthorized access, misuse, or security breaches involving your account.",
  },

  {
    id: "property",
    number: "04",
    icon: "⬢",
    title: "Intellectual Property",
    subtitle: "Copyright & trademarks",

    content:
      "All content, trademarks, software, assets, and branding elements are protected under applicable copyright and intellectual property laws.",
  },

  {
    id: "prohibited",
    number: "05",
    icon: "⌘",
    title: "Prohibited Activities",
    subtitle: "Restricted usage policies",

    content:
      "Users must not upload malicious content, attempt unauthorized access, reverse engineer systems, scrape platform data, or engage in activities harmful to Openroot or other users.",
  },

  {
    id: "liability",
    number: "06",
    icon: "◌",
    title: "Limitation of Liability",
    subtitle: "Legal limitations & disclaimers",

    content:
      "Openroot shall not be liable for indirect, incidental, consequential, or business interruption damages arising from platform usage or inability to access services.",
  },

  {
    id: "jurisdiction",
    number: "07",
    icon: "⌁",
    title: "Jurisdiction & Governing Law",
    subtitle: "Legal jurisdiction",

    content:
      "These Terms shall be governed under the laws of India. Any disputes shall fall under the jurisdiction of courts located in Kolkata, West Bengal.",
  },
];

// ───────────────────────────────────────────────────────
// SUB COMPONENTS
// ───────────────────────────────────────────────────────

function LegalNote() {
  return (
    <div className={styles.note}>
      <strong>Legal Notice:</strong>{" "}
      Openroot reserves the right to update
      these terms at any time. Continued use
      of the platform constitutes acceptance
      of revised policies.
    </div>
  );
}

function SectionCard({
  sec,
}: {
  sec: Section;
}) {
  return (
    <motion.div
      layout
      className={styles.sectionCard}
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      transition={{
        duration: 0.25,
      }}
    >
      <div className={styles.sectionHeader}>
        <div className={styles.secLeft}>
          <div className={styles.secIcon}>
            {sec.icon}
          </div>

          <div>
            <div className={styles.secNum}>
              {sec.number}
            </div>

            <div className={styles.secTitle}>
              {sec.title}
            </div>

            <div
              className={styles.secSubtitle}
            >
              {sec.subtitle}
            </div>
          </div>
        </div>
      </div>

      <div className={styles.sectionBody}>
        <p>{sec.content}</p>

        <LegalNote />
      </div>
    </motion.div>
  );
}

// ───────────────────────────────────────────────────────
// MAIN COMPONENT
// ───────────────────────────────────────────────────────

export default function Terms() {
  // null = HOME VIEW
  // string = SINGLE SECTION VIEW

  const [selectedSection, setSelectedSection] =
    useState<string | null>(null);

  const [query, setQuery] = useState("");

  // ───────────────────────────────────────────────────
  // FILTERED CONTENT
  // ───────────────────────────────────────────────────

  const visibleSections = useMemo(() => {
    // HOME VIEW

    if (!selectedSection) {
      if (!query.trim()) {
        return SECTIONS;
      }

      return SECTIONS.filter(
        (section) =>
          section.title
            .toLowerCase()
            .includes(
              query.toLowerCase()
            ) ||
          section.subtitle
            .toLowerCase()
            .includes(
              query.toLowerCase()
            )
      );
    }

    // SINGLE SECTION VIEW

    return SECTIONS.filter(
      (section) =>
        section.id === selectedSection
    );
  }, [selectedSection, query]);

  // ───────────────────────────────────────────────────
  // HANDLERS
  // ───────────────────────────────────────────────────

  const handleSelectSection = (
    id: string
  ) => {
    setSelectedSection(id);

    // reset search
    setQuery("");
  };

  const handleHome = () => {
    setSelectedSection(null);

    setQuery("");
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        {/* =====================================================
            LEFT NAVIGATION
        ====================================================== */}

        <nav className={styles.toc}>
          <div className={styles.tocTitle}>
            Legal Documentation
          </div>

          {/* HOME */}

          <button
            className={`${styles.tocItem} ${
              selectedSection === null
                ? styles.tocItemActive
                : ""
            }`}
            onClick={handleHome}
          >
            Home
          </button>

          {/* SECTIONS */}

          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              className={`${styles.tocItem} ${
                selectedSection === sec.id
                  ? styles.tocItemActive
                  : ""
              }`}
              onClick={() =>
                handleSelectSection(sec.id)
              }
            >
              <span
                className={styles.tocNumber}
              >
                {sec.number}
              </span>

              <span>{sec.title}</span>
            </button>
          ))}
        </nav>

        {/* =====================================================
            RIGHT CONTENT
        ====================================================== */}

        <main className={styles.main}>
          {/* =====================================================
              HERO ONLY IN HOME VIEW
          ====================================================== */}

          {selectedSection === null && (
            <>
              <motion.div
                initial={{
                  opacity: 0,
                  y: 16,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.45,
                }}
                className={styles.hero}
              >
                <div className={styles.brand}>
                  <img
                    src="/logo.png"
                    alt="Openroot Systems"
                    className={
                      styles.logoImg
                    }
                  />

                  <div>
                    <div
                      className={
                        styles.brandName
                      }
                    >
                      Openroot Systems
                    </div>

                    <div
                      className={
                        styles.brandSub
                      }
                    >
                      Legal Documentation ·
                      Terms Framework
                    </div>
                  </div>
                </div>

                <h1 className={styles.heroTitle}>
                  Terms &
                  <span
                    className={
                      styles.heroAccent
                    }
                  >
                    Conditions
                  </span>
                </h1>

                <p className={styles.heroDesc}>
                  We believe in transparency.
                  Here’s everything you need
                  to know about using
                  Openroot — written clearly
                  for individuals, teams,
                  institutions, and
                  organizations.
                </p>

                <div
                  className={styles.badgeRow}
                >
                  <span
                    className={`${styles.badge} ${styles.blue}`}
                  >
                    <span
                      className={
                        styles.badgeDot
                      }
                    />

                    Last updated April 2026
                  </span>

                  <span
                    className={`${styles.badge} ${styles.green}`}
                  >
                    <span
                      className={
                        styles.badgeDot
                      }
                    />

                    5 min read
                  </span>

                  <span
                    className={`${styles.badge} ${styles.gray}`}
                  >
                    <span
                      className={
                        styles.badgeDot
                      }
                    />

                    7 Sections
                  </span>

                  <span
                    className={`${styles.badge} ${styles.amber}`}
                  >
                    <span
                      className={
                        styles.badgeDot
                      }
                    />

                    Legal Framework
                  </span>
                </div>

                <div
                  className={
                    styles.complianceRow
                  }
                >
                  <span
                    className={
                      styles.complianceTag
                    }
                  >
                    Indian IT Act 2000
                  </span>

                  <span
                    className={
                      styles.complianceTag
                    }
                  >
                    Platform Compliance
                  </span>

                  <span
                    className={
                      styles.complianceTag
                    }
                  >
                    Enterprise Policies
                  </span>

                  <span
                    className={
                      styles.complianceTag
                    }
                  >
                    Legal Governance
                  </span>
                </div>
              </motion.div>

              {/* SEARCH */}

              <div
                className={styles.searchWrap}
              >
                <span
                  className={
                    styles.searchIcon
                  }
                >
                  ⌕
                </span>

                <input
                  type="text"
                  placeholder="Search terms sections..."
                  value={query}
                  onChange={(e) =>
                    setQuery(
                      e.target.value
                    )
                  }
                  className={
                    styles.searchInput
                  }
                />

                {query && (
                  <button
                    type="button"
                    className={
                      styles.clearBtn
                    }
                    onClick={() =>
                      setQuery("")
                    }
                  >
                    ✕
                  </button>
                )}
              </div>
            </>
          )}

          {/* =====================================================
              SECTION CONTENT
          ====================================================== */}

          <AnimatePresence mode="wait">
            <motion.div
              key={
                selectedSection || "home"
              }
              initial={{
                opacity: 0,
                y: 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -8,
              }}
              transition={{
                duration: 0.2,
              }}
            >
              {visibleSections.length ===
              0 ? (
                <div
                  className={
                    styles.noResults
                  }
                >
                  No sections match your
                  search.

                  <button
                    type="button"
                    className={
                      styles.clearLink
                    }
                    onClick={() =>
                      setQuery("")
                    }
                  >
                    Clear
                  </button>
                </div>
              ) : (
                visibleSections.map(
                  (sec) => (
                    <SectionCard
                      key={sec.id}
                      sec={sec}
                    />
                  )
                )
              )}
            </motion.div>
          </AnimatePresence>

          {/* =====================================================
              CONTACT
          ====================================================== */}

          <div className={styles.footerCard}>
            <div>
              <div
                className={styles.footerText}
              >
                Questions regarding these
                terms? Contact{" "}
                <a
                  href="mailto:connect.openroot@gmail.com"
                  className={
                    styles.footerLink
                  }
                >
                  connect.openroot@gmail.com
                </a>
              </div>

              <div
                className={styles.footerSub}
              >
                ©{" "}
                {new Date().getFullYear()}{" "}
                Openroot Systems. All rights
                reserved.
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}