import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Deterministic hash for stable per-resource gradients. */
export function hashString(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
}

// Flat, deterministic neutral tiles per resource — no color, just a faint
// per-item tonal shift so the preview grid still reads with variety.
const SURFACES = [
  "bg-[#F4F3EF] dark:bg-white/[0.045]",
  "bg-[#EFEEE8] dark:bg-white/[0.06]",
  "bg-[#F7F6F2] dark:bg-white/[0.03]",
  "bg-black/[0.035] dark:bg-white/[0.05]",
  "bg-[#F1F0EA] dark:bg-white/[0.04]",
  "bg-black/[0.045] dark:bg-white/[0.055]",
  "bg-[#F5F4EF] dark:bg-white/[0.035]",
  "bg-black/[0.03] dark:bg-white/[0.065]",
];

export function surfaceFor(name: string): string {
  return SURFACES[hashString(name) % SURFACES.length];
}

export function domainOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

export function faviconFor(url: string, size = 128): string {
  return `https://www.google.com/s2/favicons?domain=${domainOf(url)}&sz=${size}`;
}

export function screenshotFor(url: string, width = 960): string {
  return `https://s0.wp.com/mshots/v1/${encodeURIComponent(url)}?w=${width}`;
}
