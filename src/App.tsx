// ============================================================
// APP ROOT — OPENROOT SYSTEMS
// GLOBAL SEO + ROUTER + STRUCTURED DATA
// ============================================================

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

      <Helmet>

        <title>
          Openroot Systems | AI Tools, Productivity Software & Student Utilities
        </title>

        <meta
          name="description"
          content="Openroot Systems builds AI tools, productivity software, student utilities and financial management applications."
        />

        <meta
          name="keywords"
          content="Openroot, NIOR AI, travel expense manager, resource hub, student tools, productivity software, Openroot systems"
        />

      </Helmet>

      {/* GLOBAL HEADER */}
      <Header />

      {/* ROUTES */}
      <Routes>

        {/* =====================================================
           HOME PAGE
        ===================================================== */}

        <Route
          path="/"
          element={
            <>
              <Advertisement />
              <Navbar />
              <AboutCompany />
            </>
          }
        />

        {/* =====================================================
           CERTIFICATE VERIFICATION
        ===================================================== */}

        <Route
          path="/certificate-verification"
          element={<CertificateVerification />}
        />

        {/* =====================================================
           SOFTWARE HUB
        ===================================================== */}

        <Route
          path="/software"
          element={<SoftwareHub />}
        />

        {/* =====================================================
           SOFTWARE PAGES
        ===================================================== */}

        <Route
          path="/software/:slug"
          element={<SoftwarePage />}
        />

        {/* DIRECT SEO ROUTES */}

        <Route
          path="/nior-ai"
          element={<SoftwarePage />}
        />

        <Route
          path="/resource-hub"
          element={<SoftwarePage />}
        />

        <Route
          path="/travel-expense-manager"
          element={<SoftwarePage />}
        />

        <Route
          path="/openroot-classes"
          element={<SoftwarePage />}
        />

      </Routes>

      {/* FOOTER */}
      <Footer />

    </BrowserRouter>
  );
}