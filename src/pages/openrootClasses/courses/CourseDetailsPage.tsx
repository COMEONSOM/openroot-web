// ============================================================
// COURSE DETAILS ROUTE
// ============================================================

import { Helmet } from "react-helmet-async";
import { Link, useParams } from "react-router-dom";
import CourseFlowShell from "./components/CourseFlowShell";
import EnrollmentNotice from "./components/EnrollmentNotice";
import { buildCoursePath, getCourseByRouteParam } from "./data/courseData";
import "../OCStyle/OCCourseFlow.css";

export default function CourseDetailsPage() {
  const { courseSlug } = useParams();
  const course = getCourseByRouteParam(courseSlug);
  if (!course) return <main className="oc-course-flow"><div className="oc-course-flow__inner"><h1>Course not found</h1><Link to="/openroot-classes">Back to Openroot Classes</Link></div></main>;
  return (
    <>
      <Helmet><title>{course.name} – Details | Openroot Classes</title><meta name="description" content={`Explore the ${course.name} course at Openroot Classes.`} /></Helmet>
      <CourseFlowShell step="overview" backTo="/openroot-classes">
        <section className="course-details">
          <h1>{course.name}</h1>
          <p className="duration">{course.duration}</p>
          <div className="highlights-grid">{course.description.map((line, index) => <div key={index} className="highlight-card">✅ {line}</div>)}</div>
          <div className="price-and-pay"><span className="price">{course.priceLabel}</span><Link className="pay-button" to={buildCoursePath(course, "enroll")}>Enroll</Link><div className="trust-badges">🔒 Secure Payments • 💳 UPI / Cards • ✅ Refund Policy</div></div>
        </section>
        <EnrollmentNotice />
      </CourseFlowShell>
    </>
  );
}
