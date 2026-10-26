// ============================================================
// SHARED INVITATION-ONLY NOTICE
// ============================================================

import { useLocation } from "react-router-dom";
import "../../OCStyle/OCEnrollmentNotice.css";

const BANNER_SECTION_ID = "banner-section";

export default function EnrollmentNotice() {
  const location = useLocation();
  const isHome = location.pathname === "/openroot-classes";

  const handleHomeClick = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    const target = document.getElementById(BANNER_SECTION_ID);
    if (!target) return;
    event.preventDefault();
    target.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
      block: "start",
    });
    window.history.replaceState(null, "", `#${BANNER_SECTION_ID}`);
  };

  return (
    <aside className="enrollment-notice" role="note" aria-label="Enrollment notice">
      <h3 className="enrollment-notice__title">Important Notice: Invitation-Only Courses</h3>
      <p>
        The courses listed are advanced, in-depth programs and are <strong>not open for direct enrollment</strong>. They are offered by
        invitation only, to students who have completed our foundational short courses and whom we have approached directly.
      </p>
      <p>
        Because this content is updated regularly to reflect market conditions and new technology, we begin with our short courses. Please follow our{" "}
        <a
          href={isHome ? `#${BANNER_SECTION_ID}` : `/openroot-classes#${BANNER_SECTION_ID}`}
          className="enrollment-notice__link"
          onClick={isHome ? handleHomeClick : undefined}
        >
          banner section for the latest offerings.
        </a>
      </p>
      <p className="enrollment-notice__refund">
        If you have already made a payment without an invitation, we will verify it against our records. If you are not eligible, your payment will be{" "}
        <strong>fully refunded within 7 days</strong>.
      </p>
    </aside>
  );
}
