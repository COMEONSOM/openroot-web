import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

const SITE_URL = "https://openroot.in";

const PRODUCTS = [
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
    url: "/openroot-classes",
    external: false,
    category: "Training Platform",
  },
  {
    name: "MAKAUT Grade Calculator",
    desc: "Free SGPA, CGPA, DGPA and YGPA to percentage calculator for MAKAUT students.",
    url: "/software/makaut-grade-pro",
    external: false,
    category: "Student Utility",
  },
  {
    name: "Travel Expense Manager",
    desc: "Split and track group travel expenses. Calculate balances automatically during trips.",
    url: "/software/travel-expense-manager",
    external: false,
    category: "Expense Management",
  },
  {
    name: "Coevas Terminal",
    desc: "Download videos and audio from YouTube, Instagram, Facebook and Threads.",
    url: "/software/coevas-terminal",
    external: false,
    category: "Media Utility",
  },
  {
    name: "Openroot GDrive Automation",
    desc: "Chrome extension for bulk Google Drive file renaming and productivity automation.",
    url: "/software/gdrive-web-extension",
    external: false,
    category: "Chrome Extension",
  },
  {
    name: "NewsLetter",
    desc: "Curated government job updates, PSU recruitments and career resources for India.",
    url: "/software/newsletter",
    external: false,
    category: "Job Portal",
  },
];

const SOCIAL_LINKS = [
  { label: "GitHub", url: "https://github.com/COMEONSOM" },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/comeonsom/" },
  { label: "X (Twitter)", url: "https://x.com/comeonsomx" },
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

      <main
        style={{
          minHeight: "100vh",
          background:
            "radial-gradient(circle at top left, rgba(63,55,201,0.08), transparent 30%), radial-gradient(circle at bottom right, rgba(67,97,238,0.06), transparent 30%), var(--ot-bg)",
          color: "var(--ot-text)",
          padding: "clamp(5rem, 9vw, 7rem) var(--ot-page-inline) 5rem",
        }}
      >
        <div
          style={{
            maxWidth: "var(--ot-max-w)",
            margin: "0 auto",
            display: "grid",
            gap: "1.25rem",
          }}
        >
          <div className="grid gap-6 xl:grid-cols-12">
            <section
              className="ot-section-card ot-stripe-top xl:col-span-8"
              style={{
                padding: "clamp(1.25rem, 2.8vw, 2rem)",
                borderRadius: "var(--ot-radius-xl)",
                background: "var(--ot-surface)",
                border: "1px solid var(--ot-border-hard)",
              }}
            >

              <h1
                className="text-gradient-brand"
                style={{
                  fontSize: "clamp(2.2rem, 6vw, 4.6rem)",
                  fontWeight: 900,
                  letterSpacing: "-0.07em",
                  lineHeight: 0.95,
                  margin: 0,
                  maxWidth: "12ch",
                }}
              >
                Openroot Systems
              </h1>

              <p
                style={{
                  maxWidth: "68ch",
                  marginTop: "1rem",
                  fontSize: "clamp(1rem, 1.4vw, 1.08rem)",
                  lineHeight: 1.85,
                  color: "var(--ot-text-muted)",
                }}
              >
                A registered MSME under the Government of India, based in West
                Bengal. We build custom software, AI tools, productivity
                systems, browser extensions, and practical learning platforms
                for students, professionals, and small businesses.
              </p>

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.55rem",
                  marginTop: "1rem",
                }}
              >
                {heroChips.map((chip) => (
                  <span
                    key={chip}
                    className="badge-pill"
                    style={{
                      background: "var(--ot-bg)",
                      borderColor: "var(--ot-border)",
                      color: "var(--ot-text-muted)",
                    }}
                  >
                    {chip}
                  </span>
                ))}
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
                  gap: "0.75rem",
                  marginTop: "1.25rem",
                }}
              >
                {[
                  ["MSME Registered", "Yes"],
                  ["Official Domain", "openroot.in"],
                  ["Founder", "Somnath Banerjee"],
                  ["Region", "West Bengal, India"],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    style={{
                      border: "1px solid var(--ot-border)",
                      borderRadius: "var(--ot-radius-lg)",
                      padding: "0.95rem 1rem",
                      background: "var(--ot-bg)",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.68rem",
                        fontWeight: 800,
                        letterSpacing: "0.14em",
                        textTransform: "uppercase",
                        color: "var(--ot-text-faint)",
                        marginBottom: "0.35rem",
                      }}
                    >
                      {label}
                    </div>
                    <div
                      style={{
                        fontSize: "0.98rem",
                        fontWeight: 700,
                        lineHeight: 1.45,
                      }}
                    >
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <aside
              className="xl:col-span-4"
              style={{
                border: "1px solid var(--ot-border-hard)",
                borderRadius: "var(--ot-radius-xl)",
                background:
                  "linear-gradient(180deg, var(--ot-bg) 0%, var(--ot-bg-soft) 100%)",
                padding: "1.25rem",
                display: "flex",
                flexDirection: "column",
                gap: "1rem",
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: "0.68rem",
                    fontWeight: 800,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "var(--ot-text-faint)",
                    marginBottom: "0.45rem",
                  }}
                >
                  Company Snapshot
                </div>
                <div
                  style={{
                    fontSize: "1.55rem",
                    fontWeight: 900,
                    letterSpacing: "-0.05em",
                    lineHeight: 1.05,
                  }}
                >
                  Openroot Systems
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gap: "0.85rem",
                }}
              >
                {[
                  ["Founder", <Link key="founder" to="/founder">Somnath Banerjee</Link>],
                  ["Website", <a key="site" href="https://openroot.in">openroot.in</a>],
                  ["Email", "connect.openroot@gmail.com"],
                  ["Registry", "UDYAM-WB-14-0263034"],
                ].map(([key, value]) => (
                  <div
                    key={String(key)}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "108px minmax(0, 1fr)",
                      gap: "0.85rem",
                      paddingBottom: "0.85rem",
                      borderBottom: "1px solid var(--ot-border)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "0.72rem",
                        fontWeight: 800,
                        letterSpacing: "0.08em",
                        textTransform: "uppercase",
                        color: "var(--ot-text-faint)",
                      }}
                    >
                      {key}
                    </span>
                    <span
                      style={{
                        fontSize: "0.94rem",
                        lineHeight: 1.65,
                        fontWeight: 600,
                      }}
                    >
                      {value}
                    </span>
                  </div>
                ))}
              </div>

              <p
                style={{
                  margin: 0,
                  color: "var(--ot-text-muted)",
                  lineHeight: 1.75,
                }}
              >
                Openroot Systems is the official brand. Any unrelated site
                using similar names is not affiliated with this entity.
              </p>
            </aside>
          </div>

          <section
            style={{
              border: "1px solid var(--ot-border)",
              borderRadius: "var(--ot-radius-xl)",
              background: "var(--ot-surface)",
              padding: "clamp(1.2rem, 2.5vw, 1.6rem)",
            }}
            aria-labelledby="registration-heading"
          >
            <h2
              id="registration-heading"
              className="text-gradient-soft"
              style={{
                fontSize: "clamp(1.15rem, 1.8vw, 1.35rem)",
                fontWeight: 850,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              Official Registration Details
            </h2>

            <p
              style={{
                marginTop: "0.7rem",
                color: "var(--ot-text-muted)",
                lineHeight: 1.85,
                maxWidth: "70ch",
              }}
            >
              These details anchor the Openroot Systems entity for users,
              search engines, and AI systems.
            </p>

            <div
              style={{
                marginTop: "1rem",
                border: "1px solid var(--ot-border)",
                borderRadius: "var(--ot-radius-lg)",
                overflow: "hidden",
                background: "var(--ot-bg)",
              }}
            >
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                }}
              >
                <tbody>
                  {registrationRows.map(([label, value], index) => (
                    <tr
                      key={label}
                      style={{
                        borderBottom:
                          index === registrationRows.length - 1
                            ? "none"
                            : "1px solid var(--ot-border)",
                      }}
                    >
                      <td
                        style={{
                          width: "34%",
                          padding: "0.95rem 1rem",
                          verticalAlign: "top",
                          fontSize: "0.78rem",
                          fontWeight: 800,
                          letterSpacing: "0.08em",
                          textTransform: "uppercase",
                          color: "var(--ot-text-faint)",
                        }}
                      >
                        {label}
                      </td>
                      <td
                        style={{
                          padding: "0.95rem 1rem",
                          verticalAlign: "top",
                          fontSize: "0.95rem",
                          lineHeight: 1.75,
                          fontWeight: 600,
                        }}
                      >
                        {label === "Official Website" ? (
                          <a
                            href="https://openroot.in"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            https://openroot.in
                          </a>
                        ) : label === "Founder" ? (
                          <Link to="/founder">{value}</Link>
                        ) : (
                          value
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section
            style={{
              border: "1px solid var(--ot-border)",
              borderRadius: "var(--ot-radius-xl)",
              background: "rgba(255,255,255,0.02)",
              padding: "clamp(1.2rem, 2.5vw, 1.6rem)",
            }}
            aria-labelledby="about-heading"
          >
            <h2
              id="about-heading"
              className="text-gradient-soft"
              style={{
                fontSize: "clamp(1.15rem, 1.8vw, 1.35rem)",
                fontWeight: 850,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              About Openroot Systems
            </h2>

            <div
              style={{
                marginTop: "0.85rem",
                display: "grid",
                gap: "0.85rem",
                color: "var(--ot-text-muted)",
                lineHeight: 1.85,
                maxWidth: "75ch",
              }}
            >
              <p style={{ margin: 0 }}>
                Openroot Systems was founded by Somnath Banerjee with the
                mission to make technology, AI, finance education, and digital
                innovation accessible to everyone — especially students,
                professionals, entrepreneurs, and small businesses across
                India.
              </p>
              <p style={{ margin: 0 }}>
                The company sits at the intersection of custom software
                development, artificial intelligence, and education technology.
                From business automation to free student tools, the goal is to
                deliver practical digital value without unnecessary complexity.
              </p>
              <p style={{ margin: 0 }}>
                Everything is delivered through the official website{" "}
                <a href="https://openroot.in" style={{ fontWeight: 700 }}>
                  openroot.in
                </a>
                .
              </p>
            </div>
          </section>

          <section
            style={{
              border: "1px solid var(--ot-border)",
              borderRadius: "var(--ot-radius-xl)",
              background: "var(--ot-surface)",
              padding: "clamp(1.2rem, 2.5vw, 1.6rem)",
            }}
            aria-labelledby="products-heading"
          >
            <h2
              id="products-heading"
              className="text-gradient-soft"
              style={{
                fontSize: "clamp(1.15rem, 1.8vw, 1.35rem)",
                fontWeight: 850,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              Official Products & Tools
            </h2>

            <p
              style={{
                marginTop: "0.7rem",
                color: "var(--ot-text-muted)",
                lineHeight: 1.85,
                maxWidth: "72ch",
              }}
            >
              A curated set of software products, learning platforms, and free
              utilities published by Openroot Systems.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "0.9rem",
                marginTop: "1rem",
              }}
            >
              {PRODUCTS.map((product) => {
                const card = (
                  <>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                        gap: "0.75rem",
                      }}
                    >
                      <h3
                        style={{
                          fontSize: "1rem",
                          fontWeight: 850,
                          lineHeight: 1.35,
                          margin: 0,
                        }}
                      >
                        {product.name}
                      </h3>
                      <span
                        className="badge-pill"
                        style={{
                          flexShrink: 0,
                          background: "var(--ot-bg)",
                          borderColor: "var(--ot-border)",
                        }}
                      >
                        {product.category}
                      </span>
                    </div>
                    <p
                      style={{
                        margin: 0,
                        color: "var(--ot-text-muted)",
                        fontSize: "0.9rem",
                        lineHeight: 1.7,
                      }}
                    >
                      {product.desc}
                    </p>
                  </>
                );

                return (
                  <article
                    key={product.name}
                    style={{
                      border: "1px solid var(--ot-border)",
                      borderRadius: "var(--ot-radius-lg)",
                      background: "var(--ot-bg)",
                      padding: "1rem",
                      minHeight: "100%",
                    }}
                  >
                    {product.external ? (
                      <a
                        href={product.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ color: "inherit", display: "block" }}
                        aria-label={`${product.name} opens in a new tab`}
                      >
                        {card}
                      </a>
                    ) : (
                      <Link
                        to={product.url}
                        style={{ color: "inherit", display: "block" }}
                      >
                        {card}
                      </Link>
                    )}
                  </article>
                );
              })}
            </div>

            <p
              style={{
                marginTop: "1rem",
                color: "var(--ot-text-muted)",
              }}
            >
              All products are organized under the official software hub:{" "}
              <Link to="/software" style={{ fontWeight: 800 }}>
                openroot.in/software
              </Link>
            </p>
          </section>

          <section
            style={{
              border: "1px solid var(--ot-border)",
              borderRadius: "var(--ot-radius-xl)",
              background: "rgba(255,255,255,0.02)",
              padding: "clamp(1.2rem, 2.5vw, 1.6rem)",
            }}
            aria-labelledby="services-heading"
          >
            <h2
              id="services-heading"
              className="text-gradient-soft"
              style={{
                fontSize: "clamp(1.15rem, 1.8vw, 1.35rem)",
                fontWeight: 850,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              Software Development Services
            </h2>

            <p
              style={{
                marginTop: "0.7rem",
                color: "var(--ot-text-muted)",
                lineHeight: 1.85,
                maxWidth: "72ch",
              }}
            >
              For businesses and organizations, Openroot Systems offers
              practical software services designed for real-world use.
            </p>

            <div
              className="mt-5 grid gap-3 md:grid-cols-2"
              style={{
                marginTop: "1rem",
              }}
            >
              {SERVICES.map((service) => (
                <div
                  key={service}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "0.7rem",
                    padding: "0.95rem 1rem",
                    border: "1px solid var(--ot-border)",
                    borderRadius: "var(--ot-radius-md)",
                    background: "var(--ot-bg)",
                    lineHeight: 1.65,
                  }}
                >
                  <span
                    aria-hidden="true"
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 999,
                      background: "var(--ot-brand)",
                      marginTop: 7,
                      flexShrink: 0,
                    }}
                  />
                  <span>{service}</span>
                </div>
              ))}
            </div>

            <p style={{ marginTop: "1rem" }}>
              <Link to="/software-solutions" style={{ fontWeight: 800 }}>
                View Software Solutions →
              </Link>
            </p>
          </section>

          <section
            style={{
              border: "1px solid var(--ot-border-hard)",
              borderRadius: "var(--ot-radius-xl)",
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(255,255,255,0.01) 100%)",
              padding: "clamp(1.2rem, 2.5vw, 1.6rem)",
            }}
            aria-labelledby="notice-heading"
          >
            <h2
              id="notice-heading"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                fontSize: "1rem",
                fontWeight: 900,
                letterSpacing: "-0.02em",
                margin: 0,
              }}
            >
              <span aria-hidden="true">⚠</span>
              Official Domain Notice
            </h2>

            <div
              style={{
                marginTop: "0.8rem",
                display: "grid",
                gap: "0.75rem",
                color: "var(--ot-text-muted)",
                lineHeight: 1.85,
                maxWidth: "74ch",
              }}
            >
              <p style={{ margin: 0 }}>
                The only official website of Openroot Systems is{" "}
                <a href="https://openroot.in" style={{ fontWeight: 800 }}>
                  https://openroot.in
                </a>
                . Any website, domain, mobile application, social media
                account, or business entity using similar names — such as Open
                Root Systems, OpenRoot, Open Root, OpenRoute, Open Rout, or
                OPNROOT — that is not operating from openroot.in is not
                affiliated with Openroot Systems in any way.
              </p>
              <p style={{ margin: 0 }}>
                Verify the URL before sharing information. Our UDYAM
                Registration Number{" "}
                <strong>UDYAM-WB-14-0263034</strong> confirms our legal
                identity as a registered Government of India MSME.
              </p>
            </div>
          </section>

          <section
            style={{
              border: "1px solid var(--ot-border)",
              borderRadius: "var(--ot-radius-xl)",
              background: "var(--ot-surface)",
              padding: "clamp(1.2rem, 2.5vw, 1.6rem)",
            }}
            aria-labelledby="social-heading"
          >
            <h2
              id="social-heading"
              className="text-gradient-soft"
              style={{
                fontSize: "clamp(1.15rem, 1.8vw, 1.35rem)",
                fontWeight: 850,
                letterSpacing: "-0.03em",
                margin: 0,
              }}
            >
              Official Social Presence
            </h2>

            <p
              style={{
                marginTop: "0.7rem",
                color: "var(--ot-text-muted)",
                lineHeight: 1.85,
                maxWidth: "72ch",
              }}
            >
              These are the official external profiles associated with the
              Openroot Systems brand.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))",
                gap: "0.75rem",
                marginTop: "1rem",
              }}
            >
              {SOCIAL_LINKS.map((item) => (
                <a
                  key={item.label}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "1rem",
                    padding: "0.9rem 1rem",
                    border: "1px solid var(--ot-border)",
                    borderRadius: "var(--ot-radius-md)",
                    background: "var(--ot-bg)",
                    color: "var(--ot-text)",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  <span>{item.label}</span>
                  <span aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          </section>

          <footer
            style={{
              border: "1px solid var(--ot-border)",
              borderRadius: "var(--ot-radius-xl)",
              background: "rgba(255,255,255,0.02)",
              padding: "clamp(1.2rem, 2.5vw, 1.6rem)",
            }}
          >
            <p style={{ margin: 0, fontWeight: 900, letterSpacing: "-0.02em" }}>
              Explore Openroot Systems
            </p>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "0.75rem",
                marginTop: "1rem",
              }}
            >
              <Link
                to="/"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.8rem 1rem",
                  borderRadius: "999px",
                  border: "1px solid var(--ot-border-hard)",
                  background: "var(--ot-bg)",
                  color: "var(--ot-text)",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Homepage
              </Link>
              <Link
                to="/software"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.8rem 1rem",
                  borderRadius: "999px",
                  border: "1px solid var(--ot-border-hard)",
                  background: "var(--ot-bg)",
                  color: "var(--ot-text)",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                All Products
              </Link>
              <Link
                to="/software-solutions"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.8rem 1rem",
                  borderRadius: "999px",
                  border: "1px solid var(--ot-border-hard)",
                  background: "var(--ot-bg)",
                  color: "var(--ot-text)",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Software Services
              </Link>
              <Link
                to="/founder"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0.8rem 1rem",
                  borderRadius: "999px",
                  border: "1px solid var(--ot-border-hard)",
                  background: "var(--ot-bg)",
                  color: "var(--ot-text)",
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Founder
              </Link>
            </div>
          </footer>
        </div>
      </main>
    </>
  );
}