/**
 * ============================================================
 * HEADER COMPONENT — OPENROOT (PRODUCTION READY)
 * LOGIN → PROFILE → LOGOUT FLOW + LOTTIE LOGIN ANIMATION
 * ============================================================
 */

import {
  useState,
  useEffect,
  useCallback,
  memo,
  lazy,
  Suspense,
} from "react";
import { onAuthStateChanged, User } from "firebase/auth";

import { auth } from "../lib/firebase";
import LoginModal from "./LoginModal";
import "./styles/Header.css";

/* ⭐ Lazy-load Lottie for performance */
const Lottie = lazy(() => import("lottie-react"));
import loginAnimation from "../animations/login.json";

/**
 * ============================================================
 * SAFE AUTH LISTENER — prevents memory leaks
 * ============================================================
 */
const useSafeAuthListener = (setUser: (u: User | null) => void) => {
  useEffect(() => {
    let mounted = true;

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (mounted) setUser(firebaseUser ?? null);
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, [setUser]);
};

/**
 * ============================================================
 * USER AVATAR COMPONENT (MEMOIZED)
 * ============================================================
 */
interface UserAvatarProps {
  user: User | null;
}

const UserAvatar = memo(({ user }: UserAvatarProps) => {
  if (!user) return null;

  const initial =
    user.displayName?.charAt(0)?.toUpperCase() ?? "U";

  if (user.photoURL) {
    return (
      <img
        src={user.photoURL}
        alt="User avatar"
        className="profile-avatar"
        draggable={false}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.style.display = "none";
        }}
      />
    );
  }

  return (
    <div className="avatar-fallback" aria-hidden="true">
      {initial}
    </div>
  );
});

UserAvatar.displayName = "UserAvatar";

/**
 * ============================================================
 * HEADER COMPONENT
 * ============================================================
 */
const Header = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useSafeAuthListener(setUser);

  /**
   * When login succeeds
   */
  const handleLoginSuccess = useCallback(
    (firebaseUser: User) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      }
    },
    []
  );

  /**
   * Open profile inside LoginModal
   * (same behavior as your other project)
   */
  const openProfile = useCallback(() => {
    sessionStorage.setItem("openrootOpenProfileDetails", "1");
    setIsLoginOpen(true);
  }, []);

  /**
   * Open login modal normally
   */
  const openLogin = useCallback(() => {
    setIsLoginOpen(true);
  }, []);

  return (
    <>
      <header className="header" role="banner">
        {/* LOGO */}
        <div className="header-logo">
          <img
            src="/assets/openroot-white-nobg.png"
            alt="Openroot Logo"
            className="header-logo-img"
            draggable={false}
            loading="eager"
          />
        </div>

        {/* RIGHT SIDE */}
        <div className="header-right">
          {!user ? (
            /* LOGIN WITH LOTTIE */
            <button
              className="login-animation"
              onClick={openLogin}
              aria-label="Open login modal"
              type="button"
            >
              <Suspense
                fallback={
                  <span className="login-hint">
                    Sign In
                  </span>
                }
              >
                <Lottie
                  animationData={loginAnimation}
                  loop
                  autoplay
                  className="login-lottie"
                />
              </Suspense>

              <span className="login-hint">
                SIGN IN →
              </span>
            </button>
          ) : (
            /* PROFILE AVATAR */
            <button
              className="profile-button"
              onClick={openProfile}
              aria-label="Open profile"
              type="button"
            >
              <UserAvatar user={user} />
            </button>
          )}
        </div>
      </header>

      {/* LOGIN MODAL */}
      {isLoginOpen && (
        <LoginModal
          onClose={() => setIsLoginOpen(false)}
          onLogin={handleLoginSuccess}
        />
      )}
    </>
  );
};

export default memo(Header);
