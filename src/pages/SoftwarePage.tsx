import { useParams } from "react-router-dom";
import { softwareList } from "../data/softwareList";
import { Helmet } from "@dr.pogodin/react-helmet";
import "../components/styles/softwarePage.css";

export default function SoftwarePage() {

  const { slug } = useParams();

  const tool = softwareList.find((t) => t.slug === slug);

  if (!tool) {
    return (
      <div className="softwareNotFound">
        <h2>Software not found</h2>
      </div>
    );
  }

  // ======================================================
  // LOGIN + UID PROTECTED TOOL LAUNCH
  // ======================================================

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

  // ======================================================
  // OPTIMIZED SOFTWARE CONTENT
  // ======================================================

  const softwareContent: Record<string, any> = {

    "helping-hand": {
      overview: `Openroot Helping Hand — Resource Hub & Job Updates is a centralized digital platform designed to simplify access to essential online resources for students, professionals, and job seekers. Many learners struggle to find reliable educational portals, government services, and productivity tools scattered across the internet. This platform solves that problem by organizing important websites into structured categories so users can access them quickly from one place.

The platform is especially useful for students pursuing ITI, Diploma, and undergraduate or postgraduate education. Instead of navigating dozens of unrelated websites, learners can directly access academic portals, scholarship platforms, examination systems, and skill-development resources through a clean and organized interface.

Openroot Helping Hand also includes curated productivity tools, AI platforms, investing resources, and government job portals. By bringing these resources together into a structured interface, the platform reduces information overload and helps users discover valuable digital tools more efficiently.`,

      features: [
        "Centralized resource hub for students, professionals, and job seekers",
        "Quick access to ITI, Diploma, and UG/PG academic portals",
        "Curated productivity tools and AI platforms",
        "Investing resources and financial information websites",
        "Government job recruitment portals and notifications",
        "Organized categories that reduce time spent searching online"
      ],

      purpose: `The primary goal of Openroot Helping Hand is to make essential educational, productivity, financial, and career resources easily accessible through a single platform.

By organizing trusted websites into structured categories, the platform helps users quickly discover useful portals without spending time searching across multiple sources. The initiative reflects Openroot Systems’ mission of supporting digital learning, skill development, and career exploration through practical online tools.`
    },

    "coevas-media-downloader": {
      overview: `Coevas Panel is a desktop application developed by Openroot Systems and distributed as a Windows executable built using the Electron framework. The software provides a simple interface that allows users to access media downloading functionality through a dedicated desktop environment.

Unlike browser-based tools, Coevas Panel runs as a standalone desktop application that combines modern web technologies with native desktop capabilities. This approach ensures smooth performance while keeping the application lightweight and easy to update.

The application is distributed through an official download portal maintained by Openroot Systems. This portal ensures that users always receive authentic software builds and the latest available version directly from the official source.`,

      features: [
        "Electron-based Windows desktop application",
        "Lightweight executable distribution",
        "Official Openroot software distribution portal",
        "Automatic listing of the latest software version",
        "Access to previous builds for compatibility",
        "Secure and controlled software release system"
      ],

      purpose: `Coevas Panel provides a reliable and controlled distribution system for desktop applications developed by Openroot Systems.

By hosting official builds through a dedicated portal, users can safely download authentic executables while developers maintain proper version control, release history, and update management.`
    },

    "openroot-classes": {
      overview: `Openroot Classes is the education and skill-development initiative of Openroot Systems. The organization is a registered MSME under the Government of India and is also listed as an employer on the National Career Service (NCS) portal.

The initiative focuses on practical learning designed for students, beginners, and professionals who want to develop real-world skills rather than purely theoretical knowledge. Openroot Classes provides structured programs that combine modern technology education with financial literacy and practical skill development.`,

      features: [
        "Prompt Engineering training for AI workflows",
        "Financial investing and financial literacy education",
        "Practical skill development for real-world applications",
        "Affordable courses designed for students and beginners",
        "Ad-free learning environment",
        "Focus on future-ready digital skills"
      ],

      purpose: `Openroot Classes aims to help individuals become future-ready by combining technology learning with financial literacy and practical skill development.

The programs are designed to help learners understand AI tools, improve productivity, and build long-term financial awareness so they can make better career and investment decisions.`
    },

    "nior-ai": {
      overview: `NIOR AI is a specialized AI-powered financial assistant developed by Openroot Systems to simplify complex financial calculations and decision-making processes. Instead of functioning as a general-purpose AI system, NIOR AI focuses specifically on financial analysis and structured calculations.

The platform contains multiple financial engines designed to solve real-world problems such as gold pricing calculations, stock investment averaging, investment projections, and loan EMI analysis. Users interact with the system through a conversational interface that guides them step-by-step through the calculation process.`,

      features: [
        "Midas Engine for gold jewellery price calculations",
        "InvestIQ Engine for stock average price analysis",
        "MoneyGrow Engine for investment growth projections",
        "Debt Decoder Engine for EMI and loan analysis",
        "Conversational AI interface for guided calculations",
        "Lightweight AI optimized for financial tasks"
      ],

      purpose: `NIOR AI focuses on solving practical financial problems through specialized analytical engines rather than generic artificial intelligence models.

By combining financial calculators with an AI-guided workflow, the system helps users understand investments, pricing, loans, and financial planning in a clear and structured way.`
    },

    "travel-expense-manager": {
      overview: `Openroot Travel Expense Manager is a smart group-expense management tool designed for travelers who want an easier way to track and split expenses during group trips.

When multiple people travel together, managing shared expenses such as food, transportation, accommodation, or tickets can quickly become confusing. This tool simplifies the process by allowing users to record expenses, assign contributors, and automatically calculate balances between participants.

The system provides a clear financial overview of the entire trip and helps groups manage their travel budget without complicated manual calculations.`,

      features: [
        "Group travel expense tracking system",
        "Support for multiple participants",
        "Flexible cost distribution methods",
        "Automatic balance calculations",
        "Multi-language interface",
        "PDF export for trip expense summaries"
      ],

      purpose: `The Travel Expense Manager simplifies group travel budgeting by automating expense tracking and balance calculations between participants.

Instead of manually determining who owes whom, the platform generates clear summaries that help travelers manage shared finances transparently and efficiently.`
    }

  };

  const content = softwareContent[tool.slug];

  const formatText = (text: any) => {
    if (typeof text !== "string") return text;

    return text.split("\n\n").map((p: string, i: number) => (
      <p key={i}>{p}</p>
    ));
  };

  return (

    <div className="softwareContainer">

      <Helmet>

        <title>{tool.name} | Openroot Systems</title>

        <link
          rel="canonical"
          href={`https://openroot.in/software/${tool.slug}`}
        />

        <meta
          name="description"
          content={tool.description}
        />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": tool.name,
            "description": tool.description,
            "applicationCategory": "Utility",
            "operatingSystem": "Web",
            "url": `https://openroot.in/software/${tool.slug}`
          })}
        </script>

      </Helmet>

      <header className="softwareHero">

        <h1>{tool.name}</h1>

        <p className="softwareDesc">
          {tool.description}
        </p>

        <div style={{ marginTop: "30px" }}>

          <button
            onClick={launch}
            style={{
              padding: "16px 32px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              background: "#a3e87b",
              fontWeight: "700",
              fontSize: "17px",
              boxShadow: "0 8px 20px rgba(0,0,0,0.25)"
            }}
          >
            🚀 Launch Tool
          </button>

          <p
            style={{
              fontSize: "13px",
              opacity: 0.6,
              marginTop: "8px"
            }}
          >
            Tool will open in the same tab
          </p>

        </div>


      </header>

      {content && (

        <>
          <section className="softwareSection">

            <h2>Overview</h2>

            <div className="overviewText">
              {formatText(content.overview)}
            </div>

          </section>

          <section className="softwareSection">

            <h2>Key Features</h2>

            <div className="featuresGrid">

              {content.features.map((feature: string, index: number) => (

                <div key={index} className="featureCard">

                  <span className="featureIcon">✔</span>

                  <p>{feature}</p>

                </div>

              ))}

            </div>

          </section>

          <section className="softwareSection">

            <h2>Purpose</h2>

            <div className="purposeBox">
              {formatText(content.purpose)}
            </div>

          </section>
        </>
      )}

    </div>

  );

}