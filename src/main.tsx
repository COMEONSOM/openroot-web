// src/main.tsx
import ReactDOM from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext";
import App from "./App";
import "./index.css";

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

if (typeof window !== "undefined") {
  const loadAnalytics = () => {
    void import("./lib/firebaseAnalytics")
      .then(({ initAnalytics }) => initAnalytics())
      .catch(() => {
        // Analytics is non-critical; ignore load failures.
      });
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(loadAnalytics);
  } else {
    window.setTimeout(loadAnalytics, 1);
  }
}
