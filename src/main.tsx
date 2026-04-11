// src/main.tsx
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import "./index.css";
import "./components/styles/CertificateModal.css";
import "@fortawesome/fontawesome-free/css/all.min.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <HelmetProvider>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </HelmetProvider>
);