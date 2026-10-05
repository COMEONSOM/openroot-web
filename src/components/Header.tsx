/**
 * ============================================================
 * HEADER COMPONENT — OPENROOT
 * Redesigned to match the About / GDrive / login modal system.
 * Logic is unchanged: auth listener, admin session sync, profile
 * routing and the login-type chooser.
 * ============================================================
 */

import { useState, useEffect, useCallback, useRef, memo } from "react";

import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "../lib/firebase";

import { Link, useNavigate } from "react-router-dom";

import "./styles/Header.css";

// ── Constants ─────────────────────────────────────────────────
const ADMIN_SESSION_KEY = "openrootAdmin";
const ADMIN_SESSION_SYNC_EVENT = "openroot-admin-session-sync";

// Fired by the login / admin modals once they are on screen, so the chooser can
// hand over to them without the page behind flashing in between.
const AUTH_MODAL_READY_EVENT = "openroot-auth-modal-ready";

// Two logo files, one per theme. Both live in /public/assets.
// The light-mode logo is the black one, the dark-mode logo is the white one.
const LOGO_LIGHT_SRC = "/assets/openroot-withoutbg.png";
const LOGO_DARK_SRC = "/assets/openroot-white-nobg.png";

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

// Providers hand out a tiny avatar (Google defaults to 96px). Ask for a larger
// one so it stays sharp on high-density screens.
const getHighResPhoto = (user: User): string => {
  const url = user.photoURL ?? "";
  try {
    if (/googleusercontent\.com/.test(url)) {
      return url.replace(/=s\d+(-c)?$/, "=s256-c");
    }
    if (user.providerData?.[0]?.providerId === "facebook.com") {
      return `${url}${url.includes("?") ? "&" : "?"}height=256&width=256`;
    }
    if (/avatars\.githubusercontent\.com/.test(url)) {
      const u = new URL(url);
      u.searchParams.set("s", "256");
      return u.toString();
    }
  } catch {
    // fall through to the original URL
  }
  return url;
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

// ── Icons ──────────────────────────────────────────────────────
const UserIcon = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
));
UserIcon.displayName = "UserIcon";

const ShieldIcon = memo(() => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    <path d="M9 12l2 2 4-4" />
  </svg>
));
ShieldIcon.displayName = "ShieldIcon";

// ── User avatar ────────────────────────────────────────────────
const UserAvatar = memo(({ user, admin }: UserAvatarProps) => {
  if (!user && !admin) return null;

  const initial = admin
    ? "A"
    : (user?.displayName?.charAt(0)?.toUpperCase() ?? "U");

  if (user?.photoURL && !admin) {
    return (
      <img
        src={getHighResPhoto(user)}
        alt=""
        className="openroot-header__avatar"
        referrerPolicy="no-referrer"
        width={84}
        height={84}
        decoding="async"
      />
    );
  }

  return (
    <span
      className="openroot-header__avatar openroot-header__avatar--fallback"
      aria-hidden="true"
    >
      {initial}
    </span>
  );
});
UserAvatar.displayName = "UserAvatar";

// ── Header ─────────────────────────────────────────────────────
const Header = () => {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(null);
  const [admin, setAdmin] = useState<AdminData | null>(() => readAdminSession());
  const [showLoginChoice, setShowLoginChoice] = useState(false);
  const [pending, setPending] = useState<"user" | "admin" | null>(null);
  const pendingRef = useRef(false);

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

  // Close the chooser with Escape (clicking outside still does not close it)
  useEffect(() => {
    if (!showLoginChoice) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !pendingRef.current) closeModal();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showLoginChoice, closeModal]);

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

  // Keep the chooser on screen while the next modal loads and mounts, then
  // remove it once the new modal has painted (both share the same opaque
  // backdrop, so the swap is not visible).
  const goAuth = useCallback(
    (kind: "user" | "admin", path: string) => {
      if (pendingRef.current) return;
      pendingRef.current = true;
      setPending(kind);

      let timer: ReturnType<typeof setTimeout>;
      const finish = () => {
        window.removeEventListener(AUTH_MODAL_READY_EVENT, finish);
        clearTimeout(timer);
        requestAnimationFrame(() =>
          requestAnimationFrame(() => {
            pendingRef.current = false;
            setPending(null);
            setShowLoginChoice(false);
          })
        );
      };

      window.addEventListener(AUTH_MODAL_READY_EVENT, finish);
      timer = setTimeout(finish, 1500); // safety net
      navigate(path);
    },
    [navigate]
  );

  const showProfileButton = Boolean(user || admin);

  return (
    <>
      <header className="openroot-header">
        <Link
          to="/"
          className="openroot-header__logo"
          aria-label="Openroot home"
        >
          {/* Both images carry width/height so no layout shift; CSS shows the
              one that matches the active theme. */}
          <img
            className="openroot-header__logo-img openroot-header__logo-img--light"
            src={LOGO_LIGHT_SRC}
            alt=""
            decoding="async"
            width={197}
            height={45}
          />
          <img
            className="openroot-header__logo-img openroot-header__logo-img--dark"
            src={LOGO_DARK_SRC}
            alt=""
            decoding="async"
            width={197}
            height={45}
          />
        </Link>

        {!showProfileButton ? (
          <button
            type="button"
            className="openroot-header__login"
            onClick={() => setShowLoginChoice(true)}
          >
            Login
          </button>
        ) : (
          <button
            type="button"
            className="openroot-header__profile"
            onClick={openProfile}
            aria-label="Open profile"
          >
            <UserAvatar user={user} admin={admin} />
          </button>
        )}
      </header>

      {/* Login type chooser */}
      {showLoginChoice && (
        <div className="openroot-choice">
          <div
            className="openroot-choice__card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="choice-title"
          >
            <div className="openroot-choice__bar">
              <span className="openroot-choice__bar-title">Login</span>
              <button
                type="button"
                className="openroot-choice__close"
                onClick={closeModal}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="openroot-choice__body">
              <div>
                <span className="openroot-choice__label">Openroot account</span>
                <h2 id="choice-title" className="openroot-choice__h2">
                  Choose how to sign in.
                </h2>
              </div>

              <div className="openroot-choice__options">
                <button
                  type="button"
                  className="openroot-choice__option"
                  onClick={() => goAuth("user", "/userlogin")}
                  disabled={pending !== null}
                  aria-busy={pending === "user"}
                >
                  <span className="openroot-choice__icon openroot-choice__icon--blue">
                    <UserIcon />
                  </span>
                  <span className="openroot-choice__copy">
                    <strong>{pending === "user" ? "Opening…" : "Continue as user"}</strong>
                    <span>Sign in with Google, Facebook or GitHub.</span>
                  </span>
                </button>

                <button
                  type="button"
                  className="openroot-choice__option"
                  onClick={() => goAuth("admin", "/adminlogin")}
                  disabled={pending !== null}
                  aria-busy={pending === "admin"}
                >
                  <span className="openroot-choice__icon openroot-choice__icon--ink">
                    <ShieldIcon />
                  </span>
                  <span className="openroot-choice__copy">
                    <strong>{pending === "admin" ? "Opening…" : "Continue as admin"}</strong>
                    <span>Authorised personnel only.</span>
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default memo(Header);