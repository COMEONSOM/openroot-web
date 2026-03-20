import { Link } from "react-router-dom";
import { Helmet } from "@dr.pogodin/react-helmet";
import { softwareList } from "../data/softwareList";

export default function SoftwareHub() {

  return (

    <div style={{ padding: "80px", textAlign: "center" }}>

      {/* =====================================================
         SEO META
      ===================================================== */}

      <Helmet>

        <title>
          Openroot Softwares | AI Tools & Productivity Apps
        </title>

        <link
          rel="canonical"
          href="https://openroot.in/software"
        />

        <meta
          name="description"
          content="Explore all software tools created by Openroot Systems including NIOR AI, Resource Hub, Travel Expense Manager and Openroot Classes."
        />

        <meta
          property="og:title"
          content="Openroot Softwares | Openroot Systems"
        />

        <meta
          property="og:description"
          content="Explore productivity tools and software applications built by Openroot Systems."
        />

        <meta
          property="og:url"
          content="https://openroot.in/software"
        />

        {/* =====================================================
           SOFTWARE LIST STRUCTURED DATA
        ===================================================== */}

        <script type="application/ld+json">
          {`
            {
            "@context": "https://schema.org",
            "@type": "ItemList",
            "name": "Openroot Software Tools",
            "itemListElement": [
            ${softwareList.map((tool, index) => `
              {
                "@type": "SoftwareApplication",
                "position": ${index + 1},
                "name": "${tool.name}",
                "url": "https://openroot.in/software/${tool.slug}",
                "description": "${tool.description}"
              }
            `).join(",")}
            ]
            }
            `}
        </script>

      </Helmet>

      {/* =====================================================
         PAGE CONTENT
      ===================================================== */}

      <h1>
        Openroot Softwares
      </h1>

      <p style={{ maxWidth: "600px", margin: "20px auto" }}>
        Explore productivity tools and software applications built by Openroot Systems.
      </p>

      <div style={{ marginTop: "40px" }}>

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

    </div>

  );

}