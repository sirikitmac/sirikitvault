"use client";

import { useState } from "react";
import { motion } from "framer-motion";
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
    <div className="flex aspect-auto flex-col divide-y divide-[#E4E4DC] border border-[#E4E4DC] bg-white dark:divide-[#2A2B22] dark:border-[#2A2B22] dark:bg-[#141510] sm:aspect-square">
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

  const names = resources
    .filter((r) => r.category === category)
    .map((r) => r.name);
  const sequence = names.join(" ✦ ") + (names.length ? " ✦ " : "");

  return (
    <button
      type="button"
      onClick={() => onPick(category)}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
      onFocus={() => setActive(true)}
      onBlur={() => setActive(false)}
      className={`group relative flex min-h-9 flex-1 cursor-pointer items-center justify-center overflow-hidden px-3 transition-colors duration-[120ms] sm:min-h-0 ${
        active ? "bg-[#FFD60A] text-black" : "bg-transparent text-inherit"
      }`}
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
            <div className="overflow-hidden w-full">
              <div className="marquee-track">
                <span className="marquee-chunk font-display text-[clamp(1.4rem,2.5vw,2rem)] font-extrabold uppercase tracking-tight">
                  {sequence}
                </span>
                <span
                  aria-hidden="true"
                  className="marquee-chunk font-display text-[clamp(1.4rem,2.5vw,2rem)] font-extrabold uppercase tracking-tight"
                >
                  {sequence}
                </span>
              </div>
            </div>
          ) : (
            <span className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-extrabold uppercase tracking-tight">
              {label}
            </span>
          )}
        </motion.div>
      ) : (
        <span className="font-display text-[clamp(1.4rem,2.5vw,2rem)] font-extrabold uppercase tracking-tight">
          {label}
        </span>
      )}
    </button>
  );
}
