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

// ─── Apply data-theme to <html> ───────────────────────────
function applyTheme(mode: ThemeMode): void {
  const root = document.documentElement;
  if (mode === "system") {
    root.removeAttribute("data-theme");
  } else {
    root.setAttribute("data-theme", mode);
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
    const stored = (localStorage.getItem(STORAGE_KEY) as ThemeMode) ?? "system";
    // Apply immediately — prevents flash of wrong theme
    applyTheme(stored);
    return stored;
  });

  const [sysDark, setSysDark] = useState<boolean>(
    () => window.matchMedia("(prefers-color-scheme: dark)").matches
  );

  // Listen to OS preference — only relevant when mode === "system"
  useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (e: MediaQueryListEvent) => setSysDark(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
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
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const setTheme = useCallback((newMode: ThemeMode) => {
    applyTheme(newMode);
    localStorage.setItem(STORAGE_KEY, newMode);
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