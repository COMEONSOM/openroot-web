// ============================================================
// LOGIN MODAL — OPENROOT PREMIUM SPLIT PANEL
// LOGIC PRESERVED + RACE CONDITION FIXED
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

  // ✅ Timer refs to prevent race conditions
  const successTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const successIntervalRef =
    useRef<ReturnType<typeof setInterval> | null>(null);

  // ============================================================
  // HELPERS
  // ============================================================

  const getUsername = (user: User) => {
    // 1️⃣ Email based
    if (user?.email) {
      return user.email.split("@")[0].toLowerCase() + "@openroot";
    }

    // 2️⃣ Phone based
    if (user?.phoneNumber) {
      return (
        user.phoneNumber.replace(/[^0-9]/g, "") + "@openroot"
      );
    }

    // 3️⃣ Facebook / OAuth name based
    if (user?.displayName) {
      return (
        user.displayName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "")
          .slice(0, 16) + "@openroot"
      );
    }

    // 4️⃣ Fallback unique guest
    return `guest${user.uid.slice(0, 5)}@openroot`;
  };

  const getInitial = (name?: string | null) =>
    name ? name.charAt(0).toUpperCase() : "O";

  const safe = (value: string | null | undefined, fb = "Not specified") =>
    value || fb;

  const getProfilePhoto = (user: User) => {
    if (!user.photoURL) return null;

    // Facebook usually supports higher resolution via ?height & ?width
    if (user.providerData?.[0]?.providerId === "facebook.com") {
      return `${user.photoURL}?height=400&width=400`;
    }

    return user.photoURL;
  };

  // ============================================================
  // BROWSER DETECTION (BLOCK FACEBOOK REDIRECT BUG)
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

        // Do NOT override success/error transitions
        setStep((prev) =>
          prev === "success" || prev === "error" ? prev : "profile"
        );

        if (wantDetails) {
          sessionStorage.removeItem("openrootOpenProfileDetails");
        }

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
  // ✅ FIXED SUCCESS COUNTDOWN (NO RACE CONDITIONS)
  // ============================================================

  useEffect(() => {
    // Clear timers whenever leaving success state
    if (step !== "success") {
      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }

      if (successIntervalRef.current) {
        clearInterval(successIntervalRef.current);
        successIntervalRef.current = null;
      }

      return;
    }

    // Start countdown
    setCountdown(5);

    successIntervalRef.current = setInterval(() => {
      setCountdown((s) => s - 1);
    }, 1000);

    successTimerRef.current = setTimeout(() => {
      if (step === "success") {
        onClose?.(); // ✅ Close modal only — NO PAGE RELOAD
      }
    }, 5000);

    return () => {
      if (successIntervalRef.current) {
        clearInterval(successIntervalRef.current);
        successIntervalRef.current = null;
      }

      if (successTimerRef.current) {
        clearTimeout(successTimerRef.current);
        successTimerRef.current = null;
      }
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
    } catch (error: any) {
      console.error("LOGIN ERROR:", error);

      let msg = "Login failed. Please try again.";

      if (error?.code === "auth/popup-closed-by-user")
        msg = "Login cancelled.";
      else if (
        error?.code === "auth/account-exists-with-different-credential"
      )
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
    } catch (err: any) {
      setErrorMessage(err.message || "Logout failed");
      setStep("error");
    }
  };

  // ============================================================
  // LOADING STATE
  // ============================================================

  if (step === "loading") {
    return (
      <div className="auth-overlay">
        <div className="auth-card auth-center" ref={modalRef}>
          <p>Authenticating…</p>
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
        const target = e.target as HTMLElement | null;
        if (target?.classList?.contains("auth-overlay")) onClose?.();
      }}
    >
      <div className="auth-card" ref={modalRef}>
        {/* ================= LEFT PANEL ================= */}
        <div className="auth-left">
          {/* BRAND */}
          <div className="auth-brand">
            <img src="./logo-nobg.png" alt="Openroot" />
          </div>

          {/* CLOSE */}
          {step !== "success" && step !== "error" && (
            <button className="modal-close" onClick={onClose}>
              ×
            </button>
          )}

          {/* LOGIN */}
          {step === "initial" && (
            <div className="auth-content">
              <h2>Welcome to the World of Smart People</h2>
              <p>Begin your journey by completing your profile.</p>

              <div className="auth-buttons">
                <button
                  className="btn google"
                  onClick={() => handleOAuthLogin(googleProvider)}
                >
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


                <button
                  className="btn github"
                  onClick={() => handleOAuthLogin(githubProvider)}
                >
                  Continue with GitHub
                </button>
              </div>

              <div className="auth-terms">
                By continuing you agree to our Terms & Privacy Policy
              </div>
            </div>
          )}

          {/* SUCCESS */}
          {step === "success" && (
            <div className="auth-center">
              <Lottie animationData={successAnimation} loop={false} autoplay />
              <p>Login successful!</p>
              <p>
                Redirecting in <strong>{Math.max(countdown, 0)}s</strong>
              </p>
            </div>
          )}

          {/* ERROR */}
          {step === "error" && (
            <div className="auth-center">
              <Lottie animationData={failedAnimation} loop={false} autoplay />
              <p>{errorMessage}</p>
              <button className="btn retry" onClick={() => setStep("initial")}>
                Try Again
              </button>
            </div>
          )}

          {/* PROFILE */}
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
                📩 Email Id: {safe(userData.email, "No email linked")}
              </p>

              <p className="profile-row">
                👤 Username: <strong>{username}</strong>
              </p>

              {userData.phoneNumber && (
                <p className="profile-row">
                  📱 Phone: {safe(userData.phoneNumber)}
                </p>
              )}

              <button
                className="btn logout"
                onClick={() => setStep("confirmLogout")}
              >
                Logout
              </button>
            </div>
          )}

          {/* CONFIRM LOGOUT */}
          {step === "confirmLogout" && (
            <div className="auth-center">
              <h3>Confirm Logout</h3>
              <button className="btn logout" onClick={handleLogout}>
                Yes, Logout
              </button>
              <button
                className="btn retry"
                onClick={() => setStep("profile")}
              >
                Cancel
              </button>
            </div>
          )}
        </div>

        {/* ================= RIGHT PANEL ================= */}
        <div className="auth-right">
          <div className="auth-illustration" />
        </div>
      </div>
    </div>
  );
}
