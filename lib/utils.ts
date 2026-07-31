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

const GRADIENTS = [
  "from-[#FFD60A] via-[#E6B800] to-[#141510]",
  "from-[#141510] via-[#2A2B22] to-[#FFD60A]",
  "from-[#E6B800] via-[#3F3A1F] to-[#FFD60A]",
  "from-zinc-800 via-zinc-700 to-[#FFD60A]",
  "from-[#FFD60A] via-[#7A5D00] to-[#141510]",
  "from-zinc-900 via-[#544000] to-[#E6B800]",
  "from-[#2A2B22] via-[#A47D00] to-[#FFD60A]",
  "from-[#FFD60A] via-zinc-800 to-zinc-900",
];

export function gradientFor(name: string): string {
  return GRADIENTS[hashString(name) % GRADIENTS.length];
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
