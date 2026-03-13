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
      </Helmet>

      {/* GLOBAL HEADER */}
      <Header />

      <Routes>

        {/* HOME PAGE */}

        <Route
          path="/"
          element={
            <>
              <Advertisement />
              <Navbar />
              <AboutCompany />
              <Footer />
            </>
          }
        />

        {/* CERTIFICATE VERIFICATION */}

        <Route
          path="/certificate-verification"
          element={<CertificateVerification />}
        />

        {/* SOFTWARE HUB */}

        <Route
          path="/software"
          element={<SoftwareHub />}
        />

        {/* SOFTWARE PAGE */}

        <Route
          path="/software/:slug"
          element={<SoftwarePage />}
        />

      </Routes>

    </BrowserRouter>

  );

}