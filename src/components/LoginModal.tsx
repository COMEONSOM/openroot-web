import { useState, useEffect, useRef, useCallback, memo } from "react";
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

type ProviderName = "google" | "facebook" | "github";

const OPENROOT_USER_KEY = "openrootUser";
const OPENROOT_USER_UID_KEY = "openrootUserUID";
const OPENROOT_PROFILE_DETAILS_KEY = "openrootOpenProfileDetails";
const IS_LOGGED_IN_KEY = "isLoggedIn";

// ── Provider icons ───────────────────────────────────────────
const GoogleIcon = memo(() => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      fill="#4285F4"
      d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C18.658 12.01 17.64 9.762 17.64 9.2z"
    />
    <path
      fill="#34A853"
      d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
    />
    <path
      fill="#FBBC05"
      d="M3.964 10.707c-.18-.54-.282-1.117-.282-1.707s.102-1.167.282-1.707V4.961H.957A9.006 9.006 0 0 0 0 9c0 1.452.348 2.825.957 4.039l3.007-2.332z"
    />
    <path
      fill="#EA4335"
      d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.961L3.964 6.293C4.672 4.166 6.656 3.58 9 3.58z"
    />
  </svg>
));
GoogleIcon.displayName = "GoogleIcon";

const FacebookIcon = memo(() => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path
      d="M24 12C24 5.372 18.628 0 12 0C5.372 0 0 5.372 0 12C0 17.989 4.388 22.954 10.125 23.854V15.469H7.078V12H10.125V9.356C10.125 6.348 11.917 4.688 14.658 4.688C15.97 4.688 17.344 4.922 17.344 4.922V7.875H15.83C14.34 7.875 13.875 8.8 13.875 9.75V12H17.203L16.672 15.469H13.875V23.854C19.612 22.954 24 17.989 24 12Z"
      fill="#1877F2"
    />
  </svg>
));
FacebookIcon.displayName = "FacebookIcon";

const GitHubIcon = memo(() => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <path d="M12 .297C5.373.297 0 5.67 0 12.297c0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61-.546-1.387-1.332-1.756-1.332-1.756-1.089-.744.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.835 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.303-5.466-1.333-5.466-5.931 0-1.31.465-2.381 1.236-3.221-.135-.303-.54-1.523.104-3.176 0 0 1.005-.322 3.3 1.23A11.507 11.507 0 0 1 12 6.844c1.02.005 2.045.138 3.003.404 2.294-1.552 3.298-1.23 3.298-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.221 0 4.609-2.805 5.625-5.475 5.921.43.372.81 1.102.81 2.222 0 1.606-.015 2.896-.015 3.286 0 .321.21.694.825.576C20.565 22.092 24 17.592 24 12.297 24 5.67 18.627.297 12 .297z" />
  </svg>
));
GitHubIcon.displayName = "GitHubIcon";

const RetryIcon = memo(() => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
  </svg>
));
RetryIcon.displayName = "RetryIcon";

const LogoutIcon = memo(() => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
));
LogoutIcon.displayName = "LogoutIcon";

const VerifiedBadgeIcon = memo(() => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M9 12l2 2 4-4" />
    <path d="M12 3l7 4v5c0 5-3.5 8-7 9-3.5-1-7-4-7-9V7l7-4z" />
  </svg>
));
VerifiedBadgeIcon.displayName = "VerifiedBadgeIcon";

// ── Helpers ───────────────────────────────────────────────────
const getFirebaseErrorMessage = (error: unknown): string => {
  const code = (error as { code?: string } | null)?.code;

  switch (code) {
    case "auth/popup-closed-by-user":
      return "Login cancelled.";
    case "auth/popup-blocked":
      return "Popup blocked. Please allow popups and try again.";
    case "auth/account-exists-with-different-credential":
      return "This email is already registered with a different provider.";
    case "auth/network-request-failed":
      return "Network error. Please check your connection and try again.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized for authentication.";
    case "auth/operation-not-allowed":
      return "This login provider is not enabled.";
    default:
      return "Login failed. Please try again.";
  }
};

const isRestrictedBrowser = (): boolean => {
  if (typeof navigator === "undefined") return false;
  return /FBAN|FBAV|Instagram|WhatsApp|Line|WebView/i.test(navigator.userAgent ?? "");
};

const getUsername = (user: User): string => {
  if (user.email) return `${user.email.split("@")[0].toLowerCase()}@openroot`;
  if (user.phoneNumber) return `${user.phoneNumber.replace(/[^0-9]/g, "")}@openroot`;
  if (user.displayName) {
    return `${user.displayName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .slice(0, 16)}@openroot`;
  }
  return `guest${user.uid.slice(0, 5)}@openroot`;
};

const getInitial = (name?: string | null): string =>
  name?.trim()?.charAt(0)?.toUpperCase() ?? "O";

const safe = (value: string | null | undefined, fallback = "Not specified"): string =>
  value || fallback;

const getProfilePhoto = (user: User): string | null => {
  if (!user.photoURL) return null;
  if (user.providerData?.[0]?.providerId === "facebook.com") {
    return `${user.photoURL}?height=400&width=400`;
  }
  return user.photoURL;
};

const syncUserSession = (user: User, username: string) => {
  try {
    sessionStorage.setItem(OPENROOT_USER_KEY, username);
    sessionStorage.setItem(OPENROOT_USER_UID_KEY, user.uid);
    localStorage.setItem(IS_LOGGED_IN_KEY, "true");
  } catch {
    // optional
  }
};

const clearUserSession = () => {
  try {
    localStorage.removeItem(IS_LOGGED_IN_KEY);
    localStorage.removeItem(OPENROOT_USER_UID_KEY);
    sessionStorage.removeItem(OPENROOT_USER_KEY);
    sessionStorage.removeItem(OPENROOT_USER_UID_KEY);
    sessionStorage.removeItem(OPENROOT_PROFILE_DETAILS_KEY);
  } catch {
    // optional
  }
};

// ── Component ──────────────────────────────────────────────────
export default memo(function UserLoginModal({ onClose, onLogin, onLogout }: LoginModalProps) {
  const [step, setStep] = useState<Step>("loading");
  const [userData, setUserData] = useState<User | null>(null);
  const [username, setUsername] = useState("guest@openroot");
  const [countdown, setCountdown] = useState(5);
  const [errorMessage, setErrorMessage] = useState("");
  const [authenticatingProvider, setAuthenticatingProvider] =
    useState<ProviderName | null>(null);

  const isAuthenticating = authenticatingProvider !== null;

  const shellRef = useRef<HTMLDivElement | null>(null);
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const mountedRef = useRef(true);
  const loginRequestIdRef = useRef(0);

  const clearSuccessTimers = useCallback(() => {
    if (successTimerRef.current) {
      clearTimeout(successTimerRef.current);
      successTimerRef.current = null;
    }
    if (successIntervalRef.current) {
      clearInterval(successIntervalRef.current);
      successIntervalRef.current = null;
    }
  }, []);

  const resetToInitial = useCallback(() => {
    clearSuccessTimers();
    setStep("initial");
    setErrorMessage("");
    setAuthenticatingProvider(null);
  }, [clearSuccessTimers]);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      clearSuccessTimers();
    };
  }, [clearSuccessTimers]);

  useEffect(() => {
    if (shellRef.current) {
      gsap.fromTo(
        shellRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }
      );
    }
  }, [step]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!mountedRef.current) return;

      const wantDetails =
        typeof window !== "undefined" &&
        sessionStorage.getItem(OPENROOT_PROFILE_DETAILS_KEY) === "1";

      if (user) {
        const uName = getUsername(user);
        setUserData(user);
        setUsername(uName);
        syncUserSession(user, uName);

        if (wantDetails) {
          try {
            sessionStorage.removeItem(OPENROOT_PROFILE_DETAILS_KEY);
          } catch {
            // ignore
          }
        }

        setStep((prev) => (prev === "success" || prev === "error" ? prev : "profile"));
        onLogin?.(user);
        return;
      }

      setUserData(null);
      setUsername("guest@openroot");
      clearUserSession();
      setStep((prev) => (prev === "success" || prev === "error" ? prev : "initial"));
    });

    return unsubscribe;
  }, [onLogin]);

  useEffect(() => {
    if (step !== "success") {
      clearSuccessTimers();
      return;
    }

    clearSuccessTimers();
    setCountdown(5);

    successIntervalRef.current = setInterval(() => {
      setCountdown((current) => Math.max(current - 1, 0));
    }, 1000);

    successTimerRef.current = setTimeout(() => {
      if (mountedRef.current && step === "success") {
        onClose?.();
      }
    }, 5000);

    return clearSuccessTimers;
  }, [step, onClose, clearSuccessTimers]);

  const handleOAuthLogin = useCallback(
    async (provider: AuthProvider, providerName: ProviderName) => {
      const requestId = ++loginRequestIdRef.current;

      setAuthenticatingProvider(providerName);
      setErrorMessage("");

      try {
        const result = await signInWithPopup(auth, provider);
        if (!mountedRef.current || requestId !== loginRequestIdRef.current) return;

        const user = result.user;
        const uName = getUsername(user);

        setUserData(user);
        setUsername(uName);
        syncUserSession(user, uName);
        setStep("success");
        onLogin?.(user);
      } catch (error: unknown) {
        if (!mountedRef.current || requestId !== loginRequestIdRef.current) return;

        console.error(`LOGIN ERROR (${providerName}):`, error);
        setErrorMessage(getFirebaseErrorMessage(error));
        setStep("error");
      } finally {
        if (mountedRef.current && requestId === loginRequestIdRef.current) {
          setAuthenticatingProvider(null);
        }
      }
    },
    [onLogin]
  );

  const handleLogout = useCallback(async () => {
    setErrorMessage("");

    try {
      await signOut(auth);
      if (!mountedRef.current) return;

      setUserData(null);
      setUsername("guest@openroot");
      clearUserSession();
      onLogout?.();
      resetToInitial();
      onClose?.();
    } catch (error: unknown) {
      if (!mountedRef.current) return;

      console.error("LOGOUT ERROR:", error);
      setErrorMessage((error as Error)?.message || "Logout failed. Please try again.");
      setStep("error");
    }
  }, [onClose, onLogout, resetToInitial]);

  const handleFacebookLogin = useCallback(() => {
    if (isRestrictedBrowser()) {
      setErrorMessage(
        "Facebook login is not supported in this in-app browser. Please open the site in Chrome or Safari and try again."
      );
      setStep("error");
      return;
    }

    void handleOAuthLogin(facebookProvider, "facebook");
  }, [handleOAuthLogin]);

  if (step === "loading") {
    return (
      <div className="auth-overlay">
        <div className="auth-shell">
          <div className="auth-card auth-center" ref={shellRef}>
            <p>Authenticating…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-overlay" role="presentation">
      <div
        className="auth-shell"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-modal-title"
        ref={shellRef}
      >
        {step !== "success" && step !== "error" && (
          <button className="modal-close" onClick={onClose} aria-label="Close modal">
            ×
          </button>
        )}

        <div className="auth-card">
          <span className="ue-corner ue-corner--tl" />
          <span className="ue-corner ue-corner--tr" />
          <span className="ue-corner ue-corner--bl" />
          <span className="ue-corner ue-corner--br" />

          <div className="auth-left">
            <div className="auth-brand">
              <img src="/logo-nobg.png" alt="Openroot" />
            </div>

            {step === "initial" && (
              <div className="auth-content">
                <h2 id="login-modal-title">Welcome to The World of Smart People</h2>
                <p>Sign in to continue to your dashboard and profile.</p>

                <div className="auth-buttons">
                  <button
                    className="btn google"
                    onClick={() => void handleOAuthLogin(googleProvider, "google")}
                    disabled={isAuthenticating}
                    aria-busy={authenticatingProvider === "google"}
                  >
                    <span className="btn-icon">
                      <GoogleIcon />
                    </span>
                    <span className="btn-label">
                      {authenticatingProvider === "google"
                        ? "Connecting…"
                        : "Continue with Google"}
                    </span>
                  </button>

                  <button
                    className="btn facebook"
                    onClick={handleFacebookLogin}
                    disabled={isAuthenticating}
                    aria-busy={authenticatingProvider === "facebook"}
                  >
                    <span className="btn-icon">
                      <FacebookIcon />
                    </span>
                    <span className="btn-label">
                      {authenticatingProvider === "facebook"
                        ? "Connecting…"
                        : "Continue with Facebook"}
                    </span>
                  </button>

                  <button
                    className="btn github"
                    onClick={() => void handleOAuthLogin(githubProvider, "github")}
                    disabled={isAuthenticating}
                    aria-busy={authenticatingProvider === "github"}
                  >
                    <span className="btn-icon">
                      <GitHubIcon />
                    </span>
                    <span className="btn-label">
                      {authenticatingProvider === "github"
                        ? "Connecting…"
                        : "Continue with GitHub"}
                    </span>
                  </button>
                </div>

                <div className="auth-terms">
                  By continuing you agree to the Terms &amp; Privacy Policy
                </div>
              </div>
            )}

            {step === "success" && (
              <div className="auth-center">
                <Lottie animationData={successAnimation} loop={false} autoplay />
                <p>Login successful!</p>
                <p>
                  Closing in <strong>{Math.max(countdown, 0)}s</strong>
                </p>
              </div>
            )}

            {step === "error" && (
              <div className="auth-center">
                <Lottie animationData={failedAnimation} loop={false} autoplay />
                <p>{errorMessage}</p>
                <button className="btn retry" onClick={resetToInitial}>
                  <span className="btn-icon">
                    <RetryIcon />
                  </span>
                  <span className="btn-label">Try Again</span>
                </button>
              </div>
            )}

            {step === "profile" && userData && (
              <div className="auth-profile auth-profile--enhanced">
                {getProfilePhoto(userData) ? (
                  <img
                    src={getProfilePhoto(userData)!}
                    className="profile-avatar-lg"
                    alt="User avatar"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="avatar-fallback-lg" aria-hidden="true">
                    <span>{getInitial(userData.displayName)}</span>
                  </div>
                )}

                <div className="profile-verified">
                  <VerifiedBadgeIcon />
                  <span>Verified User</span>
                </div>

                <h3>{safe(userData.displayName, "OpenRoot User")}</h3>

                <p className="profile-row">
                  Email ID: <strong>{safe(userData.email, "No email linked")}</strong>
                </p>

                <p className="profile-row">
                  Username: <strong>{username}</strong>
                </p>

                {userData.phoneNumber && (
                  <p className="profile-row">
                    Phone: <strong>{safe(userData.phoneNumber)}</strong>
                  </p>
                )}

                <button
                  className="btn logout"
                  onClick={() => setStep("confirmLogout")}
                  disabled={isAuthenticating}
                >
                  <span className="btn-icon">
                    <LogoutIcon />
                  </span>
                  <span className="btn-label">Logout</span>
                </button>
              </div>
            )}

            {step === "confirmLogout" && (
              <div className="auth-center">
                <h3>Confirm Logout</h3>
                <button
                  className="btn logout"
                  onClick={() => void handleLogout()}
                  disabled={isAuthenticating}
                >
                  <span className="btn-icon">
                    <LogoutIcon />
                  </span>
                  <span className="btn-label">Yes, Logout</span>
                </button>
                <button className="btn retry" onClick={() => setStep("profile")}>
                  <span className="btn-icon">
                    <RetryIcon />
                  </span>
                  <span className="btn-label">Cancel</span>
                </button>
              </div>
            )}
          </div>

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
              <path className="primary" d="M 170 73 C 240 73, 180 196, 210 196" />
              <text className="wire-label" x="205" y="126">
                check_token
              </text>

              <path className="mid" d="M 330 196 C 380 196, 380 331, 50 331" />
              <text className="wire-label" x="295" y="268">
                id_token
              </text>

              <path className="primary" d="M 170 331 C 240 331, 180 459, 210 459" />
              <text className="wire-label" x="195" y="389">
                uid + claims
              </text>

              <circle className="wire-dot" cx="205" cy="134" r="3" />
              <circle className="wire-dot wire-dot--mid" cx="375" cy="263" r="3" />
              <circle className="wire-dot" cx="200" cy="395" r="3" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
});