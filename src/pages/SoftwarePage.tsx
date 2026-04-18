import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useRef, useCallback, useEffect, memo } from "react";
import { softwareList } from "../data/softwareList";
import { softwareContent } from "../data/softwareContent";
import { Helmet } from "react-helmet-async";
import { SoftwareContent } from "../types/software";
import "../components/styles/softwarePage.css";

// Maps slug → internal React Router path used AFTER login check
const INTERNAL_ROUTES: Record<string, string> = {
  "resource-hub": "/resource-hub",
  "coevas-terminal": "/coevas-terminal",
  "makaut-grade-pro": "/makaut-grade-pro",
  "travel-expense-manager": "/travel-expense-manager",
};

// ── SEO keyword map: add / extend per tool slug ──────────────────────────────
const TOOL_KEYWORDS: Record<string, string> = {
  "resource-hub":
    "resource hub, free study materials, job updates, student resources, Openroot resource hub, MAKAUT resources",
  "coevas-terminal":
    "Coevas terminal, online terminal, web terminal, browser terminal, Openroot Coevas",
  "makaut-grade-pro":
    "MAKAUT grade calculator, MAKAUT percentage calculator, MAKAUT CGPA, West Bengal engineering grade, MAKAUT result calculator",
  "travel-expense-manager":
    "travel expense manager, trip expense tracker, travel budget tool, free expense tracker, Openroot travel",
  "nior-ai":
    "NIOR AI, AI assistant, Openroot AI, free AI tool, AI chatbot India",
  "openroot-classes":
    "Openroot classes, free online classes, e-learning India, free courses, Openroot learning platform",
  "openroot-makaut_grade_and_percentage-calculator":
    "MAKAUT grade calculator, MAKAUT percentage calculator, MAKAUT CGPA calculator, WBUT grade calculator, engineering grade India",
};

// Default fallback keywords used when a slug has no specific entry
const DEFAULT_KEYWORDS = (name: string, description: string) =>
  `${name}, free online tool, Openroot Systems, ${description.split(" ").slice(0, 6).join(" ")}, free software India`;

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
        <p>Software not found.</p>
        <Link to="/software" className="sp-back-link">← Back to Software Hub</Link>
      </div>
    );
  }

  const content: SoftwareContent = softwareContent[slug!] ?? { overview: tool.description, features: [], purpose: "" };
  const formatText = (text: string) => text.split("\n\n").map((p, i) => <p key={i} className="sp-para">{p}</p>);

  const pageUrl    = `https://openroot.in/software/${tool.slug}`;
  const videoSrc   = (tool as any).video as string | undefined;
  const hasVideo   = Boolean(videoSrc);
  const keywords   = TOOL_KEYWORDS[tool.slug] ?? DEFAULT_KEYWORDS(tool.name, tool.description);

  // ── SEO: richer title variants ───────────────────────────────────────────
  // Pattern: "<Tool Name> – Free [Category] Tool | Openroot Systems"
  const pageTitle  = tool.seoTitle
    ?? `${tool.name} – Free Online Tool by Openroot Systems`;
  const pageDesc   = tool.seoDescription
    ?? `${tool.description} Use ${tool.name} for free on Openroot Systems – no download required.`;

  // ── JSON-LD schemas ──────────────────────────────────────────────────────
  const faqs = [
    { q: `What is ${tool.name}?`,    a: tool.description },
    { q: "How do I use it?",         a: "Click the Launch Tool button above. You will need to be logged in to your Openroot account." },
    { q: "Is it free to use?",       a: "Yes. All tools listed on Openroot Software Hub are free to access with a registered account." },
    { q: `Who can use ${tool.name}?`, a: "Anyone with a free Openroot account can access this tool. It is designed for students, professionals, and everyday users." },
  ];

  const softwareSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "url": pageUrl,
    "description": pageDesc,
    "applicationCategory": "WebApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "INR"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Openroot Systems",
      "url": "https://openroot.in",
      "logo": "https://openroot.in/assets/company-icon.png"
    },
    ...(content.features.length > 0 && {
      "featureList": content.features.join(", ")
    })
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": { "@type": "Answer", "text": a }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home",         "item": "https://openroot.in" },
      { "@type": "ListItem", "position": 2, "name": "Software Hub", "item": "https://openroot.in/software" },
      { "@type": "ListItem", "position": 3, "name": tool.name,      "item": pageUrl }
    ]
  };

  // ── Launch flow ──────────────────────────────────────────────────────────
  const launch = () => {
    try {
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (!isLoggedIn) {
        alert("Please log in first to access this tool.");
        return;
      }
      if (INTERNAL_ROUTES[tool.slug]) {
        navigate(INTERNAL_ROUTES[tool.slug]);
        return;
      }
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
        {/* ── Primary meta ── */}
        <title>{pageTitle}</title>
        <meta name="description" content={pageDesc} />
        <meta name="keywords"    content={keywords} />
        <link rel="canonical"    href={pageUrl} />

        {/* ── Robots ── */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

        {/* ── Open Graph ── */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={pageUrl} />
        <meta property="og:title"       content={`${tool.name} – Free Tool | Openroot Systems`} />
        <meta property="og:description" content={pageDesc} />
        <meta property="og:image"       content="https://openroot.in/assets/company-icon.png" />
        <meta property="og:site_name"   content="Openroot Systems" />
        <meta property="og:locale"      content="en_IN" />

        {/* ── Twitter Card ── */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:site"        content="@openrootin" />
        <meta name="twitter:title"       content={`${tool.name} | Openroot Systems`} />
        <meta name="twitter:description" content={pageDesc} />
        <meta name="twitter:image"       content="https://openroot.in/assets/company-icon.png" />

        {/* ── JSON-LD structured data ── */}
        <script type="application/ld+json">{JSON.stringify(softwareSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* ── Semantic breadcrumb (visible + crawlable) ── */}
      <nav aria-label="Breadcrumb" className="sp-breadcrumb">
        <ol itemScope itemType="https://schema.org/BreadcrumbList" style={{ display: "flex", gap: "6px", listStyle: "none", padding: 0, margin: 0, fontSize: "0.8rem", opacity: 0.6 }}>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a href="/" itemProp="item"><span itemProp="name">Home</span></a>
            <meta itemProp="position" content="1" />
          </li>
          <li aria-hidden="true">›</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a href="/software" itemProp="item"><span itemProp="name">Software Hub</span></a>
            <meta itemProp="position" content="2" />
          </li>
          <li aria-hidden="true">›</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name">{tool.name}</span>
            <meta itemProp="position" content="3" />
            <meta itemProp="item" content={pageUrl} />
          </li>
        </ol>
      </nav>

      <header className={`sp-hero${hasVideo ? " sp-hero--split" : ""}`}>
        <div className="sp-hero-glow" aria-hidden="true" />
        <div className="sp-hero-grid" aria-hidden="true" />
        <div className="sp-hero-text">
          {/* h1 includes tool name + brand keyword for exact-match SEO */}
          <h1 className="sp-hero-title">
            <span>{tool.name}</span>
            {/* Visually hidden brand anchor for search context */}
            <span className="sr-only"> – Free Tool by Openroot Systems</span>
          </h1>
          <p className="sp-hero-desc">{tool.description}</p>
          <div className="sp-hero-actions">
            <button className="sp-launch-btn ot-active-scale ot-focus-brand" onClick={launch} type="button">
              <span className="sp-launch-btn-icon" aria-hidden="true">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3" />
                </svg>
              </span>
              Launch Software
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
        {/* ── Overview — h2 includes keyword ── */}
        <section className="sp-section" aria-labelledby="section-overview">
          <p className="ot-kicker ot-kicker--brand sp-section-label">Overview</p>
          <h2 id="section-overview" className="sp-section-title">What is {tool.name}?</h2>
          <div className="sp-overview">{formatText(content.overview)}</div>
        </section>

        {content.features.length > 0 && (
          <section className="sp-section" aria-labelledby="section-features">
            <p className="ot-kicker ot-kicker--brand sp-section-label">Capabilities</p>
            <h2 id="section-features" className="sp-section-title">Key Features of {tool.name}</h2>
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
          <section className="sp-section" aria-labelledby="section-purpose">
            <p className="ot-kicker ot-kicker--brand sp-section-label">Purpose</p>
            <h2 id="section-purpose" className="sp-section-title">Why {tool.name} exists</h2>
            <div className="sp-purpose">{formatText(content.purpose)}</div>
          </section>
        )}

        {/* ── FAQ — schema-ready markup ── */}
        <section className="sp-section" aria-labelledby="section-faq">
          <p className="ot-kicker ot-kicker--brand sp-section-label">FAQ</p>
          <h2 id="section-faq" className="sp-section-title">Common Questions about {tool.name}</h2>
          <div className="sp-faq-list" itemScope itemType="https://schema.org/FAQPage">
            {faqs.map((item, index) => (
              <div
                key={index}
                className={`sp-faq-item ot-accent-bar-left ot-accent-bar-left--animate${activeIndex === index ? " sp-faq-item--open ot-accent-bar-left--active" : ""}`}
                itemScope
                itemProp="mainEntity"
                itemType="https://schema.org/Question"
              >
                <button
                  className="sp-faq-trigger ot-focus-brand"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={activeIndex === index}
                  type="button"
                >
                  <span className="sp-faq-trigger-left sp-faq-trigger-text" itemProp="name">{item.q}</span>
                  <span className="sp-faq-chevron" aria-hidden="true">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                      <path d="M3 6L8 11L13 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                <div
                  className={`sp-faq-answer ot-accordion-body${activeIndex === index ? " ot-accordion-body--open" : ""}`}
                  role="region"
                  itemScope
                  itemProp="acceptedAnswer"
                  itemType="https://schema.org/Answer"
                >
                  <div className="sp-faq-answer-inner" itemProp="text"><p>{item.a}</p></div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="divider" />

        <section className="sp-explore" aria-label="Explore more tools by Openroot Systems">
          <p className="sp-explore-title">Explore More Free Tools</p>
          <div className="sp-explore-links">
            {exploreLinks.map((link) => (
              <a key={link.href} href={link.href} className="sp-explore-link" rel="noopener">{link.label}</a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}