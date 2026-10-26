// ============================================================
// RAZORPAY CHECKOUT
// ============================================================

import { useCallback, useRef, useState } from "react";
import type { Course } from "../data/courseData";
import type { PaymentRecord } from "../lib/paymentStorage";

const API_URL = import.meta.env.VITE_API_URL || "https://openroot-systems.onrender.com";
const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID as string | undefined;
const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";
const RAZORPAY_SCRIPT_TIMEOUT_MS = 15000;

interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  prefill: { name: string; email: string; contact: string };
  handler: (response: RazorpayResponse) => Promise<void>;
  modal: { ondismiss: () => void };
  theme: { color: string };
}
interface RazorpayInstance { open: () => void; close?: () => void }
interface RazorpayConstructor { new (options: RazorpayOptions): RazorpayInstance }
declare global { interface Window { Razorpay?: RazorpayConstructor } }

let razorpayScriptPromise: Promise<boolean> | null = null;

function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === "undefined") return Promise.resolve(false);
  if (window.Razorpay) return Promise.resolve(true);
  if (razorpayScriptPromise) return razorpayScriptPromise;
  razorpayScriptPromise = new Promise<boolean>((resolve) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    const finish = (ok: boolean): void => resolve(ok);
    if (existing) {
      const started = Date.now();
      const timer = window.setInterval(() => {
        if (window.Razorpay) { window.clearInterval(timer); finish(true); }
        else if (Date.now() - started > RAZORPAY_SCRIPT_TIMEOUT_MS) { window.clearInterval(timer); finish(false); }
      }, 100);
      existing.addEventListener("load", () => { if (window.Razorpay) { window.clearInterval(timer); finish(true); } });
      existing.addEventListener("error", () => { window.clearInterval(timer); finish(false); });
      return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    const timeoutId = window.setTimeout(() => finish(false), RAZORPAY_SCRIPT_TIMEOUT_MS);
    script.onload = () => { window.clearTimeout(timeoutId); finish(Boolean(window.Razorpay)); };
    script.onerror = () => { window.clearTimeout(timeoutId); finish(false); };
    document.body.appendChild(script);
  }).finally(() => {
    if (window.Razorpay) return true;
    razorpayScriptPromise = null;
    return false;
  });
  return razorpayScriptPromise;
}

interface StudentDetails { name: string; email: string; phone: string }
interface Props { course: Course; student: StudentDetails; onSuccess: (record: PaymentRecord) => void }

export default function useRazorpayCheckout({ course, student, onSuccess }: Props) {
  const [isPaying, setIsPaying] = useState(false);
  const [error, setError] = useState("");
  const paymentLockRef = useRef(false);

  const startPayment = useCallback(async () => {
    if (paymentLockRef.current) return;
    if (!RAZORPAY_KEY_ID) {
      alert("Missing Razorpay Key ID in Vite env. Set VITE_RAZORPAY_KEY_ID.");
      return;
    }
    paymentLockRef.current = true;
    setIsPaying(true);
    setError("");
    try {
      const sdkLoaded = await loadRazorpayScript();
      if (!sdkLoaded || !window.Razorpay) throw new Error("Razorpay SDK failed to load. Check network, ad blocker, or Content Security Policy.");
      const createRes = await fetch(`${API_URL}/create-order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: course.totalFee, studentName: student.name.trim(), studentEmail: student.email.trim(), studentPhone: student.phone.trim() }),
      });
      if (!createRes.ok) throw new Error(`Failed to create order: ${createRes.status} ${createRes.statusText}`);
      const orderData: { id: string; amount: number } = await createRes.json();
      if (!orderData.id) throw new Error("Order creation failed: no order id");
      const options: RazorpayOptions = {
        key: RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: "INR",
        name: "Openroot Classes",
        description: course.name,
        order_id: orderData.id,
        prefill: { name: student.name.trim(), email: student.email.trim(), contact: student.phone.trim() },
        handler: async (response) => {
          try {
            const verifyRes = await fetch(`${API_URL}/verify-payment`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response),
            });
            if (!verifyRes.ok) throw new Error(`Verification failed: ${verifyRes.status} ${verifyRes.statusText}`);
            const verifyData: { status: string; message?: string } = await verifyRes.json();
            if (verifyData.status !== "success") throw new Error(verifyData.message || "Payment verification unsuccessful");
            onSuccess({ amountPaid: orderData.amount / 100, paymentId: response.razorpay_payment_id, orderId: response.razorpay_order_id, paidAt: Date.now(), studentName: student.name.trim(), studentEmail: student.email.trim(), studentPhone: student.phone.trim() });
          } catch (err) {
            const reason = err instanceof Error ? err.message : "Unknown error";
            console.error("VERIFY ERROR:", err);
            setError(`Payment verification failed: ${reason}`);
          } finally {
            paymentLockRef.current = false;
            setIsPaying(false);
          }
        },
        modal: { ondismiss: () => { paymentLockRef.current = false; setIsPaying(false); setError("Payment was cancelled. Your details are saved; you can try again."); } },
        theme: { color: "#7c3aed" },
      };
      new window.Razorpay(options).open();
    } catch (err) {
      const reason = err instanceof Error ? err.message : "Unknown error";
      console.error("PAYMENT INIT ERROR:", err);
      setError(`Payment initialization failed: ${reason}`);
      paymentLockRef.current = false;
      setIsPaying(false);
    }
  }, [course, student, onSuccess]);

  return { startPayment, isPaying, error };
}
