import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import styles from '../components/styles/coevas.module.css';

interface Release {
  version: string;
  date: string;
  downloadLink: string;
  features?: string[];
}

type TabName = 'releases' | 'about';

const releases: Release[] = [
  {
    version: '1.3.0',
    date: '2026-04-11',
    downloadLink:
      'https://github.com/COMEONSOM/openroot-web/releases/download/v1.3.0/CoevasTerminalSetup-1.3.0.exe',
    features: [
      'Enhanced YouTube downloading with 4K and 8K video support',
      'Improved Facebook post, reel, image, and video downloading support',
      'Enhanced Instagram reel, video post, and audio-supported downloading',
      'Improved Threads media downloading support',
      'Media collections exceeding normal handling limits can now be downloaded as ZIP files',
      'Automatic update system continues to deliver future updates directly inside the app',
    ],
  },
  {
    version: '1.2.0',
    date: '2026-02-24',
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

const RepoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    width="20"
    height="20"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h7A2.5 2.5 0 0 1 14 2.5v10.5a.75.75 0 0 1-1.092.67L8 11.13l-4.908 2.54A.75.75 0 0 1 2 13V2.5Zm2.5-1A1 1 0 0 0 3.5 2.5V11.1l4.158-2.15a.75.75 0 0 1 .684 0L12.5 11.1V2.5a1 1 0 0 0-1-1Z" />
  </svg>
);

const AboutIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    width="14"
    height="14"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M8 0a8 8 0 1 1 0 16A8 8 0 0 1 8 0ZM1.5 8a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0Zm6.75-3a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0ZM7 6.75A.75.75 0 0 1 7.75 6h.5a.75.75 0 0 1 .75.75v3.5h.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1 0-1.5h.5v-2.75H7.75A.75.75 0 0 1 7 6.75Z" />
  </svg>
);

const ReleaseIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    className={className}
    viewBox="0 0 16 16"
    width="14"
    height="14"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M1 7.775V2.75C1 1.784 1.784 1 2.75 1h5.025c.464 0 .91.184 1.238.513l6.25 6.25a1.75 1.75 0 0 1 0 2.474l-5.026 5.026a1.75 1.75 0 0 1-2.474 0l-6.25-6.25A1.752 1.752 0 0 1 1 7.775Zm1.5 0c0 .066.026.13.073.177l6.25 6.25a.25.25 0 0 0 .354 0l5.025-5.025a.25.25 0 0 0 0-.354l-6.25-6.25a.25.25 0 0 0-.177-.073H2.75a.25.25 0 0 0-.25.25v5.025Z" />
  </svg>
);

const FeatureList: React.FC<{ features?: string[] }> = ({ features }) => {
  if (!features?.length) return null;

  return (
    <ul className={styles.versionFeatures}>
      {features.map((feature, index) => (
        <li key={`${feature}-${index}`}>{feature}</li>
      ))}
    </ul>
  );
};

const CoevasTerminal: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabName>('releases');

  const sortedReleases = useMemo(
    () => [...releases].sort((a, b) => compareVersions(a.version, b.version)),
    [],
  );

  const latest = sortedReleases[0];
  const olderReleases = sortedReleases.slice(1);

  return (
    <div className={styles.root}>
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

      <div className={styles.container}>
        <header className={styles.repoHeader}>
          <div className={styles.repoTitleRow}>
            <RepoIcon className={styles.repoIcon} />
            <h1 className={styles.repoTitle}>openroot-coevas-terminal</h1>
            <span className={styles.repoVisibilityBadge}>Public</span>
          </div>

          <p className={styles.tagline}>
            By Openroot Systems — fast, simple, and built for a clean Windows experience.
          </p>
        </header>

        <nav className={styles.repoTabs} aria-label="Page sections">
          <button
            type="button"
            className={`${styles.repoTab}${activeTab === 'releases' ? ` ${styles.active}` : ''}`}
            onClick={() => setActiveTab('releases')}
          >
            <ReleaseIcon className={styles.icon} />
            Releases
          </button>

          <button
            type="button"
            className={`${styles.repoTab}${activeTab === 'about' ? ` ${styles.active}` : ''}`}
            onClick={() => setActiveTab('about')}
          >
            <AboutIcon className={styles.icon} />
            About
          </button>
        </nav>

        <div className={styles.repoBody}>
          {activeTab === 'about' && (
            <section className={styles.appInfo}>
              <h2 className={styles.sectionHeading}>About</h2>

              <p className={styles.infoPara}>
                <strong>Coevas Terminal</strong> is a desktop application developed and distributed by{' '}
                <strong>Openroot Systems</strong>{' '}
                (
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

          {activeTab === 'releases' && (
            <section className={styles.downloadSection}>
              <h2 className={styles.sectionHeading}>Releases</h2>
              <p className={styles.sectionSubtext}>
                Download the latest build or pick an older version from the archive below.
              </p>

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

              <div className={styles.olderList}>
                {olderReleases.length === 0 ? (
                  <p className={styles.noOlderText}>No older versions available.</p>
                ) : (
                  olderReleases.map((release) => (
                    <div key={release.version} className={styles.versionItem}>
                      <div className={styles.versionInfo}>
                        <strong className={styles.versionLabel}>v{release.version}</strong>
                        <small className={styles.versionDate}>Released on {release.date}</small>
                        <FeatureList features={release.features} />
                      </div>

                      {release.downloadLink ? (
                        <a
                          className={styles.secondaryBtn}
                          href={release.downloadLink}
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

        <footer className={styles.footer}>
          <p className={styles.footerText}>
            © 2026 <strong>Openroot Systems</strong>. All rights reserved.
            &nbsp;·&nbsp;
            <Link to="/License" className={styles.footerLink}>
              License
            </Link>
            &nbsp;·&nbsp;
            <Link to="/CoevasTerms" className={styles.footerLink}>
              Terms of Use
            </Link>
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

export default CoevasTerminal;