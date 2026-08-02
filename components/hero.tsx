"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, CornerDownLeft, Tag, X } from "lucide-react";
import { resources } from "@/data/resources";
import { suggestionsFor } from "@/lib/filter";
import { faviconFor } from "@/lib/utils";
import { ScrambleText } from "@/components/scramble-text";
import { ParticleField } from "@/components/particle-field";
import { OrbitField } from "@/components/orbit-field";

export function Hero({
  query,
  onQueryChange,
  onPickTag,
  resourceCount,
  categoryCount,
}: {
  query: string;
  onQueryChange: (q: string) => void;
  onPickTag: (tag: string) => void;
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
    <section id="top" className="relative pt-14 sm:pt-20 lg:pt-24">
      {/* Wide orbit zone — the centered title column sits on top of it. */}
      <div className="relative mx-auto w-[min(100%-1.5rem,88rem)]">
        <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
          <OrbitField />
        </div>

        <div className="relative z-10 mx-auto flex min-h-[420px] max-w-2xl flex-col items-center justify-center px-6 text-center sm:min-h-[480px] lg:min-h-[560px]">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <ParticleField />
        </div>
        {/* Soft scrim so orbit cards drifting close to the text recede
            instead of fighting it for contrast — text itself is already
            above the orbit layer (z-10 vs z-0), this just keeps it legible. */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_58%_55%_at_50%_50%,rgba(250,250,248,0.85)_0%,rgba(250,250,248,0)_72%)] dark:bg-[radial-gradient(ellipse_58%_55%_at_50%_50%,rgba(13,13,12,0.85)_0%,rgba(13,13,12,0)_72%)]" />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="cell-label text-black/45 dark:text-white/45"
        >
          Design &amp; development vault
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          className="mt-4 break-words font-display text-[clamp(2.3rem,9vw,4.75rem)] font-semibold leading-[1.05] tracking-tight sm:text-[clamp(2.75rem,7vw,4.75rem)]"
        >
          <ScrambleText text="SirikitVault" startDelay={150} />
          <ScrambleText text=".dev" startIndex={12} startDelay={150} className="text-gradient" />
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.12 }}
          className="mt-5 max-w-lg text-balance text-[15px] leading-relaxed text-black/55 dark:text-white/55 sm:text-base"
        >
          <ScrambleText
            text="My personal collection of UI/UX resources, design inspiration, components, animations, assets, and developer tools."
            startDelay={420}
            className="w-full"
          />
        </motion.p>

        {/* Search pill */}
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.2 }}
          className="relative z-30 mt-8 w-full max-w-md sm:max-w-lg"
        >
          <div
            className={`flex items-center gap-3 rounded-full border bg-white px-4 py-3 shadow-soft transition-shadow dark:bg-[#141412] dark:shadow-soft-dark sm:px-5 ${
              focused
                ? "border-black/25 dark:border-white/25"
                : "border-black/[0.08] dark:border-white/[0.08]"
            }`}
          >
            <Search className="h-[18px] w-[18px] shrink-0 text-black/40 dark:text-white/40" />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => onQueryChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 120)}
              placeholder="Search the vault"
              aria-label="Search resources"
              className="w-full bg-transparent text-[15px] outline-none placeholder:text-black/35 dark:placeholder:text-white/30"
            />
            {query ? (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => {
                  onQueryChange("");
                  inputRef.current?.focus();
                }}
                className="rounded-full p-1 text-black/40 transition-colors hover:bg-black/5 dark:text-white/40 dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            ) : (
              <kbd className="hidden shrink-0 rounded-md border border-black/[0.1] bg-black/[0.04] px-1.5 py-0.5 font-mono text-xs text-black/45 dark:border-white/[0.12] dark:bg-white/[0.06] dark:text-white/45 sm:block">
                ⌘K
              </kbd>
            )}
          </div>

          <AnimatePresence>
            {showSuggestions && (names.length > 0 || tags.length > 0) && (
              <motion.div
                key="suggestions"
                initial={{ opacity: 0, y: -6, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -4, scale: 0.98 }}
                transition={{ duration: 0.15, ease: [0.23, 1, 0.32, 1] }}
                className="absolute inset-x-0 top-full mt-2 max-h-[60vh] origin-top overflow-y-auto rounded-2xl border border-black/[0.08] bg-white text-left shadow-soft dark:border-white/[0.08] dark:bg-[#141412] dark:shadow-soft-dark"
              >
              {names.map((r) => (
                <a
                  key={r.id}
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 px-3 py-2 transition-colors first:rounded-t-2xl last:rounded-b-2xl hover:bg-black/[0.04] dark:hover:bg-white/[0.06]"
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
                <div className="flex flex-wrap gap-1.5 border-t border-black/[0.06] px-3 py-2.5 last:rounded-b-2xl dark:border-white/[0.07]">
                  {tags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => onPickTag(t)}
                      className="flex items-center gap-1 rounded-full border border-black/[0.15] px-2.5 py-1 text-xs text-black/70 transition-colors hover:border-black hover:bg-black hover:text-white dark:border-white/[0.15] dark:text-white/70 dark:hover:border-white dark:hover:bg-white dark:hover:text-black"
                    >
                      <Tag className="h-3 w-3" />
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs text-black/50 dark:text-white/50"
        >
          <span>
            <span className="text-base font-semibold tabular-nums text-black dark:text-white">
              {resourceCount}
            </span>{" "}
            resources
          </span>
          <span className="h-3.5 w-px bg-black/15 dark:bg-white/15" />
          <span>
            <span className="text-base font-semibold tabular-nums text-black dark:text-white">
              {categoryCount}
            </span>{" "}
            categories
          </span>
        </motion.div>

        {/* Two minimal CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.36 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3"
        >
          <a
            href="#browse"
            className="flex min-h-11 items-center justify-center rounded-full bg-black px-5 text-sm font-semibold text-white transition-all hover:bg-black/85 active:scale-[0.97] dark:bg-white dark:text-black dark:hover:bg-white/85"
          >
            Browse the vault
          </a>
          <a
            href="#categories"
            className="flex min-h-11 items-center justify-center rounded-full border border-black/15 px-5 text-sm font-medium text-black/75 transition-all hover:border-black/30 hover:text-black active:scale-[0.97] dark:border-white/15 dark:text-white/75 dark:hover:border-white/30 dark:hover:text-white"
          >
            Explore categories
          </a>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
