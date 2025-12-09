import { useState } from "react";
import "./styles/ContactFollow.css";

export default function Elements() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleHeart = () => setIsOpen(prev => !prev);

  return (
    <section className="elements-section">
      <div className="elements-main">

        {/* ❤️ SLIDING / EXPANDING HEART BAND */}
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

        {/* 💜 HEART PANEL CONTENT */}
        <div className={`heart-panel ${isOpen ? "heart-panel--open" : ""}`}>
          <div className="heart-card">
            <h2 className="heart-title">Openroot Has A Heart</h2>

            <div className="heart-body">
              <p> <strong>Openroot Has A Heart</strong> is a safe corner of the world where we don’t pretend to have everything figured out. Here, <strong> you are allowed to feel —</strong> </p>

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
                window.open("https://www.facebook.com/openroothypersite", "_blank")
              }
            >
              Join Us →
            </button>
          </div>
        </div>

        {/* 📞 CONTACT + FOLLOW */}
        <div className="cf-wrapper">

          <div className="cf-block">
            <h3 className="cf-heading">Contact</h3>
            <div className="cf-icons-row">

              <a
                href="https://wa.me/917866049865"
                target="_blank"
                rel="noopener noreferrer"
                className="cf-icon"
                aria-label="WhatsApp"
              >
                <img src="/assets/whatsapp.svg" alt="WhatsApp" />
              </a>

              <a
                href="mailto:connect.openroot@gmail.com"
                className="cf-icon"
                aria-label="Email"
              >
                <img src="/assets/gmail.svg" alt="Gmail" />
              </a>

            </div>
          </div>

          <div className="cf-block">
            <h3 className="cf-heading">Follow</h3>
            <div className="cf-icons-row">

              <a
                href="https://x.com/comeonsom_"
                target="_blank"
                rel="noopener noreferrer"
                className="cf-icon"
                aria-label="X"
              >
                <img src="/assets/x.svg" alt="X" />
              </a>

              <a
                href="https://www.facebook.com/comeonsom"
                target="_blank"
                rel="noopener noreferrer"
                className="cf-icon"
                aria-label="Facebook"
              >
                <img src="/assets/facebook.svg" alt="Facebook" />
              </a>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
