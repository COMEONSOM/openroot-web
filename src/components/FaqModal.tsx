import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

import "../components/styles/faq-modal.css";

/* ============================================================
   TYPES
============================================================ */

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSection = {
  section: string;
  icon: React.ReactNode;
  items: FaqItem[];
};

type FaqModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

/* ============================================================
   EASING
============================================================ */

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

const EASE_IN: [number, number, number, number] = [0.4, 0, 1, 1];

/* ============================================================
   SVG ICONS
============================================================ */

const IconGraduate = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3.33 2 8.67 2 12 0v-5" />
  </svg>
);

const IconCode = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconSupport = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line
      x1="12"
      y1="17"
      x2="12.01"
      y2="17"
      strokeWidth="2.5"
    />
  </svg>
);

const IconSearch = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="10" cy="10" r="7" />
    <line
      x1="15.5"
      y1="15.5"
      x2="21"
      y2="21"
    />
  </svg>
);

const IconChevron = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M3 6L8 11L13 6"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const IconClose = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 16 16"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M2 2L14 14M14 2L2 14"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </svg>
);

const IconNoResults = () => (
  <svg
    width="36"
    height="36"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="10" cy="10" r="7" />
    <line
      x1="15.5"
      y1="15.5"
      x2="21"
      y2="21"
    />
    <line
      x1="7"
      y1="10"
      x2="13"
      y2="10"
    />
  </svg>
);

/* ============================================================
   FAQ DATA
============================================================ */

const faqs: FaqSection[] = [
  {
    section: "Courses & Enrollment",
    icon: <IconGraduate />,
    items: [
      {
        question:
          "Will I receive a certificate after completing the course?",
        answer:
          "Yes. A certificate will be provided after successful course completion.",
      },
      {
        question:
          "What is the value of this certificate?",
        answer:
          "Openroot Systems is MSME registered and industry focused.",
      },
      {
        question:
          "How to take a course in Openroot Systems?",
        answer:
          "Go to Released Softwares → Openroot Classes.",
      },
      {
        question:
          "How to make payment?",
        answer:
          "Complete payment from the course page.",
      },
      {
        question:
          "Can I contact directly for payment help?",
        answer:
          "Yes. Use WhatsApp support.",
      },
      {
        question:
          "Course duration & structure?",
        answer:
          "1 month • 8 classes • practical based.",
      },
      {
        question:
          "Do I get recordings & notes?",
        answer:
          "Yes. Lifetime access provided.",
      },
      {
        question:
          "What if I face problems during course?",
        answer:
          "Continuous support is provided.",
      },
    ],
  },

  {
    section: "Software Solutions",
    icon: <IconCode />,
    items: [
      {
        question:
          "How to contact for software development?",
        answer:
          "Use WhatsApp from contact section.",
      },
      {
        question:
          "How is pricing decided?",
        answer:
          "Depends on requirements and features.",
      },
      {
        question:
          "Is pricing affordable?",
        answer:
          "Yes. Competitive custom pricing.",
      },
    ],
  },

  {
    section: "Issues & Support",
    icon: <IconSupport />,
    items: [
      {
        question:
          "What if my issue is not listed?",
        answer:
          "Contact us directly.",
      },
      {
        question:
          "How to report website problems?",
        answer:
          "Send screenshots/details via WhatsApp.",
      },
    ],
  },
];

/* ============================================================
   ANIMATION VARIANTS
============================================================ */

const answerVariants = {
  hidden: {
    height: 0,
    opacity: 0,
  },

  visible: {
    height: "auto",
    opacity: 1,

    transition: {
      height: {
        duration: 0.32,
        ease: EASE_OUT,
      },

      opacity: {
        duration: 0.2,
        ease: "easeOut" as const,
        delay: 0.05,
      },
    },
  },

  exit: {
    height: 0,
    opacity: 0,

    transition: {
      height: {
        duration: 0.22,
        ease: EASE_IN,
      },

      opacity: {
        duration: 0.12,
        ease: "easeIn" as const,
      },
    },
  },
};

const panelVariants = {
  hidden: {
    opacity: 0,
    scale: 0.94,
    y: 20,
  },

  visible: {
    opacity: 1,
    scale: 1,
    y: 0,

    transition: {
      duration: 0.34,
      ease: EASE_OUT,
      delay: 0.06,
    },
  },
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function FaqModal({
  isOpen,
  onClose,
}: FaqModalProps) {
  const [activeSectionIdx, setActiveSectionIdx] =
    useState(0);

  const [activeItemId, setActiveItemId] =
    useState<string | null>(null);

  const [query, setQuery] =
    useState("");

  const searchRef =
    useRef<HTMLInputElement>(null);

  /* ============================================================
     EFFECTS
  ============================================================ */

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const raf = requestAnimationFrame(() => {
      searchRef.current?.focus();
    });

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);

      document.body.style.overflow = "";

      document.removeEventListener(
        "keydown",
        onKey
      );
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setActiveSectionIdx(0);

      setActiveItemId(null);

      setQuery("");
    }
  }, [isOpen]);

  /* ============================================================
     SEARCH
  ============================================================ */

  const searchResults = useMemo(() => {
    if (!query.trim()) return null;

    const q =
      query.toLowerCase();

    const results: Array<{
      sectionName: string;
      item: FaqItem;
      id: string;
    }> = [];

    faqs.forEach((sec, sIdx) => {
      sec.items.forEach((item, iIdx) => {
        if (
          item.question
            .toLowerCase()
            .includes(q) ||
          item.answer
            .toLowerCase()
            .includes(q)
        ) {
          results.push({
            sectionName: sec.section,
            item,
            id: `search-${sIdx}-${iIdx}`,
          });
        }
      });
    });

    return results;
  }, [query]);

  const toggleItem = (id: string) => {
    setActiveItemId((prev) =>
      prev === id ? null : id
    );
  };

  const handleSectionSwitch = (
    idx: number
  ) => {
    setActiveSectionIdx(idx);

    setActiveItemId(null);

    setQuery("");
  };

  const activeSection =
    faqs[activeSectionIdx];

  if (!isOpen) return null;

  return createPortal(
    <div
      className="faq-fullscreen"
      role="dialog"
      aria-modal="true"
      aria-label="Frequently Asked Questions"
    >
      {/* BACKDROP */}

      <div
        className="faq-backdrop"
        aria-hidden="true"
      />

      {/* PANEL */}

      <motion.div
        className="faq-panel"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
      >
        {/* HEADER */}

        <div className="faq-header">
          <div className="faq-header-left">
            <span
              className="faq-live-dot"
              aria-hidden="true"
            />

            <span className="faq-header-title">
              FAQ
            </span>

            <span className="faq-header-count">
              {
                faqs.reduce(
                  (a, s) =>
                    a + s.items.length,
                  0
                )
              }{" "}
              questions
            </span>
          </div>

          {/* SEARCH */}

          <div className="faq-search-wrap">
            <span className="faq-search-icon">
              <IconSearch />
            </span>

            <input
              ref={searchRef}
              className="faq-search"
              type="search"
              placeholder="Search questions..."
              value={query}
              onChange={(e) => {
                setQuery(
                  e.target.value
                );

                setActiveItemId(null);
              }}
            />

            {query && (
              <button
                className="faq-search-clear"
                onClick={() => {
                  setQuery("");

                  searchRef.current?.focus();
                }}
              >
                <IconClose />
              </button>
            )}
          </div>

          {/* CLOSE */}

          <button
            className="faq-close-btn"
            onClick={onClose}
          >
            <span>
              Close
            </span>
          </button>
        </div>

        {/* BODY */}

        <div className="faq-body">
          {/* SIDEBAR */}

          <nav
            className={`faq-sidebar${
              query
                ? " faq-sidebar--hidden"
                : ""
            }`}
          >
            {faqs.map((sec, idx) => (
              <button
                key={idx}
                className={`faq-tab${
                  activeSectionIdx === idx
                    ? " faq-tab--active"
                    : ""
                }`}
                onClick={() =>
                  handleSectionSwitch(idx)
                }
              >
                <span className="faq-tab-icon">
                  {sec.icon}
                </span>

                <span className="faq-tab-label">
                  {sec.section}
                </span>

                <span className="faq-tab-count">
                  {sec.items.length}
                </span>
              </button>
            ))}

            {/* HELP */}

            <div className="faq-sidebar-help">
              <p>
                Can't find your answer?
              </p>

              <a
                className="faq-sidebar-cta"
                href="mailto:connect.openroot@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
              >
                Contact us →
              </a>
            </div>
          </nav>

          {/* CONTENT */}

          <div className="faq-content">
            {/* SEARCH RESULTS */}

            {searchResults !== null ? (
              <>
                {searchResults.length ===
                0 ? (
                  <div className="faq-empty">
                    <span className="faq-empty-icon">
                      <IconNoResults />
                    </span>

                    <p className="faq-empty-title">
                      No results for "
                      {query}"
                    </p>

                    <p className="faq-empty-sub">
                      Try another keyword.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="faq-results-label">
                      {
                        searchResults.length
                      }{" "}
                      results
                    </p>

                    {searchResults.map(
                      ({
                        sectionName,
                        item,
                        id,
                      }) => (
                        <FaqItem
                          key={id}
                          id={id}
                          faq={item}
                          tag={
                            sectionName
                          }
                          isOpen={
                            activeItemId ===
                            id
                          }
                          onToggle={() =>
                            toggleItem(id)
                          }
                        />
                      )
                    )}
                  </>
                )}
              </>
            ) : (
              <motion.div
                className="faq-section-view"
                initial={{
                  opacity: 0.92,
                }}
                animate={{
                  opacity: 1,
                }}
                transition={{
                  duration: 0.18,
                  ease: EASE_OUT,
                }}
              >
                <div className="faq-section-heading">
                  <span className="faq-section-heading-icon">
                    {
                      activeSection.icon
                    }
                  </span>

                  <div>
                    <h3 className="faq-section-heading-title">
                      {
                        activeSection.section
                      }
                    </h3>

                    <p className="faq-section-heading-sub">
                      {
                        activeSection
                          .items.length
                      }{" "}
                      questions
                    </p>
                  </div>
                </div>

                {activeSection.items.map(
                  (faq, iIdx) => {
                    const id = `${activeSectionIdx}-${iIdx}`;

                    return (
                      <FaqItem
                        key={id}
                        id={id}
                        faq={faq}
                        isOpen={
                          activeItemId ===
                          id
                        }
                        onToggle={() =>
                          toggleItem(id)
                        }
                      />
                    );
                  }
                )}
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </div>,
    document.body
  );
}

/* ============================================================
   FAQ ITEM
============================================================ */

interface FaqItemProps {
  id: string;
  faq: FaqItem;
  tag?: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem({
  faq,
  tag,
  isOpen,
  onToggle,
}: FaqItemProps) {
  return (
    <div
      className={`faq-item${
        isOpen
          ? " faq-item--open"
          : ""
      }`}
    >
      <button
        className="faq-item-trigger"
        onClick={onToggle}
      >
        <div className="faq-item-trigger-left">
          {tag && (
            <span className="faq-item-tag">
              {tag}
            </span>
          )}

          <span className="faq-item-question">
            {faq.question}
          </span>
        </div>

        <span
          className={`faq-item-chevron${
            isOpen
              ? " faq-item-chevron--open"
              : ""
          }`}
        >
          <IconChevron />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            variants={
              answerVariants
            }
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{
              overflow:
                "hidden",
            }}
          >
            <div className="faq-item-answer">
              {faq.answer
                .split("\n\n")
                .map(
                  (
                    para,
                    pIdx
                  ) => (
                    <p
                      key={pIdx}
                      className="faq-item-answer-para"
                    >
                      {para}
                    </p>
                  )
                )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}