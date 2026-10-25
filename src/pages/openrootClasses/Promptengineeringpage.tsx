// ============================================================
// BANNER 1 PAGE — "BECOME A CERTIFIED PROMPT ENGINEER"
// Route: /openroot-classes/prompt-engineering
//
// A fully dedicated page with its own look (dark prompt-console hero,
// fact tiles, learn bento, pipeline track). Content is written right
// here; styles live in OCStyle/OCPagePromptEngineering.css (every class
// starts with "pe"). Nothing here is shared with any other banner page.
// ============================================================

import { Helmet } from "react-helmet-async";

import { BANNER_BASE_PATH } from "./data/bannerData";
import {
  BannerBackLink,
  PageCta,
  SITE_URL,
  whatsappLink,
} from "./Bannerpagekit";

import "./OCStyle/Ocpagepromptengineering.css";

// ============================================================
// CONTENT (edit text here)
// ============================================================

const SLUG = "prompt-engineering";

const BADGE = "Professional Certificate Program";
const TITLE = "Become a Certified Prompt Engineer";
const TAGLINE =
  "Learn practical prompt engineering skills from zero. For beginners, students, creators, and non-tech learners. No coding background required.";

const CTA = {
  label: "Enroll through WhatsApp",
  href: whatsappLink(
    "Hi, I want to know more about the Prompt Engineering program."
  ),
};

// The example prompt shown in the console graphic (illustration only).
const EXAMPLE_PROMPT =
  "Act as a reel editor. Turn my idea into a 30-second script with a hook, three beats and a closing line.";

// What the prompt can produce (from the "what you will learn" list).
const OUTPUT_TAGS = ["Image", "Audio", "Video", "Code"];

type FactKind = "plain" | "fees" | "nocode";

const FACTS: { label: string; value: string; kind: FactKind; tone: string }[] = [
  { label: "Duration", value: "2 hour class", kind: "plain", tone: "mint" },
  { label: "Fees", value: "₹200", kind: "fees", tone: "amber" },
  { label: "Language", value: "English, Hindi, Bengali", kind: "plain", tone: "blue" },
  { label: "Certificate", value: "Provided", kind: "plain", tone: "pink" },
  { label: "Level", value: "Beginner friendly", kind: "plain", tone: "paper" },
  { label: "Requirement", value: "No coding needed", kind: "nocode", tone: "mint" },
];

const LEARN: { title: string; sub?: string; tone: string; icon: string }[] = [
  { title: "Prompt engineering fundamentals", tone: "blue", icon: "prompt" },
  {
    title: "Content generation",
    sub: "Image, audio and video",
    tone: "mint",
    icon: "play",
  },
  { title: "Coding basics", tone: "amber", icon: "code" },
  { title: "Instagram reels editing using prompts", tone: "pink", icon: "reel" },
  { title: "AI tools and workflow", tone: "paper", icon: "flow" },
];

const WORKFLOW = ["Ideas", "Prompts", "Create", "Refine", "Publish"];

const AUDIENCE: { label: string; shape: string }[] = [
  { label: "Beginners", shape: "circle" },
  { label: "Students", shape: "square" },
  { label: "Creators", shape: "triangle" },
  { label: "Non-tech learners", shape: "plus" },
];

// ============================================================
// SMALL GRAPHICS
// ============================================================

function LearnIcon({ kind }: { kind: string }) {
  const common = {
    className: "pe__learn-icon",
    viewBox: "0 0 48 48",
    "aria-hidden": true,
    focusable: false,
  } as const;

  switch (kind) {
    case "prompt":
      // > _
      return (
        <svg {...common}>
          <path d="M8 12l16 12-16 12" />
          <path d="M28 38h14" />
        </svg>
      );
    case "play":
      return (
        <svg {...common}>
          <rect x="6" y="8" width="36" height="32" />
          <path d="M20 17l12 7-12 7z" className="pe__fill" />
        </svg>
      );
    case "code":
      // { }
      return (
        <svg {...common}>
          <path d="M18 8c-6 0-6 4-6 8s0 8-6 8c6 0 6 4 6 8s0 8 6 8" />
          <path d="M30 8c6 0 6 4 6 8s0 8 6 8c-6 0-6 4-6 8s0 8-6 8" />
        </svg>
      );
    case "reel":
      return (
        <svg {...common}>
          <rect x="14" y="4" width="20" height="40" />
          <path d="M14 14h20M14 34h20" />
          <path d="M22 20l6 4-6 4z" className="pe__fill" />
        </svg>
      );
    default:
      // three connected nodes
      return (
        <svg {...common}>
          <rect x="4" y="18" width="12" height="12" />
          <rect x="18" y="4" width="12" height="12" />
          <rect x="32" y="32" width="12" height="12" />
          <path d="M16 24h6V16M24 16v0M30 10h6v22" />
        </svg>
      );
  }
}

// ============================================================
// PAGE
// ============================================================

export default function PromptEngineeringPage() {
  return (
    <main className="pe">
      <Helmet>
        <title>{`${TITLE} | Openroot Classes`}</title>
        <meta name="description" content={TAGLINE} />
        <link rel="canonical" href={`${SITE_URL}${BANNER_BASE_PATH}/${SLUG}`} />
      </Helmet>

      <div className="pe__inner">
        <BannerBackLink className="pe__back" />

        {/* HERO: TEXT + PROMPT CONSOLE */}
        <section className="pe__hero">
          <div className="pe__hero-text">
            <p className="pe__badge">{BADGE}</p>
            <h1 className="pe__title">{TITLE}</h1>
            <p className="pe__tagline">{TAGLINE}</p>
            <PageCta
              href={CTA.href}
              label={CTA.label}
              className="pe__cta"
              arrowClassName="pe__cta-arrow"
            />
          </div>

          {/* decorative console: shows what a prompt looks like */}
          <div className="pe__console" aria-hidden="true">
            <div className="pe__console-bar">
              <span className="pe__console-dot" />
              <span className="pe__console-dot" />
              <span className="pe__console-dot" />
              <span className="pe__console-name">prompt.txt</span>
            </div>

            <div className="pe__console-body">
              <p className="pe__console-prompt">
                <span className="pe__console-mark">&gt;</span>
                {EXAMPLE_PROMPT}
                <span className="pe__caret" />
              </p>

              <div className="pe__console-out">
                <span className="pe__out-line pe__out-line--long" />
                <span className="pe__out-line pe__out-line--mid" />
                <span className="pe__out-line pe__out-line--long" />
                <span className="pe__out-line pe__out-line--short" />
              </div>

              <div className="pe__console-tags">
                {OUTPUT_TAGS.map((tag) => (
                  <span key={tag} className="pe__console-tag">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FACT TILES */}
        <section className="pe__facts" aria-label="Program details">
          {FACTS.map(({ label, value, kind, tone }) => (
            <div
              key={label}
              data-tone={tone}
              className={`pe__fact pe__fact--${kind}`}
            >
              <span className="pe__fact-label">{label}</span>
              <span className="pe__fact-value">{value}</span>
              {kind === "nocode" && (
                <span className="pe__nocode" aria-hidden="true">
                  &lt;/&gt;
                </span>
              )}
            </div>
          ))}
        </section>

        {/* WHAT YOU WILL LEARN */}
        <section className="pe__block">
          <h2 className="pe__heading">What you will learn</h2>

          <div className="pe__learn">
            {LEARN.map(({ title, sub, tone, icon }) => (
              <article key={title} data-tone={tone} className="pe__tile">
                <LearnIcon kind={icon} />
                <h3 className="pe__tile-title">{title}</h3>
                {sub && <p className="pe__tile-sub">{sub}</p>}
              </article>
            ))}
          </div>
        </section>

        {/* WORKFLOW TRACK */}
        <section className="pe__block pe__block--track">
          <h2 className="pe__heading">The workflow you will follow</h2>

          <ol className="pe__track">
            {WORKFLOW.map((step, i) => (
              <li key={step} className="pe__track-step">
                <span className="pe__node">{i + 1}</span>
                <span className="pe__track-label">{step}</span>
              </li>
            ))}
          </ol>
        </section>

        {/* WHO THIS IS FOR */}
        <section className="pe__block">
          <h2 className="pe__heading">Who this is for</h2>

          <ul className="pe__who">
            {AUDIENCE.map(({ label, shape }) => (
              <li key={label} className={`pe__who-card pe__who-card--${shape}`}>
                <span className="pe__who-shape" aria-hidden="true" />
                <span className="pe__who-label">{label}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* CLOSING CALL TO ACTION */}
        <section className="pe__footer-cta">
          <h2 className="pe__footer-title">Ready to write your first prompt?</h2>
          <PageCta
            href={CTA.href}
            label={CTA.label}
            className="pe__cta pe__cta--ink"
            arrowClassName="pe__cta-arrow"
          />
        </section>
      </div>
    </main>
  );
}