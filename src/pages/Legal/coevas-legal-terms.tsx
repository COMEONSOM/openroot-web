import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

import styles from "./CoevasTerms.module.css";

interface Section {
  id: string;
  title: string;
  content?: string;
  list?: string[];
}

const sections: Section[] = [
  {
    id: "1",
    title: "Eligibility",
    content:
      "To access and use the Software, you must be legally competent to enter into a binding contract as defined under Section 11 of the Indian Contract Act, 1872. This means you must have attained the age of majority as per the Indian Majority Act, 1875 (generally 18 years), be of sound mind, and not be disqualified from contracting by any applicable law. By accessing this Software, you represent and warrant that you satisfy these conditions and that your use of the Software complies with all applicable laws and regulations in force in India, including but not limited to the Information Technology Act, 2000 and the rules framed thereunder.",
  },

  {
    id: "2",
    title: "Permitted Use",
    content:
      "You are granted a limited, non-exclusive, non-transferable, and revocable licence to use the Software solely for lawful purposes and strictly in accordance with these Terms and the applicable Licence Agreement executed between you and Openroot Systems. Your use of the Software must conform to the provisions of the Information Technology Act, 2000, the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, and all other applicable statutes. You agree not to use the Software in any manner that infringes the rights of any third party, restricts or inhibits any other person's use and enjoyment of the Software, or violates any law in force in India.",
  },

  {
    id: "3",
    title: "Prohibited Activities",
    list: [
      "Using the Software for any unlawful, harmful, obscene, fraudulent, or defamatory purpose in violation of the Indian Penal Code, 1860, the Information Technology Act, 2000 (including Sections 66, 66A–66F, 67, 67A, 67B), or any other applicable legislation.",
      "Attempting to gain, or gaining, unauthorised access to any computer system, network, database, or electronic record in contravention of Section 43 and Section 66 of the Information Technology Act, 2000, which prescribes penalties including imprisonment up to three years and/or a fine of up to ₹5,00,000.",
      "Reverse engineering, decompiling, disassembling, or otherwise attempting to derive the source code, algorithms, or structure of the Software, except and solely to the extent permitted by applicable law, including the Copyright Act, 1957.",
      "Distributing, sublicensing, selling, renting, leasing, or otherwise commercially exploiting the Software without prior written permission from Openroot Systems, in contravention of the exclusive economic rights conferred under Chapter VI of the Copyright Act, 1957.",
      "Removing, altering, obscuring, or tampering with any proprietary notices, copyright legends, trademarks, or licence labels on or within the Software, which may constitute an offence under Section 65 of the Information Technology Act, 2000.",
      "Transmitting data that contains viruses, worms, Trojan horses, ransomware, or any other malicious or technologically harmful code that may damage the Software, networks, or any computer system, as prohibited under Section 43(c) and Section 66 of the Information Technology Act, 2000.",
      "Using the Software to collect, store, process, or transfer any Sensitive Personal Data or Information (SPDI) of third parties without appropriate consent, in violation of the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011.",
    ],
  },

  {
    id: "4",
    title: "Intellectual Property Rights",
    content:
      "The Software, its source code, object code, architecture, visual interface, documentation, and all other components thereof constitute original literary works protected under Section 2(o) and Chapter VI of the Copyright Act, 1957, which expressly recognises computer programmes, tables, compilations, and computer databases as literary works. All intellectual property rights in and to the Software, including copyrights, trademarks, trade secrets, patents, and moral rights, are owned exclusively by and vest in Openroot Systems or its licensors. You acknowledge that no title or ownership in any intellectual property is transferred to you under these Terms or any Licence Agreement, and that any unauthorised reproduction, distribution, or adaptation of the Software constitutes infringement attracting civil and criminal liability under Chapter XII of the Copyright Act, 1957.",
  },

  {
    id: "5",
    title: "Updates and Availability",
    content:
      "Openroot Systems may, at its sole discretion and from time to time, release updates, patches, enhancements, bug fixes, or new versions of the Software. Such updates may be made available automatically or may require manual installation. Openroot Systems does not guarantee continuous, uninterrupted, or error-free availability of the Software and shall not be liable for any temporary suspension, downtime, or technical failure. Any new features or modifications released as part of an update shall be subject to these Terms unless a separate agreement is provided in writing. Openroot Systems reserves the right to modify, suspend, or discontinue any part of the Software at any time without prior notice, subject to applicable obligations under the Consumer Protection Act, 2019 and the Information Technology Act, 2000.",
  },

  {
    id: "6",
    title: "Disclaimer of Warranties",
    content:
      'The Software is provided on an "AS IS" and "AS AVAILABLE" basis, without warranties of any kind, whether express, implied, statutory, or otherwise. To the maximum extent permitted under applicable Indian law, Openroot Systems expressly disclaims all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, accuracy, and non-infringement. While Openroot Systems endeavours to maintain the security and integrity of the Software, it does not warrant that the Software will be free from viruses, malware, or other harmful components. Nothing in this disclaimer shall exclude liability that cannot be excluded or limited under the Consumer Protection Act, 2019 or any other mandatory provision of Indian law.',
  },

  {
    id: "7",
    title: "Limitation of Liability",
    content:
      "To the fullest extent permitted by applicable Indian law, including the Indian Contract Act, 1872 and the Information Technology Act, 2000, Openroot Systems, its directors, officers, employees, affiliates, and licensors shall not be liable for any indirect, incidental, special, consequential, exemplary, or punitive damages arising out of or in connection with your access to or use of the Software, including but not limited to loss of profits, data, goodwill, or business opportunities. In jurisdictions where limitation of liability for consequential or incidental damages is not permitted, Openroot Systems' liability shall be limited to the maximum extent permitted by law. Nothing in these Terms shall limit liability for fraud, wilful misconduct, or death or personal injury caused by negligence.",
  },

  {
    id: "8",
    title: "Termination",
    content:
      "Openroot Systems reserves the right, at its sole discretion and without prior notice, to suspend, restrict, or permanently terminate your access to the Software if you breach any provision of these Terms, violate any applicable law including the Information Technology Act, 2000 or the Copyright Act, 1957, engage in any activity that is harmful to the Software, other users, or Openroot Systems, or upon receipt of a lawful direction from a competent government authority under Sections 69, 69A, or 69B of the Information Technology Act, 2000. Upon termination, all licences granted hereunder shall immediately cease, and you must destroy all copies of the Software in your possession. Termination shall not affect any accrued rights or remedies of Openroot Systems.",
  },

  {
    id: "9",
    title: "Governing Law",
    content:
      "These Terms of Use and any dispute, claim, or controversy arising out of or in connection with these Terms or the use of the Software, whether in contract, tort, statute, or otherwise, shall be governed by and construed in accordance with the laws of the Republic of India, including but not limited to the Indian Contract Act, 1872, the Information Technology Act, 2000 (as amended by the Information Technology (Amendment) Act, 2008), the Copyright Act, 1957, and the Consumer Protection Act, 2019. Subject to applicable arbitration provisions, the courts of competent jurisdiction at Kolkata, West Bengal, India shall have exclusive jurisdiction over any disputes arising from or relating to these Terms.",
  },

  {
    id: "10",
    title: "Changes to These Terms",
    content:
      "Openroot Systems reserves the right to revise, modify, or update these Terms at any time at its sole discretion. In the event of any material change, Openroot Systems will endeavour to provide reasonable notice through the Software interface or by electronic communication to your registered contact details. Your continued access to or use of the Software following the publication or notification of any revised Terms shall constitute your deemed acceptance of such changes as a valid and binding contract under Section 7 of the Indian Contract Act, 1872. If you do not agree to the revised Terms, you must immediately discontinue use of the Software and notify Openroot Systems in writing. The date of the most recent revision will be indicated at the top of this document.",
  },
];

export default function CoevasTerms() {
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
            Legal Document
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
                  Terms of Use
                </h1>

                <p className={styles.heroDesc}>
                  These Terms govern your
                  access to and use of the
                  Coevas Panel software
                  platform provided by
                  Openroot Systems. By
                  accessing or using the
                  Software, you agree to be
                  bound by these Terms in
                  accordance with the laws
                  of the Republic of India.
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

                    Legal Agreement
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

                    10 Sections
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
                    IT Act, 2000
                  </span>

                  <span
                    className={
                      styles.complianceTag
                    }
                  >
                    Copyright Act, 1957
                  </span>

                  <span
                    className={
                      styles.complianceTag
                    }
                  >
                    Indian Contract Act, 1872
                  </span>

                  <span
                    className={
                      styles.complianceTag
                    }
                  >
                    Consumer Protection Act, 2019
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
              Questions regarding these
              Terms?

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
              rights reserved. Governed by
              the laws of the Republic of
              India.
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
