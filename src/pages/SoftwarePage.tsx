import { useParams } from "react-router-dom";
import { softwareList } from "../data/softwareList";
import { softwareContent } from "../data/softwareContent";
import { Helmet } from "react-helmet-async";
import { SoftwareContent } from "../types/software";

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

  return (
    <div style={{ padding: "60px", maxWidth: "900px", margin: "auto" }}>

      <Helmet>

        {/* 🔥 TITLE (CTR BOOST) */}
        <title>{`${tool.name} – Free Tool by Openroot Systems`}</title>

        {/* 🔥 META DESCRIPTION */}
        <meta
          name="description"
          content={tool.seoDescription || tool.description}
        />

        {/* 🔥 CANONICAL */}
        <link rel="canonical" href={url} />

        {/* 🔥 OPEN GRAPH */}
        <meta property="og:title" content={`${tool.name} | Openroot`} />
        <meta property="og:description" content={tool.description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={url} />
        <meta property="og:image" content="https://openroot.in/assets/company-icon.png" />

        {/* 🔥 TWITTER */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={tool.name} />
        <meta name="twitter:description" content={tool.description} />
        <meta name="twitter:image" content="https://openroot.in/assets/company-icon.png" />

        {/* 🔥 SOFTWARE SCHEMA */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            name: tool.name,
            description: tool.description,
            applicationCategory: "Utility",
            operatingSystem: "Web",
            url
          })}
        </script>

        {/* 🔥 FAQ SCHEMA */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: `What is ${tool.name}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: tool.description
                }
              },
              {
                "@type": "Question",
                name: `How to use ${tool.name}?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Click on launch tool button and start using instantly."
                }
              },
              {
                "@type": "Question",
                name: `Is ${tool.name} free?`,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "Yes, this tool is designed for easy access and usability."
                }
              }
            ]
          })}
        </script>

        {/* 🔥 BREADCRUMB SCHEMA */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              {
                "@type": "ListItem",
                position: 1,
                name: "Home",
                item: "https://openroot.in"
              },
              {
                "@type": "ListItem",
                position: 2,
                name: "Software",
                item: "https://openroot.in/software"
              },
              {
                "@type": "ListItem",
                position: 3,
                name: tool.name,
                item: url
              }
            ]
          })}
        </script>

      </Helmet>

      {/* HERO */}
      <header>
        <h1>{tool.name}</h1>
        <p>{tool.description}</p>

        <button style={{ marginTop: "20px" }}>
          🚀 Launch Tool
        </button>
      </header>

      {/* 🔥 OVERVIEW (MAIN SEO CONTENT) */}
      <section style={{ marginTop: "40px" }}>
        <h2>Overview</h2>
        {formatText(content.overview)}
      </section>

      {/* 🔥 FEATURES */}
      {content.features.length > 0 && (
        <section style={{ marginTop: "40px" }}>
          <h2>Key Features</h2>
          {content.features.map((f: string, i: number) => (
            <p key={i}>✔ {f}</p>
          ))}
        </section>
      )}

      {/* 🔥 PURPOSE */}
      {content.purpose && (
        <section style={{ marginTop: "40px" }}>
          <h2>Purpose</h2>
          {formatText(content.purpose)}
        </section>
      )}

      {/* 🔥 FAQ UI (VISIBLE = CTR BOOST) */}
      <section style={{ marginTop: "40px" }}>
        <h2>Frequently Asked Questions</h2>

        <p><strong>What is {tool.name}?</strong></p>
        <p>{tool.description}</p>

        <p><strong>How to use it?</strong></p>
        <p>Click the launch button and start using instantly.</p>

        <p><strong>Is it free?</strong></p>
        <p>Yes, it is accessible and easy to use.</p>
      </section>

      {/* 🔥 INTERNAL LINKING (CRITICAL FOR RANKING) */}
      <section style={{ marginTop: "40px" }}>
        <h3>Explore More Tools</h3>

        <a href="/software/openroot-classes">Openroot Classes</a><br />
        <a href="/software/nior-ai">NIOR AI</a><br />
        <a href="/software/travel-expense-manager">Travel Expense Manager</a><br />
        <a href="/certificate-verification">Certificate Verification</a>
        <a href="/software/helping-hand">Resource Hub & Job Updates</a><br />
        <a href="/software/openroot-makaut_grade_and_percentage-calculator">Makaut Grade Calculator</a><br />
        <a href="/software/coevas-media-downloader">Coevas Media Downloader</a><br />
      </section>

    </div>
  );
}