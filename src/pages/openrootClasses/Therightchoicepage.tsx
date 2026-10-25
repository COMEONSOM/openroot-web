// ============================================================
// BANNER 2 PAGE — "WHY OPENROOT.IN IS THE RIGHT CHOICE"
// Route: /openroot-classes/the-right-choice
//
// A fully dedicated page: the content is written right here and the
// styles live in OCStyle/OCPageTheRightChoice.css (every class starts
// with "trc"). Change anything on this page without touching any
// other banner page.
// ============================================================

import { Helmet } from "react-helmet-async";

import { BANNER_BASE_PATH } from "./data/bannerData";
import { BannerBackLink, PageCta, SITE_URL } from "./Bannerpagekit";

import "./OCStyle/Ocpagetherightchoice.css";

// ============================================================
// CONTENT (edit text here)
// ============================================================

const SLUG = "the-right-choice";

const BADGE = "Why openroot.in";
const TITLE = "Why openroot.in is the right choice for you";
const TAGLINE =
  "Simple. Practical. Result-oriented learning. Your growth is our mission. Built for students, working professionals and beginners.";

const CTA = {
  label: "Explore our current offerings",
  href: `${BANNER_BASE_PATH}/prompt-engineering`,
};

const FACTS: { label: string; value: string }[] = [
  { label: "Built for", value: "Students, professionals, beginners" },
  { label: "Starting point", value: "From zero, no prior knowledge" },
  { label: "Skills", value: "Practical and real-world" },
  { label: "Pricing", value: "Affordable and honest" },
  { label: "Guidance", value: "Step by step" },
  { label: "Language", value: "English, Hindi, Bengali" },
];

const REASONS: { head: string; detail: string }[] = [
  {
    head: "Beginner-friendly from zero",
    detail: "Start from scratch. No prior knowledge needed.",
  },
  {
    head: "Practical real-world skills",
    detail: "Real-life skills you can use, not just theory.",
  },
  {
    head: "Affordable, honest pricing",
    detail: "High-quality learning that stays budget-friendly.",
  },
  {
    head: "Step-by-step guidance",
    detail: "A clear roadmap, taught one step at a time.",
  },
];

const LANGUAGE_TEXT =
  "Multilingual support across every live interaction. Join live sessions and ask your doubts in English, Hindi or Bengali.";

const AUDIENCE = ["Students", "Working professionals", "Beginners"];

const WORKFLOW = ["Ideas", "Prompts", "Create", "Refine", "Publish"];

// ============================================================
// DECORATION
// ============================================================

/** Barcode bars for the pass, always the same for the same slug. */
function barcode(seed: string): { bars: { x: number; w: number }[]; width: number } {
  const bars: { x: number; w: number }[] = [];
  let x = 0;

  for (let i = 0; i < seed.length * 4 && x < 200; i++) {
    const c = seed.charCodeAt(i % seed.length) + i * 7;
    const w = (c % 3) + 1;
    const gap = ((c >> 2) % 2) + 1;
    bars.push({ x, w });
    x += w + gap;
  }

  return { bars, width: x };
}

const BARS = barcode(SLUG);

function HeroShapes() {
  return (
    <svg
      className="trc__shapes"
      viewBox="0 0 400 400"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="250" cy="250" r="150" className="trc__shape-lime" />
      <rect
        x="40"
        y="210"
        width="120"
        height="120"
        className="trc__shape-coral"
        transform="rotate(14 100 270)"
      />
      <path
        d="M300 20h40v60h60v40h-60v60h-40v-60h-60V80h60z"
        className="trc__shape-sun"
      />
      <circle cx="120" cy="90" r="46" className="trc__shape-ring" />
    </svg>
  );
}

// ============================================================
// PAGE
// ============================================================

export default function TheRightChoicePage() {
  return (
    <main className="trc">
      <Helmet>
        <title>{`${TITLE} | Openroot Classes`}</title>
        <meta name="description" content={TAGLINE} />
        <link rel="canonical" href={`${SITE_URL}${BANNER_BASE_PATH}/${SLUG}`} />
      </Helmet>

      <div className="trc__inner">
        <BannerBackLink className="trc__back" />

        {/* HERO + COURSE PASS */}
        <div className="trc__top trc__top--with-facts">
          <section className="trc__hero">
            <div className="trc__hero-text">
              <p className="trc__badge">{BADGE}</p>
              <h1 className="trc__title">{TITLE}</h1>
              <p className="trc__tagline">{TAGLINE}</p>
              <PageCta
                href={CTA.href}
                label={CTA.label}
                className="trc__cta"
                arrowClassName="trc__cta-arrow"
              />
            </div>
            <HeroShapes />
          </section>

          <aside className="trc__pass" aria-label="Key details">
            <div className="trc__pass-head">
              <span>Course pass</span>
              <span>openroot.in</span>
            </div>

            <dl className="trc__pass-list">
              {FACTS.map(({ label, value }) => (
                <div key={label} className="trc__pass-row">
                  <dt className="trc__pass-label">{label}</dt>
                  <dd className="trc__pass-value">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="trc__pass-tear" aria-hidden="true" />

            <div className="trc__pass-foot" aria-hidden="true">
              <svg
                className="trc__barcode"
                viewBox={`0 0 ${BARS.width} 40`}
                preserveAspectRatio="none"
                focusable="false"
              >
                {BARS.bars.map((b) => (
                  <rect key={b.x} x={b.x} y="0" width={b.w} height="40" />
                ))}
              </svg>
              <span className="trc__pass-code">{SLUG}</span>
            </div>
          </aside>
        </div>

        {/* SCROLLING TICKER */}
        <div className="trc__ticker" aria-hidden="true">
          <div className="trc__ticker-track">
            {[0, 1].map((group) => (
              <div key={group} className="trc__ticker-group">
                {FACTS.map(({ value }) => (
                  <span key={`${group}-${value}`} className="trc__ticker-item">
                    {value}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* CONTENT BENTO */}
        <div className="trc__sections">
          <section className="trc__section trc__section--text" data-tone="sky">
            <h2 className="trc__section-title">Why learners choose openroot.in</h2>
            <ul className="trc__path">
              {REASONS.map(({ head, detail }) => (
                <li key={head} className="trc__path-item">
                  <strong className="trc__path-head">{head}</strong>
                  <span className="trc__path-detail">{detail}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="trc__section trc__section--text" data-tone="coral">
            <h2 className="trc__section-title">Learn in your language</h2>
            <p className="trc__paragraph">{LANGUAGE_TEXT}</p>
          </section>

          <section className="trc__section trc__section--chips" data-tone="lime">
            <h2 className="trc__section-title">Who this is for</h2>
            <ul className="trc__chips">
              {AUDIENCE.map((item) => (
                <li key={item} className="trc__chip">
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section className="trc__section trc__section--flow" data-tone="ink">
            <h2 className="trc__section-title">The workflow you will follow</h2>
            <ol className="trc__flow">
              {WORKFLOW.map((step, i) => (
                <li key={step} className="trc__flow-step">
                  <span className="trc__flow-num">{i + 1}</span>
                  <span className="trc__flow-label">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        </div>

        {/* CLOSING CALL TO ACTION */}
        <section className="trc__footer-cta">
          <h2 className="trc__footer-title">Ready when you are.</h2>
          <PageCta
            href={CTA.href}
            label={CTA.label}
            className="trc__cta"
            arrowClassName="trc__cta-arrow"
          />
        </section>
      </div>
    </main>
  );
}