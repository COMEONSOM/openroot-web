// ============================================================
// COURSE ENROLLMENT ROUTE
// ============================================================

import { useCallback, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useParams } from "react-router-dom";
import CourseFlowShell from "./components/CourseFlowShell";
import EnrollmentNotice from "./components/EnrollmentNotice";
import { buildCoursePath, getCourseByRouteParam } from "./data/courseData";
import useRazorpayCheckout from "./hooks/useRazorpayCheckout";
import { savePaymentRecord } from "./lib/paymentStorage";
import "../OCStyle/OCCourseFlow.css";

interface FormErrors { name?: string; email?: string; phone?: string }

export default function CourseEnrollPage() {
  const { courseSlug } = useParams();
  const course = getCourseByRouteParam(courseSlug);
  const navigate = useNavigate();
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPhone, setStudentPhone] = useState("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const onSuccess = useCallback((record: Parameters<typeof savePaymentRecord>[1]) => {
    if (!course) return;
    savePaymentRecord(course.id, record);
    navigate(buildCoursePath(course, "payment-success"), { replace: true });
  }, [course, navigate]);
  const checkout = useRazorpayCheckout({ course: course ?? { id: 0, slug: "investing-finance", name: "", animationFile: "", description: [], duration: "", totalFee: 0, priceLabel: "" }, student: { name: studentName, email: studentEmail, phone: studentPhone }, onSuccess });

  if (!course) return <main className="oc-course-flow"><div className="oc-course-flow__inner"><h1>Course not found</h1><Link to="/openroot-classes">Back to Openroot Classes</Link></div></main>;

  const submit = (): void => {
    const errors: FormErrors = {};
    if (!studentName.trim()) errors.name = "Full name is required";
    if (!studentEmail.trim()) errors.email = "Email is required";
    else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(studentEmail.trim())) errors.email = "Enter a valid email";
    if (!studentPhone.trim()) errors.phone = "Phone number is required";
    else if (!/^[0-9]{10}$/.test(studentPhone.trim())) errors.phone = "Enter a valid 10-digit phone number";
    setFormErrors(errors);
    if (Object.keys(errors).length === 0) void checkout.startPayment();
  };

  return (
    <>
      <Helmet><title>{course.name} – Enroll | Openroot Classes</title><meta name="description" content={`Enter your details to enroll in ${course.name}.`} /></Helmet>
      <CourseFlowShell step="details" backTo={buildCoursePath(course)}>
        <section className="enroll-panel">
          <header className="enroll-heading"><div><h1>Student details</h1><p>We'll prefill your Razorpay checkout with these details and use them for course communication.</p></div><div className="enroll-course-summary"><strong>{course.name}</strong><span>{course.priceLabel}</span></div></header>
          <div className="enroll-fields">
            <div className="field"><label htmlFor="student-name">Full name</label><input id="student-name" type="text" value={studentName} onChange={(e) => setStudentName(e.target.value)} placeholder="Enter your full name" autoComplete="name" aria-invalid={Boolean(formErrors.name)} aria-describedby={formErrors.name ? "student-name-error" : undefined} />{formErrors.name && <span id="student-name-error" className="field-error">{formErrors.name}</span>}</div>
            <div className="field"><label htmlFor="student-email">Email address</label><input id="student-email" type="email" value={studentEmail} onChange={(e) => setStudentEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" aria-invalid={Boolean(formErrors.email)} aria-describedby={formErrors.email ? "student-email-error" : undefined} />{formErrors.email && <span id="student-email-error" className="field-error">{formErrors.email}</span>}</div>
            <div className="field"><label htmlFor="student-phone">Phone number</label><input id="student-phone" type="tel" value={studentPhone} onChange={(e) => setStudentPhone(e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile number" autoComplete="tel" inputMode="numeric" aria-invalid={Boolean(formErrors.phone)} aria-describedby={formErrors.phone ? "student-phone-error" : undefined} />{formErrors.phone && <span id="student-phone-error" className="field-error">{formErrors.phone}</span>}</div>
          </div>
          {checkout.error && <p className="payment-error" role="alert">{checkout.error}</p>}
          <div className="enroll-actions"><button type="button" className="modal-primary" onClick={submit} disabled={checkout.isPaying}>{checkout.isPaying ? "Processing..." : "Continue to payment"}</button></div>
        </section>
        <EnrollmentNotice />
      </CourseFlowShell>
    </>
  );
}
