import { Suspense, lazy, useEffect, useState, type ReactNode } from "react";
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

// ─── Types ────────────────────────────────────────────────────

type AdminSession = {
  email?: string;
  role?: string;
  verified?: boolean;
  username?: string;
};

type FooterLink = {
  label: string;
  href: string;
  rel?: string;
  target?: "_blank";
};

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

const SITEMAP_LINKS: FooterLink[] = [
  { label: "Terms & Conditions", href: "/terms" },
  { label: "Founder Details", href: "/founder" },
  { label: "Incorporation Details", href: "/openroot-systems" },
  { label: "Released Softwares", href: "/softwares" },
  {
    label: "Watch Content",
    href: "https://www.youtube.com/@openrootsystems",
    rel: "noopener noreferrer",
    target: "_blank",
  },
  {
    label: "Music Production",
    href: "https://www.youtube.com/@somu.youtube",
    rel: "noopener noreferrer",
    target: "_blank",
  },
];

const REACHOUT_LINKS: FooterLink[] = [
  {
    label: "WhatsApp",
    href: "https://wa.me/917866049865",
    rel: "noopener noreferrer",
    target: "_blank",
  },
  { label: "Email", href: "mailto:connect.openroot@gmail.com" },
  {
    label: "GitHub",
    href: "https://github.com/COMEONSOM",
    rel: "noopener noreferrer",
    target: "_blank",
  },
  {
    label: "LinkedIn",
    href: "https://in.linkedin.com/in/comeonsom",
    rel: "noopener noreferrer",
    target: "_blank",
  },
  {
    label: "X",
    href: "https://x.com/comeonsomx",
    rel: "noopener noreferrer",
    target: "_blank",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/OpenrootSystems",
    rel: "noopener noreferrer",
    target: "_blank",
  },
];

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

// ─── Link cells (same markup and hover in both columns) ──────

function Cell({
  arrow,
  children,
}: {
  arrow: string;
  children: ReactNode;
}) {
  return (
    <>
      <span className="or-footer-link-text">{children}</span>
      <span className="or-footer-link-arrow" aria-hidden="true">
        {arrow}
      </span>
    </>
  );
}

function FooterLinkCell({ link }: { link: FooterLink }) {
  if (link.href.startsWith("/")) {
    return (
      <Link to={link.href} className="or-footer-link">
        <Cell arrow="→">{link.label}</Cell>
      </Link>
    );
  }

  return (
    <a
      href={link.href}
      rel={link.rel}
      target={link.target}
      className="or-footer-link"
    >
      <Cell arrow="↗">{link.label}</Cell>
    </a>
  );
}

// ─── Component ────────────────────────────────────────────────

export default function Footer() {
  const [openFaq, setOpenFaq] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Admin session sync
  useEffect(() => {
    const sync = () => setIsAdmin(readIsAdminSession());

    sync();

    window.addEventListener(ADMIN_SESSION_SYNC_EVENT, sync);
    window.addEventListener("storage", sync);

    return () => {
      window.removeEventListener(ADMIN_SESSION_SYNC_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  return (
    <footer className="or-footer-root">
      {/* MAIN */}
      <div className="or-footer-main">
        <div className="or-footer-grid">
          {/* SITEMAP */}
          <nav className="or-footer-sitemap" aria-label="Site map">
            <span className="or-footer-label">Sitemap</span>

            <div className="or-footer-links">
              {SITEMAP_LINKS.map((link) => (
                <FooterLinkCell key={link.label} link={link} />
              ))}

              {isAdmin && (
                <a
                  href={STUDENT_DATABASE_URL}
                  title="Open Student Database System"
                  className="or-footer-link"
                >
                  <Cell arrow="↗">Student Database</Cell>
                </a>
              )}

              <a
                href="#"
                className="or-footer-link"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenFaq(true);
                }}
              >
                <Cell arrow="→">FAQs</Cell>
              </a>

              <Link
                to="/certificate-verification"
                aria-label="Open certificate verification page"
                className="or-footer-link"
              >
                <Cell arrow="→">Verify Certificate</Cell>
              </Link>
            </div>
          </nav>

          {/* FIND ME ONLINE */}
          <nav className="or-footer-reachout" aria-label="Find me online">
            <span className="or-footer-label">Find Me Online</span>

            <div className="or-footer-links">
              {REACHOUT_LINKS.map((link) => (
                <FooterLinkCell key={link.label} link={link} />
              ))}
            </div>
          </nav>
        </div>
      </div>

      {/* BASE */}
      <div className="or-footer-base">
        <div className="or-footer-trust">
          {TRUST_BADGES.map(({ src, alt, width, height }) => (
            <div key={src} className="or-footer-trust-item">
              <img
                src={src}
                alt={alt}
                className="or-footer-trust-logo"
                draggable={false}
                loading="lazy"
                decoding="async"
                width={width}
                height={height}
              />
            </div>
          ))}
        </div>

        <div className="or-footer-license">
          <span className="or-footer-license-text">
            © 2026 Openroot Systems. All rights reserved.
          </span>
          <span className="or-footer-location">Kolkata, West Bengal, India</span>
        </div>
      </div>

      {/* FAQ MODAL */}
      <Suspense fallback={null}>
        {openFaq && (
          <FaqModal isOpen={openFaq} onClose={() => setOpenFaq(false)} />
        )}
      </Suspense>
    </footer>
  );
}