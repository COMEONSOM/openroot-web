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

// support pages
import PrivacyPolicy          from "./pages/privacy-policy";
import OpenrootGDriveSupport  from "./pages/openroot-GDrive-support";

// softwares
import ResourceHub          from "./pages/resourcehub";
import CoeasTerminal        from "./pages/coevas";
import Makaut               from "./pages/makaut";
import TravelExpenseManager from "./pages/TravelExpenseManager";


// ─── 404 ─────────────────────────────────────────────────────────────────────

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


// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>

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
                  {/* ── Primary ──────────────────────────────────────────────
                      Psychology: Specificity builds trust. Naming all 6 tools
                      signals depth. "Free" removes the #1 objection instantly.
                      "No download" removes the #2 friction point.
                  ── */}
                  <title>Openroot Systems – AI Tools & Free Software for Students in India</title>
                  <meta
                    name="description"
                    content="Stop wasting time on scattered tools. Openroot gives students and professionals free access to NIOR AI, MAKAUT Grade Calculator, Travel Expense Manager, Resource Hub & more — no download, no cost, just results."
                  />
                  <meta
                    name="keywords"
                    content="Openroot Systems, free tools for students India, NIOR AI assistant, MAKAUT grade calculator, MAKAUT CGPA percentage, travel expense splitter, resource hub job updates 2025, Coevas media downloader, Openroot Classes online, free productivity software India"
                  />
                  <link rel="canonical" href="https://openroot.in" />
                  <meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />

                  {/* ── Open Graph ───────────────────────────────────────────
                      Psychology: "you" framing makes it feel personal when
                      shared on WhatsApp or LinkedIn. Description creates a
                      curiosity gap without being clickbait.
                  ── */}
                  <meta property="og:type"        content="website" />
                  <meta property="og:url"         content="https://openroot.in" />
                  <meta property="og:site_name"   content="Openroot Systems" />
                  <meta property="og:locale"      content="en_IN" />
                  <meta property="og:title"       content="Openroot Systems – The Free Toolkit Every Indian Needs" />
                  <meta property="og:description" content="AI assistant, grade calculators, expense trackers, job updates, media downloader — powerful tools, zero cost. Built for students and professionals who are serious about getting things done." />
                  <meta property="og:image"       content="https://openroot.in/assets/company-icon.png" />

                  {/* ── Twitter Card ─────────────────────────────────────────
                      Psychology: Punchy headline + "no catch" removes
                      scepticism. "Trusted by students" implies social proof.
                  ── */}
                  <meta name="twitter:card"        content="summary_large_image" />
                  <meta name="twitter:title"       content="Free Tools That Make Student Life Easier – Openroot Systems" />
                  <meta name="twitter:description" content="NIOR AI, MAKAUT Calculator, Coevas Downloader, Travel Expense Manager & more. All free. No catch. Trusted by students across India." />
                  <meta name="twitter:image"       content="https://openroot.in/assets/company-icon.png" />

                  {/* ── WebSite schema: required for Google sitelinks + search box ── */}
                  <script type="application/ld+json">{`{
                    "@context": "https://schema.org",
                    "@type": "WebSite",
                    "name": "Openroot Systems",
                    "url": "https://openroot.in",
                    "description": "Openroot Systems – Free AI tools, grade calculators, 8k media downloaders and productivity software built for students and professionals in India.",
                    "potentialAction": {
                      "@type": "SearchAction",
                      "target": {
                        "@type": "EntryPoint",
                        "urlTemplate": "https://openroot.in/software?q={search_term_string}"
                      },
                      "query-input": "required name=search_term_string"
                    }
                  }`}</script>

                  {/* ── Organization schema: builds Google knowledge panel ── */}
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
                    "description": "Openroot Systems builds free AI tools, grade calculators, expense trackers, 8k media downloaders, and learning platforms — designed to save time and remove friction for students and professionals in India."
                  }`}</script>

                  {/* ── ItemList schema: tells Google which pages to show as sitelinks ── */}
                  <script type="application/ld+json">{`{
                    "@context": "https://schema.org",
                    "@type": "ItemList",
                    "name": "Free Tools by Openroot Systems",
                    "url": "https://openroot.in/software",
                    "numberOfItems": 6,
                    "itemListElement": [
                      { "@type": "ListItem", "position": 1, "name": "NIOR AI – AI Assistant",           "url": "https://openroot.in/software/nior-ai" },
                      { "@type": "ListItem", "position": 2, "name": "Resource Hub & Latest Job Updates",             "url": "https://openroot.in/software/resource-hub" },
                      { "@type": "ListItem", "position": 3, "name": "MAKAUT GPA & Percentage Calculator",            "url": "https://openroot.in/software/makaut-grade-pro" },
                      { "@type": "ListItem", "position": 4, "name": "Travel Expense Manager – Manage Trip Costs",     "url": "https://openroot.in/software/travel-expense-manager" },
                      { "@type": "ListItem", "position": 5, "name": "Openroot Classes – Learn AI & Finance Skills",  "url": "https://openroot.in/software/openroot-classes" },
                      { "@type": "ListItem", "position": 6, "name": "Coevas – 8k Media Downloader (YouTube,Instagram,Facebook,Threads ...)",    "url": "https://openroot.in/software/coevas-terminal" }
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
                  {/* Psychology: "Instantly" and "Tamper-proof" address the
                      two fears people have — speed and authenticity. */}
                  <title>Verify Your Openroot Certificate – Instant & Tamper-Proof | Openroot Systems</title>
                  <meta
                    name="description"
                    content="Received an Openroot certificate? Verify it instantly using our official secure verification tool. Get real-time confirmation — no email, no waiting."
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
                  {/* Psychology: "One place" reduces decision fatigue.
                      "No subscriptions, no ads" pre-empts every objection. */}
                  <title>All Free Tools in One Place – Openroot Systems Software Hub</title>
                  <meta
                    name="description"
                    content="Browse every free tool built by Openroot Systems — NIOR AI, MAKAUT Calculator, Coevas Downloader, Travel Expense Manager, Resource Hub and Openroot Classes. No subscriptions, no ads."
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

          <Route
            path="/founder"
            element={
              <iframe
                src="/founder.html"
                style={{ width: "100%", height: "100vh", border: "none" }}
              />
            }
          />

          <Route
            path="/terms"
            element={
              <iframe
                src="/terms.html"
                style={{ width: "100%", height: "100vh", border: "none" }}
              />
            }
          />

          <Route path="/privacy-policy"         element={<PrivacyPolicy />} />
          <Route path="/support"                element={<OpenrootGDriveSupport />} />
          <Route path="/resource-hub"           element={<ResourceHub />} />
          <Route path="/coevas-terminal"        element={<CoeasTerminal />} />
          <Route path="/makaut-grade-pro"       element={<Makaut />} />
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