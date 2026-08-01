"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
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
    <div className="flex aspect-auto flex-col divide-y divide-[#E4E4DC] border border-[#E4E4DC] bg-white dark:divide-[#2A2B22] dark:border-[#2A2B22] dark:bg-[#141510] lg:aspect-square">
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
      className={`group relative flex min-h-[52px] flex-1 items-stretch overflow-hidden transition-colors duration-[120ms] lg:min-h-0 ${
        active ? "bg-[#FFD60A] text-black" : "bg-transparent text-inherit"
      }`}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <button
        type="button"
        onClick={handleSelect}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        aria-label={`Filter by ${label}`}
        className="flex flex-1 cursor-pointer items-center justify-center overflow-hidden px-3"
      >
        {active ? (
          <motion.div
            key="marquee"
            initial={{ rotateX: 90, opacity: 0 }}
            animate={{ rotateX: 0, opacity: 1 }}
            transition={{ duration: 0.15 }}
            className="w-full"
          >
            {names.length > 0 ? (
              <div className="w-full overflow-hidden">
                <div className="marquee-track">
                  <span className="marquee-chunk font-display text-[clamp(1.05rem,4vw,1.6rem)] font-extrabold uppercase tracking-tight lg:text-[clamp(1.4rem,2.5vw,2rem)]">
                    {sequence}
                  </span>
                  <span
                    aria-hidden="true"
                    className="marquee-chunk font-display text-[clamp(1.05rem,4vw,1.6rem)] font-extrabold uppercase tracking-tight lg:text-[clamp(1.4rem,2.5vw,2rem)]"
                  >
                    {sequence}
                  </span>
                </div>
              </div>
            ) : (
              <span className="font-display text-[clamp(1.05rem,4vw,1.6rem)] font-extrabold uppercase tracking-tight lg:text-[clamp(1.4rem,2.5vw,2rem)]">
                {label}
              </span>
            )}
          </motion.div>
        ) : (
          <span className="font-display text-[clamp(1.05rem,4vw,1.6rem)] font-extrabold uppercase tracking-tight lg:text-[clamp(1.4rem,2.5vw,2rem)]">
            {label}
          </span>
        )}
      </button>

      {/* Direct-apply affordance for touch — desktop already applies on a single click. */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onPick(category);
        }}
        aria-label={`Apply ${label} filter`}
        className="flex min-h-11 w-11 shrink-0 items-center justify-center border-l border-black/10 dark:border-white/10 lg:hidden"
      >
        <ArrowRight className="h-4 w-4" />
      </button>
    </div>
  );
}
