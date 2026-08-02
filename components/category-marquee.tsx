"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { resources } from "@/data/resources";
import type { Category } from "@/types/resource";

const ROWS: { label: string; category: Category }[] = [
  { label: "UI INSPIRATION", category: "UI Inspiration" },
  { label: "COMPONENTS", category: "UI Components" },
  { label: "ANIMATIONS", category: "Animations" },
  { label: "ICONS", category: "Icons" },
  { label: "FONTS", category: "Fonts" },
  { label: "BACKGROUNDS", category: "Backgrounds" },
  { label: "DESIGN ASSETS", category: "Design Assets" },
];

export function CategoryMarquee({
  onPickCategory,
}: {
  onPickCategory: (category: string) => void;
}) {
  return (
    <div className="flex flex-col divide-y divide-black/[0.08] overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-soft dark:divide-white/[0.08] dark:border-white/[0.08] dark:bg-[#141412] dark:shadow-soft-dark">
      {ROWS.map((row) => (
        <MarqueeRow key={row.category} {...row} onPick={onPickCategory} />
      ))}
    </div>
  );
}

function MarqueeRow({
  label,
  category,
  onPick,
}: {
  label: string;
  category: Category;
  onPick: (category: string) => void;
}) {
  const [active, setActive] = useState(false);
  const hoverCapableRef = useRef(true);

  useEffect(() => {
    hoverCapableRef.current = window.matchMedia(
      "(hover: hover) and (pointer: fine)"
    ).matches;
  }, []);

  const names = resources
    .filter((r) => r.category === category)
    .map((r) => r.name);
  const sequence = names.join(" ✦ ") + (names.length ? " ✦ " : "");

  const handleSelect = () => {
    // On touch devices the first tap reveals the marquee preview;
    // a second tap (or the arrow button) commits the filter.
    if (!hoverCapableRef.current && !active) {
      setActive(true);
      return;
    }
    onPick(category);
  };

  return (
    <div
      className={`group relative flex min-h-[46px] items-stretch overflow-hidden transition-colors duration-[120ms] ease-[var(--ease-out)] ${
        active
          ? "bg-black text-white dark:bg-white dark:text-black"
          : "bg-transparent text-inherit"
      }`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <motion.button
        type="button"
        onClick={handleSelect}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.1, ease: [0.23, 1, 0.32, 1] }}
        aria-label={`Filter by ${label}`}
        className="flex flex-1 cursor-pointer items-center justify-center overflow-hidden px-3"
      >
        <AnimatePresence mode="wait">
          {active ? (
            <motion.div
              key="marquee"
              initial={{ rotateX: 90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: -90, opacity: 0 }}
              transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
              className="w-full"
            >
              {names.length > 0 ? (
                <div className="w-full overflow-hidden">
                  <div className="marquee-track">
                    <span className="marquee-chunk font-display text-[clamp(0.9rem,3.2vw,1.2rem)] font-semibold uppercase tracking-tight lg:text-[clamp(1.05rem,1.6vw,1.35rem)]">
                      {sequence}
                    </span>
                    <span
                      aria-hidden="true"
                      className="marquee-chunk font-display text-[clamp(0.9rem,3.2vw,1.2rem)] font-semibold uppercase tracking-tight lg:text-[clamp(1.05rem,1.6vw,1.35rem)]"
                    >
                      {sequence}
                    </span>
                  </div>
                </div>
              ) : (
                <span className="font-display text-[clamp(0.9rem,3.2vw,1.2rem)] font-semibold uppercase tracking-tight lg:text-[clamp(1.05rem,1.6vw,1.35rem)]">
                  {label}
                </span>
              )}
            </motion.div>
          ) : (
            <motion.span
              key="label"
              initial={{ rotateX: 90, opacity: 0 }}
              animate={{ rotateX: 0, opacity: 1 }}
              exit={{ rotateX: -90, opacity: 0 }}
              transition={{ duration: 0.1, ease: [0.23, 1, 0.32, 1] }}
              className="font-display text-[clamp(0.9rem,3.2vw,1.2rem)] font-semibold uppercase tracking-tight lg:text-[clamp(1.05rem,1.6vw,1.35rem)]"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Direct-apply affordance for touch — desktop already applies on a single click. */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPick(category);
        }}
        aria-label={`Apply ${label} filter`}
        className="flex min-h-11 w-11 shrink-0 items-center justify-center border-l border-black/[0.08] dark:border-white/[0.08] lg:hidden"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
