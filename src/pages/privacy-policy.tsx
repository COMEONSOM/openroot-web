import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Section {
  id: string;
  icon: string;
  iconBg: string;
  title: string;
  content: React.ReactNode;
}

interface Badge {
  label: string;
  color: "blue" | "green" | "amber" | "gray";
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const BADGES: Badge[] = [
  { label: "No personal data stored", color: "green" },
  { label: "Google OAuth secured", color: "blue" },
  { label: "Last updated Apr 15, 2026", color: "amber" },
  { label: "Version 10.1.1", color: "gray" },
];

const COMPLIANCE_TAGS = [
  "GDPR aligned",
  "CCPA aligned",
  "Chrome Web Store compliant",
  "Google API Services User Data Policy",
];

const SECTIONS: Section[] = [
  {
    id: "overview",
    icon: "ℹ",
    iconBg: "#EEF4FF",
    title: "Overview & Scope",
    content: (
      <>
        <p>
          Openroot GDrive Automation is a Google Chrome Extension that enables
          users to efficiently organize, rename, and manage media files within
          their own Google Drive. This Privacy Policy applies to all versions of
          this extension and governs all interactions between the extension and
          its users.
        </p>
        <p style={{ marginTop: 10 }}>
          By installing or using this extension, you acknowledge that you have
          read and understood this policy. If you do not agree with any part of
          it, please uninstall the extension.
        </p>
        <Note>
          <strong>Scope:</strong> This policy covers the Chrome extension only.
          It does not apply to any external websites linked from within the
          extension.
        </Note>
      </>
    ),
  },
  {
    id: "data-collected",
    icon: "⚿",
    iconBg: "#EDFBF4",
    title: "Data We Collect",
    content: (
      <>
        <p>
          We collect <strong>no personal information</strong>. Specifically, the
          extension does not collect, transmit, or store:
        </p>
        <ul>
          <li>Names, email addresses, or contact information</li>
          <li>
            Google account credentials or tokens outside of your browser session
          </li>
          <li>
            File names, file contents, or metadata from your Google Drive
          </li>
          <li>Browsing history, tab activity, or device identifiers</li>
          <li>Crash reports, usage statistics, or analytics data</li>
        </ul>
        <Note>
          <strong>Local only:</strong> Any temporary state (such as a selected
          folder path) exists only within your browser session and is never sent
          to any server.
        </Note>
      </>
    ),
  },
  {
    id: "google-access",
    icon: "◆",
    iconBg: "#FFF8ED",
    title: "Google Account Access",
    content: (
      <>
        <p>
          The extension uses <strong>Google OAuth 2.0</strong> to request access
          to your Google Drive on your behalf. This authentication flow is
          handled entirely by Google — we never see or store your Google
          password.
        </p>
        <p style={{ marginTop: 10 }}>
          Access is limited to the narrowest scope required:
        </p>
        <ul>
          <li>
            <strong>drive.file</strong> — access only to files the extension
            creates or the user explicitly opens
          </li>
          <li>
            <strong>identity</strong> — to authenticate the user via Google's
            secure OAuth flow
          </li>
        </ul>
        <p style={{ marginTop: 10 }}>
          This extension's use and transfer of information received from Google
          APIs adheres to the{" "}
          <strong>Google API Services User Data Policy</strong>, including the
          Limited Use requirements.
        </p>
      </>
    ),
  },
  {
    id: "data-usage",
    icon: "⚙",
    iconBg: "#F4F3F1",
    title: "How We Use Data",
    content: (
      <>
        <p>
          The extension uses your Drive access exclusively to perform the
          following operations on your behalf, as instructed by you:
        </p>
        <ul>
          <li>Reading file and folder names within the selected Drive folder</li>
          <li>Renaming files based on patterns you configure</li>
          <li>Organizing files within your Drive folder structure</li>
        </ul>
        <p style={{ marginTop: 10 }}>
          All operations are executed through the{" "}
          <strong>Google Drive API</strong> and run directly between your browser
          and Google's servers. No data is routed through any Openroot server.
        </p>
        <Note>
          We do not use your data for advertising, analytics, machine learning,
          or any purpose beyond the core file-management feature you explicitly
          invoke.
        </Note>
      </>
    ),
  },
  {
    id: "permissions",
    icon: "🔒",
    iconBg: "#F0EFFE",
    title: "Extension Permissions",
    content: (
      <>
        <p>
          The following Chrome permissions are declared in the extension manifest
          and their purposes are detailed below:
        </p>
        <ul>
          <li>
            <strong>activeTab</strong> — to detect the currently open Google
            Drive folder URL so the extension can identify which folder to
            operate on
          </li>
          <li>
            <strong>identity</strong> — to securely authenticate you with Google
            via OAuth 2.0 without handling credentials directly
          </li>
          <li>
            <strong>storage</strong> — to save user preferences (such as
            renaming patterns) locally in your browser only; this data never
            leaves your device
          </li>
        </ul>
        <Note>
          No permission is used to monitor, record, or transmit any browsing
          activity outside of Google Drive.
        </Note>
      </>
    ),
  },
  {
    id: "data-sharing",
    icon: "↓",
    iconBg: "#FFF0ED",
    title: "Data Sharing & Disclosure",
    content: (
      <>
        <p>
          We do <strong>not</strong> sell, trade, rent, or share any user data
          with third parties. Because we collect no personal data, there is
          nothing to disclose.
        </p>
        <p style={{ marginTop: 10 }}>
          We may disclose information only if required by law, such as to comply
          with a court order or legal obligation. In all such cases, only the
          minimum legally required information would be shared.
        </p>
        <ul>
          <li>No advertising partners</li>
          <li>No analytics providers</li>
          <li>No data brokers</li>
          <li>No third-party SDKs embedded in the extension</li>
        </ul>
      </>
    ),
  },
  {
    id: "data-retention",
    icon: "⏳",
    iconBg: "#EDFBF4",
    title: "Data Retention",
    content: (
      <>
        <p>
          Since we collect no personal data, there is no retention policy to
          apply to external servers.
        </p>
        <p style={{ marginTop: 10 }}>
          The only local data retained is:
        </p>
        <ul>
          <li>
            <strong>User preferences</strong> (e.g. renaming templates) — stored
            in Chrome's local extension storage and deleted automatically when
            the extension is uninstalled
          </li>
          <li>
            <strong>OAuth tokens</strong> — managed entirely by Chrome and
            Google's identity systems; automatically revoked when you disconnect
            the extension via your Google Account settings
          </li>
        </ul>
        <Note>
          You can revoke access at any time by visiting{" "}
          <strong>
            myaccount.google.com → Security → Third-party apps with account
            access
          </strong>{" "}
          and removing Openroot GDrive Automation.
        </Note>
      </>
    ),
  },
  {
    id: "user-rights",
    icon: "✅",
    iconBg: "#EEF4FF",
    title: "Your Rights",
    content: (
      <>
        <p>Depending on your jurisdiction, you may have rights including:</p>
        <ul>
          <li>
            <strong>Right to access</strong> — request information about any
            data we hold (we hold none)
          </li>
          <li>
            <strong>Right to erasure</strong> — uninstalling the extension
            removes all local preferences; Drive tokens are revocable via your
            Google Account
          </li>
          <li>
            <strong>Right to object</strong> — you may stop using the extension
            at any time without penalty
          </li>
          <li>
            <strong>Right to portability</strong> — your Drive data always
            remains yours; accessible via Google Takeout
          </li>
        </ul>
        <p style={{ marginTop: 10 }}>
          For any rights requests, please contact us at{" "}
          <strong>connect.openroot@gmail.com</strong> and we will respond within
          30 days.
        </p>
      </>
    ),
  },
  {
    id: "security",
    icon: "🛡",
    iconBg: "#EDFBF4",
    title: "Security",
    content: (
      <>
        <p>Security is maintained through Google's own infrastructure:</p>
        <ul>
          <li>All API calls use HTTPS/TLS encryption</li>
          <li>
            Authentication is handled via Google's OAuth 2.0 system —
            credentials are never handled by the extension code
          </li>
          <li>
            No Openroot backend server exists to be breached, because none is
            used
          </li>
          <li>
            Tokens are scoped to minimum required permissions and stored by
            Chrome's secure identity APIs
          </li>
        </ul>
        <Note>
          If you suspect a security vulnerability, please contact us immediately
          at <strong>connect.openroot@gmail.com</strong>.
        </Note>
      </>
    ),
  },
  {
    id: "children",
    icon: "👤",
    iconBg: "#FFF8ED",
    title: "Children's Privacy",
    content: (
      <p>
        This extension is not directed at children under the age of 13, and we
        do not knowingly collect any data from children. If you believe a child
        under 13 has used this extension, please contact us at{" "}
        <strong>connect.openroot@gmail.com</strong> and we will take prompt
        action.
      </p>
    ),
  },
  {
    id: "changes",
    icon: "↺",
    iconBg: "#F4F3F1",
    title: "Changes to This Policy",
    content: (
      <>
        <p>
          We may update this Privacy Policy periodically to reflect changes in
          our practices or applicable law. When we do:
        </p>
        <ul>
          <li>
            The "Last updated" date at the top of this page will be revised
          </li>
          <li>
            Significant changes will be communicated via the Chrome Web Store
            extension listing
          </li>
          <li>
            Continued use of the extension after changes constitutes acceptance
            of the revised policy
          </li>
        </ul>
        <p style={{ marginTop: 10 }}>
          We encourage you to review this page periodically.
        </p>
      </>
    ),
  },
  {
    id: "contact",
    icon: "✉",
    iconBg: "#F0EFFE",
    title: "Contact Us",
    content: (
      <>
        <p>
          If you have any questions, concerns, or requests related to this
          Privacy Policy, please reach out:
        </p>
        <ul>
          <li>
            <strong>Email:</strong>{" "}
            <a
              href="mailto:connect.openroot@gmail.com"
              style={{ color: "#1a56db" }}
            >
              connect.openroot@gmail.com
            </a>
          </li>
          <li>
            <strong>Response time:</strong> within 5 business days
          </li>
          <li>
            <strong>Extension support:</strong> via the Chrome Web Store review
            section
          </li>
        </ul>
        <p style={{ marginTop: 10 }}>
          We take all privacy concerns seriously and will do our best to address
          your inquiry promptly.
        </p>
      </>
    ),
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function Note({ children }: { children: React.ReactNode }) {
  return (
    <div style={styles.note}>
      {children}
    </div>
  );
}

function StatusBadge({ label, color }: Badge) {
  const map: Record<string, { bg: string; dot: string; text: string }> = {
    blue:  { bg: "#EEF4FF", dot: "#1a56db", text: "#1a4db8" },
    green: { bg: "#EDFBF4", dot: "#0d9f6e", text: "#046c4e" },
    amber: { bg: "#FFF8ED", dot: "#c27803", text: "#92400e" },
    gray:  { bg: "#F4F3F1", dot: "#6b7280", text: "#374151" },
  };
  const c = map[color];
  return (
    <span style={{ ...styles.badge, background: c.bg, color: c.text }}>
      <span style={{ ...styles.badgeDot, background: c.dot }} />
      {label}
    </span>
  );
}

function SectionCard({
  sec,
  index,
  isOpen,
  isHighlighted,
  onToggle,
}: {
  sec: Section;
  index: number;
  isOpen: boolean;
  isHighlighted: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      id={`sec-${sec.id}`}
      style={{
        ...styles.sectionCard,
        ...(isHighlighted ? styles.sectionCardHighlighted : {}),
      }}
    >
      <button style={styles.sectionHeader} onClick={onToggle} aria-expanded={isOpen}>
        <div style={styles.secLeft}>
          <div style={{ ...styles.secIcon, background: sec.iconBg }}>
            {sec.icon}
          </div>
          <div>
            <div style={styles.secNum}>{String(index + 1).padStart(2, "0")}</div>
            <div style={styles.secTitle}>{sec.title}</div>
          </div>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={styles.chevron}
        >
          ⌄
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            style={{ overflow: "hidden" }}
          >
            <div style={styles.sectionBody}>{sec.content}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function PrivacyPolicy() {
  const [openIds, setOpenIds] = useState<Set<string>>(new Set(["overview"]));
  const [activeId, setActiveId] = useState<string>("overview");
  const [query, setQuery] = useState("");
  const observerRefs = useRef<Map<string, IntersectionObserver>>(new Map());

  // Filter sections by search query
  const filtered = query.trim()
    ? SECTIONS.filter((s) => {
        const text = s.title.toLowerCase();
        return text.includes(query.toLowerCase());
      })
    : SECTIONS;

  // Auto-open matching sections when searching
  useEffect(() => {
    if (query.trim()) {
      setOpenIds((prev) => {
        const next = new Set(prev);
        filtered.forEach((s) => next.add(s.id));
        return next;
      });
    }
  }, [query, filtered]);

  // Intersection observer for TOC active highlight
  useEffect(() => {
    observerRefs.current.forEach((obs) => obs.disconnect());
    observerRefs.current.clear();

    SECTIONS.forEach((sec) => {
      const el = document.getElementById(`sec-${sec.id}`);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActiveId(sec.id);
        },
        { threshold: 0.35 }
      );
      obs.observe(el);
      observerRefs.current.set(sec.id, obs);
    });
    return () => observerRefs.current.forEach((obs) => obs.disconnect());
  }, []);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const scrollTo = (id: string) => {
    document.getElementById(`sec-${id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    setOpenIds((prev) => new Set([...prev, id]));
  };

  return (
    <div style={styles.page}>
      <div style={styles.wrap}>
        {/* ── Table of Contents ── */}
        <nav style={styles.toc}>
          <div style={styles.tocTitle}>Contents</div>
          {SECTIONS.map((sec) => (
            <button
              key={sec.id}
              style={{
                ...styles.tocItem,
                ...(activeId === sec.id ? styles.tocItemActive : {}),
              }}
              onClick={() => scrollTo(sec.id)}
            >
              {sec.title}
            </button>
          ))}
        </nav>

        {/* ── Main ── */}
        <main style={styles.main}>
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={styles.hero}
          >
            <div style={styles.brand}>
              <img src="/logo.png" alt="Openroot Systems" style={styles.logoImg} />
              <div>
                <div style={styles.brandName}>Openroot Systems</div>
                <div style={styles.brandSub}>GDrive Automation · Chrome Extension</div>
              </div>
            </div>

            <h1 style={styles.heroTitle}>Privacy Policy</h1>
            <p style={styles.heroDesc}>
              This policy describes how the Openroot GDrive Automation Chrome
              Extension handles your data. We are committed to full transparency
              and zero data collection beyond what is strictly required for core
              functionality.
            </p>

            <div style={styles.badgeRow}>
              {BADGES.map((b) => (
                <StatusBadge key={b.label} {...b} />
              ))}
            </div>

            <div style={styles.complianceRow}>
              {COMPLIANCE_TAGS.map((tag) => (
                <span key={tag} style={styles.complianceTag}>{tag}</span>
              ))}
            </div>
          </motion.div>

          {/* Search */}
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>⌕</span>
            <input
              type="text"
              placeholder="Search policy sections..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              style={styles.searchInput}
            />
            {query && (
              <button style={styles.clearBtn} onClick={() => setQuery("")}>
                ✕
              </button>
            )}
          </div>

          {/* Sections */}
          {filtered.length === 0 ? (
            <div style={styles.noResults}>
              No sections match your search.{" "}
              <button style={styles.clearLink} onClick={() => setQuery("")}>
                Clear
              </button>
            </div>
          ) : (
            filtered.map((sec, i) => (
              <motion.div
                key={sec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04, duration: 0.3 }}
              >
                <SectionCard
                  sec={sec}
                  index={SECTIONS.indexOf(sec)}
                  isOpen={openIds.has(sec.id)}
                  isHighlighted={!!query.trim()}
                  onToggle={() => toggle(sec.id)}
                />
              </motion.div>
            ))
          )}

          {/* Footer */}
          <div style={styles.footerCard}>
            <div>
              <div style={styles.footerText}>
                Questions? Contact us at{" "}
                <a href="mailto:connect.openroot@gmail.com" style={styles.footerLink}>
                  connect.openroot@gmail.com
                </a>
              </div>
              <div style={styles.footerSub}>
                © {new Date().getFullYear()} Openroot Systems. All rights reserved.
              </div>
            </div>
            <button style={styles.printBtn} onClick={() => window.print()}>
              Print / Save PDF
            </button>
          </div>
        </main>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(160deg, #f0f4ff 0%, #fafafa 60%)",
    padding: "32px 16px 64px",
    fontFamily: "Inter, system-ui, sans-serif",
  },
  logoImg: {
    width: 36,
    height: 36,
    objectFit: "contain",
    borderRadius: 8,
    flexShrink: 0,
  },
  wrap: {
    display: "grid",
    gridTemplateColumns: "220px minmax(0, 1fr)",
    gap: 24,
    maxWidth: 960,
    margin: "0 auto",
    alignItems: "start",
  },
  // TOC
  toc: {
    position: "sticky",
    top: 16,
    background: "#ffffff",
    border: "0.5px solid rgba(0,0,0,0.1)",
    borderRadius: 12,
    padding: "1rem",
    maxHeight: "90vh",
    overflowY: "auto",
  },
  tocTitle: {
    fontSize: 11,
    fontWeight: 600,
    color: "#6b7280",
    letterSpacing: "0.08em",
    textTransform: "uppercase" as const,
    marginBottom: 10,
  },
  tocItem: {
    display: "block",
    width: "100%",
    textAlign: "left" as const,
    fontSize: 13,
    color: "#6b7280",
    padding: "5px 8px",
    borderRadius: 6,
    border: "none",
    background: "none",
    cursor: "pointer",
    marginBottom: 2,
    transition: "background .15s, color .15s",
  },
  tocItemActive: {
    background: "#EEF4FF",
    color: "#1a4db8",
    fontWeight: 500,
  },
  // Hero
  main: {},
  hero: {
    background: "#ffffff",
    border: "0.5px solid rgba(0,0,0,0.1)",
    borderRadius: 12,
    padding: "1.5rem",
    marginBottom: 16,
  },
  brand: {
    display: "flex",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  logoIcon: {
    width: 36,
    height: 36,
    borderRadius: 8,
    background: "#1a56db",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  brandName: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
  },
  brandSub: {
    fontSize: 12,
    color: "#6b7280",
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#111827",
    marginBottom: 8,
  },
  heroDesc: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "#4b5563",
  },
  badgeRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 8,
    marginTop: 14,
  },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 5,
    fontSize: 12,
    fontWeight: 500,
    padding: "4px 10px",
    borderRadius: 20,
  },
  badgeDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
  },
  complianceRow: {
    display: "flex",
    flexWrap: "wrap" as const,
    gap: 8,
    marginTop: 14,
    paddingTop: 14,
    borderTop: "0.5px solid rgba(0,0,0,0.08)",
  },
  complianceTag: {
    fontSize: 12,
    fontWeight: 500,
    color: "#6b7280",
    padding: "4px 10px",
    border: "0.5px solid rgba(0,0,0,0.12)",
    borderRadius: 20,
    background: "#f9fafb",
  },
  // Search
  searchWrap: {
    position: "relative" as const,
    marginBottom: 16,
  },
  searchIcon: {
    position: "absolute" as const,
    left: 10,
    top: "50%",
    transform: "translateY(-50%)",
    color: "#9ca3af",
    fontSize: 18,
    pointerEvents: "none" as const,
  },
  searchInput: {
    width: "100%",
    padding: "9px 36px 9px 34px",
    fontSize: 14,
    border: "0.5px solid rgba(0,0,0,0.15)",
    borderRadius: 8,
    background: "#ffffff",
    color: "#111827",
    outline: "none",
  },
  clearBtn: {
    position: "absolute" as const,
    right: 10,
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "none",
    color: "#9ca3af",
    cursor: "pointer",
    fontSize: 14,
    padding: "2px 4px",
  },
  // Section cards
  sectionCard: {
    background: "#ffffff",
    border: "0.5px solid rgba(0,0,0,0.1)",
    borderRadius: 12,
    marginBottom: 10,
    overflow: "hidden",
  },
  sectionCardHighlighted: {
    borderColor: "#93b4f7",
    background: "#f5f8ff",
  },
  sectionHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "1rem 1.25rem",
    cursor: "pointer",
    width: "100%",
    border: "none",
    background: "none",
    textAlign: "left" as const,
    gap: 12,
  },
  secLeft: {
    display: "flex",
    alignItems: "center",
    gap: 10,
  },
  secIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 15,
    flexShrink: 0,
  },
  secNum: {
    fontSize: 11,
    fontWeight: 500,
    color: "#9ca3af",
  },
  secTitle: {
    fontSize: 15,
    fontWeight: 600,
    color: "#111827",
  },
  chevron: {
    fontSize: 18,
    color: "#9ca3af",
    display: "inline-block",
    lineHeight: 1,
  },
  sectionBody: {
    borderTop: "0.5px solid rgba(0,0,0,0.08)",
    padding: "1rem 1.25rem 1.25rem",
    fontSize: 14,
    lineHeight: 1.75,
    color: "#4b5563",
  },
  note: {
    background: "#f9fafb",
    borderLeft: "3px solid #d1d5db",
    padding: "10px 14px",
    borderRadius: "0 6px 6px 0",
    marginTop: 12,
    fontSize: 13,
    color: "#6b7280",
  },
  // Footer
  footerCard: {
    background: "#f9fafb",
    border: "0.5px solid rgba(0,0,0,0.1)",
    borderRadius: 12,
    padding: "1.25rem",
    marginTop: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap" as const,
    gap: 12,
  },
  footerText: {
    fontSize: 13,
    color: "#374151",
    marginBottom: 4,
  },
  footerLink: {
    color: "#1a56db",
    textDecoration: "none",
  },
  footerSub: {
    fontSize: 12,
    color: "#9ca3af",
  },
  printBtn: {
    fontSize: 13,
    padding: "7px 14px",
    borderRadius: 8,
    border: "0.5px solid rgba(0,0,0,0.15)",
    background: "#ffffff",
    color: "#374151",
    cursor: "pointer",
  },
  noResults: {
    textAlign: "center" as const,
    padding: "2rem",
    fontSize: 14,
    color: "#6b7280",
  },
  clearLink: {
    border: "none",
    background: "none",
    color: "#1a56db",
    cursor: "pointer",
    fontSize: 14,
  },
};