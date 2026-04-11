import { useEffect, useRef, useState, useMemo } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import "../components/styles/faq-modal.css";


/* ============================================================
   TYPES
   ============================================================ */

type FaqItem       = { question: string; answer: string };
type FaqSection    = { section: string; icon: React.ReactNode; items: FaqItem[] };
type FaqModalProps = { isOpen: boolean; onClose: () => void };


/* ============================================================
   EASING
   ============================================================ */

const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];
const EASE_IN:  [number, number, number, number] = [0.4,  0, 1,   1];


/* ============================================================
   SVG ICONS — no emojis
   ============================================================ */

const IconGraduate = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
    <path d="M6 12v5c3.33 2 8.67 2 12 0v-5"/>
  </svg>
);

const IconCode = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <polyline points="16 18 22 12 16 6"/>
    <polyline points="8 6 2 12 8 18"/>
  </svg>
);

const IconSupport = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="10"/>
    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
    <line x1="12" y1="17" x2="12.01" y2="17" strokeWidth="2.5"/>
  </svg>
);

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="10" cy="10" r="7"/>
    <line x1="15.5" y1="15.5" x2="21" y2="21"/>
  </svg>
);

const IconChevron = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M3 6L8 11L13 6" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const IconClose = () => (
  <svg width="13" height="13" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M2 2L14 14M14 2L2 14" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);

const IconNoResults = () => (
  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="10" cy="10" r="7"/>
    <line x1="15.5" y1="15.5" x2="21" y2="21"/>
    <line x1="7" y1="10" x2="13" y2="10"/>
  </svg>
);


/* ============================================================
   DATA
   ============================================================ */

const faqs: FaqSection[] = [
  {
    section: "Courses & Enrollment",
    icon: <IconGraduate />,
    items: [
      {
        question: "Will I receive a certificate after completing the course?",
        answer:
          "Yes. A certificate will be provided after successful course completion. To be eligible, you must maintain at least 80% attendance and appear for the final exam.\n\nThe final exam is conducted at the end of the course and carries 100 marks, with a passing requirement of 80 marks (80%).\n\nIf you do not pass the exam, you will be allowed to reattempt after one month. A maximum of three reattempts is allowed. If you are still unable to pass, you will need to re-enroll in the course.\n\nYour final score will be mentioned on the certificate, which makes consistent participation and performance very important.",
      },
      {
        question: "What is the value of this certificate?",
        answer:
          "Yes, the certificate carries strong value. Openroot Systems is MSME registered, and the trainer is Google Analytics certified with over 5 years of teaching experience.\n\nThis ensures that the learning and certification are based on real industry knowledge and practical expertise.\n\nYou can confidently showcase this certificate on your LinkedIn profile or include it in your CV.",
      },
      {
        question: "How to take a course in Openroot Systems?",
        answer:
          "Go to Released Softwares → Openroot Classes. Login is required. Select your course (Prompt Engineering / Investing), check syllabus, then enroll.",
      },
      {
        question: "How to make payment?",
        answer:
          "Inside the course page, complete payment. Then download your invoice and click 'Send Proof on WhatsApp' to send details automatically.",
      },
      {
        question: "Can I contact directly for payment help?",
        answer:
          "Yes. Use the WhatsApp button in Contact section. You will get manual guidance for payment.",
      },
      {
        question: "Course duration & structure?",
        answer:
          "Courses are 1 month long. 2 classes per week (total 8 classes). Fully detailed and practical.",
      },
      {
        question: "Do I get recordings & notes?",
        answer:
          "Yes. All recordings, notes, and materials are uploaded to Google Drive with lifetime access.",
      },
      {
        question: "What if I face problems during course?",
        answer:
          "All doubts are solved in a dedicated group. Continuous support is provided.",
      },
    ],
  },
  {
    section: "Software Solutions",
    icon: <IconCode />,
    items: [
      {
        question: "How to contact for software development?",
        answer:
          "Click WhatsApp from Contact section. A Google Meet will be scheduled to discuss requirements.",
      },
      {
        question: "How is pricing decided?",
        answer:
          "Pricing depends on features, requirements, and technology. All solutions are custom-made.",
      },
      {
        question: "Is pricing affordable?",
        answer:
          "Yes. Openroot Systems offers high-quality, custom-built solutions at a 20–30% discounted rate while maintaining strong industry standards.",
      },
    ],
  },
  {
    section: "Issues & Support",
    icon: <IconSupport />,
    items: [
      {
        question: "What if my issue is not listed?",
        answer:
          "Contact via WhatsApp or Email from Contact section. We will assist you directly.",
      },
      {
        question: "How to report website problems?",
        answer:
          "Send details/screenshots via WhatsApp or email. Issues are resolved quickly.",
      },
    ],
  },
];


/* ============================================================
   MOTION VARIANTS
   ============================================================ */

const answerVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: {
    height:  "auto",
    opacity: 1,
    transition: {
      height:  { duration: 0.32, ease: EASE_OUT },
      opacity: { duration: 0.20, ease: "easeOut" as const, delay: 0.05 },
    },
  },
  exit: {
    height:  0,
    opacity: 0,
    transition: {
      height:  { duration: 0.22, ease: EASE_IN },
      opacity: { duration: 0.12, ease: "easeIn" as const },
    },
  },
};

const panelVariants = {
  hidden:  { opacity: 0, scale: 0.94, y: 20 },
  visible: {
    opacity: 1, scale: 1, y: 0,
    transition: { duration: 0.34, ease: EASE_OUT, delay: 0.06 },
  },
};


/* ============================================================
   MAIN COMPONENT
   ============================================================ */

export default function FaqModal({ isOpen, onClose }: FaqModalProps) {
  const [activeSectionIdx, setActiveSectionIdx] = useState(0);
  const [activeItemId,     setActiveItemId]     = useState<string | null>(null);
  const [query,            setQuery]            = useState("");

  const closeRef  = useRef<HTMLButtonElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // ESC key + scroll lock + focus — ONLY ESC and close button dismiss the modal
  useEffect(() => {
    if (!isOpen) return;
    const raf = requestAnimationFrame(() => searchRef.current?.focus());
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setActiveSectionIdx(0);
      setActiveItemId(null);
      setQuery("");
    }
  }, [isOpen]);

  // Search — flat list across all sections
  const searchResults = useMemo(() => {
    if (!query.trim()) return null;
    const q = query.toLowerCase();
    const results: Array<{ sectionName: string; item: FaqItem; id: string }> = [];
    faqs.forEach((sec, sIdx) => {
      sec.items.forEach((item, iIdx) => {
        if (
          item.question.toLowerCase().includes(q) ||
          item.answer.toLowerCase().includes(q)
        ) {
          results.push({ sectionName: sec.section, item, id: `search-${sIdx}-${iIdx}` });
        }
      });
    });
    return results;
  }, [query]);

  const toggleItem = (id: string) =>
    setActiveItemId(prev => (prev === id ? null : id));

  const handleSectionSwitch = (idx: number) => {
    setActiveSectionIdx(idx);
    setActiveItemId(null);
    setQuery("");
  };

  const activeSection = faqs[activeSectionIdx];

  if (!isOpen) return null;

  return createPortal(
    <div
      className="faq-fullscreen"
      role="dialog"
      aria-modal="true"
      aria-label="Frequently Asked Questions"
    >

      {/* ── BACKDROP — purely visual, no click handler ─────── */}
      <div className="faq-backdrop" aria-hidden="true" />

      {/* ── PANEL ─────────────────────────────────────────── */}
      <motion.div
        className="faq-panel"
        variants={panelVariants}
        initial="hidden"
        animate="visible"
      >

        {/* TOP HEADER */}
        <div className="faq-header">
          <div className="faq-header-left">
            <span className="faq-live-dot" aria-hidden="true" />
            <span className="faq-header-title">FAQ</span>
            <span className="faq-header-count">
              {faqs.reduce((a, s) => a + s.items.length, 0)} questions
            </span>
          </div>

          {/* Search */}
          <div className="faq-search-wrap">
            <span className="faq-search-icon"><IconSearch /></span>
            <input
              ref={searchRef}
              className="faq-search"
              type="search"
              placeholder="Search questions…"
              value={query}
              onChange={e => { setQuery(e.target.value); setActiveItemId(null); }}
              aria-label="Search FAQ"
            />
            {query && (
              <button
                className="faq-search-clear"
                onClick={() => { setQuery(""); searchRef.current?.focus(); }}
                aria-label="Clear search"
              >
                <IconClose />
              </button>
            )}
          </div>

          {/* Close — only intentional dismiss */}
          <button
            ref={closeRef}
            className="faq-close-btn"
            onClick={onClose}
            aria-label="Close FAQ"
          >
            <span className="faq-esc-badge" aria-hidden="true">ESC</span>
            <span>Close</span>
          </button>
        </div>

        {/* BODY */}
        <div className="faq-body">

          {/* SIDEBAR */}
          {!query && (
            <nav className="faq-sidebar" aria-label="FAQ categories">
              {faqs.map((sec, idx) => (
                <button
                  key={idx}
                  className={`faq-tab${activeSectionIdx === idx ? " faq-tab--active" : ""}`}
                  onClick={() => handleSectionSwitch(idx)}
                  aria-current={activeSectionIdx === idx ? "true" : undefined}
                >
                  <span className="faq-tab-icon">{sec.icon}</span>
                  <span className="faq-tab-label">{sec.section}</span>
                  <span className="faq-tab-count">{sec.items.length}</span>
                  {activeSectionIdx === idx && (
                    <motion.span
                      className="faq-tab-indicator"
                      layoutId="faq-tab-indicator"
                      transition={{ duration: 0.28, ease: EASE_OUT }}
                    />
                  )}
                </button>
              ))}

              <div className="faq-sidebar-help">
                <p>Can't find your answer?</p>
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
          )}

          {/* CONTENT */}
          <div className="faq-content" role="list">

            {/* Search results */}
            {searchResults !== null && (
              <>
                {searchResults.length === 0 ? (
                  <div className="faq-empty">
                    <span className="faq-empty-icon"><IconNoResults /></span>
                    <p className="faq-empty-title">No results for "{query}"</p>
                    <p className="faq-empty-sub">
                      Try a different keyword or browse the categories.
                    </p>
                  </div>
                ) : (
                  <>
                    <p className="faq-results-label">
                      {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
                    </p>
                    {searchResults.map(({ sectionName, item, id }) => (
                      <FaqItem
                        key={id}
                        id={id}
                        faq={item}
                        tag={sectionName}
                        isOpen={activeItemId === id}
                        onToggle={() => toggleItem(id)}
                      />
                    ))}
                  </>
                )}
              </>
            )}

            {/* Section items */}
            {searchResults === null && (
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSectionIdx}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0, transition: { duration: 0.22, ease: EASE_OUT } }}
                  exit={{ opacity: 0, x: -10, transition: { duration: 0.14, ease: EASE_IN } }}
                  className="faq-section-view"
                >
                  <div className="faq-section-heading">
                    <span className="faq-section-heading-icon">{activeSection.icon}</span>
                    <div>
                      <h3 className="faq-section-heading-title">{activeSection.section}</h3>
                      <p className="faq-section-heading-sub">
                        {activeSection.items.length} question{activeSection.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>

                  {activeSection.items.map((faq, iIdx) => {
                    const id = `${activeSectionIdx}-${iIdx}`;
                    return (
                      <FaqItem
                        key={id}
                        id={id}
                        faq={faq}
                        isOpen={activeItemId === id}
                        onToggle={() => toggleItem(id)}
                      />
                    );
                  })}
                </motion.div>
              </AnimatePresence>
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
  id:       string;
  faq:      FaqItem;
  tag?:     string;
  isOpen:   boolean;
  onToggle: () => void;
}

function FaqItem({ id, faq, tag, isOpen, onToggle }: FaqItemProps) {
  return (
    <div className={`faq-item${isOpen ? " faq-item--open" : ""}`} role="listitem">
      <button
        className="faq-item-trigger"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${id}`}
        id={`faq-trigger-${id}`}
      >
        <div className="faq-item-trigger-left">
          {tag && <span className="faq-item-tag">{tag}</span>}
          <span className="faq-item-question">{faq.question}</span>
        </div>
        <span className={`faq-item-chevron${isOpen ? " faq-item-chevron--open" : ""}`}>
          <IconChevron />
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            id={`faq-answer-${id}`}
            role="region"
            aria-labelledby={`faq-trigger-${id}`}
            variants={answerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{ overflow: "hidden" }}
          >
            <div className="faq-item-answer">
              {faq.answer.split("\n\n").map((para, pIdx) => (
                <p key={pIdx} className="faq-item-answer-para">{para}</p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
