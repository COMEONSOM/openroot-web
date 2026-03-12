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
      <div className="app-wrapper">

        {/* ============================================================
           GLOBAL SEO META
        ============================================================ */}

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

          <meta
            name="author"
            content="Openroot Systems"
          />

          {/* Open Graph */}

          <meta
            property="og:title"
            content="Openroot Systems | AI Tools & Productivity Software"
          />

          <meta
            property="og:description"
            content="Explore Openroot tools including NIOR AI, Resource Hub, Travel Expense Manager and more productivity utilities."
          />

          <meta
            property="og:url"
            content="https://openroot.in"
          />

          <meta
            property="og:type"
            content="website"
          />

          {/* ============================================================
             STRUCTURED DATA (SITELINKS SEO)
          ============================================================ */}

          <script type="application/ld+json">
            {`
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Openroot Systems",
  "url": "https://openroot.in",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://openroot.in/search?q={search_term_string}",
    "query-input": "required name=search_term_string"
  },
  "hasPart": [
    {
      "@type": "WebPage",
      "name": "NIOR AI",
      "url": "https://openroot.in/nior-ai"
    },
    {
      "@type": "WebPage",
      "name": "Resource Hub & Job Updates",
      "url": "https://openroot.in/resource-hub"
    },
    {
      "@type": "WebPage",
      "name": "Travel Expense Manager",
      "url": "https://openroot.in/travel-expense-manager"
    },
    {
      "@type": "WebPage",
      "name": "Openroot Classes",
      "url": "https://openroot.in/openroot-classes"
    },
    {
      "@type": "WebPage",
      "name": "Certificate Verification",
      "url": "https://openroot.in/certificate-verification"
    }
  ]
}
`}
          </script>

        </Helmet>

        {/* ============================================================
           GLOBAL COMPONENTS
        ============================================================ */}

        <Header />

        {/* HERO / ADVERTISEMENT SECTION */}
        <Advertisement />

        {/* SOFTWARE NAVIGATION SECTION */}
        <Navbar />

        {/* ============================================================
           ROUTING STRUCTURE
        ============================================================ */}

        <Routes>

          {/* HOME PAGE */}
          <Route
            path="/"
            element={<AboutCompany />}
          />

          {/* CERTIFICATE VERIFICATION */}
          <Route
            path="/certificate-verification"
            element={<CertificateVerification />}
          />

          {/* SOFTWARE HUB (OPTIONAL DIRECTORY PAGE) */}
          <Route
            path="/software"
            element={<SoftwareHub />}
          />

          {/* DYNAMIC SOFTWARE PAGE */}
          <Route
            path="/software/:slug"
            element={<SoftwarePage />}
          />

          {/* ============================================================
             DIRECT TOOL ROUTES (BOOSTS SEO DISCOVERY)
          ============================================================ */}

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

        {/* ============================================================
           FOOTER
        ============================================================ */}

        <Footer />

      </div>
    </BrowserRouter>
  );
}