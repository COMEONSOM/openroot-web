// coevas.tsx
// Styles are fully scoped via CSS Modules (coevas.module.css).
// No global class names are used — zero conflict with app.css.

import React, { useState } from 'react';
import styles from '../components/styles/coevas.module.css';

// ── Types ──────────────────────────────────────────────────────────────────
interface Release {
  version: string;
  date: string;
  downloadLink: string;
  features?: string[];
}

type TabName = 'releases' | 'about';

// ── Release data ───────────────────────────────────────────────────────────
const releases: Release[] = [
  
  {
    version: '1.2.0',
    date: '2026-04-28',
    downloadLink:
      'https://github.com/COMEONSOM/openroot-web/releases/download/v1.2.0/CoevasTerminalSetup-1.2.0.exe',
    features: [
      'All existing features remain the same as the previous version',
      'No need to download older versions anymore',
      'This version is more stable and optimized',
      'Automatic update system has been introduced',
      'Users will receive all future updates directly within the app',
      'Future updates will include security improvements and new features',
      'Ensures a smoother and more reliable experience going forward',
    ],
  },
  
  {
    version: '1.1.0',
    date: '2026-01-15',
    downloadLink:
      'https://github.com/COMEONSOM/openroot-web/releases/download/v1.1.0/Coevas.Panel.Setup.1.1.0.exe',
    features: [
      'YouTube video + audio download',
      'YouTube video up to 8K resolution (with audio)',
      'Facebook video + audio download',
      'Instagram video + audio + carousel support',
      'Threads carousel support (multiple images and videos)',
      'Upgraded UI',
    ],
  },
  {
    version: '1.0.0',
    date: '2025-12-01',
    downloadLink:
      'https://github.com/COMEONSOM/openroot-web/releases/download/v1.0.0/Coevas.Panel.Setup.1.0.0.exe',
    features: [
      'YouTube video + audio download',
      'Supports up to 4K resolution',
      'Instagram video + audio download',
      'Facebook video + audio download',
    ],
  },
];

// ── Version utilities ──────────────────────────────────────────────────────
function parseVersion(v: string): number[] {
  return v.split('.').map((n) => parseInt(n, 10) || 0);
}

function compareVersions(a: string, b: string): number {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  const len = Math.max(pa.length, pb.length);
  for (let i = 0; i < len; i++) {
    const na = pa[i] ?? 0;
    const nb = pb[i] ?? 0;
    if (na > nb) return -1;
    if (na < nb) return 1;
  }
  return 0;
}

// ── Sub-components ─────────────────────────────────────────────────────────

// SVG icon with explicit dimensions to override app.css:
//   svg { display: block; height: auto }  →  display: inline-block; height: 14px
const DownloadIcon: React.FC = () => (
  <svg
    className={styles.icon}
    viewBox="0 0 16 16"
    width="14"
    height="14"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M2.75 14A1.75 1.75 0 0 1 1 12.25v-2.5a.75.75 0 0 1 1.5 0v2.5c0 .138.112.25.25.25h10.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 1.5 0v2.5A1.75 1.75 0 0 1 13.25 14ZM7.25 7.689V2a.75.75 0 0 1 1.5 0v5.689l1.97-1.97a.749.749 0 1 1 1.06 1.06l-3.25 3.25a.749.749 0 0 1-1.06 0L4.22 6.78a.749.749 0 1 1 1.06-1.06l1.97 1.97Z" />
  </svg>
);

const FeatureList: React.FC<{ features?: string[] }> = ({ features }) => {
  if (!features?.length) return null;
  return (
    <ul className={styles.versionFeatures}>
      {features.map((f, i) => (
        <li key={i}>{f}</li>
      ))}
    </ul>
  );
};

// ── Main component ─────────────────────────────────────────────────────────
const CoeasTerminal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>('releases');

  const sorted = [...releases].sort((a, b) => compareVersions(a.version, b.version));
  const latest = sorted[0];
  const older  = sorted.slice(1);

  return (
    // .root defines --cv-* tokens + resets inherited body font/color
    <div className={styles.root}>

      {/* ── Sticky navbar ── */}
      <nav className={styles.ghNav}>
        <div className={styles.ghNavInner}>

          <div className={styles.ghNavLeft}>
            <a
              href="https://openroot.in"
              className={styles.ghNavLogo}
              target="_blank"
              rel="noopener noreferrer"
              title="Openroot Systems"
            >
              {/* Explicit height overrides img { height: auto } from app.css */}
              <img
                src="logo.png"
                alt="Openroot Systems"
                className={styles.ghNavLogoImg}
                width={32}
                height={32}
              />
            </a>
            <span className={styles.ghNavBrand}>Openroot Systems</span>
            <span className={styles.ghNavSep}>/</span>
            <span className={styles.ghNavRepo}>Coevas Terminal</span>
            <span className={`${styles.ghNavBadge} ${styles.rating}`}>
              ★★★★☆ <span className={styles.ratingValue}>4.8</span>
            </span>
          </div>

          <div className={styles.ghNavRight}>
            <a
              href="https://github.com/COMEONSOM/openroot-web/releases"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.ghNavLink}
            >
              GitHub ↗
            </a>
          </div>

        </div>
      </nav>

      {/* ── Page container ── */}
      <div className={styles.container}>

        {/* ── Repo header ── */}
        <header className={styles.repoHeader}>
          <div className={styles.repoTitleRow}>
            <svg
              className={styles.repoIcon}
              viewBox="0 0 16 16"
              width="20"
              height="20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h7A2.5 2.5 0 0 1 14 2.5v10.5a.75.75 0 0 1-1.092.67L8 11.13l-4.908 2.54A.75.75 0 0 1 2 13V2.5Zm2.5-1A1 1 0 0 0 3.5 2.5V11.1l4.158-2.15a.75.75 0 0 1 .684 0L12.5 11.1V2.5a1 1 0 0 0-1-1Z" />
            </svg>
            <h1 className={styles.repoTitle}>openroot-coevas-terminal</h1>
            <span className={styles.repoVisibilityBadge}>Public</span>
          </div>
          <p className={styles.tagline}>By Openroot Systems — Fast. Simple. Powerful.</p>
        </header>

        {/* ── Tab bar ── */}
        {/* Releases + About = <button>; License = <a> (navigates externally) */}
        <nav className={styles.repoTabs} aria-label="Page sections">

          <button
            className={`${styles.repoTab}${activeTab === 'releases' ? ` ${styles.active}` : ''}`}
            onClick={() => setActiveTab('releases')}
          >
            <svg className={styles.icon} viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h7A2.5 2.5 0 0 1 14 2.5v10.5a.75.75 0 0 1-1.092.67L8 11.13l-4.908 2.54A.75.75 0 0 1 2 13V2.5Zm2.5-1A1 1 0 0 0 3.5 2.5V11.1l4.158-2.15a.75.75 0 0 1 .684 0L12.5 11.1V2.5a1 1 0 0 0-1-1Z" />
            </svg>
            Releases
          </button>

          <button
            className={`${styles.repoTab}${activeTab === 'about' ? ` ${styles.active}` : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <svg className={styles.icon} viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Z" />
            </svg>
            About
          </button>

          <a href="license-coevas-software.html" className={styles.repoTab}>
            <svg className={styles.icon} viewBox="0 0 16 16" width="14" height="14" fill="currentColor" aria-hidden="true">
              <path d="M8.75.75V2h.985c.304 0 .603.08.867.231l1.29.736c.038.022.08.033.124.033h2.234a.75.75 0 0 1 0 1.5h-.427l2.111 4.692a.75.75 0 0 1-.154.838l-.53-.53.529.531-.001.002-.002.002-.006.006-.006.005-.01.01-.045.04c-.21.176-.441.327-.686.45C14.556 10.78 13.88 11 13 11a4.498 4.498 0 0 1-2.023-.454 3.544 3.544 0 0 1-.686-.45l-.045-.04-.016-.015-.006-.006-.004-.004v-.001a.75.75 0 0 1-.154-.838L12.178 4.5h-.162c-.305 0-.604-.079-.868-.231l-1.29-.736a.245.245 0 0 0-.124-.033H8.75V13h2.5a.75.75 0 0 1 0 1.5h-6.5a.75.75 0 0 1 0-1.5h2.5V3.5h-.984a.245.245 0 0 0-.124.033l-1.289.737c-.265.15-.564.23-.869.23h-.162l2.112 4.692a.75.75 0 0 1-.154.838l-.53-.53.529.531-.001.002-.002.002-.006.006-.016.015-.045.04c-.21.176-.441.327-.686.45C4.556 10.78 3.88 11 3 11a4.498 4.498 0 0 1-2.023-.454 3.544 3.544 0 0 1-.686-.45l-.045-.04-.016-.015-.006-.006-.004-.004v-.001a.75.75 0 0 1-.154-.838L2.178 4.5H1.75a.75.75 0 0 1 0-1.5h2.234a.246.246 0 0 0 .125-.033l1.288-.737c.265-.15.564-.23.869-.23h.984V.75a.75.75 0 0 1 1.5 0Z" />
            </svg>
            License
          </a>

        </nav>

        {/* ── Tab content ── */}
        <div className={styles.repoBody}>

          {/* ─── About ─── */}
          {activeTab === 'about' && (
            <section className={styles.appInfo}>
              <h2 className={styles.sectionHeading}>About</h2>

              <p className={styles.infoPara}>
                <strong>Coevas Terminal</strong> is a desktop application developed and distributed by{' '}
                <strong>Openroot Systems</strong>{' '}(
                <a
                  href="https://openroot.in"
                  className={styles.inlineLink}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  openroot.in
                </a>
                ).
              </p>

              <p className={styles.infoPara}>
                It is a Windows-based Electron application designed to provide a fast, reliable,
                and efficient environment for media downloading across multiple platforms.
              </p>

              <p className={styles.infoPara}>
                The application is powered by an internal processing system known as{' '}
                <strong>Coevas Panel</strong>, which handles complex operations such as media
                extraction, multi-source handling, and download processing. While Coevas Terminal
                is the user-facing software, Coevas Panel acts as the underlying engine that
                enables its functionality.
              </p>

              <p className={styles.infoPara}>
                Coevas Terminal is specifically built for desktop use and is supported only on
                Windows systems. It is not designed for mobile or Android platforms.
              </p>

              <p className={styles.infoPara}>
                The software is lightweight, easy to use, and completely free of cost. There are
                no advertisements, no hidden charges, and no unnecessary restrictions.
              </p>

              <p className={styles.infoPara}>
                All official versions of the application are distributed through{' '}
                <strong>GitHub Releases</strong>, ensuring that users always download authentic
                and up-to-date builds directly from the official source.
              </p>

              <p className={styles.infoPara}>
                When running the application for the first time, Windows may display a SmartScreen
                warning indicating that the publisher is not yet recognized. This is a standard
                behavior for newly released applications and does not indicate any security issue.
              </p>

              <p className={styles.infoPara}>
                You can proceed by clicking <strong>"More Info"</strong> and then{' '}
                <strong>"Run Anyway"</strong>.
              </p>

              <p className={styles.infoPara}>
                We are committed to maintaining transparency and user trust. The software is
                developed with a focus on safety, performance, and reliability, without any
                malicious behavior or intrusive elements.
              </p>

              <p className={styles.infoPara}>
                For updates, documentation, or support, please visit the official website.
              </p>
            </section>
          )}

          {/* ─── Releases ─── */}
          {activeTab === 'releases' && (
            <section className={styles.downloadSection}>
              <h2 className={styles.sectionHeading}>Releases</h2>

              {/* Latest version card */}
              {latest && (
                <div className={styles.latestBox}>
                  <h3 className={styles.latestTitle}>Latest Version: v{latest.version}</h3>
                  <p className={styles.latestDate}>Release date: {latest.date}</p>
                  <FeatureList features={latest.features} />
                  {latest.downloadLink ? (
                    <a
                      className={styles.downloadBtn}
                      href={latest.downloadLink}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <DownloadIcon />
                      Download for Windows
                    </a>
                  ) : (
                    <p className={styles.invalidLink}>Invalid download link</p>
                  )}
                </div>
              )}

              {/* Older versions header */}
              <div className={styles.olderVersionsHeader}>
                <svg
                  className={styles.icon}
                  viewBox="0 0 16 16"
                  width="14"
                  height="14"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.752 1.752 0 0 1 1 7.775Zm1.5 0c0 .066.026.13.073.177l6.25 6.25a.25.25 0 0 0 .354 0l5.025-5.025a.25.25 0 0 0 0-.354l-6.25-6.25a.25.25 0 0 0-.177-.073H2.75a.25.25 0 0 0-.25.25v5.025Z" />
                </svg>
                <h3 className={styles.olderVersionsTitle}>Previous Releases</h3>
              </div>

              {/* Older versions list */}
              <div className={styles.olderList}>
                {older.length === 0 ? (
                  <p className={styles.noOlderText}>No older versions available.</p>
                ) : (
                  older.map((r) => (
                    <div key={r.version} className={styles.versionItem}>
                      <div className={styles.versionInfo}>
                        <strong className={styles.versionLabel}>v{r.version}</strong>
                        <small className={styles.versionDate}>Released on {r.date}</small>
                        <FeatureList features={r.features} />
                      </div>
                      {r.downloadLink ? (
                        <a
                          className={styles.downloadBtn}
                          href={r.downloadLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <DownloadIcon />
                          Download
                        </a>
                      ) : (
                        <small className={styles.invalidLinkSmall}>Invalid link</small>
                      )}
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

        </div>

        {/* ── Footer ── */}
        <footer className={styles.footer}>
          <p className={styles.footerText}>
            © 2026 <strong>Openroot Systems</strong>. All rights reserved.
            &nbsp;·&nbsp;
            <a href="license-coevas-software.html" className={styles.footerLink}>License</a>
            &nbsp;·&nbsp;
            <a href="coevas-security-terms.html" className={styles.footerLink}>Terms of Use</a>
          </p>
          <p className={styles.footerSub}>
            This software and this website are the intellectual property of Openroot Systems.
            Unauthorized redistribution or modification is prohibited.
          </p>
        </footer>

      </div>
    </div>
  );
};

export default CoeasTerminal;