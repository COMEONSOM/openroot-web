// ============================================================
// SHARED COURSE FLOW PAGE FRAME
// ============================================================

import React, { useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../../OCStyle/OCCourseFlow.css";

interface Props {
  step: "overview" | "details" | "payment";
  backTo: string;
  children: React.ReactNode;
}

export default function CourseFlowShell({ step, backTo, children }: Props) {
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => { window.scrollTo({ top: 0 }); }, [location.pathname]);
  const handleBack = (event: React.MouseEvent<HTMLAnchorElement>): void => {
    const modified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0;
    if (location.key !== "default" && !modified) {
      event.preventDefault();
      navigate(-1);
    }
  };
  return (
    <main className="oc-course-flow">
      <div className="oc-course-flow__inner">
        <Link className="back-button" to={backTo} onClick={handleBack}>← Back</Link>
        <nav className="course-stepper" aria-label="Enrollment progress">
          {(["Overview", "Details", "Payment"] as const).map((label) => {
            const key = label.toLowerCase() as typeof step;
            return <div key={label} className={step === key ? "step active" : "step"} aria-current={step === key ? "step" : undefined}>{label}</div>;
          })}
        </nav>
        {children}
      </div>
    </main>
  );
}
