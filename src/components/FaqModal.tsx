import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "../components/styles/faq-modal.css";

type FaqModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type FaqItem = {
  question: string;
  answer: string;
};

type FaqSection = {
  section: string;
  items: FaqItem[];
};

const faqs: FaqSection[] = [
  {
    section: "Courses & Enrollment",
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
    section: "Software Solutions & Support",
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
    section: "Other Issues & Support",
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

export default function FaqModal({ isOpen, onClose }: FaqModalProps) {
  const [activeIndex, setActiveIndex] = useState<string | null>(null);
  const [activeSection, setActiveSection] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEsc);

    // 🔥 LOCK BACKGROUND
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="faq-fullscreen">

      {/* CLOSE BUTTON */}
      <button className="faq-close-btn" onClick={onClose}>
        ✕
      </button>

      {/* FAQ CONTENT */}
      <div className="faq-container">
        {faqs.map((section, sIndex) => (
          <div key={sIndex} className="faq-section">

            {/* SECTION HEADER */}
            <div
              className="faq-section-header"
              onClick={() =>
                setActiveSection(activeSection === sIndex ? null : sIndex)
              }
            >
              <span className="faq-section-title">
                {section.section}
              </span>

              <span className="faq-section-icon">
                {activeSection === sIndex ? "−" : "+"}
              </span>
            </div>

            {/* SECTION CONTENT */}
            <div
              className={`faq-section-content ${
                activeSection === sIndex ? "open" : ""
              }`}
            >
              {section.items.map((faq, index) => {
                const id = `${sIndex}-${index}`;

                return (
                  <div key={id} className="faq-box">

                    <div
                      className="faq-question-row"
                      onClick={() =>
                        setActiveIndex(activeIndex === id ? null : id)
                      }
                    >
                      <span>{faq.question}</span>
                      <span className="faq-icon">
                        {activeIndex === id ? "−" : "+"}
                      </span>
                    </div>

                    <div
                      className={`faq-answer ${
                        activeIndex === id ? "open" : ""
                      }`}
                    >
                      <p>{faq.answer}</p>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>
        ))}
      </div>

    </div>,
    document.body
  );
}