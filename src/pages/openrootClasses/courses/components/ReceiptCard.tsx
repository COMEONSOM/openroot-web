// ============================================================
// PAYMENT RECEIPT CARD
// ============================================================

import type { Course } from "../data/courseData";
import type { PaymentRecord } from "../lib/paymentStorage";

export default function ReceiptCard({ course, payment }: { course: Course; payment: PaymentRecord }) {
  return (
    <div id="receipt-card" className="receipt-card">
      <div className="receipt-header"><div><h2>Payment Receipt</h2><span>Openroot Classes</span></div><div className="receipt-badge">PAID</div></div>
      <div className="receipt-section"><div className="receipt-section-row"><span>Student name</span><strong>{payment.studentName || "Student"}</strong></div><div className="receipt-section-row"><span>Student email</span><strong>{payment.studentEmail || "-"}</strong></div><div className="receipt-section-row"><span>Phone</span><strong>{payment.studentPhone || "-"}</strong></div></div>
      <div className="receipt-section"><div className="receipt-section-row"><span>Course</span><strong>{course.name}</strong></div><div className="receipt-section-row"><span>Course ID</span><strong>#{course.id}</strong></div><div className="receipt-section-row"><span>Amount paid</span><strong>₹{course.totalFee}</strong></div></div>
      <div className="receipt-section"><div className="receipt-section-row"><span>Payment ID</span><code>{payment.paymentId || "-"}</code></div><div className="receipt-section-row"><span>Order ID</span><code>{payment.orderId || "-"}</code></div><div className="receipt-section-row"><span>Date</span><strong>{new Date(payment.paidAt).toLocaleString()}</strong></div></div>
      <div className="receipt-footer">Thank you for learning with us!</div>
    </div>
  );
}
