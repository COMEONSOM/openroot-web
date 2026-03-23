import { useParams } from "react-router-dom";
import { useState } from "react";
import { softwareList } from "../data/softwareList";
import { softwareContent } from "../data/softwareContent";
import { Helmet } from "react-helmet-async";
import { SoftwareContent } from "../types/software";
import "../components/styles/softwarePage.css";

export default function SoftwarePage() {

  const { slug } = useParams<{ slug: string }>();

  const tool = softwareList.find((t) => t.slug === slug);

  if (!tool) {
    return <div>Not found</div>;
  }

  const content: SoftwareContent = softwareContent[slug!] || {
    overview: tool.description,
    features: [],
    purpose: ""
  };

  const formatText = (text: string) => {
    return text.split("\n\n").map((p: string, i: number) => (
      <p key={i}>{p}</p>
    ));
  };

  const url = `https://openroot.in/software/${tool.slug}`;

  // 🔥 FIX: LAUNCH FUNCTION ADDED
  const launch = () => {
    try {

      const isLoggedIn =
        localStorage.getItem("isLoggedIn") === "true";

      if (!isLoggedIn) {
        alert("⚠️ Please log in first to access this tool.");
        return;
      }

      const userUID =
        sessionStorage.getItem("openrootUserUID") ||
        localStorage.getItem("openrootUserUID");

      const finalURL = new URL(tool.url);

      if (userUID && !finalURL.searchParams.has("uid")) {
        finalURL.searchParams.set("uid", encodeURIComponent(userUID));
      }

      window.location.href = finalURL.toString();

    } catch (error) {
      console.error("Tool launch failed:", error);
    }
  };

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };


  return (
    <div className="softwareContainer">

      <Helmet>
        <title>{`${tool.name} – Free Tool by Openroot Systems`}</title>

        <meta
          name="description"
          content={tool.seoDescription || tool.description}
        />

        <link rel="canonical" href={url} />

        <meta property="og:title" content={`${tool.name} | Openroot`} />
        <meta property="og:description" content={tool.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://openroot.in/assets/company-icon.png" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={tool.name} />
        <meta name="twitter:description" content={tool.description} />
        <meta name="twitter:image" content="https://openroot.in/assets/company-icon.png" />
      </Helmet>

      {/* HERO */}
      <header className="softwareHero">
        <h1>{tool.name}</h1>
        <p className="softwareDesc">{tool.description}</p>

        <button className="launchBtn" onClick={launch}>
          🚀 Launch Tool
        </button>

        <p className="launchNote">
          🔐 Login Required • ⚡ Secure Access
        </p>
      </header>

      {/* OVERVIEW */}
      <section className="softwareSection">
        <h2>Overview</h2>
        <div className="overviewText">
          {formatText(content.overview)}
        </div>
      </section>

      {/* FEATURES */}
      {content.features.length > 0 && (
        <section className="softwareSection">
          <h2>Key Features</h2>

          <div className="featuresGrid">
            {content.features.map((f: string, i: number) => (
              <div key={i} className="featureCard">
                <span className="featureIcon">✔</span>
                <p>{f}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* PURPOSE */}
      {content.purpose && (
        <section className="softwareSection">
          <h2>Purpose</h2>

          <div className="purposeBox">
            {formatText(content.purpose)}
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="softwareSection faqSection">
        <h2>Frequently Asked Questions</h2>

        {[
          {
            q: `What is ${tool.name}?`,
            a: tool.description
          },
          {
            q: "How to use it?",
            a: "Click the launch button and start using instantly."
          },
          {
            q: "Is it free?",
            a: "Yes, it is accessible and easy to use."
          }
        ].map((item, index) => (

          <div
            key={index}
            className={`faqItem ${activeIndex === index ? "active" : ""}`}
            onClick={() => toggleFAQ(index)}
          >
            <div className="faqQuestion">
              {item.q}
              <span className="faqIcon">
                {activeIndex === index ? "−" : "+"}
              </span>
            </div>

            <div className="faqAnswer">
              {item.a}
            </div>
          </div>

        ))}

      </section>

      {/* INTERNAL LINKS */}
      <section className="softwareSection" style={{ fontSize: "12px", opacity: 0.6 }}>
        <h3>Explore More Tools</h3>

        <a href="/software/openroot-classes">Openroot Classes</a><br />
        <a href="/software/nior-ai">NIOR AI</a><br />
        <a href="/software/travel-expense-manager">Travel Expense Manager</a><br />
        <a href="/certificate-verification">Certificate Verification</a><br />
        <a href="/software/helping-hand">Resource Hub & Job Updates</a><br />
        <a href="/software/openroot-makaut_grade_and_percentage-calculator">Makaut Grade Calculator</a><br />
        <a href="/software/coevas-media-downloader">Coevas Media Downloader</a><br />
      </section>

    </div>
  );
}