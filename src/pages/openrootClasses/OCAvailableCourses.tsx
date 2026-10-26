// ============================================================
// AVAILABLE COURSES LIST
// ============================================================

import { useEffect } from "react";
import { COURSE_DATA } from "./courses/data/courseData";
import CourseCard from "./courses/components/CourseCard";
import EnrollmentNotice from "./courses/components/EnrollmentNotice";
import useCourseAnimations from "./courses/hooks/useCourseAnimations";
import "./OCStyle/OCAvailableCourses.css";

export default function AvailableCourses() {
  const { animations, loading } = useCourseAnimations();

  useEffect(() => {
    if (window.location.hash !== "#banner-section") return;
    requestAnimationFrame(() => document.getElementById("banner-section")?.scrollIntoView());
  }, []);

  return (
    <div className="courses-section-wrapper">
      <div id="available-courses" className="courses-container">
        <h2>Specialized Programs</h2>
        <EnrollmentNotice />
        <ul className="course-list">
          {COURSE_DATA.map((course) => <CourseCard key={course.id} course={course} animation={animations[course.animationFile]} loading={loading} />)}
        </ul>
      </div>
    </div>
  );
}
