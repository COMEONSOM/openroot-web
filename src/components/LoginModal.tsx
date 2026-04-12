// ============================================================
// LOGIN MODAL — OPENROOT PREMIUM SPLIT PANEL
// RIGHT PANEL: Auth Architecture Flow Diagram
// · Removed background illustration
// · Nodes now show real OAuth auth flow: 4 sequential steps
// · Wires connect them with data-label annotations
// · Meaningful left→right→left zigzag circuit pattern
// ============================================================

import { useState, useEffect, useRef } from "react";
import "./styles/LoginModal.css";
import gsap from "gsap";
import Lottie from "lottie-react";
import successAnimation from "../animations/successfullogin.json";
import failedAnimation from "../animations/failedlogin.json";

import {
  auth,
  googleProvider,
  facebookProvider,
  githubProvider,
} from "../lib/firebase";

import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User,
  AuthProvider,
} from "firebase/auth";

// ============================================================
// TYPES
// ============================================================

interface LoginModalProps {
  onClose?: () => void;
  onLogin?: (user: User) => void;
  onLogout?: () => void;
}

type Step =
  | "loading"
  | "initial"
  | "profile"
  | "success"
  | "error"
  | "confirmLogout";

// ============================================================
// COMPONENT
// ============================================================

export default function LoginModal({
  onClose,
  onLogin,
  onLogout,
}: LoginModalProps) {
  const [step, setStep] = useState<Step>("loading");
  const [userData, setUserData] = useState<User | null>(null);
  const [username, setUsername] = useState("guest@openroot");
  const [countdown, setCountdown] = useState(5);
  const [errorMessage, setErrorMessage] = useState("");

  const modalRef = useRef<HTMLDivElement | null>(null);

  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // ============================================================
  // HELPERS
  // ============================================================

  const getUsername = (user: User) => {
    if (user?.email)
      return user.email.split("@")[0].toLowerCase() + "@openroot";
    if (user?.phoneNumber)
      return user.phoneNumber.replace(/[^0-9]/g, "") + "@openroot";
    if (user?.displayName)
      return (
        user.displayName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 16) +
        "@openroot"
      );
    return `guest${user.uid.slice(0, 5)}@openroot`;
  };

  const getInitial = (name?: string | null) =>
    name ? name.charAt(0).toUpperCase() : "O";

  const safe = (value: string | null | undefined, fb = "Not specified") =>
    value || fb;

  const getProfilePhoto = (user: User) => {
    if (!user.photoURL) return null;
    if (user.providerData?.[0]?.providerId === "facebook.com")
      return `${user.photoURL}?height=400&width=400`;
    return user.photoURL;
  };

  // ============================================================
  // BROWSER DETECTION
  // ============================================================

  const isRestrictedBrowser = () => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || "";
    return /FBAN|FBAV|Instagram|WhatsApp|Line|WebView/i.test(ua);
  };

  // ============================================================
  // GSAP ENTRY
  // ============================================================

  useEffect(() => {
    if (step !== "loading" && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }
      );
    }
  }, [step]);

  // ============================================================
  // AUTH SUBSCRIPTION
  // ============================================================

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const wantDetails =
        typeof window !== "undefined" &&
        sessionStorage.getItem("openrootOpenProfileDetails") === "1";

      if (user) {
        const uName = getUsername(user);
        setUserData(user);
        setUsername(uName);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("openrootUserUID", user.uid);
        sessionStorage.setItem("openrootUser", uName);
        sessionStorage.setItem("openrootUserUID", user.uid);
        setStep((prev) =>
          prev === "success" || prev === "error" ? prev : "profile"
        );
        if (wantDetails) sessionStorage.removeItem("openrootOpenProfileDetails");
        onLogin?.(user);
      } else {
        setUserData(null);
        setUsername("guest@openroot");
        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("openrootUserUID");
        sessionStorage.removeItem("openrootUser");
        sessionStorage.removeItem("openrootUserUID");
        setStep((prev) =>
          prev === "success" || prev === "error" ? prev : "initial"
        );
      }
    });
    return unsubscribe;
  }, [onLogin]);

  // ============================================================
  // SUCCESS COUNTDOWN
  // ============================================================

  useEffect(() => {
    if (step !== "success") {
      if (successTimerRef.current) { clearTimeout(successTimerRef.current); successTimerRef.current = null; }
      if (successIntervalRef.current) { clearInterval(successIntervalRef.current); successIntervalRef.current = null; }
      return;
    }
    setCountdown(5);
    successIntervalRef.current = setInterval(() => setCountdown((s) => s - 1), 1000);
    successTimerRef.current = setTimeout(() => { if (step === "success") onClose?.(); }, 5000);
    return () => {
      if (successIntervalRef.current) { clearInterval(successIntervalRef.current); successIntervalRef.current = null; }
      if (successTimerRef.current) { clearTimeout(successTimerRef.current); successTimerRef.current = null; }
    };
  }, [step, onClose]);

  // ============================================================
  // LOGIN HANDLER
  // ============================================================

  const handleOAuthLogin = async (provider: AuthProvider) => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const uName = getUsername(user);
      setUserData(user);
      setUsername(uName);
      sessionStorage.setItem("openrootUser", uName);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("openrootUserUID", user.uid);
      sessionStorage.setItem("openrootUserUID", user.uid);
      setStep("success");
      onLogin?.(user);
    } catch (error: unknown) {
      console.error("LOGIN ERROR:", error);
      let msg = "Login failed. Please try again.";
      const errCode = (error as { code?: string })?.code;
      if (errCode === "auth/popup-closed-by-user") msg = "Login cancelled.";
      else if (errCode === "auth/account-exists-with-different-credential")
        msg = "This email is already registered with a different provider.";
      setErrorMessage(msg);
      setStep("error");
    }
  };

  // ============================================================
  // LOGOUT HANDLER
  // ============================================================

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      setUsername("guest@openroot");
      setStep("initial");
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("openrootUserUID");
      sessionStorage.removeItem("openrootUser");
      sessionStorage.removeItem("openrootUserUID");
      onLogout?.();
    } catch (err: unknown) {
      setErrorMessage((err as Error).message || "Logout failed");
      setStep("error");
    }
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (step === "loading") {
    return (
      <div className="auth-overlay">
        <div className="auth-shell">
          <div className="auth-card auth-center" ref={modalRef}>
            <p>Authenticating…</p>
          </div>
        </div>
      </div>
    );
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <div
      className="auth-overlay"
      onMouseDown={(e) => {
        if (
          step === "success" ||
          step === "profile" ||
          step === "error" ||
          step === "confirmLogout"
        ) return;
        const target = e.target as HTMLElement | null;
        if (target?.classList?.contains("auth-overlay")) onClose?.();
      }}
    >
      <div className="auth-shell">

        {step !== "success" && step !== "error" && (
          <button className="modal-close" onClick={onClose}>×</button>
        )}

        <div className="auth-card" ref={modalRef}>

          {/* Corner markers */}
          <span className="ue-corner ue-corner--tl" />
          <span className="ue-corner ue-corner--tr" />
          <span className="ue-corner ue-corner--bl" />
          <span className="ue-corner ue-corner--br" />

          {/* ================= LEFT PANEL ================= */}
          <div className="auth-left">

            <div className="auth-brand">
              <img src="/logo-nobg.png" alt="Openroot" />
            </div>

            {step === "initial" && (
              <div className="auth-content">
                <h2>Welcome to the World of Smart People</h2>
                <p>Begin your journey by completing your profile.</p>
                <div className="auth-buttons">
                  <button className="btn google" onClick={() => handleOAuthLogin(googleProvider)}>
                    Continue with Google
                  </button>
                  <button
                    className="btn facebook"
                    onClick={() => {
                      if (isRestrictedBrowser()) {
                        alert(
                          "Facebook login requires opening this site in Chrome browser.\n\n" +
                          "Please tap the menu (⋮) and choose 'Open in browser', then login again."
                        );
                        return;
                      }
                      handleOAuthLogin(facebookProvider);
                    }}
                  >
                    Continue with Facebook
                  </button>
                  <button className="btn github" onClick={() => handleOAuthLogin(githubProvider)}>
                    Continue with GitHub
                  </button>
                </div>
                <div className="auth-terms">
                  By continuing you agree to our Terms & Privacy Policy
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="auth-center">
                <Lottie animationData={successAnimation} loop={false} autoplay />
                <p>Login successful!</p>
                <p>Redirecting in <strong>{Math.max(countdown, 0)}s</strong></p>
              </div>
            )}

            {step === "error" && (
              <div className="auth-center">
                <Lottie animationData={failedAnimation} loop={false} autoplay />
                <p>{errorMessage}</p>
                <button className="btn retry" onClick={() => setStep("initial")}>Try Again</button>
              </div>
            )}

            {step === "profile" && userData && (
              <div className="auth-profile">
                {getProfilePhoto(userData) ? (
                  <img
                    src={getProfilePhoto(userData)!}
                    className="profile-avatar-lg"
                    alt="User avatar"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="avatar-fallback-lg">{getInitial(userData.displayName)}</div>
                )}
                <h3>{safe(userData.displayName, "Guest")}</h3>
                <p className="profile-row">Email Id: {safe(userData.email, "No email linked")}</p>
                <p className="profile-row">Username: <strong>{username}</strong></p>
                {userData.phoneNumber && (
                  <p className="profile-row">Phone: {safe(userData.phoneNumber)}</p>
                )}
                <button className="btn logout" onClick={() => setStep("confirmLogout")}>Logout</button>
              </div>
            )}

            {step === "confirmLogout" && (
              <div className="auth-center">
                <h3>Confirm Logout</h3>
                <button className="btn logout" onClick={handleLogout}>Yes, Logout</button>
                <button className="btn retry" onClick={() => setStep("profile")}>Cancel</button>
              </div>
            )}
          </div>

          {/* ================= RIGHT PANEL ================= */}
          {/* Auth architecture flow — no illustration, pure diagram */}
          <div className="auth-right">

            {/* ── Section label ── */}
            <span className="flow-label">AUTH FLOW</span>

            {/* ── Step 1: Init Session — top-left ── */}
            <span className="ue-node ue-node--1">
              <span className="node-step">01</span>
              Init Session
            </span>

            {/* ── Step 2: OAuth Popup — upper-right ── */}
            <span className="ue-node ue-node--2">
              <span className="node-step">02</span>
              OAuth Popup
            </span>

            {/* ── Step 3: Verify Token — mid-left ── */}
            <span className="ue-node ue-node--3">
              <span className="node-step">03</span>
              Verify Token
            </span>

            {/* ── Step 4: Access Granted — bottom-right ── */}
            <span className="ue-node ue-node--4">
              <span className="node-step">04</span>
              Access Granted
            </span>

            {/*
              ── Auth flow wire diagram ──────────────────────
              ViewBox: 0 0 400 560  (matches panel aspect)
              Flow:
                Node1 (top-left)   → output_right → Node2 (upper-right) input_left
                Node2 (upper-right)→ output_right → curves back → Node3 (mid-left) input_left
                Node3 (mid-left)   → output_right → Node4 (bottom-right) input_left

              Node positions in % of panel (400×560 SVG units):
                Node1: top 11%, left  6%  → SVG center ≈ (55,  73)
                Node2: top 31%, left 47%  → SVG center ≈ (215, 196)
                Node3: top 52%, left  6%  → SVG center ≈ (55,  331)
                Node4: top 72%, left 47%  → SVG center ≈ (215, 459)

              Pin x-offsets: input_left = node_x - 5, output_right = node_x + 115
              ─────────────────────────────────────────────── */}
            <svg
              className="ue-wires"
              viewBox="0 0 400 560"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* ── Wire 1→2: check_token ── */}
              <path
                className="primary"
                d="M 170 73 C 240 73, 180 196, 210 196"
              />
              <text className="wire-label" x="205" y="126">check_token</text>

              {/* ── Wire 2→3: id_token ── */}
              {/* Goes right, curves way around and comes back left */}
              <path
                className="mid"
                d="M 330 196 C 380 196, 380 331, 50 331"
              />
              <text className="wire-label" x="295" y="268">id_token</text>

              {/* ── Wire 3→4: uid + claims ── */}
              <path
                className="primary"
                d="M 170 331 C 240 331, 180 459, 210 459"
              />
              <text className="wire-label" x="195" y="389">uid + claims</text>

              {/* ── Status dots on each wire midpoint ── */}
              <circle className="wire-dot" cx="205" cy="134" r="3" />
              <circle className="wire-dot wire-dot--mid" cx="375" cy="263" r="3" />
              <circle className="wire-dot" cx="200" cy="395" r="3" />
            </svg>

          </div>

        </div>
      </div>
    </div>
  );
}