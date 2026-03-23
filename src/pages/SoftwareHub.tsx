import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { softwareList } from "../data/softwareList";

export default function SoftwareHub() {

  const importantTools = [
    "helping-hand",
    "nior-ai",
    "travel-expense-manager"
  ];

  return (

    <div style={{ padding: "80px", textAlign: "center" }}>

      {/* =====================================================
         SEO META
      ===================================================== */}

      <Helmet>

        <title>
          Openroot Software Hub – AI Tools, Job Updates & Productivity Apps
        </title>

        <link
          rel="canonical"
          href="https://openroot.in/software"
        />

        <meta
          name="description"
          content="Explore Openroot Systems software including NIOR AI, Resource Hub, Travel Expense Manager and other productivity tools for students and professionals."
        />

        <meta property="og:title" content="Openroot Software Hub" />
        <meta property="og:description" content="AI tools, job updates and productivity software by Openroot Systems." />
        <meta property="og:url" content="https://openroot.in/software" />

        {/* 🔥 STRUCTURED DATA (UPGRADED) */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Openroot Software Tools",
            "itemListElement": softwareList.map((tool, index) => ({
              "@type": "ListItem",
              "position": index + 1,
              "name": tool.name,
              "url": `https://openroot.in/software/${tool.slug}`
            }))
          })}
        </script>

      </Helmet>

      {/* =====================================================
         PAGE HEADER
      ===================================================== */}

      <h1>Openroot Software Hub</h1>

      <p style={{ maxWidth: "700px", margin: "20px auto" }}>
        Explore AI tools, productivity software, financial utilities and student platforms built by Openroot Systems.
      </p>

      {/* =====================================================
         🔥 FEATURED TOOLS (VERY IMPORTANT FOR GOOGLE)
      ===================================================== */}

      <section style={{ marginTop: "60px" }}>

        <h2>🔥 Popular Tools</h2>

        <div style={{ marginTop: "20px" }}>

          {softwareList
            .filter(tool => importantTools.includes(tool.slug))
            .map(tool => (

              <div key={tool.slug} style={{ marginTop: "20px" }}>

                <Link
                  to={`/software/${tool.slug}`}
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    textDecoration: "none"
                  }}
                >
                  {tool.name}
                </Link>

                <p>{tool.description}</p>

              </div>

            ))}

        </div>

      </section>

      {/* =====================================================
         ALL SOFTWARE
      ===================================================== */}

      <section style={{ marginTop: "60px" }}>

        <h2>All Software Tools</h2>

        <div style={{ marginTop: "20px" }}>

          {softwareList.map((tool) => (

            <div key={tool.slug} style={{ marginTop: "20px" }}>

              <Link
                to={`/software/${tool.slug}`}
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  textDecoration: "none"
                }}
              >
                {tool.name}
              </Link>

              <p style={{ opacity: 0.8 }}>
                {tool.description}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* =====================================================
         🔥 EXTRA SEO BOOST (CERTIFICATE)
      ===================================================== */}

      <section style={{ marginTop: "60px" }}>

        <h2>Important Services</h2>

        <Link
          to="/certificate-verification"
          style={{
            fontSize: "18px",
            fontWeight: "700",
            textDecoration: "none"
          }}
        >
          Verify Certificates Online
        </Link>

      </section>

    </div>
  );
}