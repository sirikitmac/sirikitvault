"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Heart, X } from "lucide-react";
import type { Resource } from "@/types/resource";
import { Badge } from "@/components/ui/badge";
import { cn, faviconFor, gradientFor, screenshotFor } from "@/lib/utils";

export function ResourceModal({
  resource,
  isFavorite,
  onToggleFavorite,
  onClose,
}: {
  resource: Resource;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onClose: () => void;
}) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageErrored, setImageErrored] = useState(false);

  useEffect(() => {
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  const showFallback = !imageLoaded || imageErrored;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl rounded-none border-2 border-black bg-white p-6 dark:border-[#FFD60A] dark:bg-[#141510] sm:p-10"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-none border border-black/20 bg-transparent text-black/60 transition-all hover:scale-110 hover:bg-black/[0.08] dark:border-white/20 dark:text-white/60 dark:hover:bg-white/[0.12]"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="grid gap-8 sm:grid-cols-2">
          {/* Left column */}
          <div className="flex flex-col">
            <h2 className="font-display text-2xl font-bold tracking-tight">
              {resource.name}
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-black/55 dark:text-white/55">
              {resource.description}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-1.5">
              <Badge variant="accent">{resource.category}</Badge>
              {resource.tags.map((t) => (
                <Badge key={t}>{t}</Badge>
              ))}
            </div>

            <div className="mt-auto flex items-center gap-2 pt-6">
              <a
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-1 items-center justify-center gap-1.5 rounded-none bg-[#FFD60A] px-3 py-2.5 text-sm font-semibold text-black transition-all hover:bg-[#E6B800] active:scale-[0.98]"
              >
                Visit website
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <button
                type="button"
                aria-label={
                  isFavorite ? "Remove from favorites" : "Add to favorites"
                }
                aria-pressed={isFavorite}
                onClick={() => onToggleFavorite(resource.id)}
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-black/20 bg-transparent transition-all hover:scale-110 active:scale-90 dark:border-white/20",
                  isFavorite ? "text-rose-500" : "text-black/50 dark:text-white/60"
                )}
              >
                <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
              </button>
            </div>
          </div>

          {/* Right column */}
          <div
            className={cn(
              "relative aspect-[4/3] overflow-hidden rounded-none border border-black/10 bg-gradient-to-br dark:border-white/10",
              gradientFor(resource.name)
            )}
          >
            {showFallback && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center border border-white/10 bg-black/70">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={faviconFor(resource.url)}
                    alt=""
                    loading="lazy"
                    className="h-8 w-8"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display =
                        "none";
                    }}
                  />
                </div>
              </div>
            )}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={screenshotFor(resource.url)}
              alt={`${resource.name} preview`}
              loading="lazy"
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageErrored(true)}
              className={cn(
                "h-full w-full object-cover transition-opacity duration-300",
                showFallback ? "opacity-0" : "opacity-100"
              )}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
