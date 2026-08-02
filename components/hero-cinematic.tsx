"use client";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Instrument_Serif } from "next/font/google";
import { Search, CornerDownLeft, Tag, X } from "lucide-react";
import { resources } from "@/data/resources";
import { suggestionsFor } from "@/lib/filter";
import { faviconFor } from "@/lib/utils";
import { ScrambleText } from "@/components/scramble-text";
import { OrbitField } from "@/components/orbit-field";

const displaySerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-cinematic-display",
});

// User-owned asset — a slow ambient loop, not a promotional clip.
const HERO_VIDEO_SRC =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4";

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
  const videoRef = useRef<HTMLVideoElement>(null);
  const [focused, setFocused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reducedMotion) video.pause();
    else video.play().catch(() => {});
  }, [reducedMotion]);

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
    <section id="top" className="relative overflow-hidden">
      {/* Background stack: fallback color -> video -> scrim/vignette -> bottom blend.
          Plain absolute layers in DOM order (no z-index juggling needed) so the
          fallback color is always visible until the video paints over it. */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[#03101c]" />

        {!reducedMotion && (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            aria-hidden="true"
          >
            <source src={HERO_VIDEO_SRC} type="video/mp4" />
          </video>
        )}

        {/* Flat wash for text contrast + a vignette focused behind the title stack */}
        <div className="absolute inset-0 bg-[#03101c]/50" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_62%_55%_at_50%_38%,rgba(2,9,16,0.72)_0%,rgba(2,9,16,0.18)_58%,transparent_75%)]" />

        {/* Bottom fade into whatever theme background follows the hero */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent to-[rgb(var(--bg))] sm:h-44" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full flex-col items-center justify-center px-6 pb-16 pt-16 text-center sm:pt-20 lg:pt-24">
        {/* Wide orbit zone — the centered title column sits on top of it,
            same clearance math as the pre-video hero (orbit-field.tsx sizes
            its ellipse against this box, capped to this text column's own
            672px width so it never sweeps behind the text/search/buttons).
            The box needs real margin above/below the text for that ellipse
            math to clear it — the min-h + justify-center below reproduces
            the old hero's centered-in-a-taller-box layout instead of letting
            the box collapse to the text's exact height. */}
        <div className="relative mx-auto w-[min(100%-1.5rem,88rem)]">
          <div className="pointer-events-none absolute inset-0" aria-hidden="true">
            <OrbitField />
          </div>

          {/* Center scrim so any card drifting close to the text recedes
              into the video instead of fighting it for contrast — belt and
              suspenders alongside the orbit math's own clearance zone. */}
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_66%_62%_at_50%_50%,rgba(3,16,28,0.97)_0%,rgba(3,16,28,0.85)_45%,rgba(3,16,28,0.3)_65%,transparent_85%)]" />

          <div className="relative mx-auto flex min-h-[600px] max-w-2xl flex-col items-center justify-center sm:min-h-[640px] lg:min-h-[700px]">
            <div className="liquid-glass animate-fade-rise inline-flex items-center rounded-full px-4 py-1.5">
              <span className="cell-label !text-[clamp(9.5px,3vw,12px)] whitespace-nowrap text-white/75">
                Design &amp; development vault
              </span>
            </div>

            <h1
              className={`${displaySerif.className} animate-fade-rise-delay mt-7 max-w-xl text-balance text-[clamp(2.6rem,8vw,4.75rem)] font-normal leading-[1.08] text-white`}
            >
              <ScrambleText text="SirikitVault" startDelay={150} />
              <ScrambleText text=".dev" startIndex={12} startDelay={150} className="text-white/50" />
            </h1>

            <p className="animate-fade-rise-delay-2 mt-5 max-w-lg text-balance text-[15px] leading-relaxed text-white/70 sm:text-base">
              <ScrambleText
                text="My personal collection of UI/UX resources, design inspiration, components, animations, assets, and developer tools."
                startDelay={420}
                className="w-full"
              />
            </p>

            {/* Search pill */}
            <div className="animate-fade-rise-delay-2 relative z-30 mt-8 w-full max-w-md sm:max-w-lg">
              <div
                className={`liquid-glass flex items-center gap-3 rounded-full px-4 py-3 transition-shadow sm:px-5 ${
                  focused ? "ring-1 ring-white/30" : ""
                }`}
              >
                <Search className="h-[18px] w-[18px] shrink-0 text-white/50" />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => onQueryChange(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 120)}
                  placeholder="Search the vault"
                  aria-label="Search resources"
                  className="w-full bg-transparent text-[15px] text-white outline-none placeholder:text-white/40"
                />
                {query ? (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => {
                      onQueryChange("");
                      inputRef.current?.focus();
                    }}
                    className="rounded-full p-1 text-white/50 transition-colors hover:bg-white/10"
                  >
                    <X className="h-4 w-4" />
                  </button>
                ) : (
                  <kbd className="hidden shrink-0 rounded-md border border-white/[0.14] bg-white/[0.06] px-1.5 py-0.5 font-mono text-xs text-white/50 sm:block">
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
                    className="absolute inset-x-0 top-full mt-2 max-h-[60vh] origin-top overflow-y-auto rounded-2xl border border-white/10 bg-[#0a1520]/95 text-left shadow-soft-dark backdrop-blur-xl"
                  >
                    {names.map((r) => (
                      <a
                        key={r.id}
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 px-3 py-2 transition-colors first:rounded-t-2xl last:rounded-b-2xl hover:bg-white/[0.06]"
                      >
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={faviconFor(r.url, 64)}
                          alt=""
                          className="h-5 w-5"
                          loading="lazy"
                        />
                        <span className="flex-1 truncate text-sm text-white/90">{r.name}</span>
                        <span className="hidden text-xs text-white/40 sm:block">
                          {r.category}
                        </span>
                        <CornerDownLeft className="h-3.5 w-3.5 text-white/30" />
                      </a>
                    ))}
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 border-t border-white/10 px-3 py-2.5 last:rounded-b-2xl">
                        {tags.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => onPickTag(t)}
                            className="flex items-center gap-1 rounded-full border border-white/15 px-2.5 py-1 text-xs text-white/70 transition-colors hover:border-white hover:bg-white hover:text-black"
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
            </div>

            {/* Stats */}
            <div className="animate-fade-rise-delay-2 mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 font-mono text-xs text-white/55">
              <span>
                <span className="text-base font-semibold tabular-nums text-white">
                  {resourceCount}
                </span>{" "}
                resources
              </span>
              <span className="h-3.5 w-px bg-white/15" />
              <span>
                <span className="text-base font-semibold tabular-nums text-white">
                  {categoryCount}
                </span>{" "}
                categories
              </span>
            </div>

            {/* Two CTAs — primary stays solid for max contrast over video, secondary is glass */}
            <div className="animate-fade-rise-delay-2 mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="#browse"
                className="flex min-h-11 items-center justify-center rounded-full bg-white px-5 text-sm font-semibold text-[#03101c] transition-all hover:bg-white/90 active:scale-[0.97]"
              >
                Browse the vault
              </a>
              <a
                href="#categories"
                className="liquid-glass flex min-h-11 items-center justify-center rounded-full px-5 text-sm font-medium text-white/85 transition-all hover:text-white active:scale-[0.97]"
              >
                Explore categories
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
