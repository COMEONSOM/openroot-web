// exportPdf.ts

// 1. Interfaces matching your local TravelExpenseManager EXACTLY
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

declare global {
  interface Window {
    html2pdf?: any;
  }
}

// 2. Helper functions
function escapeHtml(str: string): string {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function loadHtml2PdfScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (typeof window !== "undefined" && window.html2pdf) {
      resolve();
      return;
    }

    const existing = document.querySelector<HTMLScriptElement>(
      'script[data-html2pdf="true"]'
    );

    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Failed to load html2pdf")),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.async = true;
    script.setAttribute("data-html2pdf", "true");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load html2pdf"));
    document.body.appendChild(script);
  });
}

// 3. PDF HTML Builder with inline styling fix
function buildInvoiceHTML(summary: SummaryData): string {
  const now = new Date();
  const logoSrc = typeof window !== "undefined" ? `${window.location.origin}/logo.png` : "";

  const dateStr = now.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  const invoiceId = `ORS-${now.getFullYear()}${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}${String(now.getDate()).padStart(2, "0")}-${Math.floor(Math.random() * 9000) + 1000}`;

  const allMembers = new Set([
    ...summary.expenses.flatMap((e: Expense) => Object.keys(e.paid_by || {})),
    ...summary.expenses.flatMap((e: Expense) => Object.keys(e.distribution || {})),
  ]);
  const memberCount = allMembers.size;
  const memberList = [...allMembers].join(", ") || "—";

  // Expense rows mapped to paid_by
  const expenseRows = summary.expenses
    .map((exp: Expense, idx: number) => {
      const paidByStr = Object.entries(exp.paid_by || {})
        .map(([n, v]) => `${escapeHtml(n)}: ₹${Number(v).toFixed(2)}`)
        .join("<br/>");
      const distStr = Object.entries(exp.distribution || {})
        .map(([n, v]) => `${escapeHtml(n)}: ₹${Number(v).toFixed(2)}`)
        .join("<br/>");

      const rowBg = idx % 2 === 0 ? "#ffffff" : "#f8fafc";

      return `
        <tr style="background:${rowBg};">
          <td style="padding:9px 10px;border-bottom:1px solid #e2e8f0;text-align:center;color:#64748b;font-size:12px;">${
            idx + 1
          }</td>
          <td style="padding:9px 10px;border-bottom:1px solid #e2e8f0;">
            <div style="font-weight:700;color:#0f172a;font-size:12px;">${escapeHtml(
              exp.title
            )}</div>
            <div style="color:#64748b;font-size:11px;margin-top:2px;">${escapeHtml(
              exp.location || "—"
            )}</div>
            ${
              exp.editCount > 0
                ? `<div style="color:#7c3aed;font-size:10px;margin-top:2px;">Edited ${exp.editCount}×</div>`
                : ""
            }
          </td>
          <td style="padding:9px 10px;border-bottom:1px solid #e2e8f0;font-size:11px;color:#374151;">${
            paidByStr || '<span style="color:#94a3b8;">—</span>'
          }</td>
          <td style="padding:9px 10px;border-bottom:1px solid #e2e8f0;font-size:11px;color:#374151;">${
            distStr || '<span style="color:#94a3b8;">—</span>'
          }</td>
          <td style="padding:9px 10px;border-bottom:1px solid #e2e8f0;text-align:right;font-weight:700;font-size:12px;color:#0f172a;white-space:nowrap;">₹${Number(
            exp.amount
          ).toFixed(2)}</td>
        </tr>
      `;
    })
    .join("");

  // Net contribution rows mapped to net_balance / should_pay
  const contribRows = summary.net_contributions
    .map((u: NetContribution, idx: number) => {
      const isPos = u.net_balance >= 0;
      const rowBg = idx % 2 === 0 ? "#ffffff" : "#f8fafc";
      return `
        <tr style="background:${rowBg};">
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-weight:600;font-size:12px;color:#0f172a;">${escapeHtml(
            u.person
          )}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;text-align:right;font-size:12px;color:#374151;">₹${u.paid.toFixed(
            2
          )}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;text-align:right;font-size:12px;color:#374151;">₹${u.should_pay.toFixed(
            2
          )}</td>
          <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;text-align:right;">
            <span style="
              display:inline-block;padding:3px 10px;border-radius:999px;font-size:11px;font-weight:700;white-space:nowrap;
              background:${isPos ? "#dcfce7" : "#fee2e2"};
              color:${isPos ? "#166534" : "#991b1b"};
            ">${isPos ? "+" : "−"}₹${Math.abs(u.net_balance).toFixed(2)}</span>
          </td>
        </tr>
      `;
    })
    .join("");

  // Settlement rows mapped to the string array structure
  const isAllSettled =
    summary.settlements_statements.length === 0 ||
    summary.settlements_statements[0] === "All settled up ✅";

  const settlementRows = isAllSettled
    ? `<tr>
        <td colspan="3" style="padding:16px;text-align:center;">
          <span style="display:inline-block;padding:6px 20px;border-radius:999px;background:#dcfce7;color:#166534;font-weight:700;font-size:12px;">
            ✅ All settled — no transfers needed
          </span>
        </td>
      </tr>`
    : summary.settlements_statements
        .map((s: string, idx: number) => {
          const parts = s.split("➡️").map((p) => p.trim());
          if (parts.length !== 3) {
            return `<tr><td colspan="3" style="padding:8px 10px;font-size:12px;">${escapeHtml(s)}</td></tr>`;
          }
          const rowBg = idx % 2 === 0 ? "#ffffff" : "#f8fafc";
          return `
          <tr style="background:${rowBg};">
            <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-weight:600;font-size:12px;color:#0f172a;">${escapeHtml(
              parts[0]
            )}</td>
            <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;font-weight:600;font-size:12px;color:#0f172a;">${escapeHtml(
              parts[2]
            )}</td>
            <td style="padding:8px 10px;border-bottom:1px solid #e2e8f0;text-align:right;">
              <span style="display:inline-block;padding:3px 12px;border-radius:999px;font-size:11px;font-weight:700;background:#4f46e5;color:#fff;white-space:nowrap;">
                ₹${escapeHtml(parts[1].replace("₹", ""))}
              </span>
            </td>
          </tr>
        `;
        })
        .join("");

  return `
    <div id="pdf-render-container">
      <style>
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .pdf-render-root {
          font-family: Arial, Helvetica, sans-serif;
          color: #0f172a;
          background: #f1f5f9;
          width: 190mm;
          margin: 0 auto;
          padding: 4mm;
        }
        .invoice-sheet { background: #ffffff; border-radius: 4px; border: 1px solid #cbd5e1; overflow: hidden; margin-bottom: 6mm; page-break-inside: avoid; }
        .brand-bar { background: #1e293b; padding: 14px 20px; display: flex; align-items: center; justify-content: space-between; }
        .brand-left { display: flex; align-items: center; gap: 12px; }
        .brand-logo { width: 40px; height: 40px; border-radius: 8px; object-fit: contain; background: #fff; padding: 3px; }
        .brand-name { color: #fff; font-size: 18px; font-weight: 800; letter-spacing: -0.04em; }
        .brand-name span { color: #818cf8; }
        .brand-tagline { color: #94a3b8; font-size: 10px; margin-top: 2px; letter-spacing: 0.04em; }
        .tax-invoice-badge { background: #4f46e5; color: #fff; font-size: 11px; font-weight: 800; letter-spacing: 2px; text-transform: uppercase; padding: 5px 14px; border-radius: 4px; border: 1px solid #6366f1; }
        .meta-strip { background: #f8fafc; border-bottom: 2px solid #4f46e5; padding: 12px 20px; display: flex; justify-content: space-between; align-items: flex-start; gap: 16px; }
        .meta-block { flex: 1; }
        .meta-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.5px; color: #64748b; margin-bottom: 3px; }
        .meta-value { font-size: 12px; font-weight: 700; color: #0f172a; }
        .meta-value.mono { font-family: "Courier New", monospace; color: #4f46e5; font-size: 13px; }
        .meta-divider { width: 1px; background: #e2e8f0; align-self: stretch; }
        .address-row { display: flex; border-bottom: 1px solid #e2e8f0; }
        .address-box { flex: 1; padding: 12px 20px; border-right: 1px solid #e2e8f0; }
        .address-box:last-child { border-right: none; }
        .address-head { font-size: 9px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #4f46e5; margin-bottom: 5px; padding-bottom: 4px; border-bottom: 1px solid #e2e8f0; }
        .address-line { font-size: 11px; color: #374151; line-height: 1.7; }
        .address-line strong { color: #0f172a; font-size: 12px; }
        .section-header { background: #f8fafc; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; padding: 7px 20px; display: flex; align-items: center; gap: 8px; }
        .section-header-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
        .section-header-title { font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.8px; color: #374151; }
        .section-header-count { margin-left: auto; font-size: 10px; color: #64748b; font-weight: 600; }
        table { width: 100%; border-collapse: collapse; }
        th { background: #f1f5f9; border-bottom: 2px solid #e2e8f0; border-top: 1px solid #e2e8f0; padding: 8px 10px; font-size: 10px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.8px; color: #475569; text-align: left; }
        th.right { text-align: right; }
        th.center { text-align: center; }
        .totals-box { display: flex; justify-content: flex-end; border-top: 1px solid #e2e8f0; padding: 12px 20px; }
        .totals-inner { width: 260px; }
        .totals-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; color: #374151; border-bottom: 1px solid #f1f5f9; }
        .totals-row.grand { padding: 8px 0 4px; border-top: 2px solid #0f172a; border-bottom: none; margin-top: 4px; }
        .totals-row.grand .t-label { font-weight: 800; font-size: 13px; color: #0f172a; }
        .totals-row.grand .t-val { font-weight: 900; font-size: 15px; color: #4f46e5; }
        .t-label { color: #64748b; }
        .t-val { font-weight: 700; color: #0f172a; }
        .amount-words { background: #fefce8; border-top: 1px solid #fde047; border-bottom: 1px solid #fde047; padding: 8px 20px; font-size: 11px; color: #713f12; }
        .stats-row { display: flex; border-top: 1px solid #e2e8f0; border-bottom: 1px solid #e2e8f0; background: #f8fafc; }
        .stat-cell { flex: 1; padding: 10px 14px; border-right: 1px solid #e2e8f0; text-align: center; }
        .stat-cell:last-child { border-right: none; }
        .stat-cell-label { font-size: 9px; font-weight: 700; text-transform: uppercase; letter-spacing: 1.2px; color: #64748b; margin-bottom: 3px; }
        .stat-cell-value { font-size: 16px; font-weight: 900; color: #0f172a; letter-spacing: -0.03em; }
        .stat-cell-value.accent { color: #4f46e5; }
        .footer-bar { background: #1e293b; padding: 10px 20px; display: flex; justify-content: space-between; align-items: center; gap: 12px; }
        .footer-left { color: #94a3b8; font-size: 10px; line-height: 1.6; }
        .footer-left strong { color: #e2e8f0; }
        .footer-right { text-align: right; color: #64748b; font-size: 9px; line-height: 1.6; }
        .footer-stamp { background: #0f172a; border: 1px dashed #334155; border-radius: 4px; padding: 6px 14px; text-align: center; color: #64748b; font-size: 9px; letter-spacing: 0.5px; margin-top: 6px; }
        .footer-stamp strong { color: #94a3b8; display: block; font-size: 11px; margin-bottom: 2px; }
      </style>
      
      <div class="pdf-render-root">
        <div class="invoice-sheet">
          <div class="brand-bar">
            <div class="brand-left">
              ${logoSrc ? `<img src="${escapeHtml(logoSrc)}" alt="Openroot Logo" class="brand-logo"/>` : ''}
              <div>
                <div class="brand-name">openroot<span>.</span></div>
                <div class="brand-tagline">Travel Expense Manager</div>
              </div>
            </div>
            <div class="tax-invoice-badge">EXPENSE RECEIPT</div>
          </div>

          <div class="meta-strip">
            <div class="meta-block">
              <div class="meta-label">Receipt No.</div>
              <div class="meta-value mono">${escapeHtml(invoiceId)}</div>
            </div>
            <div class="meta-divider"></div>
            <div class="meta-block">
              <div class="meta-label">Receipt Date</div>
              <div class="meta-value">${escapeHtml(dateStr)}</div>
            </div>
            <div class="meta-divider"></div>
            <div class="meta-block">
              <div class="meta-label">Payment Status</div>
              <div class="meta-value">
                <span style="display:inline-block;padding:2px 10px;border-radius:999px;background:#dcfce7;color:#166534;font-size:11px;font-weight:800;">PAID</span>
              </div>
            </div>
            <div class="meta-divider"></div>
            <div class="meta-block">
              <div class="meta-label">Currency</div>
              <div class="meta-value">INR (₹)</div>
            </div>
          </div>

          <div class="address-row">
            <div class="address-box">
              <div class="address-head">TECH PLATFORM</div>
              <div class="address-line">
                <strong>Openroot Systems</strong><br/>
                Travel Expense Manager<br/>
                Kolkata, India<br/>
                <span style="color:#64748b;">UDYAM: WB-14-0263034</span>
              </div>
            </div>
            <div class="address-box">
              <div class="address-head">Member Details</div>
              <div class="address-line">
                <strong>Trip Group</strong><br/>
                Members: ${escapeHtml(memberList)}<br/>
                Total Members: ${memberCount}<br/>
              </div>
            </div>
            <div class="address-box">
              <div class="address-head">Trip Summary</div>
              <div class="address-line">
                Transactions: <strong>${summary.expenses.length}</strong><br/>
                Members: <strong>${memberCount}</strong><br/>
                Avg / Person: <strong>₹${
                  memberCount > 0
                    ? (summary.total_expense / memberCount).toFixed(2)
                    : "0.00"
                }</strong>
              </div>
            </div>
          </div>

          <div class="stats-row">
            <div class="stat-cell">
              <div class="stat-cell-label">Total Expenses</div>
              <div class="stat-cell-value accent">₹${summary.total_expense.toFixed(2)}</div>
            </div>
            <div class="stat-cell">
              <div class="stat-cell-label">Transactions</div>
              <div class="stat-cell-value">${summary.expenses.length}</div>
            </div>
            <div class="stat-cell">
              <div class="stat-cell-label">Members</div>
              <div class="stat-cell-value">${memberCount}</div>
            </div>
            <div class="stat-cell">
              <div class="stat-cell-label">Avg / Person</div>
              <div class="stat-cell-value">₹${
                memberCount > 0
                  ? (summary.total_expense / memberCount).toFixed(2)
                  : "0.00"
              }</div>
            </div>
          </div>

          <div class="section-header">
            <div class="section-header-dot" style="background:#4f46e5;"></div>
            <div class="section-header-title">Expense Line Items</div>
            <div class="section-header-count">${summary.expenses.length} item(s)</div>
          </div>

          <table>
            <thead>
              <tr>
                <th class="center" style="width:4%;">#</th>
                <th style="width:28%;">Description</th>
                <th style="width:26%;">Paid By</th>
                <th style="width:26%;">Split / Distribution</th>
                <th class="right" style="width:16%;">Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              ${expenseRows}
            </tbody>
            <tfoot>
              <tr>
                <td colspan="4" style="padding:8px 10px;background:#f8fafc;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:1px;color:#475569;border-top:2px solid #e2e8f0;border-bottom:1px solid #e2e8f0;">
                  Grand Total (All Items)
                </td>
                <td style="padding:8px 10px;background:#f8fafc;text-align:right;font-weight:900;font-size:15px;color:#4f46e5;border-top:2px solid #e2e8f0;border-bottom:1px solid #e2e8f0;white-space:nowrap;">
                  ₹${summary.total_expense.toFixed(2)}
                </td>
              </tr>
            </tfoot>
          </table>

          <div class="totals-box">
            <div class="totals-inner">
              <div class="totals-row">
                <span class="t-label">Sub Total</span>
                <span class="t-val">₹${summary.total_expense.toFixed(2)}</span>
              </div>
              <div class="totals-row">
                <span class="t-label">Tax (GST)</span>
                <span class="t-val" style="color:#64748b;">Inclusive</span>
              </div>
              <div class="totals-row">
                <span class="t-label">Discount</span>
                <span class="t-val" style="color:#64748b;">₹0.00</span>
              </div>
              <div class="totals-row grand">
                <span class="t-label">Grand Total</span>
                <span class="t-val">₹${summary.total_expense.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div class="amount-words">
            <strong>Amount in Words:</strong>
            This is a travel expense settlement document generated by Openroot Smart Expense Manager.
            Total trip expenditure: ₹${summary.total_expense.toFixed(2)}.
          </div>
        </div>

        <div class="invoice-sheet">
          <div class="brand-bar">
            <div class="brand-left">
              ${logoSrc ? `<img src="${escapeHtml(logoSrc)}" alt="Openroot Logo" class="brand-logo"/>` : ''}
              <div>
                <div class="brand-name">openroot<span>.</span></div>
                <div class="brand-tagline">Travel Expense Manager</div>
              </div>
            </div>
            <div style="text-align:right;">
              <div style="color:#94a3b8;font-size:9px;letter-spacing:1px;text-transform:uppercase;">Settlement Sheet</div>
              <div style="color:#818cf8;font-size:11px;font-weight:700;font-family:'Courier New',monospace;">${escapeHtml(invoiceId)}</div>
            </div>
          </div>

          <div class="section-header">
            <div class="section-header-dot" style="background:#059669;"></div>
            <div class="section-header-title">Net Contributions per Member</div>
            <div class="section-header-count">${summary.net_contributions.length} member(s)</div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width:34%;">Member</th>
                <th class="right" style="width:22%;">Total Paid (₹)</th>
                <th class="right" style="width:22%;">Should Pay (₹)</th>
                <th class="right" style="width:22%;">Balance</th>
              </tr>
            </thead>
            <tbody>
              ${contribRows}
            </tbody>
          </table>

          <div style="display:flex;gap:16px;padding:8px 20px;background:#f8fafc;border-top:1px solid #e2e8f0;border-bottom:1px solid #e2e8f0;">
            <span style="font-size:10px;color:#64748b;display:flex;align-items:center;gap:6px;">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#dcfce7;border:1px solid #86efac;"></span>
              Positive = overpaid (will receive money)
            </span>
            <span style="font-size:10px;color:#64748b;display:flex;align-items:center;gap:6px;">
              <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:#fee2e2;border:1px solid #fca5a5;"></span>
              Negative = underpaid (owes money)
            </span>
          </div>

          <div class="section-header" style="margin-top:0;">
            <div class="section-header-dot" style="background:#f59e0b;"></div>
            <div class="section-header-title">Settlement Instructions</div>
            <div class="section-header-count">${
              isAllSettled ? "Settled" : `${summary.settlements_statements.length} transfer(s)`
            }</div>
          </div>

          <table>
            <thead>
              <tr>
                <th style="width:34%;">From (Owes)</th>
                <th style="width:34%;">To (Receives)</th>
                <th class="right" style="width:32%;">Transfer Amount</th>
              </tr>
            </thead>
            <tbody>
              ${settlementRows}
            </tbody>
          </table>

          <div style="background:#f0fdf4;border-top:1px solid #bbf7d0;padding:10px 20px;display:flex;gap:12px;align-items:flex-start;">
            <span style="font-size:20px;line-height:1;">✅</span>
            <div>
              <div style="font-size:11px;font-weight:800;color:#166534;margin-bottom:3px;">How to settle up</div>
              <div style="font-size:11px;color:#15803d;line-height:1.55;">
                Each person in the "From" column should transfer the listed amount to the "To" column recipient.
                Once all transfers are complete, the trip is fully balanced with zero outstanding balances.
              </div>
            </div>
          </div>

          <div style="display:flex;border-top:2px solid #e2e8f0;margin-top:0;">
            <div style="flex:1;padding:14px 20px;border-right:1px solid #e2e8f0;">
              <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#64748b;margin-bottom:6px;">Terms &amp; Conditions</div>
              <div style="font-size:10px;color:#64748b;line-height:1.7;">
                1. This is a computer-generated document and does not require a physical signature.<br/>
                2. Amounts are calculated based on user-entered data in Openroot Expense Manager.<br/>
                3. All settlements are final once confirmed by all trip members.<br/>
                4. Openroot Systems is not liable for disputes arising from this document.
              </div>
            </div>
            <div style="width:180px;padding:14px 20px;text-align:center;display:flex;flex-direction:column;justify-content:space-between;">
                <div>
                    <div style="font-size:9px;font-weight:800;text-transform:uppercase;letter-spacing:1.5px;color:#64748b;margin-bottom:4px;">Authorized By</div>
                    <div style="font-size:11px;font-weight:700;color:#374151;">Openroot Systems</div>
                </div>
                <div>
                    ${logoSrc ? `<img src="${escapeHtml(logoSrc)}" alt="Logo" style="width:32px;height:32px;object-fit:contain;border-radius:6px;background:#f1f5f9;padding:3px;display:block;margin:8px auto 4px;"/>` : ''}
                    <div style="font-size:9px;color:#94a3b8;">openroot.in</div>
                </div>
            </div>
          </div>

          <div class="footer-bar">
            <div class="footer-left">
              <strong>© 2026 Openroot Systems. All rights reserved.</strong><br/>
              Travel Expense Manager &mdash; openroot.in
            </div>
            <div>
              <div class="footer-right">
                <strong>COMPUTER GENERATED</strong>
                &bull; Invoice ID: ${escapeHtml(invoiceId)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}

// 4. Download Trigger
export async function downloadExpensePdf(summary: SummaryData | null): Promise<void> {
  if (!summary || !summary.expenses.length) {
    throw new Error("No summary data to export.");
  }

  const wrapper = document.createElement("div");
  wrapper.style.position = "absolute";
  wrapper.style.left = "-9999px";
  wrapper.style.top = "-9999px";
  wrapper.style.zIndex = "-1";
  wrapper.style.pointerEvents = "none";
  
  wrapper.innerHTML = buildInvoiceHTML(summary);
  document.body.appendChild(wrapper);

  try {
    await loadHtml2PdfScript();

    await new Promise((resolve) => window.setTimeout(resolve, 300));

    const target = wrapper.querySelector("#pdf-render-container") as HTMLElement;
    if (!target) {
      throw new Error("PDF container not found");
    }

    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const year = today.getFullYear();

    const pdfOptions = {
      margin: [0, 0, 0, 0],
      filename: `Trip-Expense-${day}-${month}-${year}.pdf`,
      image: { type: "jpeg", quality: 1 },
      html2canvas: {
        scale: 2,
        useCORS: true,
        backgroundColor: "#f1f5f9", 
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
      pagebreak: {
        mode: ["css", "legacy"],
      },
    };

    await window.html2pdf().set(pdfOptions).from(target).save();
  } finally {
    if (wrapper.parentNode) {
      wrapper.parentNode.removeChild(wrapper);
    }
  }
}