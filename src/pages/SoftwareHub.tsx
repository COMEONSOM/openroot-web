import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { softwareList } from "../data/softwareList";
import "../components/styles/software-hub.css";

export default function SoftwareHub() {
  const importantTools = [
    "helping-hand",
    "nior-ai",
    "travel-expense-manager",
  ];

  return (
    <div className="sh-root">

      {/* ── SEO ───────────────────────────────────── */}
      <Helmet>
        <title>Openroot Software Hub – AI Tools, Job Updates & Productivity Apps</title>
        <link rel="canonical" href="https://openroot.in/software" />
        <meta
          name="description"
          content="Explore Openroot Systems software including NIOR AI, Resource Hub, Travel Expense Manager and other productivity tools."
        />
      </Helmet>

      {/* ── HEADER ────────────────────────────────── */}
      <div className="sh-header">
        <h1 className="sh-title">Openroot Software Hub</h1>
        <p className="sh-subtitle">
          Explore AI tools, productivity software and powerful utilities built
          by Openroot Systems.
        </p>
      </div>

      {/* ── FEATURED ──────────────────────────────── */}
      <section className="sh-section">
        <h2 className="sh-section-title">Popular Softwares</h2>
        <div className="sh-grid sh-grid--featured">
          {softwareList
            .filter(tool => importantTools.includes(tool.slug))
            .map(tool => (
              <SoftwareCard key={tool.slug} tool={tool} featured />
            ))}
        </div>
      </section>

      {/* ── ALL TOOLS ─────────────────────────────── */}
      <section className="sh-section">
        <h2 className="sh-section-title">All Free Softwares</h2>
        <div className="sh-grid">
          {softwareList.map(tool => (
            <SoftwareCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* ── SERVICES ──────────────────────────────── */}
      <section className="sh-section sh-section--center">
        <h2 className="sh-section-title">Important Services</h2>
        <Link
          to="/certificate-verification"
          className="sh-cta-btn ot-focus-brand ot-active-scale"
        >
          Verify Certificates Online
        </Link>
      </section>

    </div>
  );
}

/* ── Card sub-component ────────────────────────────────── */
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
      >
        {tool.name}
      </Link>
      <p className="sh-card-desc">{tool.description}</p>
    </div>
  );
}
