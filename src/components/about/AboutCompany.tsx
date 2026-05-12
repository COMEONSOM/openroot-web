// =============================================================================
// src/components/AboutCompany.tsx
// SINGLE ENTRY POINT — import this in App.tsx, nothing from /about/ is needed
//
// USAGE:
//   import AboutCompany from "./components/AboutCompany";
//   <AboutCompany />
// =============================================================================

import OurServices from "./OurServices";
import Mission from "./Mission";
import About from "./About";

export default function AboutCompany() {
  return (
    <div>
      <OurServices />
      <About />
      <Mission />
    </div>
  );
}