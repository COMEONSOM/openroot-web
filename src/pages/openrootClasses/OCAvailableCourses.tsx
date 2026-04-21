import { useState, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import jsPDF from "jspdf";
import "../openrootClasses/OCStyle/OCAvailableCourses.css";

import FinanceLottie from "../../assets-oc/lotties/finance.json";
import PromptLottie from "../../assets-oc/lotties/prompt_course.json";
import logo from "../../assets-oc/open-root-light.png";
import msmeLogo from "../../assets-oc/msme-logo.png";

const API_URL =
  import.meta.env.VITE_API_URL || "https://openroot-classes.onrender.com";

const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID as
  | string
  | undefined;

// ─── Types ───────────────────────────────────────────────────────────────────

interface Course {
  id: number;
  name: string;
  animation: unknown;
  description: string[];
  duration: string;
  totalFee: number;
  priceLabel: string;
}

type ViewState = "list" | "details" | "success";

interface PaymentMeta {
  paymentId: string;
  orderId: string;
  paidAt: number;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  phone?: string;
}

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

interface RazorpayOptions {
  key: string | undefined;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: {
    name: string;
    email: string;
    contact: string;
  };
  handler: (response: RazorpayResponse) => Promise<void>;
  modal: {
    ondismiss: () => void;
  };
  theme: { color: string };
}

// Razorpay is loaded via CDN, so we extend the Window interface
declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => { open: () => void };
  }
}

// ─── Data ────────────────────────────────────────────────────────────────────

const COURSE_DATA = Object.freeze<Course[]>([
  {
    id: 1,
    name: "Investing & Finance",
    animation: FinanceLottie,
    description: [
      "Stock Market From Zero (Demat, Buy/Sell, Basics, Fundamentals)",
      "How to Research Companies & Analyze Stocks",
      "Mutual Funds, Gold & Smart Fixed Deposit Strategies",
      "Portfolio Building & Long-Term Wealth Planning",
      "AI Tools in Finance for Smarter Decisions",
      "Real-World Investing Mindset & Practical Frameworks",
    ],
    duration: "1 Month • 8 Classes • 2 Classes / Week",
    totalFee: 650,
    priceLabel: "Total Fee: ₹650 • One-Time Payment",
  },
  {
    id: 2,
    name: "Prompt Engineering",
    animation: PromptLottie,
    description: [
      "Prompt Engineering Basics — How to write clear prompts to control AI output",
      "AI Image Generation using ChatGPT, Gemini, Grok and other tools",
      "Image Editing with AI — background change, object removal, enhancement",
      "Text → Image → Video workflow and AI video generation pipeline",
      "Talking Characters and AI animated videos with audio integration",
      "AI Music and Sound generation for videos and content",
      "YouTube Content Creation — thumbnails, loop videos, animated shorts",
      "Professional Work Skills — Email writing, PPT, Resume, and documents using AI",
      "Building a Digital CV Website using HTML, CSS and JavaScript",
      "Using VS Code and understanding project structure",
      "GitHub basics — version control and publishing your code online",
      "Deploying your website live using GitHub Pages",
      "Introduction to React and modern web app structure",
      "Understanding databases, LocalStorage, and cloud basics (Firebase overview)",
      "Practical projects to build confidence with AI and web tools",
      "Career guidance — freelancing, content creation, tech learning path",
    ],
    duration: "1 Month • 8 Classes • 2 Classes / Week",
    totalFee: 850,
    priceLabel: "Total Fee: ₹850 • One-Time Payment",
  },
]);

// ─── Hook ─────────────────────────────────────────────────────────────────────

const useCourseLookup = () => {
  const map = useMemo(
    () => new Map<number, Course>(COURSE_DATA.map((c) => [c.id, c])),
    []
  );

  const getCourseById = useCallback(
    (id: number): Course | null => map.get(id) ?? null,
    [map]
  );

  return { getCourseById };
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function assetUrlToDataUrl(url: string): Promise<string> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to load asset: ${url}`);
  }

  const blob = await res.blob();

  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error(`Failed to read asset: ${url}`));
    reader.readAsDataURL(blob);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AvailableCourses() {
  const [viewState, setViewState] = useState<ViewState>("list");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isPaying, setIsPaying] = useState<boolean>(false);
  const [paymentMeta, setPaymentMeta] = useState<PaymentMeta | null>(null);

  const [isDetailsOpen, setIsDetailsOpen] = useState<boolean>(false);
  const [studentName, setStudentName] = useState<string>("");
  const [studentEmail, setStudentEmail] = useState<string>("");
  const [studentPhone, setStudentPhone] = useState<string>("");
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const { getCourseById } = useCourseLookup();
  const receiptRef = useRef<HTMLDivElement>(null);

  // ---------- COURSE CLICK ----------
  const handleCourseClick = useCallback(
    (id: number) => {
      const course = getCourseById(id);

      if (!course) {
        alert("Course not found");
        return;
      }

      setSelectedCourse(course);
      setViewState("details");
      navigator.vibrate?.(30);
    },
    [getCourseById]
  );

  // ---------- BACK ----------
  const handleBack = useCallback(() => {
    if (viewState === "details") {
      setSelectedCourse(null);
      setViewState("list");
    }
  }, [viewState]);

  // ---------- DETAILS MODAL ----------
  const openDetailsModal = () => {
    setFormErrors({});
    setIsDetailsOpen(true);
  };

  const closeDetailsModal = () => {
    if (isPaying) return;
    setIsDetailsOpen(false);
  };

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    if (!studentName.trim()) {
      errors.name = "Full name is required";
    }

    if (!studentEmail.trim()) {
      errors.email = "Email is required";
    } else if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(studentEmail.trim())) {
      errors.email = "Enter a valid email";
    }

    if (!studentPhone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^[0-9]{10}$/.test(studentPhone.trim())) {
      errors.phone = "Enter a valid 10-digit phone number";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ---------- PAYMENT ----------
  const handleConfirmDetailsAndPay = useCallback(async () => {
    if (!selectedCourse) return;
    if (!validateForm()) return;

    if (!RAZORPAY_KEY_ID) {
      alert("Missing Razorpay Key ID in Vite env. Set VITE_RAZORPAY_KEY_ID.");
      return;
    }

    setIsPaying(true);

    try {
      const createRes = await fetch(`${API_URL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: selectedCourse.totalFee,
          studentName,
          studentEmail,
          studentPhone,
        }),
      });

      if (!createRes.ok) {
        throw new Error(
          `Failed to create order: ${createRes.status} ${createRes.statusText}`
        );
      }

      const orderData: { id: string; amount: number } = await createRes.json();

      if (!orderData.id) {
        throw new Error("Order creation failed: no order id");
      }

      const options: RazorpayOptions = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Openroot Classes",
        description: selectedCourse.name,
        order_id: orderData.id,
        prefill: {
          name: studentName,
          email: studentEmail,
          contact: studentPhone,
        },
        handler: async (razorpayResponse: RazorpayResponse) => {
          try {
            const verifyRes = await fetch(`${API_URL}/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(razorpayResponse),
            });

            if (!verifyRes.ok) {
              throw new Error(
                `Verification failed: ${verifyRes.status} ${verifyRes.statusText}`
              );
            }

            const verifyData: { status: string; message?: string } =
              await verifyRes.json();

            if (verifyData.status === "success") {
              setPaymentMeta({
                paymentId: razorpayResponse.razorpay_payment_id,
                orderId: razorpayResponse.razorpay_order_id,
                paidAt: Date.now(),
                studentName,
                studentEmail,
                studentPhone,
              });

              setViewState("success");
              setIsDetailsOpen(false);
            } else {
              throw new Error(
                verifyData.message || "Payment verification unsuccessful"
              );
            }
          } catch (err) {
            const error = err as Error;
            console.error("VERIFY ERROR:", error);
            alert(
              "Payment verification failed: " + (error.message || "Unknown error")
            );
          } finally {
            setIsPaying(false);
          }
        },
        modal: {
          ondismiss: () => {
            setIsPaying(false);
          },
        },
        theme: { color: "#7c3aed" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      const error = err as Error;
      console.error("PAYMENT INIT ERROR:", error);
      alert(
        "Payment initialization failed: " + (error.message || "Unknown error")
      );
      setIsPaying(false);
    }
  }, [selectedCourse, studentName, studentEmail, studentPhone]);

  // ---------- PDF ----------
  const handleDownloadReceipt = async (): Promise<void> => {
    try {
      if (!selectedCourse) return;

      const pdf = new jsPDF("p", "pt", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();

      const primaryColor = "#7c3aed";
      const textMain = "#0f172a";
      const textMuted = "#64748b";

      const logoDataUrl = await assetUrlToDataUrl(logo);
      const msmeDataUrl = await assetUrlToDataUrl(msmeLogo);

      let y = 40;

      const logoWidth = 110;
      const logoHeight = 30;
      const logoX = (pageWidth - logoWidth) / 2;
      pdf.addImage(logoDataUrl, "PNG", logoX, y, logoWidth, logoHeight);

      y += 45;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(18);
      pdf.setTextColor(primaryColor);
      pdf.text("Openroot Classes", pageWidth / 2, y, { align: "center" });

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(textMuted);
      pdf.text("Payment Receipt / Tax Invoice", pageWidth / 2, y + 16, {
        align: "center",
      });

      pdf.setFontSize(9);
      pdf.setTextColor(textMain);
      const metaY = 40;
      pdf.text(
        `Invoice Date: ${new Date().toLocaleDateString()}`,
        pageWidth - 180,
        metaY
      );
      pdf.text(
        `Generated: ${new Date().toLocaleTimeString()}`,
        pageWidth - 180,
        metaY + 13
      );

      y += 42;

      pdf.setDrawColor(220);
      pdf.line(40, y, pageWidth - 40, y);

      y += 22;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("Billed To", 40, y);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.setTextColor(textMain);

      const nameLine = paymentMeta?.studentName || "NOT VERIFIED";
      const emailLine = paymentMeta?.studentEmail || "NOT VERIFIED";
      const phoneLine = paymentMeta?.studentPhone
        ? `Phone: ${paymentMeta.studentPhone}`
        : "";

      y += 18;
      pdf.text(nameLine, 40, y);
      y += 14;
      pdf.text(emailLine, 40, y);
      if (phoneLine) {
        y += 14;
        pdf.text(phoneLine, 40, y);
      }

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("Bill From", pageWidth - 180, y - 32);
      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.text("Openroot Systems", pageWidth - 180, y - 18);
      pdf.text("Kolkata, West Bengal", pageWidth - 180, y - 4);

      y += 40;

      pdf.setFillColor(124, 58, 237);
      pdf.setTextColor("#ffffff");
      const tableLeft = 40;
      const tableWidth = pageWidth - 80;
      const rowHeight = 28;
      pdf.rect(tableLeft, y, tableWidth, rowHeight, "F");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.text("Course", tableLeft + 10, y + 18);
      pdf.text("Course ID", tableLeft + 220, y + 18);
      pdf.text("Amount", tableLeft + tableWidth - 80, y + 18);

      y += rowHeight;

      pdf.setTextColor(textMain);
      pdf.setFillColor(248, 250, 252);
      pdf.rect(tableLeft, y, tableWidth, rowHeight, "F");

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(11);
      pdf.text(selectedCourse.name, tableLeft + 10, y + 18);
      pdf.text(String(selectedCourse.id), tableLeft + 230, y + 18);
      pdf.text(
        `₹${selectedCourse.totalFee}`,
        tableLeft + tableWidth - 80,
        y + 18
      );

      y += rowHeight + 24;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(12);
      pdf.text("Payment Details", 40, y);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);
      pdf.setTextColor(textMain);

      y += 18;
      pdf.text(`Payment ID: ${paymentMeta?.paymentId || "-"}`, 40, y);
      y += 14;
      pdf.text(`Order ID: ${paymentMeta?.orderId || "-"}`, 40, y);
      y += 14;
      pdf.text(
        `Paid On: ${
          paymentMeta?.paidAt
            ? new Date(paymentMeta.paidAt).toLocaleString()
            : new Date().toLocaleString()
        }`,
        40,
        y
      );

      const totalBoxWidth = 190;
      const totalBoxHeight = 60;
      const totalBoxX = pageWidth - totalBoxWidth - 40;
      const totalBoxY = y - 30;

      pdf.setDrawColor(124, 58, 237);
      pdf.setFillColor(248, 250, 252);
      pdf.rect(totalBoxX, totalBoxY, totalBoxWidth, totalBoxHeight, "FD");

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(11);
      pdf.setTextColor(textMuted);
      pdf.text("Total Paid", totalBoxX + 16, totalBoxY + 20);

      pdf.setFontSize(16);
      pdf.setTextColor(primaryColor);
      pdf.text(`₹${selectedCourse.totalFee}`, totalBoxX + 16, totalBoxY + 40);

      const footerY = 780;
      pdf.setDrawColor(230);
      pdf.line(40, footerY, pageWidth - 40, footerY);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(9);
      pdf.setTextColor(textMuted);
      pdf.text(
        "This is a system-generated receipt. For any queries, contact Openroot support.",
        pageWidth / 2,
        footerY + 14,
        { align: "center" }
      );

      const msmeSize = 60;
      const msmeX = (pageWidth - msmeSize) / 2;
      const msmeY = footerY - msmeSize - 8;
      pdf.addImage(msmeDataUrl, "PNG", msmeX, msmeY, msmeSize, msmeSize);

      pdf.save(`Openroot_Invoice_${paymentMeta?.paymentId || "payment"}.pdf`);
    } catch (err) {
      console.error("PDF error:", err);
      alert("Failed to generate PDF");
    }
  };

  // ---------- WHATSAPP SHARE ----------
  const handleShareWhatsapp = useCallback(() => {
    if (!selectedCourse || !paymentMeta) return;

    const msg =
      `Hi, I have completed the payment for "${selectedCourse.name}".\n` +
      `Payment ID: ${paymentMeta.paymentId}\n` +
      `Order ID: ${paymentMeta.orderId}\n` +
      `Amount: ₹${selectedCourse.totalFee}\n` +
      `Student Name: ${paymentMeta.studentName}\n` +
      `Student Email: ${paymentMeta.studentEmail}\n` +
      `Student Phone: ${paymentMeta.studentPhone || "-"}\n\n` +
      `Please confirm my enrollment and guide me on next steps.`;

    const encoded = encodeURIComponent(msg);
    const phone = "917866049865";
    const url = `https://wa.me/${phone}?text=${encoded}`;
    window.open(url, "_blank", "noopener,noreferrer");
  }, [selectedCourse, paymentMeta]);

  // ─── JSX ──────────────────────────────────────────────────────────────────

  return (
    <div className="courses-section-wrapper">
      <div id="available-courses" className="courses-container">
        <h2>🚀 Available Courses</h2>

        <div className="course-stepper">
          <div className={viewState === "list" ? "step active" : "step"}>
            Explore
          </div>
          <div className={viewState === "details" ? "step active" : "step"}>
            Overview
          </div>
          <div className={viewState === "success" ? "step active" : "step"}>
            Payment
          </div>
        </div>

        {/* LIST */}
        {viewState === "list" && (
          <ul className="course-list">
            {COURSE_DATA.map((course) => (
              <motion.li
                key={course.id}
                className="course-item premium-card"
                whileHover={{ y: -6, scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleCourseClick(course.id)}
              >
                <Lottie
                  animationData={course.animation}
                  loop
                  className="course-thumbnail"
                />
                <h4>{course.name}</h4>
                <p>{course.duration}</p>
                <span className="price-chip">💰 {course.priceLabel}</span>
              </motion.li>
            ))}
          </ul>
        )}

        {/* DETAILS */}
        <AnimatePresence>
          {viewState === "details" && selectedCourse && (
            <motion.section
              className="course-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <button className="back-button" onClick={handleBack}>
                ← Back
              </button>

              <h3>{selectedCourse.name}</h3>
              <p className="duration">{selectedCourse.duration}</p>

              <div className="highlights-grid">
                {selectedCourse.description.map((line, i) => (
                  <motion.div
                    key={i}
                    className="highlight-card"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    ✅ {line}
                  </motion.div>
                ))}
              </div>

              <div className="price-and-pay">
                <button className="price">💰 {selectedCourse.priceLabel}</button>

                <motion.button
                  className="pay-button glowing"
                  onClick={openDetailsModal}
                  disabled={isPaying}
                  whileHover={{ scale: 1.08 }}
                >
                  {isPaying ? "Processing..." : "🔒 Secure Checkout"}
                </motion.button>

                <div className="trust-badges">
                  🔒 Secure Payments • 💳 UPI / Cards • ✅ Refund Policy
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* DETAILS MODAL */}
        <AnimatePresence>
          {isDetailsOpen && (
            <motion.div
              className="modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="checkout-modal"
                initial={{ opacity: 0, y: 16, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
              >
                <div className="modal-header">
                  <h4>Student details</h4>
                  <button
                    type="button"
                    className="modal-close"
                    onClick={closeDetailsModal}
                    disabled={isPaying}
                  >
                    ✕
                  </button>
                </div>

                <p className="modal-subtitle">
                  We'll prefill your Razorpay checkout with these details and use
                  them for course communication.
                </p>

                <div className="modal-body">
                  <div className="field">
                    <label>Full name</label>
                    <input
                      type="text"
                      value={studentName}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setStudentName(e.target.value)
                      }
                      placeholder="Enter your full name"
                    />
                    {formErrors.name && (
                      <span className="field-error">{formErrors.name}</span>
                    )}
                  </div>

                  <div className="field">
                    <label>Email address</label>
                    <input
                      type="email"
                      value={studentEmail}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setStudentEmail(e.target.value)
                      }
                      placeholder="you@example.com"
                    />
                    {formErrors.email && (
                      <span className="field-error">{formErrors.email}</span>
                    )}
                  </div>

                  <div className="field">
                    <label>Phone number</label>
                    <input
                      type="tel"
                      value={studentPhone}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setStudentPhone(e.target.value)
                      }
                      placeholder="10-digit mobile number"
                    />
                    {formErrors.phone && (
                      <span className="field-error">{formErrors.phone}</span>
                    )}
                  </div>
                </div>

                <div className="modal-footer">
                  <button
                    type="button"
                    className="modal-secondary"
                    onClick={closeDetailsModal}
                    disabled={isPaying}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="modal-primary"
                    onClick={handleConfirmDetailsAndPay}
                    disabled={isPaying}
                  >
                    {isPaying ? "Processing..." : "Continue to payment"}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* SUCCESS + RECEIPT */}
        <AnimatePresence>
          {viewState === "success" && selectedCourse && (
            <motion.section
              className="qr-section"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
            >
              <h3>Payment Successful!</h3>
              <p>
                You successfully enrolled in{" "}
                <strong>{selectedCourse.name}</strong>
              </p>
              <p className="motivator">Welcome to Openroot 🚀</p>

              <div className="qr-section-inner">
                <div id="receipt-card" className="receipt-card" ref={receiptRef}>
                  <div className="receipt-header">
                    <div>
                      <h4>Payment Receipt</h4>
                      <span>Openroot Classes</span>
                    </div>
                    <div className="receipt-badge">PAID</div>
                  </div>

                  <div className="receipt-section">
                    <div className="receipt-section-row">
                      <span>Student name</span>
                      <strong>{paymentMeta?.studentName || "Student"}</strong>
                    </div>
                    <div className="receipt-section-row">
                      <span>Student email</span>
                      <strong>{paymentMeta?.studentEmail || "-"}</strong>
                    </div>
                    <div className="receipt-section-row">
                      <span>Phone</span>
                      <strong>{paymentMeta?.studentPhone || "-"}</strong>
                    </div>
                  </div>

                  <div className="receipt-section">
                    <div className="receipt-section-row">
                      <span>Course</span>
                      <strong>{selectedCourse.name}</strong>
                    </div>
                    <div className="receipt-section-row">
                      <span>Course ID</span>
                      <strong>#{selectedCourse.id}</strong>
                    </div>
                    <div className="receipt-section-row">
                      <span>Amount paid</span>
                      <strong>₹{selectedCourse.totalFee}</strong>
                    </div>
                  </div>

                  <div className="receipt-section">
                    <div className="receipt-section-row">
                      <span>Payment ID</span>
                      <code>{paymentMeta?.paymentId || "-"}</code>
                    </div>
                    <div className="receipt-section-row">
                      <span>Order ID</span>
                      <code>{paymentMeta?.orderId || "-"}</code>
                    </div>
                    <div className="receipt-section-row">
                      <span>Date</span>
                      <strong>
                        {paymentMeta?.paidAt
                          ? new Date(paymentMeta.paidAt).toLocaleString()
                          : new Date().toLocaleString()}
                      </strong>
                    </div>
                  </div>

                  <div className="receipt-footer">
                    Thank you for learning with us!
                  </div>
                </div>

                <div className="receipt-actions">
                  <button onClick={handleDownloadReceipt}>
                    ⬇️ Download Receipt (PDF)
                  </button>
                  <button onClick={handleShareWhatsapp}>
                    📲 Share Payment Proof on WhatsApp
                  </button>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}