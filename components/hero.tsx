"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Search, CornerDownLeft, Tag, X } from "lucide-react";
import { resources } from "@/data/resources";
import { suggestionsFor } from "@/lib/filter";
import { faviconFor } from "@/lib/utils";
import { CategoryMarquee } from "@/components/category-marquee";

export function Hero({
  query,
  onQueryChange,
  onPickTag,
  onPickCategory,
  resourceCount,
  categoryCount,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  onPickTag: (tag: string) => void;
  onPickCategory: (category: string) => void;
  resourceCount: number;
  categoryCount: number;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focused, setFocused] = useState(false);

  // ⌘K / Ctrl+K focuses the vault search, Raycast-style.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
      if (e.key === "Escape") inputRef.current?.blur();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const { names, tags } = suggestionsFor(resources, query);
  const showSuggestions = focused && query.trim().length > 0;

  return (
    <section id="top" className="mx-auto w-[min(100%-1.5rem,72rem)] pt-16 sm:pt-24">
      <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="break-words font-display text-[clamp(2.1rem,9vw,4.75rem)] font-extrabold leading-[1.02] tracking-tight sm:text-[clamp(2.6rem,7vw,4.75rem)]"
        >
          SirikitVault<span className="text-gradient">.dev</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-4 max-w-xl text-balance text-[15px] leading-relaxed text-black/55 dark:text-white/55 sm:text-base"
        >
          My curated collection of UI/UX resources, design inspiration,
          components, animations, assets, and developer tools.
        </motion.p>

        {/* Command-bar search */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="relative z-30 mt-9 w-full max-w-2xl"
        >
          <div
            className={`flex items-center gap-3 rounded-none border-2 border-black bg-white px-4 py-3.5 transition-shadow dark:border-[#FFD60A] dark:bg-[#141510] sm:px-5 ${
              focused ? "shadow-[6px_6px_0_rgba(0,0,0,0.25)] dark:shadow-[6px_6px_0_rgba(255,214,10,0.25)]" : ""
            }`}
          >
            <Search className="h-[18px] w-[18px] shrink-0 text-black/40 dark:text-white/40" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 120)}
              placeholder="Search the vault — names, tags, categories…"
              aria-label="Search resources"
              className="w-full bg-transparent font-mono text-[15px] outline-none placeholder:text-black/35 dark:placeholder:text-white/30"
            />
            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  onQueryChange("");
                  inputRef.current?.focus();
                }}
                className="rounded-none p-1 text-black/40 transition-colors hover:bg-black/5 dark:text-white/40 dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <kbd className="hidden shrink-0 rounded-none border border-black/20 bg-black/[0.04] px-1.5 py-0.5 font-mono text-xs text-black/45 dark:border-white/20 dark:bg-white/[0.06] dark:text-white/45 sm:block">
                ⌘K
              </kbd>
            )}
          </div>

          {showSuggestions && (names.length > 0 || tags.length > 0) && (
            <div className="absolute inset-x-0 top-full mt-2 max-h-[60vh] overflow-y-auto border border-black/15 bg-white text-left dark:border-white/15 dark:bg-[#141510]">
              {names.map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-none px-3 py-2 transition-colors hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={faviconFor(r.url, 64)}
                    alt=""
                    className="h-5 w-5"
                    loading="lazy"
                  />
                  <span className="flex-1 truncate text-sm">{r.name}</span>
                  <span className="hidden text-xs text-black/40 dark:text-white/40 sm:block">
                    {r.category}
                  </span>
                  <CornerDownLeft className="h-3.5 w-3.5 text-black/30 dark:text-white/30" />
                </a>
              ))}
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 border-t border-black/[0.06] px-3 py-2.5 dark:border-white/[0.07]">
                  {tags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => onPickTag(t)}
                      className="flex items-center gap-1 rounded-none border border-black/20 px-2.5 py-1 text-xs text-black/70 transition-colors hover:border-black hover:bg-[#FFD60A] hover:text-black dark:border-white/20 dark:text-white/70"
                    >
                      <Tag className="h-3 w-3" />
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-black/50 dark:text-white/50"
        >
          <span>
            <span className="text-gradient text-base font-bold tabular-nums">
              {resourceCount}
            </span>{" "}
            resources
          </span>
          <span className="h-3.5 w-px bg-black/15 dark:bg-white/15" />
          <span>
            <span className="text-gradient text-base font-bold tabular-nums">
              {categoryCount}
            </span>{" "}
            categories
          </span>
        </motion.div>
      </div>

      {/* Category marquee panel */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 0.25 }}
        className="mt-10 w-full lg:mt-0"
      >
        <CategoryMarquee onPickCategory={onPickCategory} />
      </motion.div>
      </div>
    </section>
  );
}
