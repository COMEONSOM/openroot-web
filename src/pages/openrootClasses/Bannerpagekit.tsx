// ============================================================
// BANNER PAGE KIT — SMALL SHARED LOGIC (NO LAYOUT, NO STYLES)
// Every banner page has its own design. Only behaviour lives here:
//   - the "Back" link (works like the browser back button)
//   - the CTA link (router Link for "/..." paths, new tab for external)
//   - the WhatsApp link builder
// Each page passes its OWN class names, so styling stays per page.
// ============================================================

import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { BANNER_BASE_PATH } from "./data/bannerData";

export const SITE_URL = "https://openroot.in";

const WHATSAPP_NUMBER = "917866049865";

export const whatsappLink = (message: string): string =>
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

// ------------------------------------------------------------
// BACK LINK
// If the visitor came from inside the site, go one step back in
// history (no new entry). If the page was opened directly (new tab,
// shared link, refresh), the link falls back to Openroot Classes.
// ------------------------------------------------------------
export function BannerBackLink({ className }: { className: string }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    const cameFromInsideSite = location.key !== "default";
    const modifiedClick =
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;

    if (cameFromInsideSite && !modifiedClick) {
      e.preventDefault();
      navigate(-1);
    }
  };

  return (
    <Link to={BANNER_BASE_PATH} className={className} onClick={handleBack}>
      ← Back to Openroot Classes
    </Link>
  );
}

// ------------------------------------------------------------
// CTA LINK
// ------------------------------------------------------------
interface PageCtaProps {
  href: string;
  label: string;
  className: string;
  arrowClassName?: string;
}

export function PageCta({ href, label, className, arrowClassName }: PageCtaProps) {
  const arrow = (
    <svg
      className={arrowClassName}
      viewBox="0 0 24 24"
      width="1.3em"
      height="1.3em"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="square"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );

  if (href.startsWith("/")) {
    return (
      <Link to={href} className={className}>
        {label}
        {arrow}
      </Link>
    );
  }

  return (
    <a href={href} className={className} target="_blank" rel="noopener noreferrer">
      {label}
      {arrow}
    </a>
  );
}