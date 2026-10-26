// ============================================================
// SESSION PAYMENT RECORD STORAGE
// ============================================================

export interface PaymentRecord {
  amountPaid?: number;
  paymentId: string;
  orderId: string;
  paidAt: number;
  studentName: string;
  studentEmail: string;
  studentPhone: string;
}

const paymentKey = (courseId: number): string => `openroot:payment:${courseId}`;

export function savePaymentRecord(courseId: number, record: PaymentRecord): void {
  sessionStorage.setItem(paymentKey(courseId), JSON.stringify(record));
}

export function loadPaymentRecord(courseId: number): PaymentRecord | null {
  try {
    const raw = sessionStorage.getItem(paymentKey(courseId));
    if (!raw) return null;
    const value: unknown = JSON.parse(raw);
    if (
      typeof value === "object" && value !== null &&
      "paymentId" in value && typeof value.paymentId === "string" &&
      "orderId" in value && typeof value.orderId === "string" &&
      "paidAt" in value && typeof value.paidAt === "number" &&
      "studentName" in value && typeof value.studentName === "string" &&
      "studentEmail" in value && typeof value.studentEmail === "string" &&
      "studentPhone" in value && typeof value.studentPhone === "string" &&
      (!("amountPaid" in value) || typeof value.amountPaid === "number")
    ) return value as PaymentRecord;
    return null;
  } catch {
    return null;
  }
}

export function clearPaymentRecord(courseId: number): void {
  sessionStorage.removeItem(paymentKey(courseId));
}
