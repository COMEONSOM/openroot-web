import { useState, useEffect, useRef, useContext } from "react";
import gsap from "gsap";

import CertificateModal from "../components/CertificateModal";
import FaqModal         from "../components/FaqModal";
import { useTheme } from "../context/ThemeContext";

import "./styles/Footer.css";


// ─── Data ─────────────────────────────────────────────────────────────────────

const TRUST_BADGES = [
  { src: "/assets/google-analytics-badge.avif", alt: "Google Analytics Certified" },
  { src: "/assets/msme-logo.avif",              alt: "MSME Registered"            },
  { src: "/assets/hubspot-badge.avif",          alt: "HubSpot Certified"          },
];

const SITEMAP_LINKS = [
  {
    label:  "Terms & Conditions",
    href:   "https://comeonsom.github.io/openroot-helping-hand/other_files/terms.html",
    rel:    "external" as const,
  },
  {
    label:  "Founder Details",
    href:   "https://comeonsom.github.io/openroot-helping-hand/other_files/founder.html",
    rel:    "external" as const,
  },
  {
    label:  "Released Softwares",
    href:   "#released-softwares-section",
  },
  {
    label:  "Watch Content",
    href:   "https://youtube.com/@knowledge.openroot?si=9QyqR0bMkKmY8HPq",
    rel:    "noopener noreferrer" as const,
    target: "_blank" as const,
  },
  {
    label:  "Music Production",
    href:   "https://www.youtube.com/channel/UCx4LkoSQfZtlIKDtH9y3zRA",
    rel:    "noopener noreferrer" as const,
    target: "_blank" as const,
  },
];


// ─── Component ────────────────────────────────────────────────────────────────

export default function Footer() {
  const footerRef = useRef<HTMLElement | null>(null);

  const [openFaq, setOpenFaq] = useState(false);
  const [openVerify, setOpenVerify] = useState(false);

  const { resolved } = useTheme();

  // ✅ Theme-based logo
  const logoSrc =
    resolved === "dark"
      ? "/assets/openroot-white-nobg.avif" // white logo
      : "/assets/openroot-black-nobg.png"; // dark logo (add this file)

  // Auto-open certificate modal
  useEffect(() => {
    const certId = new URLSearchParams(window.location.search).get("cert");
    if (certId) setOpenVerify(true);
  }, []);

  // GSAP animation
  useEffect(() => {
    if (!footerRef.current) return;
    gsap.fromTo(
      footerRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power2.out" }
    );
  }, []);

  return (
    <footer ref={footerRef} className="footer-root">

      {/* MAIN */}
      <div className="footer-main">
        <div className="footer-grid">

          {/* SITEMAP */}
          <nav className="footer-sitemap" aria-label="Site map">

            {/* ✅ REAL LOGO (dynamic) */}
            <img
              src={logoSrc}
              alt="Openroot"
              className="footer-logo-img"
            />

            <span className="footer-label">Sitemap</span>

            <div className="footer-links">
              {SITEMAP_LINKS.map(({ label, href, rel, target }) => (
                <a key={label} href={href} rel={rel} target={target}>
                  {label}
                </a>
              ))}

              <a href="#" onClick={(e) => { e.preventDefault(); setOpenFaq(true); }}>
                FAQs
              </a>

              <button
                className="verify-btn"
                onClick={() => setOpenVerify(true)}
                type="button"
              >
                Verify Certificate
              </button>
            </div>
          </nav>

          {/* CONTACT */}
          <div className="footer-card">
            <span className="footer-label">Contact</span>
            <div className="footer-icon-row">
              <a
                href="https://wa.me/917866049865"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-icon-btn"
              >
                <img src="/assets/whatsapp.svg" alt="WhatsApp" />
              </a>

              <a
                href="mailto:connect.openroot@gmail.com"
                className="footer-icon-btn"
              >
                <img src="/assets/gmail.svg" alt="Gmail" />
              </a>
            </div>
          </div>

          {/* FOLLOW */}
          <div className="footer-card">
            <span className="footer-label">Follow</span>
            <div className="footer-icon-row">
              <a
                href="https://x.com/comeonsom_"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-icon-btn"
              >
                <img src="/assets/x.svg" alt="X" />
              </a>

              <a
                href="https://www.facebook.com/OpenrootSystems"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-icon-btn"
              >
                <img src="/assets/facebook.svg" alt="Facebook" />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* BASE */}
      <div className="footer-base">

        <div className="footer-trust">
          {TRUST_BADGES.map(({ src, alt }) => (
            <div key={src} className="footer-trust-item">
              <img
                src={src}
                alt={alt}
                className="footer-trust-logo"
                draggable={false}
                loading="lazy"
                decoding="async"
              />
            </div>
          ))}
        </div>

        <div className="footer-license">
          <span className="footer-license-text">
            © 2026 Openroot Systems. All rights reserved.
          </span>
        </div>

      </div>

      {/* MODALS */}
      <CertificateModal isOpen={openVerify} onClose={() => setOpenVerify(false)} />
      <FaqModal isOpen={openFaq} onClose={() => setOpenFaq(false)} />

    </footer>
  );
}