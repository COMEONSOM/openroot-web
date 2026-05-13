import { Helmet } from "react-helmet-async";
import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

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
const SoftwareHub = lazy(
  () => import("./pages/SoftwareHub")
);

const SoftwarePage = lazy(
  () => import("./pages/SoftwarePage")
);

const SoftwareSolutions = lazy(
  () => import("./pages/SoftwareSolutions")
);

const CertificateModal = lazy(
  () =>
    import(
      "./components/CertificateModal"
    )
);

const PrivacyPolicy = lazy(
  () =>
    import(
      "./pages/Legal/privacy-policy"
    )
);

const Terms = lazy(
  () => import("./pages/Legal/terms")
);

const License = lazy(
  () =>
    import(
      "./pages/Legal/SoftwareLicense-coevas"
    )
);

const OpenrootGDriveSupport = lazy(
  () =>
    import(
      "./pages/Legal/openroot-GDrive-support"
    )
);

const ResourceHub = lazy(
  () => import("./pages/resourcehub")
);

const CoeasTerminal = lazy(
  () => import("./pages/coevas")
);

const CoevasTerms = lazy(
  () =>
    import(
      "./pages/Legal/coevas-legal-terms"
    )
);

const Makaut = lazy(
  () => import("./pages/makaut")
);

const TravelExpenseManager = lazy(
  () =>
    import(
      "./pages/TravelExpenseManager"
    )
);

const OCLayout = lazy(
  () =>
    import(
      "./pages/openrootClasses/OCLayout"
    )
);

const GDrive = lazy(
  () => import("./pages/GDrive")
);

// ── Minimal loading fallback ─────────────────────────────────────────────────

function PageLoader() {
  return (
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
  );
}

// ── 404 ──────────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div
      style={{
        padding: "100px",
        textAlign: "center",
      }}
    >
      <Helmet>
        <title>
          404 - Page Not Found | Openroot
          Systems
        </title>

        <meta
          name="robots"
          content="noindex"
        />
      </Helmet>

      <h1>404</h1>

      <p>Page not found</p>
    </div>
  );
}

// ── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        {/* =====================================================
            GLOBAL SCROLL RESET
        ====================================================== */}

        <ScrollToTop />

        {/* =====================================================
            GLOBAL THEME TOGGLE
        ====================================================== */}

        <ThemeToggle
          position="bottom-right"
          offset={24}
        />

        {/* =====================================================
            LAZY ROUTES
        ====================================================== */}

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
                    <title>
                      Openroot Systems –
                      Custom Software, AI
                      Tools & Web Solutions
                    </title>

                    <meta
                      name="description"
                      content="Openroot Systems builds robust Automation Software, React-based Websites, Web Extensions, and Windows Applications. We also provide free, high-utility tools for students and professionals."
                    />

                    <meta
                      name="keywords"
                      content="Openroot Systems, custom software development, React websites, Windows applications, web extensions, automation software, free tools for students India, NIOR AI, MAKAUT grade calculator, productivity software"
                    />

                    <link
                      rel="canonical"
                      href="https://openroot.in"
                    />

                    <meta
                      name="robots"
                      content="index, follow, max-snippet:-1, max-image-preview:large"
                    />

                    <meta
                      property="og:type"
                      content="website"
                    />

                    <meta
                      property="og:url"
                      content="https://openroot.in"
                    />

                    <meta
                      property="og:site_name"
                      content="Openroot Systems"
                    />

                    <meta
                      property="og:locale"
                      content="en_IN"
                    />

                    <meta
                      property="og:title"
                      content="Openroot Systems – Software Development & Automation"
                    />

                    <meta
                      property="og:description"
                      content="From Automation Software and React Websites to powerful free utilities like AI assistants and expense trackers. We build tech that saves you time."
                    />

                    <meta
                      property="og:image"
                      content="https://openroot.in/assets/company-icon.png"
                    />

                    <meta
                      name="twitter:card"
                      content="summary_large_image"
                    />

                    <meta
                      name="twitter:title"
                      content="Openroot Systems – Automation, Web Apps & Free Tools"
                    />

                    <meta
                      name="twitter:description"
                      content="Building real-world solutions: React sites, Windows apps, browser extensions, and a suite of free productivity tools for India."
                    />

                    <meta
                      name="twitter:image"
                      content="https://openroot.in/assets/company-icon.png"
                    />
                  </Helmet>

                  <Header />

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
                    <title>
                      Verify Your Openroot
                      Certificate – Instant &
                      Tamper-Proof
                    </title>

                    <meta
                      name="description"
                      content="Received an Openroot certificate? Verify it instantly using our official secure verification tool."
                    />

                    <link
                      rel="canonical"
                      href="https://openroot.in/certificate-verification"
                    />
                  </Helmet>

                  <Header />

                  <CertificateModal
                    isOpen={true}
                    onClose={() => {}}
                  />
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
                    <title>
                      All Free Tools in One
                      Place – Openroot
                      Software Hub
                    </title>

                    <meta
                      name="description"
                      content="Browse every free tool built by Openroot Systems."
                    />

                    <link
                      rel="canonical"
                      href="https://openroot.in/software"
                    />
                  </Helmet>

                  <Header />

                  <SoftwareHub />
                </>
              }
            />

            {/* ═══════════════════════════════════════════════
                SOFTWARE PAGE
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

            {/* ═══════════════════════════════════════════════
                OTHER ROUTES
            ═══════════════════════════════════════════════ */}

            <Route
              path="/software-solutions"
              element={
                <SoftwareSolutions />
              }
            />

            <Route
              path="/founder"
              element={
                <iframe
                  src="/founder.html"
                  style={{
                    width: "100%",
                    height: "100vh",
                    border: "none",
                  }}
                />
              }
            />

            {/* LEGAL */}

            <Route
              path="/terms"
              element={<Terms />}
            />

            <Route
              path="/CoevasTerms"
              element={<CoevasTerms />}
            />

            <Route
              path="/privacy-policy"
              element={<PrivacyPolicy />}
            />

            <Route
              path="/license"
              element={<License />}
            />

            <Route
              path="/support"
              element={
                <OpenrootGDriveSupport />
              }
            />

            {/* TOOLS */}

            <Route
              path="/resource-hub"
              element={<ResourceHub />}
            />

            <Route
              path="/coevas-terminal"
              element={<CoeasTerminal />}
            />

            <Route
              path="/makaut-grade-pro"
              element={<Makaut />}
            />

            <Route
              path="/travel-expense-manager"
              element={
                <TravelExpenseManager />
              }
            />

            <Route
              path="/openroot-classes"
              element={<OCLayout />}
            />

            <Route
              path="/gdrive-web-extension"
              element={<GDrive />}
            />

            {/* ═══════════════════════════════════════════════
                404
            ═══════════════════════════════════════════════ */}

            <Route
              path="*"
              element={<NotFound />}
            />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ThemeProvider>
  );
}