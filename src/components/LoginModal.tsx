// ============================================================
// LOGIN MODAL — OPENROOT PREMIUM SPLIT PANEL
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
// INLINE SVG ICONS
// ============================================================

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C18.658 12.01 17.64 9.762 17.64 9.2z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"/>
    <path fill="#FBBC05" d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A9.006 9.006 0 0 0 0 9c0 1.452.348 2.825.957 4.039l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      fill="white"
      d="M13.397 20.997v-8.196h2.765l.411-3.209h-3.176V7.548c0-.926.258-1.56 1.587-1.56h1.684V3.127A22.336 22.336 0 0 0 14.201 3c-2.444 0-4.122 1.492-4.122 4.231v2.355H7.332v3.209h2.753v8.202h3.312z"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path
      fill="white"
      d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12"
    />
  </svg>
);

const RetryIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
    <path d="M3 3v5h5"/>
  </svg>
);

const LogoutIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
    <polyline points="16 17 21 12 16 7"/>
    <line x1="21" y1="12" x2="9" y2="12"/>
  </svg>
);

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
  // GSAP ENTRY ANIMATION
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

          {/* ═══════════════ LEFT PANEL ═══════════════ */}
          <div className="auth-left">

            <div className="auth-brand">
              <img src="/logo-nobg.png" alt="Openroot" />
            </div>

            {/* ── Initial / Login ── */}
            {step === "initial" && (
              <div className="auth-content">
                <h2>Welcome to the World of Smart People</h2>
                <p>Begin your journey by completing your profile.</p>

                <div className="auth-buttons">

                  <button
                    className="btn google"
                    onClick={() => handleOAuthLogin(googleProvider)}
                  >
                    <span className="btn-icon"><GoogleIcon /></span>
                    <span className="btn-label">Continue with Google</span>
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
                    <span className="btn-icon"><FacebookIcon /></span>
                    <span className="btn-label">Continue with Facebook</span>
                  </button>

                  <button
                    className="btn github"
                    onClick={() => handleOAuthLogin(githubProvider)}
                  >
                    <span className="btn-icon"><GitHubIcon /></span>
                    <span className="btn-label">Continue with GitHub</span>
                  </button>

                </div>

                <div className="auth-terms">
                  By continuing you agree to our Terms &amp; Privacy Policy
                </div>
              </div>
            )}

            {/* ── Success ── */}
            {step === "success" && (
              <div className="auth-center">
                <Lottie animationData={successAnimation} loop={false} autoplay />
                <p>Login successful!</p>
                <p>Redirecting in <strong>{Math.max(countdown, 0)}s</strong></p>
              </div>
            )}

            {/* ── Error ── */}
            {step === "error" && (
              <div className="auth-center">
                <Lottie animationData={failedAnimation} loop={false} autoplay />
                <p>{errorMessage}</p>
                <button
                  className="btn retry"
                  onClick={() => setStep("initial")}
                >
                  <span className="btn-icon"><RetryIcon /></span>
                  <span className="btn-label">Try Again</span>
                </button>
              </div>
            )}

            {/* ── Profile ── */}
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
                  <div className="avatar-fallback-lg">
                    {getInitial(userData.displayName)}
                  </div>
                )}
                <h3>{safe(userData.displayName, "Guest")}</h3>
                <p className="profile-row">
                  Email Id: {safe(userData.email, "No email linked")}
                </p>
                <p className="profile-row">
                  Username: <strong>{username}</strong>
                </p>
                {userData.phoneNumber && (
                  <p className="profile-row">
                    Phone: {safe(userData.phoneNumber)}
                  </p>
                )}
                <button
                  className="btn logout"
                  onClick={() => setStep("confirmLogout")}
                >
                  <span className="btn-icon"><LogoutIcon /></span>
                  <span className="btn-label">Logout</span>
                </button>
              </div>
            )}

            {/* ── Confirm Logout ── */}
            {step === "confirmLogout" && (
              <div className="auth-center">
                <h3>Confirm Logout</h3>
                <button className="btn logout" onClick={handleLogout}>
                  <span className="btn-icon"><LogoutIcon /></span>
                  <span className="btn-label">Yes, Logout</span>
                </button>
                <button
                  className="btn retry"
                  onClick={() => setStep("profile")}
                >
                  <span className="btn-icon"><RetryIcon /></span>
                  <span className="btn-label">Cancel</span>
                </button>
              </div>
            )}

          </div>

          {/* ═══════════════ RIGHT PANEL ═══════════════ */}
          <div className="auth-right">

            <span className="flow-label">AUTH FLOW</span>

            <span className="ue-node ue-node--1">
              <span className="node-step">01</span>
              Init Session
            </span>

            <span className="ue-node ue-node--2">
              <span className="node-step">02</span>
              OAuth Popup
            </span>

            <span className="ue-node ue-node--3">
              <span className="node-step">03</span>
              Verify Token
            </span>

            <span className="ue-node ue-node--4">
              <span className="node-step">04</span>
              Access Granted
            </span>

            <svg
              className="ue-wires"
              viewBox="0 0 400 560"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {/* Wire 1 → 2: check_token */}
              <path
                className="primary"
                d="M 170 73 C 240 73, 180 196, 210 196"
              />
              <text className="wire-label" x="205" y="126">check_token</text>

              {/* Wire 2 → 3: id_token (right loop) */}
              <path
                className="mid"
                d="M 330 196 C 380 196, 380 331, 50 331"
              />
              <text className="wire-label" x="295" y="268">id_token</text>

              {/* Wire 3 → 4: uid + claims */}
              <path
                className="primary"
                d="M 170 331 C 240 331, 180 459, 210 459"
              />
              <text className="wire-label" x="195" y="389">uid + claims</text>

              {/* Status dots */}
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