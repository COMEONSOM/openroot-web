import { useState, useEffect } from "react";
import "./styles-footer/DynamicIsland.css";
import CertificateModal from "../CertificateModal";

export default function DynamicIsland() {

  const [isOpen, setIsOpen] = useState(false);
  const toggleHeart = () => setIsOpen(prev => !prev);

  const [openVerify, setOpenVerify] = useState(false);

  useEffect(() => {

    const params = new URLSearchParams(window.location.search);
    const certId = params.get("cert");

    if (certId) {
      setOpenVerify(true);
    }

  }, []);

  // ======================================================
  // SCROLL TO SOFTWARE SECTION
  // ======================================================

  const scrollToSoftwares = () => {

    const section = document.getElementById(
      "released-softwares-section"
    );

    if (section) {

      section.scrollIntoView({
        behavior: "smooth"
      });

    }

  };

  return (

    <section className="dynamic-island">

      <div className="dynamic-island-shell">

        {/* ======================================================
           FOOTER BASE
        ====================================================== */}

        <section className="footer-details">

          {/* LINKS */}

          <div className="footer-links">

            <a href="#released-softwares-section">
              Released Softwares
            </a>

            <a
              href="https://comeonsom.github.io/openroot-helping-hand/other_files/terms.html"
              rel="external"
            >
              Terms & Conditions
            </a>

            <a
              href="https://comeonsom.github.io/openroot-helping-hand/other_files/founder.html"
              rel="external"
            >
              Founder Details
            </a>

            <a
              href="#"
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
              href="https://www.youtube.com/channel/UCx4LkoSQfZtlIKDtH9y3zRA"
              target="_blank"
              rel="noopener noreferrer"
            >
              Music Production
            </a>

            <button
              className="verify-link"
              onClick={() => setOpenVerify(true)}
            >
              Verify Certificate
            </button>

          </div>

          {/* CONTACT */}

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

          {/* FOLLOW */}

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

        <CertificateModal
          isOpen={openVerify}
          onClose={() => setOpenVerify(false)}
        />

        {/* ======================================================
           HEART SECTION
        ====================================================== */}

        <section className="dynamic-island-heart">

          <section className="elements-section">

            <div className="elements-main">

              <button
                type="button"
                className={`heart-band ${isOpen ? "heart-band--open" : ""}`}
                onClick={toggleHeart}
              >

                <span className="heart-band-text">
                  💗 Openroot Has A Heart
                </span>

                <span className="heart-band-chevron">
                  {isOpen ? "▼" : "►"}
                </span>

              </button>

              <div className={`heart-panel ${isOpen ? "heart-panel--open" : ""}`}>

                <div className="heart-card">

                  <h2 className="heart-title">
                    Openroot Has A Heart
                  </h2>

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
                    className="heart-cta"
                    onClick={() =>
                      window.open(
                        "https://www.facebook.com/OpenrootSystems",
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