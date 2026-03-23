import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./components/styles/CertificateModal.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { HelmetProvider } from "react-helmet-async";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <HelmetProvider>
    <App />
  </HelmetProvider>
);