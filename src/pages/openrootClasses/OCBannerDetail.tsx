// ============================================================
// BANNER DETAIL PAGE — ONE TEMPLATE FOR EVERY BANNER
// Route: /openroot-classes/:slug
// Content comes from data/bannerData.ts. Layout and styling never change.
//
// Layout:
//   [ back link ]
//   [ hero ........................ | quick facts ]
//   [ section 01 | section 02 | section 03 ... ]   (auto-fit grid)
//   [ closing call-to-action band ]
// ============================================================

import React, { useEffect } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import { BANNER_BASE_PATH, getBannerBySlug } from "./data/bannerData";

import "./OCStyle/OCBannerDetail.css";

const SITE_URL = "https://openroot.in";

export default function OCBannerDetail() {
  const { slug } = useParams<{ slug: string }>();
  const entry = getBannerBySlug(slug);
  const navigate = useNavigate();
  const location = useLocation();

  // "Back" button: behaves like the browser's back button.
  // If the user arrived from inside the site, go one step back in history
  // (no new history entry is added). If the page was opened directly
  // (new tab, shared link, refresh), the link falls back to the
  // Openroot Classes page.
  const handleBack = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    const cameFromInsideSite = location.key !== "default";
    const modifiedClick =
      e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;

    if (cameFromInsideSite && !modifiedClick) {
      e.preventDefault();
      navigate(-1);
    }
  };

  // Always open the page from the top
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  // ----------------------------------------------------------
  // PAGE NOT FOUND
  // ----------------------------------------------------------
  if (!entry) {
    return (
      <main className="oc-detail">
        <div className="oc-detail__inner">
          <section className="oc-detail__hero">
            <div className="oc-detail__hero-text">
              <h1 className="oc-detail__title">Page not found</h1>
              <p className="oc-detail__tagline">
                This banner page does not exist or has been moved.
              </p>
              <Link to={BANNER_BASE_PATH} className="oc-detail__cta">
                Back to Openroot Classes
              </Link>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const { page } = entry;
  const hasFacts = page.highlights.length > 0;

  // ----------------------------------------------------------
  // PAGE
  // ----------------------------------------------------------
  return (
    <main className="oc-detail">
      <Helmet>
        <title>{`${page.title} | Openroot Classes`}</title>
        <meta name="description" content={page.tagline} />
        <link
          rel="canonical"
          href={`${SITE_URL}${BANNER_BASE_PATH}/${entry.slug}`}
        />
      </Helmet>

      <div className="oc-detail__inner">
        <Link
          to={BANNER_BASE_PATH}
          className="oc-detail__back"
          onClick={handleBack}
        >
          ← Back to Openroot Classes
        </Link>

        {/* TOP ROW: HERO + QUICK FACTS */}
        <div
          className={`oc-detail__top ${
            hasFacts ? "oc-detail__top--with-facts" : ""
          }`}
        >
          <section
            className={`oc-detail__hero ${
              page.heroImage ? "oc-detail__hero--with-image" : ""
            }`}
          >
            <div className="oc-detail__hero-text">
              {page.badge && <p className="oc-detail__badge">{page.badge}</p>}
              <h1 className="oc-detail__title">{page.title}</h1>
              <p className="oc-detail__tagline">{page.tagline}</p>

              {page.notice && (
                <p className="oc-detail__notice">{page.notice}</p>
              )}

              <a
                href={page.cta.href}
                className="oc-detail__cta"
                target="_blank"
                rel="noopener noreferrer"
              >
                {page.cta.label}
              </a>
            </div>

            {page.heroImage && (
              <img
                src={page.heroImage}
                alt={page.heroImageAlt ?? page.title}
                className="oc-detail__hero-image"
              />
            )}
          </section>

          {hasFacts && (
            <aside className="oc-detail__highlights" aria-label="Key details">
              {page.highlights.map(({ label, value }) => (
                <div key={label} className="oc-detail__highlight">
                  <span className="oc-detail__highlight-label">{label}</span>
                  <span className="oc-detail__highlight-value">{value}</span>
                </div>
              ))}
            </aside>
          )}
        </div>

        {/* CONTENT SECTIONS (GRID) */}
        {page.sections.length > 0 && (
          <div className="oc-detail__sections">
            {page.sections.map((section) => (
              <section
                key={section.heading}
                className={`oc-detail__section ${
                  section.image ? "oc-detail__section--with-image" : ""
                }`}
              >
                <div className="oc-detail__section-text">
                  <h2 className="oc-detail__section-title">
                    {section.heading}
                  </h2>

                  {section.paragraphs?.map((text, i) => (
                    <p key={i} className="oc-detail__paragraph">
                      {text}
                    </p>
                  ))}

                  {section.bullets && (
                    <ul className="oc-detail__list">
                      {section.bullets.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {section.image && (
                  <img
                    src={section.image}
                    alt={section.imageAlt ?? section.heading}
                    className="oc-detail__section-image"
                    loading="lazy"
                  />
                )}
              </section>
            ))}
          </div>
        )}

        {/* CLOSING CALL TO ACTION */}
        <section className="oc-detail__footer-cta">
          <h2 className="oc-detail__section-title">Interested?</h2>
          <a
            href={page.cta.href}
            className="oc-detail__cta"
            target="_blank"
            rel="noopener noreferrer"
          >
            {page.cta.label}
          </a>
        </section>
      </div>
    </main>
  );
}