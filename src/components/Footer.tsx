import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import "./styles/Footer.css";
import { Link } from "react-router-dom";

const CertificateModal = lazy(() => import("../components/CertificateModal"));
const FaqModal = lazy(() => import("../components/FaqModal"));

// ─── Data ─────────────────────────────────────────────────────────────────────

const TRUST_BADGES = [
  { src: "/assets/google-analytics-badge.avif", alt: "Google Analytics Certified", width: 120, height: 40 },
  { src: "/assets/msme-logo.avif",              alt: "MSME Registered",            width: 80,  height: 40 },
  { src: "/assets/hubspot-badge.avif",          alt: "HubSpot Certified",          width: 120, height: 40 },
];

const SITEMAP_LINKS = [
  {
    label: "Terms & Conditions",
    href:  "/terms",
  },
  {
    label: "Founder Details",
    href:  "/founder",
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

  const [openFaq,    setOpenFaq]    = useState(false);
  const [openVerify, setOpenVerify] = useState(false);

  const { resolved } = useTheme();

  // Theme-based logo
  const logoSrc =
    resolved === "dark"
      ? "/assets/openroot-white-nobg.avif"
      : "/assets/openroot-black-nobg.png";

  // Auto-open certificate modal from URL param
  useEffect(() => {
    const certId = new URLSearchParams(window.location.search).get("cert");
    if (certId) setOpenVerify(true);
  }, []);

  // Subtle entrance (Web Animations API — no GSAP dependency)
  useEffect(() => {
    const el = footerRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    el.animate(
      [
        { opacity: "0", transform: "translateY(18px)" },
        { opacity: "1", transform: "translateY(0)" },
      ],
      { duration: 500, easing: "cubic-bezier(0.16, 1, 0.3, 1)", fill: "both" }
    );
  }, []);

  return (
    <footer ref={footerRef} className="footer-root">

      {/* MAIN GRID */}
      <div className="footer-main">
        <div className="footer-grid">

          {/* SITEMAP */}
          <nav className="footer-sitemap" aria-label="Site map">
            {/*
              FIX (CLS): Added explicit width/height on footer logo.
              Report flagged all footer images as missing dimensions,
              causing layout shifts. Using the same displayed dimensions
              as the header logo since it's the same asset.
            */}
            <Link
              to="/openroot-systems"
              aria-label="Openroot Systems Official Information"
              title="Openroot Systems Official Information"
            >
              <img
                src={logoSrc}
                alt="Openroot Systems"
                className="footer-logo-img"
                loading="lazy"
                decoding="async"
                width={160}
                height={37}
              />
            </Link>

            <span className="footer-label">Sitemap</span>

            <div className="footer-links">
              {SITEMAP_LINKS.map(({ label, href, rel, target }) => (
                <a key={label} href={href} rel={rel} target={target}>
                  {label}
                </a>
              ))}

              <a
                href="#"
                onClick={(e) => { e.preventDefault(); setOpenFaq(true); }}
              >
                FAQs
              </a>

              <button
                className="verify-btn"
                onClick={() => setOpenVerify(true)}
                type="button"
                aria-label="Verify a certificate"
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
                aria-label="WhatsApp"
              >
                {/* FIX: explicit dimensions on social icon images */}
                <img src="/assets/whatsapp.svg" alt="" aria-hidden="true" width={24} height={24} />
              </a>

              <a
                href="mailto:connect.openroot@gmail.com"
                className="footer-icon-btn"
                aria-label="Email"
              >
                <img src="/assets/gmail.svg" alt="" aria-hidden="true" width={24} height={24} />
              </a>
            </div>
          </div>

          {/* FOLLOW */}
          <div className="footer-card">
            <span className="footer-label">Follow</span>
            <div className="footer-icon-row">

              <a
                href="https://github.com/COMEONSOM"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-icon-btn"
                aria-label="GitHub"
              >
                <img src="/assets/github.svg" alt="" aria-hidden="true" width={24} height={24} />
              </a>

              <a
                href="https://in.linkedin.com/in/comeonsom"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-icon-btn"
                aria-label="LinkedIn"
              >
                <img src="/assets/linkedin.svg" alt="" aria-hidden="true" width={24} height={24} />
              </a>

              <a
                href="https://x.com/comeonsom_"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-icon-btn"
                aria-label="X (Twitter)"
              >
                <img src="/assets/x.svg" alt="" aria-hidden="true" width={24} height={24} />
              </a>

              <a
                href="https://www.facebook.com/OpenrootSystems"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-icon-btn"
                aria-label="Facebook"
              >
                <img src="/assets/facebook.svg" alt="" aria-hidden="true" width={24} height={24} />
              </a>
            </div>
          </div>

        </div>
      </div>

      {/* BASE */}
      <div className="footer-base">
        <div className="footer-trust">
          {TRUST_BADGES.map(({ src, alt, width, height }) => (
            <div key={src} className="footer-trust-item">
              {/*
                FIX (CLS): Added explicit width/height on every trust badge.
                Report listed all three trust logos as missing dimensions.
                Dimensions are set to approximate display sizes; adjust if
                your CSS renders them at different sizes.
              */}
              <img
                src={src}
                alt={alt}
                className="footer-trust-logo"
                draggable={false}
                loading="lazy"
                decoding="async"
                width={width}
                height={height}
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
      <Suspense fallback={null}>
        {openVerify && (
          <CertificateModal isOpen={openVerify} onClose={() => setOpenVerify(false)} />
        )}
        {openFaq && (
          <FaqModal isOpen={openFaq} onClose={() => setOpenFaq(false)} />
        )}
      </Suspense>

    </footer>
  );
}