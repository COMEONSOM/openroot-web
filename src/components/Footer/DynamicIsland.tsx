import { useState } from "react";
import "./styles-footer/DynamicIsland.css";

export default function DynamicIsland() {
  const [isOpen, setIsOpen] = useState(false);
  const toggleHeart = () => setIsOpen(prev => !prev);

  return (
    <section className="dynamic-island">

      {/* ======================================================
         SINGLE STRUCTURAL SHELL
         ====================================================== */}
      <div className="dynamic-island-shell">

        {/* 💚 FOOTER BASE (FULL WIDTH) */}
        <section className="footer-details">

          {/* 🔗 LINKS */}
          <div className="footer-links">
            <a
              href="https://comeonsom.github.io/openroot-helping-hand/other_files/terms.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Terms & Conditions
            </a>

            <a
              href="https://comeonsom.github.io/openroot-helping-hand/other_files/founder.html"
              target="_blank"
              rel="noopener noreferrer"
            >
              Founder Details
            </a>

            <a
              href="#"
              target="_blank"
              rel="noopener noreferrer"
            >
              Feedback Form
            </a>

            <a
              href="https://youtube.com/@knowledge.openroot?si=9QyqR0bMkKmY8HPq"
              target="_blank"
              rel="noopener noreferrer"
            >
              Watch Content
            </a>

            <a
              href="https://openroot-classes-firebase.web.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Openroot Classes
            </a>

            <a
              href="https://comeonsom.github.io/openroot-helping-hand/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Job Updates
            </a>

            <a
              href="https://comeonsom.github.io/openroot-travel-expense-manager/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Expense Manager
            </a>

            <a
              href="https://openroot-time-ai-module.web.app/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Nior AI
            </a>
          </div>

          {/* 📞 CONTACT */}
          <div className="cf-block">
            <h3 className="cf-heading">Contact</h3>
            <div className="cf-icons-row">
              <a
                href="https://wa.me/917866049865"
                target="_blank"
                rel="noopener noreferrer"
                className="cf-icon"
              >
                <img src="/assets/whatsapp.svg" alt="WhatsApp" />
              </a>

              <a
                href="mailto:connect.openroot@gmail.com"
                className="cf-icon"
              >
                <img src="/assets/gmail.svg" alt="Gmail" />
              </a>
            </div>
          </div>

          {/* 🌐 FOLLOW */}
          <div className="cf-block">
            <h3 className="cf-heading">Follow</h3>
            <div className="cf-icons-row">
              <a
                href="https://x.com/comeonsom_"
                target="_blank"
                rel="noopener noreferrer"
                className="cf-icon"
              >
                <img src="/assets/x.svg" alt="X" />
              </a>

              <a
                href="https://www.facebook.com/comeonsom"
                target="_blank"
                rel="noopener noreferrer"
                className="cf-icon"
              >
                <img src="/assets/facebook.svg" alt="Facebook" />
              </a>
            </div>
          </div>

        </section>

        {/* ❤️ HEART — PART OF SAME SHELL */}
        <section className="dynamic-island-heart">
          <section className="elements-section">
            <div className="elements-main">

              <button
                type="button"
                className={`heart-band ${isOpen ? "heart-band--open" : ""}`}
                onClick={toggleHeart}
                aria-expanded={isOpen}
              >
                <span className="heart-band-text">💗 Openroot Has A Heart</span>
                <span className="heart-band-chevron">
                  {isOpen ? "▼" : "►"}
                </span>
              </button>

              <div className={`heart-panel ${isOpen ? "heart-panel--open" : ""}`}>
                <div className="heart-card">
                  <h2 className="heart-title">Openroot Has A Heart</h2>

                  <div className="heart-body">
                    <p>
                      <strong>Openroot Has A Heart</strong> is a safe corner of the world
                      where we don’t pretend to have everything figured out.
                    </p>

                    <ul>
                      <li>the <strong>softness</strong> you protect behind sarcasm.</li>
                      <li>the <strong>battles</strong> no one claps for.</li>
                      <li>the <strong>nights</strong> you heal yourself quietly.</li>
                      <li>the <strong>dreams</strong> you stopped telling people about.</li>
                    </ul>

                    <p>
                      This is not a platform, not a brand —
                      <strong> it’s a home for every imperfect story.</strong>
                    </p>
                  </div>

                  <button
                    type="button"
                    className="heart-cta"
                    onClick={() =>
                      window.open(
                        "https://www.facebook.com/openroothypersite",
                        "_blank"
                      )
                    }
                  >
                    Join Us →
                  </button>
                </div>
              </div>

            </div>
          </section>
        </section>

      </div>
    </section>
  );
}
