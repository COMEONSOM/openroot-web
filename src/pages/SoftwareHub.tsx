import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { softwareList } from "../data/softwareList";

export default function SoftwareHub() {

  const importantTools = [
    "helping-hand",
    "nior-ai",
    "travel-expense-manager"
  ];

  const cardStyle = {
    background: "linear-gradient(145deg, #000000, #000000)",
    border: "1px solid rgba(163, 232, 123, 0.15)",
    borderRadius: "16px",
    padding: "20px",
    transition: "all 0.3s ease",
    boxShadow: "0 0 0 rgba(163,232,123,0)",
  };

  const hoverStyle = {
    transform: "translateY(-6px)",
    boxShadow: "0 10px 30px rgba(163,232,123,0.15)",
  };

  return (

    <div style={{
      padding: "80px 20px",
      background: "#000000",
      color: "#f8fafc",
      minHeight: "100vh"
    }}>

      {/* ================= SEO ================= */}
      <Helmet>
        <title>
          Openroot Software Hub – AI Tools, Job Updates & Productivity Apps
        </title>

        <link rel="canonical" href="https://openroot.in/software" />

        <meta
          name="description"
          content="Explore Openroot Systems software including NIOR AI, Resource Hub, Travel Expense Manager and other productivity tools."
        />
      </Helmet>

      {/* ================= HEADER ================= */}

      <h1 style={{
        fontSize: "42px",
        fontWeight: "800",
        background: "linear-gradient(90deg, #a3e87b, #22c55e)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
        textAlign: "center"
      }}>
        Openroot Software Hub
      </h1>

      <p style={{
        maxWidth: "700px",
        margin: "20px auto",
        textAlign: "center",
        color: "#94a3b8"
      }}>
        Explore AI tools, productivity software and powerful utilities built by Openroot Systems.
      </p>

      {/* ================= FEATURED ================= */}

      <section style={{ marginTop: "60px" }}>

        <h2 style={{
          textAlign: "center",
          fontSize: "28px",
          marginBottom: "30px"
        }}>
          🔥 Popular Softwares
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "20px"
        }}>

          {softwareList
            .filter(tool => importantTools.includes(tool.slug))
            .map(tool => (

              <div
                key={tool.slug}
                style={cardStyle}
                onMouseEnter={e => Object.assign(e.currentTarget.style, hoverStyle)}
                onMouseLeave={e => Object.assign(e.currentTarget.style, cardStyle)}
              >

                <Link
                  to={`/software/${tool.slug}`}
                  style={{
                    fontSize: "20px",
                    fontWeight: "700",
                    color: "#a3e87b",
                    textDecoration: "none"
                  }}
                >
                  {tool.name}
                </Link>

                <p style={{ marginTop: "10px", color: "#94a3b8" }}>
                  {tool.description}
                </p>

              </div>

            ))}

        </div>

      </section>

      {/* ================= ALL TOOLS ================= */}

      <section style={{ marginTop: "80px" }}>

        <h2 style={{
          textAlign: "center",
          fontSize: "28px",
          marginBottom: "30px"
        }}>
          All Free Softwares
        </h2>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: "20px"
        }}>

          {softwareList.map((tool) => (

            <div
              key={tool.slug}
              style={cardStyle}
              onMouseEnter={e => Object.assign(e.currentTarget.style, hoverStyle)}
              onMouseLeave={e => Object.assign(e.currentTarget.style, cardStyle)}
            >

              <Link
                to={`/software/${tool.slug}`}
                style={{
                  fontSize: "18px",
                  fontWeight: "600",
                  color: "#a3e87b",
                  textDecoration: "none"
                }}
              >
                {tool.name}
              </Link>

              <p style={{
                marginTop: "8px",
                color: "#94a3b8",
                fontSize: "14px"
              }}>
                {tool.description}
              </p>

            </div>

          ))}

        </div>

      </section>

      {/* ================= SERVICES ================= */}

      <section style={{
        marginTop: "80px",
        textAlign: "center"
      }}>

        <h2 style={{ fontSize: "26px" }}>
          Important Services
        </h2>

        <Link
          to="/certificate-verification"
          style={{
            display: "inline-block",
            marginTop: "20px",
            padding: "12px 24px",
            borderRadius: "10px",
            background: "linear-gradient(90deg, #a3e87b, #22c55e)",
            color: "#000000",
            fontWeight: "700",
            textDecoration: "none",
            transition: "0.3s"
          }}
        >
          Verify Certificates Online
        </Link>

      </section>

    </div>
  );
}