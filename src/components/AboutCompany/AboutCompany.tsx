// src/components/AboutCompany/AboutCompany.jsx
import React, { memo } from "react";
import { Helmet, HelmetProvider } from "@dr.pogodin/react-helmet";
import styles from "./styles-ac-section/AboutCompany.module.css";

// Sections
import WhoWeAre from "./Sections/WhoWeAre";
import OfferClasses from "./Sections/OfferClasses";
import OfferSoftware from "./Sections/OfferSoftware";
import WhyChooseOpenroot from "./Sections/WhyChooseOpenroot";
import OurMission from "./Sections/OurMission";

function AboutCompany() {
  return (
    <>
      <Helmet>
        <title>About Openroot | Empowering Students & Small Businesses</title>
      </Helmet>

      <section id="about-company" className={styles.aboutCompanyRoot}>
        <div className={styles.innerWrapper}>
          <WhoWeAre />
          <OfferClasses />
          <OfferSoftware />
          <WhyChooseOpenroot />
          <OurMission />
        </div>
      </section>
    </>
  );
}

export default memo(AboutCompany);
