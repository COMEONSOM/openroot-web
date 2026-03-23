import { Helmet } from "react-helmet-async";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// COMPONENTS
import Header from "./components/Header";
import Advertisement from "./components/Advertisement";
import Navbar from "./components/Navbar";
import AboutCompany from "./components/AboutCompany/AboutCompany";
import Footer from "./components/Footer/Footer";

import CertificateModal from "./components/CertificateModal";
import SoftwareHub from "./pages/SoftwareHub";
import SoftwarePage from "./pages/SoftwarePage";

import "./App.css";

// ✅ 404 Page
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
          fontWeight: "600"
        }}
      >
        ← Go back to Home
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* =====================================================
           HOME PAGE
        ===================================================== */}
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
            </>
          }
        />

        {/* =====================================================
           CERTIFICATE VERIFICATION
        ===================================================== */}
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

        {/* =====================================================
           SOFTWARE HUB
        ===================================================== */}
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

        {/* =====================================================
           INDIVIDUAL SOFTWARE PAGE
        ===================================================== */}
        <Route
          path="/software/:slug"
          element={
            <>
              <Header />
              <SoftwarePage />
            </>
          }
        />

        {/* =====================================================
           🚨 404 PAGE
        ===================================================== */}
        <Route path="*" element={<NotFound />} />

      </Routes>

    </BrowserRouter>
  );
}