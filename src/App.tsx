import { Helmet } from "react-helmet-async";
import React, { Suspense, lazy, memo } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle/ThemeToggle";
import BackToTop from "./context/BackToTop";
import ScrollToTop from "./context/ScrollToTop";

// ── ALWAYS loaded (visible on homepage, must be instant) ─────────────────────
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import AboutCompany from "./components/about/AboutCompany";
import Footer from "./components/Footer";

import "./App.css";


// ── LAZY loaded (separate JS chunks, only downloaded when user visits that page)
const SoftwareHub         = lazy(() => import("./pages/SoftwareHub"));
const SoftwarePage        = lazy(() => import("./pages/SoftwarePage"));
const SoftwareSolutions   = lazy(() => import("./pages/SoftwareSolutions"));
const CertificateModal    = lazy(() => import("./components/CertificateModal"));
const PrivacyPolicy       = lazy(() => import("./pages/Legal/privacy-policy"));
const Terms               = lazy(() => import("./pages/Legal/terms"));
const License             = lazy(() => import("./pages/Legal/SoftwareLicense-coevas"));
const OpenrootGDriveSupport = lazy(() => import("./pages/Legal/openroot-GDrive-support"));
const XpressJob           = lazy(() => import("./pages/xpressjob"));
const CoeasTerminal       = lazy(() => import("./pages/coevas"));
const CoevasTerms         = lazy(() => import("./pages/Legal/coevas-legal-terms"));
const Makaut              = lazy(() => import("./pages/makaut"));
const TravelExpenseManager = lazy(() => import("./pages/TravelExpenseManager"));
const OCLayout            = lazy(() => import("./pages/openrootClasses/OCLayout"));
const GDrive              = lazy(() => import("./pages/GDrive"));

// ── SEO meta constants ────────────────────────────────────────────────────────
const SITE_URL   = "https://openroot.in";
const OG_IMAGE   = `${SITE_URL}/assets/company-icon.png`;
const SITE_NAME  = "Openroot Systems";

// ── Shared layout shells ──────────────────────────────────────────────────────

/** Pages that need the global Header + Navbar + Footer + BackToTop */
const HomeShell: React.FC<{ children: React.ReactNode }> = memo(({ children }) => (
  <>
    <Header />
    <Navbar />
    {children}
    <Footer />
    <BackToTop />
  </>
));
HomeShell.displayName = "HomeShell";

/** Pages that need only the global Header */
const HeaderShell: React.FC<{ children: React.ReactNode }> = memo(({ children }) => (
  <>
    <Header />
    {children}
  </>
));
HeaderShell.displayName = "HeaderShell";

// ── Loading fallback ──────────────────────────────────────────────────────────
const PageLoader = memo(() => (
  <div
    style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      opacity: 0.4,
    }}
  >
    Loading…
  </div>
));
PageLoader.displayName = "PageLoader";

// ── 404 ───────────────────────────────────────────────────────────────────────
const NotFound = memo(() => (
  <div style={{ padding: "100px", textAlign: "center" }}>
    <Helmet>
      <title>404 – Page Not Found | {SITE_NAME}</title>
      <meta name="robots" content="noindex" />
    </Helmet>
    <h1>404</h1>
    <p>Page not found</p>
  </div>
));
NotFound.displayName = "NotFound";

// ── APP ───────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>

        {/* Global scroll-to-top on every route change */}
        <ScrollToTop />

        {/* Global floating theme toggle */}
        <ThemeToggle position="bottom-right" offset={24} />

        <Suspense fallback={<PageLoader />}>
          <Routes>

            {/* ═══════════════════════════════════════════════
                HOME
            ═══════════════════════════════════════════════ */}
            <Route
              path="/"
              element={
                <HomeShell>
                  <Helmet>
                    <title>
                      {SITE_NAME} – Custom Software, AI Tools & Web Solutions
                    </title>
                    <meta
                      name="description"
                      content="Openroot Systems builds robust Automation Software, React-based Websites, Web Extensions, and Windows Applications. We also provide free, high-utility tools for students and professionals."
                    />
                    <meta
                      name="keywords"
                      content="Openroot Systems, custom software development, React websites, Windows applications, web extensions, automation software, free tools for students India, NIOR AI, MAKAUT grade calculator, productivity software"
                    />
                    <link rel="canonical" href={SITE_URL} />
                    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />

                    {/* Open Graph */}
                    <meta property="og:type"        content="website" />
                    <meta property="og:url"         content={SITE_URL} />
                    <meta property="og:site_name"   content={SITE_NAME} />
                    <meta property="og:locale"      content="en_IN" />
                    <meta property="og:title"       content={`${SITE_NAME} – Software Development & Automation`} />
                    <meta property="og:description" content="From Automation Software and React Websites to powerful free utilities like AI assistants and expense trackers. We build tech that saves you time." />
                    <meta property="og:image"       content={OG_IMAGE} />

                    {/* Twitter */}
                    <meta name="twitter:card"        content="summary_large_image" />
                    <meta name="twitter:title"       content={`${SITE_NAME} – Automation, Web Apps & Free Tools`} />
                    <meta name="twitter:description" content="Building real-world solutions: React sites, Windows apps, browser extensions, and a suite of free productivity tools for India." />
                    <meta name="twitter:image"       content={OG_IMAGE} />
                  </Helmet>

                  <AboutCompany />
                </HomeShell>
              }
            />

            {/* ═══════════════════════════════════════════════
                CERTIFICATE VERIFICATION
            ═══════════════════════════════════════════════ */}
            <Route
              path="/certificate-verification"
              element={
                <HeaderShell>
                  <Helmet>
                    <title>Verify Your Openroot Certificate – Instant & Tamper-Proof</title>
                    <meta
                      name="description"
                      content="Received an Openroot certificate? Verify it instantly using our official secure verification tool."
                    />
                    <link rel="canonical" href={`${SITE_URL}/certificate-verification`} />
                  </Helmet>
                  <CertificateModal isOpen={true} onClose={() => {}} />
                </HeaderShell>
              }
            />

            {/* ═══════════════════════════════════════════════
                SOFTWARE HUB
            ═══════════════════════════════════════════════ */}
            <Route
              path="/software"
              element={
                <HeaderShell>
                  <Helmet>
                    <title>All Free Tools in One Place – {SITE_NAME} Software Hub</title>
                    <meta
                      name="description"
                      content="Browse every free tool built by Openroot Systems."
                    />
                    <link rel="canonical" href={`${SITE_URL}/software`} />
                  </Helmet>
                  <SoftwareHub />
                </HeaderShell>
              }
            />

            {/* ═══════════════════════════════════════════════
                SOFTWARE PAGE (dynamic slug)
            ═══════════════════════════════════════════════ */}
            <Route
              path="/software/:slug"
              element={
                <HeaderShell>
                  <SoftwarePage />
                </HeaderShell>
              }
            />

            {/* ═══════════════════════════════════════════════
                SOFTWARE SOLUTIONS
            ═══════════════════════════════════════════════ */}
            <Route
              path="/software-solutions"
              element={<SoftwareSolutions />}
            />

            {/* ═══════════════════════════════════════════════
                FOUNDER (static HTML embed)
            ═══════════════════════════════════════════════ */}
            <Route
              path="/founder"
              element={
                <iframe
                  src="/founder.html"
                  title="Founder – Openroot Systems"
                  style={{ width: "100%", height: "100vh", border: "none" }}
                />
              }
            />

            {/* ═══════════════════════════════════════════════
                LEGAL
            ═══════════════════════════════════════════════ */}
            <Route path="/terms"          element={<Terms />} />
            <Route path="/CoevasTerms"    element={<CoevasTerms />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/license"        element={<License />} />
            <Route path="/support"        element={<OpenrootGDriveSupport />} />

            {/* ═══════════════════════════════════════════════
                TOOLS
            ═══════════════════════════════════════════════ */}
            <Route path="/xpress-job"           element={<XpressJob />} />
            <Route path="/coevas-terminal"        element={<CoeasTerminal />} />
            <Route path="/makaut-grade-pro"        element={<Makaut />} />
            <Route path="/travel-expense-manager" element={<TravelExpenseManager />} />
            <Route path="/openroot-classes"        element={<OCLayout />} />
            <Route path="/gdrive-web-extension"    element={<GDrive />} />

            {/* ═══════════════════════════════════════════════
                404
            ═══════════════════════════════════════════════ */}
            <Route path="*" element={<NotFound />} />

          </Routes>
        </Suspense>

      </BrowserRouter>
    </ThemeProvider>
  );
}