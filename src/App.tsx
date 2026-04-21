import { Helmet } from "react-helmet-async";
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { ThemeProvider } from "./context/ThemeContext";
import { ThemeToggle }   from "./components/ThemeToggle/ThemeToggle";
import BackToTop from "./context/BackToTop";

// ── ALWAYS loaded (visible on homepage, must be instant) ─────────────────────
import Header        from "./components/Header";
import Advertisement from "./components/Advertisement";
import Navbar        from "./components/Navbar";
import AboutCompany  from "./components/AboutCompany";
import Footer        from "./components/Footer";

import "./App.css";

// ── LAZY loaded (separate JS chunks, only downloaded when user visits that page)
const SoftwareHub           = lazy(() => import("./pages/SoftwareHub"));
const SoftwarePage          = lazy(() => import("./pages/SoftwarePage"));
const SoftwareSolutions     = lazy(() => import("./pages/SoftwareSolutions"));
const CertificateModal      = lazy(() => import("./components/CertificateModal"));
const PrivacyPolicy         = lazy(() => import("./pages/privacy-policy"));
const OpenrootGDriveSupport = lazy(() => import("./pages/openroot-GDrive-support"));
const ResourceHub           = lazy(() => import("./pages/resourcehub"));
const CoeasTerminal         = lazy(() => import("./pages/coevas"));
const Makaut                = lazy(() => import("./pages/makaut"));
const TravelExpenseManager  = lazy(() => import("./pages/TravelExpenseManager"));
const OCLayout              = lazy(() => import("./pages/openrootClasses/OCLayout"));
const GDrive                = lazy(() => import("./pages/GDrive"));

// ── Minimal loading fallback — no heavy imports, no animations ───────────────
function PageLoader() {
  return (
    <div style={{
      minHeight: "60vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "14px",
      opacity: 0.4,
    }}>
      Loading…
    </div>
  );
}

// ── 404 ──────────────────────────────────────────────────────────────────────
function NotFound() {
  return (
    <div style={{ padding: "100px", textAlign: "center" }}>
      <Helmet>
        <title>404 - Page Not Found | Openroot Systems</title>
        <meta name="robots" content="noindex" />
      </Helmet>
      <h1>404</h1>
      <p>Page not found</p>
    </div>
  );
}

// ── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <ThemeToggle position="bottom-right" offset={24} />

        {/* Suspense boundary — shows PageLoader while any lazy chunk downloads */}
        <Suspense fallback={<PageLoader />}>
          <Routes>

            {/* ═══════════════════════════════════════════════
                HOME PAGE
            ═══════════════════════════════════════════════ */}
            <Route
              path="/"
              element={
                <>
                  <Helmet>
                    <title>Openroot Systems – Custom Software, AI Tools & Web Solutions</title>
                    <meta
                      name="description"
                      content="Openroot Systems builds robust Automation Software, React-based Websites, Web Extensions, and Windows Applications. We also provide free, high-utility tools for students and professionals."
                    />
                    <meta
                      name="keywords"
                      content="Openroot Systems, custom software development, React websites, Windows applications, web extensions, automation software, free tools for students India, NIOR AI, MAKAUT grade calculator, productivity software"
                    />
                    <link rel="canonical" href="https://openroot.in" />
                    <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />

                    <meta property="og:type"        content="website" />
                    <meta property="og:url"         content="https://openroot.in" />
                    <meta property="og:site_name"   content="Openroot Systems" />
                    <meta property="og:locale"      content="en_IN" />
                    <meta property="og:title"       content="Openroot Systems – Software Development & Automation" />
                    <meta property="og:description" content="From Automation Software and React Websites to powerful free utilities like AI assistants and expense trackers. We build tech that saves you time." />
                    <meta property="og:image"       content="https://openroot.in/assets/company-icon.png" />

                    <meta name="twitter:card"        content="summary_large_image" />
                    <meta name="twitter:title"       content="Openroot Systems – Automation, Web Apps & Free Tools" />
                    <meta name="twitter:description" content="Building real-world solutions: React sites, Windows apps, browser extensions, and a suite of free productivity tools for India." />
                    <meta name="twitter:image"       content="https://openroot.in/assets/company-icon.png" />

                    <script type="application/ld+json">{`{
                      "@context": "https://schema.org",
                      "@type": "WebSite",
                      "name": "Openroot Systems",
                      "url": "https://openroot.in",
                      "description": "Openroot Systems builds Automation Softwares, React based Websites, Web extensions, Windows Applications, alongside offering productivity tools.",
                      "potentialAction": {
                        "@type": "SearchAction",
                        "target": {
                          "@type": "EntryPoint",
                          "urlTemplate": "https://openroot.in/software?q={search_term_string}"
                        },
                        "query-input": "required name=search_term_string"
                      }
                    }`}</script>

                    <script type="application/ld+json">{`{
                      "@context": "https://schema.org",
                      "@type": "Organization",
                      "name": "Openroot Systems",
                      "url": "https://openroot.in",
                      "logo": {
                        "@type": "ImageObject",
                        "url": "https://openroot.in/assets/company-icon.png",
                        "width": 512,
                        "height": 512
                      },
                      "description": "Openroot Systems is a technology company specializing in Automation Softwares, React based Websites, Web extensions, and Windows Applications — designed to save time and remove friction for businesses and individuals."
                    }`}</script>

                    <script type="application/ld+json">{`{
                      "@context": "https://schema.org",
                      "@type": "ItemList",
                      "name": "Free Tools by Openroot Systems",
                      "url": "https://openroot.in/software",
                      "numberOfItems": 6,
                      "itemListElement": [
                        { "@type": "ListItem", "position": 1, "name": "NIOR AI – AI Productivity Assistant",           "url": "https://openroot.in/software/nior-ai" },
                        { "@type": "ListItem", "position": 2, "name": "Resource Hub & Latest Job Updates",             "url": "https://openroot.in/software/resource-hub" },
                        { "@type": "ListItem", "position": 3, "name": "MAKAUT GPA & Percentage Calculator",            "url": "https://openroot.in/software/makaut-grade-pro" },
                        { "@type": "ListItem", "position": 4, "name": "Travel Expense Manager – Split Trip Costs",     "url": "https://openroot.in/software/travel-expense-manager" },
                        { "@type": "ListItem", "position": 5, "name": "Openroot Classes – Learn AI & Finance Skills",  "url": "https://openroot.in/software/openroot-classes" },
                        { "@type": "ListItem", "position": 6, "name": "Coevas – Download from YouTube & Instagram",    "url": "https://openroot.in/software/coevas-terminal" }
                      ]
                    }`}</script>
                  </Helmet>

                  <Header />
                  <Advertisement />
                  <Navbar />
                  <AboutCompany />
                  <Footer />
                  <BackToTop />
                </>
              }
            />

            {/* ═══════════════════════════════════════════════
                CERTIFICATE VERIFICATION
            ═══════════════════════════════════════════════ */}
            <Route
              path="/certificate-verification"
              element={
                <>
                  <Helmet>
                    <title>Verify Your Openroot Certificate – Instant & Tamper-Proof | Openroot Systems</title>
                    <meta name="description" content="Received an Openroot certificate? Verify it instantly using our official secure verification tool. Get real-time confirmation — no email, no waiting." />
                    <link rel="canonical" href="https://openroot.in/certificate-verification" />
                  </Helmet>
                  <Header />
                  <CertificateModal isOpen={true} onClose={() => {}} />
                </>
              }
            />

            {/* ═══════════════════════════════════════════════
                SOFTWARE HUB
            ═══════════════════════════════════════════════ */}
            <Route
              path="/software"
              element={
                <>
                  <Helmet>
                    <title>All Free Tools in One Place – Openroot Software Hub</title>
                    <meta name="description" content="Browse every free tool built by Openroot Systems — NIOR AI, MAKAUT Calculator, Coevas Downloader, Travel Expense Manager, Resource Hub and Openroot Classes. No subscriptions, no ads." />
                    <link rel="canonical" href="https://openroot.in/software" />
                  </Helmet>
                  <Header />
                  <SoftwareHub />
                </>
              }
            />

            {/* ═══════════════════════════════════════════════
                INDIVIDUAL SOFTWARE PAGE
            ═══════════════════════════════════════════════ */}
            <Route
              path="/software/:slug"
              element={
                <>
                  <Header />
                  <SoftwarePage />
                </>
              }
            />

            <Route path="/software-solutions" element={<SoftwareSolutions />} />

            <Route
              path="/founder"
              element={
                <iframe src="/founder.html" style={{ width: "100%", height: "100vh", border: "none" }} />
              }
            />

            <Route
              path="/terms"
              element={
                <iframe src="/terms.html" style={{ width: "100%", height: "100vh", border: "none" }} />
              }
            />

            <Route path="/privacy-policy"         element={<PrivacyPolicy />} />
            <Route path="/support"                element={<OpenrootGDriveSupport />} />
            <Route path="/resource-hub"           element={<ResourceHub />} />
            <Route path="/coevas-terminal"        element={<CoeasTerminal />} />
            <Route path="/makaut-grade-pro"       element={<Makaut />} />
            <Route path="/travel-expense-manager" element={<TravelExpenseManager />} />
            <Route path="/openroot-classes" element={<OCLayout />} />
            <Route path="/gdrive-web-extension" element={<GDrive />} />

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