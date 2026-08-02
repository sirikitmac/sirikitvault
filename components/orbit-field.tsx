"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { resources } from "@/data/resources";
import type { Resource } from "@/types/resource";
import { cn, faviconFor, hashString, screenshotFor, surfaceFor } from "@/lib/utils";

// Cosmos-style preview cards, orbiting the hero title in a slow ring.
// Capped well below the full catalog (185) for performance — see counts below.
// Kept lower than the pre-video hero used (22/10): over a busy video
// background, fewer cards read as intentional atmosphere instead of clutter.
const DESKTOP_COUNT = 16;
const MOBILE_COUNT = 6;

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

  // Desktop has enough spare width beyond the text column to route a wide
  // ring fully around it. Below that, there isn't room for a ring that
  // clears the stack at every angle, so mobile uses a smaller ring instead
  // (see the radius/squash math below) — it passes near/behind the text,
  // which the scrim above (hero.tsx) fades for legibility, the same way it
  // already softens near-depth desktop cards.
  const ringMode = boxW >= 1100;

  const width = ringMode
    ? depth === "near"
      ? 72 + (h % 20)
      : depth === "mid"
        ? 54 + (h % 16)
        : 40 + (h % 12)
    : depth === "near"
      ? 34 + (h % 14)
      : depth === "mid"
        ? 26 + (h % 10)
        : 20 + (h % 8);
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
    // Mobile ring: centered on the title, same orbiting motion as desktop,
    // just sized against the box's real pixel dimensions instead of the
    // (much wider) desktop danger-zone math — that mismatch is what pushed
    // cards off-screen before. Both axes are clamped against the largest
    // card plus its sway drift so the ellipse's outer edge always lands
    // inside the box: visible and orbiting, never clipped.
    anchorLeft = 50;
    anchorTop = 50;
    const cardHalfWidthMax = 24; // largest near-depth mobile card: (34+13)/2
    const cardHalfHeightMax = 17; // ~ (34+13)*0.72 / 2
    const driftMax = 15; // conservative upper bound for either axis' sway drift
    const margin = 6;
    radius = Math.max(36, halfW - cardHalfWidthMax - driftMax - margin);
    const verticalRadius = Math.max(
      28,
      Math.min(radius * 1.2, halfH - cardHalfHeightMax - driftMax - margin)
    );
    squash = radius > 0 ? verticalRadius / radius : 1;
    orbitDuration = 40 + (h % 20); // 40s..59s — slow loop, scaled for the smaller ring
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
          // Always dark-video-tuned (not theme-dependent, unlike the rest of
          // the site): a translucent glass tile plus a dark ambient shadow so
          // cards separate from the footage instead of floating as flat, fully
          // opaque plates. Opacity is dialed down per depth so the ring reads
          // as subtle atmosphere behind the title, never competing with it.
          "orbit-card-inner absolute overflow-hidden rounded-xl border border-white/[0.14] bg-white/[0.06] shadow-soft-dark backdrop-blur-[1px]",
          depth === "near" && "opacity-[0.82]",
          depth === "mid" && "opacity-[0.6]",
          depth === "far" && "opacity-[0.38] blur-[1px] saturate-[0.7]"
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
