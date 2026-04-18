import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { softwareList } from "../data/softwareList";
import "../components/styles/software-hub.css";

const PAGE_URL = "https://openroot.in/software";

export default function SoftwareHub() {
  const importantTools = ["resource-hub", "nior-ai", "travel-expense-manager"];
  const featuredTools  = softwareList.filter(t => importantTools.includes(t.slug));

  // ── JSON-LD: ItemList of all tools (enables sitelinks / rich list in SERP) ──
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

  // ── JSON-LD: Organization (boosts brand knowledge panel) ──
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Openroot Systems",
    "url": "https://openroot.in",
    "logo": "https://openroot.in/assets/company-icon.png",
    "sameAs": [],          // ← add social profile URLs here if available
    "description":
      "Openroot Systems builds free AI tools, productivity software, and utilities for students and professionals in India.",
  };

  // ── JSON-LD: BreadcrumbList ──
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      { "@type": "ListItem", "position": 1, "name": "Home",         "item": "https://openroot.in" },
      { "@type": "ListItem", "position": 2, "name": "Software Hub", "item": PAGE_URL },
    ],
  };

  return (
    <div className="sh-root">
      <Helmet>
        {/* ── Primary ── */}
        <title>Openroot Software Hub – Free AI Tools, Job Updates & Productivity Apps</title>
        <meta
          name="description"
          content="Explore free tools by Openroot Systems: NIOR AI, MAKAUT Grade Calculator, Travel Expense Manager, Resource Hub, Coevas Terminal and more. No download required."
        />
        <meta
          name="keywords"
          content="Openroot software, free AI tools India, NIOR AI, MAKAUT grade calculator, travel expense manager, free productivity tools, Openroot Systems, free online tools for students"
        />
        <link rel="canonical" href={PAGE_URL} />

        {/* ── Robots ── */}
        <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />

        {/* ── Open Graph ── */}
        <meta property="og:type"        content="website" />
        <meta property="og:url"         content={PAGE_URL} />
        <meta property="og:site_name"   content="Openroot Systems" />
        <meta property="og:locale"      content="en_IN" />
        <meta property="og:title"       content="Openroot Software Hub – Free AI & Productivity Tools" />
        <meta property="og:description" content="Free tools by Openroot Systems: AI assistants, grade calculators, expense trackers and more. No download required." />
        <meta property="og:image"       content="https://openroot.in/assets/company-icon.png" />

        {/* ── Twitter Card ── */}
        <meta name="twitter:card"        content="summary_large_image" />
        <meta name="twitter:title"       content="Openroot Software Hub – Free Tools" />
        <meta name="twitter:description" content="AI tools, productivity apps, and utilities built by Openroot Systems – all free." />
        <meta name="twitter:image"       content="https://openroot.in/assets/company-icon.png" />

        {/* ── Structured data ── */}
        <script type="application/ld+json">{JSON.stringify(itemListSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(orgSchema)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbSchema)}</script>
      </Helmet>

      {/* ── Visible breadcrumb (crawlable) ── */}
      <nav aria-label="Breadcrumb">
        <ol
          itemScope
          itemType="https://schema.org/BreadcrumbList"
          style={{ display: "flex", gap: "6px", listStyle: "none", padding: 0, margin: "0 0 1rem", fontSize: "0.8rem", opacity: 0.6 }}
        >
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <a href="/" itemProp="item"><span itemProp="name">Home</span></a>
            <meta itemProp="position" content="1" />
          </li>
          <li aria-hidden="true">›</li>
          <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem">
            <span itemProp="name">Software Hub</span>
            <meta itemProp="position" content="2" />
            <meta itemProp="item" content={PAGE_URL} />
          </li>
        </ol>
      </nav>

      <header className="sh-header">
        {/* h1 includes primary keyword phrase for the hub page */}
        <h1 className="sh-title">Openroot Software Hub</h1>
        <p className="sh-subtitle">
          Free AI tools, productivity software, and powerful utilities built by Openroot Systems —
          no download required.
        </p>
      </header>

      <section className="sh-section" aria-labelledby="sh-popular-heading">
        {/* h2 uses keyword-rich copy instead of generic "Popular Softwares" */}
        <h2 id="sh-popular-heading" className="sh-section-title">
          Popular Free Tools
        </h2>
        <div className="sh-grid sh-grid--featured">
          {featuredTools.map(tool => (
            <SoftwareCard key={tool.slug} tool={tool} featured />
          ))}
        </div>
      </section>

      <section className="sh-section" aria-labelledby="sh-all-heading">
        <h2 id="sh-all-heading" className="sh-section-title">
          All Free Software by Openroot Systems
        </h2>
        {/* ol + schema markup: every card is a list item Google can index as part of the ItemList */}
        <ol className="sh-grid" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {softwareList.map((tool, i) => (
            <li
              key={tool.slug}
              itemScope
              itemProp="itemListElement"
              itemType="https://schema.org/ListItem"
            >
              <meta itemProp="position" content={String(i + 1)} />
              <SoftwareCard tool={tool} />
            </li>
          ))}
        </ol>
      </section>

      <section className="sh-section sh-section--center" aria-labelledby="sh-services-heading">
        <h2 id="sh-services-heading" className="sh-section-title">
          Important Services
        </h2>
        <Link
          to="/certificate-verification"
          className="sh-cta-btn ot-focus-brand ot-active-scale"
          aria-label="Verify certificates online – Openroot Systems"
        >
          Verify Certificates Online
        </Link>
      </section>
    </div>
  );
}

interface CardProps {
  tool: { slug: string; name: string; description: string };
  featured?: boolean;
}

function SoftwareCard({ tool, featured }: CardProps) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className={`sh-card${featured ? " sh-card--featured" : ""}${hovered ? " sh-card--hovered" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Link
        to={`/software/${tool.slug}`}
        className={`sh-card-name${featured ? " sh-card-name--featured" : ""}`}
        // aria-label provides a richer link description than the name alone
        aria-label={`${tool.name} – free tool by Openroot Systems`}
        itemProp="url"
      >
        <span itemProp="name">{tool.name}</span>
      </Link>
      <p className="sh-card-desc" itemProp="description">{tool.description}</p>
    </div>
  );
}