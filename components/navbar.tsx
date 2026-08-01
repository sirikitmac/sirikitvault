"use client";

import { Heart } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";
import { Logo } from "@/components/logo";

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
    <header className="sticky top-0 z-50 w-full border-b border-black/20 bg-[#FFD60A]">
      <nav className="mx-auto flex w-[min(100%-1.5rem,72rem)] items-center justify-between px-1 py-2.5 sm:px-2">
        <a href="#top" className="flex items-center gap-2.5">
          <Logo size={32} />
          <span className="font-display text-[15px] font-bold tracking-tight text-black">
            SirikitVault<span className="text-black">.dev</span>
          </span>
        </a>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleFavorites}
            aria-pressed={favoritesActive}
            className={`flex h-11 items-center gap-1.5 rounded-none border border-black bg-transparent px-3 text-xs font-medium text-black transition-all hover:scale-[1.03] active:scale-95 sm:h-9 ${
              favoritesActive ? "bg-black text-[#FFD60A]" : ""
            }`}
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
