"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "sirikitvault:view-mode";

export type ViewMode = "grid" | "gallery" | "list" | "single";

const MODES: ViewMode[] = ["grid", "gallery", "list", "single"];

function isViewMode(value: unknown): value is ViewMode {
  return typeof value === "string" && (MODES as string[]).includes(value);
}

export function useViewMode() {
  // Always starts from the default on both server and first client render —
  // the stored value is applied after mount so there's no hydration mismatch.
  const [mode, setModeState] = useState<ViewMode>("grid");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(KEY);
      if (isViewMode(stored)) setModeState(stored);
    } catch {
      // Storage unavailable — stay on default.
    }
  }, []);

  const setMode = useCallback((next: ViewMode) => {
    setModeState(next);
    try {
      window.localStorage.setItem(KEY, next);
    } catch {
      // Storage unavailable — mode stays in-memory for the session.
    }
  }, []);

  return { mode, setMode };
}
