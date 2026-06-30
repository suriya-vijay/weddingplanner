"use client";

import { useReveal } from "@/lib/use-reveal";
import { cn } from "@/lib/utils";

/**
 * Declarative scroll-reveal wrapper (UX Bible §3).
 * Fades + rises into view; `delay` (ms) supports per-item staggering.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = "div",
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  as?: React.ElementType;
}) {
  const { ref, visible } = useReveal();
  return (
    <Tag
      ref={ref}
      className={cn("reveal", visible && "is-visible", className)}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Tag>
  );
}
