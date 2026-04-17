// ============================================================
// NAVBAR COMPONENT — FINAL STABLE VERSION
// VERSION: 2026.9 (helping-hand back to /software/:slug flow)
// ============================================================

import "./styles/Navbar.css";
import { softwareList } from "../data/softwareList";
import { useState, useEffect, useCallback } from "react";
import { createPortal } from "react-dom";
import { Link, useNavigate } from "react-router-dom";
import React from "react";

const Icons = {
  timeAI: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="12" r="2.5" />
      <circle cx="6" cy="6" r="2" />
      <circle cx="18" cy="6" r="2" />
      <circle cx="6" cy="18" r="2" />
      <circle cx="18" cy="18" r="2" />
      <path d="M6 6L12 12M18 6L12 12M6 18L12 12M18 18L12 12" stroke="currentColor" strokeWidth="1" fill="none" />
    </svg>
  ),
  Classes: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <rect x="3" y="5" width="18" height="12" rx="2" />
      <path d="M8 21h8" stroke="currentColor" strokeWidth="2" fill="none" />
      <circle cx="12" cy="11" r="2.5" />
    </svg>
  ),
  travelExpense: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M3 15h18v5H3v-5Zm2 2v1h14v-1H5Z" />
      <path d="M6 10h12l2 3H4l2-3Z" />
      <circle cx="8" cy="20" r="1" />
      <circle cx="16" cy="20" r="1" />
      <path d="M2 5h8v2H2V5Zm10 0h3v2h-3V5Zm5 0h5v2h-5V5Z" />
      <path d="M20 12l2-2-1.5-1.5-2 2L20 12Z" />
    </svg>
  ),
  Coevas: (
    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <rect x="3" y="3" width="18" height="14" rx="3" />
      <path d="M10 7l5 3-5 3z" />
      <path d="M12 17v4" />
      <path d="M9.5 19.5L12 22l2.5-2.5" />
    </svg>
  ),
  resourcehub: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M6 4a1 1 0 0 0-1 1v3h3l4 4 2-2-3-3h3V5a1 1 0 0 0-1-1H6zM18 20a1 1 0 0 0 1-1v-3h-3l-4-4-2 2 3 3H8v3a1 1 0 0 0 1 1h8z" />
    </svg>
  ),
  makaut: (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="5" y1="19" x2="19" y2="5" />
      <circle cx="7.5" cy="7.5" r="2.5" />
      <circle cx="16.5" cy="16.5" r="2.5" />
    </svg>
  ),
};

const iconMap: Record<string, React.ReactNode> = {
  "travel-expense-manager": Icons.travelExpense,
  "nior-ai": Icons.timeAI,
  "resource-hub": Icons.resourcehub,
  "openroot-classes": Icons.Classes,
  "coevas-terminal": Icons.Coevas,
  "makaut-grade-pro": Icons.makaut,
};

export default function Navbar() {
  const [showAllSoftware, setShowAllSoftware] = useState(false);
  const navigate = useNavigate();

  const visibleSoftwares = softwareList.slice(0, 5);

  const openOverlay  = useCallback(() => setShowAllSoftware(true),  []);
  const closeOverlay = useCallback(() => setShowAllSoftware(false), []);

  useEffect(() => {
    if (!showAllSoftware) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeOverlay(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showAllSoftware, closeOverlay]);

  useEffect(() => {
    document.body.style.overflow = showAllSoftware ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [showAllSoftware]);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);
  }, []);

  // ✅ All slugs go to /software/:slug — no exceptions here
  // The detail page (SoftwarePage) handles the final destination on Launch
  const goTo = useCallback(
    (slug: string) => navigate(`/software/${slug}`),
    [navigate]
  );

  const overlay = showAllSoftware
    ? createPortal(
        <div className="nb-overlay" role="dialog" aria-modal="true" aria-label="All Products">
          <div className="nb-panel">
            <div className="nb-panel-header">
              <span className="nb-panel-title">All Products</span>
              <button className="nb-close-btn" onClick={closeOverlay} aria-label="Close software list">
                <span className="nb-esc" aria-hidden="true">ESC</span>
                <span>Close</span>
              </button>
            </div>
            <div className="nb-panel-scroll scrollbar-thin">
              <div className="nb-panel-grid" role="list">
                {softwareList.map((app) => (
                  <button
                    key={app.slug}
                    className="software-btn ot-focus-brand ot-active-scale"
                    role="listitem"
                    onClick={() => { closeOverlay(); goTo(app.slug); }}
                    onMouseMove={handleMouseMove}
                    aria-label={`Open ${app.name}`}
                  >
                    <div className="software-icon" aria-hidden="true">{iconMap[app.slug]}</div>
                    <span className="software-name">{app.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>,
        document.body
      )
    : null;

  return (
    <>
      <nav id="released-softwares-section" className="navbar" aria-label="Released Softwares">
        <div className="sr-only" aria-hidden="true">
          <Link to="/software/nior-ai">NIOR AI</Link>
          <Link to="/software/resource-hub">Resource Hub &amp; Job Updates</Link>
          <Link to="/software/travel-expense-manager">Travel Expense Manager</Link>
          <Link to="/software/openroot-classes">Openroot Classes</Link>
          <Link to="/software/coevas-terminal">Coevas Terminal</Link>
          <Link to="/software/makaut-grade-pro">MAKAUT Grade Calculator</Link>
          <Link to="/certificate-verification">Certificate Verification</Link>
        </div>

        <div className="navbar-content">
          <div className="software-header">
            <h2 className="navbar-title">Released Softwares</h2>
            <button
              className="view-all-link ot-focus-brand ot-active-scale"
              onClick={openOverlay}
              aria-haspopup="dialog"
              aria-expanded={showAllSoftware}
            >
              View All →
            </button>
          </div>
          <div className="released-softwares" role="list">
            {visibleSoftwares.map((app) => (
              <button
                key={app.slug}
                className="software-btn ot-focus-brand ot-active-scale"
                role="listitem"
                onClick={() => goTo(app.slug)}
                onMouseMove={handleMouseMove}
                aria-label={`Open ${app.name}`}
              >
                <div className="software-icon" aria-hidden="true">{iconMap[app.slug]}</div>
                <span className="software-name">{app.name}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
      {overlay}
    </>
  );
}