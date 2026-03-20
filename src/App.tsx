import { Helmet } from "@dr.pogodin/react-helmet";
import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// COMPONENTS
import Header from "./components/Header";
import Advertisement from "./components/Advertisement";
import Navbar from "./components/Navbar";
import AboutCompany from "./components/AboutCompany/AboutCompany";
import Footer from "./components/Footer/Footer";

// PAGES
import CertificateVerification from "./pages/CertificateVerification";
import SoftwareHub from "./pages/SoftwareHub";
import SoftwarePage from "./pages/SoftwarePage";

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>

      {/* =====================================================
         GLOBAL SEO (FALLBACK ONLY — DO NOT REMOVE)
      ===================================================== */}
      <Helmet>
        <title>Openroot Systems</title>

        <meta
          name="description"
          content="Openroot Systems builds AI tools, productivity software, student utilities and digital solutions."
        />

        <link rel="canonical" href="https://openroot.in/" />
      </Helmet>

      {/* GLOBAL HEADER */}
      <Header />

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
                <title>Certificate Verification | Openroot</title>

                <meta
                  name="description"
                  content="Verify Openroot certificates securely with our official verification tool."
                />

                <link
                  rel="canonical"
                  href="https://openroot.in/certificate-verification"
                />
              </Helmet>

              <CertificateVerification />
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
                <title>All Software Tools | Openroot</title>

                <meta
                  name="description"
                  content="Browse all Openroot software tools including AI apps, expense managers, job update platforms and student utilities."
                />

                <link rel="canonical" href="https://openroot.in/software" />
              </Helmet>

              <SoftwareHub />
            </>
          }
        />

        {/* =====================================================
           INDIVIDUAL SOFTWARE PAGE (DYNAMIC SEO INSIDE PAGE)
        ===================================================== */}
        <Route
          path="/software/:slug"
          element={<SoftwarePage />}
        />

      </Routes>

    </BrowserRouter>
  );
}