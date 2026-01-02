// ============================================================
//  NAVBAR COMPONENT — MODERN, CLEAN, PRODUCTION-READY
//  VERSION: 2025.7 — STABLE UID REDIRECT HANDLER
//  src/components/Navbar.jsx
// ============================================================

import "./styles/Navbar.css";

// ============================================================
// 🔹 LOGIN STATUS CHECK FUNCTION
// ============================================================
const isUserLoggedIn = () => {
  try {
    return localStorage.getItem("isLoggedIn") === "true";
  } catch {
    return false;
  }
};

// ============================================================
// 🔹 GET CURRENT USER UID
// ============================================================
const getCurrentUID = () => {
  try {
    return (
      sessionStorage.getItem("openrootUserUID") ||
      localStorage.getItem("openrootUserUID") ||
      null
    );
  } catch {
    return null;
  }
};

// ============================================================
// 🔹 ASYNC REDIRECT FUNCTION — UID INJECTION + SAFEGUARD
// ============================================================
const redirectTo = async (url) => {
  try {
    if (!isUserLoggedIn()) {
      alert("⚠️ Please log in first to access this tool.");
      return;
    }

    if (!url || typeof url !== "string") throw new Error("INVALID URL PROVIDED");

    let finalURL = new URL(url);

    // ✅ Get UID & safely append as query param
    const userUID = getCurrentUID();
    if (userUID && !finalURL.searchParams.has("uid")) {
      finalURL.searchParams.set("uid", encodeURIComponent(userUID));
    }

    // ✅ Open safely in new tab after short delay
    await new Promise((resolve) => setTimeout(resolve, 60));
    console.log("🔹 Redirecting to:", url);
    console.log("🔹 UID:", getCurrentUID());

    window.open(finalURL.toString(), "_blank", "noopener,noreferrer");
  } catch (error) {
    console.error("REDIRECTION FAILED:", error.message);
    alert("⚠️ Failed to open link. Please try again later.");
  }
};

// ============================================================
// 🔹 ICON COMPONENTS
// ============================================================
const Icons = {
  timeAI: (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor">
      {/* Neural network + clock */}
      <circle cx="12" cy="12" r="2.5" fill="#fff"/>
      <circle cx="6" cy="6" r="2"/>
      <circle cx="18" cy="6" r="2"/>
      <circle cx="6" cy="18" r="2"/>
      <circle cx="18" cy="18" r="2"/>
      <path d="M6 6L12 12M18 6L12 12M6 18L12 12M18 18L12 12" stroke="#fff" strokeWidth="1"/>
    </svg>
  ),
  Classes: (
    <svg width="30" height="30" viewBox="0 0 24 24" fill="currentColor">
      {/* Online classroom */}
      <rect x="3" y="5" width="18" height="12" rx="2"/>
      <path d="M8 21h8" stroke="currentColor" strokeWidth="2"/>
      <circle cx="12" cy="11" r="2.5" fill="#fff"/>
    </svg>
  ),
  travelExpense: (
    <svg viewBox="0 0 24 24" width="30" height="30" fill="currentColor">
      <path d="M3 15h18v5H3v-5Zm2 2v1h14v-1H5Z" />
      <path d="M6 10h12l2 3H4l2-3Z" />
      <circle cx="8" cy="20" r="1" />
      <circle cx="16" cy="20" r="1" />
      <path d="M2 5h8v2H2V5Zm10 0h3v2h-3V5Zm5 0h5v2h-5V5Z" />
      <path d="M20 12l2-2-1.5-1.5-2 2L20 12Z" />
    </svg>
  ),
  gradeCalculator: (
    <svg viewBox="0 0 24 24" width="34" height="34" fill="currentColor">
      {/* Calculator */}
      <rect x="4" y="2" width="16" height="20" rx="2"/>
      <rect x="7" y="5" width="10" height="3" fill="#000"/>
      <circle cx="9" cy="12" r="1.3" fill="#000"/>
      <circle cx="13" cy="12" r="1.3" fill="#000"/>
      <circle cx="9" cy="16" r="1.3" fill="#000"/>
      <rect x="12" y="15" width="4.5" height="2" fill="#000"/>
    </svg>
  ),
  helpingHand: (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="28" height="28" fill="currentColor" role="img" aria-labelledby="sa2">
      <title id="sa2">Helping Hand — balancing arrows</title>
      <path d="M6 4a1 1 0 0 0-1 1v3h3l4 4 2-2-3-3h3V5a1 1 0 0 0-1-1H6zM18 20a1 1 0 0 0 1-1v-3h-3l-4-4-2 2 3 3H8v3a1 1 0 0 0 1 1h8z"/>
    </svg>
  ),
};

// ============================================================
// 🔹 SOFTWARE DATA
// ============================================================
const releasedSoftwares = Object.freeze([
  { name: "Makaut Grade Calculator", href: "https://openroot.in/openroot-makaut_grade_and_percentage-calculator/", icon: Icons.gradeCalculator },
  { name: "Helping Hand (Job Updates)", href: "https://openroot.in/openroot-helping-hand/", icon: Icons.helpingHand },
  { name: "Openroot Classes", href: "https://openroot-classes-firebase.web.app/", icon: Icons.Classes },
  { name: "Travel Expense Manager", href: "https://openroot.in/openroot-travel-expense-manager/", icon: Icons.travelExpense },
  { name: "NIOR Module", href: "https://openroot-time-ai-module.web.app/", icon: Icons.timeAI },
]);

// ============================================================
// 🔹 MAIN NAVBAR COMPONENT
// ============================================================
export default function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        {/* SECTION TITLE */}
        <h2 className="navbar-title">Released Softwares</h2>

        {/* SOFTWARE BUTTONS GRID */}
        <div className="released-softwares">
          {releasedSoftwares.map((app, index) => (
            <button
              key={app.name || index}
              className="software-btn"
              onClick={() => redirectTo(app.href)}
              aria-label={`Open ${app.name}`}
            >
              <div className="software-icon">{app.icon}</div>
              <span className="software-name">{app.name}</span>
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}
