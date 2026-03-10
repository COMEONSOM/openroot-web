// ============================================================
// APP ROOT — OPENROOT FINANCIAL SYSTEMS
// GLOBAL SEO + ROUTER + LAZY BACKGROUND
// ============================================================

import { Helmet } from "@dr.pogodin/react-helmet";
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// COMPONENTS
import Header from "./components/Header";
import Advertisement from "./components/Advertisement";
import Navbar from "./components/Navbar";
import AboutCompany from "./components/AboutCompany/AboutCompany";
import Footer from "./components/Footer/Footer";
import CertificateVerification from "./pages/CertificateVerification";

// Lazy background animation
//const BackgroundAnimation = React.lazy(() =>
  //import("./components/BackgroundAnimation")); 

import "./App.css";

export default function App() {
  return (
    <BrowserRouter>
      <div className="app-wrapper">

        <Helmet>
          <title>Openroot Financial Systems</title>
          <meta
            name="description"
            content="Openroot offers modern financial tools and AI powered utilities."
          />
        </Helmet>

        {/* <Suspense fallback={null}>
          <BackgroundAnimation />
        </Suspense> */}

        <Header />
        <Advertisement />
        <Navbar />

        <Routes>

          {/* HOME PAGE */}
          <Route path="/" element={<AboutCompany />} />

          {/* CERTIFICATE VERIFICATION PAGE */}
          <Route
            path="/certificate-verification"
            element={<CertificateVerification />}
          />

        </Routes>

        <Footer />

      </div>
    </BrowserRouter>
  );
}