"use client";

import { motion } from "framer-motion";
import { LayoutGrid, Images, List, Square, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ViewMode } from "@/hooks/use-view-mode";

const OPTIONS: { mode: ViewMode; label: string; icon: LucideIcon }[] = [
  { mode: "grid", label: "Grid", icon: LayoutGrid },
  { mode: "gallery", label: "Gallery", icon: Images },
  { mode: "list", label: "List", icon: List },
  { mode: "single", label: "Single", icon: Square },
];

export function ViewSwitcher({
  mode,
  onChange,
}: {
  mode: ViewMode;
  onChange: (mode: ViewMode) => void;
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Card view"
      className="inline-flex items-center gap-0.5 rounded-full border border-black/[0.08] bg-black/[0.02] p-1 dark:border-white/[0.08] dark:bg-white/[0.03]"
    >
      {OPTIONS.map(({ mode: optionMode, label, icon: Icon }) => {
        const active = optionMode === mode;
        return (
          <button
            key={optionMode}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={label}
            onClick={() => onChange(optionMode)}
            className={cn(
              "relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors duration-150 ease-[var(--ease-out)] active:scale-95 sm:h-8 sm:w-auto sm:gap-1.5 sm:px-3",
              active
                ? "text-white dark:text-black"
                : "text-black/45 hover:text-black/70 dark:text-white/45 dark:hover:text-white/70"
            )}
          >
            {active && (
              <motion.span
                layoutId="view-switcher-active"
                transition={{ type: "spring", duration: 0.4, bounce: 0.15 }}
                className="absolute inset-0 rounded-full bg-black dark:bg-white"
              />
            )}
            <Icon className="relative z-10 h-3.5 w-3.5 shrink-0" strokeWidth={2} />
            <span className="relative z-10 hidden text-[12px] font-medium sm:inline">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
