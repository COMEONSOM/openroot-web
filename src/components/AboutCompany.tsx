// =============================================================================
// src/components/AboutCompany.tsx
// SINGLE ENTRY POINT — import this in App.tsx, nothing from /about/ is needed
//
// USAGE:
//   import AboutCompany from "./components/AboutCompany";
//   <AboutCompany />
// =============================================================================

import styles from "./styles/AboutCompany.module.css";

import WhoWeAre       from "./about/WhoWeAre";
import WhatWeOffer    from "./about/WhatWeOffer";
import WhyWeImportant from "./about/WhyWeImportant";

export default function AboutCompany() {
  return (
    <div className={styles.pageRoot}>
      <WhoWeAre />
      <WhatWeOffer />
      <WhyWeImportant />
    </div>
  );
}