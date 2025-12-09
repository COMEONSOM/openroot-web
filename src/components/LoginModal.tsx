// ============================================================
// HANDLES OAUTH (GOOGLE/FACEBOOK/GITHUB), PROFILE VIEW, LOGOUT
// ALWAYS RETURNS RAW FIREBASE USER VIA onLogin(user)
// VERSION: 2025.8 — FULL TYPESCRIPT + REACT 19 COMPATIBLE
// src/components/LoginModal.tsx
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

// TS Props
interface LoginModalProps {
  onClose?: () => void;
  onLogin?: (user: User) => void;
  onLogout?: () => void;
}

export default function LoginModal({
  onClose,
  onLogin,
  onLogout,
}: LoginModalProps) {
  const [step, setStep] = useState<
    "loading" | "initial" | "profile" | "success" | "error" | "confirmLogout"
  >("loading");
  const [userData, setUserData] = useState<User | null>(null);
  const [username, setUsername] = useState("guest@openroot");
  const [showDetails, setShowDetails] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [errorMessage, setErrorMessage] = useState("");

  const modalRef = useRef<HTMLDivElement | null>(null);

  const getUsername = (user: User) => {
    if (user?.email) return user.email.split("@")[0] + "@openroot";
    if (user?.phoneNumber)
      return user.phoneNumber.replace(/[^0-9]/g, "") + "@openroot";
    return "guest@openroot";
  };

  const getInitial = (name?: string | null) =>
    name ? name.charAt(0).toUpperCase() : "O";

  const safe = (value: string | null | undefined, fb = "Not specified") =>
    value || fb;

  // GSAP ENTRY ANIMATION
  useEffect(() => {
    if (step !== "loading" && modalRef.current) {
      gsap.fromTo(
        modalRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.45, ease: "power2.out" }
      );
    }
  }, [step]);

  // AUTH SUBSCRIBE
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      const wantDetails =
        typeof window !== "undefined" &&
        sessionStorage.getItem("openrootOpenProfileDetails") === "1";

      if (user) {
        setUserData(user);
        const uName = getUsername(user);
        setUsername(uName);

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("openrootUserUID", user.uid);
        sessionStorage.setItem("openrootUser", uName);
        sessionStorage.setItem("openrootUserUID", user.uid);

        setStep((prev) =>
          prev === "success" || prev === "error" ? prev : "profile"
        );
        setShowDetails(wantDetails);

        if (wantDetails)
          sessionStorage.removeItem("openrootOpenProfileDetails");

        onLogin?.(user);
      } else {
        setUserData(null);
        setUsername("guest@openroot");
        setShowDetails(false);

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

  // SUCCESS COUNTDOWN
  useEffect(() => {
    if (step === "success") {
      setCountdown(5);
      const interval = setInterval(() => setCountdown((s) => s - 1), 1000);

      const timeout = setTimeout(() => {
        onClose?.();
        window.location.assign(window.location.origin);
      }, 5000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [step, onClose]);

  // LOGIN HANDLER
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
      if (error?.code === "auth/popup-closed-by-user") msg = "Login cancelled.";
      else if (
        error?.code === "auth/account-exists-with-different-credential"
      )
        msg =
          "This email is already registered with a different provider. Use that provider.";

      setErrorMessage(msg);
      setStep("error");
    }
  };

  // LOGOUT HANDLER
  const handleLogout = async () => {
    try {
      await signOut(auth);
      setUserData(null);
      setUsername("guest@openroot");
      setShowDetails(false);
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

  // LOADING UI
  if (step === "loading") {
    return (
      <div className="modal-overlay">
        <div className="modal-container modal-loader" ref={modalRef}>
          <p>Authenticating…</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={(e) => {
        const target = e.target as HTMLElement | null;
        if (target?.classList?.contains("modal-overlay")) onClose?.();
      }}
    >
      <div className="modal-container" ref={modalRef} tabIndex={-1}>
        {/* CLOSE BUTTON */}
        {step !== "success" && step !== "error" && (
          <button
            className="modal-close"
            onClick={() => (showDetails ? setShowDetails(false) : onClose?.())}
          >
            &times;
          </button>
        )}

        {/* LOGIN OPTIONS */}
        {step === "initial" && (
          <div className="modal-content">
            <h2>Welcome Back</h2>
            <p>Continue with your preferred account:</p>

            <div className="oauth-buttons">
              <button onClick={() => handleOAuthLogin(googleProvider)}>
                Continue with Google
              </button>
              <button onClick={() => handleOAuthLogin(facebookProvider)}>
                Continue with Facebook
              </button>
              <button onClick={() => handleOAuthLogin(githubProvider)}>
                Continue with GitHub
              </button>
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {step === "success" && (
          <div className="success-container">
            <Lottie animationData={successAnimation} loop={false} autoplay />
            <p>Login successful!</p>
            <p>
              Redirecting in <strong>{Math.max(countdown, 0)}s</strong>…
            </p>
          </div>
        )}

        {/* ERROR */}
        {step === "error" && (
          <div className="success-container">
            <Lottie animationData={failedAnimation} loop={false} autoplay />
            <p>{errorMessage}</p>
            <button onClick={() => setStep("initial")}>Try Again</button>
          </div>
        )}

        {/* PROFILE */}
        {step === "profile" && userData && (
          <div>
            {!showDetails ? (
              <div
                className="profile-summary"
                role="button"
                aria-hidden="true"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDetails(true);
                }}
              >
                {userData.photoURL ? (
                  <img
                    src={userData.photoURL}
                    className="avatar"
                    alt="User avatar"
                  />
                ) : (
                  <div className="avatar-fallback" aria-hidden="true">
                    {getInitial(userData.displayName)}
                  </div>
                )}
                <p>{safe(userData.displayName, "Guest")}</p>
                <small>Username: {username}</small>
              </div>
            ) : (
              <div className="profile-details">
                {/* ✅ BIG AVATAR IN DETAILS VIEW */}
                {userData.photoURL ? (
                  <img
                    src={userData.photoURL}
                    className="avatar-lg"
                    alt="User avatar"
                  />
                ) : (
                  <div className="avatar-fallback-lg" aria-hidden="true">
                    {getInitial(userData.displayName)}
                  </div>
                )}

                <p>Name: {safe(userData.displayName)}</p>
                <p>Email: {safe(userData.email)}</p>
                <p>Phone: {safe(userData.phoneNumber)}</p>

                <button onClick={() => setStep("confirmLogout")}>
                  Log out
                </button>
              </div>
            )}
          </div>
        )}

        {/* CONFIRM LOGOUT */}
        {step === "confirmLogout" && (
          <div className="logout-confirmation">
            <h3>Confirm Logout</h3>
            <button onClick={handleLogout}>Yes, Logout</button>
            <button onClick={() => setStep("profile")}>Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
