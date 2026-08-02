"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { resources } from "@/data/resources";
import type { Resource } from "@/types/resource";
import { cn, faviconFor, hashString, screenshotFor, surfaceFor } from "@/lib/utils";

// Cosmos-style preview cards, orbiting the hero title in a slow ring.
// Capped well below the full catalog (185) for performance — see counts below.
const DESKTOP_COUNT = 22;
const MOBILE_COUNT = 7;

type Depth = "near" | "mid" | "far";

type OrbitCard = {
  resource: Resource;
  width: number;
  height: number;
  depth: Depth;
  anchorLeft: number;
  anchorTop: number;
  angle: number;
  radius: number;
  squash: number;
  orbitDuration: number;
  orbitDelay: number;
  rotateA: number;
  rotateB: number;
  driftX: number;
  driftY: number;
  swayDuration: number;
  swayDelay: number;
  shotWidth: number;
};

/** Stride-sample across the catalog so the picks span categories, not just the first N. */
function pickSpread(count: number): Resource[] {
  if (resources.length <= count) return resources;
  const stride = resources.length / count;
  const out: Resource[] = [];
  for (let i = 0; i < count; i++) out.push(resources[Math.floor(i * stride)]);
  return out;
}

// Orbit radius/size/motion all derive from a hash of the resource's own id,
// never from its index — so shrinking the list (desktop -> mobile) never
// reshuffles the cards that stay, it only removes the tail. The ellipse
// itself (radius + squash) derives from the measured field box so it always
// clears the text stack sitting on top of it, at every viewport size.
function layoutFor(resource: Resource, boxW: number, boxH: number): OrbitCard {
  const h = hashString(resource.id);
  const h2 = hashString(`${resource.id}::orbit`);
  const h3 = hashString(`${resource.id}::sway`);

  const halfW = Math.max(60, boxW / 2);
  const halfH = Math.max(60, boxH / 2);

  const depthRoll = (h >> 5) % 3;
  const depth: Depth = depthRoll === 0 ? "near" : depthRoll === 1 ? "mid" : "far";

  // Below ~1100px the column leaves no headroom for a ring that clears the
  // stack at every angle (the box is barely wider than the text itself) —
  // fall back to a tiny wobble pinned in whichever screen corner still has
  // slack beyond the stack's own footprint, instead of forcing a big loop
  // through a space that isn't there. Corner pockets are small, so cards
  // there are sized down to match (see width below).
  const ringMode = boxW >= 1100;

  const width = ringMode
    ? depth === "near"
      ? 72 + (h % 20)
      : depth === "mid"
        ? 54 + (h % 16)
        : 40 + (h % 12)
    : depth === "near"
      ? 22 + (h % 8)
      : depth === "mid"
        ? 17 + (h % 6)
        : 13 + (h % 5);
  const height = Math.round(width * 0.72);

  // The hero text stack (eyebrow -> title -> tagline -> search -> stats ->
  // buttons) caps out around 672px wide and is nearly as tall as this box
  // itself (the box is sized to match it — see hero.tsx).
  const dangerHalfWidth = Math.min(336, Math.max(80, halfW - 24));
  const dangerHalfHeight = halfH * 0.78;

  let anchorLeft: number;
  let anchorTop: number;
  let radius: number;
  let squash: number;
  let orbitDuration: number;

  if (ringMode) {
    anchorLeft = 50;
    anchorTop = 50;
    radius = dangerHalfWidth * 1.25 + 20;
    // Unlike dangerHalfWidth (capped at 336 above), nothing bounded the
    // vertical reach against the field's own half-height — so the ellipse
    // could swing past the box's top/bottom edge, where the field's
    // overflow-hidden (hero.tsx) sliced cards mid-shape. Clamp so the
    // orbit's outer edge, plus the largest card's own half-height and its
    // sway drift, always lands inside the box: cards clear the text stack
    // (the danger-zone math above) without ever reaching the clip line.
    const cardHalfHeightMax = 33; // largest near-depth card: (72+19)*0.72 / 2
    const driftYMax = 13; // largest sway drift beyond the orbit position
    const verticalRadius = Math.min(
      dangerHalfHeight * 1.25 + 14,
      Math.max(40, halfH - cardHalfHeightMax - driftYMax)
    );
    squash = radius > 0 ? verticalRadius / radius : 1;
    orbitDuration = 46 + (h % 24); // 46s..70s — one slow loop around
  } else {
    const leftSide = h % 2 === 0;
    const topSide = (h >> 1) % 2 === 0;
    // Anchor close to the true edge (small constant margin, not scaled by
    // card size) — any part of the card past the edge is safely clipped by
    // the field's own overflow-hidden, it just never needs to render toward
    // the stack in the first place.
    const marginX = width / 2 + 4;
    const marginY = height / 2 + 4;
    const anchorXPx = leftSide ? marginX : boxW - marginX;
    const anchorYPx = topSide ? marginY : boxH - marginY;
    anchorLeft = (anchorXPx / boxW) * 100;
    anchorTop = (anchorYPx / boxH) * 100;
    radius = 4 + (h % 5); // tiny local wobble, well clear of the corner pocket's edges
    squash = 0.85;
    orbitDuration = 24 + (h % 14); // slower still relative to its own tiny size
  }

  const angle = h % 360;
  const orbitDelay = -((angle / 360) * orbitDuration);

  const baseRotate = ((h % 21) - 10) * 1.2; // -12deg .. 12deg resting tilt
  const swing = 3 + (h2 % 4); // 3deg .. 6deg of local sway

  return {
    resource,
    width,
    height,
    depth,
    anchorLeft,
    anchorTop,
    angle,
    radius,
    squash,
    orbitDuration,
    orbitDelay,
    rotateA: baseRotate,
    rotateB: baseRotate + swing,
    driftX: 6 + (h2 % 10),
    driftY: 5 + (h3 % 9),
    swayDuration: 9 + (h2 % 8), // 9s..17s calm local wobble, independent of the orbit
    swayDelay: -((h3 % 300) / 10),
    shotWidth: depth === "near" ? 300 : depth === "mid" ? 220 : 160,
  };
}

export function OrbitField() {
  // Start at the mobile-safe count so server and first client render match
  // exactly (no hydration mismatch); expand only after mount if the
  // viewport turns out to be wide enough. Phones never fetch the extra cards.
  const [count, setCount] = useState(MOBILE_COUNT);
  const [paused, setPaused] = useState(false);
  const [box, setBox] = useState({ w: 0, h: 0 });
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 640px)");
    setCount(mq.matches ? DESKTOP_COUNT : MOBILE_COUNT);
    const onChange = (e: MediaQueryListEvent) => setCount(e.matches ? DESKTOP_COUNT : MOBILE_COUNT);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    onVisibility();
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  // Measure the field's own box so the orbit ring can be sized against its
  // real pixel dimensions (the box matches the text stack's footprint —
  // see hero.tsx — so this is also how we know how far "outward" is).
  useEffect(() => {
    const el = fieldRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setBox({ w: width, h: height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pool = useMemo(() => pickSpread(DESKTOP_COUNT), []);
  const cards = useMemo(
    () => (box.w > 0 && box.h > 0 ? pool.slice(0, count).map((r) => layoutFor(r, box.w, box.h)) : []),
    [pool, count, box.w, box.h]
  );

  return (
    <div
      ref={fieldRef}
      className="orbit-field pointer-events-none absolute inset-0"
      data-paused={paused ? "" : undefined}
      aria-hidden="true"
    >
      {cards.map((card) => (
        <OrbitCardView key={card.resource.id} card={card} />
      ))}
    </div>
  );
}

function OrbitCardView({ card }: { card: OrbitCard }) {
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);
  const showFallback = !loaded || errored;
  const { resource, depth } = card;

  return (
    <div
      className="orbit-card"
      style={
        {
          left: `${card.anchorLeft}%`,
          top: `${card.anchorTop}%`,
          "--orbit-s": card.squash,
          "--orbit-r": `${card.radius}px`,
          "--orbit-angle0": `${card.angle}deg`,
          animationDuration: `${card.orbitDuration}s`,
          animationDelay: `${card.orbitDelay}s`,
        } as React.CSSProperties
      }
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.1, delay: 0.4 + Math.abs(card.orbitDelay) / 60 }}
        className={cn(
          "orbit-card-inner absolute overflow-hidden rounded-xl border border-black/[0.08] bg-white shadow-soft dark:border-white/[0.1] dark:bg-[#141412] dark:shadow-soft-dark",
          depth === "far" && "opacity-[0.55] blur-[1px] saturate-[0.75]",
          depth === "mid" && "opacity-[0.85]"
        )}
        style={
          {
            width: card.width,
            height: card.height,
            animationDuration: `${card.swayDuration}s`,
            animationDelay: `${card.swayDelay}s`,
            "--orbit-dx": `${card.driftX}px`,
            "--orbit-dy": `${-card.driftY}px`,
            "--orbit-rot-a": `${card.rotateA}deg`,
            "--orbit-rot-b": `${card.rotateB}deg`,
          } as React.CSSProperties
        }
      >
        <div className={cn("absolute inset-0", surfaceFor(resource.name))} />
        {showFallback && (
          <div className="absolute inset-0 flex items-center justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={faviconFor(resource.url, 64)}
              alt=""
              loading="lazy"
              className="h-1/3 w-1/3 opacity-70"
              onError={() => setErrored(true)}
            />
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={screenshotFor(resource.url, card.shotWidth)}
          alt=""
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cn(
            "h-full w-full object-cover transition-opacity duration-700",
            showFallback ? "opacity-0" : "opacity-100"
          )}
        />
      </motion.div>
    </div>
  );
}
