import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import styles from "./SoftwareLicense-coevas.module.css";

interface Section {
  id: string;
  title: string;
  content?: string;
  list?: string[];
}

const sections: Section[] = [
  {
    id: "1",
    title: "Grant of License",

    content:
      "Openroot Systems grants you a limited, non-exclusive, non-transferable, and revocable license to install and use the Software solely for your internal or personal use, in accordance with this Agreement.",
  },

  {
    id: "2",
    title: "Restrictions",

    list: [
      "You may not copy, modify, adapt, or create derivative works of the Software.",
      "You may not reverse engineer, decompile, or disassemble the Software.",
      "You may not redistribute, sell, sublicense, rent, lease, or transfer the Software to any third party.",
      "You may not remove or alter any copyright or proprietary notices.",
    ],
  },

  {
    id: "3",
    title:
      "Ownership and Intellectual Property",

    content:
      "The Software is licensed, not sold. All rights, title, and interest in and to the Software, including all intellectual property rights, are and shall remain the exclusive property of Openroot Systems.",
  },

  {
    id: "4",
    title: "Updates and Modifications",

    content:
      "Openroot Systems may provide updates, patches, or new versions of the Software from time to time. This Agreement shall apply to all such updates unless accompanied by a separate license agreement.",
  },

  {
    id: "5",
    title: "Disclaimer of Warranty",

    content:
      'The Software is provided "AS IS" and "AS AVAILABLE", without warranty of any kind, express or implied, including but not limited to the warranties of merchantability, fitness for a particular purpose, and non-infringement.',
  },

  {
    id: "6",
    title: "Limitation of Liability",

    content:
      "To the maximum extent permitted by law, Openroot Systems shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of or related to your use or inability to use the Software.",
  },

  {
    id: "7",
    title: "Termination",

    content:
      "This Agreement is effective until terminated. Your rights under this Agreement will terminate automatically without notice if you fail to comply with any term of this Agreement.",
  },

  {
    id: "8",
    title: "Governing Law",

    content:
      "This Agreement shall be governed by and construed in accordance with the laws applicable in your jurisdiction, without regard to conflict of law principles.",
  },

  {
    id: "9",
    title: "Contact Information",

    content:
      "If you have any questions about this Agreement, please contact Openroot Systems through the official website.",
  },
];

export default function License() {
  const [selectedSection, setSelectedSection] =
    useState<string | null>(null);

  const [query, setQuery] = useState("");

  // =====================================================
  // FILTER LOGIC
  // =====================================================

  const visibleSections = useMemo(() => {
    // HOME VIEW

    if (!selectedSection) {
      if (!query.trim()) {
        return sections;
      }

      return sections.filter((section) =>
        section.title
          .toLowerCase()
          .includes(query.toLowerCase())
      );
    }

    // SINGLE SECTION VIEW

    return sections.filter(
      (section) =>
        section.id === selectedSection
    );
  }, [selectedSection, query]);

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleHome = () => {
    setSelectedSection(null);

    setQuery("");
  };

  const handleSelectSection = (
    id: string
  ) => {
    setSelectedSection(id);

    setQuery("");
  };

  return (
    <div className={styles.page}>
      <div className={styles.wrap}>
        {/* =====================================================
            LEFT SIDEBAR
        ====================================================== */}

        <aside className={styles.toc}>
          <div className={styles.tocTitle}>
            License Agreement
          </div>

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

          {sections.map((section) => (
            <button
              key={section.id}
              className={`${styles.tocItem} ${
                selectedSection === section.id
                  ? styles.tocItemActive
                  : ""
              }`}
              onClick={() =>
                handleSelectSection(
                  section.id
                )
              }
            >
              {section.title}
            </button>
          ))}
        </aside>

        {/* =====================================================
            MAIN CONTENT
        ====================================================== */}

        <main className={styles.main}>
          {/* =====================================================
              HERO
          ====================================================== */}

          {selectedSection === null && (
            <>
              <motion.div
                className={styles.hero}
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
                <div className={styles.brand}>
                  <img
                    src="/logo.png"
                    alt="Openroot"
                    className={
                      styles.logoImg
                    }
                  />

                  <div
                    className={
                      styles.brandName
                    }
                  >
                    Openroot Systems
                  </div>
                </div>

                <h1 className={styles.heroTitle}>
                  Software License Agreement
                </h1>

                <p className={styles.heroDesc}>
                  This End User License
                  Agreement governs your use
                  of the Coevas Panel software
                  platform provided by
                  Openroot Systems.
                </p>

                <div
                  className={styles.badgeRow}
                >
                  <span
                    className={`${styles.badge} ${styles.green}`}
                  >
                    <span
                      className={
                        styles.badgeDot
                      }
                    />

                    License Terms
                  </span>

                  <span
                    className={`${styles.badge} ${styles.blue}`}
                  >
                    <span
                      className={
                        styles.badgeDot
                      }
                    />

                    Updated 2026
                  </span>

                  <span
                    className={`${styles.badge} ${styles.gray}`}
                  >
                    <span
                      className={
                        styles.badgeDot
                      }
                    />

                    9 Sections
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
                    Software Licensing
                  </span>

                  <span
                    className={
                      styles.complianceTag
                    }
                  >
                    Enterprise Agreement
                  </span>

                  <span
                    className={
                      styles.complianceTag
                    }
                  >
                    Usage Restrictions
                  </span>
                </div>
              </motion.div>

              {/* =====================================================
                  SEARCH
              ====================================================== */}

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
                  placeholder="Search license sections..."
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
              CONTENT
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
                  No sections found.

                  <button
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
                  (section) => (
                    <section
                      key={section.id}
                      className={
                        styles.sectionCard
                      }
                    >
                      <div
                        className={
                          styles.sectionHeader
                        }
                      >
                        <div
                          className={
                            styles.secLeft
                          }
                        >
                          <div
                            className={
                              styles.secNum
                            }
                          >
                            {String(
                              Number(
                                section.id
                              )
                            ).padStart(
                              2,
                              "0"
                            )}
                          </div>

                          <div>
                            <h2
                              className={
                                styles.secTitle
                              }
                            >
                              {
                                section.title
                              }
                            </h2>
                          </div>
                        </div>
                      </div>

                      <div
                        className={
                          styles.sectionBody
                        }
                      >
                        {section.content && (
                          <p>
                            {
                              section.content
                            }
                          </p>
                        )}

                        {section.list && (
                          <ul>
                            {section.list.map(
                              (
                                item,
                                index
                              ) => (
                                <li
                                  key={
                                    index
                                  }
                                >
                                  {item}
                                </li>
                              )
                            )}
                          </ul>
                        )}

                        {section.id ===
                          "9" && (
                          <p>
                            Website:{" "}
                            <a
                              href="https://openroot.in"
                              target="_blank"
                              rel="noreferrer"
                            >
                              openroot.in
                            </a>
                          </p>
                        )}
                      </div>
                    </section>
                  )
                )
              )}
            </motion.div>
          </AnimatePresence>

          {/* =====================================================
              FOOTER
          ====================================================== */}

          <footer className={styles.footerCard}>
            <div className={styles.footerText}>
              Questions regarding this
              License Agreement?

              <a
                href="https://openroot.in"
                target="_blank"
                rel="noreferrer"
                className={
                  styles.footerLink
                }
              >
                {" "}
                openroot.in
              </a>
            </div>

            <div className={styles.footerSub}>
              © 2026 Openroot Systems. All
              rights reserved.
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}