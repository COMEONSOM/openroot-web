// ============================================================
// APP ROOT — OPENROOT FINANCIAL SYSTEMS
// GLOBAL SEO + LAZY BACKGROUND + ALL COMPONENTS
// VERSION: 2025.10 — FULL SEO + PERFORMANCE BUILD
// src/App.jsx
// ============================================================

import { Helmet, HelmetProvider } from "@dr.pogodin/react-helmet";
import React, { Suspense } from "react";

// COMPONENTS
import Header from "./components/Header";
import Advertisement from "./components/Advertisement";
import Navbar from "./components/Navbar";
import AboutCompany from "./components/AboutCompany/AboutCompany";
import ContactFollow from "./components/ContactFollow";
import Footer from "./components/Footer";

// ⚡ Lazy-loaded background animation for performance
const BackgroundAnimation = React.lazy(() =>
  import("./components/BackgroundAnimation")
);

import "./App.css";

// ============================================================
// MAIN APP COMPONENT
// ============================================================
export default function App() {
  return (
    <div className="app-wrapper">
      <Helmet>
        <title>Openroot Financial Systems</title>
        <meta
          name="description"
          content="Openroot offers modern financial tools, AI-powered utilities..."
        />
        <meta
          name="keywords"
          content="Openroot, fintech tools, SIP calculator, AI utilities, MSME software"
        />
        <meta name="author" content="Openroot" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://openroot.in" />
        <meta property="og:title" content="Openroot Financial Systems" />
        <meta
          property="og:description"
          content="Modern fintech & AI-powered financial tools..."
        />
        <meta property="og:url" content="https://openroot.in" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="https://openroot.in/assets/company-icon.avif"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Openroot Financial Systems" />
        <meta
          name="twitter:description"
          content="Explore modern fintech tools and AI utilities from Openroot."
        />
        <meta
          name="twitter:image"
          content="https://openroot.in/assets/company-icon.avif"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="theme-color" content="#0f172a" />

        {/* ORGANIZATION SEO SCHEMA */}
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Openroot Financial Systems",
              "url": "https://openroot.in",
              "logo": "https://openroot.in/assets/company-icon.avif",
              "description": "Modern fintech and AI-powered tools for students, professionals, and MSMEs.",
              "sameAs": [
                "https://www.facebook.com/openroothypersite"
              ]
            }
          `}
        </script>
      </Helmet>

      {/* LAZY BACKGROUND ANIMATION FOR PERFORMANCE */}
      <Suspense fallback={null}>
        <BackgroundAnimation />
      </Suspense>

      {/* PAGE CONTENT */}
      <Header />
      <Advertisement />
      <Navbar />
      <AboutCompany /> {/* ⭐ Now uses new modular structure */}
      <ContactFollow />
      <Footer />
    </div>
  );
}
