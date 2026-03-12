import { useParams } from "react-router-dom";
import { softwareList } from "../data/softwareList";
import { Helmet } from "@dr.pogodin/react-helmet";

export default function SoftwarePage() {

  const { slug } = useParams();

  const slugMap: Record<string, string> = {
    "resource-hub": "helping-hand",
    "nior-ai": "nior-module"
  };

  const resolvedSlug = slugMap[slug || ""] || slug;

  const tool = softwareList.find((t) => t.slug === resolvedSlug);

  if (!tool) return <h2>Software not found</h2>;

  const launch = () => {
    window.open(tool.url, "_blank");
  };

  return (

    <div style={{ padding: "80px", textAlign: "center" }}>

      <Helmet>

        <title>
          {tool.name} | Openroot Systems
        </title>

        <meta
          name="description"
          content={tool.description}
        />

        <meta
          property="og:title"
          content={`${tool.name} | Openroot Systems`}
        />

        <meta
          property="og:description"
          content={tool.description}
        />

        <meta
          property="og:url"
          content={`https://openroot.in/${slug}`}
        />

        {/* ======================================================
           SOFTWARE SCHEMA
        ====================================================== */}

        <script type="application/ld+json">
{`
{
 "@context": "https://schema.org",
 "@type": "SoftwareApplication",
 "name": "${tool.name}",
 "applicationCategory": "UtilityApplication",
 "operatingSystem": "Web",
 "url": "${tool.url}",
 "description": "${tool.description}",
 "publisher": {
   "@type": "Organization",
   "name": "Openroot Systems",
   "url": "https://openroot.in"
 }
}
`}
        </script>

        {/* ======================================================
           BREADCRUMB SCHEMA
        ====================================================== */}

        <script type="application/ld+json">
{`
{
 "@context": "https://schema.org",
 "@type": "BreadcrumbList",
 "itemListElement": [
   {
     "@type": "ListItem",
     "position": 1,
     "name": "Home",
     "item": "https://openroot.in"
   },
   {
     "@type": "ListItem",
     "position": 2,
     "name": "${tool.name}",
     "item": "https://openroot.in/${slug}"
   }
 ]
}
`}
        </script>

      </Helmet>

      {/* PAGE CONTENT */}

      <h1>{tool.name}</h1>

      <p style={{ maxWidth: "600px", margin: "20px auto" }}>
        {tool.description}
      </p>

      <button
        onClick={launch}
        style={{
          padding: "12px 22px",
          borderRadius: "8px",
          border: "none",
          cursor: "pointer",
          background: "#a3e87b",
          fontWeight: "600"
        }}
      >
        Launch Tool
      </button>

    </div>

  );
}