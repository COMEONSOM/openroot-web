// ============================================================
// BANNER PAGE ROUTER
// Route: /openroot-classes/:slug  (the ONLY route you need)
//
// Each banner has its own dedicated page component with its own
// layout, content and CSS. This file just maps slug -> page.
// Pages load on demand (React.lazy), so a visitor only downloads
// the page they open.
//
// ADD A NEW BANNER PAGE:
//   1. create openrootClasses/MyNewPage.tsx  (default export)
//   2. add one line to PAGES below
//   3. add the banner images + slug to data/bannerData.ts
// ============================================================

import { lazy, Suspense, useEffect } from "react";
import type { ComponentType, LazyExoticComponent } from "react";
import { Link, useParams } from "react-router-dom";

import { BANNER_BASE_PATH } from "./data/bannerData";

import "./OCStyle/Ocbannerpagerouter.css";

const PAGES: Record<string, LazyExoticComponent<ComponentType>> = {
  "prompt-engineering": lazy(() => import("./Promptengineeringpage")),
  "the-right-choice": lazy(() => import("./Therightchoicepage")),
};

export default function BannerPageRouter() {
  const { slug = "" } = useParams<{ slug: string }>();

  // Always open a banner page from the top
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [slug]);

  // Object.hasOwn: "constructor", "toString" etc. are not valid slugs
  if (!Object.hasOwn(PAGES, slug)) {
    return (
      <main className="bpr">
        <div className="bpr__box">
          <h1 className="bpr__title">Page not found</h1>
          <p className="bpr__text">
            This banner page does not exist or has been moved.
          </p>
          <Link to={BANNER_BASE_PATH} className="bpr__link">
            Back to Openroot Classes
          </Link>
        </div>
      </main>
    );
  }

  const Page = PAGES[slug];

  return (
    <Suspense
      fallback={
        <main className="bpr">
          <p className="bpr__loading" role="status">
            Loading…
          </p>
        </main>
      }
    >
      <Page />
    </Suspense>
  );
}