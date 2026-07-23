"use client";

import { useParallax } from "@/lib/use-parallax";

/**
 * ParallaxLayer — a client wrapper that applies the shared scroll-parallax to
 * its children. Lets otherwise-server sections (hero, features) opt a decorative
 * layer into subtle scroll movement without turning the whole section client.
 *
 * `speed`/`max` are passed through to useParallax (transform-only, capped,
 * reduced-motion-safe, one shared listener). `aria-hidden` is on by default
 * since these are decorative motif layers.
 */
export function ParallaxLayer({
  children,
  speed,
  max,
  className,
  ariaHidden = true,
}: {
  children: React.ReactNode;
  speed?: number;
  max?: number;
  className?: string;
  ariaHidden?: boolean;
}) {
  // NOTE: deliberately NO `will-change` — leaving it on idle elements creates
  // permanent GPU layers (one of the original crash causes). translate3d already
  // promotes during the scroll frames, which is enough.
  const ref = useParallax<HTMLDivElement>(speed, max);
  return (
    <div ref={ref} aria-hidden={ariaHidden} className={className}>
      {children}
    </div>
  );
}
