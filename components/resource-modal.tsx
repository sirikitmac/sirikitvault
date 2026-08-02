"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Heart, X } from "lucide-react";
import type { Resource } from "@/types/resource";
import { Badge } from "@/components/ui/badge";
import { cn, faviconFor, surfaceFor, screenshotFor } from "@/lib/utils";

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 sm:p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="relative flex h-full w-full flex-col rounded-2xl border border-black/[0.08] bg-white shadow-soft dark:border-white/[0.08] dark:bg-[#141412] dark:shadow-soft-dark sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-3xl"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.08] bg-white/90 text-black/60 transition-all hover:scale-110 hover:bg-black/[0.08] dark:border-white/[0.1] dark:bg-[#141412]/90 dark:text-white/60 dark:hover:bg-white/[0.12] sm:h-9 sm:w-9"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex-1 overflow-y-auto p-6 sm:p-10">
        <div className="grid gap-8 sm:grid-cols-2">
          {/* Left column */}
          <div className="order-2 flex flex-col sm:order-1">
            <h2 className="font-display text-2xl font-semibold tracking-tight">
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
                className="flex min-h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-black px-3 py-2.5 text-sm font-semibold text-white transition-all hover:bg-black/85 active:scale-[0.98] dark:bg-white dark:text-black dark:hover:bg-white/85 sm:min-h-0"
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
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/[0.1] bg-transparent transition-all hover:scale-110 active:scale-90 dark:border-white/[0.15] sm:h-10 sm:w-10",
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
              "relative order-1 aspect-[4/3] overflow-hidden rounded-2xl border border-black/[0.08] dark:border-white/[0.08] sm:order-2",
              surfaceFor(resource.name)
            )}
          >
            {showFallback && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-black/[0.06] bg-white shadow-soft dark:border-white/[0.08] dark:bg-white/[0.08] dark:shadow-none">
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
        </div>
      </motion.div>
    </motion.div>
  );
}
