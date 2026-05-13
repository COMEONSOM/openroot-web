import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import styles from "./PrivacyPolicy.module.css";

// ─── Types ─────────────────────────────────────────────

interface Section {
  id: string;
  icon: string;
 title: string;
  content: React.ReactNode;
}

interface Badge {
  label: string;
  color: "blue" | "green" | "amber" | "gray";
}

// ─── Data ──────────────────────────────────────────────

const BADGES: Badge[] = [
  {
    label: "No personal data stored",
    color: "green",
  },

  {
    label: "Google OAuth secured",
    color: "blue",
  },

  {
    label: "Last updated Apr 15, 2026",
    color: "amber",
  },

  {
    label: "Version 10.1.1",
    color: "gray",
  },
];

const COMPLIANCE_TAGS = [
  "GDPR aligned",
  "CCPA aligned",
  "Chrome Web Store compliant",
  "Google API Services User Data Policy",
];

const SECTIONS: Section[] = [
  {
    id: "overview",
    icon: "ℹ",
    title: "Overview & Scope",

    content: (
      <>
        <p>
          Openroot GDrive Automation is a
          Google Chrome Extension that enables
          users to efficiently organize,
          rename, and manage media files
          within their own Google Drive.
        </p>

        <p>
          By installing or using this
          extension, you acknowledge that you
          have read and understood this
          policy.
        </p>

        <Note>
          <strong>Scope:</strong> This policy
          covers the Chrome extension only.
        </Note>
      </>
    ),
  },

  {
    id: "data-collected",
    icon: "⚿",
    title: "Data We Collect",

    content: (
      <>
        <p>
          We collect
          <strong>
            {" "}
            no personal information
          </strong>
          .
        </p>

        <ul>
          <li>
            Names, email addresses, or contact
            information
          </li>

          <li>
            File names, file contents, or
            metadata
          </li>

          <li>
            Browsing history or analytics data
          </li>
        </ul>

        <Note>
          <strong>Local only:</strong> Any
          temporary state exists only within
          your browser session.
        </Note>
      </>
    ),
  },

  {
    id: "google-access",
    icon: "◆",
    title: "Google Account Access",

    content: (
      <>
        <p>
          The extension uses
          <strong>
            {" "}
            Google OAuth 2.0
          </strong>{" "}
          to request access to your Google
          Drive.
        </p>

        <ul>
          <li>
            <strong>drive.file</strong> —
            limited Drive access
          </li>

          <li>
            <strong>identity</strong> —
            secure Google authentication
          </li>
        </ul>
      </>
    ),
  },

  {
    id: "permissions",
    icon: "🔒",
    title: "Extension Permissions",

    content: (
      <>
        <p>
          The extension requests only required
          permissions.
        </p>

        <ul>
          <li>
            <strong>activeTab</strong> —
            detect current Google Drive folder
          </li>

          <li>
            <strong>identity</strong> —
            OAuth authentication
          </li>

          <li>
            <strong>storage</strong> — save
            local preferences
          </li>
        </ul>
      </>
    ),
  },

  {
    id: "security",
    icon: "🛡",
    title: "Security",

    content: (
      <>
        <p>
          Security is maintained through
          Google's infrastructure.
        </p>

        <ul>
          <li>HTTPS/TLS encrypted API calls</li>

          <li>
            OAuth handled directly by Google
          </li>

          <li>
            No external Openroot server used
          </li>
        </ul>

        <Note>
          Contact us immediately if you
          suspect a vulnerability.
        </Note>
      </>
    ),
  },

  {
    id: "contact",
    icon: "✉",
    title: "Contact Us",

    content: (
      <>
        <p>
          Questions regarding this policy can
          be sent to:
        </p>

        <ul>
          <li>
            <strong>Email:</strong>{" "}
            <a href="mailto:connect.openroot@gmail.com">
              connect.openroot@gmail.com
            </a>
          </li>

          <li>
            <strong>Response time:</strong>{" "}
            within 5 business days
          </li>
        </ul>
      </>
    ),
  },
];

// ─── Sub Components ────────────────────────────────────

function Note({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.note}>
      {children}
    </div>
  );
}

function StatusBadge({
  label,
  color,
}: Badge) {
  return (
    <span
      className={`${styles.badge} ${
        styles[color]
      }`}
    >
      <span className={styles.badgeDot} />

      {label}
    </span>
  );
}

function SectionCard({
  sec,
  index,
}: {
  sec: Section;
  index: number;
}) {
  return (
    <motion.div
      layout
      id={`sec-${sec.id}`}
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
            {String(index + 1).padStart(
              2,
              "0"
            )}
          </div>

          <div className={styles.secTitle}>
            {sec.title}
          </div>
        </div>
      </div>

      <div className={styles.sectionBody}>
        {sec.content}
      </div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────

export default function PrivacyPolicy() {
  // null = HOME VIEW
  // string = SINGLE SECTION VIEW

  const [selectedSection, setSelectedSection] =
    useState<string | null>(null);

  const [query, setQuery] = useState("");

  // ─── FILTERED CONTENT ───────────────────────────────

  const visibleSections = useMemo(() => {
    // HOME VIEW

    if (!selectedSection) {
      if (!query.trim()) {
        return SECTIONS;
      }

      return SECTIONS.filter((s) =>
        s.title
          .toLowerCase()
          .includes(query.toLowerCase())
      );
    }

    // SINGLE SECTION VIEW

    return SECTIONS.filter(
      (s) => s.id === selectedSection
    );
  }, [selectedSection, query]);

  // ─── HANDLERS ───────────────────────────────────────

  const handleSelectSection = (
    id: string
  ) => {
    setSelectedSection(id);

    // reset search when section selected
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
              {sec.title}
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
                      GDrive Automation ·
                      Chrome Extension
                    </div>
                  </div>
                </div>

                <h1 className={styles.heroTitle}>
                  Privacy Policy
                </h1>

                <p className={styles.heroDesc}>
                  This policy describes how
                  the Openroot GDrive
                  Automation Chrome Extension
                  handles your data.
                </p>

                <div
                  className={styles.badgeRow}
                >
                  {BADGES.map((b) => (
                    <StatusBadge
                      key={b.label}
                      {...b}
                    />
                  ))}
                </div>

                <div
                  className={
                    styles.complianceRow
                  }
                >
                  {COMPLIANCE_TAGS.map(
                    (tag) => (
                      <span
                        key={tag}
                        className={
                          styles.complianceTag
                        }
                      >
                        {tag}
                      </span>
                    )
                  )}
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
                  placeholder="Search policy sections..."
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
                visibleSections.map((sec) => (
                  <SectionCard
                    key={sec.id}
                    sec={sec}

                    // ORIGINAL INDEX
                    // Always preserves real numbering
                    index={SECTIONS.findIndex(
                      (item) =>
                        item.id === sec.id
                    )}
                  />
                ))
              )}
            </motion.div>
          </AnimatePresence>

          {/* =====================================================
              FOOTER
          ====================================================== */}

          <div className={styles.footerCard}>
            <div>
              <div
                className={styles.footerText}
              >
                Questions? Contact us at{" "}
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