/**
 * ============================================================
 * HEADER COMPONENT — OPENROOT
 * VERSION: 2026.10 — modal controlled close behavior
 * ============================================================
 */

import {
  useState,
  useEffect,
  useCallback,
  memo,
} from "react";

import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";

import {
  Link,
  useNavigate
} from "react-router-dom";

import "./styles/Header.css";

/**
 * ============================================================
 * CONSTANTS
 * ============================================================
 */

const ADMIN_SESSION_KEY = "openrootAdmin";
const ADMIN_SESSION_SYNC_EVENT = "openroot-admin-session-sync";

/**
 * ============================================================
 * TYPES
 * ============================================================
 */

interface AdminData {
  email: string;
  role: string;
  verified: boolean;
  username: string;
}

interface UserAvatarProps {
  user: User | null;
  admin?: AdminData | null;
}

/**
 * ============================================================
 * HELPERS
 * ============================================================
 */

const readAdminSession = (): AdminData | null => {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw);

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
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  localStorage.removeItem("adminLoggedIn");
};

const emitAdminSessionSync = () => {
  window.dispatchEvent(new Event(ADMIN_SESSION_SYNC_EVENT));
};

/**
 * ============================================================
 * AUTH LISTENER
 * ============================================================
 */

const useSafeAuthListener = (
  setUser: (u: User | null) => void
) => {
  useEffect(() => {
    let mounted = true;

    const unsub = onAuthStateChanged(auth, (firebaseUser) => {
      if (mounted) {
        setUser(firebaseUser ?? null);
      }
    });

    return () => {
      mounted = false;
      unsub();
    };
  }, [setUser]);
};

/**
 * ============================================================
 * USER AVATAR
 * ============================================================
 */

const UserAvatar = memo(({ user, admin }: UserAvatarProps) => {
  if (!user && !admin) return null;

  const initial = admin
    ? "A"
    : user?.displayName?.charAt(0)?.toUpperCase() || "U";

  if (user?.photoURL && !admin) {
    return (
      <img
        src={user.photoURL}
        alt="User avatar"
        className="profile-avatar"
        referrerPolicy="no-referrer"
      />
    );
  }

  return (
    <div className="avatar-fallback">
      {initial}
    </div>
  );
});

UserAvatar.displayName = "UserAvatar";

/**
 * ============================================================
 * HEADER
 * ============================================================
 */

const Header = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<AdminData | null>(() => readAdminSession());
  const [showLoginChoice, setShowLoginChoice] = useState(false);

  useSafeAuthListener(setUser);

  useEffect(() => {
    if (showLoginChoice) {
      document.body.classList.add("modal-open");
    } else {
      document.body.classList.remove("modal-open");
    }

    return () => {
      document.body.classList.remove("modal-open");
    };
  }, [showLoginChoice]);

  const syncAdmin = useCallback(() => {
    setAdmin(readAdminSession());
  }, []);

  useEffect(() => {
    window.addEventListener(ADMIN_SESSION_SYNC_EVENT, syncAdmin);

    return () => {
      window.removeEventListener(ADMIN_SESSION_SYNC_EVENT, syncAdmin);
    };
  }, [syncAdmin]);

  const handleAdminLogout = useCallback(() => {
    setAdmin(null);
    clearAdminSession();
    emitAdminSessionSync();
  }, []);

  const openProfile = useCallback(() => {
    if (admin) {
      navigate("/admin-login");
      return;
    }

    if (user) {
      sessionStorage.setItem("openrootOpenProfileDetails", "1");
      navigate("/user-login");
      return;
    }

    setShowLoginChoice(true);
  }, [admin, user, navigate]);

  const closeModal = useCallback(() => {
    setShowLoginChoice(false);
  }, []);

  const userLogin = useCallback(() => {
    closeModal();
    navigate("/user-login");
  }, [navigate, closeModal]);

  const adminLogin = useCallback(() => {
    closeModal();
    navigate("/admin-login");
  }, [navigate, closeModal]);

  useEffect(() => {
    if (!showLoginChoice) return;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeModal();
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [showLoginChoice, closeModal]);

  const showProfileButton = Boolean(user || admin);

  return (
    <>
      <header className="header">
        <div className="header-logo">
          <Link to="/">
            <img
              src="/assets/openroot-white-nobg.avif"
              className="header-logo-img"
              alt="Openroot"
              fetchPriority="high"
              decoding="async"
            />
          </Link>
        </div>

        <div className="header-right">
          {!showProfileButton ? (
            <button
              className="login-button"
              onClick={() => {
                setShowLoginChoice(true);
              }}
            >
              LOGIN →
            </button>
          ) : (
            <button
              className="profile-button"
              onClick={openProfile}
            >
              <UserAvatar user={user} admin={admin} />
            </button>
          )}
        </div>
      </header>

      {showLoginChoice && (
        <div
          className="login-choice-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Choose login type"
        >
          <div
            className="login-choice-modal"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <button
              type="button"
              className="login-modal-close"
              onClick={closeModal}
              aria-label="Close login modal"
            >
              ✕
            </button>

            <h2>Choose Login Type</h2>

            <button
              type="button"
              className="choice-btn"
              onClick={userLogin}
            >
              Continue as User
            </button>

            <button
              type="button"
              className="choice-btn admin"
              onClick={adminLogin}
            >
              Continue as Admin
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Header);