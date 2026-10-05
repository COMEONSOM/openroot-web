import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, MotionConfig } from "framer-motion";

import "../components/styles/faq-modal.css";

/* ============================================================
   TYPES
============================================================ */

type Accent = "blue" | "mint" | "yellow" | "coral";

type FaqItemData = {
  question: string;
  answer: string;
};

type FaqSection = {
  section: string;
  icon: React.ReactNode;
  accent: Accent;
  items: FaqItemData[];
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
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
    <path d="M6 12v5c3.33 2 8.67 2 12 0v-5" />
  </svg>
);

const IconCode = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconSupport = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10" />
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5" />
  </svg>
);

const IconSearch = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="10" cy="10" r="7" />
    <line x1="15.5" y1="15.5" x2="21" y2="21" />
  </svg>
);

const IconNoResults = () => (
  <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="10" cy="10" r="7" />
    <line x1="15.5" y1="15.5" x2="21" y2="21" />
    <line x1="7" y1="10" x2="13" y2="10" />
  </svg>
);

/* ============================================================
   FAQ DATA
============================================================ */

const faqs: FaqSection[] = [
  {
    section: "Courses & Enrollment",
    icon: <IconGraduate />,
    accent: "blue",
    items: [
      {
        question: "Will I receive a certificate after completing the course?",
        answer: "Yes. A certificate will be provided after successful course completion.",
      },
      {
        question: "What is the value of this certificate?",
        answer: "Openroot Systems is MSME registered and industry focused.",
      },
      {
        question: "How to take a course in Openroot Systems?",
        answer: "Go to Released Softwares → Openroot Classes.",
      },
      {
        question: "How to make payment?",
        answer: "Complete payment from the course page.",
      },
      {
        question: "Can I contact directly for payment help?",
        answer: "Yes. Use WhatsApp support.",
      },
      {
        question: "Course duration & structure?",
        answer: "1 month • 8 classes • practical based.",
      },
      {
        question: "Do I get recordings & notes?",
        answer: "Yes. Lifetime access provided.",
      },
      {
        question: "What if I face problems during course?",
        answer: "Continuous support is provided.",
      },
    ],
  },

  {
    section: "Software Solutions",
    icon: <IconCode />,
    accent: "mint",
    items: [
      {
        question: "How to contact for software development?",
        answer: "Use WhatsApp from contact section.",
      },
      {
        question: "How is pricing decided?",
        answer: "Depends on requirements and features.",
      },
      {
        question: "Is pricing affordable?",
        answer: "Yes. Competitive custom pricing.",
      },
    ],
  },

  {
    section: "Issues & Support",
    icon: <IconSupport />,
    accent: "yellow",
    items: [
      {
        question: "What if my issue is not listed?",
        answer: "Contact us directly.",
      },
      {
        question: "How to report website problems?",
        answer: "Send screenshots/details via WhatsApp.",
      },
    ],
  },
];

const TOTAL_QUESTIONS = faqs.reduce((a, s) => a + s.items.length, 0);

/* ============================================================
   ANIMATION VARIANTS
============================================================ */

const answerVariants = {
  hidden: { height: 0, opacity: 0 },

  visible: {
    height: "auto",
    opacity: 1,
    transition: {
      height: { duration: 0.28, ease: EASE_OUT },
      opacity: { duration: 0.18, ease: "easeOut" as const, delay: 0.04 },
    },
  },

  exit: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.2, ease: EASE_IN },
      opacity: { duration: 0.1, ease: "easeIn" as const },
    },
  },
};

const panelVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: EASE_OUT },
  },
};

/* ============================================================
   MAIN COMPONENT
============================================================ */

export default function FaqModal({ isOpen, onClose }: FaqModalProps) {
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [activeItemId, setActiveItemId] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const searchRef = useRef<HTMLInputElement>(null);

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
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);

    return () => {
      cancelAnimationFrame(raf);
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
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

    const q = query.toLowerCase();

    const results: Array<{
      sectionName: string;
      accent: Accent;
      item: FaqItemData;
      id: string;
    }> = [];

    faqs.forEach((sec, sIdx) => {
      sec.items.forEach((item, iIdx) => {
        if (
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q)
        ) {
          results.push({
            sectionName: sec.section,
            accent: sec.accent,
            item,
            id: `search-${sIdx}-${iIdx}`,
          });
        }
      });
    });

    return results;
  }, [query]);

  const toggleItem = (id: string) => {
    setActiveItemId((prev) => (prev === id ? null : id));
  };

  const handleSectionSwitch = (idx: number) => {
    setActiveSectionIdx(idx);
    setActiveItemId(null);
    setQuery("");
  };

  const activeSection = faqs[activeSectionIdx];

  if (!isOpen) return null;

  return createPortal(
    <MotionConfig reducedMotion="user">
      <div className="openroot-faq">
        <motion.div
          className="openroot-faq__panel"
          role="dialog"
          aria-modal="true"
          aria-label="Frequently asked questions"
          variants={panelVariants}
          initial="hidden"
          animate="visible"
        >
          {/* TOP BAR */}
          <div className="openroot-faq__bar">
            <div className="openroot-faq__title">
              <span>FAQ</span>
              <span className="openroot-faq__count">
                {TOTAL_QUESTIONS} questions
              </span>
            </div>

            <div className="openroot-faq__search-wrap">
              <span className="openroot-faq__search-icon">
                <IconSearch />
              </span>

              <input
                ref={searchRef}
                className="openroot-faq__search"
                type="search"
                placeholder="Search questions"
                aria-label="Search questions"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveItemId(null);
                }}
              />

              {query && (
                <button
                  type="button"
                  className="openroot-faq__clear"
                  aria-label="Clear search"
                  onClick={() => {
                    setQuery("");
                    searchRef.current?.focus();
                  }}
                >
                  ×
                </button>
              )}
            </div>

            <button
              type="button"
              className="openroot-faq__close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          </div>

          {/* BODY */}
          <div className="openroot-faq__body">
            {/* SIDEBAR (stays in layout while searching, so nothing reflows) */}
            <nav
              className={`openroot-faq__sidebar${
                query ? " is-hidden" : ""
              }`}
              aria-label="FAQ sections"
              aria-hidden={query ? true : undefined}
            >
              <div className="openroot-faq__tabs">
                {faqs.map((sec, idx) => (
                  <button
                    key={sec.section}
                    type="button"
                    className={`openroot-faq__tab${
                      activeSectionIdx === idx ? " is-active" : ""
                    }`}
                    onClick={() => handleSectionSwitch(idx)}
                    aria-current={activeSectionIdx === idx ? "true" : undefined}
                    tabIndex={query ? -1 : 0}
                  >
                    <span
                      className={`openroot-faq__marker openroot-faq__marker--${sec.accent}`}
                    >
                      {sec.icon}
                    </span>
                    <span className="openroot-faq__tab-label">
                      {sec.section}
                    </span>
                    <span className="openroot-faq__tab-count">
                      {sec.items.length}
                    </span>
                  </button>
                ))}
              </div>

              <div className="openroot-faq__help">
                <p>Can't find your answer?</p>
                <a
                  className="openroot-faq__help-link"
                  href="mailto:connect.openroot@gmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={onClose}
                  tabIndex={query ? -1 : 0}
                >
                  Contact us
                </a>
              </div>
            </nav>

            {/* CONTENT */}
            <div className="openroot-faq__content">
              {searchResults !== null ? (
                searchResults.length === 0 ? (
                  <div className="openroot-faq__empty">
                    <span className="openroot-faq__empty-icon">
                      <IconNoResults />
                    </span>
                    <p className="openroot-faq__empty-title">
                      No results for "{query}"
                    </p>
                    <p className="openroot-faq__empty-sub">
                      Try another keyword.
                    </p>
                  </div>
                ) : (
                  <div className="openroot-faq__view">
                    <p className="openroot-faq__label">
                      {searchResults.length}{" "}
                      {searchResults.length === 1 ? "result" : "results"}
                    </p>

                    <div className="openroot-faq__list">
                      {searchResults.map(({ sectionName, accent, item, id }) => (
                        <FaqItem
                          key={id}
                          id={id}
                          faq={item}
                          tag={sectionName}
                          accent={accent}
                          isOpen={activeItemId === id}
                          onToggle={() => toggleItem(id)}
                        />
                      ))}
                    </div>
                  </div>
                )
              ) : (
                <div className="openroot-faq__view">
                  <div className="openroot-faq__heading">
                    <span className="openroot-faq__label">
                      {activeSection.items.length} questions
                    </span>
                    <h2 className="openroot-faq__h2">
                      {activeSection.section}
                    </h2>
                  </div>

                  <div className="openroot-faq__list">
                    {activeSection.items.map((faq, iIdx) => {
                      const id = `${activeSectionIdx}-${iIdx}`;

                      return (
                        <FaqItem
                          key={id}
                          id={id}
                          faq={faq}
                          accent={activeSection.accent}
                          isOpen={activeItemId === id}
                          onToggle={() => toggleItem(id)}
                        />
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </MotionConfig>,
    document.body
  );
}

/* ============================================================
   FAQ ITEM
============================================================ */

interface FaqItemProps {
  id: string;
  faq: FaqItemData;
  tag?: string;
  accent: Accent;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqItem({ id, faq, tag, accent, isOpen, onToggle }: FaqItemProps) {
  const panelId = `faq-answer-${id}`;

  return (
    <div className={`openroot-faq__item${isOpen ? " is-open" : ""}`}>
      <button
        type="button"
        className="openroot-faq__trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
      >
        <span className="openroot-faq__trigger-copy">
          {tag && (
            <span className={`openroot-faq__tag openroot-faq__tag--${accent}`}>
              {tag}
            </span>
          )}
          <span className="openroot-faq__question">{faq.question}</span>
        </span>

        <span className="openroot-faq__toggle" aria-hidden="true">
          {isOpen ? "−" : "+"}
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={panelId}
            variants={answerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ overflow: "hidden" }}
          >
            <div
              className={`openroot-faq__answer openroot-faq__answer--${accent}`}
            >
              {faq.answer.split("\n\n").map((para, pIdx) => (
                <p key={pIdx} className="openroot-faq__para">
                  {para}
                </p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}