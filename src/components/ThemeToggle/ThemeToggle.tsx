// ============================================================
// FLOATING THEME TOGGLE
// Consumes useTheme() from ThemeContext.
// CSS in ./ThemeToggle.css — uses --ot-* tokens from App.css.
// GSAP owns transform; CSS transition intentionally excludes it.
// ============================================================

import { useRef, useCallback }        from "react";
import gsap                            from "gsap";
import { useTheme }                    from "../../context/ThemeContext";
import type { ThemeMode }              from "../../context/ThemeContext";
import "./ThemeToggle.css";

// ─── Types ────────────────────────────────────────────────
type Position =
  | "bottom-right" | "bottom-left"
  | "top-right"    | "top-left"
  | "middle-right" | "middle-left";

interface ThemeToggleProps {
  position?:  Position;
  offset?:    number;
}

// ─── Icons ────────────────────────────────────────────────
const SunIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <circle cx="12" cy="12" r="5" />
    <line x1="12"    y1="1"     x2="12"    y2="3"     />
    <line x1="12"    y1="21"    x2="12"    y2="23"    />
    <line x1="4.22"  y1="4.22"  x2="5.64"  y2="5.64"  />
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
    <line x1="1"     y1="12"    x2="3"     y2="12"    />
    <line x1="21"    y1="12"    x2="23"    y2="12"    />
    <line x1="4.22"  y1="19.78" x2="5.64"  y2="18.36" />
    <line x1="18.36" y1="5.64"  x2="19.78" y2="4.22"  />
  </svg>
);

const MoonIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
  </svg>
);

const SystemIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2"
    strokeLinecap="round" strokeLinejoin="round"
    aria-hidden="true">
    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
    <line x1="8"  y1="21" x2="16" y2="21" />
    <line x1="12" y1="17" x2="12" y2="21" />
  </svg>
);

// ─── Meta — icon + labels keyed by mode ───────────────────
const THEME_META: Record<ThemeMode, {
  icon:  React.ReactElement;
  next:  string;
}> = {
  light:  { icon: <SunIcon />, next: "Switch to dark mode"   },
  dark:   { icon: <MoonIcon />, next: "Switch to system mode" },
  system: { icon: <SystemIcon />, next: "Switch to light mode"  },
};

// ─── Component ────────────────────────────────────────────
export function ThemeToggle({
  position  = "bottom-right",
  offset    = 24,
}: ThemeToggleProps) {
  const { mode, resolved, cycleTheme } = useTheme();
  const btnRef = useRef<HTMLButtonElement | null>(null);

  const meta = THEME_META[mode];

  // GSAP press-feedback — scale bounce on click
  const handleClick = useCallback(() => {
    if (btnRef.current) {
      gsap.fromTo(
        btnRef.current,
        { scale: 1 },
        {
          scale: 0.91,
          duration: 0.10,
          ease: "power2.in",
          onComplete: () => {
            gsap.to(btnRef.current, {
              scale: 1,
              duration: 0.22,
              ease: "elastic.out(1.3, 0.5)",
            });
          },
        }
      );
    }
    cycleTheme();
  }, [cycleTheme]);

  return (
    <button
      ref={btnRef}
      className={`theme-toggle theme-toggle--${position}`}
      style={{ "--tt-offset": `${offset}px` } as React.CSSProperties}
      onClick={handleClick}
      aria-label={meta.next}
      title={meta.next}
      data-resolved={resolved}
      data-mode={mode}
      type="button"
    >
      <span className="theme-toggle__icon">{meta.icon}</span>
    </button>
  );
}