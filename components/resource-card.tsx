"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Heart } from "lucide-react";
import type { Resource } from "@/types/resource";
import { Badge } from "@/components/ui/badge";
import { cn, domainOf, faviconFor, gradientFor } from "@/lib/utils";

export function ResourceCard({
  resource,
  isFavorite,
  onToggleFavorite,
  onOpen,
  featured = false,
  index = 0,
}: {
  resource: Resource;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: () => void;
  featured?: boolean;
  index?: number;
}) {
  const [canHover, setCanHover] = useState(true);
  const [faviconLoaded, setFaviconLoaded] = useState(false);

  useEffect(() => {
    setCanHover(
      window.matchMedia("(hover: hover) and (pointer: fine)").matches
    );
  }, []);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.45, delay: Math.min(index * 0.04, 0.3) }}
      whileHover={
        canHover
          ? { scale: 1.03, transition: { duration: 0.2, ease: [0.23, 1, 0.32, 1] } }
          : undefined
      }
      whileTap={{ scale: 0.98 }}
      onClick={onOpen}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen();
        }
      }}
      className={cn(
        "group relative flex cursor-pointer flex-col overflow-hidden rounded-none border-r border-b border-[#E4E4DC] bg-white transition-shadow duration-200 ease-[var(--ease-out)] dark:border-[#2A2B22] dark:bg-[#141510]",
        canHover &&
          "hover:z-10 hover:shadow-[8px_8px_0_rgba(0,0,0,0.15)] dark:hover:shadow-[8px_8px_0_rgba(0,0,0,0.35)]"
      )}
    >
      {/* Preview */}
      <div
        className={cn(
          "relative overflow-hidden bg-gradient-to-br",
          gradientFor(resource.name),
          featured ? "h-36 sm:h-40" : "h-28 sm:h-32"
        )}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-14 w-14 items-center justify-center border border-white/10 bg-black/70 transition-transform duration-200 group-hover:scale-110">
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
        {featured && (
          <span className="cell-label absolute left-0 top-0 bg-black px-2 py-1">
            Featured
          </span>
        )}
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
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 px-4 pb-4 pt-3">
        <div className="flex items-center gap-2">
          <span className="cell-label">
            {String(index + 1).padStart(2, "0")}
          </span>
          {resource.recommended && (
            <span className="cell-label opacity-70">· Recommended</span>
          )}
        </div>

        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-[15px] font-bold tracking-tight">
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
          className="mt-2 flex min-h-11 items-center justify-center gap-1.5 rounded-none bg-[#FFD60A] px-3 py-2 text-[13px] font-semibold text-black transition-all hover:bg-[#E6B800] active:scale-[0.98] sm:min-h-0"
        >
          Visit website
          <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </a>
      </div>
    </motion.article>
  );
}
