// src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css"; // Make sure Tailwind and FontAwesome are applied
import { Helmet, HelmetProvider } from "@dr.pogodin/react-helmet";


const rootElement = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(rootElement).render(
  //<React.StrictMode>
  <HelmetProvider>
    <App/>
  </HelmetProvider>
  //</React.StrictMode>
);
