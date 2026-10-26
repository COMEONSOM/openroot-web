// ============================================================
// COURSE LIST CARD
// ============================================================

import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { Link } from "react-router-dom";
import type { Course } from "../data/courseData";
import { buildCoursePath } from "../data/courseData";
import "../../OCStyle/OCCourseCard.css";

interface Props {
  course: Course;
  animation: Record<string, unknown> | null | undefined;
  loading: boolean;
}

export default function CourseCard({ course, animation, loading }: Props) {
  return (
    <motion.li className="course-item premium-card" whileHover={{ y: -6, scale: 1.03 }} whileTap={{ scale: 0.98 }}>
      <Link className="course-card-link" to={buildCoursePath(course)} onClick={() => navigator.vibrate?.(30)}>
        <div className="course-thumbnail">
          {!loading && animation ? <Lottie animationData={animation} loop /> : (
            <div className="course-loading">Loading...</div>
          )}
        </div>
        <h4>{course.name}</h4>
        <p>{course.duration}</p>
        <span className="price-chip">{course.priceLabel}</span>
      </Link>
    </motion.li>
  );
}
