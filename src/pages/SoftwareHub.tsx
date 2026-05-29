import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState, useCallback } from "react";
import { softwareList } from "../data/softwareList";
import "../components/styles/software-hub.css";

const PAGE_URL = "https://openroot.in/software";

// ── JSON-LD Schemas ──────────────────────────────────────────────────────────
const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  "name": "Openroot Software Hub – Free Tools",
  "url": PAGE_URL,
  "description": "Free AI tools, productivity apps, and utilities built by Openroot Systems.",
  "numberOfItems": softwareList.length,
  "itemListElement": softwareList.map((tool, i) => ({
    "@type": "ListItem",
    "position": i + 1,
    "name": tool.name,
    "url": `https://openroot.in/software/${tool.slug}`,
    "description": tool.description,
  })),
};

const orgSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Openroot Systems",
  "url": "https://openroot.in",
  "logo": "https://openroot.in/assets/company-icon.png",
  "sameAs": [],
  "description":
    "Openroot Systems builds free AI tools, productivity software, and utilities for students and professionals in India.",
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home",         "item": "https://openroot.in" },
    { "@type": "ListItem", "position": 2, "name": "Software Hub", "item": PAGE_URL },
  ],
};

// ── Page ─────────────────────────────────────────────────────────────────────
export default function SoftwareHub() {
  const FEATURED_SLUGS = ["XpressJob", "nior-ai", "travel-expense-manager"] as const;
  const featuredTools  = softwareList.filter(t => FEATURED_SLUGS.includes(t.slug as any));

  return (
    <div className="sh-root">
      <Helmet>
        <title>Openroot Software Hub – Free AI Tools, Job Updates & Productivity Apps</title>
        <meta
          name="description"
          content="Explore free tools by Openroot Systems: NIOR AI, MAKAUT Grade Calculator, Travel Expense Manager, XpressJob, Coevas Terminal and more. No download required."
        />
        <meta
          name="keywords"
          content="Openroot software, free AI tools India, NIOR AI, MAKAUT grade calculator, travel expense manager, free productivity tools, Openroot Systems, free online tools for students"
        />
        <link rel="canonical" href={PAGE_URL} />
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />

        {/* Open Graph */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={PAGE_URL} />
        <meta property="og:site_name"   content="Openroot Systems" />
        <meta property="og:locale"      content="en_IN" />
        <meta property="og:title"       content="Openroot Software Hub – Free AI & Productivity Tools" />
        <meta property="og:description" content="Free tools by Openroot Systems: AI assistants, grade calculators, expense trackers and more. No download required." />
        <meta property="og:image"       content="https://openroot.in/assets/company-icon.png" />

        {/* Twitter Card */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="Openroot Software Hub – Free Tools" />
        <meta name="twitter:description" content="AI tools, productivity apps, and utilities built by Openroot Systems – all free." />
        <meta name="twitter:image"       content="https://openroot.in/assets/company-icon.png" />

        {/* Structured data */}
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* ── Breadcrumb ──────────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="sh-breadcrumb">
        <ol
          itemScope
          itemType="https://schema.org/BreadcrumbList"
          className="sh-breadcrumb-list"
        >
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a href="/" itemProp="item"><span itemProp="name">Home</span></a>
            <meta itemProp="position" content="1" />
          </li>
          <li className="sh-breadcrumb-sep" aria-hidden="true">›</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name">Software Hub</span>
            <meta itemProp="position" content="2" />
            <meta itemProp="item" content={PAGE_URL} />
          </li>
        </ol>
      </nav>

      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="sh-header">
        <h1 className="sh-title">Openroot Systems<br className="sh-title-break" /> Software Hub</h1>
        <p className="sh-subtitle">
          Free AI tools, productivity software, and utilities built by Openroot Systems —
          no download required.
        </p>
      </header>

      {/* ── Featured ────────────────────────────────────────────────────────── */}
      <section className="sh-section" aria-labelledby="sh-popular-heading">
        <SectionHeader id="sh-popular-heading" label="Highlighted" title="Popular Free Tools" />
        <div className="sh-grid sh-grid--featured" role="list">
          {featuredTools.map((tool, i) => (
            <SoftwareCard key={tool.slug} tool={tool} featured index={i} />
          ))}
        </div>
      </section>

      {/* ── All Tools ───────────────────────────────────────────────────────── */}
      <section className="sh-section" aria-labelledby="sh-all-heading">
        <SectionHeader id="sh-all-heading" label="Complete Catalog" title="All Free Software" />
        <ol className="sh-grid" style={{ listStyle: "none", padding: 0, margin: 0 }} role="list">
          {softwareList.map((tool, i) => (
            <li
              key={tool.slug}
              itemScope
              itemProp="itemListElement"
              itemType="https://schema.org/ListItem"
              style={{ display: "contents" }}
            >
              <meta itemProp="position" content={String(i + 1)} />
              <SoftwareCard tool={tool} index={i} />
            </li>
          ))}
        </ol>
      </section>

      {/* ── Services CTA ────────────────────────────────────────────────────── */}
      <section className="sh-section sh-section--cta" aria-labelledby="sh-services-heading">
        <SectionHeader id="sh-services-heading" label="Openroot Services" title="Important Services" />
        <Link
          to="/certificate-verification"
          className="sh-cta-btn ot-focus-brand ot-active-scale"
          aria-label="Verify certificates online – Openroot Systems"
        >
          Verify Certificates Online
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M7 17L17 7M7 7h10v10"/>
          </svg>
        </Link>
      </section>
    </div>
  );
}

// ── Section Header ────────────────────────────────────────────────────────────
interface SectionHeaderProps { id: string; label: string; title: string; }
function SectionHeader({ id, label, title }: SectionHeaderProps) {
  return (
    <div className="sh-section-head">
      <h2 id={id} className="sh-section-title">{title}</h2>
    </div>
  );
}

// ── Card ──────────────────────────────────────────────────────────────────────
interface CardProps {
  tool: { slug: string; name: string; description: string };
  featured?: boolean;
  index: number;
}

function SoftwareCard({ tool, featured = false, index }: CardProps) {
  const [active, setActive] = useState(false);

  const handleEnter = useCallback(() => setActive(true), []);
  const handleLeave = useCallback(() => setActive(false), []);

  return (
    <article
      className={[
        "sh-card",
        featured  ? "sh-card--featured"  : "",
        active    ? "sh-card--active"    : "",
      ].filter(Boolean).join(" ")}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{ "--sh-delay": `${Math.min(index, 11) * 40}ms` } as React.CSSProperties}
      itemScope
      itemType="https://schema.org/SoftwareApplication"
    >

      <Link
        to={`/software/${tool.slug}`}
        className="sh-card-link"
        aria-label={`${tool.name} – free tool by Openroot Systems`}
        itemProp="url"
      >
        <span className="sh-card-name" itemProp="name">{tool.name}</span>
        <svg
          className="sh-card-arrow"
          width="12" height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M7 17L17 7M7 7h10v10"/>
        </svg>
      </Link>

      <p className="sh-card-desc" itemProp="description">{tool.description}</p>
    </article>
  );
}