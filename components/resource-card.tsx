"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Heart } from "lucide-react";
import type { Resource } from "@/types/resource";
import type { ViewMode } from "@/hooks/use-view-mode";
import { Badge } from "@/components/ui/badge";
import { cn, domainOf, faviconFor, screenshotFor, surfaceFor } from "@/lib/utils";

export function ResourceCard({
  resource,
  isFavorite,
  onToggleFavorite,
  onOpen,
  featured = false,
  index = 0,
  variant = "grid",
}: {
  resource: Resource;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: () => void;
  featured?: boolean;
  index?: number;
  variant?: ViewMode;
}) {
  const [canHover, setCanHover] = useState(true);
  const [faviconLoaded, setFaviconLoaded] = useState(false);
  const [shotLoaded, setShotLoaded] = useState(false);
  const [shotErrored, setShotErrored] = useState(false);
  const showFallback = !shotLoaded || shotErrored;

  useEffect(() => {
    setCanHover(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
  }, []);

  const overlayFavoriteButton = (
    <button
      type="button"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFavorite}
      onClick={(e) => {
        e.stopPropagation();
        onToggleFavorite(resource.id);
      }}
      className={cn(
        "absolute right-2.5 top-2.5 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/40 transition-all hover:scale-110 active:scale-90 sm:h-8 sm:w-8",
        isFavorite ? "text-rose-500" : "text-white/70"
      )}
    >
      <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
    </button>
  );

  const plainFavoriteButton = (
    <button
      type="button"
      aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={isFavorite}
      onClick={(e) => {
        e.stopPropagation();
        onToggleFavorite(resource.id);
      }}
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all hover:scale-110 active:scale-90",
        isFavorite
          ? "border-rose-500/30 bg-rose-500/10 text-rose-500"
          : "border-black/10 text-black/40 hover:text-black/60 dark:border-white/10 dark:text-white/40 dark:hover:text-white/60"
      )}
    >
      <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
    </button>
  );

  function Preview({
    heightClasses,
    imgWidth,
  }: {
    heightClasses: string;
    imgWidth: number;
  }) {
    return (
      <div
        className={cn(
          "relative overflow-hidden",
          surfaceFor(resource.name),
          heightClasses
        )}
      >
        {showFallback && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-black/[0.06] bg-white shadow-soft transition-transform duration-200 group-hover:scale-110 dark:border-white/[0.08] dark:bg-white/[0.08] dark:shadow-none">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={faviconFor(resource.url)}
                alt=""
                loading="lazy"
                onLoad={() => setFaviconLoaded(true)}
                className={cn(
                  "h-8 w-8 opacity-0 transition-opacity duration-200 ease-[var(--ease-out)]",
                  faviconLoaded && "opacity-100"
                )}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={screenshotFor(resource.url, imgWidth)}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setShotLoaded(true)}
          onError={() => setShotErrored(true)}
          className={cn(
            "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-[var(--ease-out)]",
            showFallback ? "opacity-0" : "opacity-100"
          )}
        />
        {featured && (
          <span className="cell-label absolute left-3 top-3 rounded-lg bg-black px-2 py-1 text-white dark:bg-white dark:text-black">
            Featured
          </span>
        )}
        {overlayFavoriteButton}
      </div>
    );
  }

  const cardBase = cn(
    "group relative flex cursor-pointer overflow-hidden rounded-2xl border border-black/[0.08] bg-white shadow-soft transition-shadow duration-200 ease-[var(--ease-out)] dark:border-white/[0.08] dark:bg-[#141412] dark:shadow-soft-dark",
    canHover &&
      "hover:z-10 hover:shadow-soft-hover dark:hover:shadow-soft-dark-hover"
  );

  const sharedMotionProps = {
    layout: true as const,
    initial: { opacity: 0, y: 18 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: "-40px" },
    transition: { duration: 0.45, delay: Math.min(index * 0.04, 0.3) },
    whileHover: canHover
      ? { scale: 1.03, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }
      : undefined,
    whileTap: { scale: 0.98 },
    onClick: onOpen,
    role: "button" as const,
    tabIndex: 0,
    onKeyDown: (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onOpen();
      }
    },
  };

  // ── List: one row, thumbnail left, text middle, actions right ──────
  if (variant === "list") {
    return (
      <motion.article
        {...sharedMotionProps}
        className={cn(cardBase, "items-center gap-3 p-2.5 sm:p-3")}
      >
        <div
          className={cn(
            "relative h-11 w-11 shrink-0 overflow-hidden rounded-xl sm:h-12 sm:w-12",
            surfaceFor(resource.name)
          )}
        >
          {showFallback && (
            <div className="absolute inset-0 flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={faviconFor(resource.url)}
                alt=""
                loading="lazy"
                onLoad={() => setFaviconLoaded(true)}
                className={cn(
                  "h-5 w-5 opacity-0 transition-opacity duration-200 ease-[var(--ease-out)]",
                  faviconLoaded && "opacity-100"
                )}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).style.display = "none";
                }}
              />
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={screenshotFor(resource.url, 256)}
            alt=""
            loading="lazy"
            decoding="async"
            onLoad={() => setShotLoaded(true)}
            onError={() => setShotErrored(true)}
            className={cn(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ease-[var(--ease-out)]",
              showFallback ? "opacity-0" : "opacity-100"
            )}
          />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-baseline gap-2">
            <h3 className="truncate font-display text-[14px] font-semibold">
              {resource.name}
            </h3>
            <span className="hidden shrink-0 font-mono text-[11px] text-black/35 dark:text-white/35 sm:inline">
              {domainOf(resource.url)}
            </span>
          </div>
          <p className="truncate text-[12px] leading-relaxed text-black/55 dark:text-white/55">
            {resource.description}
          </p>
        </div>

        <div className="hidden shrink-0 items-center gap-1.5 md:flex">
          {resource.tags.slice(0, 2).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>

        {plainFavoriteButton}

        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex h-10 shrink-0 items-center justify-center gap-1.5 rounded-full bg-black px-3 text-[13px] font-semibold text-white transition-all hover:bg-black/85 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-white/85"
        >
          <span className="hidden sm:inline">Visit</span>
          <ArrowUpRight className="h-3.5 w-3.5" />
        </a>
      </motion.article>
    );
  }

  // ── Gallery: image-first, dense, minimal text ───────────────────────
  if (variant === "gallery") {
    return (
      <motion.article
        {...sharedMotionProps}
        className={cn(cardBase, "flex-col")}
      >
        <Preview
          heightClasses={featured ? "h-40 sm:h-48" : "h-32 sm:h-40"}
          imgWidth={featured ? 960 : 640}
        />
        <div className="flex flex-col gap-1.5 px-3 pb-3 pt-2.5">
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="truncate font-display text-[13px] font-semibold">
              {resource.name}
            </h3>
            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Visit ${resource.name}`}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-black text-white transition-all hover:bg-black/85 active:scale-90 dark:bg-white dark:text-black dark:hover:bg-white/85"
            >
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </div>
          <div className="flex items-center justify-between gap-2">
            <span className="truncate font-mono text-[11px] text-black/35 dark:text-white/35">
              {domainOf(resource.url)}
            </span>
            <Badge variant="accent" className="shrink-0">
              {resource.category}
            </Badge>
          </div>
        </div>
      </motion.article>
    );
  }

  // ── Single: one big, focused card ────────────────────────────────────
  if (variant === "single") {
    return (
      <motion.article
        {...sharedMotionProps}
        className={cn(cardBase, "flex-col")}
      >
        <Preview
          heightClasses={featured ? "h-64 sm:h-80" : "h-52 sm:h-64"}
          imgWidth={960}
        />
        <div className="flex flex-1 flex-col gap-2.5 px-5 pb-5 pt-4">
          <div className="flex items-center gap-2">
            <span className="cell-label text-black/40 dark:text-white/40">
              {String(index + 1).padStart(2, "0")}
            </span>
            {resource.recommended && (
              <span className="cell-label text-black/40 dark:text-white/40">
                · Recommended
              </span>
            )}
          </div>

          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-display text-lg font-semibold">
              {resource.name}
            </h3>
            <span className="shrink-0 font-mono text-[12px] text-black/35 dark:text-white/35">
              {domainOf(resource.url)}
            </span>
          </div>

          <p className="line-clamp-3 text-[14px] leading-relaxed text-black/55 dark:text-white/55">
            {resource.description}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
            <Badge variant="accent">{resource.category}</Badge>
            {resource.tags.slice(0, 6).map((t) => (
              <Badge key={t}>{t}</Badge>
            ))}
          </div>

          <a
            href={resource.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-2 flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-black px-3 py-2 text-[13px] font-semibold text-white transition-all hover:bg-black/85 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-white/85 sm:min-h-0"
          >
            Visit website
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>
      </motion.article>
    );
  }

  // ── Grid: default ─────────────────────────────────────────────────
  return (
    <motion.article {...sharedMotionProps} className={cn(cardBase, "flex-col")}>
      <Preview
        heightClasses={featured ? "h-36 sm:h-40" : "h-28 sm:h-32"}
        imgWidth={featured ? 960 : 640}
      />

      <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3">
        <div className="flex items-center gap-2">
          <span className="cell-label text-black/40 dark:text-white/40">
            {String(index + 1).padStart(2, "0")}
          </span>
          {resource.recommended && (
            <span className="cell-label text-black/40 dark:text-white/40">· Recommended</span>
          )}
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-[15px] font-semibold">
            {resource.name}
          </h3>
          <span className="shrink-0 font-mono text-[12px] text-black/35 dark:text-white/35">
            {domainOf(resource.url)}
          </span>
        </div>

        <p className="line-clamp-2 text-[13px] leading-relaxed text-black/55 dark:text-white/55">
          {resource.description}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-1">
          <Badge variant="accent">{resource.category}</Badge>
          {resource.tags.slice(0, 3).map((t) => (
            <Badge key={t}>{t}</Badge>
          ))}
        </div>

        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="mt-2 flex min-h-11 items-center justify-center gap-1.5 rounded-full bg-black px-3 py-2 text-[13px] font-semibold text-white transition-all hover:bg-black/85 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-white/85 sm:min-h-0"
        >
          Visit website
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </motion.article>
  );
}
