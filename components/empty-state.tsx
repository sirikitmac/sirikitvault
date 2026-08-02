"use client";

import { motion } from "framer-motion";
import { SearchX } from "lucide-react";

export function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      className="mx-auto flex max-w-md flex-col items-center gap-4 rounded-2xl border border-black/[0.08] bg-white px-5 py-10 text-center shadow-soft dark:border-white/[0.08] dark:bg-[#141412] dark:shadow-soft-dark sm:px-8 sm:py-14"
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-black/[0.08] dark:border-white/[0.08]">
        <SearchX className="h-7 w-7 text-black/40 dark:text-white/40" />
      </div>
      <div>
        <p className="font-display text-lg font-semibold">Nothing in the vault matches</p>
        <p className="mt-1 text-sm text-black/50 dark:text-white/50">
          Try a different search, or remove a filter to widen the results.
        </p>
      </div>
      <button
        type="button"
        onClick={onReset}
        className="flex min-h-11 items-center justify-center rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition-all hover:bg-black/85 active:scale-95 dark:bg-white dark:text-black dark:hover:bg-white/85 sm:min-h-0"
      >
        Clear search and filters
      </button>
    </motion.div>
  );
}
