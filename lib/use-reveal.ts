"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Scroll-reveal hook (UX Bible §3). Toggles visibility once when the element
 * crosses ~15% into view. Reveals immediately for reduced-motion users (and
 * for the `#showall` screenshot-QA hash).
 */
export function useReveal<T extends HTMLElement = HTMLDivElement>(
  options?: IntersectionObserverInit,
) {
  const ref = useRef<T>(null);
  // Lazy initializer runs once on mount — no synchronous setState in an effect.
  const [visible, setVisible] = useState(() => {
    if (typeof window === "undefined") return false;
    return (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.location.hash === "#showall"
    );
  });

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -8% 0px", ...options },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [visible, options]);

  return { ref, visible };
}
