"use client";

import { createContext, useContext, useSyncExternalStore, ReactNode, useCallback } from "react";

export type Theme = "dark" | "light";

const STORAGE_KEY = "cyberforge-theme";
const listeners = new Set<() => void>();

function readTheme(): Theme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

function writeTheme(next: Theme) {
  const root = document.documentElement;
  // Suppress transitions for the swap so the whole page repaints in one frame
  // instead of animating hundreds of elements' colors over --dur-slow.
  root.classList.add("theme-switching");
  root.classList.remove("dark", "light");
  root.classList.add(next);
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    /* ignore */
  }
  // Re-enable transitions once the themed styles have painted. The double rAF
  // is the fast path; the timeout guarantees cleanup even if rAF is starved
  // (e.g. the tab is backgrounded), so transitions can't get stuck off.
  const clear = () => root.classList.remove("theme-switching");
  requestAnimationFrame(() => requestAnimationFrame(clear));
  setTimeout(clear, 120);
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(subscribe, readTheme, () => "dark" as Theme);

  const setTheme = useCallback((t: Theme) => writeTheme(t), []);
  const toggleTheme = useCallback(() => writeTheme(readTheme() === "dark" ? "light" : "dark"), []);

  return <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}
