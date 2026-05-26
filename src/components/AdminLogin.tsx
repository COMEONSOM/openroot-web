import { useState, useEffect, useRef, useCallback, memo } from "react";
import "./styles/AdminLogin.css";

import gsap from "gsap";
import Lottie from "lottie-react";
import successAnimation from "../animations/successfullogin.json";
import failedAnimation from "../animations/failedlogin.json";

interface AdminData {
  email: string;
  role: string;
  verified: boolean;
  username: string;
}

interface AdminLoginProps {
  onClose?: () => void;
  onLogin?: (admin: AdminData) => void;
  onLogout?: () => void;
}

type Step = "initial" | "success" | "error" | "profile" | "confirmLogout";

const ADMIN_SESSION_KEY = "openrootAdmin";
const ADMIN_SESSION_SYNC_EVENT = "openroot-admin-session-sync";

const readAdminSession = (): AdminData | null => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AdminData;
    return {
      email: parsed.email,
      role: parsed.role,
      verified: parsed.verified,
      username: parsed.username,
    };
  } catch {
    return null;
  }
};

const clearAdminSession = () => {
  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem("adminLoggedIn");
  } catch {}
};

const emitAdminSessionSync = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ADMIN_SESSION_SYNC_EVENT));
  }
};

const LogoutIcon = memo(() => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
));
LogoutIcon.displayName = "LogoutIcon";

const RetryIcon = memo(() => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
));
RetryIcon.displayName = "RetryIcon";

const ShieldIcon = memo(() => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
));
ShieldIcon.displayName = "ShieldIcon";

export default memo(function AdminLogin({ onClose, onLogin, onLogout }: AdminLoginProps) {
  const [step, setStep] = useState<Step>("initial");
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [adminData, setAdminData] = useState<AdminData | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);

  const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL;
  const ADMIN_TOKEN = import.meta.env.VITE_ADMIN_TOKEN;

  const clearSuccessTimer = useCallback(() => {
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    const savedAdmin = readAdminSession();
    if (savedAdmin) {
      setAdminData(savedAdmin);
      setStep("profile");
    }
    return () => {
      mountedRef.current = false;
      clearSuccessTimer();
    };
  }, [clearSuccessTimer]);

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { opacity: 0, y: 36 },
        { opacity: 1, y: 0, duration: 0.42, ease: "power2.out" }
      );
    }
  }, [step]);

  useEffect(() => {
    if (step !== "success") {
      clearSuccessTimer();
      return;
    }
    clearSuccessTimer();
    successTimerRef.current = setTimeout(() => {
      if (!mountedRef.current) return;
      setStep("profile");
    }, 1800);
    return clearSuccessTimer;
  }, [step, clearSuccessTimer]);

  const handleLogin = useCallback(async () => {
    setErrorMessage("");
    if (!email.trim() || !token.trim()) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      await new Promise<void>((resolve) => setTimeout(resolve, 1200));
      const isValidEmail = email.trim() === ADMIN_EMAIL;
      const isValidToken = token === ADMIN_TOKEN;

      if (isValidEmail && isValidToken) {
        const admin: AdminData = {
          email: email.trim(),
          role: "admin",
          verified: true,
          username: "admin@openroot",
        };

        sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));
        localStorage.setItem("adminLoggedIn", "true");

        setAdminData(admin);
        onLogin?.(admin);
        setStep("success");
        emitAdminSessionSync();
      } else {
        setErrorMessage("Invalid credentials. Please check your email and token.");
        setStep("error");
      }
    } catch {
      setErrorMessage("Login failed. Please try again.");
      setStep("error");
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [ADMIN_EMAIL, ADMIN_TOKEN, email, token, onLogin]);

  const handleLogout = useCallback(() => {
    clearAdminSession();
    setAdminData(null);
    setEmail("");
    setToken("");
    setStep("initial");
    onLogout?.();
    onClose?.();
    emitAdminSessionSync();
  }, [onClose, onLogout]);

  const handleOverlayClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement)?.classList?.contains("admin-overlay")) {
      onClose?.();
    }
  }, [onClose]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && step === "initial" && !loading) {
      void handleLogin();
    }
  }, [step, loading, handleLogin]);

  return (
    <div className="admin-overlay" onMouseDown={handleOverlayClick} role="presentation">
      <div
        className="admin-card"
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-title"
        onKeyDown={handleKeyDown}
      >
        {step !== "success" && (
          <button className="admin-close" onClick={onClose} aria-label="Close modal">
            ✕
          </button>
        )}

        {step === "initial" && (
          <div className="admin-body">
            <div className="admin-brand-section">
              <h2 id="admin-title" className="admin-title">Admin Portal</h2>
              <p className="admin-subtitle">
                Authorised personnel only. Enter your credentials to proceed.
              </p>
            </div>

            <div className="admin-divider" />

            <div className="admin-fields">
              <div className="admin-field">
                <label htmlFor="admin-email" className="admin-label">Email Address</label>
                <input
                  id="admin-email"
                  type="email"
                  className="admin-input"
                  placeholder="admin@openroot.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={loading}
                  aria-required="true"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="admin-token" className="admin-label">Access Token</label>
                <input
                  id="admin-token"
                  type="password"
                  className="admin-input"
                  placeholder="Enter your token"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                  aria-required="true"
                />
              </div>
            </div>

            {!!errorMessage && (
              <div className="admin-error" role="alert">
                <span>{errorMessage}</span>
              </div>
            )}

            <button
              className="admin-submit"
              onClick={() => void handleLogin()}
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? "Verifying…" : "Continue →"}
            </button>
          </div>
        )}

        {step === "success" && (
          <div className="admin-state">
            <div className="admin-state-lottie">
              <Lottie animationData={successAnimation} loop={false} />
            </div>
            <p className="admin-state-heading">Access granted</p>
            <p className="admin-state-msg">Welcome back, admin.</p>
          </div>
        )}

        {step === "error" && (
          <div className="admin-state">
            <div className="admin-state-lottie">
              <Lottie animationData={failedAnimation} loop={false} />
            </div>
            <p className="admin-state-heading">Authentication failed</p>
            <p className="admin-state-msg">{errorMessage}</p>
            <div className="admin-state-actions">
              <button className="admin-state-btn admin-state-btn--primary" onClick={() => setStep("initial")}>
                <RetryIcon />
                Try Again
              </button>
            </div>
          </div>
        )}

        {step === "profile" && adminData && (
          <div className="admin-profile">
            <div className="admin-avatar">A</div>

            <span className="admin-verified-badge">
              <ShieldIcon />
              Verified Admin
            </span>

            <p className="admin-profile-name">{adminData.username}</p>

            <div className="admin-profile-meta">
              <div className="admin-profile-row">
                <span className="admin-profile-row-label">Email</span>
                <span className="admin-profile-row-value">{adminData.email}</span>
              </div>
              <div className="admin-profile-row">
                <span className="admin-profile-row-label">Role</span>
                <span className="admin-profile-row-value">{adminData.role}</span>
              </div>
              <div className="admin-profile-row">
                <span className="admin-profile-row-label">Status</span>
                <span className="admin-profile-row-value" style={{ color: "var(--ot-brand)" }}>Active</span>
              </div>
            </div>

            <div className="admin-profile-actions">
              <button className="admin-logout-btn" onClick={() => setStep("confirmLogout")}>
                <LogoutIcon />
                Sign Out
              </button>
            </div>
          </div>
        )}

        {step === "confirmLogout" && (
          <div className="admin-state">
            <p className="admin-state-heading">Sign out?</p>
            <p className="admin-state-msg">
              Admin session will be terminated. You'll need to re-authenticate.
            </p>
            <div className="admin-state-actions">
              <button className="admin-state-btn admin-state-btn--primary" onClick={handleLogout}>
                <LogoutIcon />
                Yes, Sign Out
              </button>
              <button className="admin-state-btn" onClick={() => setStep("profile")}>
                <RetryIcon />
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
});