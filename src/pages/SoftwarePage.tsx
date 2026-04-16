import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useCallback, useEffect, memo } from "react";
import { softwareList } from "../data/softwareList";
import { softwareContent } from "../data/softwareContent";
import { Helmet } from "react-helmet-async";
import { SoftwareContent } from "../types/software";
import "../components/styles/softwarePage.css";

// ONLY lives here — Navbar and SoftwareHub no longer need this
// Maps slug → internal React Router path used AFTER login check
const INTERNAL_ROUTES: Record<string, string> = {
  "resource-hub": "/resource-hub",
  "coevas-terminal": "/coevas-terminal",
};

/* ── VIDEO PLAYER ── */
interface VideoPlayerProps { src: string; label: string; }

const VideoPlayer = memo(({ src, label }: VideoPlayerProps) => {
  const [paused, setPaused] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    const tryPlay = () => { vid.play().catch(() => setPaused(true)); };
    if (vid.readyState >= 3) tryPlay();
    else vid.addEventListener("canplay", tryPlay, { once: true });
    return () => { vid.removeEventListener("canplay", tryPlay); };
  }, [src]);

  const togglePlay = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    if (vid.paused) { vid.play().catch(() => {}); setPaused(false); }
    else { vid.pause(); setPaused(true); }
  }, []);

  return (
    <div className="sp-video-wrap">
      <div className="sp-video-frame">
        <div className="sp-video-chrome" aria-hidden="true">
          <span className="sp-video-dot sp-video-dot--red" />
          <span className="sp-video-dot sp-video-dot--yellow" />
          <span className="sp-video-dot sp-video-dot--green" />
        </div>
        <video ref={videoRef} src={src} muted loop playsInline preload="auto" className="sp-video" aria-label={label} />
        <div className="sp-video-overlay" aria-hidden="true" />
        <button
          className={`sp-video-toggle ot-glass${paused ? " sp-video-toggle--paused" : ""}`}
          onClick={togglePlay}
          aria-label={paused ? "Play video" : "Pause video"}
          type="button"
        >
          {paused ? (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="5 3 19 12 5 21 5 3" /></svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
          )}
        </button>
      </div>
      <p className="sp-video-caption">See it in action</p>
    </div>
  );
});
VideoPlayer.displayName = "VideoPlayer";

/* ── MAIN PAGE ── */
export default function SoftwarePage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate  = useNavigate();
  const tool      = softwareList.find((t) => t.slug === slug);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const toggleFAQ = useCallback((i: number) => setActiveIndex((prev) => (prev === i ? null : i)), []);

  if (!tool) {
    return (
      <div className="sp-not-found">
        <p>Tool not found.</p>
        <Link to="/software" className="sp-back-link">← Back to Software Hub</Link>
      </div>
    );
  }

  const content: SoftwareContent = softwareContent[slug!] ?? { overview: tool.description, features: [], purpose: "" };
  const formatText = (text: string) => text.split("\n\n").map((p, i) => <p key={i} className="sp-para">{p}</p>);
  const pageUrl  = `https://openroot.in/software/${tool.slug}`;
  const videoSrc = (tool as any).video as string | undefined;
  const hasVideo = Boolean(videoSrc);

  // ✅ Launch flow — identical for ALL tools:
  // 1. Check login
  // 2a. If slug has an internal route → navigate() inside the app
  // 2b. Otherwise → window.location.href to external URL (with UID)
  const launch = () => {
    try {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        alert("Please log in first to access this tool.");
        return;
      }

      // Internal route (e.g. helping-hand → /resource-hub)
      if (INTERNAL_ROUTES[tool.slug]) {
        navigate(INTERNAL_ROUTES[tool.slug]);
        return;
      }

      // External URL with UID injection
      const userUID = sessionStorage.getItem("openrootUserUID") || localStorage.getItem("openrootUserUID");
      const finalURL = new URL(tool.url);
      if (userUID && !finalURL.searchParams.has("uid")) {
        finalURL.searchParams.set("uid", encodeURIComponent(userUID));
      }
      window.location.href = finalURL.toString();
    } catch (err) {
      console.error("Tool launch failed:", err);
    }
  };

  const faqs = [
    { q: `What is ${tool.name}?`, a: tool.description },
    { q: "How do I use it?", a: "Click the Launch Tool button above. You will need to be logged in to your Openroot account." },
    { q: "Is it free to use?", a: "Yes. All tools listed on Openroot Software Hub are free to access with a registered account." },
  ];

  const exploreLinks = [
    { href: "/software/openroot-classes",       label: "Openroot Classes" },
    { href: "/software/nior-ai",                label: "NIOR AI" },
    { href: "/software/travel-expense-manager", label: "Travel Expense Manager" },
    { href: "/certificate-verification",         label: "Certificate Verification" },
    { href: "/software/resource-hub",            label: "Resource Hub & Job Updates" },
    { href: "/software/openroot-makaut_grade_and_percentage-calculator", label: "Makaut Grade Calculator" },
    { href: "/software/coevas-terminal",         label: "Coevas Terminal" },
  ];

  return (
    <div className="sp-root">
      <Helmet>
        <title>{`${tool.name} – Free Tool by Openroot Systems`}</title>
        <meta name="description" content={tool.seoDescription || tool.description} />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content={`${tool.name} | Openroot Systems`} />
        <meta property="og:description" content={tool.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content="https://openroot.in/assets/company-icon.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={tool.name} />
        <meta name="twitter:description" content={tool.description} />
        <meta name="twitter:image" content="https://openroot.in/assets/company-icon.png" />
      </Helmet>

      <header className={`sp-hero${hasVideo ? " sp-hero--split" : ""}`}>
        <div className="sp-hero-glow" aria-hidden="true" />
        <div className="sp-hero-grid" aria-hidden="true" />
        <div className="sp-hero-text">
          <h1 className="sp-hero-title"><span>{tool.name}</span></h1>
          <p className="sp-hero-desc">{tool.description}</p>
          <div className="sp-hero-actions">
            <button className="sp-launch-btn ot-active-scale ot-focus-brand" onClick={launch} type="button">
              <span className="sp-launch-btn-icon" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </span>
              Launch Tool
            </button>
            <p className="sp-launch-note">Login required · Secure access</p>
          </div>
        </div>
        {hasVideo && videoSrc && (
          <div className="sp-hero-video-desktop">
            <VideoPlayer src={videoSrc} label={`${tool.name} demo video`} />
          </div>
        )}
      </header>

      {hasVideo && videoSrc && (
        <div className="sp-hero-video-mobile">
          <VideoPlayer src={videoSrc} label={`${tool.name} demo video`} />
        </div>
      )}

      <div className="sp-body">
        <section className="sp-section">
          <p className="ot-kicker ot-kicker--brand sp-section-label">Overview</p>
          <h2 className="sp-section-title">What is {tool.name}?</h2>
          <div className="sp-overview">{formatText(content.overview)}</div>
        </section>

        {content.features.length > 0 && (
          <section className="sp-section">
            <p className="ot-kicker ot-kicker--brand sp-section-label">Capabilities</p>
            <h2 className="sp-section-title">Key Features</h2>
            <div className="sp-features-grid">
              {content.features.map((f, i) => (
                <div key={i} className="sp-feature-card ot-card-lift ot-card-lift--brand">
                  <span className="sp-feature-check ot-brand-icon" aria-hidden="true">
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none">
                      <path d="M3 8L6.5 11.5L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                  <p>{f}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {content.purpose && (
          <section className="sp-section">
            <p className="ot-kicker ot-kicker--brand sp-section-label">Purpose</p>
            <h2 className="sp-section-title">Why it exists</h2>
            <div className="sp-purpose">{formatText(content.purpose)}</div>
          </section>
        )}

        <section className="sp-section">
          <p className="ot-kicker ot-kicker--brand sp-section-label">FAQ</p>
          <h2 className="sp-section-title">Common Questions</h2>
          <div className="sp-faq-list">
            {faqs.map((item, index) => (
              <div
                key={index}
                className={`sp-faq-item ot-accent-bar-left ot-accent-bar-left--animate${activeIndex === index ? " sp-faq-item--open ot-accent-bar-left--active" : ""}`}
              >
                <button className="sp-faq-trigger ot-focus-brand" onClick={() => toggleFAQ(index)} aria-expanded={activeIndex === index} type="button">
                  <span className="sp-faq-trigger-left sp-faq-trigger-text">{item.q}</span>
                  <span className="sp-faq-chevron" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                <div className={`sp-faq-answer ot-accordion-body${activeIndex === index ? " ot-accordion-body--open" : ""}`} role="region">
                  <div className="sp-faq-answer-inner"><p>{item.a}</p></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider" />

        <section className="sp-explore">
          <p className="sp-explore-title">Explore More Tools</p>
          <div className="sp-explore-links">
            {exploreLinks.map((link) => (
              <a key={link.href} href={link.href} className="sp-explore-link">{link.label}</a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}