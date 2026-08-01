"use client";

import { motion, useReducedMotion } from "framer-motion";

const ACCENT_CLASSES = {
  yellow: "bg-[#FFD60A]",
  green: "bg-[#4ADE80]",
  pink: "bg-[#FF6FB0]",
  orange: "bg-[#FF9B42]",
} as const;

type Accent = keyof typeof ACCENT_CLASSES;

const WORD_STAGGER = 0.06;
const WORD_DURATION = 0.45;
const EASE_OUT = [0.23, 1, 0.32, 1] as const;

export function SectionHeading({
  eyebrow,
  title,
  count,
  highlightWord,
  accent = "yellow",
}: {
  eyebrow: string;
  title: string;
  count?: number;
  /** The one word in `title` (case-insensitive) that pops with a colored highlight block, as punctuation after the rest of the title reveals. */
  highlightWord?: string;
  accent?: Accent;
}) {
  const reduceMotion = useReducedMotion();
  const words = title.split(" ");
  let revealIndex = -1;

  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <motion.p
          initial={reduceMotion ? false : { opacity: 0, y: 6 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: reduceMotion ? 0 : 0.35, ease: EASE_OUT }}
          className="cell-label"
        >
          {eyebrow}
        </motion.p>
        <h2 className="mt-1 flex flex-wrap items-baseline gap-x-[0.3em] gap-y-1 font-display text-2xl font-bold tracking-tight sm:text-[1.65rem]">
          {words.map((word, i) => {
            const isHighlight =
              !!highlightWord && word.toLowerCase() === highlightWord.toLowerCase();

            // The highlight word skips the mask-up reveal and instead pops in
            // last, as the punctuation moment, once the rest of the title has
            // finished revealing.
            if (isHighlight) {
              const delay = reduceMotion
                ? 0
                : (words.length - 1) * WORD_STAGGER + WORD_DURATION * 0.55;
              return (
                <motion.span
                  key={i}
                  initial={reduceMotion ? false : { opacity: 0, scale: 0.85 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: reduceMotion ? 0 : 0.4, delay, ease: EASE_OUT }}
                  className={`inline-block px-1.5 text-black ${ACCENT_CLASSES[accent]}`}
                >
                  {word}
                </motion.span>
              );
            }

            revealIndex += 1;
            const delay = reduceMotion ? 0 : revealIndex * WORD_STAGGER;
            return (
              <span key={i} className="inline-block overflow-hidden pb-1 -mb-1">
                <motion.span
                  initial={reduceMotion ? false : { y: "110%" }}
                  whileInView={{ y: "0%" }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: reduceMotion ? 0 : WORD_DURATION, delay, ease: EASE_OUT }}
                  className="inline-block"
                >
                  {word}
                </motion.span>
              </span>
            );
          })}
        </h2>
      </div>
      {typeof count === "number" && (
        <span className="border border-[#E4E4DC] px-3 py-1 font-mono text-xs tabular-nums text-black/50 dark:border-[#2A2B22] dark:text-white/50">
          {count}
        </span>
      )}
    </div>
  );
}
