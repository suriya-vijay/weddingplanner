"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

/**
 * Wraps a section that contains ambient motion (.ambient-spin / .ambient-glow).
 * Toggles `.in-view` ONLY while the section is on-screen, so the animation
 * pauses (zero GPU) the moment it scrolls out of view. This is the safety
 * mechanism that lets us have continuous motion without the old crash.
 *
 * Reduced-motion users get no animation at all (handled in CSS).
 */
export function AmbientZone({
  children,
  className,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { rootMargin: "0px", threshold: 0 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={cn(inView && "in-view", className)}>
      {children}
    </Tag>
  );
}
