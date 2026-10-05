import {
  Suspense,
  lazy,
  memo,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import type { KeyboardEvent as ReactKeyboardEvent } from "react";
import "./styles/AdminLogin.css";
import gsap from "gsap";

const Lottie = lazy(() => import("lottie-react"));

// ── IMPORTANT: do NOT import Firebase auth here. ──────────────
// Admin login intentionally avoids signInWithEmailAndPassword so
// it never writes to the shared Firebase auth instance.
// Credentials are verified against env vars only; no Firebase auth
// state is mutated.
// ─────────────────────────────────────────────────────────────

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

type Step =
  | "initial"
  | "verifying"
  | "success"
  | "error"
  | "profile"
  | "confirmLogout";

const ADMIN_SESSION_KEY = "openrootAdmin";
const ADMIN_SESSION_SYNC_EVENT = "openroot-admin-session-sync";
const ADMIN_LOCAL_STORAGE_KEY = "adminLoggedIn";

// ── Allowed email list (comma-separated in VITE_ADMIN_ALLOWED_EMAILS)
const ADMIN_ALLOWED_EMAILS = (() => {
  const raw = import.meta.env.VITE_ADMIN_ALLOWED_EMAILS as string | undefined;
  const fallback = ["admin@openroot.in"];
  if (!raw) return fallback;

  const parsed = raw
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);

  return parsed.length ? parsed : fallback;
})();

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD as
  | string
  | undefined;

// ── Session helpers ──────────────────────────────────────────
const isValidAdminSession = (value: unknown): value is AdminData => {
  if (!value || typeof value !== "object") return false;

  const candidate = value as Partial<AdminData>;

  return (
    typeof candidate.email === "string" &&
    typeof candidate.role === "string" &&
    typeof candidate.verified === "boolean" &&
    typeof candidate.username === "string" &&
    candidate.role === "admin" &&
    candidate.verified === true
  );
};

const readAdminSession = (): AdminData | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;

    const parsed: unknown = JSON.parse(raw);
    if (!isValidAdminSession(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
};

const clearAdminSession = () => {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    localStorage.removeItem(ADMIN_LOCAL_STORAGE_KEY);
  } catch {
    // silent
  }
};

const emitAdminSessionSync = () => {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ADMIN_SESSION_SYNC_EVENT));
  }
};

const getAdminUsername = (email: string): string => {
  const base = email.split("@")[0]?.toLowerCase().trim() || "admin";
  return `${base}@openroot`;
};

// ── Icons ─────────────────────────────────────────────────────
const LogoutIcon = memo(() => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
));
LogoutIcon.displayName = "LogoutIcon";

const RetryIcon = memo(() => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
));
RetryIcon.displayName = "RetryIcon";

const ShieldIcon = memo(() => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
));
ShieldIcon.displayName = "ShieldIcon";

// ── Component ─────────────────────────────────────────────────
export default memo(function AdminLogin({
  onClose,
  onLogin,
  onLogout,
}: AdminLoginProps) {
  const [step, setStep] = useState<Step>("initial");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [successAnimation, setSuccessAnimation] = useState<object | null>(null);
  const [failedAnimation, setFailedAnimation] = useState<object | null>(null);

  const cardRef = useRef<HTMLDivElement | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mountedRef = useRef(true);
  const firstStepRef = useRef(true);

  const clearSuccessTimer = useCallback(() => {
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
  }, []);

  const resetToInitial = useCallback(() => {
    clearSuccessTimer();
    setStep("initial");
    setEmail("");
    setPassword("");
    setErrorMessage("");
    setLoading(false);
  }, [clearSuccessTimer]);

  const syncSessionState = useCallback(() => {
    const saved = readAdminSession();

    if (saved) {
      setAdminData(saved);
      setStep("profile");
      setErrorMessage("");
      setLoading(false);
      return;
    }

    setAdminData(null);
    resetToInitial();
  }, [resetToInitial]);

  // Restore session on mount and keep component in sync if changed elsewhere.
  useEffect(() => {
    mountedRef.current = true;
    syncSessionState();

    const handleSync = () => {
      syncSessionState();
    };

    window.addEventListener(ADMIN_SESSION_SYNC_EVENT, handleSync);
    window.addEventListener("storage", handleSync);

    return () => {
      mountedRef.current = false;
      clearSuccessTimer();
      window.removeEventListener(ADMIN_SESSION_SYNC_EVENT, handleSync);
      window.removeEventListener("storage", handleSync);
    };
  }, [clearSuccessTimer, syncSessionState]);

  useEffect(() => {
    void Promise.all([
      fetch("/lotties/successfullogin.json")
        .then((res) => res.json())
        .then(setSuccessAnimation),

      fetch("/lotties/failedlogin.json")
        .then((res) => res.json())
        .then(setFailedAnimation),
    ]).catch((error) => {
      console.error("Failed to load admin animations:", error);
    });
  }, []);

  // GSAP entrance on each step change (skipped for reduced motion)
  useEffect(() => {
    // no entrance animation on first mount: the chooser hands over seamlessly
    if (firstStepRef.current) {
      firstStepRef.current = false;
      return;
    }
    if (!cardRef.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.35, ease: "power2.out" }
    );
  }, [step]);

  // Tell the header chooser this modal is on screen
  useEffect(() => {
    window.dispatchEvent(new Event("openroot-auth-modal-ready"));
  }, []);

  // Close with Escape (not while the success screen is showing)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && step !== "success") onClose?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [step, onClose]);

  // Auto-advance success → profile
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

  // ── Login: env-var verification ONLY — no Firebase auth ────
  const handleLogin = useCallback(async () => {
    setErrorMessage("");

    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password.trim();

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMessage("Please fill in all fields.");
      return;
    }

    setLoading(true);
    setStep("verifying");

    try {
      // Simulate async round-trip so the UI feels deliberate
      await new Promise<void>((resolve) => setTimeout(resolve, 900));

      if (!mountedRef.current) return;

      const emailAllowed = ADMIN_ALLOWED_EMAILS.includes(trimmedEmail);
      const passwordMatches = ADMIN_PASSWORD
        ? trimmedPassword === ADMIN_PASSWORD
        : false;

      if (!emailAllowed || !passwordMatches) {
        clearAdminSession();
        setAdminData(null);
        setErrorMessage("Invalid credentials. Access denied.");
        setStep("error");
        emitAdminSessionSync();
        return;
      }

      const admin: AdminData = {
        email: trimmedEmail,
        role: "admin",
        verified: true,
        username: getAdminUsername(trimmedEmail),
      };

      sessionStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(admin));

      // Kept only for compatibility with any older code paths.
      // Footer now relies on sessionStorage only.
      localStorage.setItem(ADMIN_LOCAL_STORAGE_KEY, "true");

      setAdminData(admin);
      onLogin?.(admin);
      emitAdminSessionSync();
      setStep("success");
    } catch {
      if (mountedRef.current) {
        clearAdminSession();
        setAdminData(null);
        setErrorMessage("Login failed. Please try again.");
        setStep("error");
        emitAdminSessionSync();
      }
    } finally {
      if (mountedRef.current) setLoading(false);
    }
  }, [email, password, onLogin]);

  // ── Logout: clear session only — no Firebase signOut ───────
  const handleLogout = useCallback(() => {
    clearAdminSession();

    setAdminData(null);
    setEmail("");
    setPassword("");
    setErrorMessage("");
    setLoading(false);
    setStep("initial");

    onLogout?.();
    emitAdminSessionSync();
    onClose?.();
  }, [onClose, onLogout]);

  const handleKeyDown = useCallback(
    (e: ReactKeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" && step === "initial" && !loading) {
        void handleLogin();
      }
    },
    [step, loading, handleLogin]
  );

  return (
    <div className="openroot-admin" role="presentation">
      <div
        className="openroot-admin__card"
        ref={cardRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-title"
        onKeyDown={handleKeyDown}
      >
        {/* TOP BAR */}
        <header className="openroot-admin__bar">
          <span className="openroot-admin__bar-title">Openroot admin</span>
          {step !== "success" && (
            <button
              type="button"
              className="openroot-admin__close"
              onClick={onClose}
              aria-label="Close"
            >
              ×
            </button>
          )}
        </header>

        <div className="openroot-admin__body">
          {/* ── Initial: credential form ── */}
          {step === "initial" && (
            <div className="openroot-admin__stack">
              <div>
                <span className="openroot-admin__label">
                  Authorised personnel only
                </span>
                <h2 id="admin-title" className="openroot-admin__h2">
                  Sign in to the admin portal.
                </h2>
                <p className="openroot-admin__text">
                  Enter your email and password to continue.
                </p>
              </div>

              <div className="openroot-admin__fields">
                <div className="openroot-admin__field">
                  <label htmlFor="admin-email" className="openroot-admin__field-label">
                    Email address
                  </label>
                  <input
                    id="admin-email"
                    type="email"
                    className="openroot-admin__input"
                    placeholder="example@gmail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    disabled={loading}
                    aria-required="true"
                  />
                </div>

                <div className="openroot-admin__field">
                  <label htmlFor="admin-password" className="openroot-admin__field-label">
                    Password
                  </label>
                  <input
                    id="admin-password"
                    type="password"
                    className="openroot-admin__input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    disabled={loading}
                    aria-required="true"
                  />
                </div>
              </div>

              {!!errorMessage && (
                <p className="openroot-admin__alert" role="alert">
                  {errorMessage}
                </p>
              )}

              <button
                type="button"
                className="openroot-admin__button openroot-admin__button--ink openroot-admin__button--full"
                onClick={() => void handleLogin()}
                disabled={loading}
                aria-busy={loading}
              >
                {loading ? "Verifying…" : "Continue"}
              </button>
            </div>
          )}

          {/* ── Verifying ── */}
          {step === "verifying" && (
            <div className="openroot-admin__status" role="status">
              <h3 id="admin-title" className="openroot-admin__h3">
                Verifying credentials…
              </h3>
              <p className="openroot-admin__text">Please wait a moment.</p>
              <div className="openroot-admin__track" aria-hidden="true">
                <span className="openroot-admin__track-fill" />
              </div>
            </div>
          )}

          {/* ── Success ── */}
          {step === "success" && (
            <div className="openroot-admin__status" role="status">
              <div className="openroot-admin__lottie-box">
                {successAnimation && (
                  <Suspense fallback={null}>
                    <Lottie
                      className="openroot-admin__lottie"
                      animationData={successAnimation}
                      loop={false}
                    />
                  </Suspense>
                )}
              </div>
              <h3 id="admin-title" className="openroot-admin__h3">
                Access granted
              </h3>
              <p className="openroot-admin__text">Welcome back, admin.</p>
            </div>
          )}

          {/* ── Error ── */}
          {step === "error" && (
            <div className="openroot-admin__status" role="alert">
              <div className="openroot-admin__lottie-box">
                {failedAnimation && (
                  <Suspense fallback={null}>
                    <Lottie
                      className="openroot-admin__lottie"
                      animationData={failedAnimation}
                      loop={false}
                    />
                  </Suspense>
                )}
              </div>
              <h3 id="admin-title" className="openroot-admin__h3">
                Authentication failed
              </h3>
              <p className="openroot-admin__text">{errorMessage}</p>
              <button
                type="button"
                className="openroot-admin__button openroot-admin__button--ink"
                onClick={() => setStep("initial")}
              >
                <RetryIcon />
                Try again
              </button>
            </div>
          )}

          {/* ── Profile ── */}
          {step === "profile" && adminData && (
            <div className="openroot-admin__stack">
              <div className="openroot-admin__identity">
                <div className="openroot-admin__avatar" aria-hidden="true">
                  A
                </div>
                <div className="openroot-admin__identity-copy">
                  <span className="openroot-admin__chip">
                    <ShieldIcon />
                    Verified admin
                  </span>
                  <h3 id="admin-title" className="openroot-admin__h3">
                    {adminData.username}
                  </h3>
                </div>
              </div>

              <dl className="openroot-admin__rows">
                <div className="openroot-admin__row">
                  <dt>Role</dt>
                  <dd>{adminData.role}</dd>
                </div>
                <div className="openroot-admin__row">
                  <dt>Status</dt>
                  <dd>
                    <span className="openroot-admin__dot" aria-hidden="true" />
                    Active
                  </dd>
                </div>
              </dl>

              <button
                type="button"
                className="openroot-admin__button openroot-admin__button--line"
                onClick={() => setStep("confirmLogout")}
              >
                <LogoutIcon />
                Sign out
              </button>
            </div>
          )}

          {/* ── Confirm logout ── */}
          {step === "confirmLogout" && (
            <div className="openroot-admin__status">
              <h3 id="admin-title" className="openroot-admin__h3">
                Sign out?
              </h3>
              <p className="openroot-admin__text">
                The admin session will end. You will need to sign in again.
              </p>
              <div className="openroot-admin__pair">
                <button
                  type="button"
                  className="openroot-admin__button openroot-admin__button--coral"
                  onClick={handleLogout}
                >
                  <LogoutIcon />
                  Yes, sign out
                </button>
                <button
                  type="button"
                  className="openroot-admin__button openroot-admin__button--line"
                  onClick={() => setStep("profile")}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});