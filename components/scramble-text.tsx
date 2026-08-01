"use client";

import { useEffect, useRef, useState } from "react";

const GLYPHS = "!<>-_\\/[]{}—=+*^?#________";

function randomGlyph() {
  return GLYPHS[(Math.random() * GLYPHS.length) | 0];
}

function scrambleAll(text: string) {
  return text
    .split("")
    .map((ch) => (ch === " " ? " " : randomGlyph()))
    .join("");
}

export function ScrambleText({
  text,
  startDelay = 0,
  speed,
  startIndex = 0,
  className,
}: {
  text: string;
  /** ms to wait before the decode begins */
  startDelay?: number;
  /** ms of stagger between each character locking in (auto-derived if omitted) */
  speed?: number;
  /** offsets this block's reveal schedule, for continuing a sequence across adjacent blocks */
  startIndex?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(text);
  const frameRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setDisplay(text);
      return;
    }

    setDisplay(scrambleAll(text));

    const chars = text.split("");
    const effectiveSpeed = speed ?? Math.min(90, Math.max(10, 1500 / chars.length));
    let flickerAt = 0;

    const tick = (start: number) => (now: number) => {
      const elapsed = now - start;
      const shouldFlicker = now - flickerAt > 45;
      if (shouldFlicker) flickerAt = now;

      let resolved = true;
      const next: (string | null)[] = chars.map((ch, i) => {
        if (ch === " ") return " ";
        const resolveAt = (startIndex + i) * effectiveSpeed;
        if (elapsed >= resolveAt) return ch;
        resolved = false;
        return shouldFlicker ? randomGlyph() : null;
      });

      setDisplay((prev) => {
        const prevChars = prev.split("");
        return next.map((c, i) => c ?? prevChars[i] ?? randomGlyph()).join("");
      });

      if (!resolved) {
        frameRef.current = requestAnimationFrame(tick(start));
      } else {
        setDisplay(text);
      }
    };

    timeoutRef.current = setTimeout(() => {
      frameRef.current = requestAnimationFrame(tick(performance.now()));
    }, startDelay);

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [text, startDelay, speed, startIndex]);

  return (
    <span className={`relative inline-grid align-baseline ${className ?? ""}`} aria-label={text}>
      <span aria-hidden="true" className="invisible col-start-1 row-start-1">
        {text}
      </span>
      <span aria-hidden="true" className="col-start-1 row-start-1">
        {display}
      </span>
    </span>
  );
}
