import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import "../components/styles/OpenrootSystems.css";

const SITE_URL = "https://openroot.in";

type Product = {
  name: string;
  desc: string;
  url: string;
  external: boolean;
  category: string;
};

const PRODUCTS: Product[] = [
  {
    name: "NIOR AI",
    desc: "AI-powered financial assistant for calculations, investment insights and smart decision support.",
    url: "https://openroot-time-ai-module.web.app/",
    external: true,
    category: "AI Chatbot",
  },
  {
    name: "Openroot Classes",
    desc: "Online learning platform for prompt engineering, finance literacy and career development.",
    url: "/softwares/openroot-classes",
    external: false,
    category: "Training Platform",
  },
  {
    name: "MAKAUT Grade Calculator",
    desc: "Free SGPA, CGPA, DGPA and YGPA to percentage calculator for MAKAUT students.",
    url: "/softwares/makaut-grade-pro",
    external: false,
    category: "Student Utility",
  },
  {
    name: "Travel Expense Manager",
    desc: "Split and track group travel expenses. Calculate balances automatically during trips.",
    url: "/softwares/travel-expense-manager",
    external: false,
    category: "Expense Management",
  },
  {
    name: "Coevas Terminal",
    desc: "Download videos and audio from YouTube, Instagram, Facebook and Threads.",
    url: "/softwares/coevas-terminal",
    external: false,
    category: "Media Utility",
  },
  {
    name: "Openroot GDrive Automation",
    desc: "Chrome extension for bulk Google Drive file renaming and productivity automation.",
    url: "/softwares/gdrive-web-extension",
    external: false,
    category: "Chrome Extension",
  },
  {
    name: "NewsLetter",
    desc: "Curated government job updates, PSU recruitments and career resources for India.",
    url: "/softwares/newsletter",
    external: false,
    category: "Job Portal",
  },
];

const SOCIAL_LINKS = [
  { label: "GitHub", url: "https://github.com/COMEONSOM" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/comeonsom/" },
  { label: "X", url: "https://x.com/comeonsomx" },
  { label: "Facebook", url: "https://www.facebook.com/OpenrootSystems" },
  { label: "YouTube", url: "https://www.youtube.com/@openrootsystems" },
];

const SERVICES = [
  "Custom Software Development (React, Node.js, Windows apps)",
  "Business Automation & Workflow Solutions",
  "Government Department Software",
  "MSME Digital Solutions",
  "Enterprise Web Applications",
  "Chrome Browser Extensions",
];

const SCHEMA = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  "@id": `${SITE_URL}/openroot-systems#aboutpage`,
  url: `${SITE_URL}/openroot-systems`,
  name: "Openroot Systems – Official Information",
  description:
    "Official information page for Openroot Systems, a Government of India registered MSME (UDYAM-WB-14-0263034) based in West Bengal.",
  about: {
    "@id": `${SITE_URL}/#organization`,
  },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      {
        "@type": "ListItem",
        position: 2,
        name: "Openroot Systems – Official Information",
        item: `${SITE_URL}/openroot-systems`,
      },
    ],
  },
};

const heroChips = [
  "MSME Registered",
  "UDYAM-WB-14-0263034",
  "Official Domain: openroot.in",
  "West Bengal, India",
];

const heroFacts: Array<[string, string]> = [
  ["MSME Registered", "Yes"],
  ["Official Domain", "openroot.in"],
  ["Founder", "Somnath Banerjee"],
  ["Region", "West Bengal, India"],
];

const registrationRows = [
  ["Company Name", "Openroot Systems"],
  ["UDYAM Registration Number", "UDYAM-WB-14-0263034"],
  ["Registration Type", "MSME – Micro, Small and Medium Enterprise"],
  ["Registered Under", "Government of India"],
  ["State", "West Bengal, India"],
  ["Founder", "Somnath Banerjee"],
  ["Official Website", "https://openroot.in"],
  ["Contact Email", "connect.openroot@gmail.com"],
] as const;

const EXPLORE_LINKS = [
  { to: "/", label: "Homepage" },
  { to: "/softwares", label: "All Products" },
  { to: "/software-solutions", label: "Software Services" },
  { to: "/founder", label: "Founder" },
];

function ProductCell({ product }: { product: Product }) {
  const body = (
    <>
      <span className="os-product-head">
        <h3 className="os-product-name">{product.name}</h3>
        <span className="os-arrow" aria-hidden="true">
          {product.external ? "↗" : "→"}
        </span>
      </span>
      <span className="os-tag">{product.category}</span>
      <p className="os-product-desc">{product.desc}</p>
    </>
  );

  return (
    <article className="os-product">
      {product.external ? (
        <a
          href={product.url}
          target="_blank"
          rel="noopener noreferrer"
          className="os-cell"
          aria-label={`${product.name} opens in a new tab`}
        >
          {body}
        </a>
      ) : (
        <Link to={product.url} className="os-cell">
          {body}
        </Link>
      )}
    </article>
  );
}

export default function OpenrootSystems() {
  return (
    <>
      <Helmet>
        <title>Openroot Systems – Official Company Information | MSME Registered India</title>
        <meta
          name="description"
          content="Official information about Openroot Systems – a Government of India registered MSME (UDYAM-WB-14-0263034) based in West Bengal. Founded by Somnath Banerjee. Official website: openroot.in"
        />
        <link rel="canonical" href={`${SITE_URL}/openroot-systems`} />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Openroot Systems – Official Company Information"
        />
        <meta
          property="og:description"
          content="Government of India registered MSME. Custom software, AI tools, prompt engineering & finance education. Official website: openroot.in"
        />
        <meta property="og:url" content={`${SITE_URL}/openroot-systems`} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="Openroot Systems" />
        <meta property="og:locale" content="en_IN" />
        <script type="application/ld+json">{JSON.stringify(SCHEMA)}</script>
      </Helmet>

      <main className="os-page">
        <div className="os-shell">
          {/* HERO + SNAPSHOT */}
          <div className="os-top">
            <section className="os-card os-card--top" aria-labelledby="os-title">
              <h1 id="os-title" className="os-h1">
                Openroot Systems
              </h1>

              <p className="os-lead">
                A registered MSME under the Government of India, based in West
                Bengal. We build custom software, AI tools, productivity
                systems, browser extensions, and practical learning platforms
                for students, professionals, and small businesses.
              </p>

              <ul className="os-chips">
                {heroChips.map((chip) => (
                  <li key={chip} className="os-chip">
                    {chip}
                  </li>
                ))}
              </ul>

              <div className="os-facts">
                {heroFacts.map(([label, value]) => (
                  <div key={label} className="os-fact">
                    <span className="os-label">{label}</span>
                    <span className="os-value">{value}</span>
                  </div>
                ))}
              </div>
            </section>

            <aside className="os-card os-card--top" aria-label="Company snapshot">
              <span className="os-label">Company Snapshot</span>
              <p className="os-snapshot-name">Openroot Systems</p>

              <dl className="os-rows">
                <div className="os-row">
                  <dt>Founder</dt>
                  <dd>
                    <Link to="/founder" className="os-link">
                      Somnath Banerjee
                    </Link>
                  </dd>
                </div>
                <div className="os-row">
                  <dt>Website</dt>
                  <dd>
                    <a href="https://openroot.in" className="os-link">
                      openroot.in
                    </a>
                  </dd>
                </div>
                <div className="os-row">
                  <dt>Email</dt>
                  <dd>connect.openroot@gmail.com</dd>
                </div>
                <div className="os-row">
                  <dt>Registry</dt>
                  <dd>UDYAM-WB-14-0263034</dd>
                </div>
              </dl>

              <p className="os-note">
                Openroot Systems is the official brand. Any unrelated site
                using similar names is not affiliated with this entity.
              </p>
            </aside>
          </div>

          {/* REGISTRATION */}
          <section className="os-card" aria-labelledby="registration-heading">
            <h2 id="registration-heading" className="os-h2">
              Official Registration Details
            </h2>

            <p className="os-text">
              These details anchor the Openroot Systems entity for users,
              search engines, and AI systems.
            </p>

            <table className="os-table">
              <tbody>
                {registrationRows.map(([label, value]) => (
                  <tr key={label}>
                    <td>{label}</td>
                    <td>
                      {label === "Official Website" ? (
                        <a
                          href="https://openroot.in"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="os-link"
                        >
                          https://openroot.in
                        </a>
                      ) : label === "Founder" ? (
                        <Link to="/founder" className="os-link">
                          {value}
                        </Link>
                      ) : (
                        value
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          {/* ABOUT */}
          <section className="os-card" aria-labelledby="about-heading">
            <h2 id="about-heading" className="os-h2">
              About Openroot Systems
            </h2>

            <div className="os-prose">
              <p>
                Openroot Systems was founded by Somnath Banerjee with the
                mission to make technology, AI, finance education, and digital
                innovation accessible to everyone — especially students,
                professionals, entrepreneurs, and small businesses across
                India.
              </p>
              <p>
                The company sits at the intersection of custom software
                development, artificial intelligence, and education technology.
                From business automation to free student tools, the goal is to
                deliver practical digital value without unnecessary complexity.
              </p>
              <p>
                Everything is delivered through the official website{" "}
                <a href="https://openroot.in" className="os-link">
                  openroot.in
                </a>
                .
              </p>
            </div>
          </section>

          {/* PRODUCTS */}
          <section className="os-card" aria-labelledby="products-heading">
            <h2 id="products-heading" className="os-h2">
              Official Products &amp; Tools
            </h2>

            <p className="os-text">
              A curated set of software products, learning platforms, and free
              utilities published by Openroot Systems.
            </p>

            <div className="os-cells os-cells--products">
              {PRODUCTS.map((product) => (
                <ProductCell key={product.name} product={product} />
              ))}
            </div>

            <p className="os-more">
              All products are organized under the official software hub:{" "}
              <Link to="/softwares" className="os-link">
                openroot.in/softwares
              </Link>
            </p>
          </section>

          {/* SERVICES */}
          <section className="os-card" aria-labelledby="services-heading">
            <h2 id="services-heading" className="os-h2">
              Software Development Services
            </h2>

            <p className="os-text">
              For businesses and organizations, Openroot Systems offers
              practical software services designed for real-world use.
            </p>

            <div className="os-services">
              {SERVICES.map((service) => (
                <div key={service} className="os-service">
                  <span className="os-service-mark" aria-hidden="true" />
                  <span>{service}</span>
                </div>
              ))}
            </div>

            <p className="os-more">
              <Link to="/software-solutions" className="os-link">
                View Software Solutions →
              </Link>
            </p>
          </section>

          {/* NOTICE */}
          <section className="os-card os-notice" aria-labelledby="notice-heading">
            <h2 id="notice-heading" className="os-h2">
              Official Domain Notice
            </h2>

            <div className="os-prose">
              <p>
                The only official website of Openroot Systems is{" "}
                <a href="https://openroot.in" className="os-link">
                  https://openroot.in
                </a>
                . Any website, domain, mobile application, social media
                account, or business entity using similar names — such as Open
                Root Systems, OpenRoot, Open Root, OpenRoute, Open Rout, or
                OPNROOT — that is not operating from openroot.in is not
                affiliated with Openroot Systems in any way.
              </p>
              <p>
                Verify the URL before sharing information. Our UDYAM
                Registration Number <strong>UDYAM-WB-14-0263034</strong>{" "}
                confirms our legal identity as a registered Government of India
                MSME.
              </p>
            </div>
          </section>

          {/* SOCIAL */}
          <section className="os-card" aria-labelledby="social-heading">
            <h2 id="social-heading" className="os-h2">
              Official Social Presence
            </h2>

            <p className="os-text">
              These are the official external profiles associated with the
              Openroot Systems brand.
            </p>

            <div className="os-cells os-cells--social">
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="os-cell os-cell--row"
                >
                  <span>{item.label}</span>
                  <span className="os-arrow" aria-hidden="true">
                    ↗
                  </span>
                </a>
              ))}
            </div>
          </section>

          {/* EXPLORE */}
          <footer className="os-card">
            <p className="os-strong">Explore Openroot Systems</p>

            <nav className="os-nav" aria-label="Explore Openroot Systems">
              {EXPLORE_LINKS.map((link) => (
                <Link key={link.to} to={link.to} className="os-btn">
                  {link.label}
                </Link>
              ))}
            </nav>
          </footer>
        </div>
      </main>
    </>
  );
}