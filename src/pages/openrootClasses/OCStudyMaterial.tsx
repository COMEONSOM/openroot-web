// ============================================================
// STUDY MATERIAL COMPONENT — BUNDLE-OPTIMIZED VERSION
// JSON ANIMATIONS LOADED FROM /public/lotties
// ============================================================

import { useEffect, useMemo, useState } from "react";
import Lottie from "lottie-react";
import "../openrootClasses/OCStyle/OCStudyMaterial.css";

// ============================================================
// TYPES
// ============================================================

interface StudyMaterialItem {
  title: string;
  link: string;
  animationFile: string;
}

interface LottieData {
  [key: string]: unknown;
}

// ============================================================
// DATA
// ============================================================

const STUDY_MATERIALS: StudyMaterialItem[] = [
  {
    title: "PROMPT ENGINEERING",
    link: "https://drive.google.com/drive/folders/1w793Z3QJj0yorZJvDKMDLT",
    animationFile: "/lotties/prompt.json",
  },
  {
    title: "PYTHON",
    link: "https://drive.google.com/drive/folders/1IQerh93elt4mBQRdRZ_42yYv4Dv0ipTm",
    animationFile: "/lotties/python.json",
  },
  {
    title: "SQL",
    link: "https://drive.google.com/drive/folders/1AdrThpT8qlMxuWQenc7LF-ryW4FIpBBx",
    animationFile: "/lotties/MySQL.json",
  },
  {
    title: "FINANCE",
    link: "https://drive.google.com/drive/folders/1tnPiNCIiElutXDcEveQppmMkbGp1Q8Q1",
    animationFile: "/lotties/finance.json",
  },
  {
    title: "CSE BASICS",
    link: "https://drive.google.com/drive/folders/1kgOl_U_rbCHRChY2F6JdCiUW7qsEnaWt",
    animationFile: "/lotties/cse-basics.json",
  },
  {
    title: "INTERVIEW Q&A",
    link: "https://drive.google.com/drive/folders/1CKFBndpl6IafBLBLo4ywFvbi35uMZzGJ",
    animationFile: "/lotties/HR%20Interview.json",
  },
];

// ============================================================
// RESPONSIVE COLS HOOK
// ============================================================

function useMaxPerRow(): number {
  const get = (): number => {
    if (typeof window === "undefined") return 5;

    const w = window.innerWidth;
    if (w < 640) return 3;
    if (w < 1024) return 4;
    return 5;
  };

  const [cols, setCols] = useState<number>(get);

  useEffect(() => {
    const onResize = (): void => setCols(get());
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return cols;
}

// ============================================================
// LOTTIE LOADER HOOK
// ============================================================

function useStudyMaterialAnimations(materials: StudyMaterialItem[]) {
  const [animations, setAnimations] = useState<Record<string, LottieData | null>>(
    {}
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;

    const loadAll = async () => {
      try {
        const entries = await Promise.all(
          materials.map(async (item) => {
            try {
              const res = await fetch(item.animationFile);
              if (!res.ok) {
                throw new Error(`Failed to fetch ${item.animationFile}`);
              }
              const data = (await res.json()) as LottieData;
              return [item.animationFile, data] as const;
            } catch {
              return [item.animationFile, null] as const;
            }
          })
        );

        if (!isMounted) return;

        const next: Record<string, LottieData | null> = {};
        for (const [file, data] of entries) {
          next[file] = data;
        }

        setAnimations(next);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    void loadAll();

    return () => {
      isMounted = false;
    };
  }, [materials]);

  return { animations, loading };
}

// ============================================================
// VIEW-MORE POPUP BUILDER
// ============================================================

function openViewMoreWindow(materials: StudyMaterialItem[]): void {
  const win = window.open("", "_blank", "noopener,noreferrer");
  if (!win) {
    alert("Please allow popups to view all materials.");
    return;
  }

  const doc = win.document;
  doc.documentElement.lang = "en";
  doc.title = "All Study Materials";

  while (doc.head.firstChild) {
    doc.head.removeChild(doc.head.firstChild);
  }

  while (doc.body.firstChild) {
    doc.body.removeChild(doc.body.firstChild);
  }

  const charset = doc.createElement("meta");
  charset.setAttribute("charset", "utf-8");

  const viewport = doc.createElement("meta");
  viewport.name = "viewport";
  viewport.content = "width=device-width, initial-scale=1";

  const style = doc.createElement("style");
  style.textContent = `
    :root {
      --bg: #f8fafc;
      --card: #ffffff;
      --text: #111827;
      --shadow: 0 6px 18px rgba(0,0,0,0.1);
      --radius: 16px;
    }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: Inter, system-ui, sans-serif; background: var(--bg); color: var(--text); }
    header { padding: 20px; text-align: center; position: sticky; top: 0; background: var(--bg); }
    h1 { margin: 0; font-size: 24px; }
    .wrap { padding: 24px; max-width: 1280px; margin: 0 auto; }
    .grid { display: grid; gap: 24px; grid-template-columns: repeat(5, 1fr); }
    @media (max-width: 1023.98px) { .grid { grid-template-columns: repeat(4, 1fr); } }
    @media (max-width: 639.98px)  { .grid { grid-template-columns: repeat(3, 1fr); } }
    .card {
      background: var(--card);
      border-radius: var(--radius);
      min-height: 160px;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      padding: 16px;
      box-shadow: var(--shadow);
      cursor: pointer;
      transition: transform .2s ease, box-shadow .2s ease;
      border: 0;
      width: 100%;
      color: inherit;
      font: inherit;
    }
    .card:hover { transform: translateY(-4px); box-shadow: 0 10px 25px rgba(0,0,0,.15); }
    .title { font-weight: 700; }
  `;

  doc.head.append(charset, viewport, style);

  const header = doc.createElement("header");
  const heading = doc.createElement("h1");
  heading.textContent = "All Study Materials";
  header.appendChild(heading);

  const wrap = doc.createElement("div");
  wrap.className = "wrap";

  const grid = doc.createElement("div");
  grid.className = "grid";

  materials.forEach((material) => {
    const card = doc.createElement("button");
    card.type = "button";
    card.className = "card";
    card.addEventListener("click", () => {
      win.open(material.link, "_blank", "noopener,noreferrer");
    });

    const title = doc.createElement("div");
    title.className = "title";
    title.textContent = material.title;

    card.appendChild(title);
    grid.appendChild(card);
  });

  wrap.appendChild(grid);
  doc.body.append(header, wrap);
}

// ============================================================
// COMPONENT
// ============================================================

function StudyMaterial(): React.JSX.Element {
  const maxPerRow = useMaxPerRow();
  const maxVisible = maxPerRow * 2;
  const showViewMore = STUDY_MATERIALS.length > maxVisible;

  const visibleCards: StudyMaterialItem[] = useMemo(() => {
    return showViewMore
      ? STUDY_MATERIALS.slice(0, maxVisible - 1)
      : STUDY_MATERIALS.slice(0, maxVisible);
  }, [showViewMore, maxVisible]);

  const { animations, loading } = useStudyMaterialAnimations(STUDY_MATERIALS);

  const handleOpenLink = (url: string): void => {
    if (url) window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <section id="study-material" className="study-material">
      <h2 className="study-title">📚 Study Materials</h2>

      <div
        className="study-grid"
        style={{ gridTemplateColumns: `repeat(${maxPerRow}, 1fr)` }}
      >
        {visibleCards.map((item, idx) => {
          const animationData = animations[item.animationFile];

          return (
            <button
              key={`${item.title}-${idx}`}
              className="study-card"
              onClick={() => handleOpenLink(item.link)}
              type="button"
            >
              <div className="study-animation">
                {!loading && animationData ? (
                  <Lottie animationData={animationData} loop />
                ) : (
                  <div
                    style={{
                      width: "100%",
                      height: "100%",
                      display: "grid",
                      placeItems: "center",
                      fontSize: 14,
                      fontWeight: 600,
                      opacity: 0.7,
                    }}
                  >
                    Loading...
                  </div>
                )}
              </div>
              <span className="study-label">{item.title}</span>
            </button>
          );
        })}

        {showViewMore && (
          <button
            id="view-more-card"
            className="study-card"
            onClick={() => openViewMoreWindow(STUDY_MATERIALS)}
            type="button"
          >
            <div
              className="study-animation"
              style={{ fontSize: 28, fontWeight: 800 }}
            >
              ＋
            </div>
            <span className="study-label">View More</span>
          </button>
        )}
      </div>
    </section>
  );
}

export default StudyMaterial;