import { Suspense, lazy, useEffect, useRef, useState } from "react";
import { useTheme } from "../context/ThemeContext";
import "./styles/Footer.css";
import { Link } from "react-router-dom";

const FaqModal = lazy(() => import("../components/FaqModal"));

// ─── Admin session keys ───────────────────────────────────────
const ADMIN_SESSION_KEY = "openrootAdmin";
const ADMIN_SESSION_SYNC_EVENT = "openroot-admin-session-sync";

// ─── Student database URL ─────────────────────────────────────
const STUDENT_DATABASE_URL =
  import.meta.env.VITE_STUDENT_DATABASE_URL ??
  "https://comeonsom.github.io/openroot-student-database/";

// ─── Data ─────────────────────────────────────────────────────

const TRUST_BADGES = [
  {
    src: "/assets/google-analytics-badge.avif",
    alt: "Google Analytics Certified",
    width: 120,
    height: 40,
  },
  {
    src: "/assets/msme-logo.avif",
    alt: "MSME Registered",
    width: 80,
    height: 40,
  },
  {
    src: "/assets/hubspot-badge.avif",
    alt: "HubSpot Certified",
    width: 120,
    height: 40,
  },
];

const SITEMAP_LINKS = [
  {
    label: "Terms & Conditions",
    href: "/terms",
  },
  {
    label: "Founder Details",
    href: "/founder",
  },
  {
    label: "Released Softwares",
    href: "/softwares",
  },
  {
    label: "Watch Content",
    href: "https://www.youtube.com/@openrootsystems",
    rel: "noopener noreferrer" as const,
    target: "_blank" as const,
  },
  {
    label: "Music Production",
    href: "https://www.youtube.com/@somu.youtube",
    rel: "noopener noreferrer" as const,
    target: "_blank" as const,
  },
];

const REACHOUT_LINKS = [
  {
    label: "WhatsApp",
    href: "https://wa.me/917866049865",
    rel: "noopener noreferrer" as const,
    target: "_blank" as const,
  },
  {
    label: "Email",
    href: "mailto:connect.openroot@gmail.com",
  },
  {
    label: "GitHub",
    href: "https://github.com/COMEONSOM",
    rel: "noopener noreferrer" as const,
    target: "_blank" as const,
  },
  {
    label: "LinkedIn",
    href: "https://in.linkedin.com/in/comeonsom",
    rel: "noopener noreferrer" as const,
    target: "_blank" as const,
  },
  {
    label: "X",
    href: "https://x.com/comeonsomx",
    rel: "noopener noreferrer" as const,
    target: "_blank" as const,
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/OpenrootSystems",
    rel: "noopener noreferrer" as const,
    target: "_blank" as const,
  },
];

// ─── Types ────────────────────────────────────────────────────

type AdminSession = {
  email?: string;
  role?: string;
  verified?: boolean;
  username?: string;
};

// ─── Helpers ──────────────────────────────────────────────────

function readIsAdminSession(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return false;

    const parsed = JSON.parse(raw) as AdminSession;

    return parsed?.role === "admin" && parsed?.verified === true;
  } catch {
    return false;
  }
}

// ─── Component ────────────────────────────────────────────────

export default function Footer() {
  const footerRef = useRef<HTMLElement | null>(null);
  const [openFaq, setOpenFaq] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  const { resolved } = useTheme();

  const logoSrc =
    resolved === "dark"
      ? "/assets/openroot-white-nobg.avif"
      : "/assets/openroot-black-nobg.png";

  useEffect(() => {
    const syncAdminState = () => setIsAdmin(readIsAdminSession());

    syncAdminState();

    const handleSync = () => syncAdminState();

    window.addEventListener(ADMIN_SESSION_SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      window.removeEventListener(ADMIN_SESSION_SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, []);

  useEffect(() => {
    const el = footerRef.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    el.animate(
      [
        { opacity: "0", transform: "translateY(18px)" },
        { opacity: "1", transform: "translateY(0)" },
      ],
      {
        duration: 500,
        easing: "cubic-bezier(0.16, 1, 0.3, 1)",
        fill: "both",
      }
    );
  }, []);

  return (
    <footer ref={footerRef} className="footer-root">
      {/* MAIN GRID */}
      <div className="footer-main">
        <div className="footer-grid">
          {/* SITEMAP */}
          <nav className="footer-sitemap" aria-label="Site map">
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

              {isAdmin && (
                <a
                  href={STUDENT_DATABASE_URL}
                  title="Open Student Database System"
                >
                  Student Database
                </a>
              )}

              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenFaq(true);
                }}
              >
                FAQs
              </a>

              <Link
                to="/certificate-verification"
                aria-label="Open certificate verification page"
              >
                Verify Certificate
              </Link>
            </div>
          </nav>

          {/* REACH OUT */}
          <nav className="footer-sitemap footer-reachout" aria-label="Reach out">
            <span className="footer-reachout-spacer" aria-hidden="true" />
            <span className="footer-label">Find Me Online</span>

            <div className="footer-links">
              {REACHOUT_LINKS.map(({ label, href, rel, target }) => (
                <a
                  key={label}
                  href={href}
                  rel={rel}
                  target={target}
                  className="footer-reachout-link"
                >
                  {label}
                  <span className="footer-reachout-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* BASE */}
      <div className="footer-base">
        <div className="footer-trust">
          {TRUST_BADGES.map(({ src, alt, width, height }) => (
            <div key={src} className="footer-trust-item">
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
        {openFaq && (
          <FaqModal isOpen={openFaq} onClose={() => setOpenFaq(false)} />
        )}
      </Suspense>
    </footer>
  );
}