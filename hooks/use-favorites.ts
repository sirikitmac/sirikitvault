"use client";

import { useCallback, useEffect, useState } from "react";

const KEY = "sirikitvault:favorites";

export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setFavorites(new Set(JSON.parse(raw) as string[]));
    } catch {
      // Corrupt storage — start fresh.
    }
    setReady(true);
  }, []);

  const toggle = useCallback((id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      try {
        window.localStorage.setItem(KEY, JSON.stringify(Array.from(next)));
      } catch {
        // Storage unavailable — favorites stay in-memory for the session.
      }
      return next;
    });
  }, []);

  return { favorites, toggle, ready };
}
