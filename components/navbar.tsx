"use client";

import { Heart } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";
import { cn } from "@/lib/utils";

export function Navbar({
  favoritesCount,
  favoritesActive,
  onToggleFavorites,
}: {
  favoritesCount: number;
  favoritesActive: boolean;
  onToggleFavorites: () => void;
}) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/[0.06] bg-[#FAFAF8]/85 backdrop-blur-md dark:border-white/[0.08] dark:bg-[#0D0D0C]/85">
      <nav className="mx-auto flex w-[min(100%-1.5rem,72rem)] items-center justify-between px-1 py-2.5 sm:px-2">
        <a href="#top" className="flex items-center gap-2.5">
          <Logo size={30} />
          <span className="font-display text-[15px] font-semibold text-black dark:text-white">
            SirikitVault<span className="text-gradient">.dev</span>
          </span>
        </a>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFavorites}
            aria-pressed={favoritesActive}
            className={cn(
              "flex h-11 items-center gap-1.5 rounded-full border px-3 text-xs font-medium transition-all hover:scale-[1.03] active:scale-95 sm:h-9",
              favoritesActive
                ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                : "border-black/15 text-black/70 hover:border-black/30 dark:border-white/15 dark:text-white/70 dark:hover:border-white/30"
            )}
          >
            <Heart
              className={`h-3.5 w-3.5 ${favoritesActive ? "fill-current" : ""}`}
            />
            <span className="tabular-nums">{favoritesCount}</span>
            <span className="hidden sm:inline">Favorites</span>
          </button>
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
