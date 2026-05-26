// ============================================================
// THEME CONTEXT — single source of truth for the entire app
// Cycle: light → dark → system → light
// Applies data-theme to <html> immediately on every change.
// ============================================================

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type ThemeMode = "light" | "dark" | "system";

const STORAGE_KEY = "ot-theme-mode";
const LEGACY_STORAGE_KEY = "ot-theme";
const THEME_MODES: ThemeMode[] = ["light", "dark", "system"];

// ─── Apply data-theme to <html> ───────────────────────────
function applyTheme(mode: ThemeMode): void {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (mode === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", mode);
  }
}

function isThemeMode(value: string | null): value is ThemeMode {
  return value !== null && THEME_MODES.includes(value as ThemeMode);
}

function readStoredMode(): ThemeMode {
  if (typeof window === "undefined") return "system";

  try {
    const savedMode = localStorage.getItem(STORAGE_KEY);
    if (isThemeMode(savedMode)) return savedMode;

    const legacyMode = localStorage.getItem(LEGACY_STORAGE_KEY);
    if (legacyMode === "light" || legacyMode === "dark") return legacyMode;
  } catch {
    return "system";
  }

  return "system";
}

function writeStoredMode(mode: ThemeMode): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, mode);
    if (mode === "system") {
      localStorage.removeItem(LEGACY_STORAGE_KEY);
    } else {
      localStorage.setItem(LEGACY_STORAGE_KEY, mode);
    }
  } catch {
    // Ignore storage errors in private mode / restricted browsers.
  }
}

function getSystemPrefersDark(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
    return false;
  }

  try {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  } catch {
    return false;
  }
}

// ─── Context shape ────────────────────────────────────────
interface ThemeContextValue {
  mode:       ThemeMode;
  resolved:   "light" | "dark";
  cycleTheme: () => void;
  setTheme:   (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

// ─── Provider ─────────────────────────────────────────────
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<ThemeMode>(() => {
    const stored = readStoredMode();
    // Apply immediately — prevents flash of wrong theme
    applyTheme(stored);
    return stored;
  });

  const [sysDark, setSysDark] = useState<boolean>(getSystemPrefersDark);

  // Listen to OS preference — only relevant when mode === "system"
  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") {
      return;
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setSysDark(e.matches);

    if (typeof mq.addEventListener === "function") {
      mq.addEventListener("change", onChange);
      return () => mq.removeEventListener("change", onChange);
    }

    mq.addListener(onChange);
    return () => mq.removeListener(onChange);
  }, []);

  // Re-apply when sysDark changes while in system mode
  useEffect(() => {
    if (mode === "system") applyTheme("system");
  }, [sysDark, mode]);

  const resolved = useMemo<"light" | "dark">(() => {
    if (mode === "dark")  return "dark";
    if (mode === "light") return "light";
    return sysDark ? "dark" : "light";
  }, [mode, sysDark]);

  const cycleTheme = useCallback(() => {
    setMode(prev => {
      const next: ThemeMode =
        prev === "light"  ? "dark"   :
        prev === "dark"   ? "system" :
                            "light";
      applyTheme(next);                          // ← critical: runs synchronously
      writeStoredMode(next);
      return next;
    });
  }, []);

  const setTheme = useCallback((newMode: ThemeMode) => {
    applyTheme(newMode);
    writeStoredMode(newMode);
    setMode(newMode);
  }, []);

  return (
    <ThemeContext.Provider value={{ mode, resolved, cycleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ─── Hook ─────────────────────────────────────────────────
export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}
