import { Helmet } from "react-helmet-async";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// THEME — provider lives at root so every route shares one theme instance
import { ThemeProvider } from "./context/ThemeContext";
import { ThemeToggle }   from "./components/ThemeToggle/ThemeToggle";

import BackToTop from "./context/BackToTop";
import SoftwareSolutions from "./pages/SoftwareSolutions";

// COMPONENTS
import Header          from "./components/Header";
import Advertisement   from "./components/Advertisement";
import Navbar          from "./components/Navbar";
import AboutCompany    from "./components/AboutCompany";
import Footer          from "./components/Footer";
import CertificateModal from "./components/CertificateModal";
import SoftwareHub     from "./pages/SoftwareHub";
import SoftwarePage    from "./pages/SoftwarePage";

import "./App.css";

//support pages
import PrivacyPolicy from "./pages/privacy-policy";
import OpenrootGDriveSupport from "./pages/openroot-GDrive-support";

//softwares
import ResourceHub from './pages/resourcehub';
import CoeasTerminal from './pages/coevas';
import Makaut from "./pages/makaut";
import TravelExpenseManager from "./pages/TravelExpenseManager";


// ─── 404 ─────────────────────────────────────────────────────────────────────

function NotFound() {
  return (
    <div style={{ padding: "100px", textAlign: "center" }}>
      <Helmet>
        <title>404 - Page Not Found | Openroot</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <h1>404</h1>
      <p>Page not found</p>

      <a
        href="/"
        style={{
          color: "#a3e87b",
          display: "inline-block",
          marginTop: "20px",
          textDecoration: "none",
          fontWeight: "600",
        }}
      >
        ← Go back to Home
      </a>
    </div>
  );
}


// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    // ThemeProvider wraps everything — single source of truth for all routes
    <ThemeProvider>
      <BrowserRouter>

        {/*
          ThemeToggle renders once here, outside <Routes>.
          position="fixed" in CSS keeps it on screen at all times,
          across every route, regardless of scroll position.
          Remove the old toggle from Footer — this is its permanent home.
        */}
        <ThemeToggle position="bottom-right" offset={24} />

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
                    Openroot Systems | AI Tools, Education & Software Solutions
                  </title>
                  <meta
                    name="description"
                    content="Explore Openroot Systems tools including AI apps, student utilities, financial tools and productivity software."
                  />
                  <link rel="canonical" href="https://openroot.in/" />
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
                  <title>Certificate Verification | Openroot Systems</title>
                  <meta
                    name="description"
                    content="Verify Openroot certificates securely with our official verification tool."
                  />
                  <link
                    rel="canonical"
                    href="https://openroot.in/certificate-verification"
                  />
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
                  <title>All Softwares | Openroot Systems</title>
                  <meta
                    name="description"
                    content="Browse all Openroot software tools including AI apps, expense managers, job update platforms and student utilities."
                  />
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
          <Route path="/founder" element={
            <iframe src="/founder.html" style={{ width: "100%", height: "100vh", border: "none" }} />
          } />
          <Route path="/terms" element={
            <iframe src="/terms.html" style={{ width: "100%", height: "100vh", border: "none" }} />
          } />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/support" element={<OpenrootGDriveSupport />} />
          <Route path="/resource-hub" element={<ResourceHub />} />
          <Route path="/coevas-terminal" element={<CoeasTerminal />} />
          <Route path="/makaut-grade-pro" element={<Makaut />} />
          <Route path="/travel-expense-manager" element={<TravelExpenseManager />} />

          {/* ═══════════════════════════════════════════════
              404
          ═══════════════════════════════════════════════ */}
          <Route path="*" element={<NotFound />} />

        </Routes>

      </BrowserRouter>
    </ThemeProvider>
  );
}