"use client";

import { motion } from "framer-motion";
import { allCategories, featuredFilterTags } from "@/data/resources";
import { cn } from "@/lib/utils";

export function FilterChips({
  selected,
  onToggle,
  onClear,
}: {
  selected: string[];
  onToggle: (chip: string) => void;
  onClear: () => void;
}) {
  const chips = [...allCategories, ...featuredFilterTags];
  const allActive = selected.length === 0;

  return (
    <div className="no-scrollbar -mx-3 flex gap-2 overflow-x-auto px-3 py-1 sm:flex-wrap sm:overflow-visible">
      <Chip active={allActive} onClick={onClear}>
        All
      </Chip>
      {chips.map((chip) => (
        <Chip
          key={chip}
          active={selected.includes(chip)}
          onClick={() => onToggle(chip)}
        >
          {chip}
        </Chip>
      ))}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.94 }}
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "shrink-0 rounded-none border px-3.5 py-1.5 text-[12.5px] font-medium transition-colors",
        active
          ? "border-black bg-[#FFD60A] text-black font-semibold"
          : "border-black/15 text-black/60 hover:border-black/40 hover:text-black dark:border-white/15 dark:text-white/60 dark:hover:border-white/40 dark:hover:text-white"
      )}
    >
      {children}
    </motion.button>
  );
}
