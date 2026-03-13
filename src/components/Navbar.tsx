// ============================================================
// NAVBAR COMPONENT — FINAL STABLE VERSION
// VERSION: 2026.5 (SEO + ROUTING IMPROVED)
// ============================================================

import "./styles/Navbar.css";
import { softwareList } from "../data/softwareList";
import { useState } from "react";
import { Link } from "react-router-dom";
import React from "react";

// ============================================================
// SVG ICONS
// ============================================================

const Icons = {

  timeAI: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="2.5" fill="#fff"/>
      <circle cx="6" cy="6" r="2"/>
      <circle cx="18" cy="6" r="2"/>
      <circle cx="6" cy="18" r="2"/>
      <circle cx="18" cy="18" r="2"/>
      <path d="M6 6L12 12M18 6L12 12M6 18L12 12M18 18L12 12" stroke="#fff" strokeWidth="1"/>
    </svg>
  ),

  Classes: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
      <rect x="3" y="5" width="18" height="12" rx="2"/>
      <path d="M8 21h8" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="11" r="2.5"/>
    </svg>
  ),

  travelExpense: (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
      <path d="M3 15h18v5H3v-5Zm2 2v1h14v-1H5Z"/>
      <path d="M6 10h12l2 3H4l2-3Z"/>
      <circle cx="8" cy="20" r="1"/>
      <circle cx="16" cy="20" r="1"/>
      <path d="M2 5h8v2H2V5Zm10 0h3v2h-3V5Zm5 0h5v2h-5V5Z"/>
      <path d="M20 12l2-2-1.5-1.5-2 2L20 12Z"/>
    </svg>
  ),

  Coevas: (
    <svg viewBox="0 0 24 24" width="34" height="34" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="14" rx="3"/>
      <path d="M10 7l5 3-5 3z"/>
      <path d="M12 17v4"/>
      <path d="M9.5 19.5L12 22l2.5-2.5"/>
    </svg>
  ),

  helpingHand: (
    <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
      <path d="M6 4a1 1 0 0 0-1 1v3h3l4 4 2-2-3-3h3V5a1 1 0 0 0-1-1H6zM18 20a1 1 0 0 0 1-1v-3h-3l-4-4-2 2 3 3H8v3a1 1 0 0 0 1 1h8z"/>
    </svg>
  )

};

// ============================================================
// ICON MAP
// ============================================================

const iconMap: Record<string, React.ReactNode> = {

  "coevas-media-downloader": Icons.Coevas,
  "travel-expense-manager": Icons.travelExpense,
  "nior-ai": Icons.timeAI,
  "helping-hand": Icons.helpingHand,
  "openroot-classes": Icons.Classes

};

// ============================================================
// MAIN COMPONENT
// ============================================================

export default function Navbar() {

  const [showAllSoftware, setShowAllSoftware] = useState(false);

  const visibleSoftwares = softwareList.slice(0, 5);

  // ==========================================================
  // CURSOR EFFECT
  // ==========================================================

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {

    const rect = e.currentTarget.getBoundingClientRect();

    e.currentTarget.style.setProperty("--x", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--y", `${e.clientY - rect.top}px`);

  };

  return (

    <nav id="released-softwares-section" className="navbar">

      <div className="navbar-content">

        {/* =====================================================
           SEO LINKS (Hidden but crawlable)
        ===================================================== */}

        <div className="seo-nav-links">

          <Link to="/software/nior-ai">NIOR AI</Link>
          <Link to="/software/helping-hand">Resource Hub & Job Updates</Link>
          <Link to="/software/travel-expense-manager">Travel Expense Manager</Link>
          <Link to="/software/openroot-classes">Openroot Classes</Link>
          <Link to="/software/coevas-media-downloader">Coevas Media Downloader</Link>

          <Link to="/certificate-verification">Certificate Verification</Link>

        </div>

        {/* =====================================================
           HEADER
        ===================================================== */}

        <div className="software-header">

          <h2 className="navbar-title">
            Released Softwares
          </h2>

          <button
            className="view-all-link"
            onClick={() => setShowAllSoftware(true)}
          >
            View All →
          </button>

        </div>

        {/* =====================================================
           VISIBLE SOFTWARE BUTTONS
        ===================================================== */}

        <div className="released-softwares">

          {visibleSoftwares.map((app) => (

            <button
              key={app.slug}
              className="software-btn"
              onClick={() => window.location.href = `/software/${app.slug}`}
              onMouseMove={handleMouseMove}
            >

              <div className="software-icon">
                {iconMap[app.slug]}
              </div>

              <span className="software-name">
                {app.name}
              </span>

            </button>

          ))}

        </div>

      </div>

      {/* =====================================================
         FULL SOFTWARE OVERLAY
      ===================================================== */}

      {showAllSoftware && (

        <div className="software-overlay">

          <button
            className="close-overlay"
            onClick={() => setShowAllSoftware(false)}
          >
            ✕
          </button>

          <div className="overlay-grid">

            {softwareList.map((app) => (

              <button
                key={app.slug}
                className="software-btn"
                onClick={() => window.location.href = `/software/${app.slug}`}
                onMouseMove={handleMouseMove}
              >

                <div className="software-icon">
                  {iconMap[app.slug]}
                </div>

                <span className="software-name">
                  {app.name}
                </span>

              </button>

            ))}

          </div>

        </div>

      )}

    </nav>

  );

}