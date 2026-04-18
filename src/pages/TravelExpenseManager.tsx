/**
 * TravelExpenseManager.tsx
 * Cleaned version with PDF logic moved to an external file.
 */

import React, {
  useState,
  useEffect,
  useCallback,
  useRef,
  useMemo,
} from "react";
import "../components/styles/TravelExpenseManager.css";
// Import the PDF utility (adjust the path if you placed it in a utils folder)
import { downloadExpensePdf } from "../hooks/exportPdf";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES (Exported so exportPdf.ts can use them)
// ─────────────────────────────────────────────────────────────────────────────

export interface Expense {
  title: string;
  location: string;
  amount: number;
  paymentType: "single" | "multiple";
  paid_by: Record<string, number>;
  distribution: Record<string, number>;
  date: string;
  editCount: number;
  lastEditedAt: string | null;
}

export interface NetContribution {
  person: string;
  paid: number;
  should_pay: number;
  net_balance: number;
}

export interface SummaryData {
  total_expense: number;
  expenses: Expense[];
  net_contributions: NetContribution[];
  settlements_statements: string[];
}

type Lang = "en" | "hi" | "bn";
type DistributionMode = "auto" | "manual" | null;
type ToastType = "success" | "error";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

// ─────────────────────────────────────────────────────────────────────────────
// TRANSLATIONS
// ─────────────────────────────────────────────────────────────────────────────

const translations: Record<Lang, Record<string, string>> = {
  en: {
    main_title: "#Travel-Expense-Manager",
    add_expense_title: "➕ Add Expense",
    input_title: "Expense name (e.g., Lunch, Hotel, Taxi)",
    input_location: "Expense details (e.g., Location, Description)",
    input_amount: "Total Amount spent in ₹ (e.g., 1200.50)",
    add_member: "Add Members",
    btn_add: "+ Add",
    payment_details: "Payment Details",
    paid_single: "Paid by Single User",
    paid_multiple: "Paid by Multiple Users",
    who_paid: "Who Paid?",
    split_expense: "🧩 Split Expense",
    save_btn: "💾 Save Expense",
    summary_title: "📍 Summary & Balance",
    refresh_btn: "🔄 Refresh Summary",
    delete_btn: "🗑️ Delete History",
    footer_line1: "© 2026 Openroot Systems. All rights reserved.",
    footer_line2: "Smart Travel Expense Manager for everyone 🌍",
    distribute_auto: "Distribute Automatically",
    distribute_manual: "Distribute Manually",
    distribution_title: "Distribution",
    enter_amount: "Enter amount",
    how_to_use: "❓ How to Use",
    export_pdf: "📑 Export PDF",
    amount_paid_by: "Amount paid by {name} (leave 0 if none)",
  },
  hi: {
    main_title: "#यात्रा खर्च प्रबंधन",
    add_expense_title: "➕ खर्च जोड़ें",
    input_title: "खर्च का नाम (उदा., Lunch, Hotel, Taxi)",
    input_location: "खर्च का विवरण (उदा., स्थान, विवरण)",
    input_amount: "खर्च राशि ₹ (उदा., 1200.50)",
    add_member: "साथी जोड़ें",
    btn_add: "+ जोड़ें",
    payment_details: "भुगतान विवरण",
    paid_single: "एक सदस्य ने भुगतान किया",
    paid_multiple: "कई सदस्यों ने भुगतान किया",
    who_paid: "किसने भुगतान किया?",
    split_expense: "🧩 खर्च विभाजन",
    save_btn: "💾 खर्च सुरक्षित करें",
    summary_title: "📍 खर्च का सारांश",
    refresh_btn: "🔄 सारांश रीफ्रेश करें",
    delete_btn: "🗑️ इतिहास हटाएँ",
    footer_line1: "© 2026 Openroot Systems. All rights reserved.",
    footer_line2: "यात्रियों के लिए स्मार्ट खर्च प्रबंधन 🌍",
    distribute_auto: "अपने आप बांटें",
    distribute_manual: "मैन्युअल रूप से बांटें",
    distribution_title: "वितरण",
    enter_amount: "राशि दर्ज करें",
    how_to_use: "❓ कैसे उपयोग करें",
    export_pdf: "📑 PDF डाउनलोड करें",
    amount_paid_by: "{name} द्वारा भुगतान की गयी राशि (यदि नहीं, तो 0 छोड़ें)",
  },
  bn: {
    main_title: "#ভ্রমণের খরচ পরিচালনা",
    add_expense_title: "➕ খরচ যোগ করুন",
    input_title: "খরচের নাম (উদাহরণ: Lunch, Hotel, Taxi)",
    input_location: "খরচ বিবরণ (উদাহরণ: স্থান, বর্ণনা)",
    input_amount: "খরচ (₹) (উদাহরণ: 1200.50)",
    add_member: "সদস্য যোগ করো",
    btn_add: "+ Add",
    payment_details: "পেমেন্ট বিবরণ",
    paid_single: "একজন দিয়েছেন",
    paid_multiple: "অনেকে মিলে দিয়েছেন",
    who_paid: "কে দিয়েছে?",
    split_expense: "🧩 খরচ ভাগ করুন",
    save_btn: "💾 সেভ করুন",
    summary_title: "📍 সারসংক্ষেপ",
    refresh_btn: "🔄 রিফ্রেশ",
    delete_btn: "🗑️ ইতিহাস মুছুন",
    footer_line1: "© 2026 Openroot Systems. All rights reserved.",
    footer_line2: "ভ্রমণকারীদের জন্য স্মার্ট খরচ ম্যানেজার 🌍",
    distribute_auto: "স্বয়ংক্রিয়ভাবে ভাগ করুন",
    distribute_manual: "ম্যানুয়ালি ভাগ করুন",
    distribution_title: "বণ্টন",
    enter_amount: "পরিমাণ লিখুন",
    how_to_use: "❓ কীভাবে ব্যবহার করবেন",
    export_pdf: "📑 PDF ডাউনলোড করুন",
    amount_paid_by: "{name} কত দিয়েছে (ন্যূনতম 0)",
  },
};

// ─────────────────────────────────────────────────────────────────────────────
// CONSTANTS + HELPERS
// ─────────────────────────────────────────────────────────────────────────────

const MAX_TITLE_LENGTH = 80;
const MAX_LOCATION_LENGTH = 140;
const MAX_MEMBER_LENGTH = 40;
const MAX_AMOUNT = 1_000_000_000;
const MAX_TOASTS = 5;
const TOAST_COOLDOWN_MS = 250;

function splitAmountExactly(amount: number, n: number): number[] {
  if (n <= 0) return [];
  const cents = Math.round(Number(amount || 0) * 100);
  const base = Math.floor(cents / n);
  const remainder = cents - base * n;
  return Array.from({ length: n }, (_, i) => (base + (i < remainder ? 1 : 0)) / 100);
}

function sanitizeMoneyInput(value: string): string {
  return value.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");
}

function sanitizeTextInput(value: string, maxLength: number): string {
  return value.replace(/[\r\n\t]+/g, " ").slice(0, maxLength);
}

function stripDigits(value: string): string {
  return value.replace(/[0-9]/g, "");
}

function sanitizePlainTextInput(value: string, maxLength: number): string {
  return sanitizeTextInput(stripDigits(value), maxLength);
}

function sanitizeMemberName(value: string): string {
  return sanitizePlainTextInput(value, MAX_MEMBER_LENGTH);
}

function isValidMemberName(value: string): boolean {
  const trimmed = value.trim();
  return /\p{L}/u.test(trimmed) && !/\d/.test(trimmed);
}

function isFiniteMoney(value: number): boolean {
  return Number.isFinite(value) && value >= 0 && value <= MAX_AMOUNT;
}

function generateSettlements(netContributions: NetContribution[]): string[] {
  const debtors = netContributions
    .filter((u) => u.net_balance < -0.005)
    .map((u) => ({ ...u }));
  const creditors = netContributions
    .filter((u) => u.net_balance > 0.005)
    .map((u) => ({ ...u }));
  const statements: string[] = [];

  debtors.sort((a, b) => a.net_balance - b.net_balance);
  creditors.sort((a, b) => b.net_balance - a.net_balance);

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];
    const amount = Math.min(creditor.net_balance, Math.abs(debtor.net_balance));

    if (amount <= 0.009) break;

    statements.push(`${debtor.person} ➡️ ₹${amount.toFixed(2)} ➡️ ${creditor.person}`);

    debtor.net_balance += amount;
    creditor.net_balance -= amount;

    if (Math.abs(debtor.net_balance) < 0.01) i++;
    if (Math.abs(creditor.net_balance) < 0.01) j++;
  }

  return statements.length ? statements : ["All settled up ✅"];
}

function calculateSummary(expenses: Expense[], users: Set<string>): SummaryData {
  const contributions: Record<string, number> = {};
  const owedTotals: Record<string, number> = {};
  let total_expense = 0;

  expenses.forEach((exp) => {
    for (const [payer, paidAmt] of Object.entries(exp.paid_by || {})) {
      const val = parseFloat(String(paidAmt)) || 0;
      contributions[payer] = (contributions[payer] || 0) + val;
      total_expense += val;
    }

    for (const [user, owed] of Object.entries(exp.distribution || {})) {
      owedTotals[user] = (owedTotals[user] || 0) + (parseFloat(String(owed)) || 0);
    }
  });

  const allUsers = new Set([
    ...users,
    ...Object.keys(contributions),
    ...Object.keys(owedTotals),
  ]);

  const net_contributions: NetContribution[] = [];
  allUsers.forEach((person) => {
    const paid = contributions[person] || 0;
    const should_pay = owedTotals[person] || 0;
    const net_balance = +(paid - should_pay);
    net_contributions.push({ person, paid, should_pay, net_balance });
  });

  return {
    total_expense,
    expenses,
    net_contributions,
    settlements_statements: generateSettlements(net_contributions),
  };
}

function sanitizeMoneyMap(value: unknown): Record<string, number> {
  if (!value || typeof value !== "object") return {};
  const out: Record<string, number> = {};

  for (const [rawKey, rawVal] of Object.entries(value as Record<string, unknown>)) {
    const key = sanitizeTextInput(String(rawKey), MAX_MEMBER_LENGTH).trim();
    const num = Number(rawVal);
    if (key && Number.isFinite(num) && num >= 0 && num <= MAX_AMOUNT) {
      out[key] = num;
    }
  }

  return out;
}

function loadUsersSafe(key: string): Set<string> {
  try {
    if (typeof window === "undefined") return new Set();
    return new Set<string>(JSON.parse(localStorage.getItem(key) || "[]"));
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {}
    return new Set();
  }
}

function loadExpensesSafe(key: string): Expense[] {
  try {
    if (typeof window === "undefined") return [];
    const raw = JSON.parse(localStorage.getItem(key) || "[]");
    if (!Array.isArray(raw)) return [];

    return raw.slice(0, 500).map((e: any) => ({
      title: typeof e?.title === "string" ? e.title.slice(0, MAX_TITLE_LENGTH) : "",
      location:
        typeof e?.location === "string" ? e.location.slice(0, MAX_LOCATION_LENGTH) : "",
      amount: Number.isFinite(Number(e?.amount)) ? Number(e.amount) : 0,
      paymentType: e?.paymentType === "multiple" ? "multiple" : "single",
      paid_by: sanitizeMoneyMap(e?.paid_by),
      distribution: sanitizeMoneyMap(e?.distribution),
      date: typeof e?.date === "string" ? e.date : new Date().toISOString(),
      editCount: Number.isFinite(Number(e?.editCount))
        ? Math.max(0, Number(e.editCount))
        : 0,
      lastEditedAt: typeof e?.lastEditedAt === "string" ? e.lastEditedAt : null,
    }));
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {}
    return [];
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// SUB COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

interface RequiredFieldWrapperProps {
  children: React.ReactNode;
  top?: number;
  right?: number;
}

const RequiredFieldWrapper: React.FC<RequiredFieldWrapperProps> = ({
  children,
  top = 8,
  right = 12,
}) => (
  <div style={{ position: "relative", width: "100%" }}>
    {children}
    <span
      aria-hidden="true"
      style={{
        position: "absolute",
        top,
        right,
        color: "#ef4444",
        fontSize: "1rem",
        fontWeight: 800,
        lineHeight: 1,
        pointerEvents: "none",
        userSelect: "none",
      }}
    >
      *
    </span>
  </div>
);

interface ToastContainerProps {
  toasts: Toast[];
  onUndo?: (() => void) | null;
  undoToastId?: number | null;
  onDismiss: (id: number) => void;
}

const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onUndo,
  undoToastId,
  onDismiss,
}) => (
  <div className="tem-toast-container">
    {toasts.map((t) => (
      <div key={t.id} className={`tem-toast ${t.type}`}>
        <span className="tem-toast-message">{t.message}</span>
        {t.id === undoToastId && onUndo && (
          <button
            className="tem-undo-btn"
            onClick={() => {
              onUndo();
              onDismiss(t.id);
            }}
          >
            Undo
          </button>
        )}
      </div>
    ))}
  </div>
);

interface UserAmountRowProps {
  name: string;
  value: string;
  placeholder: string;
  readOnly?: boolean;
  onChange: (name: string, value: string) => void;
}

const UserAmountRow: React.FC<UserAmountRowProps> = ({
  name,
  value,
  placeholder,
  readOnly,
  onChange,
}) => (
  <div className="tem-user-row">
    <label>{name}</label>
    <input
      type="number"
      className="tem-input tem-input-compact"
      value={value}
      placeholder={placeholder}
      readOnly={readOnly}
      min="0"
      step="0.01"
      inputMode="decimal"
      autoComplete="off"
      onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
      onChange={(e) => onChange(name, sanitizeMoneyInput(e.target.value))}
    />
  </div>
);

interface SummaryViewProps {
  summary: SummaryData | null;
  onOpenEdit: () => void;
}

const SummaryView: React.FC<SummaryViewProps> = ({ summary, onOpenEdit }) => {
  if (!summary || summary.expenses.length === 0) {
    return (
      <div className="tem-empty">
        <div className="tem-empty-icon">🧾</div>
        <div className="tem-empty-title">No expenses yet</div>
        <div className="tem-empty-sub">Add your first expense using the form above.</div>
      </div>
    );
  }

  const { total_expense, expenses, net_contributions, settlements_statements } = summary;

  return (
    <div id="tem-summary-section" className="tem-summary-section">
      <div className="tem-total">Total Expense: ₹{total_expense.toFixed(2)}</div>

      <div className="tem-section-head">
        <h3>Expense History</h3>
        <button className="tem-btn tem-btn-outline tem-btn-sm" onClick={onOpenEdit}>
          ✏️ Edit Expenses
        </button>
      </div>

      <div className="tem-table-wrap">
        <table className="tem-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Details</th>
              <th>Paid By</th>
              <th>Total (₹)</th>
              <th>Distribution</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((exp, i) => (
              <tr key={i}>
                <td>
                  <strong>{exp.title}</strong>
                  {exp.editCount > 0 && (
                    <div className="tem-edit-badge">
                      📝 Edited {exp.editCount} time{exp.editCount > 1 ? "s" : ""}
                    </div>
                  )}
                </td>
                <td>{exp.location}</td>
                <td>
                  {Object.entries(exp.paid_by || {}).map(([n, v]) => (
                    <div key={n}>
                      {n}: ₹{Number(v).toFixed(2)}
                    </div>
                  ))}
                </td>
                <td>₹{Number(exp.amount).toFixed(2)}</td>
                <td>
                  {Object.entries(exp.distribution || {}).map(([n, v]) => (
                    <div key={n}>
                      {n}: ₹{Number(v).toFixed(2)}
                    </div>
                  ))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tem-section-head">
        <h3>Net Contributions</h3>
      </div>

      <div className="tem-table-wrap">
        <table className="tem-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Paid</th>
              <th>Should Pay</th>
              <th>Net</th>
            </tr>
          </thead>
          <tbody>
            {net_contributions.map((u, i) => (
              <tr key={i}>
                <td>{u.person}</td>
                <td>₹{u.paid.toFixed(2)}</td>
                <td>₹{u.should_pay.toFixed(2)}</td>
                <td className={u.net_balance >= 0 ? "tem-pos" : "tem-neg"}>
                  {u.net_balance >= 0 ? "+" : ""}
                  ₹{u.net_balance.toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="tem-section-head">
        <h3>Settlements</h3>
      </div>

      <div className="tem-table-wrap">
        <table className="tem-table">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {settlements_statements.map((s, i) => {
              const parts = s.split("➡️").map((p) => p.trim());
              if (parts.length === 3) {
                return (
                  <tr key={i} className="tem-settlement-row">
                    <td>{parts[0]}</td>
                    <td>{parts[2]}</td>
                    <td className="tem-settlement-amt">
                      {parts[1].replace("₹", "₹")}
                    </td>
                  </tr>
                );
              }
              return (
                <tr key={i}>
                  <td colSpan={3}>{s}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface EditModalProps {
  expenses: Expense[];
  onSave: (index: number, title: string, location: string) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ expenses, onSave, onClose }) => {
  const [editValues, setEditValues] = useState<
    Array<{ title: string; location: string }>
  >(expenses.map((e) => ({ title: e.title, location: e.location })));

  useEffect(() => {
    setEditValues(expenses.map((e) => ({ title: e.title, location: e.location })));
  }, [expenses]);

  return (
    <div className="tem-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="tem-modal">
        <h3>✏️ Edit Expenses</h3>

        <div>
          {expenses.map((exp, i) => (
            <div key={i} className="tem-edit-card">
              <div className="tem-edit-card-meta">
                <strong>{exp.title}</strong>
                <span className="tem-edit-count">
                  {exp.editCount
                    ? `Edited ${exp.editCount} time${exp.editCount > 1 ? "s" : ""}`
                    : "Never Edited"}
                </span>
              </div>

              <div className="tem-edit-grid">
                <input
                  type="text"
                  value={editValues[i]?.title ?? ""}
                  placeholder="Expense title"
                  onChange={(e) => {
                    const updated = [...editValues];
                    updated[i] = { ...updated[i], title: e.target.value };
                    setEditValues(updated);
                  }}
                />
                <input
                  type="text"
                  value={editValues[i]?.location ?? ""}
                  placeholder="Details / Location"
                  onChange={(e) => {
                    const updated = [...editValues];
                    updated[i] = { ...updated[i], location: e.target.value };
                    setEditValues(updated);
                  }}
                />
              </div>

              <div className="tem-flex-end">
                <button
                  className="tem-btn tem-btn-primary tem-btn-sm"
                  onClick={() => onSave(i, editValues[i].title, editValues[i].location)}
                >
                  Save
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="tem-modal-actions">
          <button className="tem-btn tem-btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

interface DeleteModalProps {
  expenses: Expense[];
  onDelete: (ids: number[]) => void;
  onDeleteAll: () => void;
  onClose: () => void;
  onToast: (msg: string, type: ToastType) => void;
}

type DeleteView = "list" | "preview";

const DeleteModal: React.FC<DeleteModalProps> = ({
  expenses,
  onDelete,
  onDeleteAll,
  onClose,
  onToast,
}) => {
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<Set<number>>(new Set());
  const [view, setView] = useState<DeleteView>("list");

  const filtered = useMemo(() => {
    const q = query.toLowerCase();
    return expenses
      .map((e, i) => ({ ...e, originalIndex: i }))
      .filter(
        (e) => e.title.toLowerCase().includes(q) || e.location.toLowerCase().includes(q)
      );
  }, [expenses, query]);

  const toggle = (id: number) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setSelected(next);
  };

  const selectAll = () => setSelected(new Set(filtered.map((e) => e.originalIndex)));
  const unselectAll = () => setSelected(new Set());

  const handlePreview = () => {
    if (!selected.size) return onToast("⚠ Select at least one expense.", "error");
    setView("preview");
  };

  const handleConfirm = () => {
    onDelete([...selected]);
    onClose();
  };

  const handleFullDelete = () => {
    if (!confirm("⚠ This will permanently delete ALL data. Continue?")) return;
    onDeleteAll();
    onClose();
  };

  if (view === "preview") {
    const items = [...selected].map((i) => expenses[i]);

    return (
      <div className="tem-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
        <div className="tem-modal">
          <h3>⚠ Confirm Deletion</h3>
          <p className="tem-modal-note">{items.length} expense(s) will be deleted.</p>

          <ul className="tem-preview-list">
            {items.map((e, i) => (
              <li key={i}>
                <strong>{e.title}</strong>
                <span>₹{e.amount.toFixed(2)}</span>
              </li>
            ))}
          </ul>

          <div className="tem-modal-actions">
            <button className="tem-btn tem-btn-outline" onClick={() => setView("list")}>
              Back
            </button>
            <button className="tem-btn tem-btn-danger" onClick={handleConfirm}>
              Delete
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tem-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="tem-modal">
        <h3>Manage Expense Deletion</h3>

        <input
          autoFocus
          className="tem-delete-search"
          type="text"
          placeholder="Search by title or location..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="tem-delete-toolbar">
          <button className="tem-btn tem-btn-outline tem-btn-sm" onClick={selectAll}>
            Select All
          </button>
          <button className="tem-btn tem-btn-outline tem-btn-sm" onClick={unselectAll}>
            Unselect All
          </button>
          <button className="tem-btn tem-btn-danger tem-btn-sm" onClick={handleFullDelete}>
            Full Delete
          </button>
        </div>

        <div className="tem-delete-list">
          {filtered.length === 0 ? (
            <div style={{ padding: 16, color: "#6b7280" }}>No matching expenses found.</div>
          ) : (
            filtered.map((exp) => (
              <label key={exp.originalIndex} className="tem-delete-item">
                <input
                  type="checkbox"
                  checked={selected.has(exp.originalIndex)}
                  onChange={() => toggle(exp.originalIndex)}
                />
                <span>
                  <strong>{exp.title}</strong>
                  <small>
                    {exp.location} • ₹{exp.amount.toFixed(2)}
                  </small>
                </span>
              </label>
            ))
          )}
        </div>

        <div className="tem-modal-actions">
          <button className="tem-btn tem-btn-outline" onClick={onClose}>
            Cancel
          </button>
          <button className="tem-btn tem-btn-primary" onClick={handlePreview}>
            Preview Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────

const TravelExpenseManager: React.FC = () => {
  const USERS_KEY = "openroot_travel_expense_users";
  const EXPENSES_KEY = "openroot_travel_expense_expenses";
  const MAX_EXPENSES = 500;
  const MAX_MEMBERS = 75;
  const ACTION_LOCK_MS = 250;

  const [lang, setLang] = useState<Lang>("en");
  const [users, setUsers] = useState<Set<string>>(() => loadUsersSafe(USERS_KEY));
  const [expenses, setExpenses] = useState<Expense[]>(() => loadExpensesSafe(EXPENSES_KEY));

  const [titleVal, setTitleVal] = useState("");
  const [locationVal, setLocationVal] = useState("");
  const [amountVal, setAmountVal] = useState("");
  const [newMemberName, setNewMemberName] = useState("");
  const [paymentType, setPaymentType] = useState<"" | "single" | "multiple">("");
  const [singlePayer, setSinglePayer] = useState("");
  const [multiPayerAmounts, setMultiPayerAmounts] = useState<Record<string, string>>({});
  const [distMode, setDistMode] = useState<DistributionMode>(null);
  const [distAmounts, setDistAmounts] = useState<Record<string, string>>({});
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [undoToastId, setUndoToastId] = useState<number | null>(null);
  const [softDeleteBuffer, setSoftDeleteBuffer] = useState<Expense[]>([]);
  const [softDeleteUsersBuffer, setSoftDeleteUsersBuffer] = useState<string[]>([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const undoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const actionLockRef = useRef(false);
  const toastIdRef = useRef(0);

  const t = translations[lang];

  useEffect(() => {
    try {
      localStorage.setItem(USERS_KEY, JSON.stringify([...users].slice(0, MAX_MEMBERS)));
    } catch (error) {
      console.error("Failed to save users:", error);
    }
  }, [users]);

  useEffect(() => {
    try {
      localStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses.slice(0, MAX_EXPENSES)));
    } catch (error) {
      console.error("Failed to save expenses:", error);
    }
  }, [expenses]);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = "success", isUndo = false): number => {
      const id = ++toastIdRef.current;
      setToasts((prev) => {
        const next = [...prev, { id, message, type }];
        return next.slice(-MAX_TOASTS);
      });

      window.setTimeout(() => {
        dismissToast(id);
      }, isUndo ? 7000 : Math.max(2500, TOAST_COOLDOWN_MS * 8));

      return id;
    },
    [dismissToast]
  );

  const summaryData = useMemo(
    () => (expenses.length > 0 ? calculateSummary(expenses, users) : null),
    [expenses, users]
  );

  const usersArr = [...users];

  const addUser = () => {
    if (actionLockRef.current) return;
    actionLockRef.current = true;
    window.setTimeout(() => {
      actionLockRef.current = false;
    }, ACTION_LOCK_MS);

    const name = sanitizeMemberName(newMemberName).trim();
    if (!name) return showToast("⚠ Enter a member name.", "error");
    if (!isValidMemberName(name)) {
      setNewMemberName(name);
      return showToast("⚠ Member name must contain letters and no numbers.", "error");
    }
    if (name.length > MAX_MEMBER_LENGTH) {
      return showToast(
        `⚠ Member name cannot exceed ${MAX_MEMBER_LENGTH} characters.`,
        "error"
      );
    }
    const exists = [...users].some((u) => u.toLowerCase() === name.toLowerCase());
    if (exists) return showToast("⚠ Member already exists.", "error");
    if (users.size >= MAX_MEMBERS) return showToast("⚠ Member limit reached.", "error");

    setUsers((prev) => new Set([...prev, name]));
    setDistMode(null);
    setDistAmounts({});
    setNewMemberName("");
    showToast(`✅ Added member: ${name}`, "success");
  };

  const handlePaymentTypeChange = (val: "" | "single" | "multiple") => {
    setPaymentType(val);
    setDistMode(null);
    setDistAmounts({});
  };

  const canOpenAutoDistribution = (): boolean => {
    const amount = Number(amountVal);
    if (!isFiniteMoney(amount) || amount <= 0) {
      showToast("⚠ Enter a valid total amount first.", "error");
      return false;
    }
    if (users.size === 0) {
      showToast("⚠ Add at least one member first.", "error");
      return false;
    }
    if (!paymentType) {
      showToast("⚠ Select payment type first.", "error");
      return false;
    }

    if (paymentType === "multiple") {
      let totalPaid = 0;
      let hasValue = false;

      for (const value of Object.values(multiPayerAmounts)) {
        const parsed = Number(value);
        if (!Number.isFinite(parsed)) continue;
        if (parsed < 0) {
          showToast("⚠ Paid amounts cannot be negative.", "error");
          return false;
        }
        if (parsed > MAX_AMOUNT) {
          showToast("⚠ Paid amount is too large.", "error");
          return false;
        }
        totalPaid += parsed;
        hasValue = true;
      }

      if (!hasValue || Math.abs(totalPaid - amount) > 0.01) {
        showToast("⚠ Fill valid payer amounts before auto distribution.", "error");
        return false;
      }
    }

    return true;
  };

  const openDistribution = (mode: "auto" | "manual") => {
    if (actionLockRef.current) return;
    actionLockRef.current = true;
    window.setTimeout(() => {
      actionLockRef.current = false;
    }, ACTION_LOCK_MS);

    if (distMode === mode) {
      setDistMode(null);
      setDistAmounts({});
      return;
    }

    if (mode === "auto") {
      if (!canOpenAutoDistribution()) return;
      const members = [...users];
      const shares = splitAmountExactly(Number(amountVal) || 0, members.length);
      const map: Record<string, string> = {};
      members.forEach((m, i) => {
        map[m] = shares[i].toFixed(2);
      });
      setDistAmounts(map);
    } else {
      if (users.size === 0) {
        showToast("⚠ Add members first.", "error");
        return;
      }
      const map: Record<string, string> = {};
      [...users].forEach((m) => {
        map[m] = "";
      });
      setDistAmounts(map);
    }

    setDistMode(mode);
  };

  useEffect(() => {
    if (distMode === "auto") {
      const members = [...users];
      const shares = splitAmountExactly(Number(amountVal) || 0, members.length);
      const map: Record<string, string> = {};
      members.forEach((m, i) => {
        map[m] = shares[i].toFixed(2);
      });
      setDistAmounts(map);
    }

    if (!amountVal) {
      setDistMode(null);
      setDistAmounts({});
    }
  }, [amountVal, users, distMode]);

  const isSaveValid = useMemo(() => {
    if (!distMode) return true;
    const amount = Number(amountVal) || 0;
    const vals = Object.values(distAmounts);
    if (!vals.length) return true;
    let total = 0;
    for (const v of vals) {
      const n = parseFloat(v);
      if (isNaN(n) || n < 0) return false;
      total += n;
    }
    return Math.abs(total - amount) <= 0.01;
  }, [distAmounts, amountVal, distMode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmittingExpense || actionLockRef.current) return;

    actionLockRef.current = true;
    setIsSubmittingExpense(true);

    window.setTimeout(() => {
      actionLockRef.current = false;
      setIsSubmittingExpense(false);
    }, ACTION_LOCK_MS);

    const title = sanitizeTextInput(titleVal.trim(), MAX_TITLE_LENGTH);
    const location = sanitizeTextInput(locationVal.trim() || "NA", MAX_LOCATION_LENGTH);
    const amount = Number(sanitizeMoneyInput(amountVal.trim()));

    if (!title) return showToast("⚠ Fill the expense name.", "error");
    if (!isFiniteMoney(amount) || amount <= 0)
      return showToast("⚠ Enter a valid amount.", "error");
    if (!paymentType) return showToast("⚠ Select payment details.", "error");
    if (users.size === 0) return showToast("⚠ Add members before saving.", "error");
    if (expenses.length >= MAX_EXPENSES)
      return showToast("⚠ Expense limit reached.", "error");
    if (!distMode) return showToast("⚠ Choose distribution mode.", "error");

    let paid_by: Record<string, number> = {};

    if (paymentType === "single") {
      if (!singlePayer) return showToast("⚠ Please select who paid.", "error");
      if (!users.has(singlePayer))
        return showToast("⚠ Invalid payer selected.", "error");
      paid_by = { [singlePayer]: amount };
    } else {
      let totalPaid = 0;
      let validPayers = 0;

      for (const [user, raw] of Object.entries(multiPayerAmounts)) {
        if (!users.has(user)) continue;
        const val = Number(sanitizeMoneyInput(raw));
        if (!Number.isFinite(val)) continue;
        if (val < 0) return showToast("⚠ Paid amounts cannot be negative.", "error");
        if (val > MAX_AMOUNT) return showToast("⚠ Paid amount is too large.", "error");
        if (val > 0) {
          paid_by[user] = val;
          totalPaid += val;
          validPayers += 1;
        }
      }

      if (!validPayers)
        return showToast("⚠ Enter amounts for at least one payer.", "error");
      if (Math.abs(totalPaid - amount) > 0.01) {
        return showToast(
          `⚠ Sum of payer amounts (${totalPaid.toFixed(
            2
          )}) ≠ Total amount (${amount.toFixed(2)})`,
          "error"
        );
      }
    }

    const distribution: Record<string, number> = {};
    let valid = true;
    let negFound = false;

    for (const user of users) {
      const raw = distAmounts[user] ?? "0";
      const owed = Number(sanitizeMoneyInput(raw));
      if (!Number.isFinite(owed)) valid = false;
      if (owed < 0) negFound = true;
      if (owed > MAX_AMOUNT) {
        return showToast("⚠ Distribution amount is too large.", "error");
      }
      distribution[user] = owed || 0;
    }

    if (negFound) return showToast("⚠ Owed amounts cannot be negative.", "error");

    const totalOwed = Object.values(distribution).reduce((s, v) => s + v, 0);
    if (Math.abs(totalOwed - amount) > 0.01) {
      return showToast(
        `⚠ Total owed (${totalOwed.toFixed(2)}) ≠ Total amount (${amount.toFixed(2)})`,
        "error"
      );
    }
    if (!valid) return showToast("⚠ Enter valid owed amounts.", "error");

    const expense: Expense = {
      title,
      location,
      amount,
      paymentType,
      paid_by,
      distribution,
      date: new Date().toISOString(),
      editCount: 0,
      lastEditedAt: null,
    };

    setExpenses((prev) => [...prev, expense].slice(0, MAX_EXPENSES));
    showToast("✅ Expense added!", "success");

    setTitleVal("");
    setLocationVal("");
    setAmountVal("");
    setPaymentType("");
    setSinglePayer("");
    setMultiPayerAmounts({});
    setDistMode(null);
    setDistAmounts({});
  };

  const handleSaveEdit = (index: number, title: string, location: string) => {
    const safeTitle = sanitizeTextInput(title.trim(), MAX_TITLE_LENGTH);
    const safeLocation = sanitizeTextInput(location.trim(), MAX_LOCATION_LENGTH);

    if (!safeTitle || !safeLocation) {
      return showToast("⚠ Title and details cannot be empty.", "error");
    }

    setExpenses((prev) => {
      if (index < 0 || index >= prev.length) return prev;
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        title: safeTitle,
        location: safeLocation,
        editCount: (updated[index].editCount || 0) + 1,
        lastEditedAt: new Date().toISOString(),
      };
      return updated;
    });

    showToast("✅ Updated!", "success");
  };

  const handleSoftDelete = (ids: number[]) => {
    if (isDeleting || actionLockRef.current) return;
    actionLockRef.current = true;
    setIsDeleting(true);

    window.setTimeout(() => {
      actionLockRef.current = false;
      setIsDeleting(false);
    }, ACTION_LOCK_MS);

    const cleanIds = [...new Set(ids)].filter(
      (i) => Number.isInteger(i) && i >= 0 && i < expenses.length
    );
    if (!cleanIds.length) return showToast("⚠ No valid expenses selected.", "error");

    const buffer = cleanIds.map((i) => expenses[i]).filter(Boolean);
    setSoftDeleteBuffer(buffer);

    setExpenses((prev) => {
      const next = [...prev];
      cleanIds
        .sort((a, b) => b - a)
        .forEach((i) => next.splice(i, 1));

      if (next.length === 0) {
        setSoftDeleteUsersBuffer([...users]);
        setUsers(new Set());
      } else {
        setSoftDeleteUsersBuffer([]);
      }

      return next;
    });

    if (undoTimerRef.current) clearTimeout(undoTimerRef.current);

    const id = showToast("Deleted successfully.", "success", true);
    setUndoToastId(id);

    undoTimerRef.current = setTimeout(() => {
      setUndoToastId(null);
      setSoftDeleteBuffer([]);
      setSoftDeleteUsersBuffer([]);
      dismissToast(id);
    }, 7000);
  };

  const handleUndo = () => {
    if (actionLockRef.current) return;
    actionLockRef.current = true;

    window.setTimeout(() => {
      actionLockRef.current = false;
    }, ACTION_LOCK_MS);

    setExpenses((prev) => {
      const merged = [...prev, ...softDeleteBuffer];
      return merged.slice(0, MAX_EXPENSES);
    });

    if (softDeleteUsersBuffer.length) {
      setUsers(new Set(softDeleteUsersBuffer));
    }

    setSoftDeleteBuffer([]);
    setSoftDeleteUsersBuffer([]);
    setUndoToastId(null);
    showToast("↩ Restored successfully!", "success");
  };

  const handleDeleteAll = () => {
    if (isDeleting || actionLockRef.current) return;
    actionLockRef.current = true;
    setIsDeleting(true);

    window.setTimeout(() => {
      actionLockRef.current = false;
      setIsDeleting(false);
    }, ACTION_LOCK_MS);

    try {
      localStorage.removeItem(USERS_KEY);
      localStorage.removeItem(EXPENSES_KEY);
    } catch (error) {
      console.error("Failed to clear storage:", error);
    }

    setUsers(new Set());
    setExpenses([]);
    setSoftDeleteBuffer([]);
    setSoftDeleteUsersBuffer([]);
    setDistMode(null);
    setDistAmounts({});
    setPaymentType("");
    showToast("🗑️ All data permanently deleted.", "success");
  };

  const exportPDF = async () => {
    if (!summaryData || summaryData.expenses.length === 0) {
      showToast("⚠ No summary data to export.", "error");
      return;
    }

    if (isExporting) return;

    try {
      setIsExporting(true);
      // We pass the summary data to the external helper file
      await downloadExpensePdf(summaryData);
      showToast("📄 PDF exported successfully!", "success");
    } catch (error) {
      console.error("PDF export failed:", error);
      showToast("❌ Failed to export PDF.", "error");
    } finally {
      setIsExporting(false);
    }
  };

  useEffect(() => {
    return () => {
      if (undoTimerRef.current) clearTimeout(undoTimerRef.current);
    };
  }, []);

  return (
    <div className="tem-root">
      <header className="tem-header">
        <div className="tem-header-left">
          <img src="/openroot-white-nobg.avif" alt="Openroot Logo" className="tem-logo" />
          <h1>{t.main_title}</h1>
        </div>
      </header>
      <div className="tem-topbar">
        <select
          value={lang}
          onChange={(e) => setLang(e.target.value as Lang)}
          aria-label="Language selector"
        >
          <option value="en">English</option>
          <option value="hi">हिन्दी</option>
          <option value="bn">বাংলা</option>
        </select>

        <button
          className="tem-btn tem-btn-outline tem-btn-sm"
          onClick={() =>
            window.open("https://openroot.in/how-to-use-expense-app", "_blank")
          }
        >
          {t.how_to_use}
        </button>
      </div>
      <main className="tem-main">
        <section className="tem-card">
          <h2>{t.add_expense_title}</h2>

          <form onSubmit={handleSubmit} noValidate>
            <RequiredFieldWrapper>
              <input
                className="tem-input"
                type="text"
                placeholder={t.input_title}
                value={titleVal}
                maxLength={MAX_TITLE_LENGTH}
                autoComplete="off"
                onChange={(e) =>
                  setTitleVal(sanitizePlainTextInput(e.target.value, MAX_TITLE_LENGTH))
                }
                onKeyDown={(e) => {
                  if (/^[0-9]$/.test(e.key)) e.preventDefault();
                }}
                required
                aria-required="true"
                style={{ paddingRight: 28 }}
              />
            </RequiredFieldWrapper>

            <input
              className="tem-input"
              type="text"
              placeholder={t.input_location}
              value={locationVal}
              maxLength={MAX_LOCATION_LENGTH}
              autoComplete="off"
              onChange={(e) =>
                setLocationVal(
                  sanitizePlainTextInput(e.target.value, MAX_LOCATION_LENGTH)
                )
              }
              onKeyDown={(e) => {
                if (/^[0-9]$/.test(e.key)) e.preventDefault();
              }}
            />

            <RequiredFieldWrapper>
              <input
                className="tem-input"
                type="number"
                placeholder={t.input_amount}
                step="0.01"
                min="0"
                max={MAX_AMOUNT}
                value={amountVal}
                inputMode="decimal"
                autoComplete="off"
                onWheel={(e) => (e.currentTarget as HTMLInputElement).blur()}
                onChange={(e) => setAmountVal(sanitizeMoneyInput(e.target.value))}
                required
                aria-required="true"
                style={{ paddingRight: 28 }}
              />
            </RequiredFieldWrapper>

            <div className="tem-inline">
              <input
                className="tem-input"
                type="text"
                placeholder={t.add_member}
                value={newMemberName}
                maxLength={MAX_MEMBER_LENGTH}
                autoComplete="off"
                inputMode="text"
                onChange={(e) => setNewMemberName(sanitizeMemberName(e.target.value))}
                onKeyDown={(e) => {
                  if (/^[0-9]$/.test(e.key)) {
                    e.preventDefault();
                    return;
                  }
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addUser();
                  }
                }}
              />
              <button type="button" className="tem-btn tem-btn-primary" onClick={addUser}>
                {t.btn_add}
              </button>
            </div>

            {usersArr.length > 0 && (
              <div className="tem-member-list">
                {usersArr.map((u) => (
                  <span key={u} className="tem-pill">
                    {u}
                  </span>
                ))}
              </div>
            )}

            <select
              className="tem-select"
              value={paymentType}
              onChange={(e) =>
                handlePaymentTypeChange(e.target.value as "" | "single" | "multiple")
              }
              required
            >
              <option value="">{t.payment_details}</option>
              <option value="single">{t.paid_single}</option>
              <option value="multiple">{t.paid_multiple}</option>
            </select>

            {paymentType === "single" && usersArr.length > 0 && (
              <select
                className="tem-select"
                value={singlePayer}
                onChange={(e) => setSinglePayer(e.target.value)}
              >
                <option value="">{t.who_paid}</option>
                {usersArr.map((u) => (
                  <option key={u} value={u}>
                    {u}
                  </option>
                ))}
              </select>
            )}

            {paymentType === "multiple" && usersArr.length > 0 && (
              <div className="tem-stack">
                <div className="tem-section-title">{t.who_paid}</div>
                {usersArr.map((u) => (
                  <UserAmountRow
                    key={u}
                    name={u}
                    value={multiPayerAmounts[u] ?? ""}
                    placeholder={t.amount_paid_by.replace("{name}", u)}
                    onChange={(name, value) =>
                      setMultiPayerAmounts((prev) => ({ ...prev, [name]: value }))
                    }
                  />
                ))}
              </div>
            )}

            <div className="tem-stack">
              <div className="tem-dist-label">{t.split_expense}</div>

              <div className="tem-dist-buttons">
                <button
                  type="button"
                  className={`tem-btn tem-btn-secondary ${
                    distMode === "auto" ? "active" : ""
                  }`}
                  onClick={() => openDistribution("auto")}
                >
                  {t.distribute_auto}
                </button>
                <button
                  type="button"
                  className={`tem-btn tem-btn-secondary ${
                    distMode === "manual" ? "active" : ""
                  }`}
                  onClick={() => openDistribution("manual")}
                >
                  {t.distribute_manual}
                </button>
              </div>
            </div>

            {distMode && usersArr.length > 0 && (
              <div className="tem-stack">
                <div className="tem-section-title">{t.distribution_title}</div>
                {usersArr.map((u) => (
                  <UserAmountRow
                    key={u}
                    name={u}
                    value={distAmounts[u] ?? ""}
                    placeholder={t.enter_amount}
                    readOnly={distMode === "auto"}
                    onChange={(name, value) =>
                      setDistAmounts((prev) => ({ ...prev, [name]: value }))
                    }
                  />
                ))}
                {!isSaveValid && (
                  <p className="tem-distribution-error">
                    ⚠ Distribution total must match the expense amount.
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              className="tem-btn tem-btn-primary tem-btn-full"
              disabled={isSubmittingExpense}
            >
              {t.save_btn}
            </button>
          </form>
        </section>

        <section className="tem-card tem-summary-card">
          <div className="tem-summary-header">
            <h2>{t.summary_title}</h2>
            <div className="tem-summary-actions">
              <button
                className="tem-btn tem-btn-outline tem-btn-sm"
                onClick={() => setShowEditModal(true)}
                disabled={!summaryData}
              >
                ✏️ Edit Expenses
              </button>

              <button
                className="tem-btn tem-btn-danger tem-btn-sm"
                onClick={() => setShowDeleteModal(true)}
                disabled={!summaryData}
              >
                {t.delete_btn}
              </button>

              <button
                className="tem-btn tem-btn-outline tem-btn-sm"
                onClick={exportPDF}
                disabled={!summaryData || isExporting}
              >
                {isExporting ? "Exporting..." : t.export_pdf}
              </button>
            </div>
          </div>

          <SummaryView summary={summaryData} onOpenEdit={() => setShowEditModal(true)} />
        </section>
      </main>

      <footer className="tem-footer">
        <div>{t.footer_line1}</div>
        <div>{t.footer_line2}</div>
      </footer>

      {showEditModal && summaryData && (
        <EditModal
          expenses={expenses}
          onSave={handleSaveEdit}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {showDeleteModal && summaryData && (
        <DeleteModal
          expenses={expenses}
          onDelete={handleSoftDelete}
          onDeleteAll={handleDeleteAll}
          onClose={() => setShowDeleteModal(false)}
          onToast={showToast}
        />
      )}

      <ToastContainer
        toasts={toasts}
        onUndo={handleUndo}
        undoToastId={undoToastId}
        onDismiss={dismissToast}
      />
    </div>
  );
};

export default TravelExpenseManager;