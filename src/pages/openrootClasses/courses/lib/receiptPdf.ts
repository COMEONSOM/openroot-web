// ============================================================
// PDF RECEIPT GENERATION — "ENROLLMENT PASS" DESIGN
// - Bold flat colour blocks (Royal Blue, yellow, mint, coral, black)
// - Hard offset "sticker" shadows, tilted PAID stamp
// - Ticket-style pass card with a tear-off total stub
// - Clean white details section, so it stays easy to read and print
// Uses only built-in PDF fonts (Helvetica, Courier): no font files needed.
// ============================================================

import type { Course } from "../data/courseData";
import type { PaymentRecord } from "./paymentStorage";
import msmeLogo from "../../../../assets-oc/msme-logo.avif";

const logo = "/assets/openroot-black-nobg.png";

// ============================================================
// IMAGE HELPERS (unchanged)
// ============================================================

async function imageUrlToPngDataUrl(
  url: string,
  maxWidth: number,
  maxHeight: number
): Promise<string> {
  const image = new Image();
  if (typeof image.decode === "function") {
    image.src = url;
    await image.decode();
  } else {
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error(`Failed to load image: ${url}`));
      image.src = url;
    });
  }

  if (!image.naturalWidth || !image.naturalHeight) {
    throw new Error(`Image has no dimensions: ${url}`);
  }

  const canvas = document.createElement("canvas");
  const scale = Math.min(1, maxWidth / image.naturalWidth, maxHeight / image.naturalHeight);
  canvas.width = Math.max(1, Math.round(image.naturalWidth * scale));
  canvas.height = Math.max(1, Math.round(image.naturalHeight * scale));
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not create a canvas context for the PDF logo");
  context.drawImage(image, 0, 0, canvas.width, canvas.height);

  const dataUrl = canvas.toDataURL("image/png");
  if (!dataUrl.startsWith("data:image/png;base64,")) {
    throw new Error("Could not convert image to PNG");
  }
  return dataUrl;
}

async function loadOptionalLogo(
  url: string,
  maxWidth: number,
  maxHeight: number
): Promise<string | null> {
  try {
    return await imageUrlToPngDataUrl(url, maxWidth, maxHeight);
  } catch (error) {
    console.error("PDF logo could not be loaded or converted:", url, error);
    return null;
  }
}

// ============================================================
// FORMAT HELPERS
// Dates are built by hand: locale formatting can insert special
// space characters that the built-in PDF fonts cannot print.
// ============================================================

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const pad2 = (n: number): string => String(n).padStart(2, "0");

const formatDate = (ms: number): string => {
  const d = new Date(ms);
  return `${pad2(d.getDate())} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
};

const formatTime = (ms: number): string => {
  const d = new Date(ms);
  return `${pad2(d.getHours())}:${pad2(d.getMinutes())}`;
};

const formatAmount = (n: number): string => n.toLocaleString("en-IN");

const firstNameOf = (fullName: string): string => {
  const first = fullName.trim().split(/\s+/)[0] ?? "";
  if (!first) return "";
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
};

// ============================================================
// DESIGN TOKENS
// ============================================================

const C = {
  ink: "#0B0B0F",
  blue: "#4169E1",
  blueSoft: "#7794EC",
  yellow: "#FFE600",
  mint: "#35D3A1",
  coral: "#FF6B4A",
  white: "#FFFFFF",
  muted: "#5B5F6B",
  line: "#B9BCC6",
} as const;

type Point = [number, number];

// ============================================================
// MAIN
// ============================================================

export async function downloadReceipt(
  course: Course | null | undefined,
  payment: PaymentRecord | null | undefined
): Promise<void> {
  const { jsPDF: JsPDF } = await import("jspdf");
  const pdf = new JsPDF("p", "pt", "a4");
  const W = pdf.internal.pageSize.getWidth();
  const H = pdf.internal.pageSize.getHeight();
  const M = 36; // page margin

  // ── data (same safety checks as before) ───────────────────
  const courseName = typeof course?.name === "string" && course.name.trim() ? course.name : "Course";
  const courseId = Number.isFinite(course?.id) ? String(course?.id) : "-";
  const courseFee = Number.isFinite(course?.totalFee) && (course?.totalFee ?? 0) >= 0 ? course?.totalFee ?? 0 : 0;
  const amountPaid = Number.isFinite(payment?.amountPaid) && (payment?.amountPaid ?? 0) >= 0
    ? payment?.amountPaid ?? 0
    : courseFee;
  const studentName = payment?.studentName || "NOT VERIFIED";
  const studentEmail = payment?.studentEmail || "NOT VERIFIED";
  const studentPhone = payment?.studentPhone || "";
  const paymentId = payment?.paymentId || "-";
  const orderId = payment?.orderId || "-";
  const paidAt = Number.isFinite(payment?.paidAt) && (payment?.paidAt ?? 0) > 0
    ? payment?.paidAt ?? Date.now()
    : Date.now();

  const greetingName = payment?.studentName ? firstNameOf(payment.studentName) : "";
  const durationParts = (course?.duration ?? "")
    .split("\u2022")
    .map((part) => part.trim())
    .filter(Boolean);

  const [logoDataUrl, msmeDataUrl] = await Promise.all([
    loadOptionalLogo(logo, 440, 120),
    loadOptionalLogo(msmeLogo, 240, 240),
  ]);

  // ── drawing helpers ───────────────────────────────────────
  const setText = (
    size: number,
    color: string,
    style: "bold" | "normal" = "bold",
    font: "helvetica" | "courier" = "helvetica"
  ): void => {
    pdf.setFont(font, style);
    pdf.setFontSize(size);
    pdf.setTextColor(color);
  };

  const textWidth = (
    str: string,
    size: number,
    style: "bold" | "normal" = "bold",
    font: "helvetica" | "courier" = "helvetica"
  ): number => {
    pdf.setFont(font, style);
    pdf.setFontSize(size);
    return pdf.getTextWidth(str);
  };

  /** shrinks the font until the text fits the width */
  const fitSize = (
    str: string,
    maxWidth: number,
    startSize: number,
    minSize: number,
    style: "bold" | "normal" = "bold",
    font: "helvetica" | "courier" = "helvetica"
  ): number => {
    let size = startSize;
    while (size > minSize && textWidth(str, size, style, font) > maxWidth) size -= 0.5;
    return size;
  };

  /** rectangle with optional hard offset shadow ("sticker" look) */
  const box = (
    x: number,
    y: number,
    w: number,
    h: number,
    fill: string,
    opts: { shadow?: number; lw?: number; radius?: number; stroke?: string | null } = {}
  ): void => {
    const { shadow = 0, lw = 1.5, radius = 0, stroke = C.ink } = opts;
    if (shadow > 0) {
      pdf.setFillColor(C.ink);
      if (radius) pdf.roundedRect(x + shadow, y + shadow, w, h, radius, radius, "F");
      else pdf.rect(x + shadow, y + shadow, w, h, "F");
    }
    pdf.setFillColor(fill);
    if (stroke) {
      pdf.setDrawColor(stroke);
      pdf.setLineWidth(lw);
    }
    const style = stroke ? "FD" : "F";
    if (radius) pdf.roundedRect(x, y, w, h, radius, radius, style);
    else pdf.rect(x, y, w, h, style);
  };

  /** closed polygon from absolute points */
  const polygon = (points: Point[], style: "F" | "FD"): void => {
    const [first, ...rest] = points;
    const segments = rest.map((point, i) => {
      const prev = i === 0 ? first : rest[i - 1];
      return [point[0] - prev[0], point[1] - prev[1]];
    });
    pdf.lines(segments, first[0], first[1], [1, 1], style, true);
  };

  /** keeps the image's real proportions inside a box */
  const placeImage = (dataUrl: string, x: number, y: number, boxW: number, boxH: number): void => {
    let w = boxW;
    let h = boxH;
    try {
      const props = pdf.getImageProperties(dataUrl);
      const scale = Math.min(boxW / props.width, boxH / props.height);
      w = props.width * scale;
      h = props.height * scale;
    } catch {
      // keep the box size if the image size cannot be read
    }
    pdf.addImage(dataUrl, "PNG", x + (boxW - w) / 2, y + (boxH - h) / 2, w, h);
  };

  /** tilted PAID stamp with a hard shadow */
  const drawStamp = (cx: number, cy: number, w: number, h: number, deg: number, label: string): void => {
    const th = (deg * Math.PI) / 180;
    const u: Point = [Math.cos(th), -Math.sin(th)]; // along the text
    const d: Point = [Math.sin(th), Math.cos(th)]; // "down" in text space
    const corner = (a: number, b: number, ox: number, oy: number): Point => [
      cx + ox + a * u[0] + b * d[0],
      cy + oy + a * u[1] + b * d[1],
    ];
    const shape = (ox: number, oy: number): Point[] => [
      corner(-w / 2, -h / 2, ox, oy),
      corner(w / 2, -h / 2, ox, oy),
      corner(w / 2, h / 2, ox, oy),
      corner(-w / 2, h / 2, ox, oy),
    ];

    pdf.setFillColor(C.ink);
    polygon(shape(5, 5), "F");
    pdf.setFillColor(C.mint);
    pdf.setDrawColor(C.ink);
    pdf.setLineWidth(2.5);
    polygon(shape(0, 0), "FD");

    const size = 30;
    const tw = textWidth(label, size);
    setText(size, C.ink);
    pdf.text(label, cx - (tw / 2) * u[0] + 0.35 * size * d[0], cy - (tw / 2) * u[1] + 0.35 * size * d[1], {
      angle: deg,
    });
  };

  // ============================================================
  // 1. HERO BAND
  // ============================================================

  const BAND_H = 280;

  pdf.setFillColor(C.blue);
  pdf.rect(0, 0, W, BAND_H, "F");
  pdf.setFillColor(C.ink);
  pdf.rect(0, BAND_H, W, 3, "F");

  // decoration: yellow circle, coral dot, dot grid, diagonal hatch
  pdf.setFillColor(C.yellow);
  pdf.setDrawColor(C.ink);
  pdf.setLineWidth(2);
  pdf.circle(W - 58, 50, 74, "FD");

  pdf.setFillColor(C.coral);
  pdf.setLineWidth(1.5);
  pdf.circle(W - 190, 42, 13, "FD");

  pdf.setFillColor(C.blueSoft);
  for (let col = 0; col < 8; col += 1) {
    for (let row = 0; row < 4; row += 1) {
      pdf.circle(232 + col * 14, 38 + row * 14, 1.7, "F");
    }
  }

  pdf.setDrawColor(C.blueSoft);
  pdf.setLineWidth(1.4);
  for (let x = W - 235; x < W - 40; x += 12) {
    pdf.line(x, 238, x + 34, 196);
  }

  // logo on a white sticker
  box(M, 28, 150, 44, C.white, { shadow: 4, lw: 1.5 });
  if (logoDataUrl) placeImage(logoDataUrl, M + 14, 28 + 9, 122, 26);

  // label pill
  const pillText = "ENROLLMENT RECEIPT";
  const pillW = textWidth(pillText, 8.5) + 26;
  pdf.setDrawColor(C.white);
  pdf.setLineWidth(1.2);
  pdf.roundedRect(M, 86, pillW, 22, 11, 11, "D");
  setText(8.5, C.white);
  pdf.text(pillText, M + 13, 100.5);

  // headline
  setText(66, C.white);
  pdf.text("YOU'RE", M, 166);

  const inW = textWidth("IN.", 66);
  box(M - 8, 176, inW + 28, 60, C.yellow, { shadow: 4, lw: 2 });
  setText(66, C.ink);
  pdf.text("IN.", M + 6, 226);

  // welcome line, to the right of "IN."
  const welcomeX = M + inW + 46;
  setText(13, C.white);
  pdf.text("Welcome to Openroot Classes,", welcomeX, 206);
  setText(13, C.yellow);
  pdf.text(greetingName ? `${greetingName}.` : "see you in class.", welcomeX, 223);

  // PAID stamp
  drawStamp(W - 120, 152, 126, 52, 12, "PAID");

  // ============================================================
  // 2. PASS CARD (ticket) — layout is measured first
  // ============================================================

  const cardX = M;
  const cardY = 244;
  const cardW = W - M * 2;
  const stubW = 150;
  const stubX = cardX + cardW - stubW;
  const contentX = cardX + 22;
  const contentW = stubX - contentX - 18;

  setText(26, C.ink);
  const nameLines = pdf.splitTextToSize(courseName, contentW) as string[];

  // chips: "1 Month", "8 Classes", "2 Classes / Week"
  const chipH = 20;
  const chipGap = 8;
  const chips: { text: string; x: number; row: number; w: number }[] = [];
  let chipX = 0;
  let chipRow = 0;
  durationParts.forEach((part) => {
    const w = textWidth(part, 8.5) + 22;
    if (chipX > 0 && chipX + w > contentW) {
      chipX = 0;
      chipRow += 1;
    }
    chips.push({ text: part, x: chipX, row: chipRow, w });
    chipX += w + chipGap;
  });
  const chipRows = chips.length ? chipRow + 1 : 0;

  const nameBaseline = 62;
  const lastNameBaseline = nameBaseline + (nameLines.length - 1) * 28;
  const chipsTop = lastNameBaseline + 14;
  const chipsBottom = chipRows ? chipsTop + chipRows * chipH + (chipRows - 1) * chipGap : lastNameBaseline;
  const studentLabelBaseline = chipsBottom + 30;
  const studentNameBaseline = studentLabelBaseline + 22;
  const cardH = Math.max(170, studentNameBaseline + 22);

  // card + yellow stub + dashed tear line
  box(cardX, cardY, cardW, cardH, C.white, { shadow: 7, lw: 2 });
  pdf.setFillColor(C.yellow);
  pdf.rect(stubX, cardY + 1, cardW - (stubX - cardX) - 1, cardH - 2, "F");
  pdf.setDrawColor(C.ink);
  pdf.setLineWidth(1.5);
  pdf.setLineDashPattern([5, 4], 0);
  pdf.line(stubX, cardY + 12, stubX, cardY + cardH - 12);
  pdf.setLineDashPattern([], 0);

  // left side: course + chips + student
  setText(8, C.muted);
  pdf.text("ENROLLED IN", contentX, cardY + 30);

  setText(26, C.ink);
  nameLines.forEach((line, i) => {
    pdf.text(line, contentX, cardY + nameBaseline + i * 28);
  });

  chips.forEach((chip, index) => {
    const cx = contentX + chip.x;
    const cy = cardY + chipsTop + chip.row * (chipH + chipGap);
    box(cx, cy, chip.w, chipH, index === 0 ? C.mint : C.white, { radius: 10, lw: 1.2 });
    setText(8.5, C.ink);
    pdf.text(chip.text, cx + chip.w / 2, cy + 13.5, { align: "center" });
  });

  setText(8, C.muted);
  pdf.text("STUDENT", contentX, cardY + studentLabelBaseline);
  const studentSize = fitSize(studentName, contentW, 17, 10);
  setText(studentSize, C.ink);
  pdf.text(studentName, contentX, cardY + studentNameBaseline);

  // right side: tear-off stub with the total
  const stubCx = stubX + stubW / 2;
  setText(8, C.ink);
  pdf.text("TOTAL PAID", stubCx, cardY + 30, { align: "center" });
  setText(12, C.ink);
  pdf.text("INR", stubCx, cardY + 58, { align: "center" });
  const amountText = formatAmount(amountPaid);
  const amountSize = fitSize(amountText, stubW - 28, 44, 20);
  setText(amountSize, C.ink);
  pdf.text(amountText, stubCx, cardY + 58 + amountSize * 0.95, { align: "center" });
  setText(8, C.ink);
  pdf.text("PAID ON", stubCx, cardY + cardH - 40, { align: "center" });
  setText(10.5, C.ink);
  pdf.text(formatDate(paidAt), stubCx, cardY + cardH - 24, { align: "center" });

  // ============================================================
  // 3. BILLED TO / BILL FROM
  // ============================================================

  let y = cardY + cardH + 7 + 20;
  const infoGap = 14;
  const infoW = (cardW - infoGap) / 2;
  const infoH = 66;
  const textW = infoW - 28;

  box(M, y, infoW, infoH, C.white, { shadow: 3, lw: 1.5 });
  setText(8, C.muted);
  pdf.text("BILLED TO", M + 14, y + 17);
  setText(fitSize(studentName, textW, 12, 8), C.ink);
  pdf.text(studentName, M + 14, y + 33);
  setText(fitSize(studentEmail, textW, 9.5, 7, "normal"), C.ink, "normal");
  pdf.text(studentEmail, M + 14, y + 47);
  if (studentPhone) {
    setText(9.5, C.ink, "normal");
    pdf.text(`Phone: ${studentPhone}`, M + 14, y + 59);
  }

  const fromX = M + infoW + infoGap;
  box(fromX, y, infoW, infoH, C.white, { shadow: 3, lw: 1.5 });
  setText(8, C.muted);
  pdf.text("BILL FROM", fromX + 14, y + 17);
  setText(12, C.ink);
  pdf.text("Openroot Systems", fromX + 14, y + 33);
  setText(9.5, C.ink, "normal");
  pdf.text("Kolkata, West Bengal", fromX + 14, y + 47);
  pdf.text("openroot.in", fromX + 14, y + 59);

  // ============================================================
  // 4. PAYMENT DETAILS
  // ============================================================

  y += infoH + 6 + 30;

  const headingText = "PAYMENT DETAILS";
  const headingW = textWidth(headingText, 12);
  pdf.setFillColor(C.yellow);
  pdf.rect(M - 3, y - 5, headingW + 8, 9, "F");
  setText(12, C.ink);
  pdf.text(headingText, M, y);

  const rows: { label: string; value: string; mono: boolean }[] = [
    { label: "Payment ID", value: paymentId, mono: true },
    { label: "Order ID", value: orderId, mono: true },
    { label: "Paid on", value: `${formatDate(paidAt)}, ${formatTime(paidAt)}`, mono: false },
    { label: "Course ID", value: `#${courseId}`, mono: false },
  ];

  let rowY = y + 24;
  rows.forEach((row) => {
    const labelW = textWidth(row.label, 10, "normal");
    const valueFont = row.mono ? "courier" : "helvetica";
    const valueW = textWidth(row.value, 10, "bold", valueFont);

    setText(10, C.muted, "normal");
    pdf.text(row.label, M, rowY);
    setText(10, C.ink, "bold", valueFont);
    pdf.text(row.value, W - M, rowY, { align: "right" });

    // dotted leader between label and value
    pdf.setDrawColor(C.line);
    pdf.setLineWidth(0.8);
    pdf.setLineDashPattern([1, 3], 0);
    pdf.line(M + labelW + 10, rowY - 3, W - M - valueW - 10, rowY - 3);
    pdf.setLineDashPattern([], 0);

    rowY += 21;
  });

  // total bar
  const barY = rowY - 21 + 22;
  const barH = 48;
  pdf.setFillColor(C.ink);
  pdf.rect(M, barY, cardW, barH, "F");
  setText(12, C.white);
  pdf.text("TOTAL PAID", M + 20, barY + 29);

  const pillLabel = "PAID";
  const pillLabelW = textWidth(pillLabel, 9) + 22;
  const pillX = W / 2 - pillLabelW / 2;
  pdf.setFillColor(C.mint);
  pdf.roundedRect(pillX, barY + 14, pillLabelW, 20, 10, 10, "F");
  setText(9, C.ink);
  pdf.text(pillLabel, W / 2, barY + 27.5, { align: "center" });

  setText(26, C.yellow);
  pdf.text(`INR ${formatAmount(amountPaid)}`, W - M - 20, barY + 33, { align: "right" });

  // ============================================================
  // 5. FOOTER
  // ============================================================

  const footerLineY = H - 92;
  const noteY = barY + barH + 22;
  if (noteY < footerLineY - 8) {
    setText(9, C.muted, "normal");
    pdf.text("Keep this receipt safe. Quote your Payment ID if you contact Openroot support.", M, noteY);
  }

  pdf.setDrawColor(C.ink);
  pdf.setLineWidth(1);
  pdf.line(M, footerLineY, W - M, footerLineY);

  if (msmeDataUrl) placeImage(msmeDataUrl, M, footerLineY + 8, 46, 46);
  const footerTextX = M + 60;
  setText(8.5, C.ink);
  pdf.text("Registered MSME  |  UDYAM-WB-14-0263034", footerTextX, footerLineY + 26);
  setText(8, C.muted, "normal");
  pdf.text(
    "This is a system-generated receipt. For any queries, contact Openroot support.",
    footerTextX,
    footerLineY + 40
  );
  setText(9, C.ink);
  pdf.text("openroot.in", W - M, footerLineY + 26, { align: "right" });

  // colour stripe along the bottom edge
  const stripeColors = [C.blue, C.yellow, C.mint, C.coral];
  const stripeW = W / stripeColors.length;
  stripeColors.forEach((color, i) => {
    pdf.setFillColor(color);
    pdf.rect(i * stripeW, H - 10, stripeW + 0.5, 10, "F");
  });

  pdf.save(`Openroot_Invoice_${paymentId === "-" ? "payment" : paymentId}.pdf`);
}