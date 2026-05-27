/**
 * ============================================================
 * HEADER COMPONENT — OPENROOT
 * VERSION: 2026.11 — fixed route paths + removed dead code
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

import { Link, useNavigate } from "react-router-dom";

import "./styles/Header.css";

// ── Constants ─────────────────────────────────────────────────
const ADMIN_SESSION_KEY = "openrootAdmin";
const ADMIN_SESSION_SYNC_EVENT = "openroot-admin-session-sync";

// ── Types ──────────────────────────────────────────────────────
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

// ── Helpers ────────────────────────────────────────────────────
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

// ── Auth listener ──────────────────────────────────────────────
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

// ── User avatar ────────────────────────────────────────────────
const UserAvatar = memo(({ user, admin }: UserAvatarProps) => {
  if (!user && !admin) return null;

  const initial = admin
    ? "A"
    : (user?.displayName?.charAt(0)?.toUpperCase() ?? "U");

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

  return <div className="avatar-fallback">{initial}</div>;
});
UserAvatar.displayName = "UserAvatar";

// ── Header ─────────────────────────────────────────────────────
const Header = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<AdminData | null>(() => readAdminSession());
  const [showLoginChoice, setShowLoginChoice] = useState(false);

  useSafeAuthListener(setUser);

  // Lock body scroll while chooser is open
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

  // Keep admin state in sync across components
  const syncAdmin = useCallback(() => setAdmin(readAdminSession()), []);

  useEffect(() => {
    window.addEventListener(ADMIN_SESSION_SYNC_EVENT, syncAdmin);
    return () => window.removeEventListener(ADMIN_SESSION_SYNC_EVENT, syncAdmin);
  }, [syncAdmin]);

  const closeModal = useCallback(() => setShowLoginChoice(false), []);

  // ── FIX: use canonical routes without hyphens ──────────────
  const openProfile = useCallback(() => {
    if (admin) {
      navigate("/adminlogin");
      return;
    }
    if (user) {
      sessionStorage.setItem("openrootOpenProfileDetails", "1");
      navigate("/userlogin");
      return;
    }
    setShowLoginChoice(true);
  }, [admin, user, navigate]);

  const goUserLogin = useCallback(() => {
    closeModal();
    navigate("/userlogin");
  }, [navigate, closeModal]);

  const goAdminLogin = useCallback(() => {
    closeModal();
    navigate("/adminlogin");
  }, [navigate, closeModal]);

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
              onClick={() => setShowLoginChoice(true)}
            >
              LOGIN →
            </button>
          ) : (
            <button className="profile-button" onClick={openProfile}>
              <UserAvatar user={user} admin={admin} />
            </button>
          )}
        </div>
      </header>

      {/* Login type chooser */}
      {showLoginChoice && (
        <div
          className="login-choice-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Choose login type"
        >
          <div
            className="login-choice-modal"
            onClick={(e) => e.stopPropagation()}
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
              onClick={goUserLogin}
            >
              Continue as User
            </button>

            <button
              type="button"
              className="choice-btn admin"
              onClick={goAdminLogin}
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