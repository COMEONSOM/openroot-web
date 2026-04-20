"use client";

import { useEffect } from "react";
import "../openrootClasses/OCStyle/OCFooter.css";

export default function Footer() {
  useEffect(() => {
    const scriptId = "linkedin-badge-script";

    if (document.getElementById(scriptId)) return;

    const script = document.createElement("script");
    script.id = scriptId;
    script.src = "https://platform.linkedin.com/badges/js/profile.js";
    script.async = true;
    script.defer = true;
    script.type = "text/javascript";

    document.body.appendChild(script);
  }, []);

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__content">
          <div className="footer__text-block">
            <h2 className="footer__title">Connect with me</h2>
            <p className="footer__description">
              Visit my LinkedIn profile to know more about my experience,
              projects, and background.
            </p>
          </div>

          <div className="footer__badge-wrap">
            <div
              className="badge-base LI-profile-badge"
              data-locale="en_US"
              data-size="large"
              data-theme="dark"
              data-type="VERTICAL"
              data-vanity="comeonsom"
              data-version="v1"
            >
              <a
                className="badge-base__link LI-simple-link"
                href="https://in.linkedin.com/in/comeonsom?trk=profile-badge"
                target="_blank"
                rel="noreferrer"
              >
                Somnath Banerjee
              </a>
            </div>
          </div>
        </div>

        <div className="footer__bottom">
          © {new Date().getFullYear()} Openroot Systems. All rights reserved.
        </div>
      </div>
    </footer>
  );
}