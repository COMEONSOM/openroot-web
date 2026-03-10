// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Make sure Tailwind and FontAwesome are applied
import "@fortawesome/fontawesome-free/css/all.min.css";
import { HelmetProvider } from "@dr.pogodin/react-helmet";


const rootElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  //<React.StrictMode>
  <HelmetProvider>
    <App />
  </HelmetProvider>
  //</React.StrictMode>
);
