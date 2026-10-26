// ============================================================
// PAYMENT SUCCESS ROUTE
// ============================================================

import { useCallback, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate, useNavigate, useParams } from "react-router-dom";
import CourseFlowShell from "./components/CourseFlowShell";
import ReceiptCard from "./components/ReceiptCard";
import { buildCoursePath, getCourseByRouteParam } from "./data/courseData";
import { clearPaymentRecord, loadPaymentRecord } from "./lib/paymentStorage";
import { downloadReceipt } from "./lib/receiptPdf";
import "../OCStyle/OCCourseFlow.css";

export default function CoursePaymentSuccessPage() {
  const { courseSlug } = useParams();
  const course = getCourseByRouteParam(courseSlug);
  const navigate = useNavigate();
  const [pdfError, setPdfError] = useState("");
  const payment = course ? loadPaymentRecord(course.id) : null;
  const backToCourses = useCallback(() => {
    if (course) clearPaymentRecord(course.id);
    navigate("/openroot-classes");
  }, [course, navigate]);

  if (!course) return <main className="oc-course-flow"><div className="oc-course-flow__inner"><h1>Course not found</h1><Link to="/openroot-classes">Back to Openroot Classes</Link></div></main>;
  if (!payment) return <Navigate to={buildCoursePath(course)} replace />;

  const handleDownloadReceipt = async (): Promise<void> => {
    setPdfError("");
    try {
      await downloadReceipt(course, payment);
    } catch (error) {
      console.error("PDF error:", error);
      const reason = error instanceof Error ? error.message : "Unknown error";
      setPdfError(`Failed to generate PDF: ${reason}`);
    }
  };

  const shareWhatsapp = (): void => {
    const message =
      `Hi, I have completed the payment for "${course.name}".\n` +
      `Payment ID: ${payment.paymentId}\n` +
      `Order ID: ${payment.orderId}\n` +
      `Amount: ₹${course.totalFee}\n` +
      `Student Name: ${payment.studentName}\n` +
      `Student Email: ${payment.studentEmail}\n` +
      `Student Phone: ${payment.studentPhone || "-"}\n\n` +
      "Please confirm my enrollment and guide me on next steps.";
    window.open(`https://wa.me/917866049865?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  };

  return (
    <>
      <Helmet><title>{course.name} – Payment Successful | Openroot Classes</title><meta name="description" content={`Payment receipt for ${course.name} at Openroot Classes.`} /></Helmet>
      <CourseFlowShell step="payment" backTo={buildCoursePath(course)}>
        <section className="qr-section">
          <h1>Payment Successful!</h1>
          <p>You successfully enrolled in <strong>{course.name}</strong></p>
          <p className="motivator">Welcome to Openroot Classes!</p>
          <div className="qr-section-inner"><ReceiptCard course={course} payment={payment} /></div>
          {pdfError && <p className="receipt-error" role="alert">{pdfError}</p>}
          <div className="receipt-actions">
            <button type="button" onClick={backToCourses}>← Back to Courses</button>
            <button type="button" onClick={() => void handleDownloadReceipt()}>⬇️ Download Receipt (PDF)</button>
            <button type="button" onClick={shareWhatsapp}>📲 Share Payment Proof on WhatsApp</button>
          </div>
        </section>
      </CourseFlowShell>
    </>
  );
}
