"use client";

import { useEffect, useRef } from "react";

/**
 * Subtle scroll parallax — the "responds as I scroll" feel, kept crash-safe.
 *
 * Design (the guardrails that matter):
 *  - ONE shared scroll/resize listener for ALL parallax elements (not one per
 *    element), throttled with requestAnimationFrame → at most one layout pass
 *    per frame regardless of how many elements register.
 *  - Writes only `transform: translate3d(0, …, 0)` — GPU-cheap, no layout, no
 *    blur, no continuous keyframe (so it doesn't touch the ambient-motion cap).
 *  - Movement is capped (default ±12px) and driven purely by scroll position,
 *    so when the page is still, nothing animates and the CPU idles.
 *  - Fully disabled under prefers-reduced-motion (no transform written at all).
 *  - Elements far from the viewport are skipped, so off-screen work is ~zero.
 *
 * Usage: `const ref = useParallax(0.06)` then spread `ref` onto the element.
 * `speed` is the fraction of the element's scroll offset to translate by
 * (0.04–0.10 reads as gentle depth). Negative moves the other way.
 */

type Entry = { el: HTMLElement; speed: number; max: number };

let registry: Entry[] = [];
let ticking = false;
let listening = false;

function reduced() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function update() {
  ticking = false;
  const vh = window.innerHeight;
  for (const { el, speed, max } of registry) {
    const rect = el.getBoundingClientRect();
    // Skip anything comfortably off-screen — no work when not visible.
    if (rect.bottom < -vh || rect.top > vh * 2) continue;
    // Distance of the element's center from the viewport center, normalized.
    const center = rect.top + rect.height / 2;
    const offset = (center - vh / 2) * speed;
    const clamped = Math.max(-max, Math.min(max, offset));
    el.style.transform = `translate3d(0, ${clamped.toFixed(2)}px, 0)`;
  }
}

function onScroll() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(update);
}

function ensureListening() {
  if (listening) return;
  listening = true;
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll, { passive: true });
}

export function useParallax<T extends HTMLElement = HTMLDivElement>(
  speed = 0.06,
  max = 12,
) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || reduced()) return;

    const entry: Entry = { el, speed, max };
    registry.push(entry);
    ensureListening();
    onScroll(); // position once on mount

    return () => {
      registry = registry.filter((e) => e !== entry);
      el.style.transform = "";
      if (registry.length === 0 && listening) {
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("resize", onScroll);
        listening = false;
      }
    };
  }, [speed, max]);

  return ref;
}
