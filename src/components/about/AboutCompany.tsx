import OurServices from "./OurServices";
import Mission from "./Mission";
import About from "./About";
import styles from "./AboutCompany.module.css";

export default function AboutCompany() {
  return (
    <section className={styles.wrap} aria-label="About Openroot">
      <div className="ac-band ac-band-services">
        <div className="ac-services-glow" aria-hidden="true" />
        <div className="ac-services-line" aria-hidden="true" />
        <OurServices />
      </div>

      <div className="ac-band ac-band-about">
        <svg
          className="ac-curve-top"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,96 C220,20 470,8 720,36 C1010,68 1220,110 1440,64 L1440,0 L0,0 Z" />
        </svg>

        <About />

        <svg
          className="ac-curve-bottom"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path d="M0,68 C270,118 500,84 720,44 C985,-2 1210,-2 1440,42 L1440,120 L0,120 Z" />
        </svg>
      </div>

      <div className="ac-band ac-band-mission">
        <div className="ac-mission-grid" aria-hidden="true" />
        <Mission />
      </div>
    </section>
  );
}